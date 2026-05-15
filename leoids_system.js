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
    playerMarkers: {},
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

    player.lastBoundaryWarningAt =
      player.lastBoundaryWarningAt || 0;

    player.lastBoundaryPenaltyAt =
      player.lastBoundaryPenaltyAt || 0;

    const inside = isPointInsideBoundary(player.position);

    if (!inside) {

      if (now - player.lastBoundaryPenaltyAt > 9000) {

        player.lastBoundaryPenaltyAt = now;

        player.score = Math.max(
          0,
          Number(player.score || 0) - 25
        );

        if (
          player.isLocal ||
          !player.isOnline
        ) {
          leoidsState.score = Math.max(
            0,
            Number(leoidsState.score || 0) - 25
          );
        }

        playLeoidsSound?.("boundary_warning", 1);

       showLeoidsCinematicOverlay({
        title: "OUT OF BOUNDS",
        subtitle: `${player.name} left the game area\n-25 points`,
        icon: "⚠️",
        theme: "danger",
        duration: 2200
         });
        
        showLeoidsEvent(
          "OUT OF BOUNDS",
          `${player.name} left the game area.\n-25 points`,
          "⚠️",
          "danger"
        );

        if (
          navigator.vibrate &&
          (
            player.isLocal ||
            player.id === getLocalPlayer()?.id
          )
        ) {
          navigator.vibrate([120, 80, 120]);
        }

        document.body.animate(
          [
            { background: "rgba(255,0,0,.28)" },
            { background: "transparent" }
          ],
          {
            duration: 700,
            easing: "ease-out"
          }
        );

        speakText?.(
          `${player.name} is out of bounds. Twenty five points deducted.`
        );
      }

      return;
    }

    if (leoidsState.boundaryMode === "circle") {

      const edgeDistance =
        getDistanceToCircleEdge(player.position);

      if (
        edgeDistance <= 25 &&
        now - player.lastBoundaryWarningAt > 12000
      ) {

        player.lastBoundaryWarningAt = now;

        playLeoidsSound?.("boundary_warning", 0.7);


       showLeoidsCinematicOverlay({
       title: "BOUNDARY WARNING",
       subtitle: "Move back inside the play zone.",
        icon: "🟡",
       theme: "gold",
       duration: 1800
      });
        
        
        showLeoidsEvent(
          "BOUNDARY WARNING",
          `${player.name} is close to the edge.\nMove back inside the play zone.`,
          "🟡",
          "base"
        );

        if (
          navigator.vibrate &&
          (
            player.isLocal ||
            player.id === getLocalPlayer()?.id
          )
        ) {
          navigator.vibrate(90);
        }

        speakText?.(
          `${player.name}, warning. You are close to the boundary.`
        );
      }
    }
  });

  renderPlayers?.();
  updatePanel?.();
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
  const supabase = getSupabaseSafe();

  const playerId =
    leoidsState.onlinePlayerId ||
    supabase?.playerId ||
    null;

  if (playerId) {
    const onlineLocal = leoidsState.players.find((p) => p.id === playerId);

    if (onlineLocal) {
      onlineLocal.isLocal = true;
      onlineLocal.isOnline = true;
      return onlineLocal;
    }
  }

  return (
    leoidsState.players.find((p) => p.isLocal) ||
    leoidsState.players.find((p) => !p.isAI && !p.isOnline) ||
    leoidsState.players[0] ||
    null
  );
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
  if (!row || !row.id) return null;

  const supabase = getSupabaseSafe();

  const localPlayerId =
    leoidsState.onlinePlayerId ||
    supabase?.playerId ||
    null;

  const isLocal = row.id === localPlayerId;

  let existing = leoidsState.players.find((p) => p.id === row.id);

  const position =
    row.lat !== null &&
    row.lat !== undefined &&
    row.lng !== null &&
    row.lng !== undefined
      ? {
          lat: Number(row.lat),
          lng: Number(row.lng),
        }
      : null;

  if (!existing) {
    existing = {
      id: row.id,
      name: row.display_name || row.name || "Online Player",
      avatar: row.avatar || "🧍",
      role: row.role || "runner",
      status: row.status || "free",
      isAI: false,
      isOnline: true,
      isLocal,
      score: Number(row.score || 0),
      coins: Number(row.coins || 0),
      position,
      jailedAtBase: row.status === "jailed",
      lastSeen: row.last_seen || null,
    };

    leoidsState.players.push(existing);
  } else {
    existing.name = row.display_name || row.name || existing.name || "Online Player";
    existing.avatar = row.avatar || existing.avatar || "🧍";
    existing.role = row.role || existing.role || "runner";
    existing.status = row.status || existing.status || "free";
    existing.isAI = false;
    existing.isOnline = true;
    existing.isLocal = isLocal;
    existing.score = Number(row.score || existing.score || 0);
    existing.coins = Number(row.coins || existing.coins || 0);
    existing.jailedAtBase = existing.status === "jailed";
    existing.lastSeen = row.last_seen || existing.lastSeen || null;

    if (position) {
      existing.position = position;
    }
  }

  if (isLocal) {
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
  const firebase = window.firebasePlayers;
  const supabase = getSupabaseSafe();

  if (!firebase) {
    console.warn("Firebase players module not available.");
    return [];
  }

  const sessionId =
    leoidsState.onlineSessionId ||
    supabase?.sessionId ||
    null;

  if (!sessionId) {
    console.warn("No session ID for Firebase players.");
    return [];
  }

  const allPlayers = await new Promise((resolve) => {
    firebase.watchPlayers((playersObj) => {
      const rows = Object.values(playersObj || {}).filter((player) => {
        return player.sessionId === sessionId;
      });

      resolve(rows);
    });
  });

  leoidsState.players = leoidsState.players.filter((player) => {
    return !player.isOnline || player.isLocal;
  });

  allPlayers.forEach((row) => {
    upsertOnlinePlayer({
      id: row.id,
      display_name: row.name,
      avatar: row.avatar,
      role: row.role,
      status: row.status,
      score: row.score || 0,
      coins: row.coins || 0,
      lat: row.lat,
      lng: row.lng,
      last_seen: row.updatedAt,
    });
  });

  console.log("FIREBASE ONLINE PLAYERS LOADED", allPlayers);

  drawPlayerMarkers?.();
  renderPlayers?.();
  updatePanel?.();
  updateLeoidsBattleHud?.();

  return allPlayers;
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
  const firebase = window.firebasePlayers;
  const supabase = getSupabaseSafe();

  if (!firebase) {
    console.warn("Firebase players module not loaded.");
    return false;
  }

  const sessionId =
    leoidsState.onlineSessionId ||
    supabase?.sessionId ||
    null;

  if (!sessionId) {
    console.warn("No online session selected for Firebase sync.");
    return false;
  }

  leoidsState.onlineEnabled = true;
  leoidsState.onlineSessionId = sessionId;
  leoidsState.onlineSyncStarted = true;

  if (leoidsState.firebasePlayersStarted) {
    return true;
  }

  leoidsState.firebasePlayersStarted = true;

  firebase.watchPlayers((playersObj) => {
    const rows = Object.values(playersObj || {}).filter((player) => {
      return player.sessionId === sessionId;
    });

    leoidsState.players = leoidsState.players.filter((player) => {
      return !player.isOnline || player.isLocal;
    });

    rows.forEach((row) => {
      upsertOnlinePlayer({
        id: row.id,
        display_name: row.name,
        avatar: row.avatar,
        role: row.role,
        status: row.status,
        score: row.score || 0,
        coins: row.coins || 0,
        lat: row.lat,
        lng: row.lng,
        last_seen: row.updatedAt,
      });
    });

    console.log("FIREBASE PLAYERS LIVE", rows);

    drawPlayerMarkers?.();
    renderPlayers?.();
    updatePanel?.();
    updateLeoidsBattleHud?.();
  });

  loadOnlinePlayers();

  console.log("LEOIDS Firebase player sync started.");
  speakText?.("Firebase player sync started.");

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


  async function updateOnlineSession(patchData = {}) {
  const supabase = getSupabaseSafe();

  if (!supabase || !supabase.client || !leoidsState.onlineSessionId) {
    return null;
  }

  const cleanPayload = {};

  Object.entries(patchData).forEach(([key, value]) => {
    if (value !== undefined) {
      cleanPayload[key] = value;
    }
  });

  try {
    const { data, error } = await supabase.client
      .from("leoids_sessions")
      .update(cleanPayload)
      .eq("id", leoidsState.onlineSessionId)
      .select()
      .single();

    if (error) {
      console.error("LEOIDS session update failed:", error, cleanPayload);
      return null;
    }

    return data;
  } catch (error) {
    console.error("LEOIDS session update crashed:", error, cleanPayload);
    return null;
  }
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
  const firebase = window.firebasePlayers;
  const supabase = getSupabaseSafe();
  const local = getLocalPlayer();

  if (!firebase || !position) {
    console.warn("Firebase players module not available yet.");
    return false;
  }

  const sessionId =
    leoidsState.onlineSessionId ||
    supabase?.sessionId ||
    "local_test_session";

  const playerId =
    leoidsState.onlinePlayerId ||
    supabase?.playerId ||
    local?.id ||
    `player_${Date.now()}`;

  leoidsState.onlineSessionId = sessionId;
  leoidsState.onlinePlayerId = playerId;

  const point = {
    lat: Number(position.lat),
    lng: Number(position.lng),
  };

  if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) {
    console.warn("Bad Firebase GPS point:", point);
    return false;
  }

  const now = Date.now();
  const lastPoint = leoidsState.lastGpsPoint || null;
  const lastSyncAt = Number(leoidsState.lastOnlinePositionSyncAt || 0);

  let movedDistance = Infinity;

  if (lastPoint) {
    movedDistance = distanceMeters(lastPoint, point);
  }

  const FORCE_SYNC_MS = 5000;
  const MIN_MOVE_METERS = 2;

  const shouldForceSync = now - lastSyncAt > FORCE_SYNC_MS;
  const shouldSyncMovement = movedDistance >= MIN_MOVE_METERS;

  if (!shouldForceSync && !shouldSyncMovement) {
    return false;
  }

  leoidsState.lastGpsPoint = point;
  leoidsState.lastOnlinePositionSyncAt = now;

  const cleanAccuracy = Number.isFinite(Number(accuracy))
    ? Math.round(Number(accuracy))
    : null;

  const cleanHeading = Number.isFinite(Number(heading))
    ? Math.round(Number(heading))
    : null;

  if (local) {
    local.id = playerId;
    local.isLocal = true;
    local.isOnline = true;
    local.position = point;
    local.accuracy = cleanAccuracy;
    local.heading = cleanHeading;
  }

  const payload = {
    id: playerId,
    sessionId,
    name:
      leoidsState.onlinePlayerName ||
      supabase?.playerName ||
      local?.name ||
      "Player",
    avatar: local?.avatar || "🧍",
    role: local?.role || leoidsState.role || "runner",
    status: local?.status || leoidsState.status || "free",
    lat: point.lat,
    lng: point.lng,
    accuracy: cleanAccuracy,
    heading: cleanHeading,
    online: true,
    updatedAt: now,
  };

  await firebase.updatePlayer(`${sessionId}_${playerId}`, payload);
  firebase.setupDisconnect(`${sessionId}_${playerId}`);

  drawPlayerMarkers?.();

  const map = getMapSafe?.();
  if (map && leoidsState.followMe !== false) {
    map.panTo([point.lat, point.lng], {
      animate: true,
      duration: 0.7,
    });
  }

  renderPlayers?.();
  updatePanel?.();
  updateLeoidsBattleHud?.();

  console.log(
    "FIREBASE GPS SYNC OK + ACCURACY",
    payload,
    "Moved:",
    Math.round(movedDistance),
    "m"
  );

  return true;
}

function stopGpsOnlineSync() {
  if (leoidsState.gpsWatchId !== null && leoidsState.gpsWatchId !== undefined) {
    try {
      navigator.geolocation.clearWatch(leoidsState.gpsWatchId);
    } catch (error) {
      console.warn("Could not stop LEOIDS GPS watch:", error);
    }
  }

  leoidsState.gpsWatchId = null;
}
  
