// trail_system.js

export function createTrailSystem({
  getState,
  getMap,
  distanceInMeters,
  playTrailSound,
} = {}) {
  let trailLayers = [];
  let lastTrailDropAt = 0;
  let lastTrailLatLng = null;

  function getStateSafe() {
    return typeof getState === "function" ? getState() : {};
  }

  function getMapSafe() {
    return typeof getMap === "function" ? getMap() : null;
  }

  function getTrailLifetimeMs() {
    const state = getStateSafe();
    const mode = state?.settings?.trailDuration || "long";

    if (mode === "short") return 10000;
    if (mode === "long") return 600000;
    if (mode === "day") return 86400000;
    if (mode === "permanent") return null;

    return 600000;
  }

  function getEquippedTrailId() {
    const state = getStateSafe();
    return state?.settings?.equippedTrail || "trail_none";
  }

  function getTrailConfig(trailId) {
    const lifetime = getTrailLifetimeMs();

    switch (trailId) {
      case "trail_poo":
        return { emoji: "💩", size: 18, lifetime, stepDistance: 10 };
      case "trail_rainbow":
        return { emoji: "🌈", size: 20, lifetime, stepDistance: 12 };
      case "trail_fire":
        return { emoji: "🔥", size: 18, lifetime, stepDistance: 11 };
      case "trail_stars":
        return { emoji: "✨", size: 18, lifetime, stepDistance: 11 };
      case "trail_slime":
        return { emoji: "🟢", size: 14, lifetime, stepDistance: 10 };
      case "trail_none":
      default:
        return null;
    }
  }

  function createTrailIcon(emoji, size = 18) {
    return L.divIcon({
      className: "trail-emoji-icon",
      html: `
        <div style="
          font-size:${size}px;
          line-height:1;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,.45));
          pointer-events:none;
          user-select:none;
        ">${emoji}</div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function clearTrailLayers() {
    const map = getMapSafe();

    if (!map) {
      trailLayers = [];
      lastTrailLatLng = null;
      lastTrailDropAt = 0;
      return;
    }

    trailLayers.forEach((layer) => {
      try {
        map.removeLayer(layer);
      } catch {}
    });

    trailLayers = [];
    lastTrailLatLng = null;
    lastTrailDropAt = 0;
  }

  function dropTrailAt(lat, lng) {
    const map = getMapSafe();
    if (!map) return;

    const trailId = getEquippedTrailId();
    const config = getTrailConfig(trailId);
    if (!config) return;

    const now = Date.now();

    if (lastTrailLatLng) {
      const moved =
        typeof distanceInMeters === "function"
          ? distanceInMeters(lastTrailLatLng.lat, lastTrailLatLng.lng, lat, lng)
          : 0;

      if (moved < config.stepDistance) return;
    }

    if (now - lastTrailDropAt < 250) return;

    const marker = L.marker([lat, lng], {
      icon: createTrailIcon(config.emoji, config.size),
      interactive: false,
      keyboard: false,
      zIndexOffset: -1000,
    }).addTo(map);

    trailLayers.push(marker);

    if (trailLayers.length > 120) {
      const oldest = trailLayers.shift();
      try {
        map.removeLayer(oldest);
      } catch {}
    }

    lastTrailDropAt = now;
    lastTrailLatLng = { lat, lng };

    if (typeof playTrailSound === "function") {
      playTrailSound(trailId);
    }

    if (config.lifetime !== null) {
      setTimeout(() => {
        try {
          const liveMap = getMapSafe();
          if (liveMap && marker) {
            liveMap.removeLayer(marker);
          }
        } catch {}

        trailLayers = trailLayers.filter((x) => x !== marker);
      }, config.lifetime);
    }
  }

  return {
    getTrailLifetimeMs,
    getEquippedTrailId,
    getTrailConfig,
    createTrailIcon,
    clearTrailLayers,
    dropTrailAt,
  };
}
