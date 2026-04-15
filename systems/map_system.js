export function createMapSystem({ state }) {
  let map = null;
  let heroMarker = null;
  let activeMarkers = {};
  let currentPin = null;
  let locationWatchId = null;
  let nightVisionOn = false;

  function getState() {
    return state;
  }

  function getCurrentPins() {
    const s = getState();

    if (typeof window.getCurrentPins === "function") {
      return window.getCurrentPins();
    }

    if (Array.isArray(s.currentPins)) {
      return s.currentPins;
    }

    return [];
  }

  function getModeStart() {
    const s = getState();

    if (s.activePack === "adult") {
      const pins = getCurrentPins();
      if (pins.length && Array.isArray(pins[0].l)) {
        return [pins[0].l[0], pins[0].l[1], 14];
      }
      return [54.11371, -3.218448, 14];
    }

    if (s.mapMode === "park") return [54.1174, -3.2168, 16];
    if (s.mapMode === "abbey") return [54.1344, -3.1964, 15];
    return [54.11371, -3.218448, 14];
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

  function showActionButton(show) {
    const btn = document.getElementById("action-trigger");
    if (!btn) return;
    btn.style.display = show ? "block" : "none";
  }

  function updateCaptureText(text) {
    const btn = document.getElementById("action-trigger");
    if (!btn || !text) return;
    btn.title = text;
  }

  function renderPins() {
    if (!map) return;

    Object.values(activeMarkers).forEach((marker) => {
      try {
        map.removeLayer(marker);
      } catch {}
    });

    activeMarkers = {};

    const pins = getCurrentPins();

    pins.forEach((pin) => {
      if (!Array.isArray(pin.l) || pin.l.length !== 2) return;

      const marker = L.marker(pin.l, {
        icon:
          typeof window.createPinIcon === "function"
            ? window.createPinIcon(pin)
            : undefined,
      }).addTo(map);

      marker.on("click", () => {
        currentPin = pin;
        window.currentPin = pin;
        showActionButton(true);

        if (typeof window.getCaptureStatus === "function") {
          const status = window.getCaptureStatus(pin);
          updateCaptureText(
            status.fullyCaptured
              ? `${pin.n} • CAPTURED • REPLAY`
              : `${pin.n} • ${status.completedCount}/${status.required} CAPTURED`
          );

          window.speakText?.(
            status.fullyCaptured
              ? `${pin.n}. Fully captured. Replay available.`
              : `${pin.n}. ${status.completedCount} out of ${status.required} captured.`
          );
        } else {
          updateCaptureText(pin.n || "Location");
        }
      });

      activeMarkers[pin.id] = marker;
    });
  }

  function refreshPinMarker(pin) {
    if (!pin || !activeMarkers[pin.id]) return;
    if (typeof window.createPinIcon !== "function") return;
    activeMarkers[pin.id].setIcon(window.createPinIcon(pin));
  }

  function refreshAllPinMarkers() {
    Object.keys(activeMarkers).forEach((pinId) => {
      const pin = getCurrentPins().find((p) => p.id === pinId);
      if (pin) refreshPinMarker(pin);
    });
  }

  function applyMapTheme() {
    const s = getState();
    const el = document.getElementById("map");
    if (!el) return;

    el.classList.remove("map-theme-classic", "map-theme-dark", "map-theme-neon");

    const theme = s.settings?.mapTheme || "map_classic";

    if (theme === "map_dark") {
      el.classList.add("map-theme-dark");
    } else if (theme === "map_neon") {
      el.classList.add("map-theme-neon");
    } else {
      el.classList.add("map-theme-classic");
    }
  }

  function createHeroIcon() {
    if (typeof window.createHeroIcon === "function") {
      return window.createHeroIcon();
    }

    return L.divIcon({
      className: "marker-logo",
      html: `<div style="font-size:40px;">🧭</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }

  function startLocationWatch() {
    if (!navigator.geolocation || !map) return;

    locationWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        heroMarker?.setLatLng([lat, lng]);

        if (typeof window.dropTrailAt === "function") {
          window.dropTrailAt(lat, lng);
        }

        const pins = getCurrentPins();
        const radius = Number(getState().settings?.radius || 35);

        let nearby = null;

        for (const pin of pins) {
          if (!Array.isArray(pin.l) || pin.l.length !== 2) continue;
          const d = distanceInMeters(lat, lng, pin.l[0], pin.l[1]);
          if (d <= radius) {
            nearby = pin;
            break;
          }
        }

        currentPin = nearby;
        window.currentPin = nearby || null;

        if (nearby) {
          if (typeof window.getCaptureStatus === "function") {
            const status = window.getCaptureStatus(nearby);
            updateCaptureText(
              status.fullyCaptured
                ? `${nearby.n} • CAPTURED • REPLAY`
                : `${nearby.n} • ${status.completedCount}/${status.required} CAPTURED`
            );
          } else {
            updateCaptureText(nearby.n || "Location");
          }

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

  function initMap() {
    const [lat, lng, zoom] = getModeStart();

    map = L.map("map", {
      zoomControl: !!getState().settings?.zoomUI,
    }).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    heroMarker = L.marker([lat, lng], {
      icon: createHeroIcon(),
    }).addTo(map);

    applyMapTheme();
    renderPins();
    startLocationWatch();
  }

  function resetMap() {
    if (locationWatchId != null && navigator.geolocation?.clearWatch) {
      try {
        navigator.geolocation.clearWatch(locationWatchId);
      } catch {}
      locationWatchId = null;
    }

    if (map) {
      map.remove();
      map = null;
    }

    activeMarkers = {};
    heroMarker = null;
    currentPin = null;
    window.currentPin = null;

    if (typeof window.clearTrailLayers === "function") {
      window.clearTrailLayers();
    }

    initMap();
  }

  function toggleNightVision() {
    const el = document.getElementById("map");
    if (!el) return;

    nightVisionOn = !nightVisionOn;
    el.classList.toggle("night-vision", nightVisionOn);
    window.speakText?.(nightVisionOn ? "Night vision on." : "Night vision off.");
  }

  function getMap() {
    return map;
  }

  function getCurrentPin() {
    return currentPin;
  }

  return {
    initMap,
    resetMap,
    renderPins,
    refreshPinMarker,
    refreshAllPinMarkers,
    applyMapTheme,
    startLocationWatch,
    distanceInMeters,
    toggleNightVision,
    showActionButton,
    updateCaptureText,
    getMap,
    getCurrentPin,
  };
}