function startGpsOnlineSync() {
  if (!navigator.geolocation) {
    speakText?.("GPS is not available on this device.");
    return false;
  }

  if (!leoidsState.onlineEnabled || !leoidsState.onlineSessionId) {
    speakText?.("Join an online LEOIDS session first.");
    console.warn("Cannot start GPS: no online session.");
    return false;
  }

  stopGpsOnlineSync();

  leoidsState.gpsWatchId = navigator.geolocation.watchPosition(
    async (position) => {
      const rawPoint = {
        lat: Number(position.coords.latitude),
        lng: Number(position.coords.longitude),
      };

      const accuracy = Number(position.coords.accuracy || 999);
      const local = getLocalPlayer();

      if (!local) return;

      local.accuracy = accuracy;

     if (accuracy > 60) {
      const now = Date.now();

  if (now - Number(leoidsState.lastGpsWarningAt || 0) > 12000) {
    leoidsState.lastGpsWarningAt = now;

    showLeoidsCinematicOverlay?.({
      title: "GPS WEAK",
      subtitle: `Accuracy is about ${Math.round(accuracy)}m.\nMove into open space.`,
      icon: "📡",
      theme: "danger",
      duration: 1800,
    });

    playLeoidsSound?.("boundary_warning", 0.45);

    if (navigator.vibrate) {
      navigator.vibrate([80, 60, 80]);
    }
  }
}

      
      const oldPoint = local.position;

      let point = rawPoint;

      if (oldPoint) {
        const jumpDistance = distanceMeters(oldPoint, rawPoint);

        if (accuracy > 80 && jumpDistance > 25) {
          console.warn("GPS ignored: weak jump", {
            accuracy,
            jumpDistance: Math.round(jumpDistance),
          });

          return;
        }

        point = {
          lat: oldPoint.lat + (rawPoint.lat - oldPoint.lat) * 0.35,
          lng: oldPoint.lng + (rawPoint.lng - oldPoint.lng) * 0.35,
        };
      }

      local.position = point;
      local.lat = point.lat;
      local.lng = point.lng;

      await syncLocalPlayerPosition(point);
      await loadOnlinePlayers();

      drawPlayerMarkers?.();
      renderPlayers?.();
      updatePanel?.();
      updateLeoidsBattleHud?.();
      updateLeoidsLiveActionButton?.();

     if (leoidsState.followMe !== false) {
  const map = getMapSafe?.();

  if (map && point) {
    const now = Date.now();

    if (now - Number(leoidsState.lastMapFollowAt || 0) > 2500) {
      leoidsState.lastMapFollowAt = now;

      map.panTo([point.lat, point.lng], {
        animate: true,
        duration: 0.65,
      });
    }
  }
}

      
      console.log("GPS SMOOTH UPDATE", {
        point,
        accuracy,
      });
    },
    (error) => {
      console.warn("LEOIDS GPS sync error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 20000,
    }
  );

  console.log("GPS WATCH STARTED", leoidsState.gpsWatchId);
  speakText?.("Online GPS sync started.");
  return true;
}
function openLeoidsMissionSetupScreen({ returnToLobby = true } = {}) {
  const old = document.getElementById("leoids-mission-setup-screen");
  if (old) old.remove();

  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    alert("Only the host can edit mission setup.");
    return;
  }

  const modal = document.createElement("div");
  modal.id = "leoids-mission-setup-screen";
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
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">
      <h2 style="margin:0;color:#00d4ff;text-align:center;">MISSION SETUP</h2>

      <div style="margin-top:14px;padding:12px;border-radius:16px;background:rgba(255,255,255,.06);">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Boundary</h3>

       <button id="setup-boundary-street" type="button" style="width:100%;min-height:44px;border-radius:14px;background:#202a3c;color:white;font-weight:900;margin-top:8px;border:none;">
          STREET BOUNDARY
        </button>
        

        <button id="setup-boundary-circle" type="button" style="width:100%;min-height:44px;border-radius:14px;background:#00d4ff;color:#05070b;font-weight:1000;border:none;">
          CIRCLE BOUNDARY
        </button>


        <select id="setup-boundary-size" style="width:100%;min-height:44px;margin-top:10px;border-radius:12px;">
          <option value="100">100m - small</option>
          <option value="200">200m - normal</option>
          <option value="350">350m - large</option>
          <option value="500">500m - huge</option>
        </select>

        <button id="setup-set-circle" type="button" style="width:100%;min-height:44px;border-radius:14px;background:#22c55e;color:#05070b;font-weight:1000;margin-top:10px;border:none;">
          SET CIRCLE HERE
        </button>
      </div>

      <div style="margin-top:12px;padding:12px;border-radius:16px;background:rgba(255,255,255,.06);">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Jail / Base</h3>

        <button id="setup-set-base" type="button" style="width:100%;min-height:44px;border-radius:14px;background:#22c55e;color:#05070b;font-weight:1000;border:none;">
          SET JAIL / BASE
        </button>

        <select id="setup-base-radius" style="width:100%;min-height:44px;margin-top:10px;border-radius:12px;">
          <option value="10">10m tight</option>
          <option value="15">15m normal</option>
          <option value="25">25m easy</option>
        </select>
      </div>

      <div style="margin-top:12px;padding:12px;border-radius:16px;background:rgba(255,255,255,.06);">
        <h3 style="margin:0 0 8px;color:#ffd54a;">Round Rules</h3>

        <select id="setup-round-length" style="width:100%;min-height:44px;border-radius:12px;">
          <option value="600">10 minutes</option>
          <option value="900">15 minutes</option>
          <option value="1200">20 minutes</option>
          <option value="1800">30 minutes</option>
        </select>

        <select id="setup-hunter-delay" style="width:100%;min-height:44px;margin-top:10px;border-radius:12px;">
          <option value="30">Hunter delay: 30 seconds</option>
          <option value="60">Hunter delay: 1 minute</option>
          <option value="120">Hunter delay: 2 minutes</option>
          <option value="180">Hunter delay: 3 minutes</option>
          <option value="300">Hunter delay: 5 minutes</option>
        </select>

        <select id="setup-tag-radius" style="width:100%;min-height:44px;margin-top:10px;border-radius:12px;">
          <option value="5">Tag radius: 5m hard</option>
          <option value="10">Tag radius: 10m normal</option>
          <option value="15">Tag radius: 15m easy</option>
          <option value="30">Tag radius: 30m test</option>
        </select>
      </div>

      <button id="setup-save" type="button" style="width:100%;min-height:50px;border-radius:16px;background:#ffd54a;color:#05070b;font-weight:1000;margin-top:16px;border:none;">
        SAVE SETUP
      </button>

      <button id="setup-back" type="button" style="width:100%;min-height:44px;border-radius:16px;background:#202a3c;color:white;font-weight:900;margin-top:10px;border:none;">
        BACK TO LOBBY
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  $("setup-boundary-size").value = String(leoidsState.boundaryRadius || DEFAULT_BOUNDARY_RADIUS);
  $("setup-base-radius").value = String(leoidsState.baseRadius || DEFAULT_BASE_RADIUS);
  $("setup-round-length").value = String(leoidsState.roundTime || DEFAULT_ROUND_SECONDS);
  $("setup-hunter-delay").value = String(leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS);
  $("setup-tag-radius").value = String(leoidsState.tagRadius || DEFAULT_TAG_RADIUS);

  $("setup-boundary-circle").onclick = () => setBoundaryMode("circle");
 $("setup-boundary-street").onclick = () => {
  setBoundaryMode("polygon");

  modal.remove();

  leoidsState.returnToMissionSetupAfterMap = true;
  leoidsState.mapMode = "boundary";

  enterBattleMap?.();
  hideLeoidsMapControls?.();
  showLeoidsMapControls?.("boundary");
  enableMapPointAdding?.();

  speakText?.("Tap the map to add street boundary points.");
};

  $("setup-boundary-size").onchange = (e) => setBoundaryRadius(Number(e.target.value));
  $("setup-base-radius").onchange = (e) => setBaseRadius(Number(e.target.value));
  $("setup-round-length").onchange = (e) => setRoundLength(Number(e.target.value));
  $("setup-hunter-delay").onchange = (e) => setHunterDelay(Number(e.target.value));
  $("setup-tag-radius").onchange = (e) => setTagRadius(Number(e.target.value));

  $("setup-set-circle").onclick = () => setCircleBoundaryHere();

 $("setup-set-base").onclick = () => {
  modal.remove();

  leoidsState.returnToMissionSetupAfterMap = true;
  leoidsState.mapMode = "base";

  enterBattleMap?.();
  hideLeoidsMapControls?.();
  setBaseHere?.();

  speakText?.("Set the jail base on the map.");
};

  $("setup-save").onclick = async () => {
    await saveOnlineSessionConfig?.();
    updatePanel?.();
    speakText?.("Mission setup saved.");
    alert("Mission setup saved.");
  };

  $("setup-back").onclick = () => {
    modal.remove();

    if (returnToLobby && leoidsState.onlineSessionId) {
      openOnlineLobbyScreen(leoidsState.onlineSessionId);
    }
  };
}

  
         
 function refreshBoundaryButtons() {
  const isCircle = leoidsState.boundaryMode === "circle";
  const isPolygon = leoidsState.boundaryMode === "polygon";
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  const show = (id, display = "block") => {
    const el = $(id);
    if (!el) return;
    el.style.display = display;
  };

  const hide = (id) => {
    const el = $(id);
    if (!el) return;
    el.style.display = "none";
  };

  const circleBtn = $("btn-leoids-boundary-circle");
  const streetBtn = $("btn-leoids-boundary-polygon");
  const boundarySize = $("leoids-boundary-size");

  if (circleBtn) {
    circleBtn.classList.toggle("active", isCircle);
    circleBtn.innerText = isCircle ? "⭕ CIRCLE SELECTED" : "⭕ CIRCLE";
  }

  if (streetBtn) {
    streetBtn.classList.toggle("active", isPolygon);
    streetBtn.innerText = isPolygon ? "🟡 STREET SELECTED" : "🟡 STREET BOUNDARY";
  }

  if (!isHost) {
    hide("btn-leoids-set-boundary");
    hide("btn-leoids-add-point");
    hide("btn-leoids-undo-point");
    hide("btn-leoids-confirm-boundary");
    hide("btn-leoids-clear-boundary");
    hide("btn-leoids-set-base");

    if (boundarySize) boundarySize.disabled = true;
    return;
  }

  if (boundarySize) {
    boundarySize.disabled = !isCircle;
    boundarySize.style.opacity = isCircle ? "1" : ".45";
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


  

function setBoundaryRadius(radius = DEFAULT_BOUNDARY_RADIUS) {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    speakText?.("Only the host can change boundary size.");
    return;
  }

  const safeRadius = Math.max(25, Number(radius || DEFAULT_BOUNDARY_RADIUS));

  leoidsState.boundaryRadius = safeRadius;

  if ($("leoids-boundary-size")) {
    $("leoids-boundary-size").value = String(safeRadius);
  }

  if (leoidsState.boundaryMode === "circle" && leoidsState.boundaryCenter) {
    drawCircleBoundary(leoidsState.boundaryCenter, safeRadius);
  }

  saveOnlineSessionConfig?.();
  refreshBoundaryButtons?.();
  updatePanel?.();

  speakText?.(`Circle size set to ${safeRadius} metres.`);
}

          
 function setBoundaryMode(mode = "circle", announce = true) {
  leoidsState.boundaryMode = mode === "polygon" ? "polygon" : "circle";

  const circleBtn = $("btn-leoids-boundary-circle");
  const polygonBtn = $("btn-leoids-boundary-polygon");

  if (circleBtn) {
    const active = leoidsState.boundaryMode === "circle";

    circleBtn.classList.toggle("active", active);
    circleBtn.innerText = active ? "⭕ CIRCLE SELECTED" : "⭕ CIRCLE BOUNDARY";
    circleBtn.style.background = active ? "#00d4ff" : "#102033";
    circleBtn.style.color = active ? "#05070b" : "#dbeafe";
    circleBtn.style.border = active
      ? "2px solid #00d4ff"
      : "1px solid rgba(0,212,255,.45)";
    circleBtn.style.boxShadow = active
      ? "0 0 18px rgba(0,212,255,.38)"
      : "none";
    circleBtn.style.fontWeight = "1000";
  }

  if (polygonBtn) {
    const active = leoidsState.boundaryMode === "polygon";

    polygonBtn.classList.toggle("active", active);
    polygonBtn.innerText = active ? "🟡 STREET SELECTED" : "🟡 STREET BOUNDARY";
    polygonBtn.style.background = active ? "#ffb000" : "#261b08";
    polygonBtn.style.color = active ? "#05070b" : "#fde68a";
    polygonBtn.style.border = active
      ? "2px solid #ffb000"
      : "1px solid rgba(255,176,0,.45)";
    polygonBtn.style.boxShadow = active
      ? "0 0 18px rgba(255,176,0,.38)"
      : "none";
    polygonBtn.style.fontWeight = "1000";
  }

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

  const isBoundary = mode === "boundary";

  const controls = document.createElement("div");
  controls.id = "leoids-map-controls";
  controls.style.position = "fixed";
  controls.style.left = "50%";
  controls.style.bottom = "88px";
  controls.style.transform = "translateX(-50%)";
  controls.style.zIndex = "999999";
  controls.style.width = "min(92vw, 430px)";
  controls.style.display = "grid";
  controls.style.gap = "9px";
  controls.style.pointerEvents = "auto";

  controls.innerHTML = isBoundary
    ? `
      <div style="
        border:2px solid rgba(255,176,0,.85);
        border-radius:24px;
        background:linear-gradient(180deg,#261b08,#05070b);
        color:white;
        padding:14px;
        box-shadow:0 0 28px rgba(255,176,0,.28);
        font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      ">
        <div style="color:#ffb000;font-weight:1000;text-align:center;margin-bottom:10px;">
          STREET BOUNDARY SETUP
        </div>

        <button id="btn-leoids-map-confirm-boundary" type="button" style="
          width:100%;
          min-height:48px;
          border-radius:16px;
          background:#ffb000;
          color:#05070b;
          font-weight:1000;
          border:none;
        ">
          CONFIRM BOUNDARY
        </button>

        <button id="btn-leoids-map-undo" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:16px;
          background:#202a3c;
          color:white;
          font-weight:900;
          border:none;
          margin-top:8px;
        ">
          UNDO LAST POINT
        </button>

        <button id="btn-leoids-map-back" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:16px;
          background:#111827;
          color:white;
          font-weight:900;
          border:none;
          margin-top:8px;
        ">
          BACK TO SETUP
        </button>
      </div>
    `
    : `
      <div style="
        border:2px solid rgba(0,212,255,.85);
        border-radius:24px;
        background:linear-gradient(180deg,#101827,#05070b);
        color:white;
        padding:14px;
        box-shadow:0 0 28px rgba(0,212,255,.28);
        font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      ">
        <div style="color:#00d4ff;font-weight:1000;text-align:center;margin-bottom:10px;">
          JAIL / BASE SETUP
        </div>

        <button id="btn-leoids-map-confirm-base" type="button" style="
          width:100%;
          min-height:48px;
          border-radius:16px;
          background:#00d4ff;
          color:#05070b;
          font-weight:1000;
          border:none;
        ">
          CONFIRM JAIL / BASE
        </button>

        <button id="btn-leoids-map-back" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:16px;
          background:#111827;
          color:white;
          font-weight:900;
          border:none;
          margin-top:8px;
        ">
          BACK TO SETUP
        </button>
      </div>
    `;

  document.body.appendChild(controls);

  document.getElementById("btn-leoids-map-confirm-boundary")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    confirmBoundaryFromMap();
  });

  document.getElementById("btn-leoids-map-confirm-base")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    confirmBaseFromMap();
  });

  document.getElementById("btn-leoids-map-undo")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    undoStreetBoundaryPoint();
    showLeoidsMapControls("boundary");
  });

  const backBtn = document.getElementById("btn-leoids-map-back");
  if (backBtn) {
    backBtn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      backToLeoidsPanelFromMap();
    };
  }
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

function enterBattleMap() {
  leoidsState.mapOpen = true;

  const mapEl = $("map");

  if (mapEl) {
    mapEl.classList.add("leoids-battle-map");
  }

  document.body.classList.add("leoids-mode-active");

  if (typeof hideBottomSheet === "function") {
    hideBottomSheet();
  }

  if (typeof hideActionButton === "function") {
    hideActionButton(false);
  }

  if (typeof closeModal === "function") {
    closeModal("leoids-modal");
  }

  redrawAllMapObjects?.();
  drawPlayerMarkers?.();

  setTimeout(() => {
    showLeoidsBattleHud?.();
    updateLeoidsBattleHud?.();
  }, 120);
}
function exitBattleMap() {
  leoidsState.mapOpen = false;

  const mapEl = $("map");
  if (mapEl) {
    mapEl.classList.remove("leoids-battle-map");
  }

  document.body.classList.remove("leoids-mode-active");

  hideLeoidsBattleHud?.();
  hideLeoidsCommandHub?.();

  showActionButton?.(true);

  redrawAllMapObjects?.();
}
  
function openSetupPanel() {
  hideLeoidsBattleHud?.();
  hideLeoidsCommandHub?.();

  const previousMapMode = leoidsState.mapMode;
  leoidsState.mapMode = "none";

  disableMapPointAdding?.();
  hideLeoidsMapControls?.();

  enterBattleMap?.();
  hideLeoidsBattleHud?.();

  if ($("leoids-boundary-size")) {
    $("leoids-boundary-size").value = String(
      leoidsState.boundaryRadius || DEFAULT_BOUNDARY_RADIUS
    );
  }

  if ($("leoids-base-radius")) {
    $("leoids-base-radius").value = String(
      leoidsState.baseRadius || DEFAULT_BASE_RADIUS
    );
  }

  if ($("leoids-round-length")) {
    $("leoids-round-length").value = String(
      leoidsState.roundTime || DEFAULT_ROUND_SECONDS
    );
  }

  if ($("leoids-hunter-delay")) {
    $("leoids-hunter-delay").value = String(
      leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS
    );
  }

  if ($("leoids-tag-radius")) {
    $("leoids-tag-radius").value = String(
      leoidsState.tagRadius || DEFAULT_TAG_RADIUS
    );
  }

  showModal?.("leoids-modal");

  wirePanelButtons?.();
  setRole?.(leoidsState.role);
  refreshBoundaryButtons?.();
  renderPlayers?.();
  updatePanel?.();

  if (previousMapMode === "boundary" || previousMapMode === "base") {
    speakText?.("Back to setup.");
  }
}



