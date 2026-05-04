// leoids_system.js

export function createLeoidsSystem({
  getState,
  saveState,
  getMap,
  showModal,
  closeModal,
  showActionButton,
  refreshAllPinMarkers,
  speakText,
  $,
}) {
  const DEFAULT_ROUND_SECONDS = 1200;
  const DEFAULT_HUNTER_DELAY_SECONDS = 120;
  const DEFAULT_BOUNDARY_RADIUS = 200;
  const DEFAULT_BASE_RADIUS = 15;
  const DEFAULT_TAG_RADIUS = 10;

  const leoidsState = {
    active: false,
    role: "runner",
    status: "free",

    onlineEnabled: false,
    onlineSessionId: null,
    onlinePlayerId: null,
    onlinePlayerName: null,
    onlineSyncStarted: false,
    gpsWatchId: null,
    lastOnlinePositionSyncAt: 0,

    roundTime: DEFAULT_ROUND_SECONDS,
    timeLeft: DEFAULT_ROUND_SECONDS,

    hunterDelay: DEFAULT_HUNTER_DELAY_SECONDS,
    hunterDelayLeft: DEFAULT_HUNTER_DELAY_SECONDS,
    huntersReleased: false,

    boundaryMode: "circle",
    boundaryRadius: DEFAULT_BOUNDARY_RADIUS,
    boundaryCenter: null,
    boundaryPoints: [],

    basePoint: null,
    pendingBasePoint: null,
    baseRadius: DEFAULT_BASE_RADIUS,
    tagRadius: DEFAULT_TAG_RADIUS,
    lastRescueAt: 0,
    runnerVisibilityMode: "always",
    runnerVisibleSeconds: 5,
    runnerHiddenSeconds: 55,
    
    mapMode: "none",

    players: [
      {
        id: "p1",
        name: "You",
        avatar: "🧍",
        role: "runner",
        status: "free",
        isAI: false,
        isOnline: false,
        isLocal: true,
        score: 0,
        coins: 0,
        position: null,
        jailedAtBase: false,
      },
      {
        id: "ai_hunter_1",
        name: "AI Hunter",
        role: "hunter",
        status: "free",
        isAI: true,
        isOnline: false,
        isLocal: false,
        score: 0,
        coins: 0,
        position: null,
        jailedAtBase: false,
      },
      {
        id: "ai_runner_1",
        name: "AI Runner",
        role: "runner",
        status: "free",
        isAI: true,
        isOnline: false,
        isLocal: false,
        score: 0,
        coins: 0,
        position: null,
        jailedAtBase: false,
      },
    ],

    boundaryLayer: null,
    boundaryMarker: null,
    polygonLayer: null,
    polygonPointMarkers: [],
    baseLayer: null,
    baseMarker: null,
    playerMarkers: [],
    mapClickHandler: null,

    score: 0,
    coins: 0,
    startedAt: null,
    endedAt: null,
    intervalId: null,
    aiIntervalId: null,
  };

  function formatTime(seconds = 0) {
    const safe = Math.max(0, Number(seconds || 0));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function getMapSafe() {
    return getMap?.() || null;
  }

  function getSupabaseSafe() {
    return window.LEOIDSSupabase || null;
  }

  function isPointInsideBoundary(point) {
    if (!point) return false;

    if (leoidsState.boundaryMode === "circle") {
      if (!leoidsState.boundaryCenter) return false;

      return (
        distanceMeters(point, leoidsState.boundaryCenter) <=
        Number(leoidsState.boundaryRadius || DEFAULT_BOUNDARY_RADIUS)
      );
    }

    if (leoidsState.boundaryMode === "polygon") {
      if (!leoidsState.boundaryPoints.length || leoidsState.boundaryPoints.length < 3) {
        return false;
      }

      let inside = false;
      const x = Number(point.lng);
      const y = Number(point.lat);

      for (
        let i = 0, j = leoidsState.boundaryPoints.length - 1;
        i < leoidsState.boundaryPoints.length;
        j = i++
      ) {
        const xi = Number(leoidsState.boundaryPoints[i].lng);
        const yi = Number(leoidsState.boundaryPoints[i].lat);
        const xj = Number(leoidsState.boundaryPoints[j].lng);
        const yj = Number(leoidsState.boundaryPoints[j].lat);

        const intersect =
          yi > y !== yj > y &&
          x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.0000001) + xi;

        if (intersect) inside = !inside;
      }

      return inside;
    }

    return false;
  }

  function getDistanceToCircleEdge(point) {
    if (!point || !leoidsState.boundaryCenter) return Infinity;

    const distanceFromCenter = distanceMeters(point, leoidsState.boundaryCenter);
    return Number(leoidsState.boundaryRadius || DEFAULT_BOUNDARY_RADIUS) - distanceFromCenter;
  }

function checkBoundaryRules() {
  if (!leoidsState.active) return;
  if (!hasValidBoundary()) return;

  const now = Date.now();

  leoidsState.players.forEach((player) => {
    if (!player.position) return;
    if (player.status === "jailed") return;

    player.lastBoundaryWarningAt = player.lastBoundaryWarningAt || 0;
    player.lastBoundaryPenaltyAt = player.lastBoundaryPenaltyAt || 0;

    const inside = isPointInsideBoundary(player.position);

    if (!inside) {
      if (now - player.lastBoundaryPenaltyAt > 9000) {
        player.lastBoundaryPenaltyAt = now;

        player.score = Math.max(0, Number(player.score || 0) - 25);

        if (player.isLocal || !player.isOnline) {
          leoidsState.score = Math.max(0, Number(leoidsState.score || 0) - 25);
        }

        showLeoidsEvent(
          "OUT OF BOUNDS",
          `${player.name} left the game area.\n-25 points`,
          "⚠️",
          "danger"
        );

        if (navigator.vibrate && (player.isLocal || player.id === getLocalPlayer()?.id)) {
          navigator.vibrate([120, 80, 120]);
        }

        speakText?.(`${player.name} is out of bounds. Twenty five points deducted.`);
      }

      return;
    }

    if (leoidsState.boundaryMode === "circle") {
      const edgeDistance = getDistanceToCircleEdge(player.position);

      if (edgeDistance <= 25 && now - player.lastBoundaryWarningAt > 12000) {
        player.lastBoundaryWarningAt = now;

        showLeoidsEvent(
          "BOUNDARY WARNING",
          `${player.name} is close to the edge.\nMove back inside the play zone.`,
          "🟡",
          "base"
        );

        if (navigator.vibrate && (player.isLocal || player.id === getLocalPlayer()?.id)) {
          navigator.vibrate(90);
        }

        speakText?.(`${player.name}, warning. You are close to the boundary.`);
      }
    }
  });

  renderPlayers();
  updatePanel();
  updateLeoidsBattleHud?.();
}

  function distanceMeters(a, b) {
    if (!a || !b) return Infinity;

    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(Number(b.lat) - Number(a.lat));
    const dLng = toRad(Number(b.lng) - Number(a.lng));

    const lat1 = toRad(Number(a.lat));
    const lat2 = toRad(Number(b.lat));

    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
  }

  function getLocalPlayer() {
    if (leoidsState.onlinePlayerId) {
      const onlineLocal = leoidsState.players.find((p) => p.id === leoidsState.onlinePlayerId);
      if (onlineLocal) return onlineLocal;
    }

    return leoidsState.players.find((p) => p.isLocal) ||
      leoidsState.players.find((p) => !p.isAI && !p.isOnline) ||
      leoidsState.players[0];
  }

 function getPlayerIcon(player) {
  if (player?.avatar) return player.avatar;
  if (player.status === "jailed") return "🔒";
  if (player.role === "hunter") return player.isAI ? "🔴" : "🟥";
  return player.isAI ? "🔵" : "🟦";
}

  function getBoundaryCentreFallback() {
    const map = getMapSafe();

    if (leoidsState.boundaryCenter) return leoidsState.boundaryCenter;
    if (leoidsState.boundaryPoints.length) return leoidsState.boundaryPoints[0];

    if (map) {
      const c = map.getCenter();
      return { lat: Number(c.lat), lng: Number(c.lng) };
    }

    return { lat: 54.11371, lng: -3.218448 };
  }

  function randomNearbyPoint(center, radiusMeters = 40) {
    const safeCenter = center || getBoundaryCentreFallback();
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radiusMeters;

    const latOffset = (Math.cos(angle) * distance) / 111000;
    const lngOffset =
      (Math.sin(angle) * distance) /
      (111000 * Math.cos((safeCenter.lat * Math.PI) / 180));

    return {
      lat: Number(safeCenter.lat) + latOffset,
      lng: Number(safeCenter.lng) + lngOffset,
    };
  }

  function seedPlayerPositions() {
    const center = getBoundaryCentreFallback();

    leoidsState.players.forEach((player, index) => {
      if (player.isOnline && !player.isLocal) return;

      if (!player.position) {
        player.position = randomNearbyPoint(center, 35 + index * 15);
      }
    });

    drawPlayerMarkers();
  }

 function normaliseOnlinePlayer(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.display_name || row.name || "Online Player",
    avatar: row.avatar || "🧍",
    role: row.role || "runner",
    status: row.status || "free",
    isAI: false,
    isOnline: true,
    isLocal: row.id === leoidsState.onlinePlayerId,
    score: Number(row.score || 0),
    coins: Number(row.coins || 0),
    position:
      row.lat !== null &&
      row.lat !== undefined &&
      row.lng !== null &&
      row.lng !== undefined
        ? {
            lat: Number(row.lat),
            lng: Number(row.lng),
          }
        : null,
    jailedAtBase: row.status === "jailed",
    lastSeen: row.last_seen || null,
  };
}

  function upsertOnlinePlayer(row) {
    const onlinePlayer = normaliseOnlinePlayer(row);
    if (!onlinePlayer || !onlinePlayer.id) return null;

    let existing = leoidsState.players.find((p) => p.id === onlinePlayer.id);

    if (!existing) {
      existing = onlinePlayer;
      leoidsState.players.push(existing);
    } else {
      existing.name = onlinePlayer.name;
      existing.avatar = onlinePlayer.avatar;
      existing.role = onlinePlayer.role;
      existing.status = onlinePlayer.status;
      existing.isAI = false;
      existing.isOnline = true;
      existing.isLocal = onlinePlayer.isLocal;
      existing.score = onlinePlayer.score;
      existing.coins = onlinePlayer.coins;
      existing.jailedAtBase = onlinePlayer.jailedAtBase;
      existing.lastSeen = onlinePlayer.lastSeen;

      if (onlinePlayer.position) {
        existing.position = onlinePlayer.position;
      }
    }

    if (existing.isLocal) {
      leoidsState.role = existing.role;
      leoidsState.status = existing.status;
      leoidsState.score = Number(existing.score || 0);
      leoidsState.coins = Number(existing.coins || 0);
    }

    return existing;
  }

  function removeOnlinePlayer(playerId) {
    if (!playerId) return;

    leoidsState.players = leoidsState.players.filter((player) => {
      if (player.id === playerId && player.isOnline && !player.isLocal) {
        return false;
      }

      return true;
    });

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();
  }

  function applyOnlinePlayerPayload(payload) {
    if (!payload) return;

    if (payload.eventType === "DELETE") {
      removeOnlinePlayer(payload.old?.id);
      return;
    }

    const player = payload.new;
    if (!player) return;

    upsertOnlinePlayer(player);

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();
  }

  async function loadOnlinePlayers() {
    const supabase = getSupabaseSafe();

    if (!supabase || typeof supabase.loadPlayers !== "function") {
      console.warn("LEOIDS Supabase loadPlayers not available.");
      return [];
    }

    const rows = await supabase.loadPlayers();

    rows.forEach((row) => {
      upsertOnlinePlayer(row);
    });

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();

    return rows;
  }

async function createOnlineSession(name = "Barrow LEOIDS Online Session") {
  const supabase = getSupabaseSafe();

  if (!supabase) {
    console.warn("LEOIDS Supabase module not loaded.");
    speakText?.("Supabase is not loaded.");
    return null;
  }

  if (!supabase.client && typeof supabase.init === "function") {
    supabase.init();
  }

  const session = await supabase.createSession(name, {
    hostName: leoidsState.onlinePlayerName || supabase.playerName || "Host",
    maxPlayers: 12,
    isPublic: true,
    roundTime: leoidsState.roundTime,
    hunterDelay: leoidsState.hunterDelay,
    baseRadius: leoidsState.baseRadius,
    tagRadius: leoidsState.tagRadius,
    countdownSeconds: leoidsState.countdownSeconds || 60,
  });

  if (!session) {
    speakText?.("Could not create online session.");
    return null;
  }

  leoidsState.onlineEnabled = true;
  leoidsState.onlineSessionId = session.id;
  leoidsState.isLobbyHost = true;

  supabase.sessionId = session.id;

  await saveOnlineSessionConfig();

  startOnlineSessionSync();
  updatePanel();

  speakText?.("Online LEOIDS session created. You are the host.");

  return session;
}

  function startOnlinePlayerSync() {
    const supabase = getSupabaseSafe();

    if (!supabase) {
      console.warn("LEOIDS Supabase module not loaded.");
      return false;
    }

    if (!supabase.sessionId && leoidsState.onlineSessionId) {
      supabase.sessionId = leoidsState.onlineSessionId;
    }

    if (!supabase.sessionId) {
      console.warn("No online session selected.");
      return false;
    }

    if (typeof supabase.subscribeToPlayers !== "function") {
      console.warn("LEOIDS Supabase subscribeToPlayers not available.");
      return false;
    }

    supabase.subscribeToPlayers((payload) => {
      applyOnlinePlayerPayload(payload);
    });

    leoidsState.onlineEnabled = true;
    leoidsState.onlineSessionId = supabase.sessionId;
    leoidsState.onlineSyncStarted = true;

    loadOnlinePlayers();

    console.log("LEOIDS online player sync started.");
    speakText?.("Online player sync started.");

    return true;
  }

