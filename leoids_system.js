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
    baseRadius: DEFAULT_BASE_RADIUS,
    tagRadius: DEFAULT_TAG_RADIUS,

    boundaryLayer: null,
    boundaryMarker: null,
    polygonLayer: null,
    polygonPointMarkers: [],
    baseLayer: null,
    baseMarker: null,

    score: 0,
    coins: 0,
    startedAt: null,
    endedAt: null,
    intervalId: null,
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
    clearAllMapObjects();

    const mapEl = $("map");
    if (mapEl) {
      mapEl.classList.remove("leoids-battle-map");
    }

    refreshAllPinMarkers?.();
  }

function disableMapPointAdding() {
  const map = getMapSafe();
  if (!map || !leoidsState.mapClickHandler) return;

  try {
    map.off("click", leoidsState.mapClickHandler);
  } catch {}

  leoidsState.mapClickHandler = null;
}
  
function enableMapPointAdding() {
  const map = getMapSafe();
  if (!map) return;

  disableMapPointAdding();

  leoidsState.mapClickHandler = (event) => {
    if (leoidsState.boundaryMode !== "polygon") return;

    const point = {
      lat: event.latlng.lat,
      lng: event.latlng.lng,
    };

    leoidsState.boundaryCenter = null;
    leoidsState.boundaryPoints.push(point);

    clearCircleBoundary();
    drawPolygonBoundary();
    updatePanel();

    speakText?.(`Boundary point ${leoidsState.boundaryPoints.length} added.`);
  };

  map.on("click", leoidsState.mapClickHandler);
}

  
  function openSetupPanel() {
    enterBattleMap();

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

    setBoundaryMode(leoidsState.boundaryMode, false);
    updatePanel();

    showModal?.("leoids-modal");
    speakText?.("LEOIDS battle map opened. Build your boundary.");
  }

function closeSetupPanel() {
  closeModal?.("leoids-modal");

  if (leoidsState.boundaryMode === "polygon") {
    enableMapPointAdding();
    speakText?.("Tap the map to add boundary points.");
  }
}

  function setRole(role = "runner") {
    leoidsState.role = role === "hunter" ? "hunter" : "runner";

    $("btn-leoids-runner")?.classList.toggle(
      "active",
      leoidsState.role === "runner"
    );

    $("btn-leoids-hunter")?.classList.toggle(
      "active",
      leoidsState.role === "hunter"
    );

    updatePanel();

    speakText?.(
      leoidsState.role === "hunter" ? "Hunter selected." : "Runner selected."
    );
  }

function setBoundaryMode(mode = "circle", announce = true) {
  leoidsState.boundaryMode = mode === "polygon" ? "polygon" : "circle";

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

  updatePanel();

  if (leoidsState.boundaryMode === "polygon") {
    closeModal?.("leoids-modal");
    showActionButton?.(false);
    enableMapPointAdding();
    speakText?.("Street boundary mode. Tap the map to add boundary points.");
  } else {
    disableMapPointAdding();
    showActionButton?.(false);
    speakText?.("Circle boundary mode.");
  }
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

    clearPolygonBoundary();
    drawCircleBoundary(leoidsState.boundaryCenter, leoidsState.boundaryRadius);
    setBoundaryMode("circle", false);
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
    setBoundaryMode("polygon", false);
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

  function setBaseHere() {
    const map = getMapSafe();
    if (!map) return;

    const center = map.getCenter();

    leoidsState.basePoint = {
      lat: center.lat,
      lng: center.lng,
    };

    drawBasePoint(leoidsState.basePoint, leoidsState.baseRadius);
    updatePanel();

    speakText?.("Jail base set.");
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
    leoidsState.mapClickHandler = null, 
  }

  function clearAllMapObjects() {
    clearCircleBoundary();
    clearPolygonBoundary();
    clearBasePoint();
  }

  function clearBoundaryFull() {
    clearCircleBoundary();
    clearPolygonBoundary();

    leoidsState.boundaryCenter = null;
    leoidsState.boundaryPoints = [];

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
  }

  function hasValidBoundary() {
    if (leoidsState.boundaryMode === "circle") {
      return !!leoidsState.boundaryCenter;
    }

    return leoidsState.boundaryPoints.length >= 3;
  }

  function startRound() {
    if (!hasValidBoundary()) {
      alert("Set a LEOIDS boundary first. Street boundary needs at least 3 points.");
      speakText?.("Set a valid boundary first.");
      return;
    }

    if (!leoidsState.basePoint) {
      alert("Set the Jail / Base point first.");
      speakText?.("Set the jail base first.");
      return;
    }

    stopTimer();

    leoidsState.active = true;
    leoidsState.status = "free";
    leoidsState.score = 0;
    leoidsState.coins = 0;
    leoidsState.timeLeft = leoidsState.roundTime;
    leoidsState.hunterDelayLeft = leoidsState.hunterDelay;
    leoidsState.huntersReleased = leoidsState.role !== "hunter";
    leoidsState.startedAt = new Date().toISOString();
    leoidsState.endedAt = null;

    updatePanel();

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

    leoidsState.active = false;
    leoidsState.endedAt = new Date().toISOString();

    if (reason === "timer" && leoidsState.role === "runner") {
      leoidsState.score += 200;
      leoidsState.coins += 30;
      speakText?.("Runners survive. Round complete.");
    } else {
      speakText?.("LEOIDS round ended.");
    }

    updatePanel();
    saveState?.();
  }

  function stopTimer() {
    if (leoidsState.intervalId) {
      clearInterval(leoidsState.intervalId);
      leoidsState.intervalId = null;
    }
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

    $("leoids-status").innerText =
      `Mode: ${statusText}\n` +
      `Boundary: ${boundaryText}\n` +
      `Base: ${baseText}\n` +
      `Role: ${roleText}\n` +
      `Round Time: ${formatTime(leoidsState.timeLeft)}\n` +
      `${releaseText}\n` +
      `Tag Radius: ${leoidsState.tagRadius}m\n` +
      `Status: ${leoidsState.status.toUpperCase()}\n` +
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
    $("btn-leoids-clear-boundary")?.addEventListener("click", clearBoundaryFull);
    $("btn-leoids-set-base")?.addEventListener("click", setBaseHere);

    $("btn-leoids-start")?.addEventListener("click", startRound);
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
    setBaseHere,
    clearBoundaryFull,
    startRound,
    endRound,
    updatePanel,
    wirePanelButtons,
  };
}