function closeSetupPanel() {
  closeModal?.("leoids-modal");

  disableMapPointAdding?.();
  hideLeoidsMapControls?.();

  leoidsState.mapMode = "none";
  leoidsState.pendingBasePoint = null;

  if ($("map")?.classList.contains("leoids-battle-map")) {
    showLeoidsBattleHud?.();
  }

  updateLeoidsBattleHud?.();
}
  
 function setRoundLength(seconds = DEFAULT_ROUND_SECONDS) {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    speakText?.("Only the host can change round length.");
    return;
  }

  const safeTime = Math.max(60, Number(seconds || DEFAULT_ROUND_SECONDS));

  leoidsState.roundTime = safeTime;
  leoidsState.timeLeft = safeTime;

  if ($("leoids-round-length")) {
    $("leoids-round-length").value = String(safeTime);
  }

  saveOnlineSessionConfig?.();
  updatePanel?.();

  speakText?.(`Round length set to ${Math.floor(safeTime / 60)} minutes.`);
}

 function setHunterDelay(seconds = DEFAULT_HUNTER_DELAY_SECONDS) {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    speakText?.("Only the host can change hunter delay.");
    return;
  }

  const safeDelay = Math.max(0, Number(seconds || DEFAULT_HUNTER_DELAY_SECONDS));

  leoidsState.hunterDelay = safeDelay;
  leoidsState.hunterDelayLeft = safeDelay;

  if ($("leoids-hunter-delay")) {
    $("leoids-hunter-delay").value = String(safeDelay);
  }

  saveOnlineSessionConfig?.();
  updatePanel?.();

  speakText?.(`Hunter delay set.`);
}


function setBaseHere() {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    alert("Only the host can set the jail base.");
    speakText?.("Only the host can set the jail base.");
    return;
  }

  leoidsState.mapMode = "base";
  leoidsState.pendingBasePoint = null;

  closeModal?.("leoids-modal");
  showActionButton?.(false);
  hideLeoidsBattleHud?.();
  hideLeoidsCommandHub?.();

  showLeoidsMapControls("base");
  enableMapPointAdding();

  showLeoidsEvent(
    "SET JAIL BASE",
    "Tap the map where caught runners should go.",
    "🛡️",
    "base"
  );

  speakText?.("Tap the map to set the jail base.");
}


  function setTagRadius(radius = DEFAULT_TAG_RADIUS) {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    speakText?.("Only the host can change tag radius.");
    return;
  }

  const safeRadius = Math.max(3, Number(radius || DEFAULT_TAG_RADIUS));

  leoidsState.tagRadius = safeRadius;

  if ($("leoids-tag-radius")) {
    $("leoids-tag-radius").value = String(safeRadius);
  }

  saveOnlineSessionConfig?.();
  updatePanel?.();

  speakText?.(`Tag radius set to ${safeRadius} metres.`);
}


function setBaseRadius(radius = DEFAULT_BASE_RADIUS) {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    speakText?.("Only the host can change the jail base radius.");
    return;
  }

  const safeRadius = Math.max(5, Number(radius || DEFAULT_BASE_RADIUS));

  leoidsState.baseRadius = safeRadius;

  if ($("leoids-base-radius")) {
    $("leoids-base-radius").value = String(safeRadius);
  }

  if (leoidsState.basePoint) {
    drawBasePoint(leoidsState.basePoint, safeRadius);
  }

  saveOnlineSessionConfig?.();
  updatePanel?.();

  speakText?.(`Jail base radius set to ${safeRadius} metres.`);
}

  
 function setCircleBoundaryHere() {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    alert("Only the host can set the boundary.");
    speakText?.("Only the host can set the boundary.");
    return;
  }

  const map = getMapSafe();

  if (!map) {
    alert("Map is not ready yet.");
    speakText?.("Map is not ready yet.");
    return;
  }

  const center = map.getCenter();

  leoidsState.boundaryMode = "circle";
  leoidsState.boundaryCenter = {
    lat: Number(center.lat),
    lng: Number(center.lng),
  };

  leoidsState.boundaryPoints = [];
  leoidsState.mapMode = "none";
  leoidsState.pendingBasePoint = null;

  disableMapPointAdding?.();
  hideLeoidsMapControls?.();

  clearPolygonBoundary();
  drawCircleBoundary(leoidsState.boundaryCenter, leoidsState.boundaryRadius);

  refreshBoundaryButtons?.();
  seedPlayerPositions();
  redrawAllMapObjects?.();
  updatePanel?.();

  saveOnlineSessionConfig?.();

  showLeoidsEvent(
    "CIRCLE SET",
    `Battle zone ready.\nRadius: ${leoidsState.boundaryRadius}m`,
    "⭕",
    "base"
  );

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

function confirmBoundaryFromMap() {
  if (leoidsState.boundaryMode === "polygon") {
    if (
      !Array.isArray(leoidsState.boundaryPoints) ||
      leoidsState.boundaryPoints.length < 3
    ) {
      alert("Add at least 3 boundary points.");
      return;
    }

    clearPolygonBoundary?.();
    drawPolygonBoundary?.(leoidsState.boundaryPoints);

  } else {
    if (!leoidsState.boundaryCenter) {
      alert("Set a circle center first.");
      return;
    }

    drawCircleBoundary?.(
      leoidsState.boundaryCenter,
      Number(
        leoidsState.boundaryRadius ||
        DEFAULT_BOUNDARY_RADIUS
      )
    );
  }

  saveOnlineSessionConfig?.();

  showLeoidsEvent?.(
    "BOUNDARY CONFIRMED",
    "Mission boundary updated.",
    "🗺️",
    "boundary"
  );

  speakText?.("Boundary confirmed.");

  leoidsState.mapMode = null;

  hideLeoidsMapControls?.();

  if (leoidsState.returnToMissionSetupAfterMap) {
    leoidsState.returnToMissionSetupAfterMap = false;

    setTimeout(() => {
      openLeoidsMissionSetupScreen?.({
        returnToLobby: true,
      });
    }, 250);
  }
}