async function joinOnlineSession({
  sessionId,
  displayName = "Player",
  role = leoidsState.role || "runner",
} = {}) {
  const supabase = getSupabaseSafe();

  if (!supabase) {
    console.warn("LEOIDS Supabase module not loaded.");
    speakText?.("Supabase is not loaded.");
    return null;
  }

  if (!supabase.client && typeof supabase.init === "function") {
    supabase.init();
  }

  const safeSessionId = sessionId || supabase.sessionId || leoidsState.onlineSessionId;

  if (!safeSessionId) {
    speakText?.("Create or enter an online session first.");
    return null;
  }

  supabase.sessionId = safeSessionId;
  supabase.playerName = displayName;

  const player = await supabase.joinSession({
    sessionId: safeSessionId,
    displayName,
    role,
  });

  if (!player) {
    speakText?.("Could not join online session.");
    return null;
  }

  leoidsState.onlineEnabled = true;
  leoidsState.onlineSessionId = safeSessionId;
  leoidsState.onlinePlayerId = player.id;
  leoidsState.onlinePlayerName = displayName;
  leoidsState.role = role;
  leoidsState.status = player.status || "free";

  supabase.playerId = player.id;

  leoidsState.players = leoidsState.players.filter(
    (p) => p.id !== "p1" && !p.isAI
  );

  upsertOnlinePlayer(player);

  await loadAndApplyOnlineSession();
  await loadOnlinePlayers();

  startOnlinePlayerSync();
  startOnlineSessionSync();

  renderPlayers();
  drawPlayerMarkers();
  updatePanel();
  updateLeoidsBattleHud?.();

  speakText?.(`${displayName} joined online LEOIDS as ${role}.`);

  return player;
}

  
  async function stopOnlinePlayerSync() {
    const supabase = getSupabaseSafe();

    stopGpsOnlineSync();

    if (supabase?.playersChannel && supabase.client) {
      try {
        await supabase.client.removeChannel(supabase.playersChannel);
      } catch {}

      supabase.playersChannel = null;
    }

    leoidsState.onlineSyncStarted = false;
    updatePanel();

    console.log("LEOIDS online player sync stopped.");
  }

  async function syncLocalPlayerPosition(position, accuracy = null, heading = null) {
    const supabase = getSupabaseSafe();
    const local = getLocalPlayer();

    if (!supabase || !position) return false;
    if (!supabase.playerId && leoidsState.onlinePlayerId) {
      supabase.playerId = leoidsState.onlinePlayerId;
    }

    if (!supabase.playerId) return false;

    const point = {
      lat: Number(position.lat),
      lng: Number(position.lng),
    };

    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) {
      return false;
    }

    if (local) {
      local.position = point;
    }

    leoidsState.lastOnlinePositionSyncAt = Date.now();

    if (typeof supabase.updatePosition === "function") {
      await supabase.updatePosition(point.lat, point.lng, accuracy, heading);
    } else if (typeof supabase.syncMyPosition === "function") {
      await supabase.syncMyPosition(point.lat, point.lng, accuracy, heading);
    }

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();

    return true;
  }

  function startGpsOnlineSync() {
    if (!navigator.geolocation) {
      speakText?.("GPS is not available on this device.");
      return false;
    }

    if (!leoidsState.onlineEnabled) {
      speakText?.("Join an online LEOIDS session first.");
      return false;
    }

    stopGpsOnlineSync();

    leoidsState.gpsWatchId = navigator.geolocation.watchPosition(
      async (position) => {
        const now = Date.now();

        if (now - leoidsState.lastOnlinePositionSyncAt < 2000) {
          return;
        }

        const point = {
          lat: Number(position.coords.latitude),
          lng: Number(position.coords.longitude),
        };

        await syncLocalPlayerPosition(
          point,
          Number(position.coords.accuracy || 0),
          position.coords.heading
        );
      },
      (error) => {
        console.warn("LEOIDS GPS sync error:", error);
        speakText?.("GPS sync error.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 12000,
      }
    );

    speakText?.("Online GPS sync started.");
    return true;
  }

  function stopGpsOnlineSync() {
    if (leoidsState.gpsWatchId !== null && navigator.geolocation) {
      try {
        navigator.geolocation.clearWatch(leoidsState.gpsWatchId);
      } catch {}
    }

    leoidsState.gpsWatchId = null;
  }

  function enterBattleMap() {
  showActionButton?.(false);

  const mapEl = $("map");
  if (mapEl) {
    mapEl.classList.add("leoids-battle-map");
  }

  const menuBtn = $("leoids-menu-btn");
  if (menuBtn) {
    menuBtn.classList.remove("hidden");
    menuBtn.innerText = "⚡";
    menuBtn.title = "LEOIDS Command Hub";

    menuBtn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleLeoidsCommandHub();
    };
  }

  refreshAllPinMarkers?.();
  redrawAllMapObjects();
  showLeoidsBattleHud?.();
  updatePanel();
}


  function exitBattleMap() {
  stopTimer();
  stopAI();
  stopGpsOnlineSync();
  disableMapPointAdding();
  hideLeoidsMapControls();
  hideLeoidsBattleHud?.();
  hideLeoidsCommandHub?.();
  clearAllMapObjects();

  leoidsState.mapMode = "none";
  leoidsState.pendingBasePoint = null;

  const mapEl = $("map");
  if (mapEl) {
    mapEl.classList.remove("leoids-battle-map");
  }

  const menuBtn = $("leoids-menu-btn");
  if (menuBtn) {
    menuBtn.classList.add("hidden");
    menuBtn.onclick = null;
  }

  refreshAllPinMarkers?.();
}


function openSetupPanel() {
  enterBattleMap();
  hideLeoidsBattleHud();

  disableMapPointAdding();
  hideLeoidsMapControls();
  leoidsState.mapMode = "none";

  if ($("leoids-round-length")) {
    $("leoids-round-length").value = String(leoidsState.roundTime);
  }

  if ($("leoids-hunter-delay")) {
    $("leoids-hunter-delay").value = String(leoidsState.hunterDelay);
  }

  if ($("leoids-boundary-size")) {
    $("leoids-boundary-size").value = String(leoidsState.boundaryRadius);
  }

  if ($("leoids-base-radius")) {
    $("leoids-base-radius").value = String(leoidsState.baseRadius);
  }

  if ($("leoids-tag-radius")) {
    $("leoids-tag-radius").value = String(leoidsState.tagRadius);
  }

  refreshBoundaryButtons();
  renderPlayers();
  updatePanel();

  showModal?.("leoids-modal");
  hideLeoidsBattleHud();

  wirePanelButtons();
  maybeShowFirstTimeLeoidsInstructions();
}

 function closeSetupPanel() {
  closeModal?.("leoids-modal");

  if (leoidsState.mapMode === "boundary" || leoidsState.mapMode === "base") {
    enableMapPointAdding();
    hideLeoidsBattleHud();
    return;
  }

  showLeoidsBattleHud();
}

  function setRole(role = "runner") {
    leoidsState.role = role === "hunter" ? "hunter" : "runner";

    const local = getLocalPlayer();
    if (local) {
      local.role = leoidsState.role;
      local.status = "free";
      local.jailedAtBase = false;
    }

    $("btn-leoids-runner")?.classList.toggle(
      "active",
      leoidsState.role === "runner"
    );

    $("btn-leoids-hunter")?.classList.toggle(
      "active",
      leoidsState.role === "hunter"
    );

    renderPlayers();
    drawPlayerMarkers();
    updatePanel();

    speakText?.(
      leoidsState.role === "hunter" ? "Hunter selected." : "Runner selected."
    );
  }

  function refreshBoundaryButtons() {
  const isCircle = leoidsState.boundaryMode === "circle";
  const isPolygon = leoidsState.boundaryMode === "polygon";
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  $("btn-leoids-boundary-circle")?.classList.toggle("active", isCircle);
  $("btn-leoids-boundary-polygon")?.classList.toggle("active", isPolygon);

  const show = (id, display = "block") => {
    const el = $(id);
    if (el) el.style.display = display;
  };

  const hide = (id) => {
    const el = $(id);
    if (el) el.style.display = "none";
  };

  if (!isHost) {
    hide("btn-leoids-set-boundary");
    hide("btn-leoids-add-point");
    hide("btn-leoids-undo-point");
    hide("btn-leoids-confirm-boundary");
    hide("btn-leoids-clear-boundary");
    hide("btn-leoids-set-base");
    return;
  }

  if (isCircle) {
    show("btn-leoids-set-boundary");
    hide("btn-leoids-add-point");
    hide("btn-leoids-undo-point");
    hide("btn-leoids-confirm-boundary");
  }

  if (isPolygon) {
    hide("btn-leoids-set-boundary");
    show("btn-leoids-add-point");
    show("btn-leoids-undo-point");
    show("btn-leoids-confirm-boundary");
  }

  show("btn-leoids-clear-boundary");
  show("btn-leoids-set-base");
}

  function setBoundaryMode(mode = "circle", announce = true) {
    leoidsState.boundaryMode = mode === "polygon" ? "polygon" : "circle";
    refreshBoundaryButtons();
    updatePanel();

    if (leoidsState.boundaryMode === "polygon") {
      leoidsState.mapMode = "boundary";
      leoidsState.pendingBasePoint = null;

      closeModal?.("leoids-modal");
      showActionButton?.(false);
      showLeoidsMapControls("boundary");
      enableMapPointAdding();

      speakText?.("Street boundary mode. Tap the map to add boundary points.");
      return;
    }

    leoidsState.mapMode = "none";
    leoidsState.pendingBasePoint = null;

    disableMapPointAdding();
    hideLeoidsMapControls();
    showActionButton?.(false);

    if (announce) {
      speakText?.("Circle boundary mode.");
    }
  }

  function showLeoidsMapControls(mode = "boundary") {
    hideLeoidsMapControls();

    const controls = document.createElement("div");
    controls.id = "leoids-map-controls";

    controls.style.position = "fixed";
    controls.style.left = "50%";
    controls.style.bottom = "112px";
    controls.style.transform = "translateX(-50%)";
    controls.style.zIndex = "999999";
    controls.style.width = "min(92vw, 420px)";
    controls.style.display = "grid";
    controls.style.gap = "8px";
    controls.style.pointerEvents = "auto";

    if (mode === "boundary") {
      controls.innerHTML = `
        <button id="btn-leoids-map-confirm-boundary" type="button" style="min-height:48px;border-radius:16px;background:#ffd54a;color:#111;font-weight:900;">
          CONFIRM BOUNDARY
        </button>
        <button id="btn-leoids-map-undo" type="button" style="min-height:44px;border-radius:16px;background:#111827;color:#fff;font-weight:900;">
          UNDO POINT
        </button>
        <button id="btn-leoids-map-back" type="button" style="min-height:44px;border-radius:16px;background:#202a3c;color:#fff;font-weight:900;">
          BACK TO SETUP
        </button>
      `;
    } else {
      controls.innerHTML = `
        <button id="btn-leoids-map-confirm-base" type="button" style="min-height:48px;border-radius:16px;background:#ffd54a;color:#111;font-weight:900;">
          CONFIRM JAIL / BASE
        </button>
        <button id="btn-leoids-map-back" type="button" style="min-height:44px;border-radius:16px;background:#202a3c;color:#fff;font-weight:900;">
          BACK TO SETUP
        </button>
      `;
    }

    document.body.appendChild(controls);

    document
      .getElementById("btn-leoids-map-confirm-boundary")
      ?.addEventListener("click", confirmBoundaryFromMap);

    document
      .getElementById("btn-leoids-map-confirm-base")
      ?.addEventListener("click", confirmBaseFromMap);

    document.getElementById("btn-leoids-map-undo")?.addEventListener("click", () => {
      undoStreetBoundaryPoint();
      showLeoidsMapControls("boundary");
    });

    document
      .getElementById("btn-leoids-map-back")
      ?.addEventListener("click", backToLeoidsPanelFromMap);
  }

  function hideLeoidsMapControls() {
    const controls = $("leoids-map-controls");
    if (controls) controls.remove();
  }

  function enableMapPointAdding() {
    const map = getMapSafe();
    if (!map) return;

    disableMapPointAdding();

    leoidsState.mapClickHandler = (event) => {
      const point = {
        lat: Number(event.latlng.lat),
        lng: Number(event.latlng.lng),
      };

      if (leoidsState.mapMode === "boundary") {
        leoidsState.boundaryMode = "polygon";
        leoidsState.boundaryCenter = null;
        leoidsState.boundaryPoints.push(point);

        clearCircleBoundary();
        drawPolygonBoundary();
        showLeoidsMapControls("boundary");
        updatePanel();

        speakText?.(`Boundary point ${leoidsState.boundaryPoints.length} added.`);
        return;
      }

      if (leoidsState.mapMode === "base") {
        leoidsState.pendingBasePoint = point;
        leoidsState.basePoint = point;
        window.__leoidsBasePoint = point;

        drawBasePoint(point, leoidsState.baseRadius);
        showLeoidsMapControls("base");
        updatePanel();

        speakText?.("Base selected. Press confirm jail base.");
      }
    };

    map.on("click", leoidsState.mapClickHandler);
  }

  function disableMapPointAdding() {
    const map = getMapSafe();
    if (!map || !leoidsState.mapClickHandler) return;

    try {
      map.off("click", leoidsState.mapClickHandler);
    } catch {}

    leoidsState.mapClickHandler = null;
  }

  function setRoundLength(seconds = DEFAULT_ROUND_SECONDS) {
    leoidsState.roundTime = Number(seconds || DEFAULT_ROUND_SECONDS);
    leoidsState.timeLeft = leoidsState.roundTime;
    updatePanel();
  }

  function setHunterDelay(seconds = DEFAULT_HUNTER_DELAY_SECONDS) {
    leoidsState.hunterDelay = Number(seconds || DEFAULT_HUNTER_DELAY_SECONDS);
    leoidsState.hunterDelayLeft = leoidsState.hunterDelay;
    updatePanel();
  }

  function setBoundaryRadius(radius = DEFAULT_BOUNDARY_RADIUS) {
    leoidsState.boundaryRadius = Number(radius || DEFAULT_BOUNDARY_RADIUS);

    if (leoidsState.boundaryCenter) {
      drawCircleBoundary(leoidsState.boundaryCenter, leoidsState.boundaryRadius);
    }

    updatePanel();
  }

  function setBaseRadius(radius = DEFAULT_BASE_RADIUS) {
    leoidsState.baseRadius = Number(radius || DEFAULT_BASE_RADIUS);

    if (leoidsState.basePoint) {
      drawBasePoint(leoidsState.basePoint, leoidsState.baseRadius);
    }

    updatePanel();
  }

  function setTagRadius(radius = DEFAULT_TAG_RADIUS) {
    leoidsState.tagRadius = Number(radius || DEFAULT_TAG_RADIUS);
    updatePanel();
  }

  function setCircleBoundaryHere() {
    const map = getMapSafe();
    if (!map) return;

    const center = map.getCenter();

    leoidsState.boundaryMode = "circle";
    leoidsState.boundaryCenter = {
      lat: Number(center.lat),
      lng: Number(center.lng),
    };

    leoidsState.boundaryPoints = [];
    leoidsState.mapMode = "none";

    clearPolygonBoundary();
    drawCircleBoundary(leoidsState.boundaryCenter, leoidsState.boundaryRadius);
    refreshBoundaryButtons();
    seedPlayerPositions();
    updatePanel();

    speakText?.("Circle boundary set.");
  }

  function addStreetBoundaryPointHere() {
    const map = getMapSafe();
    if (!map) return;

    const center = map.getCenter();

    leoidsState.boundaryMode = "polygon";
    leoidsState.boundaryCenter = null;

    leoidsState.boundaryPoints.push({
      lat: Number(center.lat),
      lng: Number(center.lng),
    });

    clearCircleBoundary();
    drawPolygonBoundary();
    refreshBoundaryButtons();
    updatePanel();

    speakText?.(`Boundary point ${leoidsState.boundaryPoints.length} added.`);
  }

  function undoStreetBoundaryPoint() {
    if (!leoidsState.boundaryPoints.length) {
      speakText?.("No boundary point to remove.");
      return;
    }

    leoidsState.boundaryPoints.pop();
    drawPolygonBoundary();
    updatePanel();
    speakText?.("Last boundary point removed.");
  }

 async function confirmBoundaryFromMap() {
  if (!hasValidBoundary()) {
    alert("Street boundary needs at least 3 points.");
    speakText?.("Street boundary needs at least three points.");
    showLeoidsMapControls("boundary");
    return;
  }

  leoidsState.mapMode = "none";
  leoidsState.pendingBasePoint = null;

  disableMapPointAdding();
  hideLeoidsMapControls();
  seedPlayerPositions();
  showActionButton?.(false);

  await saveOnlineSessionConfig();

  openSetupPanel();

  speakText?.("Boundary confirmed.");
}

 async function confirmBaseFromMap() {
  const map = getMapSafe();

  let point =
    leoidsState.pendingBasePoint ||
    leoidsState.basePoint ||
    window.__leoidsBasePoint ||
    null;

  if (!point && map) {
    const center = map.getCenter();
    point = {
      lat: Number(center.lat),
      lng: Number(center.lng),
    };
  }

  if (!point) {
    alert("Base could not be set. Tap the map again.");
    speakText?.("Base could not be set. Tap the map again.");
    showLeoidsMapControls("base");
    return;
  }

  leoidsState.basePoint = {
    lat: Number(point.lat),
    lng: Number(point.lng),
  };

  leoidsState.pendingBasePoint = null;
  leoidsState.mapMode = "none";
  window.__leoidsBasePoint = leoidsState.basePoint;

  drawBasePoint(leoidsState.basePoint, leoidsState.baseRadius);

  disableMapPointAdding();
  hideLeoidsMapControls();
  showActionButton?.(false);

  await saveOnlineSessionConfig();

  updatePanel();
  renderPlayers();
  drawPlayerMarkers();

  showModal?.("leoids-modal");

  speakText?.("Jail base confirmed.");
}

  function setBaseHere() {
    leoidsState.mapMode = "base";
    leoidsState.pendingBasePoint = null;

    closeModal?.("leoids-modal");
    showActionButton?.(false);
    showLeoidsMapControls("base");
    enableMapPointAdding();

    speakText?.("Tap the map where you want the jail base, then press confirm.");
  }

 
  function backToLeoidsPanelFromMap() {
    leoidsState.mapMode = "none";
    leoidsState.pendingBasePoint = null;

    disableMapPointAdding();
    hideLeoidsMapControls();
    showActionButton?.(false);

    openSetupPanel();

    speakText?.("Returned to LEOIDs setup.");
  }

 function drawCircleBoundary(center, radius) {
  const map = getMapSafe();
  if (!map || !center) return;

  clearCircleBoundary();

  leoidsState.boundaryLayer = L.circle([center.lat, center.lng], {
    radius: Number(radius || DEFAULT_BOUNDARY_RADIUS),
    color: "#ffb000",
    weight: 5,
    opacity: 0.95,
    fillColor: "#ffb000",
    fillOpacity: 0.08,
    dashArray: "12, 8",
  }).addTo(map);

  leoidsState.boundaryMarker = L.circleMarker([center.lat, center.lng], {
    radius: 7,
    color: "#ffffff",
    weight: 3,
    fillColor: "#ffb000",
    fillOpacity: 1,
  })
    .bindTooltip("LEOIDS Boundary Centre", {
      permanent: false,
      direction: "top",
    })
    .addTo(map);
}

