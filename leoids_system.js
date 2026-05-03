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

    mapMode: "none",

    players: [
      {
        id: "p1",
        name: "You",
        role: "runner",
        status: "free",
        isAI: false,
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
        leoidsState.score = Math.max(0, Number(leoidsState.score || 0) - 25);

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
    return leoidsState.players.find((p) => !p.isAI) || leoidsState.players[0];
  }

  function getPlayerIcon(player) {
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
      if (!player.position) {
        player.position = randomNearbyPoint(center, 35 + index * 15);
      }
    });

    drawPlayerMarkers();
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
    updatePanel();
  }

  function exitBattleMap() {
    stopTimer();
    stopAI();
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

  function confirmBoundary() {
    confirmBoundaryFromMap();
  }

  function confirmBoundaryFromMap() {
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

    openSetupPanel();

    speakText?.("Boundary confirmed.");
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

  function confirmBaseFromMap() {
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

    updatePanel();
    renderPlayers();
    drawPlayerMarkers();

    showModal?.("leoids-modal");

    speakText?.("Jail base confirmed.");
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

      const marker = L.circleMarker([player.position.lat, player.position.lng], {
        radius: player.isAI ? 8 : 10,
        color: player.role === "hunter" ? "#ff4d4d" : "#4da3ff",
        weight: 4,
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

      leoidsState.playerMarkers.push(marker);
    });
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
        role: leoidsState.role,
        status: "free",
        isAI: false,
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

    sendRunnerToJail(closest);

    local.score += 50;
    local.coins += 10;
    leoidsState.score += 50;
    leoidsState.coins += 10;

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();

    speakText?.(`${closest.name} tagged. Go to jail.`);
    checkHunterWin();
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


  
 function startRound() {
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

  if (typeof checkBoundaryRules === "function") {
    checkBoundaryRules();
  }

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
            <span>${getPlayerIcon(player)} ${player.name}</span>
            <strong>${player.role.toUpperCase()} • ${player.status.toUpperCase()} • ${player.score} pts</strong>
          </div>
        `
      )
      .join("");
  }

  function updatePanel() {
    if (!$("leoids-status")) return;

    const roleText = leoidsState.role === "hunter" ? "Hunter" : "Runner";
    const statusText = leoidsState.active ? "ACTIVE" : "SETUP";

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

    setClick("btn-leoids-close", closeSetupPanel);
    setClick("btn-leoids-close-x", closeSetupPanel);

    setClick("btn-leoids-runner", () => setRole("runner"));
    setClick("btn-leoids-hunter", () => setRole("hunter"));

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
    setClick("btn-leoids-confirm-boundary", confirmBoundary);
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

    setCircleBoundaryHere,
    addStreetBoundaryPointHere,
    undoStreetBoundaryPoint,
    confirmBoundary,
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
    rescueJailedRunners,

    startRound,
    endRound,
    updatePanel,
    wirePanelButtons,
  };
}