function confirmBaseFromMap() {
  if (!leoidsState.basePoint) {
    alert("Set a jail base first.");
    return;
  }

  clearBasePoint?.();

  drawBasePoint?.(
    leoidsState.basePoint,
    Number(
      leoidsState.baseRadius ||
      DEFAULT_BASE_RADIUS
    )
  );

  saveOnlineSessionConfig?.();

  showLeoidsEvent?.(
    "JAIL BASE CONFIRMED",
    "Runner jail/base updated.",
    "🏛️",
    "base"
  );

  speakText?.("Jail base confirmed.");

  leoidsState.mapMode = null;

  hideLeoidsMapControls?.();

  if (leoidsState.returnToMissionSetupAfterMap) {
    leoidsState.returnToMissionSetupAfterMap = false;

    setTimeout(() => {
      openLeoidsMissionSetupScreen?.({
        returnToLobby: true,
      });
    }, 250);
  }
}


  function setBaseHere() {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    alert("Only the host can set the jail base.");
    speakText?.("Only the host can set the jail base.");
    return;
  }

  leoidsState.mapMode = "base";
  leoidsState.pendingBasePoint = null;

  closeModal?.("leoids-modal");
  showActionButton?.(false);
  hideLeoidsBattleHud?.();
  hideLeoidsCommandHub?.();

  showLeoidsMapControls("base");
  enableMapPointAdding();

  showLeoidsEvent(
    "SET JAIL BASE",
    "Tap the map where caught runners should go.",
    "🛡️",
    "base"
  );

  speakText?.("Tap the map to set the jail base.");
}


  
function backToLeoidsPanelFromMap() {
  leoidsState.mapMode = "none";
  leoidsState.pendingBasePoint = null;

  disableMapPointAdding?.();
  hideLeoidsMapControls?.();
  hideLeoidsBattleHud?.();
  hideLeoidsCommandHub?.();
  showActionButton?.(false);

  closeModal?.("leoids-modal");

  setTimeout(() => {
    showModal?.("leoids-modal");
    wirePanelButtons?.();
    setRole?.(leoidsState.role);
    refreshBoundaryButtons?.();
    renderPlayers?.();
    updatePanel?.();
  }, 80);

  speakText?.("Back to LEOIDS setup.");
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

  // Always show hunters
  if (player.role === "hunter") return true;

  // Hunters must be able to see runners for testing/tagging
  if (local.role === "hunter" && player.role === "runner") {
    return true;
  }

  // Runners can see other runners for now while we test multiplayer
  if (local.role === "runner" && player.role === "runner") {
    return true;
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
  const map = getMapSafe?.();

  if (!map) return;

  if (!leoidsState.playerMarkers) {
    leoidsState.playerMarkers = {};
  }

  const activeIds = new Set();

  function animateMarkerTo(marker, targetLatLng) {
    const startLatLng = marker.getLatLng();
    const startLat = Number(startLatLng.lat);
    const startLng = Number(startLatLng.lng);
    const endLat = Number(targetLatLng[0]);
    const endLng = Number(targetLatLng[1]);

    if (
      !Number.isFinite(startLat) ||
      !Number.isFinite(startLng) ||
      !Number.isFinite(endLat) ||
      !Number.isFinite(endLng)
    ) {
      marker.setLatLng(targetLatLng);
      return;
    }

    const distance = distanceMeters(
      { lat: startLat, lng: startLng },
      { lat: endLat, lng: endLng }
    );

    if (distance > 80) {
      marker.setLatLng(targetLatLng);
      return;
    }

    const duration = 900;
    const startedAt = performance.now();

    if (marker.__leoidsMoveFrame) {
      cancelAnimationFrame(marker.__leoidsMoveFrame);
    }

    function step(now) {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const lat = startLat + (endLat - startLat) * eased;
      const lng = startLng + (endLng - startLng) * eased;

      marker.setLatLng([lat, lng]);

      if (t < 1) {
        marker.__leoidsMoveFrame = requestAnimationFrame(step);
      }
    }

    marker.__leoidsMoveFrame = requestAnimationFrame(step);
  }

  leoidsState.players.forEach((player) => {
    if (!player.position) return;

    const id = String(player.id || player.name);

    activeIds.add(id);

    const latlng = [
      Number(player.position.lat),
      Number(player.position.lng),
    ];

    if (
      !Number.isFinite(latlng[0]) ||
      !Number.isFinite(latlng[1])
    ) {
      return;
    }

    let color = "#22c55e";

    if (player.role === "hunter") {
      color = "#ff3b3b";
    }

    if (player.status === "jailed") {
      color = "#9ca3af";
    }

    const size = player.isLocal ? 26 : 22;
    const glow = player.isLocal ? 22 : 14;

    const icon = L.divIcon({
      className: "leoids-player-marker",
      html: `
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:${color};
          border:3px solid white;
          box-shadow:0 0 ${glow}px ${color};
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:12px;
          font-weight:1000;
        ">
          ${player.role === "hunter" ? "H" : player.status === "jailed" ? "J" : "R"}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    let marker = leoidsState.playerMarkers[id];

    if (!marker) {
      marker = L.marker(latlng, {
        icon,
        zIndexOffset: player.isLocal ? 1000 : 0,
      }).addTo(map);

      marker.bindTooltip(
        `${player.name || "Player"} • ${player.role} • ${player.status}`,
        {
          permanent: false,
          direction: "top",
        }
      );

      marker.on("click", () => {
        handlePlayerMarkerTap?.(player);
      });

      leoidsState.playerMarkers[id] = marker;
    } else {
      marker.setIcon(icon);

      marker.setTooltipContent?.(
        `${player.name || "Player"} • ${player.role} • ${player.status}`
      );

      animateMarkerTo(marker, latlng);
    }
  });

  Object.keys(leoidsState.playerMarkers).forEach((id) => {
    if (!activeIds.has(id)) {
      const marker = leoidsState.playerMarkers[id];

      if (marker.__leoidsMoveFrame) {
        cancelAnimationFrame(marker.__leoidsMoveFrame);
      }

      map.removeLayer(marker);
      delete leoidsState.playerMarkers[id];
    }
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


async function syncPlayerToOnline(player) {
  const supabase = getSupabaseSafe();

  if (!supabase?.client || !player?.id) {
    return null;
  }

  const payload = {
    role: player.role || "runner",
    status: player.status || "free",
    score: Number(player.score || 0),
    coins: Number(player.coins || 0),
    lat: player.position ? Number(player.position.lat) : null,
    lng: player.position ? Number(player.position.lng) : null,
    last_seen: new Date().toISOString(),
  };

  const { error } = await supabase.client
    .from("leoids_players")
    .update(payload)
    .eq("id", player.id);

  if (error) {
    console.warn("Could not sync player online:", error, payload);
    return null;
  }

  return payload;
}

function awardLeoidsCombo({
  player = null,
  points = 0,
  coins = 0,
  combo = 1,
  theme = "gold",
  label = "COMBO"
} = {}) {

  if (!player) return;

  player.score = Number(player.score || 0) + points;
  player.coins = Number(player.coins || 0) + coins;

  if (
    player.isLocal ||
    player.id === leoidsState.onlinePlayerId ||
    !player.isOnline
  ) {
    leoidsState.score =
      Number(leoidsState.score || 0) + points;

    leoidsState.coins =
      Number(leoidsState.coins || 0) + coins;
  }

  showLeoidsScorePopup({
    text: `+${points}`,
    theme
  });

  showLeoidsCinematicOverlay({
    title: `${combo}x ${label}`,
    subtitle: `+${points} points • +${coins} coins`,
    icon: "⚡",
    theme,
    duration: 1400,
  });

  if (navigator.vibrate) {
    navigator.vibrate([70, 40, 70]);
  }

  updatePanel?.();
  updateLeoidsBattleHud?.();
}

  
function showLeoidsScorePopup({
  text = "+0",
  theme = "base",
  duration = 1300,
} = {}) {
  const colors = {
    base: "#00d4ff",
    runner: "#22c55e",
    hunter: "#ff3b3b",
    gold: "#ffd54a",
    danger: "#ffb000",
  };

  const color = colors[theme] || colors.base;

  const popup = document.createElement("div");
  popup.className = "leoids-score-popup";
  popup.style.position = "fixed";
  popup.style.left = "50%";
  popup.style.top = "42%";
  popup.style.transform = "translate(-50%, -50%) scale(.85)";
  popup.style.zIndex = "999999";
  popup.style.pointerEvents = "none";
  popup.style.color = color;
  popup.style.fontSize = "42px";
  popup.style.fontWeight = "1000";
  popup.style.textShadow = `0 0 20px ${color}`;
  popup.style.fontFamily = "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  popup.textContent = text;

  document.body.appendChild(popup);

  popup.animate(
    [
      { opacity: 0, transform: "translate(-50%, -35%) scale(.85)" },
      { opacity: 1, transform: "translate(-50%, -50%) scale(1.08)" },
      { opacity: 0, transform: "translate(-50%, -75%) scale(1)" },
    ],
    {
      duration,
      easing: "ease-out",
      fill: "forwards",
    }
  );

  setTimeout(() => {
    popup.remove();
  }, duration + 80);
}

window.showLeoidsScorePopup = showLeoidsScorePopup;
  
  
async function sendRunnerToJail(runner, taggedBy = null) {

  if (!runner || runner.role !== "runner") return false;
  if (runner.status === "jailed") return false;

  runner.status = "jailed";
  runner.jailedAtBase = false;

  if (leoidsState.basePoint) {
    runner.position =
      randomNearbyPoint(leoidsState.basePoint, 5);

    runner.jailedAtBase = true;
  }

  playLeoidsSound?.("player_tagged", 1);

  const hunterName =
    taggedBy?.name || "Hunter";

  if (taggedBy) {

    taggedBy.tagStreak =
      Number(taggedBy.tagStreak || 0) + 1;

    const combo =
      taggedBy.tagStreak;

    const points =
      50 + Math.max(0, combo - 1) * 15;

    const coins =
      10 + Math.max(0, combo - 1) * 3;

    awardLeoidsCombo?.({
      player: taggedBy,
      points,
      coins,
      combo,
      theme: "hunter",
      label: "TAG STREAK"
    });

    showLeoidsCinematicOverlay?.({
      title: "RUNNER TAGGED",
      subtitle:
        `${runner.name} captured by ${hunterName}`,
      icon: "🔒",
      theme: "hunter",
      duration: 1400,
    });
  }

  const firebase =
    window.firebasePlayers;

  const supabase =
    getSupabaseSafe();

  const sessionId =
    leoidsState.onlineSessionId ||
    supabase?.sessionId;

  if (
    firebase &&
    sessionId &&
    runner.id
  ) {

    await firebase.updatePlayer(
      `${sessionId}_${runner.id}`,
      {
        id: runner.id,
        sessionId,

        name:
          runner.name || "Runner",

        avatar:
          runner.avatar || "🧍",

        role: "runner",

        status: "jailed",

        lat:
          runner.position?.lat ?? null,

        lng:
          runner.position?.lng ?? null,

        online: true,

        updatedAt: Date.now(),
      }
    );

    console.log(
      "FIREBASE TAG SYNC OK",
      runner.name
    );
  }

  drawPlayerMarkers?.();

  renderPlayers?.();

  updatePanel?.();

  updateLeoidsBattleHud?.();

  showLeoidsEvent(
    "RUNNER JAILED",
    `${runner.name} was tagged by ${hunterName}.\nGo to jail/base.`,
    "🔒",
    "hunter"
  );

  if (navigator.vibrate) {
    navigator.vibrate([180, 90, 180]);
  }

  speakText?.(
    `${runner.name} tagged. Runner sent to jail.`
  );

  checkHunterWin?.();

  return true;
}


async function tagSpecificRunner(runner) {
  const local = getLocalPlayer();

  if (!local || !runner) return false;

  if (!leoidsState.active) {
    speakText?.("Round has not started.");
    return false;
  }

  if (local.role !== "hunter") {
    showLeoidsEvent("HUNTERS ONLY", "Only hunters can tag runners.", "🔴", "hunter");
    speakText?.("Only hunters can tag runners.");
    return false;
  }

  if (!leoidsState.huntersReleased) {
    showLeoidsEvent(
      "HUNTERS LOCKED",
      `Wait ${formatTime(leoidsState.hunterDelayLeft)} before tagging.`,
      "⏱️",
      "hunter"
    );
    speakText?.("Hunters have not been released yet.");
    return false;
  }

  if (runner.role !== "runner" || runner.status === "jailed") {
    speakText?.("That runner cannot be tagged.");
    return false;
  }

  if (!local.position || !runner.position) {
    showLeoidsEvent(
      "LOCATION NEEDED",
      "Both hunter and runner need a known position.",
      "📍",
      "hunter"
    );
    speakText?.("Location needed for tag verification.");
    return false;
  }

  const distance = distanceMeters(local.position, runner.position);
  const tagRadius = Number(leoidsState.tagRadius || DEFAULT_TAG_RADIUS);

  if (distance > tagRadius) {
    showLeoidsEvent(
      "OUT OF RANGE",
      `${runner.name} is ${Math.round(distance)}m away.\nTag range: ${tagRadius}m`,
      "📍",
      "hunter"
    );
    speakText?.("Runner is not in tag range.");
    return false;
  }

  return await sendRunnerToJail(runner, local);
}

async function syncPlayerToOnline(player) {
  const supabase = getSupabaseSafe();

  if (!supabase?.client || !player?.id) return null;

  const payload = {
    role: player.role || "runner",
    status: player.status || "free",
    score: Number(player.score || 0),
    coins: Number(player.coins || 0),
    lat: player.position ? Number(player.position.lat) : null,
    lng: player.position ? Number(player.position.lng) : null,
    last_seen: new Date().toISOString(),
  };

  const { error } = await supabase.client
    .from("leoids_players")
    .update(payload)
    .eq("id", player.id);

  if (error) {
    console.warn("Could not sync player online:", error, payload);
    return null;
  }

  return payload;
}


async function tagNearestRunner() {
  const local = getLocalPlayer();

  if (!local) {
    speakText?.("No local player found.");
    return false;
  }

  if (!leoidsState.active) {
    speakText?.("Round has not started.");
    return false;
  }

  if (local.role !== "hunter") {
    showLeoidsEvent(
      "HUNTERS ONLY",
      "Only hunters can tag runners.",
      "🔴",
      "hunter"
    );

    speakText?.("Only hunters can tag runners.");
    return false;
  }

  if (!leoidsState.huntersReleased) {
    showLeoidsEvent(
      "HUNTERS LOCKED",
      `Wait ${formatTime(leoidsState.hunterDelayLeft)} before tagging.`,
      "⏱️",
      "hunter"
    );

    speakText?.("Hunters have not been released yet.");
    return false;
  }

  if (!local.position) {
    showLeoidsEvent(
      "LOCATION NEEDED",
      "Your position is not known yet.",
      "📍",
      "hunter"
    );

    speakText?.("Your location is not known yet.");
    return false;
  }

  const runners = leoidsState.players.filter(
    (player) =>
      player.role === "runner" &&
      player.status === "free" &&
      player.id !== local.id &&
      player.position
  );

  if (!runners.length) {
    showLeoidsEvent(
      "NO RUNNERS",
      "No free runners are available to tag.",
      "🔴",
      "hunter"
    );

    speakText?.("No free runners available.");
    return false;
  }

  let closestRunner = null;
  let closestDistance = Infinity;

  runners.forEach((runner) => {
    const distance = distanceMeters(local.position, runner.position);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestRunner = runner;
    }
  });

  const tagRadius = Number(leoidsState.tagRadius || DEFAULT_TAG_RADIUS);

  console.log("TAG CHECK", {
    hunter: local.name,
    runner: closestRunner?.name,
    distance: Math.round(closestDistance),
    tagRadius,
    huntersReleased: leoidsState.huntersReleased,
  });

  if (!closestRunner || closestDistance > tagRadius) {
    showLeoidsEvent(
      "NO TAG",
      `Nearest runner is ${Math.round(closestDistance)}m away.\nTag range: ${tagRadius}m`,
      "📍",
      "hunter"
    );

    speakText?.("No runner in tag range.");
    return false;
  }

  return await sendRunnerToJail(closestRunner, local);
}

function rescueJailedRunners() {
  const local = getLocalPlayer();

  if (!local) {
    speakText?.("No local player found.");
    return;
  }

  if (local.role !== "runner") {
    showLeoidsEvent("RUNNERS ONLY", "Only runners can rescue jailed players.", "🟢", "runner");
    speakText?.("Only runners can rescue jailed players.");
    return;
  }

  if (local.status === "jailed") {
    showLeoidsEvent("YOU ARE JAILED", "You cannot rescue while jailed.\nWait for another runner.", "🔒", "danger");
    speakText?.("You are jailed. Wait for another runner to rescue you.");
    return;
  }

  if (!leoidsState.basePoint && window.__leoidsBasePoint) {
    leoidsState.basePoint = window.__leoidsBasePoint;
  }

  if (!leoidsState.basePoint) {
    showLeoidsEvent("NO JAIL BASE", "Set the jail/base before rescuing.", "🛡️", "base");
    speakText?.("Set the jail base first.");
    return;
  }

  if (!local.position) {
    showLeoidsEvent("LOCATION NEEDED", "Your position is not known yet.", "📍", "base");
    speakText?.("Your location is not known yet.");
    return;
  }

  const now = Date.now();

  if (now - Number(leoidsState.lastRescueAt || 0) < 3000) return;

  const distanceToBase = distanceMeters(local.position, leoidsState.basePoint);
  const baseRadius = Number(leoidsState.baseRadius || DEFAULT_BASE_RADIUS);

  if (distanceToBase > baseRadius) {
    showLeoidsEvent(
      "TOO FAR FROM BASE",
      `Get inside the rescue zone.\nDistance: ${Math.round(distanceToBase)}m / ${baseRadius}m`,
      "📍",
      "base"
    );

    speakText?.("You are not close enough to the jail base.");
    return;
  }

  const jailedRunners = leoidsState.players.filter(
    (player) => player.role === "runner" && player.status === "jailed"
  );

  if (!jailedRunners.length) {
    showLeoidsEvent("NO ONE TO RESCUE", "There are no jailed runners right now.", "🛡️", "base");
    speakText?.("No runners need rescuing.");
    return;
  }

  jailedRunners.forEach((runner) => {
    runner.status = "free";
    runner.jailedAtBase = false;
    runner.position = randomNearbyPoint(leoidsState.basePoint, 18);
  });

  playLeoidsSound?.("jail_rescue", 1);

  if (navigator.vibrate) {
    navigator.vibrate([80, 60, 80, 60, 220]);
  }

  document.body.animate(
    [{ filter: "brightness(1.7)" }, { filter: "brightness(1)" }],
    { duration: 550, easing: "ease-out" }
  );

  const rescuedCount = jailedRunners.length;
  const points = rescuedCount * 75;
  const coins = rescuedCount * 15;

 awardLeoidsCombo({
  player: local,
  points,
  coins,
  combo: rescuedCount,
  theme: "runner",
  label: "RESCUE"
});

  if (local.isLocal || local.id === leoidsState.onlinePlayerId || !local.isOnline) {
    leoidsState.score = Number(leoidsState.score || 0) + points;
    leoidsState.coins = Number(leoidsState.coins || 0) + coins;
  }

  leoidsState.lastRescueAt = now;

  drawPlayerMarkers?.();
  renderPlayers?.();
  updatePanel?.();
  updateLeoidsBattleHud?.();

showLeoidsCinematicOverlay({
  title: "RESCUE COMPLETE",
  subtitle: `${rescuedCount} runner${rescuedCount === 1 ? "" : "s"} rescued`,
  icon: "🟢",
  theme: "runner"
});
  
  showLeoidsEvent(
    "RESCUE COMPLETE",
    `${rescuedCount} runner${rescuedCount === 1 ? "" : "s"} rescued.\n+${points} points`,
    "🟢",
    "runner"
  );

  speakText?.(
    rescuedCount === 1
      ? "Rescue complete. One runner released."
      : `Rescue complete. ${rescuedCount} runners released.`
  );
}

  
  
  function runAITagChecks() {
  if (!leoidsState.active) return;
  if (!leoidsState.huntersReleased) return;

  const hunters = leoidsState.players.filter(
    (player) =>
      player.role === "hunter" &&
      player.status === "free" &&
      player.position
  );

  const runners = leoidsState.players.filter(
    (player) =>
      player.role === "runner" &&
      player.status === "free" &&
      player.position
  );

  const tagRadius = Number(leoidsState.tagRadius || DEFAULT_TAG_RADIUS);

  hunters.forEach((hunter) => {
    runners.forEach((runner) => {
      if (hunter.id === runner.id) return;
      if (runner.status !== "free") return;

      const distance = distanceMeters(hunter.position, runner.position);

      if (distance <= tagRadius) {
        sendRunnerToJail(runner, hunter);
      }
    });
  });

  checkHunterWin?.();
}


function ensureLeoidsLiveActionButtonStyle() {
  if (document.getElementById("leoids-live-action-button-style")) return;

  const style = document.createElement("style");
  style.id = "leoids-live-action-button-style";

  style.textContent = `
    @keyframes leoidsLiveActionPulse {
      0% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(1.05); }
      100% { transform: translateX(-50%) scale(1); }
    }

    @keyframes leoidsLiveActionUrgent {
      0% { transform: translateX(-50%) scale(1); filter: brightness(1); }
      50% { transform: translateX(-50%) scale(1.1); filter: brightness(1.4); }
      100% { transform: translateX(-50%) scale(1); filter: brightness(1); }
    }

    #leoids-live-action-button {
      animation: leoidsLiveActionPulse .75s infinite;
    }

    #leoids-live-action-button.urgent {
      animation: leoidsLiveActionUrgent .38s infinite;
    }
  `;

  document.head.appendChild(style);
}

  
function updateLeoidsLiveActionButton() {
  ensureLeoidsLiveActionButtonStyle?.();

  let btn = document.getElementById("leoids-live-action-button");

  if (!btn) {
    btn = document.createElement("button");
    btn.id = "leoids-live-action-button";
    btn.type = "button";

    btn.style.position = "fixed";
    btn.style.left = "50%";
    btn.style.bottom = "24px";
    btn.style.transform = "translateX(-50%)";
    btn.style.zIndex = "999999";
    btn.style.width = "min(92vw,420px)";
    btn.style.minHeight = "72px";
    btn.style.borderRadius = "26px";
    btn.style.border = "none";
    btn.style.fontSize = "24px";
    btn.style.fontWeight = "1000";
    btn.style.letterSpacing = ".04em";
    btn.style.boxShadow = "0 0 34px rgba(0,0,0,.45)";
    btn.style.display = "none";

    document.body.appendChild(btn);
  }

  const local = getLocalPlayer?.();

  if (!leoidsState.active || !local || !local.position) {
    btn.style.display = "none";
    return;
  }

  if (local.role === "hunter") {
    if (!leoidsState.huntersReleased) {
      btn.style.display = "none";
      return;
    }

    const tagRadius = Number(leoidsState.tagRadius || DEFAULT_TAG_RADIUS);

    let closestRunner = null;
    let closestDistance = Infinity;

    leoidsState.players.forEach((player) => {
      if (!player.position) return;
      if (player.id === local.id) return;
      if (player.role !== "runner") return;
      if (player.status !== "free") return;

      const distance = distanceMeters(local.position, player.position);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestRunner = player;
      }
    });

    if (!closestRunner || closestDistance > tagRadius) {
      btn.style.display = "none";
      return;
    }

    const now = Date.now();

   if (now - Number(leoidsState.lastTagRangeVibrateAt || 0) > 1200) {
  leoidsState.lastTagRangeVibrateAt = now;

  if (navigator.vibrate) {
    navigator.vibrate(60);
  }

  playLeoidsSound?.("countdown_tick", 0.4);
}

    btn.style.display = "block";
    btn.classList.toggle("urgent", closestDistance <= tagRadius / 2);
    btn.innerText = `🔴 TAG ${closestRunner.name || "RUNNER"}`;
    btn.style.background = "#ff3b3b";
    btn.style.color = "white";
    btn.style.boxShadow = "0 0 38px rgba(255,59,59,.75)";

    btn.onclick = async () => {
      unlockLeoidsAudio?.();
      playLeoidsSound?.("button_click", 0.8);

      btn.disabled = true;
      btn.innerText = "TAGGING...";

      await tagSpecificRunner?.(closestRunner);

      setTimeout(() => {
        btn.disabled = false;
        updateLeoidsLiveActionButton?.();
      }, 700);
    };

    return;
  }

  if (local.role === "runner") {
    if (local.status === "jailed") {
      btn.style.display = "none";
      return;
    }

    if (!leoidsState.basePoint) {
      btn.style.display = "none";
      return;
    }

    const hasJailedRunners = leoidsState.players.some(
      (player) => player.role === "runner" && player.status === "jailed"
    );

    if (!hasJailedRunners) {
      btn.style.display = "none";
      return;
    }

    const baseRadius = Number(leoidsState.baseRadius || DEFAULT_BASE_RADIUS);
    const distanceToBase = distanceMeters(local.position, leoidsState.basePoint);

    if (distanceToBase > baseRadius) {
      btn.style.display = "none";
      return;
    }

    btn.style.display = "block";
    btn.innerText = "🟢 RESCUE TEAM";
    btn.style.background = "#22c55e";
    btn.style.color = "#05070b";
    btn.style.boxShadow = "0 0 38px rgba(34,197,94,.75)";

    btn.onclick = () => {
      unlockLeoidsAudio?.();
      playLeoidsSound?.("button_click", 0.8);

      tryReleaseJailedRunners?.();

      setTimeout(() => {
        updateLeoidsLiveActionButton?.();
      }, 700);
    };

    return;
  }

  btn.style.display = "none";
}


function hideLeoidsLiveActionButton() {
  const btn = document.getElementById("leoids-live-action-button");
  if (btn) btn.remove();
}

  
  
function updateLeoidsBattleHud() {
  let hud = document.getElementById("leoids-battle-hud");

  if (!hud) {
    hud = document.createElement("div");
    hud.id = "leoids-battle-hud";
    hud.style.position = "fixed";
    hud.style.top = "12px";
    hud.style.left = "50%";
    hud.style.transform = "translateX(-50%)";
    hud.style.zIndex = "999999";
    hud.style.minWidth = "260px";
    hud.style.maxWidth = "94vw";
    hud.style.pointerEvents = "none";
    document.body.appendChild(hud);
  }

  const local = getLocalPlayer();

  if (!leoidsState.active || !local) {
    hud.style.display = "none";
    return;
  }

  hud.style.display = "block";

  const roleColor =
    local.role === "hunter"
      ? "#ff3b3b"
      : local.status === "jailed"
      ? "#9ca3af"
      : "#22c55e";

  const roleLabel =
    local.role === "hunter"
      ? "HUNTER"
      : local.status === "jailed"
      ? "JAILED"
      : "RUNNER";

  const statusText = getLeoidsHudStatusText();

  const timeText = formatTime?.(leoidsState.timeLeft || 0) || "00:00";
  const hunterDelayText = formatTime?.(leoidsState.hunterDelayLeft || 0) || "00:00";

  const hunterWarning =
    !leoidsState.huntersReleased &&
    Number(leoidsState.hunterDelayLeft || 0) <= 10;

  const hunterReleased = !!leoidsState.huntersReleased;

  const pulseStyle = hunterWarning
    ? "animation:leoidsHudPulse .75s infinite;"
    : "";

  const hunterText = hunterReleased
    ? "RELEASED"
    : hunterDelayText;

  let nearestDistance = Infinity;
  let nearestLabel = "NONE";

  leoidsState.players.forEach((player) => {
    if (!player.position || !local.position || player.id === local.id) return;

    if (local.role === "hunter" && player.role !== "runner") return;
    if (local.role === "runner" && player.role !== "hunter") return;

    const distance = distanceMeters(local.position, player.position);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestLabel = player.name || player.role || "PLAYER";
    }
  });

  const nearestText =
    Number.isFinite(nearestDistance)
      ? `${Math.round(nearestDistance)}m`
      : "--";

  const accuracy =
    Number.isFinite(local.accuracy)
      ? `${Math.round(local.accuracy)}m`
      : "--";

  if (!document.getElementById("leoids-hud-animation-style")) {
    const style = document.createElement("style");
    style.id = "leoids-hud-animation-style";
    style.textContent = `
      @keyframes leoidsHudPulse {
        0% { transform:scale(1); box-shadow:0 0 18px rgba(255,59,59,.35); }
        50% { transform:scale(1.04); box-shadow:0 0 34px rgba(255,59,59,.75); }
        100% { transform:scale(1); box-shadow:0 0 18px rgba(255,59,59,.35); }
      }
    `;
    document.head.appendChild(style);
  }

  hud.innerHTML = `
    <div style="
      background:rgba(5,10,18,.94);
      border:2px solid ${roleColor};
      border-radius:22px;
      padding:12px 14px;
      box-shadow:0 0 24px ${roleColor}55;
      backdrop-filter:blur(10px);
      color:white;
      font-family:system-ui,-apple-system,sans-serif;
    ">
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr 1fr;
        gap:10px;
        text-align:center;
      ">
        <div>
          <div style="font-size:10px;opacity:.65;letter-spacing:1px;">ROLE</div>
          <div style="font-size:17px;font-weight:1000;color:${roleColor};">
            ${roleLabel}
          </div>
        </div>

        <div>
          <div style="font-size:10px;opacity:.65;letter-spacing:1px;">TIME</div>
          <div style="font-size:19px;font-weight:1000;color:#ffd54a;">
            ${timeText}
          </div>
        </div>

        <div>
          <div style="font-size:10px;opacity:.65;letter-spacing:1px;">STATUS</div>
          <div style="font-size:17px;font-weight:1000;">
            ${statusText}
          </div>
        </div>
      </div>

      <div style="
        margin-top:10px;
        padding:10px;
        border-radius:16px;
        background:${hunterReleased ? "rgba(255,59,59,.18)" : "rgba(255,213,74,.12)"};
        border:1px solid ${hunterReleased ? "rgba(255,59,59,.55)" : "rgba(255,213,74,.45)"};
        text-align:center;
        ${pulseStyle}
      ">
        <div style="font-size:10px;opacity:.7;letter-spacing:1px;">
          HUNTER RELEASE
        </div>
        <div style="
          font-size:24px;
          font-weight:1000;
          color:${hunterReleased ? "#ff3b3b" : hunterWarning ? "#ff3b3b" : "#ffd54a"};
        ">
          ${hunterText}
        </div>
      </div>

      <div style="
        margin-top:10px;
        border-top:1px solid rgba(255,255,255,.12);
        padding-top:10px;
        display:grid;
        grid-template-columns:1fr 1fr 1fr;
        gap:10px;
        text-align:center;
      ">
        <div>
          <div style="font-size:10px;opacity:.65;">NEAREST</div>
          <div style="font-size:14px;font-weight:900;">${nearestLabel}</div>
        </div>

        <div>
          <div style="font-size:10px;opacity:.65;">DISTANCE</div>
          <div style="font-size:18px;font-weight:1000;color:${roleColor};">${nearestText}</div>
        </div>

        <div>
          <div style="font-size:10px;opacity:.65;">GPS</div>
          <div style="font-size:16px;font-weight:900;">${accuracy}</div>
        </div>
      </div>
    </div>
  `;
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


function testAllLeoidsSounds() {

  const sounds = [
    "mission_start",
    "countdown_tick",
    "countdown_final",
    "hunter_released",
    "player_tagged",
    "jail_rescue",
    "boundary_warning",
    "button_click",
    "mission_complete",
    "victory",
    "defeat"
  ];

  let delay = 0;

  sounds.forEach((name) => {

    setTimeout(() => {

      console.log("TESTING SOUND:", name);

      showLeoidsEvent?.(
        "SOUND TEST",
        name,
        "🔊",
        "base"
      );

      playLeoidsSound?.(name, 1);

    }, delay);

    delay += 1800;
  });
}

window.testAllLeoidsSounds = testAllLeoidsSounds;
  
const leoidsSounds = {};


function loadLeoidsSounds() {
  leoidsSounds.mission_start = new Audio("sounds/mission_start.mp3");
  leoidsSounds.countdown_tick = new Audio("sounds/countdown_tick.mp3");
  leoidsSounds.countdown_final = new Audio("sounds/countdown_final.mp3");

  leoidsSounds.hunter_released = new Audio("sounds/hunter_released.mp3");

  leoidsSounds.player_tagged = new Audio("sounds/player_tagged.mp3");
  leoidsSounds.jail_rescue = new Audio("sounds/jail_rescue.mp3");

  leoidsSounds.boundary_warning = new Audio("sounds/boundary_warning.mp3");

  leoidsSounds.button_click = new Audio("sounds/button_click.mp3");

  leoidsSounds.mission_complete = new Audio("sounds/mission_complete.mp3");

  leoidsSounds.victory = new Audio("sounds/victory.mp3");
  leoidsSounds.defeat = new Audio("sounds/defeat.mp3");

  Object.values(leoidsSounds).forEach((sound) => {
    sound.preload = "auto";
    sound.volume = 0.85;
  });

  console.log("LEOIDS sounds loaded.");
}

function playLeoidsSound(name, volume = 1) {
  try {
    const sound = leoidsSounds[name];

    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    sound.volume = volume;

    sound.play().catch(() => {});
  } catch (err) {
    console.warn("Sound failed:", name, err);
  }
}

window.playLeoidsSound = playLeoidsSound;
window.loadLeoidsSounds = loadLeoidsSounds;
window.unlockLeoidsAudio = unlockLeoidsAudio;


let leoidsAudioUnlocked = false;

function unlockLeoidsAudio() {
  if (leoidsAudioUnlocked) return;

  leoidsAudioUnlocked = true;

  Object.values(leoidsSounds || {}).forEach((sound) => {
    try {
      sound.muted = true;
      sound.play()
        .then(() => {
          sound.pause();
          sound.currentTime = 0;
          sound.muted = false;
        })
        .catch(() => {
          sound.muted = false;
        });
    } catch {}
  });

  console.log("LEOIDS audio unlocked.");
}

function showLeoidsCinematicOverlay({
  title = "LEOIDS",
  subtitle = "",
  icon = "⚡",
  theme = "base",
  duration = 1800,
} = {}) {
  const old = document.getElementById("leoids-cinematic-overlay");
  if (old) old.remove();

  const colors = {
    base: "#00d4ff",
    hunter: "#ff3b3b",
    runner: "#22c55e",
    danger: "#ff3b3b",
    gold: "#ffd54a",
  };

  const color = colors[theme] || colors.base;

  const overlay = document.createElement("div");
  overlay.id = "leoids-cinematic-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "999999";
  overlay.style.pointerEvents = "none";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.background = "rgba(0,0,0,.42)";
  overlay.style.backdropFilter = "blur(2px)";
  overlay.style.color = "white";
  overlay.style.fontFamily = "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  overlay.innerHTML = `
    <div style="
      width:min(92vw,560px);
      text-align:center;
      padding:28px 22px;
      border-radius:30px;
      border:2px solid ${color};
      background:linear-gradient(180deg,rgba(15,23,42,.96),rgba(3,7,18,.96));
      box-shadow:0 0 42px ${color}88;
      transform:scale(.86);
      opacity:0;
    ">
      <div style="
        font-size:58px;
        line-height:1;
        margin-bottom:12px;
        text-shadow:0 0 24px ${color};
      ">
        ${icon}
      </div>

      <div style="
        color:${color};
        font-size:30px;
        font-weight:1000;
        letter-spacing:.08em;
        text-transform:uppercase;
        text-shadow:0 0 18px ${color};
      ">
        ${title}
      </div>

      <div style="
        margin-top:10px;
        font-size:16px;
        line-height:1.45;
        opacity:.92;
        white-space:pre-line;
      ">
        ${subtitle}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const card = overlay.firstElementChild;

  card.animate(
    [
      { transform: "scale(.86)", opacity: 0 },
      { transform: "scale(1.04)", opacity: 1 },
      { transform: "scale(1)", opacity: 1 },
    ],
    {
      duration: 360,
      easing: "ease-out",
      fill: "forwards",
    }
  );

  setTimeout(() => {
    card.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.08)", opacity: 0 },
      ],
      {
        duration: 320,
        easing: "ease-in",
        fill: "forwards",
      }
    );

    overlay.animate(
      [
        { opacity: 1 },
        { opacity: 0 },
      ],
      {
        duration: 320,
        easing: "ease-in",
        fill: "forwards",
      }
    );

    setTimeout(() => {
      overlay.remove();
    }, 340);
  }, duration);
}
  
