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
        if (now - player.lastBoundaryPenaltyAt > 10000) {
          player.lastBoundaryPenaltyAt = now;

          player.score = Math.max(0, Number(player.score || 0) - 25);

          if (!player.isOnline || player.isLocal) {
            leoidsState.score = Math.max(0, Number(leoidsState.score || 0) - 25);
          }

          speakText?.(`${player.name} is out of bounds. Twenty five points deducted.`);
        }

        return;
      }

      if (leoidsState.boundaryMode === "circle") {
        const edgeDistance = getDistanceToCircleEdge(player.position);

        if (edgeDistance <= 20 && now - player.lastBoundaryWarningAt > 12000) {
          player.lastBoundaryWarningAt = now;
          speakText?.(`${player.name}, warning. You are close to the boundary.`);
        }
      }
    });

    renderPlayers();
    updatePanel();
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
    hostName: leoidsState.onlinePlayerName || "Host",
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

  await saveOnlineSessionConfig();
  startOnlineSessionSync();

  updatePanel();
  speakText?.("Online LEOIDS session created.");

  return session;
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

  speakText?.(`${displayName} joined online LEOIDS as ${role}.`);

  return player;
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
      menuBtn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openSetupPanel();
      };
    }

    refreshAllPinMarkers?.();
    redrawAllMapObjects();
    showLeoidsBattleHud();
    updatePanel();
  }

  function exitBattleMap() {
    stopTimer();
    stopAI();
    hideLeoidsBattleHud();
    stopGpsOnlineSync();
    disableMapPointAdding();
    hideLeoidsMapControls();
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
    disableMapPointAdding();
    hideLeoidsMapControls();
    enterBattleMaps();
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
    wirePanelButtons();
  }

  function closeSetupPanel() {
    closeModal?.("leoids-modal");
    showLeoidsBattleHud();
    
    if (leoidsState.mapMode === "boundary" || leoidsState.mapMode === "base") {
      enableMapPointAdding();
    }
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
    $("btn-leoids-boundary-circle")?.classList.toggle(
      "active",
      leoidsState.boundaryMode === "circle"
    );

    $("btn-leoids-boundary-polygon")?.classList.toggle(
      "active",
      leoidsState.boundaryMode === "polygon"
    );

    if ($("btn-leoids-set-boundary")) {
      $("btn-leoids-set-boundary").style.display =
        leoidsState.boundaryMode === "circle" ? "block" : "none";
    }

    if ($("btn-leoids-add-point")) {
      $("btn-leoids-add-point").style.display = "none";
    }

    if ($("btn-leoids-undo-point")) {
      $("btn-leoids-undo-point").style.display =
        leoidsState.boundaryMode === "polygon" ? "block" : "none";
    }

    if ($("btn-leoids-confirm-boundary")) {
      $("btn-leoids-confirm-boundary").style.display = "none";
    }
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
      color: "#ff3b3b",
      weight: 4,
      opacity: 0.95,
      fillColor: "#ff3b3b",
      fillOpacity: 0.12,
      dashArray: "10, 8",
    }).addTo(map);

    leoidsState.boundaryMarker = L.circleMarker([center.lat, center.lng], {
      radius: 8,
      color: "#ffd54a",
      weight: 3,
      fillColor: "#ffd54a",
      fillOpacity: 1,
    }).addTo(map);
  }

  function drawPolygonBoundary() {
    const map = getMapSafe();
    if (!map) return;

    clearPolygonBoundary();

    leoidsState.polygonPointMarkers = leoidsState.boundaryPoints.map(
      (point, index) =>
        L.circleMarker([point.lat, point.lng], {
          radius: 7,
          color: "#ffd54a",
          weight: 3,
          fillColor: "#ffd54a",
          fillOpacity: 1,
        })
          .bindTooltip(`Point ${index + 1}`, {
            permanent: false,
            direction: "top",
          })
          .addTo(map)
    );

    if (leoidsState.boundaryPoints.length >= 2) {
      const coords = leoidsState.boundaryPoints.map((p) => [p.lat, p.lng]);

      if (leoidsState.boundaryPoints.length >= 3) {
        leoidsState.polygonLayer = L.polygon(coords, {
          color: "#ff3b3b",
          weight: 4,
          opacity: 0.95,
          fillColor: "#ff3b3b",
          fillOpacity: 0.12,
          dashArray: "10, 8",
        }).addTo(map);
      } else {
        leoidsState.polygonLayer = L.polyline(coords, {
          color: "#ff3b3b",
          weight: 4,
          opacity: 0.95,
          dashArray: "10, 8",
        }).addTo(map);
      }
    }
  }

  function drawBasePoint(point, radius) {
    const map = getMapSafe();
    if (!map || !point) return;

    clearBasePoint();

    leoidsState.baseLayer = L.circle([point.lat, point.lng], {
      radius: Number(radius || DEFAULT_BASE_RADIUS),
      color: "#4da3ff",
      weight: 4,
      opacity: 0.95,
      fillColor: "#4da3ff",
      fillOpacity: 0.18,
    }).addTo(map);

    leoidsState.baseMarker = L.circleMarker([point.lat, point.lng], {
      radius: 9,
      color: "#ffffff",
      weight: 3,
      fillColor: "#4da3ff",
      fillOpacity: 1,
    })
      .bindTooltip("Jail / Base", {
        permanent: false,
        direction: "top",
      })
      .addTo(map);
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

    const marker = L.circleMarker([player.position.lat, player.position.lng], {
      radius: player.isAI ? 8 : player.isLocal ? 11 : 10,
      color: player.role === "hunter" ? "#ff4d4d" : "#4da3ff",
      weight: player.isLocal ? 5 : 4,
      fillColor:
        player.status === "jailed"
          ? "#777"
          : player.role === "hunter"
          ? "#ff4d4d"
          : "#4da3ff",
      fillOpacity: 0.9,
    })
      .bindTooltip(
        `${getPlayerIcon(player)} ${player.name} • ${player.role} • ${player.status}`,
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

    const byText = taggedBy?.name ? `Tagged by ${taggedBy.name}.` : "You have been tagged.";
    showLeoidsEvent("RUNNER JAILED", `${runner.name} is in jail.\n${byText}`, "🔒");

    speakText?.(`${runner.name} has been tagged and sent to jail.`);

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
        `Get inside the ${leoidsState.baseRadius}m jail/base radius to rescue.`,
        "📍"
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
      speakText?.("No jailed runners are at the base to rescue.");
      showLeoidsEvent("NO RESCUE", "No jailed runners are at the base.", "🔵");
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

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();

    showLeoidsEvent(
      "RESCUE COMPLETE",
      `${jailed.length} runner${jailed.length === 1 ? "" : "s"} released from jail.`,
      "🟦"
    );

    speakText?.("Jailed runners rescued.");
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

  function showLeoidsEvent(title, message, emoji = "⚡") {
    const old = document.getElementById("leoids-event-banner");
    if (old) old.remove();

    const banner = document.createElement("div");
    banner.id = "leoids-event-banner";
    banner.style.position = "fixed";
    banner.style.inset = "0";
    banner.style.zIndex = "999999";
    banner.style.background = "rgba(0,0,0,0.82)";
    banner.style.display = "flex";
    banner.style.alignItems = "center";
    banner.style.justifyContent = "center";
    banner.style.padding = "20px";

    banner.innerHTML = `
      <div style="
        width:min(92vw,520px);
        border:2px solid rgba(255,213,74,.85);
        border-radius:26px;
        background:linear-gradient(180deg,#161b2a,#05070b);
        color:white;
        text-align:center;
        padding:26px;
        box-shadow:0 0 35px rgba(255,213,74,.35);
      ">
        <div style="font-size:58px;margin-bottom:12px;">${emoji}</div>
        <div style="color:#ffd54a;font-weight:900;font-size:22px;letter-spacing:.06em;">
          ${title}
        </div>
        <div style="margin-top:12px;font-size:15px;line-height:1.5;white-space:pre-wrap;">
          ${message}
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    setTimeout(() => {
      banner.remove();
    }, 2600);
  }

  function showRoundEndScreen(reason = "manual") {
    const old = document.getElementById("leoids-round-end-screen");
    if (old) old.remove();

    const sorted = [...leoidsState.players].sort(
      (a, b) => Number(b.score || 0) - Number(a.score || 0)
    );

    const winner = sorted[0];

    const rows = sorted
      .map(
        (p, index) => `
          <div style="
            display:flex;
            justify-content:space-between;
            gap:10px;
            padding:10px;
            border-radius:12px;
            background:rgba(255,255,255,.06);
            margin-top:8px;
          ">
            <span>${index + 1}. ${getPlayerIcon(p)} ${p.name}</span>
            <strong>${p.score} pts</strong>
          </div>
        `
      )
      .join("");

    const title =
      reason === "timer"
        ? "RUNNERS SURVIVED"
        : reason === "hunters"
        ? "HUNTERS WIN"
        : "ROUND ENDED";

    const modal = document.createElement("div");
    modal.id = "leoids-round-end-screen";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.zIndex = "999999";
    modal.style.background = "rgba(0,0,0,.9)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.padding = "20px";

    modal.innerHTML = `
      <div style="
        width:min(92vw,560px);
        border:2px solid rgba(255,213,74,.85);
        border-radius:28px;
        background:linear-gradient(180deg,#171b2b,#06070b);
        color:white;
        padding:24px;
        box-shadow:0 0 40px rgba(255,213,74,.32);
      ">
        <h1 style="margin:0;color:#ffd54a;text-align:center;">${title}</h1>
        <div style="text-align:center;margin-top:10px;opacity:.9;">
          Winner: <strong>${winner?.name || "No winner"}</strong>
        </div>
        <div style="margin-top:18px;">${rows}</div>
        <button id="btn-leoids-round-end-close" class="win-btn" type="button" style="margin-top:18px;">
          BACK TO LEOIDS
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("btn-leoids-round-end-close")?.addEventListener("click", () => {
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

  if (session.status === "active") {
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


  async function startRound() {
  if (!hasValidBoundary()) {
    alert("Set a LEOIDs boundary first. Street boundary needs at least 3 points.");
    speakText?.("Set a valid boundary first.");
    return;
  }

  if (!leoidsState.basePoint && window.__leoidsBasePoint) {
    leoidsState.basePoint = window.__leoidsBasePoint;
  }

  if (!leoidsState.basePoint) {
    alert("Set the Jail / Base point first.");
    speakText?.("Set the jail base first.");
    return;
  }

  if (leoidsState.onlineEnabled && leoidsState.onlineSessionId) {
    await startOnlineCountdown(leoidsState.countdownSeconds || 60);
    return;
  }

  stopTimer();
  stopAI();
  seedPlayerPositions();

  leoidsState.active = true;
  leoidsState.status = "free";
  leoidsState.score = 0;
  leoidsState.coins = 0;
  leoidsState.timeLeft = leoidsState.roundTime;
  leoidsState.hunterDelayLeft = leoidsState.hunterDelay;
  leoidsState.huntersReleased = false;
  leoidsState.startedAt = new Date().toISOString();
  leoidsState.endedAt = null;

  leoidsState.players.forEach((player) => {
    player.status = "free";
    player.score = 0;
    player.coins = 0;
    player.jailedAtBase = false;
  });

  updatePanel();
  renderPlayers();
  drawPlayerMarkers();

  const delayMins = Math.max(1, Math.round(leoidsState.hunterDelay / 60));

  speakText?.(
    `LEOIDS round started. Runners, hide now. Hunters are locked for ${delayMins} minute${delayMins === 1 ? "" : "s"}.`
  );

  leoidsState.intervalId = setInterval(tickRound, 1000);

  leoidsState.aiIntervalId = setInterval(() => {
    moveAIPlayers();
    checkBoundaryRules();
    runAITagChecks();
    renderPlayers();
    updatePanel();
  }, 2500);

  saveState?.();
}


 function tickRound() {
  if (!leoidsState.active) return;

  leoidsState.timeLeft = Math.max(0, leoidsState.timeLeft - 1);

  if (!leoidsState.huntersReleased) {
    leoidsState.hunterDelayLeft = Math.max(
      0,
      leoidsState.hunterDelayLeft - 1
    );

    if (leoidsState.hunterDelayLeft <= 0) {
      leoidsState.huntersReleased = true;

      const local = getLocalPlayer();

      if (local?.role === "hunter") {
        showLeoidsEvent(
          "HUNTERS RELEASED",
          "Go and catch the runners.",
          "🟥"
        );
        speakText?.("Hunters released. Go and catch the runners.");
      } else {
        showLeoidsEvent(
          "HUNTERS RELEASED",
          "Runners, keep moving. Do not get caught.",
          "🏃"
        );
        speakText?.("Hunters have been released. Runners, keep moving.");
      }
    }
  }

  // 🔥 AUTO RESCUE SYSTEM
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
    updateLeoidsBattleHud();
    
    if (!$("leoids-status")) return;

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
      border:2px solid rgba(255,213,74,.85);
      border-radius:28px;
      background:linear-gradient(180deg,#171b2b,#05070b);
      color:white;
      padding:22px;
      box-shadow:0 0 38px rgba(255,213,74,.25);
    ">
      <h2 id="leoids-lobby-title" style="margin:0;color:#ffd54a;">LEOIDS Lobby</h2>

      <div id="leoids-lobby-host" style="opacity:.85;margin-top:8px;">
        Host: loading...
      </div>

      <div id="leoids-lobby-status" style="
        margin-top:12px;
        padding:12px;
        border-radius:14px;
        background:rgba(255,213,74,.12);
        color:#ffd54a;
        font-weight:900;
        text-align:center;
      ">
        Loading lobby...
      </div>

      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Players</h3>
        <div id="leoids-lobby-player-list">
          <div style="opacity:.75;margin-top:10px;">Loading players...</div>
        </div>
      </div>

      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Location</h3>

        <button id="btn-leoids-lobby-gps" type="button" style="
          width:100%;
          min-height:46px;
          border-radius:14px;
          background:#ffd54a;
          color:#111;
          font-weight:900;
          margin-top:8px;
        ">
          START LOCATION & OPEN GAME MAP
        </button>
      </div>

      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Runner Visibility</h3>

        <button id="btn-leoids-vis-always" type="button" style="
          width:100%;
          min-height:42px;
          border-radius:14px;
          background:#202a3c;
          color:white;
          font-weight:900;
          margin-top:8px;
        ">
          RUNNERS ALWAYS VISIBLE
        </button>

        <button id="btn-leoids-vis-pulse" type="button" style="
          width:100%;
          min-height:42px;
          border-radius:14px;
          background:#202a3c;
          color:white;
          font-weight:900;
          margin-top:8px;
        ">
          RUNNERS PULSE: 5s EVERY 60s
        </button>

        <button id="btn-leoids-vis-hidden" type="button" style="
          width:100%;
          min-height:42px;
          border-radius:14px;
          background:#202a3c;
          color:white;
          font-weight:900;
          margin-top:8px;
        ">
          RUNNERS HIDDEN
        </button>

        <button id="btn-leoids-vis-hunters-only" type="button" style="
          width:100%;
          min-height:42px;
          border-radius:14px;
          background:#202a3c;
          color:white;
          font-weight:900;
          margin-top:8px;
        ">
          RUNNERS VISIBLE TO HUNTERS ONLY
        </button>
      </div>

      <div style="margin-top:18px;">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Prepare</h3>

        <button id="btn-leoids-lobby-runner" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:14px;
          background:#4da3ff;
          color:white;
          font-weight:900;
          margin-top:8px;
        ">
          PLAY AS RUNNER
        </button>

        <button id="btn-leoids-lobby-hunter" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:14px;
          background:#ff4d4d;
          color:white;
          font-weight:900;
          margin-top:8px;
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
        ">
          HELP / RULES / ITEMS
        </button>
      </div>

      <button id="btn-leoids-lobby-map" type="button" style="
        width:100%;
        min-height:46px;
        border-radius:14px;
        background:#ffd54a;
        color:#111;
        font-weight:900;
        margin-top:18px;
      ">
        OPEN GAME MAP
      </button>

      <button id="btn-leoids-lobby-host-setup" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#202a3c;
        color:white;
        font-weight:900;
        margin-top:10px;
      ">
        HOST SETUP / EDIT GAME
      </button>

      <button id="btn-leoids-lobby-close" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#111827;
        color:white;
        font-weight:900;
        margin-top:10px;
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

    const title = document.getElementById("leoids-lobby-title");
    const host = document.getElementById("leoids-lobby-host");
    const status = document.getElementById("leoids-lobby-status");
    const playerList = document.getElementById("leoids-lobby-player-list");

    if (title) title.innerText = session?.name || "LEOIDS Lobby";
    if (host) host.innerText = `Host: ${session?.host_name || "Unknown"}`;

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
        status.innerText = `Waiting in lobby • Runner visibility: ${leoidsState.runnerVisibilityMode || "always"}`;
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

      const map = getMapSafe();
      if (map && leoidsState.basePoint) {
        map.setView([leoidsState.basePoint.lat, leoidsState.basePoint.lng], Math.max(map.getZoom(), 17));
      }
    }, 300);
  }

  refreshLobbyScreen();

  if (leoidsState.lobbyRefreshIntervalId) {
    clearInterval(leoidsState.lobbyRefreshIntervalId);
  }

  leoidsState.lobbyRefreshIntervalId = setInterval(() => {
    refreshLobbyScreen();
    drawPlayerMarkers();
  }, 2000);
 

  startOnlinePlayerSync();
  startOnlineSessionSync();

  document.getElementById("btn-leoids-lobby-close")?.addEventListener("click", () => {
    closeLobbyScreen();
  });

  document.getElementById("btn-leoids-lobby-map")?.addEventListener("click", () => {
    openGameMapFromLobby({ startLocation: false });
  });

  document.getElementById("btn-leoids-lobby-host-setup")?.addEventListener("click", () => {
    closeLobbyScreen();
    openSetupPanel();
  });

  document.getElementById("btn-leoids-lobby-gps")?.addEventListener("click", () => {
    openGameMapFromLobby({ startLocation: true });
  });

  document.getElementById("btn-leoids-lobby-help")?.addEventListener("click", () => {
    alert("This will later become the Help, Rules, Shop, Items and Power-ups area.");
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

  document.getElementById("btn-leoids-vis-always")?.addEventListener("click", () => {
    setRunnerVisibilityMode("always");
    refreshLobbyScreen();
  });

  document.getElementById("btn-leoids-vis-pulse")?.addEventListener("click", () => {
    leoidsState.runnerVisibleSeconds = 5;
    leoidsState.runnerHiddenSeconds = 55;
    setRunnerVisibilityMode("pulse");
    refreshLobbyScreen();
  });

  document.getElementById("btn-leoids-vis-hidden")?.addEventListener("click", () => {
    setRunnerVisibilityMode("hidden");
    refreshLobbyScreen();
  });

  document.getElementById("btn-leoids-vis-hunters-only")?.addEventListener("click", () => {
    setRunnerVisibilityMode("hunters_only");
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

  const sessions = await supabase.listPublicSessions();

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

  const rows = sessions.length
    ? sessions
        .map(
          (session) => `
            <div style="
              margin-top:10px;
              padding:14px;
              border-radius:16px;
              border:1px solid rgba(255,213,74,.55);
              background:rgba(255,255,255,.08);
              color:white;
            ">
              <div style="font-size:16px;color:#ffd54a;font-weight:900;">
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
                  background:#ffd54a;
                  color:#111;
                  font-weight:900;
                "
              >
                JOIN LOBBY
              </button>
            </div>
          `
        )
        .join("")
    : `<div style="opacity:.8;margin-top:12px;">No public games found.</div>`;

  modal.innerHTML = `
    <div style="
      width:min(94vw,560px);
      max-height:86vh;
      overflow:auto;
      border:2px solid rgba(255,213,74,.85);
      border-radius:26px;
      background:linear-gradient(180deg,#171b2b,#06070b);
      color:white;
      padding:22px;
      box-shadow:0 0 35px rgba(255,213,74,.25);
    ">
      <h2 style="margin:0;color:#ffd54a;">Online LEOIDS Lobbies</h2>
      <p style="opacity:.8;margin:8px 0 14px;">
        Join a public lobby or host a new one.
      </p>

      <button id="btn-leoids-refresh-sessions" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#202a3c;
        color:white;
        font-weight:900;
        margin-bottom:8px;
      ">
        REFRESH LOBBIES
      </button>

      <button id="btn-leoids-host-public-session" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:14px;
        background:#ffd54a;
        color:#111;
        font-weight:900;
        margin-bottom:10px;
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
      ">
        CLOSE
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // CLOSE
  document
    .getElementById("btn-leoids-close-session-browser")
    ?.addEventListener("click", () => modal.remove());

  // REFRESH
  document
    .getElementById("btn-leoids-refresh-sessions")
    ?.addEventListener("click", () => {
      modal.remove();
      openOnlineSessionBrowser();
    });

  // HOST
  document
    .getElementById("btn-leoids-host-public-session")
    ?.addEventListener("click", async () => {
      const name = prompt("Lobby name?", "Barrow LEOIDS Game") || "Barrow LEOIDS Game";
      const hostName = prompt("Your name?", "Kyle") || "Host";

      leoidsState.onlinePlayerName = hostName;

      const session = await createOnlineSession(name);
      if (!session) return;

      await joinOnlineSession({
        sessionId: session.id,
        displayName: hostName,
        role: leoidsState.role || "runner",
      });

      modal.remove();
      openOnlineLobbyScreen(session.id);
    });

  // JOIN
  modal.querySelectorAll(".leoids-session-join-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sessionId = btn.dataset.sessionId;
      const displayName = prompt("Your name?", "Kyle") || "Player";

      await joinOnlineSession({
        sessionId,
        displayName,
        role: leoidsState.role || "runner",
      });

      modal.remove();
      openOnlineLobbyScreen(sessionId);
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

  document
    .getElementById("btn-leoids-leaderboard-close")
    ?.addEventListener("click", () => modal.remove());
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
      "🟦"
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
    return local?.role === "hunter" ? "HUNTERS LOCKED" : "HIDE NOW";
  }

  return local?.role === "hunter" ? "CHASE" : "SURVIVE / RESCUE";
}

function showLeoidsBattleHud() {
  const mapEl = $("map");

  if (!mapEl || !mapEl.classList.contains("leoids-battle-map")) {
    hideLeoidsBattleHud();
    return;
  }

  let hud = document.getElementById("leoids-battle-hud");

  if (!hud) {
    hud = document.createElement("div");
    hud.id = "leoids-battle-hud";
    hud.style.position = "fixed";
    hud.style.top = "10px";
    hud.style.left = "50%";
    hud.style.transform = "translateX(-50%)";
    hud.style.zIndex = "999990";
    hud.style.width = "min(88vw, 320px)";
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
  if (!mapEl || !mapEl.classList.contains("leoids-battle-map")) {
    hud.innerHTML = "";
    return;
  }

  const local = getLocalPlayer();
  const role = (local?.role || leoidsState.role || "runner").toUpperCase();
  const isHunter = role === "HUNTER";

  const freeRunners = leoidsState.players.filter(
    (p) => p.role === "runner" && p.status === "free"
  ).length;

  const jailedRunners = leoidsState.players.filter(
    (p) => p.role === "runner" && p.status === "jailed"
  ).length;

  const roleColor = isHunter ? "#ff3b3b" : "#22c55e";

  hud.innerHTML = `
    <div style="
      border:2px solid ${roleColor};
      border-radius:16px;
      background:linear-gradient(180deg,rgba(12,15,25,.95),rgba(3,5,10,.92));
      color:white;
      box-shadow:0 0 16px ${roleColor};
      overflow:hidden;
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:6px 10px 4px;
        gap:8px;
      ">
        <div style="
          color:#ffd54a;
          font-weight:900;
          letter-spacing:.1em;
          font-size:11px;
        ">
          LEOIDS
        </div>

        <div style="
          background:${roleColor};
          color:#05070b;
          border-radius:999px;
          padding:3px 10px;
          font-size:11px;
          font-weight:900;
          letter-spacing:.06em;
        ">
          ${role}
        </div>
      </div>

      <div style="
        text-align:center;
        font-size:30px;
        line-height:1;
        font-weight:1000;
        padding:2px 8px 2px;
      ">
        ${formatTime(leoidsState.timeLeft)}
      </div>

      <div style="
        text-align:center;
        color:${roleColor};
        font-weight:900;
        font-size:12px;
        letter-spacing:.06em;
        padding-bottom:6px;
      ">
        ${getLeoidsHudStatusText()}
      </div>

      <div style="
        display:flex;
        justify-content:center;
        gap:10px;
        padding:6px 8px 8px;
        background:rgba(255,255,255,.05);
        font-size:11px;
        font-weight:800;
      ">
        <span style="color:#22c55e;">Free: ${freeRunners}</span>
        <span style="color:#9ca3af;">Jailed: ${jailedRunners}</span>
      </div>
    </div>
  `;
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

    setClick("btn-leoids-release-jail", tryReleaseJailedRunners);
    setClick("btn-leoids-leaderboard", openLeoidsLeaderboard);
    
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
      roundLength.onchange = (e) => {
        setRoundLength(Number(e.target.value || DEFAULT_ROUND_SECONDS));
      };
    }

    const hunterDelay = $("leoids-hunter-delay");
    if (hunterDelay) {
      hunterDelay.onchange = (e) => {
        setHunterDelay(Number(e.target.value || DEFAULT_HUNTER_DELAY_SECONDS));
      };
    }

    const boundarySize = $("leoids-boundary-size");
    if (boundarySize) {
      boundarySize.onchange = (e) => {
        setBoundaryRadius(Number(e.target.value || DEFAULT_BOUNDARY_RADIUS));
      };
    }

    const baseRadius = $("leoids-base-radius");
    if (baseRadius) {
      baseRadius.onchange = (e) => {
        setBaseRadius(Number(e.target.value || DEFAULT_BASE_RADIUS));
      };
    }

    const tagRadius = $("leoids-tag-radius");
    if (tagRadius) {
      tagRadius.onchange = (e) => {
        setTagRadius(Number(e.target.value || DEFAULT_TAG_RADIUS));
      };
    }

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

    setClick("btn-leoids-add-ai-runner", () => addAIPlayer("runner"));
    setClick("btn-leoids-add-ai-hunter", () => addAIPlayer("hunter"));
    setClick("btn-leoids-reset-players", resetLocalPlayers);

    setClick("btn-leoids-start", startRound);
    setClick("btn-leoids-end", () => endRound("manual"));
  }

return {
    state: leoidsState,

    enterBattleMap,
    exitBattleMap,
    openSetupPanel,
    closeSetupPanel,

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
    
    startRound,
    endRound,
    updatePanel,
    wirePanelButtons,
  };
}