function drawPolygonBoundary() {
  const map = getMapSafe();
  if (!map) return;

  clearPolygonBoundary();

  leoidsState.polygonPointMarkers = leoidsState.boundaryPoints.map(
    (point, index) =>
      L.circleMarker([point.lat, point.lng], {
        radius: 7,
        color: "#ffffff",
        weight: 3,
        fillColor: "#ffb000",
        fillOpacity: 1,
      })
        .bindTooltip(`Boundary Point ${index + 1}`, {
          permanent: false,
          direction: "top",
        })
        .addTo(map)
  );

  if (leoidsState.boundaryPoints.length >= 2) {
    const coords = leoidsState.boundaryPoints.map((p) => [p.lat, p.lng]);

    if (leoidsState.boundaryPoints.length >= 3) {
      leoidsState.polygonLayer = L.polygon(coords, {
        color: "#ffb000",
        weight: 5,
        opacity: 0.95,
        fillColor: "#ffb000",
        fillOpacity: 0.08,
        dashArray: "12, 8",
      }).addTo(map);
    } else {
      leoidsState.polygonLayer = L.polyline(coords, {
        color: "#ffb000",
        weight: 5,
        opacity: 0.95,
        dashArray: "12, 8",
      }).addTo(map);
    }
  }
}

function drawBasePoint(point, radius = leoidsState.baseRadius) {
  if (!point) return;

  const map = getMapSafe();
  if (!map) return;

  if (leoidsState.baseMarker) {
    map.removeLayer(leoidsState.baseMarker);
  }

  if (leoidsState.baseCircle) {
    map.removeLayer(leoidsState.baseCircle);
  }

  if (leoidsState.basePulseCircle) {
    map.removeLayer(leoidsState.basePulseCircle);
  }

  // MAIN BASE (JAIL)
  leoidsState.baseCircle = L.circle([point.lat, point.lng], {
    radius: radius,
    color: "#00d4ff",
    weight: 2,
    fillColor: "#00d4ff",
    fillOpacity: 0.18,
  }).addTo(map);

  // PULSE EFFECT (visual clarity)
  leoidsState.basePulseCircle = L.circle([point.lat, point.lng], {
    radius: radius,
    color: "#00d4ff",
    weight: 1,
    fillColor: "#00d4ff",
    fillOpacity: 0.08,
  }).addTo(map);

  let pulseSize = radius;

  if (leoidsState.basePulseInterval) {
    clearInterval(leoidsState.basePulseInterval);
  }

  leoidsState.basePulseInterval = setInterval(() => {
    pulseSize += 6;

    if (pulseSize > radius * 2.5) {
      pulseSize = radius;
    }

    if (leoidsState.basePulseCircle) {
      leoidsState.basePulseCircle.setRadius(pulseSize);
      leoidsState.basePulseCircle.setStyle({
        fillOpacity: 0.08 * (1 - pulseSize / (radius * 2.5)),
      });
    }
  }, 120);

  // BASE ICON MARKER
  leoidsState.baseMarker = L.marker([point.lat, point.lng], {
    icon: L.divIcon({
      className: "leoids-base-icon",
      html: `
        <div style="
          display:flex;
          align-items:center;
          justify-content:center;
          width:38px;
          height:38px;
          border-radius:50%;
          background:#00d4ff;
          color:#05070b;
          font-weight:1000;
          font-size:18px;
          box-shadow:0 0 18px #00d4ff;
        ">
          🏁
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    }),
  }).addTo(map);
}


function shouldShowPlayerOnMap(player) {
  if (!player) return false;

  const local = getLocalPlayer();

  if (!local) return true;

  // Always show yourself
  if (player.id === local.id) return true;

  // Always show hunters for now
  if (player.role === "hunter") return true;

  // Runner visibility rules
  if (player.role === "runner") {
    if (leoidsState.runnerVisibilityMode === "always") return true;

    if (leoidsState.runnerVisibilityMode === "hidden") return false;

    if (leoidsState.runnerVisibilityMode === "hunters_only") {
      return local.role === "hunter";
    }

    if (leoidsState.runnerVisibilityMode === "pulse") {
      const visibleSeconds = Number(leoidsState.runnerVisibleSeconds || 5);
      const hiddenSeconds = Number(leoidsState.runnerHiddenSeconds || 55);
      const cycle = visibleSeconds + hiddenSeconds;

      if (cycle <= 0) return false;

      const elapsed = Math.floor(Date.now() / 1000) % cycle;

      return elapsed < visibleSeconds;
    }
  }

  return true;
}

function setRunnerVisibilityMode(mode = "always") {
  const allowed = ["always", "pulse", "hidden", "hunters_only"];

  leoidsState.runnerVisibilityMode = allowed.includes(mode) ? mode : "always";

  drawPlayerMarkers();
  updatePanel();

  speakText?.(`Runner visibility set to ${leoidsState.runnerVisibilityMode}.`);
}

  
 function drawPlayerMarkers() {
  const map = getMapSafe();
  if (!map) return;

  leoidsState.playerMarkers.forEach((marker) => {
    try {
      map.removeLayer(marker);
    } catch {}
  });

  leoidsState.playerMarkers = [];

  leoidsState.players.forEach((player) => {
    if (!player.position) return;
    if (!shouldShowPlayerOnMap(player)) return;

    const isHunter = player.role === "hunter";
    const isJailed = player.status === "jailed";
    const isLocal = player.isLocal || player.id === leoidsState.onlinePlayerId;

    const color = isJailed ? "#8b8b8b" : isHunter ? "#ff3b3b" : "#22c55e";
    const emoji = getPlayerIcon(player);

    const marker = L.marker([player.position.lat, player.position.lng], {
      icon: L.divIcon({
        className: "leoids-player-icon",
        html: `
          <div style="
            width:${isLocal ? 40 : 34}px;
            height:${isLocal ? 40 : 34}px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            background:${color};
            border:${isLocal ? 4 : 3}px solid white;
            box-shadow:0 0 ${isLocal ? 22 : 14}px ${color};
            font-size:${isLocal ? 21 : 18}px;
            font-weight:900;
          ">
            ${emoji}
          </div>
        `,
        iconSize: [isLocal ? 40 : 34, isLocal ? 40 : 34],
        iconAnchor: [isLocal ? 20 : 17, isLocal ? 20 : 17],
      }),
    })
      .bindTooltip(
        `${emoji} ${player.name} • ${player.role} • ${player.status}`,
        {
          permanent: false,
          direction: "top",
        }
      )
      .addTo(map);

    marker.on("click", () => {
      handlePlayerMarkerTap(player);
    });

    leoidsState.playerMarkers.push(marker);
  });
}


  function handlePlayerMarkerTap(player) {
    const local = getLocalPlayer();
    if (!player || !local) return;

    if (player.id === local.id) {
      speakText?.("This is you.");
      return;
    }

    if (local.role === "hunter" && player.role === "runner") {
      tagSpecificRunner(player);
      return;
    }

    if (local.role === "runner" && player.status === "jailed") {
      rescueJailedRunners();
      return;
    }

    speakText?.(`${player.name}. ${player.role}. ${player.status}.`);
  }

  function clearCircleBoundary() {
    const map = getMapSafe();

    if (map && leoidsState.boundaryLayer) {
      try {
        map.removeLayer(leoidsState.boundaryLayer);
      } catch {}
    }

    if (map && leoidsState.boundaryMarker) {
      try {
        map.removeLayer(leoidsState.boundaryMarker);
      } catch {}
    }

    leoidsState.boundaryLayer = null;
    leoidsState.boundaryMarker = null;
  }

  function clearPolygonBoundary() {
    const map = getMapSafe();

    if (map && leoidsState.polygonLayer) {
      try {
        map.removeLayer(leoidsState.polygonLayer);
      } catch {}
    }

    leoidsState.polygonPointMarkers.forEach((marker) => {
      try {
        map?.removeLayer(marker);
      } catch {}
    });

    leoidsState.polygonLayer = null;
    leoidsState.polygonPointMarkers = [];
  }

  function clearBasePoint() {
    const map = getMapSafe();

    if (map && leoidsState.baseLayer) {
      try {
        map.removeLayer(leoidsState.baseLayer);
      } catch {}
    }

    if (map && leoidsState.baseMarker) {
      try {
        map.removeLayer(leoidsState.baseMarker);
      } catch {}
    }

    leoidsState.baseLayer = null;
    leoidsState.baseMarker = null;
  }

  function clearPlayerMarkers() {
    const map = getMapSafe();

    leoidsState.playerMarkers.forEach((marker) => {
      try {
        map?.removeLayer(marker);
      } catch {}
    });

    leoidsState.playerMarkers = [];
  }

  function clearAllMapObjects() {
    clearCircleBoundary();
    clearPolygonBoundary();
    clearBasePoint();
    clearPlayerMarkers();
  }

  function clearBoundaryFull() {
    clearCircleBoundary();
    clearPolygonBoundary();

    leoidsState.boundaryCenter = null;
    leoidsState.boundaryPoints = [];
    leoidsState.mapMode = "none";

    hideLeoidsMapControls();
    disableMapPointAdding();

    updatePanel();
    speakText?.("LEOIDS boundary cleared.");
  }

  function redrawAllMapObjects() {
    if (leoidsState.boundaryCenter) {
      drawCircleBoundary(leoidsState.boundaryCenter, leoidsState.boundaryRadius);
    }

    if (leoidsState.boundaryPoints.length) {
      drawPolygonBoundary();
    }

    if (leoidsState.basePoint) {
      drawBasePoint(leoidsState.basePoint, leoidsState.baseRadius);
    }

    drawPlayerMarkers();
  }

  function hasValidBoundary() {
    if (leoidsState.boundaryMode === "circle") {
      return !!leoidsState.boundaryCenter;
    }

    return leoidsState.boundaryPoints.length >= 3;
  }

  function addAIPlayer(role = "runner") {
    const id = `ai_${role}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 5)}`;

    const count = leoidsState.players.filter((p) => p.isAI).length + 1;

    leoidsState.players.push({
      id,
      name: role === "hunter" ? `AI Hunter ${count}` : `AI Runner ${count}`,
      role,
      status: "free",
      isAI: true,
      isOnline: false,
      isLocal: false,
      score: 0,
      coins: 0,
      position: randomNearbyPoint(getBoundaryCentreFallback(), 60),
      jailedAtBase: false,
    });

    renderPlayers();
    drawPlayerMarkers();
    updatePanel();

    speakText?.(`${role === "hunter" ? "Hunter" : "Runner"} AI added.`);
  }

  function resetLocalPlayers() {
    leoidsState.players = [
      {
        id: "p1",
        name: "You",
        avatar: "🧍",
        role: leoidsState.role,
        status: "free",
        isAI: false,
        isOnline: false,
        isLocal: true,
        score: 0,
        coins: 0,
        position: randomNearbyPoint(getBoundaryCentreFallback(), 20),
        jailedAtBase: false,
      },
      {
        id: "ai_hunter_1",
        name: "AI Hunter",
        role: "hunter",
        status: "free",
        isAI: true,
        isOnline: false,
        isLocal: false,
        score: 0,
        coins: 0,
        position: randomNearbyPoint(getBoundaryCentreFallback(), 50),
        jailedAtBase: false,
      },
      {
        id: "ai_runner_1",
        name: "AI Runner",
        role: "runner",
        status: "free",
        isAI: true,
        isOnline: false,
        isLocal: false,
        score: 0,
        coins: 0,
        position: randomNearbyPoint(getBoundaryCentreFallback(), 50),
        jailedAtBase: false,
      },
    ];

    renderPlayers();
    drawPlayerMarkers();
    updatePanel();

    speakText?.("Local AI players reset.");
  }

  function moveAIPlayers() {
    if (!leoidsState.active) return;

    const center = getBoundaryCentreFallback();

    leoidsState.players.forEach((player) => {
      if (!player.isAI) return;

      if (player.status === "jailed") {
        if (leoidsState.basePoint) {
          player.position = randomNearbyPoint(leoidsState.basePoint, 4);
          player.jailedAtBase = true;
        }
        return;
      }

      player.position = randomNearbyPoint(player.position || center, 18);
    });

    drawPlayerMarkers();
  }

  function sendRunnerToJail(runner, taggedBy = null) {
  if (!runner || runner.role !== "runner") return false;
  if (runner.status === "jailed") return false;

  runner.status = "jailed";
  runner.jailedAtBase = false;

  if (leoidsState.basePoint) {
    runner.position = randomNearbyPoint(leoidsState.basePoint, 5);
    runner.jailedAtBase = true;
  }

  drawPlayerMarkers();
  renderPlayers();
  updatePanel();
  updateLeoidsBattleHud?.();

  const byText = taggedBy?.name
    ? `Tagged by ${taggedBy.name}.`
    : "Tagged by hunter.";

  showLeoidsEvent(
    "RUNNER JAILED",
    `${runner.name} has been caught.\n${byText}\nGo to base jail.`,
    "🔒",
    "hunter"
  );

  if (navigator.vibrate) {
    navigator.vibrate([180, 90, 180]);
  }

  speakText?.(`${runner.name} caught. Runner sent to jail.`);

  return true;
}


  function tagSpecificRunner(runner) {
    const local = getLocalPlayer();
    if (!local || !runner) return;

    if (local.role !== "hunter") {
      alert("Only hunters can tag runners.");
      speakText?.("Only hunters can tag runners.");
      return;
    }

    if (!leoidsState.huntersReleased) {
      alert("Hunters have not been released yet.");
      speakText?.("Hunters have not been released yet.");
      return;
    }

    if (!local.position) {
      local.position = getBoundaryCentreFallback();
    }

    if (!runner.position) {
      speakText?.("Runner position unknown.");
      return;
    }

    const closestDistance = distanceMeters(local.position, runner.position);

    if (closestDistance > leoidsState.tagRadius) {
      alert(`Runner is not inside ${leoidsState.tagRadius}m.`);
      speakText?.("Runner is not in tag range.");
      return;
    }

    const tagged = sendRunnerToJail(runner, local);
    if (!tagged) return;

    local.score += 50;
    local.coins += 10;

    if (local.isLocal || !local.isOnline) {
      leoidsState.score += 50;
      leoidsState.coins += 10;
    }

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();

    speakText?.(`${runner.name} tagged. Go to jail.`);
    checkHunterWin();
  }

  function tagNearestRunner() {
    const local = getLocalPlayer();
    if (!local) return;

    if (local.role !== "hunter") {
      alert("Only hunters can tag runners.");
      speakText?.("Only hunters can tag runners.");
      return;
    }

    if (!leoidsState.huntersReleased) {
      alert("Hunters have not been released yet.");
      speakText?.("Hunters have not been released yet.");
      return;
    }

    if (!local.position) {
      local.position = getBoundaryCentreFallback();
    }

    const runners = leoidsState.players.filter(
      (p) => p.role === "runner" && p.status === "free" && p.id !== local.id
    );

    if (!runners.length) {
      alert("No free runners available.");
      speakText?.("No free runners available.");
      return;
    }

    let closest = null;
    let closestDistance = Infinity;

    runners.forEach((runner) => {
      const d = distanceMeters(local.position, runner.position);
      if (d < closestDistance) {
        closest = runner;
        closestDistance = d;
      }
    });

    if (!closest || closestDistance > leoidsState.tagRadius) {
      alert(`No runner inside ${leoidsState.tagRadius}m.`);
      speakText?.("No runner in tag range.");
      return;
    }

    tagSpecificRunner(closest);
  }

 function rescueJailedRunners() {
  const local = getLocalPlayer();
  if (!local) return;

  if (local.role !== "runner") {
    speakText?.("Only runners can rescue.");
    return;
  }

  if (!leoidsState.basePoint && window.__leoidsBasePoint) {
    leoidsState.basePoint = window.__leoidsBasePoint;
  }

  if (!leoidsState.basePoint) {
    speakText?.("Set the jail base first.");
    return;
  }

  if (!local.position) {
    local.position = leoidsState.basePoint;
  }

  const distanceToBase = distanceMeters(local.position, leoidsState.basePoint);

  if (distanceToBase > leoidsState.baseRadius) {
    speakText?.("You are not close enough to the jail base.");

    showLeoidsEvent(
      "TOO FAR FROM BASE",
      `Get inside the ${leoidsState.baseRadius}m rescue zone.`,
      "📍",
      "runner"
    );

    return;
  }

  const jailed = leoidsState.players.filter(
    (p) =>
      p.role === "runner" &&
      p.status === "jailed" &&
      distanceMeters(p.position, leoidsState.basePoint) <= leoidsState.baseRadius
  );

  if (!jailed.length) {
    showLeoidsEvent(
      "NO ONE TO RESCUE",
      "No jailed runners are inside the base zone.",
      "🛡️",
      "base"
    );

    speakText?.("No jailed runners are at the base.");
    return;
  }

  jailed.forEach((runner) => {
    runner.status = "free";
    runner.jailedAtBase = false;
    runner.position = randomNearbyPoint(leoidsState.basePoint, 15);
  });

  local.score += 75;
  local.coins += 15;

  leoidsState.score += 75;
  leoidsState.coins += 15;
  leoidsState.lastRescueAt = Date.now();

  drawPlayerMarkers();
  renderPlayers();
  updatePanel();
  updateLeoidsBattleHud?.();

  showLeoidsEvent(
    "RESCUE COMPLETE",
    `${jailed.length} runner${jailed.length === 1 ? "" : "s"} released.\n+75 points`,
    "🟢",
    "runner"
  );

  if (navigator.vibrate) {
    navigator.vibrate([80, 60, 80, 60, 220]);
  }

  speakText?.("Rescue complete. Jailed runners released.");
}
  function runAITagChecks() {
    if (!leoidsState.active) return;
    if (!leoidsState.huntersReleased) return;

    const hunters = leoidsState.players.filter(
      (p) => p.role === "hunter" && p.status === "free"
    );

    const runners = leoidsState.players.filter(
      (p) => p.role === "runner" && p.status === "free"
    );

    hunters.forEach((hunter) => {
      runners.forEach((runner) => {
        if (hunter.id === runner.id) return;
        if (!hunter.position || !runner.position) return;

        const d = distanceMeters(hunter.position, runner.position);

        if (d <= leoidsState.tagRadius) {
          const tagged = sendRunnerToJail(runner, hunter);
          if (!tagged) return;

          hunter.score += 50;
          hunter.coins += 10;

          if (!hunter.isAI) {
            leoidsState.score += 50;
            leoidsState.coins += 10;
          }
        }
      });
    });

    checkHunterWin();
  }

  function checkHunterWin() {
    const runners = leoidsState.players.filter((p) => p.role === "runner");
    const allJailed =
      runners.length && runners.every((p) => p.status === "jailed");

    if (!allJailed) return false;

    leoidsState.players
      .filter((p) => p.role === "hunter")
      .forEach((hunter) => {
        hunter.score += 200;
        hunter.coins += 30;
      });

    endRound("hunters");
    speakText?.("Hunters win. All runners jailed.");
    return true;
  }

  function showLeoidsEvent(title, message, emoji = "⚡", theme = "base") {
  const old = document.getElementById("leoids-event-banner");
  if (old) old.remove();

  const themes = {
    hunter: {
      border: "#ff3b3b",
      glow: "rgba(255,59,59,.45)",
      title: "#ff3b3b",
      bg1: "#2a1116",
      bg2: "#05070b",
    },
    runner: {
      border: "#22c55e",
      glow: "rgba(34,197,94,.45)",
      title: "#22c55e",
      bg1: "#10251a",
      bg2: "#05070b",
    },
    base: {
      border: "#00d4ff",
      glow: "rgba(0,212,255,.45)",
      title: "#00d4ff",
      bg1: "#101827",
      bg2: "#05070b",
    },
    danger: {
      border: "#ffb000",
      glow: "rgba(255,176,0,.45)",
      title: "#ffb000",
      bg1: "#261b08",
      bg2: "#05070b",
    },
  };

  const style = themes[theme] || themes.base;

  const banner = document.createElement("div");
  banner.id = "leoids-event-banner";
  banner.style.position = "fixed";
  banner.style.inset = "0";
  banner.style.zIndex = "999999";
  banner.style.background = "rgba(0,0,0,0.72)";
  banner.style.display = "flex";
  banner.style.alignItems = "center";
  banner.style.justifyContent = "center";
  banner.style.padding = "20px";
  banner.style.pointerEvents = "none";

  banner.innerHTML = `
    <div style="
      width:min(88vw,480px);
      border:2px solid ${style.border};
      border-radius:26px;
      background:linear-gradient(180deg,${style.bg1},${style.bg2});
      color:white;
      text-align:center;
      padding:22px;
      box-shadow:0 0 38px ${style.glow};
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      animation:leoidsEventPop .18s ease-out;
    ">
      <div style="
        font-size:54px;
        margin-bottom:10px;
        filter:drop-shadow(0 0 10px ${style.glow});
      ">
        ${emoji}
      </div>

      <div style="
        color:${style.title};
        font-weight:1000;
        font-size:22px;
        letter-spacing:.07em;
      ">
        ${title}
      </div>

      <div style="
        margin-top:12px;
        font-size:15px;
        line-height:1.45;
        white-space:pre-wrap;
        opacity:.94;
      ">
        ${message}
      </div>
    </div>
  `;

  if (!document.getElementById("leoids-event-animation-style")) {
    const styleEl = document.createElement("style");
    styleEl.id = "leoids-event-animation-style";
    styleEl.textContent = `
      @keyframes leoidsEventPop {
        from {
          transform:scale(.88);
          opacity:0;
        }
        to {
          transform:scale(1);
          opacity:1;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  document.body.appendChild(banner);

  setTimeout(() => {
    banner.remove();
  }, 2300);
}

  
function showRoundEndScreen(reason = "manual") {
  const old = document.getElementById("leoids-round-end-screen");
  if (old) old.remove();

  const sorted = [...leoidsState.players].sort(
    (a, b) => Number(b.score || 0) - Number(a.score || 0)
  );

  const winner = sorted[0];

  const title =
    reason === "timer"
      ? "RUNNERS SURVIVED"
      : reason === "hunters"
      ? "HUNTERS WIN"
      : "ROUND ENDED";

  const emoji =
    reason === "timer"
      ? "🟢"
      : reason === "hunters"
      ? "🔴"
      : "⚡";

  const rows = sorted.length
    ? sorted
        .map(
          (p, index) => `
            <div style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:10px;
              padding:12px;
              border-radius:14px;
              background:${
                index === 0
                  ? "rgba(255,213,74,.16)"
                  : "rgba(255,255,255,.07)"
              };
              border:${
                index === 0
                  ? "1px solid rgba(255,213,74,.55)"
                  : "1px solid rgba(255,255,255,.08)"
              };
              margin-top:8px;
            ">
              <div>
                <strong>${index + 1}. ${getPlayerIcon(p)} ${p.name}</strong>
                <div style="font-size:12px;opacity:.8;margin-top:3px;">
                  ${p.role.toUpperCase()} • ${p.status.toUpperCase()}
                </div>
              </div>

              <div style="text-align:right;">
                <strong>${Number(p.score || 0)} pts</strong>
                <div style="font-size:12px;opacity:.8;margin-top:3px;">
                  ${Number(p.coins || 0)} coins
                </div>
              </div>
            </div>
          `
        )
        .join("")
    : `<div style="opacity:.8;margin-top:12px;">No players found.</div>`;

  const modal = document.createElement("div");
  modal.id = "leoids-round-end-screen";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.zIndex = "999999";
  modal.style.background = "rgba(0,0,0,.92)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "18px";

  modal.innerHTML = `
    <div style="
      width:min(94vw,580px);
      max-height:88vh;
      overflow:auto;
      border:2px solid rgba(0,212,255,.85);
      border-radius:30px;
      background:linear-gradient(180deg,#101827,#05070b);
      color:white;
      padding:24px;
      box-shadow:0 0 42px rgba(0,212,255,.28);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">
      <div style="
        text-align:center;
        font-size:54px;
        margin-bottom:8px;
      ">
        ${emoji}
      </div>

      <h1 style="
        margin:0;
        color:#00d4ff;
        text-align:center;
        letter-spacing:.08em;
        font-size:26px;
      ">
        ${title}
      </h1>

      <div style="
        text-align:center;
        margin-top:10px;
        color:#ffd54a;
        font-weight:1000;
        font-size:16px;
      ">
        Winner: ${winner ? `${getPlayerIcon(winner)} ${winner.name}` : "No winner"}
      </div>

      <div style="margin-top:18px;">
        ${rows}
      </div>

      <button id="btn-leoids-play-again" type="button" style="
        width:100%;
        min-height:48px;
        border-radius:16px;
        background:#22c55e;
        color:#05070b;
        font-weight:1000;
        margin-top:18px;
        border:none;
        font-size:15px;
      ">
        PLAY AGAIN
      </button>

      <button id="btn-leoids-round-end-map" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:16px;
        background:#00d4ff;
        color:#05070b;
        font-weight:1000;
        margin-top:10px;
        border:none;
      ">
        BACK TO MAP
      </button>

      <button id="btn-leoids-round-end-setup" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:16px;
        background:#202a3c;
        color:white;
        font-weight:900;
        margin-top:10px;
        border:none;
      ">
        GAME SETUP
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-leoids-play-again")?.addEventListener("click", () => {
    modal.remove();

    leoidsState.players.forEach((player) => {
      player.status = "free";
      player.jailedAtBase = false;
      player.score = 0;
      player.coins = 0;
    });

    leoidsState.score = 0;
    leoidsState.coins = 0;
    leoidsState.timeLeft = Number(leoidsState.roundTime || DEFAULT_ROUND_SECONDS);
    leoidsState.hunterDelayLeft = Number(
      leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS
    );
    leoidsState.huntersReleased = false;

    seedPlayerPositions();
    startRound();
  });

  document.getElementById("btn-leoids-round-end-map")?.addEventListener("click", () => {
    modal.remove();
    enterBattleMap();
    redrawAllMapObjects();
    drawPlayerMarkers();
    showLeoidsBattleHud?.();
  });

  document.getElementById("btn-leoids-round-end-setup")?.addEventListener("click", () => {
    modal.remove();
    openSetupPanel();
  });
}


function buildOnlineSessionConfig() {
  return {
    boundary: {
      mode: leoidsState.boundaryMode,
      radius: Number(leoidsState.boundaryRadius || DEFAULT_BOUNDARY_RADIUS),
      center: leoidsState.boundaryCenter,
      points: leoidsState.boundaryPoints || [],
    },
    basePoint: leoidsState.basePoint,
    roundTime: Number(leoidsState.roundTime || DEFAULT_ROUND_SECONDS),
    hunterDelay: Number(leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS),
    baseRadius: Number(leoidsState.baseRadius || DEFAULT_BASE_RADIUS),
    tagRadius: Number(leoidsState.tagRadius || DEFAULT_TAG_RADIUS),
    countdownSeconds: Number(leoidsState.countdownSeconds || 60),
  };
}

async function saveOnlineSessionConfig() {
  const supabase = getSupabaseSafe();

  if (!supabase || !leoidsState.onlineSessionId) return null;

  return await supabase.updateSessionConfig(
    leoidsState.onlineSessionId,
    buildOnlineSessionConfig()
  );
}

function applyOnlineSessionConfig(session) {
  if (!session) return;

  if (session.boundary) {
    leoidsState.boundaryMode =
      session.boundary.mode === "polygon" ? "polygon" : "circle";

    leoidsState.boundaryRadius = Number(
      session.boundary.radius || DEFAULT_BOUNDARY_RADIUS
    );

    leoidsState.boundaryCenter = session.boundary.center || null;
    leoidsState.boundaryPoints = Array.isArray(session.boundary.points)
      ? session.boundary.points
      : [];
  }

  if (session.base_lat !== null && session.base_lat !== undefined) {
    leoidsState.basePoint = {
      lat: Number(session.base_lat),
      lng: Number(session.base_lng),
    };

    window.__leoidsBasePoint = leoidsState.basePoint;
  }

  if (session.round_time) {
    leoidsState.roundTime = Number(session.round_time);
    leoidsState.timeLeft = Number(session.round_time);
  }

  if (session.hunter_delay) {
    leoidsState.hunterDelay = Number(session.hunter_delay);
    leoidsState.hunterDelayLeft = Number(session.hunter_delay);
  }

  if (session.base_radius) {
    leoidsState.baseRadius = Number(session.base_radius);
  }

  if (session.tag_radius) {
    leoidsState.tagRadius = Number(session.tag_radius);
  }

  if (session.countdown_seconds) {
    leoidsState.countdownSeconds = Number(session.countdown_seconds);
  }

  redrawAllMapObjects();
  renderPlayers();
  updatePanel();
}

async function loadAndApplyOnlineSession() {
  const supabase = getSupabaseSafe();

  if (!supabase || !leoidsState.onlineSessionId) return null;

  const session = await supabase.getSession(leoidsState.onlineSessionId);

  if (!session) return null;

  applyOnlineSessionConfig(session);
  return session;
}

function showCountdownBanner(secondsLeft) {
  let banner = document.getElementById("leoids-countdown-banner");

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "leoids-countdown-banner";
    banner.style.position = "fixed";
    banner.style.inset = "0";
    banner.style.zIndex = "999999";
    banner.style.background = "rgba(0,0,0,.86)";
    banner.style.display = "flex";
    banner.style.alignItems = "center";
    banner.style.justifyContent = "center";
    banner.style.color = "white";
    banner.style.textAlign = "center";
    document.body.appendChild(banner);
  }

  banner.innerHTML = `
    <div style="
      width:min(92vw,520px);
      border:2px solid rgba(255,213,74,.9);
      border-radius:28px;
      background:linear-gradient(180deg,#171b2b,#05070b);
      padding:28px;
      box-shadow:0 0 40px rgba(255,213,74,.3);
    ">
      <div style="font-size:18px;color:#ffd54a;font-weight:900;">
        LEOIDS ROUND STARTING
      </div>
      <div style="font-size:72px;font-weight:900;margin-top:12px;">
        ${Math.max(0, secondsLeft)}
      </div>
      <div style="opacity:.85;margin-top:8px;">
        Get ready. Game starts when countdown reaches zero.
      </div>
    </div>
  `;
}

function hideCountdownBanner() {
  const banner = document.getElementById("leoids-countdown-banner");
  if (banner) banner.remove();
}

function handleOnlineCountdown(session) {
  if (!session || session.status !== "countdown" || !session.game_starts_at) return;

  const startsAtMs = new Date(session.game_starts_at).getTime();

  if (!Number.isFinite(startsAtMs)) return;

  if (leoidsState.countdownIntervalId) {
    clearInterval(leoidsState.countdownIntervalId);
    leoidsState.countdownIntervalId = null;
  }

  leoidsState.countdownIntervalId = setInterval(() => {
    const secondsLeft = Math.ceil((startsAtMs - Date.now()) / 1000);

    showCountdownBanner(secondsLeft);
    updatePanel();

    if (secondsLeft <= 0) {
      clearInterval(leoidsState.countdownIntervalId);
      leoidsState.countdownIntervalId = null;

      hideCountdownBanner();
      startRoundFromOnlineSession(session);
    }
  }, 500);
}

function startRoundFromOnlineSession(session = null) {
  if (session) {
    applyOnlineSessionConfig(session);
  }

  stopTimer();
  stopAI();

  leoidsState.active = true;
  leoidsState.status = "free";
  leoidsState.timeLeft = Number(leoidsState.roundTime || DEFAULT_ROUND_SECONDS);
  leoidsState.hunterDelayLeft = Number(
    leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS
  );
  leoidsState.huntersReleased = false;
  leoidsState.startedAt = new Date().toISOString();
  leoidsState.endedAt = null;

  leoidsState.players = leoidsState.players.filter((p) => !p.isAI);

  leoidsState.players.forEach((player) => {
    player.status = "free";
    player.jailedAtBase = false;
  });

  updatePanel();
  renderPlayers();
  drawPlayerMarkers();

  speakText?.("Online LEOIDS round started.");

  leoidsState.intervalId = setInterval(tickRound, 1000);
}

async function startOnlineCountdown(seconds = 60) {
  const supabase = getSupabaseSafe();

  if (!supabase || !leoidsState.onlineSessionId) {
    speakText?.("Join or create an online session first.");
    return null;
  }

  await saveOnlineSessionConfig();

  const session = await supabase.startCountdown(
    leoidsState.onlineSessionId,
    Number(seconds || 60)
  );

  if (session) {
    applyOnlineSessionConfig(session);
    handleOnlineCountdown(session);
    speakText?.("Countdown started.");
  }

  return session;
}

function handleOnlineSessionUpdate(payload) {
  const session = payload?.new || payload;

  if (!session) return;

  applyOnlineSessionConfig(session);

  if (session.status === "countdown") {
    handleOnlineCountdown(session);
  }

if (session.status === "active" && !leoidsState.active) {
  startRoundFromOnlineSession(session);
}
}

function startOnlineSessionSync() {
  const supabase = getSupabaseSafe();

  if (!supabase || !leoidsState.onlineSessionId) return false;

  if (!supabase.sessionId) {
    supabase.sessionId = leoidsState.onlineSessionId;
  }

  if (typeof supabase.subscribeToSession !== "function") {
    console.warn("Session realtime sync is not available.");
    return false;
  }

  supabase.subscribeToSession(handleOnlineSessionUpdate);

  loadAndApplyOnlineSession();

  console.log("LEOIDS online session sync started.");
  return true;
}


  function startRound() {
  // 🛑 PREVENT LOOP
  if (leoidsState.active) {
    console.log("Round already active — ignoring duplicate start.");
    return;
  }

  leoidsState.active = true;

  leoidsState.timeLeft = Number(leoidsState.roundTime || DEFAULT_ROUND_SECONDS);
  leoidsState.hunterDelayLeft = Number(
    leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS
  );

  leoidsState.huntersReleased = false;

  showLeoidsEvent(
    "ROUND STARTED",
    "Hunters are locked. Runners hide now.",
    "⚡",
    "base"
  );

  speakText?.("Round started. Hunters are locked.");

  startLeoidsGameLoop?.();
}


function tickRound() {
  if (!leoidsState.active) return;

  leoidsState.timeLeft = Math.max(0, leoidsState.timeLeft - 1);

  if (!leoidsState.huntersReleased) {
    leoidsState.hunterDelayLeft = Math.max(
      0,
      leoidsState.hunterDelayLeft - 1
    );

    const releaseSoon =
      leoidsState.hunterDelayLeft > 0 && leoidsState.hunterDelayLeft <= 10;

    if (releaseSoon && !leoidsState.lastHunterCountdownSecond) {
      leoidsState.lastHunterCountdownSecond = leoidsState.hunterDelayLeft;
    }

    if (
      releaseSoon &&
      leoidsState.lastHunterCountdownSecond !== leoidsState.hunterDelayLeft
    ) {
      leoidsState.lastHunterCountdownSecond = leoidsState.hunterDelayLeft;

      if (
        leoidsState.hunterDelayLeft === 10 ||
        leoidsState.hunterDelayLeft === 5 ||
        leoidsState.hunterDelayLeft <= 3
      ) {
        showLeoidsEvent(
          "HUNTERS RELEASE SOON",
          `${leoidsState.hunterDelayLeft} seconds`,
          "⏱️",
          "hunter"
        );

        speakText?.(`${leoidsState.hunterDelayLeft}`);
      }
    }

    if (leoidsState.hunterDelayLeft <= 0) {
      leoidsState.huntersReleased = true;
      leoidsState.lastHunterCountdownSecond = null;

      const local = getLocalPlayer();

      if (local?.role === "hunter") {
        showLeoidsEvent(
          "HUNTERS RELEASED",
          "Go. Catch the runners.",
          "🔴",
          "hunter"
        );

        speakText?.("Hunters released. Go and catch the runners.");
      } else {
        showLeoidsEvent(
          "HUNTERS RELEASED",
          "Run. Hide. Rescue your team.",
          "🏃",
          "runner"
        );

        speakText?.("Hunters released. Runners, keep moving.");
      }
    }
  }

  const local = getLocalPlayer();

  if (local?.role === "runner" && leoidsState.basePoint && local.position) {
    const distance = distanceMeters(local.position, leoidsState.basePoint);

    if (
      distance <= leoidsState.baseRadius &&
      Date.now() - (leoidsState.lastRescueAt || 0) > 3000
    ) {
      leoidsState.lastRescueAt = Date.now();
      rescueJailedRunners();
    }
  }

  checkBoundaryRules();

  if (leoidsState.timeLeft <= 0) {
    endRound("timer");
    return;
  }

  updatePanel();
}

  function endRound(reason = "manual") {
    stopTimer();
    stopAI();

    leoidsState.active = false;
    leoidsState.endedAt = new Date().toISOString();

    if (reason === "timer") {
      leoidsState.players
        .filter((p) => p.role === "runner" && p.status === "free")
        .forEach((runner) => {
          runner.score += 200;
          runner.coins += 30;
        });

      speakText?.("Runners survive. Round complete.");
    } else if (reason === "hunters") {
      speakText?.("Hunters win the round.");
    } else {
      speakText?.("LEOIDs round ended.");
    }

    renderPlayers();
    updatePanel();
    saveState?.();

    showRoundEndScreen(reason);
  }

  function stopTimer() {
    if (leoidsState.intervalId) {
      clearInterval(leoidsState.intervalId);
      leoidsState.intervalId = null;
    }
  }

  function stopAI() {
    if (leoidsState.aiIntervalId) {
      clearInterval(leoidsState.aiIntervalId);
      leoidsState.aiIntervalId = null;
    }
  }

  function renderPlayers() {
    const list = $("leoids-player-list");
    if (!list) return;

    list.innerHTML = leoidsState.players
      .map(
        (player) => `
          <div class="leoids-player-row">
            <span>${getPlayerIcon(player)} ${player.name}${player.isOnline ? " 🌐" : ""}</span>
            <strong>${player.role.toUpperCase()} • ${player.status.toUpperCase()} • ${player.score} pts</strong>
          </div>
        `
      )
      .join("");
  }

  function updatePanel() {
  if (!$("leoids-status")) return;

  const local = getLocalPlayer();
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  const roleText = leoidsState.role === "hunter" ? "Hunter" : "Runner";
  const statusText = leoidsState.active ? "ACTIVE" : "SETUP";

  const onlineText = leoidsState.onlineEnabled
    ? `ONLINE • ${leoidsState.onlineSessionId || "session ready"}`
    : "LOCAL";

  const boundaryText =
    leoidsState.boundaryMode === "circle"
      ? leoidsState.boundaryCenter
        ? `Circle ${leoidsState.boundaryRadius}m`
        : "No circle boundary set"
      : leoidsState.boundaryPoints.length >= 3
      ? `Street boundary set with ${leoidsState.boundaryPoints.length} points`
      : `Street boundary needs ${
          3 - leoidsState.boundaryPoints.length
        } more point(s)`;

  const baseText = leoidsState.basePoint
    ? `Jail/Base set • ${leoidsState.baseRadius}m rescue radius`
    : "No jail/base set";

  const releaseText =
    leoidsState.role === "hunter"
      ? leoidsState.huntersReleased
        ? "Hunters released"
        : `Hunter release: ${formatTime(leoidsState.hunterDelayLeft)}`
      : `Hunter delay: ${formatTime(leoidsState.hunterDelay)}`;

  const freeRunners = leoidsState.players.filter(
    (p) => p.role === "runner" && p.status === "free"
  ).length;

  const jailedRunners = leoidsState.players.filter(
    (p) => p.role === "runner" && p.status === "jailed"
  ).length;

  $("leoids-status").innerText =
    `Connection: ${onlineText}\n` +
    `Mode: ${statusText}\n` +
    `Boundary: ${boundaryText}\n` +
    `Base: ${baseText}\n` +
    `Your Role: ${roleText}\n` +
    `Round Time: ${formatTime(leoidsState.timeLeft)}\n` +
    `${releaseText}\n` +
    `Auto Tag Radius: ${leoidsState.tagRadius}m\n` +
    `Free Runners: ${freeRunners}\n` +
    `Jailed Runners: ${jailedRunners}\n` +
    `Score: ${leoidsState.score}\n` +
    `Coins earned: ${leoidsState.coins}`;

  const startBtn = $("btn-leoids-start");
  if (startBtn) {
    startBtn.innerText = leoidsState.active ? "ROUND RUNNING" : "START LEOIDS ROUND";
    startBtn.disabled = !isHost || leoidsState.active;

    startBtn.style.display = isHost ? "block" : "none";
    startBtn.style.minHeight = "54px";
    startBtn.style.borderRadius = "18px";
    startBtn.style.border = "none";
    startBtn.style.fontWeight = "1000";
    startBtn.style.fontSize = "15px";
    startBtn.style.letterSpacing = ".05em";

    if (leoidsState.active) {
      startBtn.style.background = "#374151";
      startBtn.style.color = "#cbd5e1";
      startBtn.style.boxShadow = "none";
    } else {
      startBtn.style.background = "#22c55e";
      startBtn.style.color = "#05070b";
      startBtn.style.boxShadow = "0 0 22px rgba(34,197,94,.42)";
    }
  }

  const endBtn = $("btn-leoids-end");
  if (endBtn) {
    endBtn.style.display = isHost ? "block" : "none";
    endBtn.disabled = !isHost || !leoidsState.active;
    endBtn.style.opacity = leoidsState.active ? "1" : ".55";
  }

  updateLeoidsBattleHud?.();
}

  
function isLocalLobbyHost(session = null) {
  if (leoidsState.isLobbyHost) return true;

  const localName =
    leoidsState.onlinePlayerName ||
    window.LEOIDSSupabase?.playerName ||
    "";

  const hostName = session?.host_name || "";

  return !!localName && !!hostName && localName === hostName;
}


async function openOnlineLobbyScreen(sessionId = leoidsState.onlineSessionId) {
  const supabase = window.LEOIDSSupabase;

  if (!supabase || !sessionId) {
    alert("No online lobby selected.");
    return;
  }

  if (!supabase.client && typeof supabase.init === "function") {
    supabase.init();
  }

  supabase.sessionId = sessionId;
  leoidsState.onlineSessionId = sessionId;

  const old = document.getElementById("leoids-online-lobby-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "leoids-online-lobby-screen";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.zIndex = "999999";
  modal.style.background = "rgba(0,0,0,.9)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "18px";

  modal.innerHTML = `
    <div style="
      width:min(94vw,560px);
      max-height:88vh;
      overflow:auto;
      border:2px solid rgba(0,212,255,.85);
      border-radius:28px;
      background:linear-gradient(180deg,#101827,#05070b);
      color:white;
      padding:22px;
      box-shadow:0 0 38px rgba(0,212,255,.25);
    ">
      <h2 id="leoids-lobby-title" style="margin:0;color:#00d4ff;">LEOIDS Lobby</h2>

      <div id="leoids-lobby-host" style="opacity:.85;margin-top:8px;">
        Host: loading...
      </div>

      <div id="leoids-lobby-host-badge" style="
        display:none;
        margin-top:10px;
        padding:10px;
        border-radius:14px;
        background:rgba(255,213,74,.12);
        color:#ffd54a;
        font-weight:1000;
        text-align:center;
      ">
        HOST CONTROLS ENABLED
      </div>

      <div id="leoids-lobby-status" style="
        margin-top:12px;
        padding:12px;
        border-radius:14px;
        background:rgba(0,212,255,.12);
        color:#00d4ff;
        font-weight:1000;
        text-align:center;
      ">
        Loading lobby...
      </div>

      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#00d4ff;">Players</h3>
        <div id="leoids-lobby-player-list">
          <div style="opacity:.75;margin-top:10px;">Loading players...</div>
        </div>
      </div>

      <div id="leoids-host-controls" style="display:none;margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Host Controls</h3>

        <button id="btn-leoids-lobby-start-countdown" type="button" style="
          width:100%;
          min-height:46px;
          border-radius:14px;
          background:#ffd54a;
          color:#05070b;
          font-weight:1000;
          margin-top:8px;
          border:none;
        ">
          START GAME COUNTDOWN
        </button>

        <button id="btn-leoids-lobby-host-setup" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:14px;
          background:#202a3c;
          color:white;
          font-weight:900;
          margin-top:10px;
          border:none;
        ">
          HOST SETUP / EDIT GAME
        </button>

        <button id="btn-leoids-lobby-end-session" type="button" style="
          width:100%;
          min-height:42px;
          border-radius:14px;
          background:#3a1111;
          color:white;
          font-weight:900;
          margin-top:10px;
          border:1px solid rgba(255,59,59,.55);
        ">
          END / HIDE LOBBY
        </button>
      </div>

      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#00d4ff;">Location</h3>

        <button id="btn-leoids-lobby-gps" type="button" style="
          width:100%;
          min-height:46px;
          border-radius:14px;
          background:#00d4ff;
          color:#05070b;
          font-weight:1000;
          margin-top:8px;
          border:none;
        ">
          START LOCATION & OPEN GAME MAP
        </button>
      </div>

      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#00d4ff;">Prepare</h3>

        <button id="btn-leoids-lobby-runner" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:14px;
          background:#22c55e;
          color:#05070b;
          font-weight:1000;
          margin-top:8px;
          border:none;
        ">
          PLAY AS RUNNER
        </button>

        <button id="btn-leoids-lobby-hunter" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:14px;
          background:#ff3b3b;
          color:white;
          font-weight:1000;
          margin-top:8px;
          border:none;
        ">
          PLAY AS HUNTER
        </button>

        <button id="btn-leoids-lobby-help" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:14px;
          background:#202a3c;
          color:white;
          font-weight:900;
          margin-top:12px;
          border:none;
        ">
          HELP / RULES / ITEMS
        </button>
      </div>

      <button id="btn-leoids-lobby-map" type="button" style="
        width:100%;
        min-height:46px;
        border-radius:14px;
        background:#00d4ff;
        color:#05070b;
        font-weight:1000;
        margin-top:18px;
        border:none;
      ">
        OPEN GAME MAP
      </button>

      <button id="btn-leoids-lobby-close" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#111827;
        color:white;
        font-weight:900;
        margin-top:10px;
        border:none;
      ">
        CLOSE
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  async function refreshLobbyScreen() {
    const activeSessionId = leoidsState.onlineSessionId || supabase.sessionId;
    if (!activeSessionId) return;

    const session = await supabase.getSession(activeSessionId);
    const players = await supabase.loadPlayers();

    if (!document.getElementById("leoids-online-lobby-screen")) return;

    leoidsState.isLobbyHost = isLocalLobbyHost(session);

    const title = document.getElementById("leoids-lobby-title");
    const host = document.getElementById("leoids-lobby-host");
    const status = document.getElementById("leoids-lobby-status");
    const playerList = document.getElementById("leoids-lobby-player-list");
    const hostControls = document.getElementById("leoids-host-controls");
    const hostBadge = document.getElementById("leoids-lobby-host-badge");

    if (title) title.innerText = session?.name || "LEOIDS Lobby";
    if (host) host.innerText = `Host: ${session?.host_name || "Unknown"}`;

    if (hostControls) {
      hostControls.style.display = leoidsState.isLobbyHost ? "block" : "none";
    }

    if (hostBadge) {
      hostBadge.style.display = leoidsState.isLobbyHost ? "block" : "none";
    }

    if (status) {
      if (session?.status === "countdown" && session?.game_starts_at) {
        const secondsLeft = Math.max(
          0,
          Math.ceil((new Date(session.game_starts_at).getTime() - Date.now()) / 1000)
        );

        status.innerText = `Starting in ${secondsLeft}s`;
      } else if (session?.status === "active") {
        status.innerText = "Game active";
      } else {
        status.innerText = leoidsState.isLobbyHost
          ? "Waiting in lobby • You can start the game"
          : "Waiting for host to start";
      }
    }

    if (playerList) {
      playerList.innerHTML = players.length
        ? players
            .map(
              (player) => `
                <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:10px;
                  padding:10px;
                  border-radius:12px;
                  background:rgba(255,255,255,.07);
                  margin-top:8px;
                ">
                  <span>${player.avatar || "🧍"} ${player.display_name || "Player"}</span>
                  <strong>${(player.role || "runner").toUpperCase()}</strong>
                </div>
              `
            )
            .join("")
        : `<div style="opacity:.75;margin-top:10px;">No players yet.</div>`;
    }

    if (session && typeof applyOnlineSessionConfig === "function") {
      applyOnlineSessionConfig(session);
    }
  }

  function closeLobbyScreen() {
    if (leoidsState.lobbyRefreshIntervalId) {
      clearInterval(leoidsState.lobbyRefreshIntervalId);
      leoidsState.lobbyRefreshIntervalId = null;
    }

    modal.remove();
  }

  function openGameMapFromLobby({ startLocation = false } = {}) {
    closeLobbyScreen();

    enterBattleMap();
    hideLeoidsMapControls();
    closeModal?.("leoids-modal");

    loadAndApplyOnlineSession?.();
    loadOnlinePlayers?.();

    if (startLocation) {
      startGpsOnlineSync();
      speakText?.("Location sharing started. Game map opened.");
    } else {
      speakText?.("Game map opened.");
    }

    setTimeout(() => {
      redrawAllMapObjects();
      drawPlayerMarkers();
      showLeoidsBattleHud?.();

      const map = getMapSafe();
      if (map && leoidsState.basePoint) {
        map.setView(
          [leoidsState.basePoint.lat, leoidsState.basePoint.lng],
          Math.max(map.getZoom(), 17)
        );
      }
    }, 300);
  }

  await refreshLobbyScreen();

  if (leoidsState.lobbyRefreshIntervalId) {
    clearInterval(leoidsState.lobbyRefreshIntervalId);
  }

  leoidsState.lobbyRefreshIntervalId = setInterval(() => {
    refreshLobbyScreen();
    drawPlayerMarkers();
  }, 2000);

  startOnlinePlayerSync();
  startOnlineSessionSync();

  document.getElementById("btn-leoids-lobby-close")?.addEventListener("click", closeLobbyScreen);

  document.getElementById("btn-leoids-lobby-map")?.addEventListener("click", () => {
    openGameMapFromLobby({ startLocation: false });
  });

  document.getElementById("btn-leoids-lobby-gps")?.addEventListener("click", () => {
    openGameMapFromLobby({ startLocation: true });
  });

  document.getElementById("btn-leoids-lobby-help")?.addEventListener("click", () => {
    openLeoidsInstructions?.();
  });

  document.getElementById("btn-leoids-lobby-start-countdown")?.addEventListener("click", async () => {
    const session = await supabase.getSession(leoidsState.onlineSessionId);

    if (!isLocalLobbyHost(session)) {
      alert("Only the host can start the game.");
      return;
    }

    const seconds = Number(
      prompt("Countdown seconds?", String(leoidsState.countdownSeconds || 60)) || 60
    );

    await startOnlineCountdown(seconds);
    refreshLobbyScreen();
  });

  document.getElementById("btn-leoids-lobby-host-setup")?.addEventListener("click", async () => {
    const session = await supabase.getSession(leoidsState.onlineSessionId);

    if (!isLocalLobbyHost(session)) {
      alert("Only the host can edit game setup.");
      return;
    }

    closeLobbyScreen();
    openSetupPanel();
  });

  document.getElementById("btn-leoids-lobby-end-session")?.addEventListener("click", async () => {
    const session = await supabase.getSession(leoidsState.onlineSessionId);

    if (!isLocalLobbyHost(session)) {
      alert("Only the host can end this lobby.");
      return;
    }

    if (!confirm("End and hide this lobby?")) return;

    if (typeof supabase.endSession === "function") {
      await supabase.endSession(leoidsState.onlineSessionId);
    } else if (supabase.client) {
      await supabase.client
        .from("leoids_sessions")
        .update({
          ended_at: new Date().toISOString(),
          status: "ended",
        })
        .eq("id", leoidsState.onlineSessionId);
    }

    closeLobbyScreen();
    speakText?.("Lobby ended.");
  });

  document.getElementById("btn-leoids-lobby-runner")?.addEventListener("click", async () => {
    setRole("runner");

    if (supabase.playerId) {
      await supabase.joinSession({
        sessionId: leoidsState.onlineSessionId,
        displayName: supabase.playerName || leoidsState.onlinePlayerName || "Player",
        role: "runner",
      });
    }

    refreshLobbyScreen();
  });

  document.getElementById("btn-leoids-lobby-hunter")?.addEventListener("click", async () => {
    setRole("hunter");

    if (supabase.playerId) {
      await supabase.joinSession({
        sessionId: leoidsState.onlineSessionId,
        displayName: supabase.playerName || leoidsState.onlinePlayerName || "Player",
        role: "hunter",
      });
    }

    refreshLobbyScreen();
  });
}


async function openOnlineSessionBrowser() {
  const supabase = window.LEOIDSSupabase;

  if (!supabase) {
    alert("Supabase is not loaded.");
    return;
  }

  if (!supabase.client && typeof supabase.init === "function") {
    supabase.init();
  }

  const joinSessionSafely = async ({ sessionId, displayName, role }) => {
    if (typeof joinOnlineSession === "function") {
      return await joinOnlineSession({ sessionId, displayName, role });
    }

    if (window.LEOIDS && typeof window.LEOIDS.joinOnlineSession === "function") {
      return await window.LEOIDS.joinOnlineSession({ sessionId, displayName, role });
    }

    return await supabase.joinSession({ sessionId, displayName, role });
  };

  let sessions = await supabase.listPublicSessions();

  sessions = (sessions || []).filter((session) => {
    if (session.ended_at) return false;

    if (session.expires_at) {
      const expiry = new Date(session.expires_at).getTime();
      if (Number.isFinite(expiry) && expiry <= Date.now()) return false;
    }

    return true;
  });

  const old = document.getElementById("leoids-session-browser");
  if (old) old.remove();

  const getCountdownText = (session) => {
    if (session.status !== "countdown" || !session.game_starts_at) {
      return session.status || "lobby";
    }

    const secondsLeft = Math.max(
      0,
      Math.ceil((new Date(session.game_starts_at).getTime() - Date.now()) / 1000)
    );

    return `Starts in ${secondsLeft}s`;
  };

  const rows = sessions.length
    ? sessions
        .map(
          (session) => `
            <div style="
              margin-top:10px;
              padding:14px;
              border-radius:16px;
              border:1px solid rgba(0,212,255,.55);
              background:linear-gradient(180deg,rgba(15,23,42,.92),rgba(3,7,18,.92));
              color:white;
              box-shadow:0 0 18px rgba(0,212,255,.14);
            ">
              <div style="font-size:16px;color:#00d4ff;font-weight:1000;">
                ${session.name || "LEOIDS Game"}
              </div>

              <div style="font-size:13px;opacity:.9;margin-top:5px;">
                Host: ${session.host_name || "Unknown"}
              </div>

              <div style="font-size:13px;opacity:.9;margin-top:3px;">
                Players: ${session.player_count || 0}/${session.max_players || 12}
              </div>

              <div style="font-size:13px;opacity:.9;margin-top:3px;">
                Status: ${getCountdownText(session)}
              </div>

              <button
                class="leoids-session-join-btn"
                data-session-id="${session.id}"
                type="button"
                style="
                  width:100%;
                  min-height:44px;
                  margin-top:12px;
                  border-radius:14px;
                  background:#00d4ff;
                  color:#05070b;
                  font-weight:1000;
                  border:none;
                "
              >
                JOIN LOBBY
              </button>

              <button
                class="leoids-session-end-btn"
                data-session-id="${session.id}"
                type="button"
                style="
                  width:100%;
                  min-height:38px;
                  margin-top:8px;
                  border-radius:14px;
                  background:#202a3c;
                  color:white;
                  font-weight:900;
                  border:none;
                "
              >
                HIDE / END LOBBY
              </button>
            </div>
          `
        )
        .join("")
    : `<div style="opacity:.8;margin-top:12px;">No public games found.</div>`;

  const modal = document.createElement("div");
  modal.id = "leoids-session-browser";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.zIndex = "999999";
  modal.style.background = "rgba(0,0,0,.88)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "18px";

  modal.innerHTML = `
    <div style="
      width:min(94vw,560px);
      max-height:86vh;
      overflow:auto;
      border:2px solid rgba(0,212,255,.85);
      border-radius:26px;
      background:linear-gradient(180deg,#101827,#05070b);
      color:white;
      padding:22px;
      box-shadow:0 0 35px rgba(0,212,255,.25);
    ">
      <h2 style="margin:0;color:#00d4ff;">Online LEOIDS Lobbies</h2>
      <p style="opacity:.8;margin:8px 0 14px;">
        Join a live lobby or host a new test game.
      </p>

      <button id="btn-leoids-refresh-sessions" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#202a3c;
        color:white;
        font-weight:900;
        margin-bottom:8px;
        border:none;
      ">
        REFRESH LOBBIES
      </button>

      <button id="btn-leoids-host-public-session" type="button" style="
        width:100%;
        min-height:48px;
        border-radius:16px;
        background:#22c55e;
        color:#05070b;
        font-weight:1000;
        margin-bottom:10px;
        border:none;
        box-shadow:0 0 18px rgba(34,197,94,.35);
      ">
        HOST NEW PUBLIC LOBBY
      </button>

      <div>${rows}</div>

      <button id="btn-leoids-close-session-browser" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#111827;
        color:white;
        font-weight:900;
        margin-top:16px;
        border:none;
      ">
        CLOSE
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-leoids-close-session-browser")?.addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("btn-leoids-refresh-sessions")?.addEventListener("click", () => {
    modal.remove();
    openOnlineSessionBrowser();
  });

  document.getElementById("btn-leoids-host-public-session")?.addEventListener("click", async () => {
    const name = prompt("Lobby name?", "Barrow LEOIDS Game") || "Barrow LEOIDS Game";
    const hostName = prompt("Your name?", "Kyle") || "Host";

    leoidsState.onlinePlayerName = hostName;
    leoidsState.isLobbyHost = true;

    supabase.playerName = hostName;

    const session = await createOnlineSession(name);
    if (!session) return;

    await joinSessionSafely({
      sessionId: session.id,
      displayName: hostName,
      role: leoidsState.role || "runner",
    });

    leoidsState.isLobbyHost = true;
    leoidsState.onlineSessionId = session.id;
    supabase.sessionId = session.id;

    modal.remove();

    setTimeout(() => {
      openOnlineLobbyScreen(session.id);
    }, 150);
  });

  modal.querySelectorAll(".leoids-session-join-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sessionId = btn.dataset.sessionId;
      const displayName = prompt("Your name?", "Kyle") || "Player";

      leoidsState.isLobbyHost = false;

      await joinSessionSafely({
        sessionId,
        displayName,
        role: leoidsState.role || "runner",
      });

      modal.remove();
      openOnlineLobbyScreen(sessionId);
    });
  });

  modal.querySelectorAll(".leoids-session-end-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sessionId = btn.dataset.sessionId;

      if (!confirm("Hide/end this lobby?")) return;

      if (typeof supabase.endSession === "function") {
        await supabase.endSession(sessionId);
      } else if (supabase.client) {
        await supabase.client
          .from("leoids_sessions")
          .update({
            ended_at: new Date().toISOString(),
            status: "ended",
          })
          .eq("id", sessionId);
      }

      modal.remove();
      openOnlineSessionBrowser();
    });
  });
}

function openLeoidsLeaderboard() {
  const old = document.getElementById("leoids-leaderboard-screen");
  if (old) old.remove();

  const sorted = [...leoidsState.players].sort(
    (a, b) => Number(b.score || 0) - Number(a.score || 0)
  );

  const rows = sorted.length
    ? sorted
        .map(
          (player, index) => `
            <div style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:10px;
              padding:12px;
              border-radius:14px;
              background:rgba(255,255,255,.07);
              margin-top:8px;
            ">
              <div>
                <strong>${index + 1}. ${getPlayerIcon(player)} ${player.name}</strong>
                <div style="font-size:12px;opacity:.8;margin-top:3px;">
                  ${player.role.toUpperCase()} • ${player.status.toUpperCase()}${player.isOnline ? " • ONLINE" : ""}
                </div>
              </div>
              <div style="text-align:right;">
                <strong>${Number(player.score || 0)} pts</strong>
                <div style="font-size:12px;opacity:.8;margin-top:3px;">
                  ${Number(player.coins || 0)} coins
                </div>
              </div>
            </div>
          `
        )
        .join("")
    : `<div style="opacity:.8;margin-top:12px;">No players yet.</div>`;

  const modal = document.createElement("div");
  modal.id = "leoids-leaderboard-screen";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.zIndex = "999999";
  modal.style.background = "rgba(0,0,0,.88)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "18px";

  modal.innerHTML = `
    <div style="
      width:min(94vw,560px);
      max-height:86vh;
      overflow:auto;
      border:2px solid rgba(255,213,74,.85);
      border-radius:28px;
      background:linear-gradient(180deg,#171b2b,#05070b);
      color:white;
      padding:22px;
      box-shadow:0 0 36px rgba(255,213,74,.25);
    ">
      <h2 style="margin:0;color:#ffd54a;text-align:center;">LEOIDS LEADERBOARD</h2>
      <div style="margin-top:16px;">${rows}</div>

      <button id="btn-leoids-leaderboard-close" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#ffd54a;
        color:#111;
        font-weight:900;
        margin-top:18px;
      ">
        BACK
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-leoids-leaderboard-close")?.addEventListener("click", () => {
    modal.remove();
  });
}


function tryReleaseJailedRunners() {
  const local = getLocalPlayer();

  if (!local) {
    speakText?.("No local player found.");
    return;
  }

  if (local.role !== "runner") {
    showLeoidsEvent(
      "RUNNERS ONLY",
      "Only runners can release jailed players.",
      "🟦",
      "runner"
    );
    speakText?.("Only runners can release jailed players.");
    return;
  }

  rescueJailedRunners();
}


function getLeoidsHudStatusText() {
  const local = getLocalPlayer();

  if (!leoidsState.active) return "WAITING";

  if (local?.status === "jailed") return "JAILED";

  if (!leoidsState.huntersReleased) {
    return local?.role === "hunter" ? "LOCKED" : "HIDE";
  }

  return local?.role === "hunter" ? "CHASE" : "SURVIVE";
}

function showLeoidsBattleHud() {
  const mapEl = $("map");
  const setupModal = $("leoids-modal");

  const setupIsOpen =
    setupModal &&
    !setupModal.classList.contains("hidden") &&
    setupModal.style.display !== "none";

  if (!mapEl || !mapEl.classList.contains("leoids-battle-map") || setupIsOpen) {
    hideLeoidsBattleHud();
    return;
  }

  let hud = document.getElementById("leoids-battle-hud");

  if (!hud) {
    hud = document.createElement("div");
    hud.id = "leoids-battle-hud";
    hud.style.position = "fixed";
    hud.style.top = "8px";
    hud.style.left = "50%";
    hud.style.transform = "translateX(-50%)";
    hud.style.zIndex = "999990";
    hud.style.width = "min(96vw, 430px)";
    hud.style.pointerEvents = "none";
    document.body.appendChild(hud);
  }

  updateLeoidsBattleHud();
}

function hideLeoidsBattleHud() {
  const hud = document.getElementById("leoids-battle-hud");
  if (hud) hud.remove();
}


function updateLeoidsBattleHud() {
  const hud = document.getElementById("leoids-battle-hud");
  if (!hud) return;

  const mapEl = $("map");
  const setupModal = $("leoids-modal");

  const setupIsOpen =
    setupModal &&
    !setupModal.classList.contains("hidden") &&
    setupModal.style.display !== "none";

  if (!mapEl || !mapEl.classList.contains("leoids-battle-map") || setupIsOpen) {
    hideLeoidsBattleHud();
    return;
  }

  const local = getLocalPlayer();
  const role = (local?.role || leoidsState.role || "runner").toUpperCase();
  const isHunter = role === "HUNTER";
  const isJailed = local?.status === "jailed";

  const freeRunners = leoidsState.players.filter(
    (p) => p.role === "runner" && p.status === "free"
  ).length;

  const jailedRunners = leoidsState.players.filter(
    (p) => p.role === "runner" && p.status === "jailed"
  ).length;

  const roleColor = isJailed ? "#9ca3af" : isHunter ? "#ff3b3b" : "#22c55e";
  const glowColor = isHunter
    ? "rgba(255,59,59,.55)"
    : isJailed
    ? "rgba(156,163,175,.45)"
    : "rgba(34,197,94,.55)";

  const statusText = getLeoidsHudStatusText();

  const statusBg =
    !leoidsState.active
      ? "#202a3c"
      : isJailed
      ? "#6b7280"
      : isHunter
      ? "#ff3b3b"
      : "#22c55e";

  hud.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:6px;
      min-height:36px;
      padding:5px 8px;
      border:2px solid ${roleColor};
      border-radius:999px;
      background:linear-gradient(90deg,rgba(5,7,11,.94),rgba(12,18,30,.94));
      color:white;
      box-shadow:0 0 14px ${glowColor};
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      backdrop-filter:blur(8px);
      white-space:nowrap;
      overflow:hidden;
    ">
      <span style="
        color:#00d4ff;
        font-weight:1000;
        font-size:11px;
        letter-spacing:.08em;
        padding-left:2px;
      ">
        LEOIDS
      </span>

      <span style="
        background:${roleColor};
        color:#05070b;
        border-radius:999px;
        padding:3px 8px;
        font-size:10px;
        font-weight:1000;
        letter-spacing:.05em;
      ">
        ${role}
      </span>

      <span style="
        font-size:19px;
        line-height:1;
        font-weight:1000;
        color:white;
        text-shadow:0 0 8px ${glowColor};
      ">
        ${formatTime(leoidsState.timeLeft)}
      </span>

      <span style="
        background:${statusBg};
        color:${isHunter || isJailed ? "white" : "#05070b"};
        border-radius:999px;
        padding:3px 7px;
        font-size:10px;
        font-weight:1000;
        letter-spacing:.04em;
      ">
        ${statusText}
      </span>

      <span style="
        color:#22c55e;
        font-size:10px;
        font-weight:1000;
      ">
        F:${freeRunners}
      </span>

      <span style="
        color:#9ca3af;
        font-size:10px;
        font-weight:1000;
        padding-right:2px;
      ">
        J:${jailedRunners}
      </span>
    </div>
  `;
}



async function quickStartLeoidsGame() {
  const map = getMapSafe();

  if (!map) {
    alert("Map is not ready yet.");
    speakText?.("Map is not ready yet.");
    return;
  }

  const center = map.getCenter();

  const basePoint = {
    lat: Number(center.lat),
    lng: Number(center.lng),
  };

  leoidsState.roundTime = 300;
  leoidsState.timeLeft = 300;

  leoidsState.hunterDelay = 60;
  leoidsState.hunterDelayLeft = 60;
  leoidsState.huntersReleased = false;

  leoidsState.boundaryMode = "circle";
  leoidsState.boundaryRadius = 200;
  leoidsState.boundaryCenter = basePoint;
  leoidsState.boundaryPoints = [];

  leoidsState.basePoint = basePoint;
  leoidsState.pendingBasePoint = null;
  leoidsState.baseRadius = 18;
  leoidsState.tagRadius = 10;

  window.__leoidsBasePoint = basePoint;

  clearPolygonBoundary();
  drawCircleBoundary(leoidsState.boundaryCenter, leoidsState.boundaryRadius);
  drawBasePoint(leoidsState.basePoint, leoidsState.baseRadius);

  seedPlayerPositions();

  await saveOnlineSessionConfig();

  refreshBoundaryButtons();
  renderPlayers();
  drawPlayerMarkers();
  updatePanel();

  showLeoidsEvent(
    "QUICK START READY",
    "5 minute test round.\n1 minute hunter lock.\nBoundary and base set.",
    "⚡",
    "base"
  );

  speakText?.("Quick start ready. Boundary and base have been set.");
}


function openLeoidsInstructions({ firstTime = false } = {}) {
  const old = document.getElementById("leoids-instructions-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "leoids-instructions-screen";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.zIndex = "999999";
  modal.style.background = "rgba(0,0,0,.9)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "18px";

  modal.innerHTML = `
    <div style="
      width:min(94vw,560px);
      max-height:88vh;
      overflow:auto;
      border:2px solid #00d4ff;
      border-radius:28px;
      background:linear-gradient(180deg,#101827,#05070b);
      color:white;
      padding:22px;
      box-shadow:0 0 40px rgba(0,212,255,.35);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">
      <h2 style="margin:0;color:#00d4ff;text-align:center;letter-spacing:.08em;">
        HOW TO PLAY LEOIDS
      </h2>

      <div style="margin-top:12px;text-align:center;color:#ffd54a;font-weight:900;line-height:1.4;">
        Hunters chase. Runners survive and rescue. Stay inside the boundary.
      </div>

      <div style="margin-top:16px;padding:14px;border-radius:16px;background:rgba(255,59,59,.13);border:1px solid rgba(255,59,59,.35);">
        <strong style="color:#ff3b3b;">🔴 HUNTERS</strong>
        <p style="margin:8px 0 0;line-height:1.45;">
          Wait for the release timer. When released, chase runners and tap them on the map when they are inside tag range.
        </p>
      </div>

      <div style="margin-top:12px;padding:14px;border-radius:16px;background:rgba(34,197,94,.13);border:1px solid rgba(34,197,94,.35);">
        <strong style="color:#22c55e;">🟢 RUNNERS</strong>
        <p style="margin:8px 0 0;line-height:1.45;">
          Stay inside the boundary, avoid hunters, and rescue jailed runners by reaching the glowing base.
        </p>
      </div>

      <div style="margin-top:12px;padding:14px;border-radius:16px;background:rgba(0,212,255,.13);border:1px solid rgba(0,212,255,.35);">
        <strong style="color:#00d4ff;">🛡️ BASE / JAIL</strong>
        <p style="margin:8px 0 0;line-height:1.45;">
          Tagged runners are sent to base. Free runners release them automatically by entering the rescue zone.
        </p>
      </div>

      <div style="margin-top:12px;padding:14px;border-radius:16px;background:rgba(255,176,0,.13);border:1px solid rgba(255,176,0,.35);">
        <strong style="color:#ffb000;">🟡 BOUNDARY</strong>
        <p style="margin:8px 0 0;line-height:1.45;">
          Stay inside the boundary. Leaving the game area can cost points.
        </p>
      </div>

      <div style="margin-top:16px;padding:12px;border-radius:16px;background:rgba(255,255,255,.06);font-size:13px;line-height:1.45;opacity:.9;">
        Play safely. Use open spaces, watch roads and obstacles, and do not stare at the phone while running.
      </div>

      <button id="btn-leoids-instructions-close" type="button" style="
        width:100%;
        min-height:46px;
        border-radius:16px;
        background:#00d4ff;
        color:#05070b;
        font-weight:1000;
        margin-top:18px;
        border:none;
      ">
        GOT IT
      </button>

      ${
        firstTime
          ? `
            <button id="btn-leoids-instructions-never-again" type="button" style="
              width:100%;
              min-height:42px;
              border-radius:16px;
              background:#202a3c;
              color:white;
              font-weight:900;
              margin-top:10px;
              border:none;
            ">
              DO NOT SHOW AGAIN
            </button>
          `
          : ""
      }
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-leoids-instructions-close")?.addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("btn-leoids-instructions-never-again")?.addEventListener("click", () => {
    localStorage.setItem("leoidsInstructionsSeen", "yes");
    modal.remove();
  });
}


function maybeShowFirstTimeLeoidsInstructions() {
  const seen = localStorage.getItem("leoidsInstructionsSeen");

  if (seen === "yes") return;

  setTimeout(() => {
    openLeoidsInstructions({ firstTime: true });
  }, 350);
}


function wirePanelButtons() {
  const setClick = (id, fn) => {
    const el = $(id);
    if (!el) return;

    el.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      fn();
    };
  };

  const hideSetupButton = (id) => {
    const el = $(id);
    if (!el) return;
    el.style.display = "none";
  };

  const showSetupButton = (id, display = "block") => {
    const el = $(id);
    if (!el) return;
    el.style.display = display;
  };

  const local = getLocalPlayer();
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;
  const isSoloLocal = !leoidsState.onlineEnabled;

  // These now belong in the Command Hub, not the setup panel.
  hideSetupButton("btn-leoids-release-jail");
  hideSetupButton("btn-leoids-leaderboard");

  // AI tools should only show for local / solo testing.
  if (isSoloLocal) {
    showSetupButton("btn-leoids-add-ai-runner");
    showSetupButton("btn-leoids-add-ai-hunter");
    showSetupButton("btn-leoids-reset-players");
  } else {
    hideSetupButton("btn-leoids-add-ai-runner");
    hideSetupButton("btn-leoids-add-ai-hunter");
    hideSetupButton("btn-leoids-reset-players");
  }

  // Host-only round controls.
  if (isHost) {
    showSetupButton("btn-leoids-start");
    showSetupButton("btn-leoids-end");
  } else {
    hideSetupButton("btn-leoids-start");
    hideSetupButton("btn-leoids-end");
  }

  setClick("btn-leoids-quick-start", quickStartLeoidsGame);
  setClick("btn-leoids-instructions", openLeoidsInstructions);

  setClick("btn-leoids-close", closeSetupPanel);
  setClick("btn-leoids-close-x", closeSetupPanel);

  setClick("btn-leoids-runner", () => setRole("runner"));
  setClick("btn-leoids-hunter", () => setRole("hunter"));

  setClick("btn-leoids-browse-games", openOnlineSessionBrowser);

  setClick("btn-leoids-boundary-circle", () => {
    setBoundaryMode("circle");
  });

  setClick("btn-leoids-boundary-polygon", () => {
    setBoundaryMode("polygon");
  });

  const roundLength = $("leoids-round-length");
  if (roundLength) {
    roundLength.disabled = !isHost;
    roundLength.onchange = (e) => {
      setRoundLength(Number(e.target.value || DEFAULT_ROUND_SECONDS));
    };
  }

  const hunterDelay = $("leoids-hunter-delay");
  if (hunterDelay) {
    hunterDelay.disabled = !isHost;
    hunterDelay.onchange = (e) => {
      setHunterDelay(Number(e.target.value || DEFAULT_HUNTER_DELAY_SECONDS));
    };
  }

  const boundarySize = $("leoids-boundary-size");
  if (boundarySize) {
    boundarySize.disabled = !isHost;
    boundarySize.onchange = (e) => {
      setBoundaryRadius(Number(e.target.value || DEFAULT_BOUNDARY_RADIUS));
    };
  }

  const baseRadius = $("leoids-base-radius");
  if (baseRadius) {
    baseRadius.disabled = !isHost;
    baseRadius.onchange = (e) => {
      setBaseRadius(Number(e.target.value || DEFAULT_BASE_RADIUS));
    };
  }

  const tagRadius = $("leoids-tag-radius");
  if (tagRadius) {
    tagRadius.disabled = !isHost;
    tagRadius.onchange = (e) => {
      setTagRadius(Number(e.target.value || DEFAULT_TAG_RADIUS));
    };
  }

  if (isHost) {
    showSetupButton("btn-leoids-set-boundary");
    showSetupButton("btn-leoids-clear-boundary");
    showSetupButton("btn-leoids-set-base");

    setClick("btn-leoids-set-boundary", setCircleBoundaryHere);

    setClick("btn-leoids-add-point", () => {
      leoidsState.mapMode = "boundary";
      closeModal?.("leoids-modal");
      showActionButton?.(false);
      showLeoidsMapControls("boundary");
      enableMapPointAdding();
      speakText?.("Tap the map to add boundary points.");
    });

    setClick("btn-leoids-undo-point", undoStreetBoundaryPoint);
    setClick("btn-leoids-confirm-boundary", confirmBoundaryFromMap);
    setClick("btn-leoids-clear-boundary", clearBoundaryFull);
    setClick("btn-leoids-set-base", setBaseHere);
  } else {
    hideSetupButton("btn-leoids-set-boundary");
    hideSetupButton("btn-leoids-add-point");
    hideSetupButton("btn-leoids-undo-point");
    hideSetupButton("btn-leoids-confirm-boundary");
    hideSetupButton("btn-leoids-clear-boundary");
    hideSetupButton("btn-leoids-set-base");
  }

  setClick("btn-leoids-add-ai-runner", () => addAIPlayer("runner"));
  setClick("btn-leoids-add-ai-hunter", () => addAIPlayer("hunter"));
  setClick("btn-leoids-reset-players", resetLocalPlayers);

  setClick("btn-leoids-start", () => {
    if (!isHost) {
      alert("Only the host can start the round.");
      return;
    }

    startRound();
  });

  setClick("btn-leoids-end", () => {
    if (!isHost) {
      alert("Only the host can end the round.");
      return;
    }

    endRound("manual");
  });

  refreshBoundaryButtons();
  updatePanel();
}

function showLeoidsCommandHub() {
  hideLeoidsCommandHub();

  const local = getLocalPlayer();
  const isHost = !!leoidsState.isLobbyHost;
  const isRunner = local?.role === "runner";

  const hub = document.createElement("div");
  hub.id = "leoids-command-hub";
  hub.style.position = "fixed";
  hub.style.left = "50%";
  hub.style.bottom = "82px";
  hub.style.transform = "translateX(-50%)";
  hub.style.zIndex = "999998";
  hub.style.width = "min(94vw,420px)";
  hub.style.pointerEvents = "auto";

  hub.innerHTML = `
    <div style="
      border:2px solid rgba(0,212,255,.85);
      border-radius:26px;
      background:linear-gradient(180deg,#101827,#05070b);
      color:white;
      padding:16px;
      box-shadow:0 0 34px rgba(0,212,255,.3);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
      ">
        <div>
          <div style="color:#00d4ff;font-weight:1000;font-size:18px;">
            LEOIDS COMMAND
          </div>
          <div style="opacity:.75;font-size:12px;margin-top:2px;">
            ${local ? `${getPlayerIcon(local)} ${local.name} • ${local.role}` : "Game controls"}
          </div>
        </div>

        <button id="btn-leoids-command-close" type="button" style="
          width:38px;
          height:38px;
          border-radius:50%;
          border:none;
          background:#202a3c;
          color:white;
          font-weight:1000;
          font-size:18px;
        ">
          ×
        </button>
      </div>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:16px;
      ">
        <button id="btn-command-leaderboard" type="button" style="
          min-height:48px;
          border-radius:16px;
          border:none;
          background:#ffd54a;
          color:#05070b;
          font-weight:1000;
        ">
          📊 Leaderboard
        </button>

        <button id="btn-command-help" type="button" style="
          min-height:48px;
          border-radius:16px;
          border:none;
          background:#00d4ff;
          color:#05070b;
          font-weight:1000;
        ">
          ❓ Help
        </button>

        <button id="btn-command-release" type="button" style="
          min-height:48px;
          border-radius:16px;
          border:none;
          background:${isRunner ? "#22c55e" : "#374151"};
          color:${isRunner ? "#05070b" : "#cbd5e1"};
          font-weight:1000;
        ">
          🛡️ Release
        </button>

        <button id="btn-command-map-refresh" type="button" style="
          min-height:48px;
          border-radius:16px;
          border:none;
          background:#202a3c;
          color:white;
          font-weight:1000;
        ">
          🗺️ Refresh Map
        </button>
      </div>

      <div style="
        display:${isHost ? "grid" : "none"};
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:10px;
      ">
        <button id="btn-command-host-setup" type="button" style="
          min-height:46px;
          border-radius:16px;
          border:1px solid rgba(0,212,255,.45);
          background:#111827;
          color:#00d4ff;
          font-weight:1000;
        ">
          ⚙️ Host Setup
        </button>

        <button id="btn-command-end-round" type="button" style="
          min-height:46px;
          border-radius:16px;
          border:1px solid rgba(255,59,59,.55);
          background:#3a1111;
          color:white;
          font-weight:1000;
        ">
          ⛔ End Round
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(hub);

  document.getElementById("btn-leoids-command-close")?.addEventListener("click", hideLeoidsCommandHub);

  document.getElementById("btn-command-leaderboard")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    openLeoidsLeaderboard();
  });

  document.getElementById("btn-command-help")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    openLeoidsInstructions();
  });

  document.getElementById("btn-command-release")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    tryReleaseJailedRunners();
  });

  document.getElementById("btn-command-map-refresh")?.addEventListener("click", () => {
    redrawAllMapObjects();
    drawPlayerMarkers();
    updateLeoidsBattleHud?.();
    speakText?.("Map refreshed.");
  });

  document.getElementById("btn-command-host-setup")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    openSetupPanel();
  });

  document.getElementById("btn-command-end-round")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    endRound("manual");
  });
}

  function hideLeoidsCommandHub() {
  const hub = document.getElementById("leoids-command-hub");
  if (hub) hub.remove();
}


  function toggleLeoidsCommandHub() {
  const existing = document.getElementById("leoids-command-hub");

  if (existing) {
    hideLeoidsCommandHub();
    return;
  }

  showLeoidsCommandHub();
}
  
  
return {
  state: leoidsState,

  enterBattleMap,
  exitBattleMap,
  openSetupPanel,
  closeSetupPanel,

  quickStartLeoidsGame,
  openLeoidsInstructions,
  maybeShowFirstTimeLeoidsInstructions,

  setRole,
  setBoundaryMode,
  setRoundLength,
  setHunterDelay,
  setBoundaryRadius,
  setBaseRadius,
  setTagRadius,
  setRunnerVisibilityMode,

  setCircleBoundaryHere,
  addStreetBoundaryPointHere,
  undoStreetBoundaryPoint,
  confirmBoundaryFromMap,

  setBaseHere,
  confirmBaseFromMap,
  backToLeoidsPanelFromMap,

  showLeoidsMapControls,
  hideLeoidsMapControls,

  clearBoundaryFull,

  addAIPlayer,
  resetLocalPlayers,
  tagNearestRunner,
  tagSpecificRunner,
  rescueJailedRunners,

  createOnlineSession,
  joinOnlineSession,
  startOnlinePlayerSync,
  stopOnlinePlayerSync,
  loadOnlinePlayers,
  syncLocalPlayerPosition,
  startGpsOnlineSync,
  stopGpsOnlineSync,

  saveOnlineSessionConfig,
  loadAndApplyOnlineSession,
  startOnlineSessionSync,
  startOnlineCountdown,

  showLeoidsBattleHud,
  hideLeoidsBattleHud,
  updateLeoidsBattleHud,

  openOnlineSessionBrowser,
  openOnlineLobbyScreen,
  openLeoidsLeaderboard,
  tryReleaseJailedRunners,
  isLocalLobbyHost,
  showLeoidsCommandHub,
  hideLeoidsCommandHub,  
  toggleLeoidsCommandHub,
  startRound,
  endRound,
  updatePanel,
  wirePanelButtons,
};
}