window.showLeoidsCinematicOverlay = showLeoidsCinematicOverlay;

  
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
    status: leoidsState.active ? "active" : "lobby",

    boundary: {
      mode: leoidsState.boundaryMode,
      radius: Number(leoidsState.boundaryRadius || DEFAULT_BOUNDARY_RADIUS),
      center: leoidsState.boundaryCenter || null,
      points: Array.isArray(leoidsState.boundaryPoints)
        ? leoidsState.boundaryPoints
        : [],
    },

    jail_lat: leoidsState.basePoint ? Number(leoidsState.basePoint.lat) : null,
    jail_lng: leoidsState.basePoint ? Number(leoidsState.basePoint.lng) : null,

    base_lat: leoidsState.basePoint ? Number(leoidsState.basePoint.lat) : null,
    base_lng: leoidsState.basePoint ? Number(leoidsState.basePoint.lng) : null,

    round_time: Number(leoidsState.roundTime || DEFAULT_ROUND_SECONDS),
    hunter_delay: Number(leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS),
    base_radius: Number(leoidsState.baseRadius || DEFAULT_BASE_RADIUS),
    tag_radius: Number(leoidsState.tagRadius || DEFAULT_TAG_RADIUS),
    countdown_seconds: Number(leoidsState.countdownSeconds || 10),
  };
}



async function saveOnlineSessionConfig() {
  if (!leoidsState.onlineSessionId) return null;

  return await updateOnlineSession(buildOnlineSessionConfig());
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

  let lastSoundSecond = null;

  leoidsState.countdownIntervalId = setInterval(async () => {
    const secondsLeft = Math.ceil((startsAtMs - Date.now()) / 1000);

    showCountdownBanner(Math.max(0, secondsLeft));
    updatePanel();

    if (
      secondsLeft > 0 &&
      secondsLeft !== lastSoundSecond
    ) {
      lastSoundSecond = secondsLeft;

      if (secondsLeft <= 5) {
        playLeoidsSound?.("countdown_final");
      } else {
        playLeoidsSound?.("countdown_tick", 0.45);
      }
    }

    if (secondsLeft <= 0) {
      clearInterval(leoidsState.countdownIntervalId);
      leoidsState.countdownIntervalId = null;

      hideCountdownBanner();

      if (leoidsState.isLobbyHost && leoidsState.onlineSessionId) {
        await updateOnlineSession({
          status: "active",
          round_started_at: new Date().toISOString(),
        });
      }

      startRoundFromOnlineSession({
        ...session,
        status: "active",
      });
    }
  }, 500);
}


function startRoundFromOnlineSession(session = null) {
  if (session) {
    applyOnlineSessionConfig?.(session);
  }

  if (leoidsState.active) {
    updatePanel?.();
    updateLeoidsBattleHud?.();
    return;
  }

  stopTimer?.();
  stopAI?.();
  hideCountdownBanner?.();

  leoidsState.active = true;
  leoidsState.status = "free";
  leoidsState.score = 0;
  leoidsState.coins = 0;

  playLeoidsSound?.("mission_start", 1);

  if (navigator.vibrate) {
    navigator.vibrate([180, 100, 220]);
  }

  leoidsState.timeLeft = Number(
    leoidsState.roundTime ||
    session?.round_time ||
    DEFAULT_ROUND_SECONDS
  );

  leoidsState.hunterDelayLeft = Number(
    leoidsState.hunterDelay ||
    session?.hunter_delay ||
    DEFAULT_HUNTER_DELAY_SECONDS
  );

  leoidsState.huntersReleased = false;
  leoidsState.lastHunterCountdownSecond = null;
  leoidsState.lastRescueAt = 0;
  leoidsState.startedAt = new Date().toISOString();
  leoidsState.endedAt = null;

  leoidsState.players.forEach((player) => {
    player.status = "free";
    player.jailedAtBase = false;
  });

  closeModal?.("leoids-modal");

  const lobby = document.getElementById(
    "leoids-online-lobby-screen"
  );

  if (lobby) lobby.remove();

  enterBattleMap?.();

  hideLeoidsMapControls?.();

  redrawAllMapObjects?.();
  renderPlayers?.();
  drawPlayerMarkers?.();
  updatePanel?.();
  showLeoidsBattleHud?.();

showLeoidsCinematicOverlay({
  title: "MISSION STARTED",
  subtitle: "Runners hide.\nHunters wait for release.",
  icon: "🚀",
  theme: "base"
});
  
  showLeoidsEvent(
    "MISSION STARTED",
    "Runners hide.\nHunters wait for release.",
    "🚀",
    "base"
  );

  speakText?.(
    "Mission started. Runners hide. Hunters wait for release."
  );

  document.body.animate(
    [
      { filter: "brightness(2)" },
      { filter: "brightness(1)" }
    ],
    {
      duration: 700,
      easing: "ease-out"
    }
  );

  leoidsState.intervalId = setInterval(
    tickRound,
    1000
  );
}


