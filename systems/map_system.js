import { PINS } from "../pins.js";
import { ADULT_PINS } from "../adult_pins.js";

export function createMapSystem({
  getState,
  setMap,
  getMap,
  setHeroMarker,
  getHeroMarker,
  setActiveMarkers,
  getActiveMarkers,
  setCurrentPin,
  getCurrentPin,
  showActionButton,
  updateCaptureText,
  createHeroIcon,
  createPinIcon,
  getCaptureStatus,
  dropTrailAt,
  clearTrailLayers,
  renderHomeLog,
  speakText,
}) {
  let locationWatchId = null;

  function hasValidCoords(pin) {
    return (
      Array.isArray(pin?.l) &&
      pin.l.length === 2 &&
      Number.isFinite(pin.l[0]) &&
      Number.isFinite(pin.l[1]) &&
      !(pin.l[0] === 0 && pin.l[1] === 0)
    );
  }

  function getCurrentPins() {
    const state = getState();

    if (state.activePack === "adult") {
      if (!state.activeAdultCategory) {
        return ADULT_PINS.filter(hasValidCoords);
      }

      return ADULT_PINS.filter(
        (p) => p.category === state.activeAdultCategory && hasValidCoords(p)
      );
    }

    if (state.mapMode === "park") {
      return PINS.filter((p) => p.set === "park" && hasValidCoords(p));
    }

    if (state.mapMode === "abbey") {
      return PINS.filter((p) => p.set === "abbey" && hasValidCoords(p));
    }

    return PINS.filter((p) => p.set === "core" && hasValidCoords(p));
  }

  function getModeStart() {
    const state = getState();

    if (state.activePack === "adult") {
      const pins = getCurrentPins();
      if (pins.length) return [pins[0].l[0], pins[0].l[1], 14];
      return [54.11371, -3.218448, 14];
    }

    if (state.mapMode === "park") return [54.1174, -3.2168, 16];
    if (state.mapMode === "abbey") return [54.1344, -3.1964, 15];
    return [54.11371, -3.218448, 14];
  }

  function applyMapTheme() {
    const map = getMap();
    if (!map) return;

    const state = getState();
    const theme = state.settings?.mapTheme || "map_classic";
    const el = document.getElementById("map");
    if (!el) return;

    el.classList.remove("map-theme-classic", "map-theme-dark", "map-theme-neon");

    if (theme === "map_dark") {
      el.classList.add("map-theme-dark");
    } else if (theme === "map_neon") {
      el.classList.add("map-theme-neon");
    } else {
      el.classList.add("map-theme-classic");
    }
  }

  function distanceInMeters(aLat, aLng, bLat, bLng) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);

    const aa =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(aLat)) *
        Math.cos(toRad(bLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  }

  function renderPins() {
    const map = getMap();
    if (!map) return;

    const activeMarkers = getActiveMarkers() || {};
    Object.values(activeMarkers).forEach((marker) => map.removeLayer(marker));

    const nextMarkers = {};
    const pins = getCurrentPins();

    pins.forEach((pin) => {
      const marker = L.marker(pin.l, {
        icon: createPinIcon(pin),
      }).addTo(map);

      marker.on("click", () => {
        setCurrentPin(pin);
        showActionButton(true);

        const status = getCaptureStatus(pin);

        updateCaptureText(
          status.fullyCaptured
            ? `${pin.n} • CAPTURED • REPLAY`
            : `${pin.n} • ${status.completedCount}/${status.required} CAPTURED`
        );

        speakText(
          status.fullyCaptured
            ? `${pin.n}. Fully captured. Replay available.`
            : `${pin.n}. ${status.completedCount} out of ${status.required} captured.`
        );
      });

      nextMarkers[pin.id] = marker;
    });

    setActiveMarkers(nextMarkers);
  }

  function refreshPinMarker(pin) {
    if (!pin) return;
    const activeMarkers = getActiveMarkers() || {};
    if (!activeMarkers[pin.id]) return;

    activeMarkers[pin.id].setIcon(createPinIcon(pin));
  }

  function refreshAllPinMarkers() {
    const activeMarkers = getActiveMarkers() || {};
    Object.keys(activeMarkers).forEach((pinId) => {
      const pin = getCurrentPins().find((p) => p.id === pinId);
      if (pin) {
        activeMarkers[pin.id].setIcon(createPinIcon(pin));
      }
    });
  }

  function startLocationWatch() {
    const map = getMap();
    if (!navigator.geolocation || !map) return;

    locationWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        dropTrailAt(lat, lng);

        const heroMarker = getHeroMarker();
        heroMarker?.setLatLng([lat, lng]);

        const pins = getCurrentPins();
        const state = getState();
        const radius = Number(state.settings?.radius || 35);

        let nearby = null;

        for (const pin of pins) {
          const d = distanceInMeters(lat, lng, pin.l[0], pin.l[1]);
          if (d <= radius) {
            nearby = pin;
            break;
          }
        }

        setCurrentPin(nearby);

        if (nearby) {
          const status = getCaptureStatus(nearby);

          updateCaptureText(
            status.fullyCaptured
              ? `${nearby.n} • CAPTURED • REPLAY`
              : `${nearby.n} • ${status.completedCount}/${status.required} CAPTURED`
          );

          showActionButton(true);
        } else {
          showActionButton(false);
        }
      },
      () => {},
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  }

  function stopLocationWatch() {
    if (locationWatchId != null && navigator.geolocation?.clearWatch) {
      try {
        navigator.geolocation.clearWatch(locationWatchId);
      } catch {}
      locationWatchId = null;
    }
  }

  function initMap() {
    const [lat, lng, zoom] = getModeStart();

    const map = L.map("map", {
      zoomControl: !!getState().settings?.zoomUI,
    }).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    setMap(map);

    const heroMarker = L.marker([lat, lng], { icon: createHeroIcon() }).addTo(map);
    setHeroMarker(heroMarker);

    applyMapTheme();
    renderPins();
    startLocationWatch();
  }

  function resetMap() {
    stopLocationWatch();

    const map = getMap();
    if (map) {
      map.remove();
      setMap(null);
    }

    setActiveMarkers({});
    setHeroMarker(null);
    setCurrentPin(null);
    clearTrailLayers();

    initMap();
    renderHomeLog?.();
  }

  return {
    hasValidCoords,
    getCurrentPins,
    getModeStart,
    applyMapTheme,
    distanceInMeters,
    initMap,
    resetMap,
    renderPins,
    refreshPinMarker,
    refreshAllPinMarkers,
    startLocationWatch,
    stopLocationWatch,
  };
}
