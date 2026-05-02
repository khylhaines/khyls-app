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

    mapMode: "none", // none / boundary / base

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

  function distanceMeters(a, b) {
    if (!a || !b) return Infinity;

    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

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
      return { lat: c.lat, lng: c.lng };
    }

    return { lat: 54.11371, lng: -3.218448 };
  }

  function randomNearbyPoint(center, radiusMeters = 40) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radiusMeters;

    const latOffset = (Math.cos(angle) * distance) / 111000;
    const lngOffset =
      (Math.sin(angle) * distance) /
      (111000 * Math.cos((center.lat * Math.PI) / 180));

    return {
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset,
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

  document
    .getElementById("btn-leoids-map-undo")
    ?.addEventListener("click", () => {
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
      // IMPORTANT: save it immediately, not just pending
      leoidsState.pendingBasePoint = point;
      leoidsState.basePoint = point;
      window.__leoidsBasePoint = point;

      drawBasePoint(point, leoidsState.baseRadius);
      showLeoidsMapControls("base");
      updatePanel();

      console.log("LEOIDS BASE CHOSEN:", point);

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
      lat: center.lat,
      lng: center.lng,
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
      lat: center.lat,
      lng: center.lng,
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
  renderPlayers?.();
  drawPlayerMarkers?.();

  showModal?.("leoids-modal");

  console.log("LEOIDS BASE CONFIRMED:", leoidsState.basePoint);

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
    speakText?.("LEOIDs boundary cleared.");
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
      if (!player.isAI || player.status === "jailed") return;
      player.position = randomNearbyPoint(player.position || center, 18);
    });

    drawPlayerMarkers();
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

    closest.status = "jailed";
    local.score += 50;
    local.coins += 10;
    leoidsState.score += 50;
    leoidsState.coins += 10;

    if (leoidsState.basePoint) {
      closest.position = randomNearbyPoint(leoidsState.basePoint, 5);
    }

    drawPlayerMarkers();
    renderPlayers();
    updatePanel();

    speakText?.(`${closest.name} tagged and sent to jail.`);
    checkHunterWin();
  }

  function rescueJailedRunners() {
    const local = getLocalPlayer();
    if (!local) return;

    if (local.role !== "runner") {
      alert("Only runners can rescue.");
      speakText?.("Only runners can rescue.");
      return;
    }

   if (!leoidsState.basePoint && window.__leoidsBasePoint) {
  leoidsState.basePoint = window.__leoidsBasePoint;
}

if (!leoidsState.basePoint) {
  const map = getMapSafe();

  if (map) {
    const center = map.getCenter();
    leoidsState.basePoint = {
      lat: Number(center.lat),
      lng: Number(center.lng),
    };

    drawBasePoint(leoidsState.basePoint, leoidsState.baseRadius);
    speakText?.("Jail base was missing, so I set it at the map centre.");
  }
}

if (!leoidsState.basePoint) {
  alert("Set the Jail / Base point first.");
  speakText?.("Set the jail base first.");
  return;
}


  function runAITagChecks() {
    if (!leoidsState.active || !leoidsState.huntersReleased) return;

    const hunters = leoidsState.players.filter(
      (p) => p.role === "hunter" && p.status === "free"
    );

    const runners = leoidsState.players.filter(
      (p) => p.role === "runner" && p.status === "free"
    );

    hunters.forEach((hunter) => {
      runners.forEach((runner) => {
        if (runner.status !== "free") return;

        const d = distanceMeters(hunter.position, runner.position);

        if (d <= leoidsState.tagRadius) {
          runner.status = "jailed";
          runner.position = leoidsState.basePoint
            ? randomNearbyPoint(leoidsState.basePoint, 5)
            : runner.position;

          hunter.score += 50;
          hunter.coins += 10;

          speakText?.(`${runner.name} tagged by ${hunter.name}.`);
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
    const map = getMapSafe();

    if (map) {
      const center = map.getCenter();
      leoidsState.basePoint = {
        lat: Number(center.lat),
        lng: Number(center.lng),
      };

      drawBasePoint(leoidsState.basePoint, leoidsState.baseRadius);
      speakText?.("Jail base was missing, so I set it at the map centre.");
    }
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
  leoidsState.huntersReleased = leoidsState.role !== "hunter";
  leoidsState.startedAt = new Date().toISOString();
  leoidsState.endedAt = null;

  leoidsState.players.forEach((player) => {
    player.status = "free";
    player.score = 0;
    player.coins = 0;
  });

  updatePanel();
  renderPlayers();
  drawPlayerMarkers();

  speakText?.(
    leoidsState.role === "hunter"
      ? `Hunter round started. Release in ${Math.round(
          leoidsState.hunterDelay / 60
        )} minutes.`
      : `Runner round started. Survive for ${Math.round(
          leoidsState.roundTime / 60
        )} minutes.`
  );

  leoidsState.intervalId = setInterval(tickRound, 1000);

  leoidsState.aiIntervalId = setInterval(() => {
    moveAIPlayers();
    runAITagChecks();
    renderPlayers();
    updatePanel();
  }, 2500);

  saveState?.();
}

  function tickRound() {
    if (!leoidsState.active) return;

    leoidsState.timeLeft = Math.max(0, leoidsState.timeLeft - 1);

    if (leoidsState.role === "hunter" && !leoidsState.huntersReleased) {
      leoidsState.hunterDelayLeft = Math.max(
        0,
        leoidsState.hunterDelayLeft - 1
      );

      if (leoidsState.hunterDelayLeft <= 0) {
        leoidsState.huntersReleased = true;
        speakText?.("Hunters released.");
      }
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
      `Tag Radius: ${leoidsState.tagRadius}m\n` +
      `Free Runners: ${freeRunners}\n` +
      `Jailed Runners: ${jailedRunners}\n` +
      `Score: ${leoidsState.score}\n` +
      `Coins earned: ${leoidsState.coins}`;
  }

function wirePanelButtons() {
  $("btn-leoids-close")?.addEventListener("click", closeSetupPanel);
  $("btn-leoids-close-x")?.addEventListener("click", closeSetupPanel);

  $("btn-leoids-runner")?.addEventListener("click", () => setRole("runner"));
  $("btn-leoids-hunter")?.addEventListener("click", () => setRole("hunter"));

  $("btn-leoids-boundary-circle")?.addEventListener("click", () =>
    setBoundaryMode("circle")
  );

  $("btn-leoids-boundary-polygon")?.addEventListener("click", () =>
    setBoundaryMode("polygon")
  );

  $("leoids-round-length")?.addEventListener("change", (e) => {
    setRoundLength(Number(e.target.value || DEFAULT_ROUND_SECONDS));
  });

  $("leoids-hunter-delay")?.addEventListener("change", (e) => {
    setHunterDelay(Number(e.target.value || DEFAULT_HUNTER_DELAY_SECONDS));
  });

  $("leoids-boundary-size")?.addEventListener("change", (e) => {
    setBoundaryRadius(Number(e.target.value || DEFAULT_BOUNDARY_RADIUS));
  });

  $("leoids-base-radius")?.addEventListener("change", (e) => {
    setBaseRadius(Number(e.target.value || DEFAULT_BASE_RADIUS));
  });

  $("leoids-tag-radius")?.addEventListener("change", (e) => {
    setTagRadius(Number(e.target.value || DEFAULT_TAG_RADIUS));
  });

  $("btn-leoids-set-boundary")?.addEventListener("click", setCircleBoundaryHere);
  $("btn-leoids-add-point")?.addEventListener("click", addStreetBoundaryPointHere);
  $("btn-leoids-undo-point")?.addEventListener("click", undoStreetBoundaryPoint);
  $("btn-leoids-confirm-boundary")?.addEventListener("click", confirmBoundary);
  $("btn-leoids-clear-boundary")?.addEventListener("click", clearBoundaryFull);
  $("btn-leoids-set-base")?.addEventListener("click", setBaseHere);

  $("btn-leoids-map-confirm-boundary")?.addEventListener(
    "click",
    confirmBoundaryFromMap
  );

  $("btn-leoids-map-confirm-base")?.addEventListener(
    "click",
    confirmBaseFromMap
  );

  $("btn-leoids-map-undo")?.addEventListener("click", () => {
    undoStreetBoundaryPoint();
    showLeoidsMapControls("boundary");
  });

  $("btn-leoids-map-back")?.addEventListener(
    "click",
    backToLeoidsPanelFromMap
  );

  $("btn-leoids-add-ai-runner")?.addEventListener("click", () =>
    addAIPlayer("runner")
  );

  $("btn-leoids-add-ai-hunter")?.addEventListener("click", () =>
    addAIPlayer("hunter")
  );

  $("btn-leoids-reset-players")?.addEventListener("click", resetLocalPlayers);
  $("btn-leoids-tag")?.addEventListener("click", tagNearestRunner);
  $("btn-leoids-rescue")?.addEventListener("click", rescueJailedRunners);
  $("btn-leoids-start")?.addEventListener("click", startRound);
  $("btn-leoids-end")?.addEventListener("click", () => endRound("manual"));
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