async function startOnlineCountdown(seconds = 60) {
  const supabase = getSupabaseSafe();

  if (!supabase || !leoidsState.onlineSessionId) {
    speakText?.("Join or create an online session first.");
    return null;
  }

  const safeSeconds = Math.max(3, Number(seconds || 60));

  await saveOnlineSessionConfig();

  let session = null;

  if (typeof supabase.startCountdown === "function") {
    session = await supabase.startCountdown(leoidsState.onlineSessionId, safeSeconds);
  } else if (supabase.client) {
    const startsAt = new Date(Date.now() + safeSeconds * 1000).toISOString();

    const { data, error } = await supabase.client
      .from("leoids_sessions")
      .update({
        status: "countdown",
        game_starts_at: startsAt,
        countdown_seconds: safeSeconds,
      })
      .eq("id", leoidsState.onlineSessionId)
      .select()
      .single();

    if (error) {
      console.warn("Could not start online countdown:", error);
      speakText?.("Could not start countdown.");
      return null;
    }

    session = data;
  }

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
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    alert("Only the host can start the round.");
    speakText?.("Only the host can start the round.");
    return;
  }

  if (leoidsState.active) {
    console.warn("Round already active — blocking duplicate start.");
    return;
  }

  if (!hasValidBoundary()) {
    alert("Set a LEOIDS boundary first.");
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
    startOnlineCountdown(leoidsState.countdownSeconds || 60);
    return;
  }

  stopTimer();
  stopAI();

  seedPlayerPositions();

  leoidsState.active = true;
  leoidsState.status = "free";
  leoidsState.score = 0;
  leoidsState.coins = 0;
  leoidsState.timeLeft = Number(leoidsState.roundTime || DEFAULT_ROUND_SECONDS);
  leoidsState.hunterDelayLeft = Number(
    leoidsState.hunterDelay || DEFAULT_HUNTER_DELAY_SECONDS
  );
  leoidsState.huntersReleased = false;
  leoidsState.startedAt = new Date().toISOString();
  leoidsState.endedAt = null;

  leoidsState.players.forEach((player) => {
    player.status = "free";
    player.score = 0;
    player.coins = 0;
    player.jailedAtBase = false;
  });

  closeSetupPanel?.();
  enterBattleMap?.();

  updatePanel();
  renderPlayers();
  drawPlayerMarkers();
  showLeoidsBattleHud?.();

  showLeoidsEvent(
    "ROUND STARTED",
    "Runners hide.\nHunters wait for release.",
    "⚡",
    "base"
  );

  speakText?.("LEOIDS round started. Runners hide now. Hunters wait.");

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


function checkRunnerDangerWarning() {
  if (!leoidsState.active) return;
  if (!leoidsState.huntersReleased) return;

  const local = getLocalPlayer?.();

  if (!local) return;
  if (local.role !== "runner") return;
  if (local.status !== "free") return;
  if (!local.position) return;

  const hunters = leoidsState.players.filter(
    (player) =>
      player.role === "hunter" &&
      player.status === "free" &&
      player.position
  );

  if (!hunters.length) return;

  let closestDistance = Infinity;

  hunters.forEach((hunter) => {
    const distance = distanceMeters(local.position, hunter.position);

    if (distance < closestDistance) {
      closestDistance = distance;
    }
  });

  if (closestDistance > 35) return;

  const now = Date.now();

  const veryClose = closestDistance <= 15;
  const cooldown = veryClose ? 3500 : 7000;

  if (now - Number(leoidsState.lastRunnerDangerAt || 0) < cooldown) {
    return;
  }

  leoidsState.lastRunnerDangerAt = now;

  showLeoidsCinematicOverlay?.({
    title: veryClose ? "DANGER CLOSE" : "HUNTER NEAR",
    subtitle: `${Math.round(closestDistance)}m away`,
    icon: "🔴",
    theme: "hunter",
    duration: veryClose ? 1100 : 1300,
  });

  playLeoidsSound?.(
    veryClose ? "countdown_final" : "boundary_warning",
    veryClose ? 0.65 : 0.45
  );

  if (navigator.vibrate) {
    navigator.vibrate(
      veryClose
        ? [90, 50, 90, 50, 140]
        : [70, 50, 70]
    );
  }

  if (veryClose) {
    document.body.animate(
      [
        { filter: "brightness(1.8)" },
        { filter: "brightness(1)" }
      ],
      {
        duration: 450,
        easing: "ease-out"
      }
    );
  }
}

  
function tickRound() {
  if (!leoidsState.active) return;

  leoidsState.timeLeft = Math.max(0, leoidsState.timeLeft - 1);

  if (!leoidsState.huntersReleased) {
    leoidsState.hunterDelayLeft = Math.max(0, leoidsState.hunterDelayLeft - 1);

    const releaseSoon =
      leoidsState.hunterDelayLeft > 0 && leoidsState.hunterDelayLeft <= 10;

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
        playLeoidsSound?.("countdown_final", 0.9);

       showLeoidsCinematicOverlay({
        title: "HUNTERS RELEASED",
       subtitle: "The hunt has begun.",
        icon: "🔴",
        theme: "hunter"
       });
        
        showLeoidsEvent(
          "HUNTERS RELEASE SOON",
          `${leoidsState.hunterDelayLeft} seconds`,
          "⏱️",
          "hunter"
        );

        speakText?.(`${leoidsState.hunterDelayLeft}`);
      } else {
        playLeoidsSound?.("countdown_tick", 0.45);
      }
    }

    if (leoidsState.hunterDelayLeft <= 0) {
      leoidsState.huntersReleased = true;
      leoidsState.lastHunterCountdownSecond = null;

      playLeoidsSound?.("hunter_released", 1);

      if (navigator.vibrate) {
        navigator.vibrate([250, 100, 250]);
      }

      document.body.animate(
        [{ filter: "brightness(2)" }, { filter: "brightness(1)" }],
        { duration: 700, easing: "ease-out" }
      );

      const local = getLocalPlayer();

      if (local?.role === "hunter") {
        showLeoidsEvent("HUNTERS RELEASED", "Go. Catch the runners.", "🔴", "hunter");
        speakText?.("Hunters released. Go and catch the runners.");
      } else {
        showLeoidsEvent("HUNTERS RELEASED", "Run. Hide. Rescue your team.", "🏃", "runner");
        speakText?.("Hunters released. Runners, keep moving.");
      }
    }
  }

  const local = getLocalPlayer();

  if (
    local?.role === "runner" &&
    local.status === "free" &&
    leoidsState.basePoint &&
    local.position
  ) {
    const distanceToBase = distanceMeters(local.position, leoidsState.basePoint);
    const baseRadius = Number(leoidsState.baseRadius || DEFAULT_BASE_RADIUS);

    const hasJailedRunners = leoidsState.players.some(
      (player) => player.role === "runner" && player.status === "jailed"
    );

    if (
      hasJailedRunners &&
      distanceToBase <= baseRadius &&
      Date.now() - Number(leoidsState.lastRescueAt || 0) > 3000
    ) {
      rescueJailedRunners();
    }
  }

  checkBoundaryRules();
  checkRunnerDangerWarning?.();

  if (leoidsState.timeLeft <= 0) {
    playLeoidsSound?.("mission_complete", 1);
    endRound("timer");
    return;
  }

  updatePanel?.();
  updateLeoidsBattleHud?.();
  updateLeoidsLiveActionButton?.();
}

