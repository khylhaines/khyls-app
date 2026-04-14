export function registerMapSystem(BQ) {
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
    if (BQ.state.activePack === "adult") {
      if (!BQ.state.activeAdultCategory) return BQ.ADULT_PINS.filter(hasValidCoords);
      return BQ.ADULT_PINS.filter(
        (p) => p.category === BQ.state.activeAdultCategory && hasValidCoords(p)
      );
    }

    if (BQ.state.mapMode === "park") {
      return BQ.PINS.filter((p) => p.set === "park" && hasValidCoords(p));
    }

    if (BQ.state.mapMode === "abbey") {
      return BQ.PINS.filter((p) => p.set === "abbey" && hasValidCoords(p));
    }

    return BQ.PINS.filter((p) => p.set === "core" && hasValidCoords(p));
  }

  function getModeStart() {
    if (BQ.state.activePack === "adult") {
      const pins = getCurrentPins();
      if (pins.length) return [pins[0].l[0], pins[0].l[1], 14];
      return [54.11371, -3.218448, 14];
    }

    if (BQ.state.mapMode === "park") return [54.1174, -3.2168, 16];
    if (BQ.state.mapMode === "abbey") return [54.1344, -3.1964, 15];
    return [54.11371, -3.218448, 14];
  }

  function createHeroIcon() {
    const char = BQ.state.settings.character || "hero_duo";
    const value = BQ.CHARACTER_ICONS[char] || "🧭";

    if (typeof value === "string" && (value.endsWith(".jpg") || value.endsWith(".png"))) {
      return L.divIcon({
        className: "marker-logo",
        html: `
          <div style="
            width:52px;
            height:52px;
            border-radius:50%;
            overflow:hidden;
            border:2px solid #ffd54a;
            box-shadow:0 4px 12px rgba(0,0,0,0.6);
            background:#111;
          ">
            <img src="${value}" style="width:100%;height:100%;object-fit:cover;">
          </div>
        `,
        iconSize: [52, 52],
        iconAnchor: [26, 26],
      });
    }

    return L.divIcon({
      className: "marker-logo",
      html: `<div style="font-size:40px;">${value}</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }

  function applyMapTheme() {
    if (!BQ.map) return;

    const theme = BQ.state.settings?.mapTheme || "map_classic";
    const el = BQ.$("map");
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

  function createPinIcon(pin) {
    const status = BQ.getCaptureStatus(pin);
    const icon = pin.i || "📍";
    const abbey = BQ.getAbbeyRebuild?.() || { stage: 0 };
    const hasGlowPack = BQ.getInventoryCount("route_glow_pack") > 0;

    if (status.fullyCaptured) {
      return L.divIcon({
        className: "marker-logo",
        html: `
          <div style="
            width:38px;
            height:38px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(77,255,158,0.18);
            border:2px solid #4dff9e;
            box-shadow:0 0 0 2px rgba(0,0,0,0.35) inset;
            font-size:20px;
            line-height:1;
            ${hasGlowPack ? "filter: drop-shadow(0 0 8px rgba(99,255,211,.7));" : ""}
          ">✅</div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });
    }

    const abbeyGlow =
      BQ.state.activePack === "classic" &&
      BQ.state.mapMode === "abbey" &&
      abbey.stage > 0
        ? `filter: drop-shadow(0 0 ${4 + abbey.stage * 2}px rgba(255,213,74,.35));`
        : "";

    if (status.completedCount > 0) {
      return L.divIcon({
        className: "marker-logo",
        html: `
          <div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center;${abbeyGlow}">
            <div style="font-size:28px;line-height:1;">${icon}</div>
            <div style="
              position:absolute;
              right:-4px;
              bottom:-4px;
              min-width:20px;
              height:20px;
              padding:0 4px;
              border-radius:999px;
              background:#ffd54a;
              color:#111;
              font-size:11px;
              font-weight:900;
              display:flex;
              align-items:center;
              justify-content:center;
              border:2px solid #111;
            ">${status.completedCount}/${status.required}</div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });
    }

    return L.divIcon({
      className: "marker-logo",
      html: `<div style="font-size:28px;line-height:1;${abbeyGlow}">${icon}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
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
    const btn = BQ.$("action-trigger");
    if (!btn) return;
    btn.style.display = show ? "block" : "none";
  }

  function updateCaptureText(text) {
    const actionBtn = BQ.$("action-trigger");
    if (actionBtn && text) {
      actionBtn.title = text;
    }
  }

  function renderPins() {
    if (!BQ.map) return;

    Object.values(BQ.activeMarkers).forEach((m) => BQ.map.removeLayer(m));
    BQ.activeMarkers = {};

    const pins = getCurrentPins();

    pins.forEach((pin) => {
      const marker = L.marker(pin.l, {
        icon: createPinIcon(pin),
      }).addTo(BQ.map);

      marker.on("click", () => {
        BQ.currentPin = pin;
        showActionButton(true);

        const status = BQ.getCaptureStatus(pin);
        updateCaptureText(
          status.fullyCaptured
            ? `${pin.n} • CAPTURED • REPLAY`
            : `${pin.n} • ${status.completedCount}/${status.required} CAPTURED`
        );

        BQ.speakText?.(
          status.fullyCaptured
            ? `${pin.n}. Fully captured. Replay available.`
            : `${pin.n}. ${status.completedCount} out of ${status.required} captured.`
        );
      });

      BQ.activeMarkers[pin.id] = marker;
    });
  }

  function refreshAllPinMarkers() {
    Object.keys(BQ.activeMarkers).forEach((pinId) => {
      const pin = getCurrentPins().find((p) => p.id === pinId);
      if (pin) {
        BQ.activeMarkers[pin.id].setIcon(createPinIcon(pin));
      }
    });
  }

  function refreshPinMarker(pin) {
    if (!pin || !BQ.activeMarkers[pin.id]) return;
    BQ.activeMarkers[pin.id].setIcon(createPinIcon(pin));
  }

  function startLocationWatch() {
    if (!navigator.geolocation || !BQ.map) return;

    BQ.locationWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        BQ.dropTrailAt?.(lat, lng);
        BQ.heroMarker?.setLatLng([lat, lng]);

        const pins = getCurrentPins();
        const radius = Number(BQ.state.settings.radius || 35);

        let nearby = null;

        for (const pin of pins) {
          const d = distanceInMeters(lat, lng, pin.l[0], pin.l[1]);
          if (d <= radius) {
            nearby = pin;
            break;
          }
        }

        BQ.currentPin = nearby;

        if (nearby) {
          const status = BQ.getCaptureStatus(nearby);
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

  function initMap() {
    const [lat, lng, zoom] = getModeStart();

    BQ.map = L.map("map", {
      zoomControl: !!BQ.state.settings.zoomUI,
    }).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(BQ.map);

    BQ.heroMarker = L.marker([lat, lng], { icon: createHeroIcon() }).addTo(BQ.map);
    applyMapTheme();
    renderPins();
    startLocationWatch();
  }

  function resetMap() {
    if (BQ.locationWatchId != null && navigator.geolocation?.clearWatch) {
      try {
        navigator.geolocation.clearWatch(BQ.locationWatchId);
      } catch {}
      BQ.locationWatchId = null;
    }

    if (BQ.map) {
      BQ.map.remove();
      BQ.map = null;
    }

    BQ.activeMarkers = {};
    BQ.heroMarker = null;
    BQ.currentPin = null;
    BQ.clearTrailLayers?.();

    initMap();
    BQ.renderHomeLog?.();
  }

  BQ.hasValidCoords = hasValidCoords;
  BQ.getCurrentPins = getCurrentPins;
  BQ.getModeStart = getModeStart;
  BQ.createHeroIcon = createHeroIcon;
  BQ.applyMapTheme = applyMapTheme;
  BQ.createPinIcon = createPinIcon;
  BQ.distanceInMeters = distanceInMeters;
  BQ.showActionButton = showActionButton;
  BQ.updateCaptureText = updateCaptureText;
  BQ.renderPins = renderPins;
  BQ.refreshAllPinMarkers = refreshAllPinMarkers;
  BQ.refreshPinMarker = refreshPinMarker;
  BQ.startLocationWatch = startLocationWatch;
  BQ.initMap = initMap;
  BQ.resetMap = resetMap;

  window.applyMapTheme = applyMapTheme;
  window.createHeroIcon = createHeroIcon;
  window.refreshHeroMarker = () => {
    if (BQ.heroMarker) {
      BQ.heroMarker.setIcon(createHeroIcon());
    }
  };
}