function showLeoidsMatchEndScreen({
  title = "ROUND COMPLETE",
  message = "Mission ended.",
  icon = "🏆",
  theme = "base",
} = {}) {
  const old = document.getElementById("leoids-match-end-screen");
  if (old) old.remove();

  const colors = {
    base: "#00d4ff",
    runner: "#22c55e",
    hunter: "#ff3b3b",
    gold: "#ffd54a",
  };

  const color = colors[theme] || colors.base;

  const sortedPlayers = [...leoidsState.players].sort(
    (a, b) => Number(b.score || 0) - Number(a.score || 0)
  );

  const rows = sortedPlayers.map((player, index) => `
    <div style="
      display:flex;
      justify-content:space-between;
      gap:10px;
      padding:10px;
      border-radius:14px;
      background:rgba(255,255,255,.07);
      margin-top:8px;
    ">
      <span>${index + 1}. ${getPlayerIcon?.(player) || "🧍"} ${player.name || "Player"}</span>
      <strong>${Number(player.score || 0)} pts</strong>
    </div>
  `).join("");

  const modal = document.createElement("div");
  modal.id = "leoids-match-end-screen";
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
      border:2px solid ${color};
      border-radius:30px;
      background:linear-gradient(180deg,#101827,#05070b);
      color:white;
      padding:22px;
      box-shadow:0 0 45px ${color}77;
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      text-align:center;
    ">
      <div style="font-size:64px;line-height:1;">${icon}</div>

      <h2 style="
        margin:12px 0 0;
        color:${color};
        font-size:30px;
        letter-spacing:.08em;
      ">
        ${title}
      </h2>

      <p style="opacity:.9;font-size:16px;line-height:1.45;">
        ${message}
      </p>

      <div style="
        margin-top:16px;
        text-align:left;
      ">
        <h3 style="color:${color};margin:0 0 8px;">Leaderboard</h3>
        ${rows || `<div style="opacity:.75;">No players found.</div>`}
      </div>

      <button id="btn-leoids-match-end-lobby" type="button" style="
        width:100%;
        min-height:48px;
        border-radius:16px;
        border:none;
        background:${color};
        color:#05070b;
        font-weight:1000;
        margin-top:18px;
      ">
        BACK TO LOBBY
      </button>

      <button id="btn-leoids-match-end-close" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:16px;
        border:none;
        background:#202a3c;
        color:white;
        font-weight:900;
        margin-top:10px;
      ">
        CLOSE
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-leoids-match-end-close")?.addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("btn-leoids-match-end-lobby")?.addEventListener("click", () => {
    modal.remove();

    if (leoidsState.onlineSessionId) {
      openOnlineLobbyScreen?.(leoidsState.onlineSessionId);
    } else {
      openSetupPanel?.();
    }
  });
}


 function endRound(reason = "manual") {

  leoidsState.active = false;
  hideLeoidsLiveActionButton?.();
  
   clearInterval?.(leoidsState.intervalId);

  const runnersFree = leoidsState.players.filter(
    (p) =>
      p.role === "runner" &&
      p.status === "free"
  ).length;

  const hunters = leoidsState.players.filter(
    (p) => p.role === "hunter"
  ).length;

  let resultText = "Round ended.";
  let resultTitle = "ROUND COMPLETE";
  let resultIcon = "🏆";
  let resultTheme = "base";

  if (reason === "timer") {

    if (runnersFree > 0) {

      resultTitle = "RUNNERS WIN";
      resultText =
        `${runnersFree} runner${runnersFree === 1 ? "" : "s"} survived.`;

      resultIcon = "🟢";
      resultTheme = "runner";

      playLeoidsSound?.("victory", 1);

    } else {

      resultTitle = "HUNTERS WIN";
      resultText = "Hunters caught everyone.";

      resultIcon = "🔴";
      resultTheme = "hunter";

      playLeoidsSound?.("defeat", 1);
    }

  } else if (reason === "hunters") {

    resultTitle = "HUNTERS WIN";
    resultText = "All runners were jailed.";

    resultIcon = "🔴";
    resultTheme = "hunter";

    playLeoidsSound?.("defeat", 1);

  } else {

    playLeoidsSound?.("mission_complete", 1);
  }

  if (navigator.vibrate) {
    navigator.vibrate([220, 120, 220, 120, 300]);
  }

  document.body.animate(
    [
      { filter: "brightness(2)" },
      { filter: "brightness(1)" }
    ],
    {
      duration: 1000,
      easing: "ease-out"
    }
  );

showLeoidsCinematicOverlay({
  title: "ROUND COMPLETE",
  subtitle: resultText,
  icon: "🏆",
  theme: "gold",
  duration: 2600
});
   
  showLeoidsEvent(
    resultTitle,
    resultText,
    resultIcon,
    resultTheme
  );

setTimeout(() => {
  showLeoidsMatchEndScreen({
    title: resultTitle,
    message: resultText,
    icon: resultIcon,
    theme: resultTheme,
  });
}, 900);
   
  speakText?.(resultText);

  updatePanel?.();
  updateLeoidsBattleHud?.();

  setTimeout(() => {
    openLeoidsLeaderboard?.();
  }, 2200);
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
  const local = getLocalPlayer();
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  const statusEl = $("leoids-status");

  if (statusEl) {
    const roleText = leoidsState.role === "hunter" ? "Hunter" : "Runner";
    const statusText = leoidsState.active ? "ACTIVE" : "SETUP";

    const onlineText = leoidsState.onlineEnabled
      ? `ONLINE • ${leoidsState.onlineSessionId || "session ready"}`
      : "LOCAL";

    statusEl.innerText =
      `Connection: ${onlineText}\n` +
      `Mode: ${statusText}\n` +
      `Your Role: ${roleText}\n` +
      `Round Time: ${formatTime(leoidsState.timeLeft)}\n` +
      `Hunter Delay: ${formatTime(leoidsState.hunterDelayLeft)}\n` +
      `Score: ${leoidsState.score}\n` +
      `Coins: ${leoidsState.coins}`;
  }

  const startBtn = $("btn-leoids-start");
  if (startBtn) {
    startBtn.style.display = isHost ? "block" : "none";
    startBtn.disabled = !isHost || leoidsState.active;

    startBtn.innerText = leoidsState.active
      ? "MISSION RUNNING"
      : "🚀 START MISSION";

    startBtn.style.minHeight = "58px";
    startBtn.style.borderRadius = "20px";
    startBtn.style.border = "none";
    startBtn.style.fontWeight = "1000";
    startBtn.style.fontSize = "16px";
    startBtn.style.letterSpacing = ".05em";

    if (leoidsState.active) {
      startBtn.style.background = "#374151";
      startBtn.style.color = "#cbd5e1";
      startBtn.style.boxShadow = "none";
    } else {
      startBtn.style.background = "#22c55e";
      startBtn.style.color = "#05070b";
      startBtn.style.boxShadow = "0 0 26px rgba(34,197,94,.5)";
    }
  }

  const endBtn = $("btn-leoids-end");
  if (endBtn) {
    endBtn.style.display = isHost ? "block" : "none";
    endBtn.disabled = !isHost || !leoidsState.active;
    endBtn.style.opacity = leoidsState.active ? "1" : ".55";
  }

  const runnerBtn = $("btn-leoids-runner");
  if (runnerBtn && local) {
    runnerBtn.style.opacity = local.role === "runner" ? "1" : ".75";
  }

  const hunterBtn = $("btn-leoids-hunter");
  if (hunterBtn && local) {
    hunterBtn.style.opacity = local.role === "hunter" ? "1" : ".75";
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

  return !!localName && !!hostName && localName.trim() === hostName.trim();
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
      width:min(94vw,520px);
      max-height:88vh;
      overflow:auto;
      border:2px solid rgba(0,212,255,.85);
      border-radius:28px;
      background:linear-gradient(180deg,#101827,#05070b);
      color:white;
      padding:20px;
      box-shadow:0 0 38px rgba(0,212,255,.25);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">
      <h2 id="leoids-lobby-title" style="margin:0;color:#00d4ff;text-align:center;">
        LEOIDS LOBBY
      </h2>

      <div id="leoids-lobby-host" style="opacity:.85;margin-top:8px;text-align:center;font-size:13px;">
        Host: loading...
      </div>

      <div id="leoids-lobby-status" style="
        margin-top:12px;
        padding:12px;
        border-radius:16px;
        background:rgba(0,212,255,.12);
        color:#00d4ff;
        font-weight:1000;
        text-align:center;
      ">
        Loading lobby...
      </div>

      <div id="leoids-host-controls" style="display:none;margin-top:14px;">
        <button id="btn-leoids-lobby-start-countdown" type="button" style="
          width:100%;
          min-height:58px;
          border-radius:20px;
          background:#ffd54a;
          color:#05070b;
          font-size:16px;
          font-weight:1000;
          border:none;
          box-shadow:0 0 24px rgba(255,213,74,.38);
        ">
          🚀 START MISSION & GPS
        </button>

        <button id="btn-leoids-lobby-host-setup" type="button" style="
          width:100%;
          min-height:48px;
          border-radius:16px;
          background:#202a3c;
          color:white;
          font-weight:900;
          margin-top:10px;
          border:none;
        ">
          ⚙️ MISSION SETUP
        </button>

        <button id="btn-leoids-lobby-end-session" type="button" style="
          width:100%;
          min-height:44px;
          border-radius:16px;
          background:#3a1111;
          color:white;
          font-weight:900;
          margin-top:10px;
          border:1px solid rgba(255,59,59,.55);
        ">
          ⛔ END MISSION / HIDE LOBBY
        </button>
      </div>

      <button id="btn-leoids-lobby-gps" type="button" style="
        width:100%;
        min-height:58px;
        border-radius:20px;
        background:#22c55e;
        color:#05070b;
        font-weight:1000;
        font-size:16px;
        margin-top:16px;
        border:none;
        box-shadow:0 0 24px rgba(34,197,94,.42);
      ">
        📍 START LOCATION & ENTER GAME
      </button>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:14px;
      ">
        <button id="btn-leoids-lobby-runner" type="button" style="
          min-height:46px;
          border-radius:16px;
          background:#22c55e;
          color:#05070b;
          font-weight:1000;
          border:none;
        ">
          🟢 RUNNER
        </button>

        <button id="btn-leoids-lobby-hunter" type="button" style="
          min-height:46px;
          border-radius:16px;
          background:#ff3b3b;
          color:white;
          font-weight:1000;
          border:none;
        ">
          🔴 HUNTER
        </button>
      </div>

      <div style="margin-top:16px;">
        <h3 style="margin:0 0 8px;color:#00d4ff;">Players</h3>
        <div id="leoids-lobby-player-list">
          <div style="opacity:.75;margin-top:10px;">Loading players...</div>
        </div>
      </div>

      <button id="btn-leoids-lobby-help" type="button" style="
        width:100%;
        min-height:44px;
        border-radius:16px;
        background:#202a3c;
        color:white;
        font-weight:900;
        margin-top:14px;
        border:none;
      ">
        ❓ HELP / RULES
      </button>

      <button id="btn-leoids-lobby-close" type="button" style="
        width:100%;
        min-height:42px;
        border-radius:16px;
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
    const gpsBtn = document.getElementById("btn-leoids-lobby-gps");

    if (title) title.innerText = session?.name || "LEOIDS Lobby";
    if (host) host.innerText = `Host: ${session?.host_name || "Unknown"}`;

    if (hostControls) {
      hostControls.style.display = leoidsState.isLobbyHost ? "block" : "none";
    }

    if (gpsBtn) {
      gpsBtn.style.display = leoidsState.isLobbyHost ? "none" : "block";
    }

    if (status) {
      if (session?.status === "countdown" && session?.game_starts_at) {
        const secondsLeft = Math.max(
          0,
          Math.ceil((new Date(session.game_starts_at).getTime() - Date.now()) / 1000)
        );
        status.innerText = `Starting in ${secondsLeft}s`;
      } else if (session?.status === "active") {
        status.innerText = "Mission active";
      } else {
        status.innerText = leoidsState.isLobbyHost
          ? "You are host • setup or start the mission"
          : "Choose role, start GPS, wait for host";
      }
    }

    if (playerList) {
      playerList.innerHTML = players.length
        ? players.map((player) => `
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
        `).join("")
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

  async function openGameMapFromLobby({ startLocation = false } = {}) {
    closeLobbyScreen();

    leoidsState.onlineEnabled = true;

    enterBattleMap?.();
    hideLeoidsMapControls?.();
    closeModal?.("leoids-modal");

    await loadAndApplyOnlineSession?.();
    startOnlinePlayerSync?.();
    startOnlineSessionSync?.();
    await loadOnlinePlayers?.();

    if (startLocation) {
      startGpsOnlineSync?.();
      speakText?.("Location sharing started.");
    }

    setTimeout(() => {
      redrawAllMapObjects?.();
      drawPlayerMarkers?.();
      showLeoidsBattleHud?.();

      const map = getMapSafe?.();
      const local = getLocalPlayer?.();

      if (map && local?.position) {
        map.setView(
          [local.position.lat, local.position.lng],
          Math.max(map.getZoom(), 17)
        );
      }
    }, 500);
  }

  await refreshLobbyScreen();

  if (leoidsState.lobbyRefreshIntervalId) {
    clearInterval(leoidsState.lobbyRefreshIntervalId);
  }

  leoidsState.lobbyRefreshIntervalId = setInterval(() => {
    refreshLobbyScreen();
    drawPlayerMarkers?.();
  }, 2000);

  startOnlinePlayerSync?.();
  startOnlineSessionSync?.();

  document.getElementById("btn-leoids-lobby-close")
    ?.addEventListener("click", closeLobbyScreen);

  document.getElementById("btn-leoids-lobby-gps")
    ?.addEventListener("click", () => {
      openGameMapFromLobby({ startLocation: true });
    });

  document.getElementById("btn-leoids-lobby-help")
    ?.addEventListener("click", () => {
      openLeoidsInstructions?.();
    });

  document.getElementById("btn-leoids-lobby-start-countdown")
    ?.addEventListener("click", async () => {
      const session = await supabase.getSession(leoidsState.onlineSessionId);

      if (!isLocalLobbyHost(session)) {
        alert("Only the host can start the mission.");
        return;
      }

      await openGameMapFromLobby({ startLocation: true });

      await saveOnlineSessionConfig?.();
      await startOnlineCountdown(leoidsState.countdownSeconds || 10);

      speakText?.("Mission started.");
    });

  document.getElementById("btn-leoids-lobby-host-setup")
    ?.addEventListener("click", async () => {
      const session = await supabase.getSession(leoidsState.onlineSessionId);

      if (!isLocalLobbyHost(session)) {
        alert("Only the host can edit mission setup.");
        return;
      }

      closeLobbyScreen();

      setTimeout(() => {
        openLeoidsMissionSetupScreen({
          returnToLobby: true,
        });
      }, 150);
    });

  document.getElementById("btn-leoids-lobby-end-session")
    ?.addEventListener("click", async () => {
      const session = await supabase.getSession(leoidsState.onlineSessionId);

      if (!isLocalLobbyHost(session)) {
        alert("Only the host can end this mission.");
        return;
      }

      if (!confirm("End this mission/lobby?")) return;

      if (leoidsState.active) {
        endRound?.("manual");
      }

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
      speakText?.("Mission ended.");
    });

  document.getElementById("btn-leoids-lobby-runner")
    ?.addEventListener("click", async () => {
      leoidsState.role = "runner";

      const local = getLocalPlayer?.();
      if (local) {
        local.role = "runner";
        local.status = "free";
        local.jailedAtBase = false;
      }

      if (supabase.playerId) {
        await supabase.joinSession({
          sessionId: leoidsState.onlineSessionId,
          displayName: supabase.playerName || leoidsState.onlinePlayerName || "Player",
          role: "runner",
        });
      }

      speakText?.("Runner selected.");
      await refreshLobbyScreen();
    });

  document.getElementById("btn-leoids-lobby-hunter")
    ?.addEventListener("click", async () => {
      leoidsState.role = "hunter";

      const local = getLocalPlayer?.();
      if (local) {
        local.role = "hunter";
        local.status = "free";
        local.jailedAtBase = false;
      }

      if (supabase.playerId) {
        await supabase.joinSession({
          sessionId: leoidsState.onlineSessionId,
          displayName: supabase.playerName || leoidsState.onlinePlayerName || "Player",
          role: "hunter",
        });
      }

      speakText?.("Hunter selected.");
      await refreshLobbyScreen();
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

  const hiddenKey = "leoidsHiddenLobbyIds";

  const getHiddenLobbyIds = () => {
    try {
      return JSON.parse(localStorage.getItem(hiddenKey) || "[]");
    } catch {
      return [];
    }
  };

  const hideLobbyLocally = (sessionId) => {
    const hidden = new Set(getHiddenLobbyIds());
    hidden.add(sessionId);
    localStorage.setItem(hiddenKey, JSON.stringify([...hidden]));
  };

  const joinSessionSafely = async ({ sessionId, displayName, role }) => {
    if (typeof joinOnlineSession === "function") {
      return await joinOnlineSession({ sessionId, displayName, role });
    }

    if (window.LEOIDS && typeof window.LEOIDS.joinOnlineSession === "function") {
      return await window.LEOIDS.joinOnlineSession({ sessionId, displayName, role });
    }

    return await supabase.joinSession({ sessionId, displayName, role });
  };

  function getSessionStatusText(session) {
    if (session.ended_at) return "ENDED";

    if (session.expires_at) {
      const expiry = new Date(session.expires_at).getTime();
      if (Number.isFinite(expiry) && expiry <= Date.now()) return "EXPIRED";
    }

    if (session.status === "countdown" && session.game_starts_at) {
      const secondsLeft = Math.max(
        0,
        Math.ceil((new Date(session.game_starts_at).getTime() - Date.now()) / 1000)
      );

      return `COUNTDOWN • ${secondsLeft}s`;
    }

    if (session.status === "active") return "MISSION ACTIVE";

    return "LOBBY OPEN";
  }

  function isMine(session) {
    const myName =
      leoidsState.onlinePlayerName ||
      supabase.playerName ||
      "";

    const hostName = session?.host_name || "";

    return !!myName && !!hostName && myName.trim() === hostName.trim();
  }

  function openNameRolePicker({ title = "JOIN LOBBY", defaultName = "Kyle", onConfirm }) {
    const oldPicker = document.getElementById("leoids-name-role-picker");
    if (oldPicker) oldPicker.remove();

    const picker = document.createElement("div");
    picker.id = "leoids-name-role-picker";
    picker.style.position = "fixed";
    picker.style.inset = "0";
    picker.style.zIndex = "1000000";
    picker.style.background = "rgba(0,0,0,.88)";
    picker.style.display = "flex";
    picker.style.alignItems = "center";
    picker.style.justifyContent = "center";
    picker.style.padding = "18px";

    picker.innerHTML = `
      <div style="
        width:min(92vw,420px);
        border:2px solid rgba(0,212,255,.85);
        border-radius:26px;
        background:linear-gradient(180deg,#101827,#05070b);
        color:white;
        padding:22px;
        box-shadow:0 0 36px rgba(0,212,255,.28);
        font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      ">
        <h2 style="margin:0;color:#00d4ff;text-align:center;">
          ${title}
        </h2>

        <p style="opacity:.85;text-align:center;margin:8px 0 16px;">
          Enter your player name and choose your starting role.
        </p>

        <label style="font-size:13px;font-weight:900;color:#ffd54a;">
          PLAYER NAME
        </label>

        <input id="leoids-picker-name" value="${defaultName}" style="
          width:100%;
          box-sizing:border-box;
          min-height:46px;
          margin-top:8px;
          border-radius:14px;
          border:1px solid rgba(0,212,255,.55);
          background:#0b1220;
          color:white;
          padding:0 12px;
          font-size:16px;
          font-weight:900;
          outline:none;
        " />

        <button id="leoids-picker-runner" type="button" style="
          width:100%;
          min-height:48px;
          margin-top:16px;
          border-radius:16px;
          border:none;
          background:#22c55e;
          color:#05070b;
          font-weight:1000;
        ">
          🟢 JOIN AS RUNNER
        </button>

        <button id="leoids-picker-hunter" type="button" style="
          width:100%;
          min-height:48px;
          margin-top:10px;
          border-radius:16px;
          border:none;
          background:#ff3b3b;
          color:white;
          font-weight:1000;
        ">
          🔴 JOIN AS HUNTER
        </button>

        <button id="leoids-picker-cancel" type="button" style="
          width:100%;
          min-height:42px;
          margin-top:12px;
          border-radius:16px;
          border:none;
          background:#202a3c;
          color:white;
          font-weight:900;
        ">
          CANCEL
        </button>
      </div>
    `;

    document.body.appendChild(picker);

    const submit = async (role) => {
      const input = document.getElementById("leoids-picker-name");
      const displayName = (input?.value || "Player").trim() || "Player";

      picker.remove();

      await onConfirm({
        displayName,
        role,
      });
    };

    document.getElementById("leoids-picker-runner")?.addEventListener("click", () => {
      submit("runner");
    });

    document.getElementById("leoids-picker-hunter")?.addEventListener("click", () => {
      submit("hunter");
    });

    document.getElementById("leoids-picker-cancel")?.addEventListener("click", () => {
      picker.remove();
    });
  }

  const hiddenIds = getHiddenLobbyIds();

  let sessions = await supabase.listPublicSessions();

  sessions = (sessions || []).filter((session) => {
    if (hiddenIds.includes(session.id)) return false;

    if (session.ended_at) return false;

    if (session.expires_at) {
      const expiry = new Date(session.expires_at).getTime();
      if (Number.isFinite(expiry) && expiry <= Date.now()) return false;
    }

    return true;
  });

  const old = document.getElementById("leoids-session-browser");
  if (old) old.remove();

  const rows = sessions.length
    ? sessions
        .map((session) => {
          const mine = isMine(session);
          const statusText = getSessionStatusText(session);

          return `
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

              <div style="
                font-size:13px;
                margin-top:6px;
                color:${session.status === "active" ? "#22c55e" : "#ffd54a"};
                font-weight:1000;
              ">
                ${statusText}
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
                class="${mine ? "leoids-session-end-btn" : "leoids-session-hide-btn"}"
                data-session-id="${session.id}"
                type="button"
                style="
                  width:100%;
                  min-height:38px;
                  margin-top:8px;
                  border-radius:14px;
                  background:${mine ? "#3a1111" : "#202a3c"};
                  color:white;
                  font-weight:900;
                  border:${mine ? "1px solid rgba(255,59,59,.55)" : "none"};
                "
              >
                ${mine ? "END LOBBY" : "HIDE FROM MY LIST"}
              </button>
            </div>
          `;
        })
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
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    ">
      <h2 style="margin:0;color:#00d4ff;">Online LEOIDS Lobbies</h2>

      <p style="opacity:.8;margin:8px 0 14px;">
        Join a live lobby or host a new GPS mission.
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

  document.getElementById("btn-leoids-host-public-session")?.addEventListener("click", () => {
    openNameRolePicker({
      title: "HOST NEW LOBBY",
      defaultName: supabase.playerName || leoidsState.onlinePlayerName || "Kyle",
      onConfirm: async ({ displayName, role }) => {
        const lobbyName = `${displayName}'s LEOIDS Game`;

        leoidsState.onlinePlayerName = displayName;
        leoidsState.isLobbyHost = true;
        leoidsState.role = role;

        supabase.playerName = displayName;

        const session = await createOnlineSession(lobbyName);
        if (!session) return;

        await joinSessionSafely({
          sessionId: session.id,
          displayName,
          role,
        });

        const local = getLocalPlayer?.();
        if (local) {
          local.role = role;
          local.status = "free";
          local.jailedAtBase = false;
        }

        leoidsState.isLobbyHost = true;
        leoidsState.onlineSessionId = session.id;
        supabase.sessionId = session.id;

        modal.remove();

        setTimeout(() => {
          openOnlineLobbyScreen(session.id);
        }, 150);
      },
    });
  });

  modal.querySelectorAll(".leoids-session-join-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sessionId = btn.dataset.sessionId;

      openNameRolePicker({
        title: "JOIN LOBBY",
        defaultName: supabase.playerName || leoidsState.onlinePlayerName || "Kyle",
        onConfirm: async ({ displayName, role }) => {
          leoidsState.isLobbyHost = false;
          leoidsState.onlinePlayerName = displayName;
          leoidsState.role = role;

          supabase.playerName = displayName;

          await joinSessionSafely({
            sessionId,
            displayName,
            role,
          });

          const local = getLocalPlayer?.();
          if (local) {
            local.role = role;
            local.status = "free";
            local.jailedAtBase = false;
          }

          modal.remove();
          openOnlineLobbyScreen(sessionId);
        },
      });
    });
  });

  modal.querySelectorAll(".leoids-session-hide-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sessionId = btn.dataset.sessionId;
      hideLobbyLocally(sessionId);

      modal.remove();
      openOnlineSessionBrowser();
    });
  });

  modal.querySelectorAll(".leoids-session-end-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sessionId = btn.dataset.sessionId;

      if (!confirm("End this lobby for everyone?")) return;

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
      "Only runners can rescue jailed players.",
      "🟢",
      "runner"
    );

    speakText?.("Only runners can rescue jailed players.");
    return;
  }

  rescueJailedRunners();
}


function getLeoidsHudStatusText() {
  const local = getLocalPlayer();

  if (!leoidsState.active) return "WAITING";

  if (local?.status === "jailed") return "JAILED";

  if (Number(local?.accuracy || 0) > 35) {
    return "GPS WEAK";
  }

  if (!leoidsState.huntersReleased) {
    return local?.role === "hunter" ? "LOCKED" : "HIDE";
  }

  if (local?.role === "hunter" && local.position) {
    const runners = leoidsState.players.filter(
      (player) =>
        player.role === "runner" &&
        player.status === "free" &&
        player.id !== local.id &&
        player.position
    );

    let closestDistance = Infinity;

    runners.forEach((runner) => {
      const distance = distanceMeters(local.position, runner.position);
      if (distance < closestDistance) closestDistance = distance;
    });

    const tagRadius = Number(leoidsState.tagRadius || DEFAULT_TAG_RADIUS);

    if (closestDistance <= tagRadius) {
      return "TAG READY";
    }

    if (closestDistance <= tagRadius * 2) {
      return `${Math.round(closestDistance)}M`;
    }

    return "CHASE";
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




async function quickStartLeoidsGame() {
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;

  if (!isHost) {
    alert("Only the host can use Quick Start.");
    speakText?.("Only the host can use quick start.");
    return;
  }

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
    "QUICK GAME READY",
    "5 minute round.\n1 minute hunter lock.\nBoundary and jail base are set.",
    "⚡",
    "base"
  );

  speakText?.("Quick game ready. Boundary and jail base have been set.");
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

  unlockLeoidsAudio?.();
  playLeoidsSound?.("button_click", 0.8);

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

  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;
  loadLeoidsSounds?.();

document.body.addEventListener("click", unlockLeoidsAudio, { once: true });
document.body.addEventListener("touchstart", unlockLeoidsAudio, { once: true });
  
  hideSetupButton("btn-leoids-quick-start");
  hideSetupButton("btn-leoids-add-ai-runner");
  hideSetupButton("btn-leoids-add-ai-hunter");
  hideSetupButton("btn-leoids-reset-players");
  hideSetupButton("btn-leoids-release-jail");
  hideSetupButton("btn-leoids-leaderboard");
  hideSetupButton("btn-leoids-rescue");

  if (isHost) {
    showSetupButton("btn-leoids-start");
    showSetupButton("btn-leoids-end");
    showSetupButton("btn-leoids-set-boundary");
    showSetupButton("btn-leoids-clear-boundary");
    showSetupButton("btn-leoids-set-base");
  } else {
    hideSetupButton("btn-leoids-start");
    hideSetupButton("btn-leoids-end");
    hideSetupButton("btn-leoids-set-boundary");
    hideSetupButton("btn-leoids-add-point");
    hideSetupButton("btn-leoids-undo-point");
    hideSetupButton("btn-leoids-confirm-boundary");
    hideSetupButton("btn-leoids-clear-boundary");
    hideSetupButton("btn-leoids-set-base");
  }

  setClick("btn-leoids-close", closeSetupPanel);
  setClick("btn-leoids-close-x", closeSetupPanel);

  setClick("btn-leoids-browse-games", openOnlineSessionBrowser);
  setClick("btn-leoids-open-setup", () => {
  openLeoidsMissionSetupScreen({ returnToLobby: false });
  });

  setClick("btn-leoids-runner", () => setRole("runner"));
  setClick("btn-leoids-hunter", () => setRole("hunter"));

  setClick("btn-leoids-boundary-circle", () => {
    setBoundaryMode("circle");
  });

  setClick("btn-leoids-boundary-polygon", () => {
    setBoundaryMode("polygon");
  });

  const boundarySize = $("leoids-boundary-size");
  if (boundarySize) {
    boundarySize.disabled = !isHost;
    boundarySize.onchange = (event) => {
      setBoundaryRadius(Number(event.target.value || DEFAULT_BOUNDARY_RADIUS));
    };
  }

  const baseRadius = $("leoids-base-radius");
  if (baseRadius) {
    baseRadius.disabled = !isHost;
    baseRadius.onchange = (event) => {
      setBaseRadius(Number(event.target.value || DEFAULT_BASE_RADIUS));
    };
  }

  const roundLength = $("leoids-round-length");
  if (roundLength) {
    roundLength.disabled = !isHost;
    roundLength.onchange = (event) => {
      setRoundLength(Number(event.target.value || DEFAULT_ROUND_SECONDS));
    };
  }

  const hunterDelay = $("leoids-hunter-delay");
  if (hunterDelay) {
    hunterDelay.disabled = !isHost;
    hunterDelay.onchange = (event) => {
      setHunterDelay(Number(event.target.value || DEFAULT_HUNTER_DELAY_SECONDS));
    };
  }

  const tagRadius = $("leoids-tag-radius");
  if (tagRadius) {
    tagRadius.disabled = !isHost;
    tagRadius.onchange = (event) => {
      setTagRadius(Number(event.target.value || DEFAULT_TAG_RADIUS));
    };
  }

  if (isHost) {
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
  }

setClick("btn-leoids-start", async () => {
  if (!isHost) {
    alert("Only the host can start the mission.");
    speakText?.("Only the host can start the mission.");
    return;
  }

  closeSetupPanel?.();

  leoidsState.onlineEnabled = !!leoidsState.onlineSessionId;

  enterBattleMap?.();
  hideLeoidsMapControls?.();

  loadAndApplyOnlineSession?.();
  startOnlinePlayerSync?.();
  startOnlineSessionSync?.();
  loadOnlinePlayers?.();
  startGpsOnlineSync?.();

  setTimeout(() => {
    redrawAllMapObjects?.();
    drawPlayerMarkers?.();
    showLeoidsBattleHud?.();
    updatePanel?.();
  }, 500);

  if (leoidsState.onlineEnabled && leoidsState.onlineSessionId) {
    await updateOnlineSession?.({
      status: "active",
      round_started_at: new Date().toISOString(),
    });

    startRoundFromOnlineSession?.({
      status: "active",
      round_time: leoidsState.roundTime,
      hunter_delay: leoidsState.hunterDelay,
      base_radius: leoidsState.baseRadius,
      tag_radius: leoidsState.tagRadius,
    });

    speakText?.("Online mission started.");
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
  const isHost = !!leoidsState.isLobbyHost || !leoidsState.onlineEnabled;
  const isRunner = local?.role === "runner";
  const isHunter = local?.role === "hunter";
  const followOn = leoidsState.followMe !== false;

  const hostName =
    window.LEOIDSSupabase?.hostName ||
    leoidsState.onlineHostName ||
    "Host";

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
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
        <div>
          <div style="color:#00d4ff;font-weight:1000;font-size:18px;">
            LEOIDS COMMAND
          </div>
          <div style="opacity:.8;font-size:12px;margin-top:2px;">
            ${
              isHost
                ? "You are hosting this game"
                : `Hosted by ${hostName}`
            }
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

      <div style="display:${isHost ? "block" : "none"};margin-top:14px;">
        <button id="btn-command-start-game" type="button" style="
          width:100%;
          min-height:52px;
          border-radius:18px;
          border:none;
          background:#22c55e;
          color:#05070b;
          font-weight:1000;
          box-shadow:0 0 22px rgba(34,197,94,.42);
        ">
          🚀 START GAME
        </button>
      </div>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:14px;
      ">
        <button id="btn-command-tag" type="button" style="
          min-height:52px;
          border-radius:16px;
          border:none;
          background:${isHunter ? "#ff3b3b" : "#374151"};
          color:white;
          font-weight:1000;
          opacity:${isHunter ? "1" : ".55"};
        ">
          🔴 TAG RUNNER
        </button>

        <button id="btn-command-release" type="button" style="
          min-height:52px;
          border-radius:16px;
          border:none;
          background:${isRunner ? "#22c55e" : "#374151"};
          color:${isRunner ? "#05070b" : "#cbd5e1"};
          font-weight:1000;
          opacity:${isRunner ? "1" : ".55"};
        ">
          🛡️ RESCUE
        </button>

        <button id="btn-command-follow" type="button" style="
          min-height:48px;
          border-radius:16px;
          border:none;
          background:${followOn ? "#00d4ff" : "#202a3c"};
          color:${followOn ? "#05070b" : "white"};
          font-weight:1000;
        ">
          📍 Follow: ${followOn ? "ON" : "OFF"}
        </button>

        <button id="btn-command-map-refresh" type="button" style="
          min-height:48px;
          border-radius:16px;
          border:none;
          background:#202a3c;
          color:white;
          font-weight:1000;
        ">
          🗺️ Refresh
        </button>

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

        <button id="btn-command-host-setup" type="button" style="
          display:${isHost ? "block" : "none"};
          min-height:48px;
          border-radius:16px;
          border:1px solid rgba(0,212,255,.45);
          background:#111827;
          color:#00d4ff;
          font-weight:1000;
        ">
          ⚙️ Setup
        </button>
      </div>

      <div style="display:${isHost ? "block" : "none"};margin-top:10px;">
        <button id="btn-command-end-round" type="button" style="
          width:100%;
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

  document.getElementById("btn-command-start-game")?.addEventListener("click", async () => {
    if (!isHost) {
      alert("Only the host can start the game.");
      return;
    }

    hideLeoidsCommandHub();

    if (leoidsState.onlineEnabled && leoidsState.onlineSessionId) {
      await startOnlineCountdown(leoidsState.countdownSeconds || 60);
      return;
    }

    startRound();
  });


document.getElementById("btn-leoids-open-setup")
?.addEventListener("click", () => {

  const ids = [
    "leoids-boundary-card",
    "leoids-jail-card",
    "leoids-round-card"
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);

    if (!el) return;

    el.style.display =
      el.style.display === "none"
        ? "block"
        : "none";
  });
});

  
  document.getElementById("btn-command-tag")?.addEventListener("click", async () => {
    hideLeoidsCommandHub();

    if (!isHunter) {
      showLeoidsEvent(
        "HUNTERS ONLY",
        "Only hunters can tag runners.",
        "🔴",
        "hunter"
      );

      speakText?.("Only hunters can tag runners.");
      return;
    }

    await tagNearestRunner();
  });

  document.getElementById("btn-command-release")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    tryReleaseJailedRunners();
  });

  document.getElementById("btn-command-follow")?.addEventListener("click", () => {
    leoidsState.followMe = leoidsState.followMe === false ? true : false;

    const stateText = leoidsState.followMe === false ? "off" : "on";

    speakText?.(`Follow me ${stateText}.`);

    const localPlayer = getLocalPlayer?.();
    const map = getMapSafe?.();

    if (leoidsState.followMe !== false && localPlayer?.position && map) {
      map.panTo([localPlayer.position.lat, localPlayer.position.lng], {
        animate: true,
        duration: 0.5,
      });
    }

    hideLeoidsCommandHub();
  });

  document.getElementById("btn-command-map-refresh")?.addEventListener("click", async () => {
    await loadOnlinePlayers?.();
    redrawAllMapObjects?.();
    drawPlayerMarkers?.();
    updateLeoidsBattleHud?.();
    speakText?.("Map refreshed.");
  });

  document.getElementById("btn-command-leaderboard")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    openLeoidsLeaderboard();
  });

  document.getElementById("btn-command-help")?.addEventListener("click", () => {
    hideLeoidsCommandHub();
    openLeoidsInstructions();
  });

  document.getElementById("btn-command-host-setup")?.addEventListener("click", () => {
    if (!isHost) {
      alert("Only the host can edit setup.");
      return;
    }

    hideLeoidsCommandHub();
    openSetupPanel();
  });

  document.getElementById("btn-command-end-round")?.addEventListener("click", () => {
    if (!isHost) {
      alert("Only the host can end the round.");
      return;
    }

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

function setRole(role = "runner") {
  leoidsState.role = role === "hunter" ? "hunter" : "runner";

  const local = getLocalPlayer();
  if (local) {
    local.role = leoidsState.role;
    local.status = "free";
    local.jailedAtBase = false;
  }

  const runnerBtn = $("btn-leoids-runner");
  const hunterBtn = $("btn-leoids-hunter");

  if (runnerBtn) {
    const active = leoidsState.role === "runner";

    runnerBtn.classList.toggle("active", active);
    runnerBtn.innerText = active ? "🟢 RUNNER SELECTED" : "🟢 RUNNER";
    runnerBtn.style.background = active ? "#22c55e" : "#10251a";
    runnerBtn.style.color = active ? "#05070b" : "#d1fae5";
    runnerBtn.style.border = active
      ? "2px solid #22c55e"
      : "1px solid rgba(34,197,94,.45)";
    runnerBtn.style.boxShadow = active
      ? "0 0 18px rgba(34,197,94,.38)"
      : "none";
    runnerBtn.style.fontWeight = "1000";
  }

  if (hunterBtn) {
    const active = leoidsState.role === "hunter";

    hunterBtn.classList.toggle("active", active);
    hunterBtn.innerText = active ? "🔴 HUNTER SELECTED" : "🔴 HUNTER";
    hunterBtn.style.background = active ? "#ff3b3b" : "#2a1116";
    hunterBtn.style.color = active ? "white" : "#fecaca";
    hunterBtn.style.border = active
      ? "2px solid #ff3b3b"
      : "1px solid rgba(255,59,59,.45)";
    hunterBtn.style.boxShadow = active
      ? "0 0 18px rgba(255,59,59,.38)"
      : "none";
    hunterBtn.style.fontWeight = "1000";
  }

  renderPlayers?.();
  drawPlayerMarkers?.();
  updatePanel?.();
  updateLeoidsBattleHud?.();

  speakText?.(
    leoidsState.role === "hunter" ? "Hunter selected." : "Runner selected."
  );
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
  setRole,
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
  loadLeoidsSounds,
  playLeoidsSound,
  showLeoidsCinematicOverlay,
  addAIPlayer,
  resetLocalPlayers,
  tagNearestRunner,
  tagSpecificRunner,
  rescueJailedRunners,
  openLeoidsMissionSetupScreen,
  createOnlineSession,
  joinOnlineSession,
  startOnlinePlayerSync,
  stopOnlinePlayerSync,
  loadOnlinePlayers,
  syncLocalPlayerPosition,
  startGpsOnlineSync,
  stopGpsOnlineSync,
  syncPlayerToOnline,
  saveOnlineSessionConfig,
  loadAndApplyOnlineSession,
  startOnlineSessionSync,
  startOnlineCountdown,
  startRoundFromOnlineSession,
  updateLeoidsLiveActionButton,
  hideLeoidsLiveActionButton,
  showLeoidsBattleHud,
  hideLeoidsBattleHud,
  updateLeoidsBattleHud,
  stopGpsOnlineSync,
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
