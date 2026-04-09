// trail_system.js

const TRAIL_DROP_DISTANCE_METERS = 6;
const MAX_TRAIL_POINTS = 60;

let trailLayer = null;
let trailPoints = [];
let lastTrailPoint = null;

function toRad(value) {
  return (value * Math.PI) / 180;
}

function distanceMeters(a, b) {
  const R = 6371000;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const aa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

function getTrailSymbol(trailId) {
  switch (trailId) {
    case "trail_poo":
      return "💩";
    case "trail_rainbow":
      return "🌈";
    case "trail_fire":
      return "🔥";
    case "trail_stars":
      return "✨";
    case "trail_slime":
      return "🟢";
    default:
      return null;
  }
}

function makeTrailIcon(symbol) {
  return L.divIcon({
    className: "trail-piece",
    html: `<div class="trail-piece-inner">${symbol}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function addTrailMarker(lat, lng, trailId) {
  if (!trailLayer) return;

  const symbol = getTrailSymbol(trailId);
  if (!symbol) return;

  const marker = L.marker([lat, lng], {
    icon: makeTrailIcon(symbol),
    interactive: false,
    keyboard: false,
  }).addTo(trailLayer);

  trailPoints.push(marker);

  if (trailPoints.length > MAX_TRAIL_POINTS) {
    const oldest = trailPoints.shift();
    if (oldest) {
      trailLayer.removeLayer(oldest);
    }
  }
}

export function initTrailSystem(map) {
  if (!map) return;

  if (trailLayer) {
    trailLayer.clearLayers();
  }

  trailLayer = L.layerGroup().addTo(map);
  trailPoints = [];
  lastTrailPoint = null;
}

export function clearTrailSystem() {
  if (trailLayer) {
    trailLayer.clearLayers();
  }

  trailPoints = [];
  lastTrailPoint = null;
}

export function updateTrailSystem({ lat, lng, equippedTrail }) {
  if (!trailLayer) return;
  if (!equippedTrail || equippedTrail === "trail_none") return;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  const current = { lat, lng };

  if (!lastTrailPoint) {
    lastTrailPoint = current;
    addTrailMarker(lat, lng, equippedTrail);
    return;
  }

  const moved = distanceMeters(lastTrailPoint, current);

  if (moved < TRAIL_DROP_DISTANCE_METERS) {
    return;
  }

  lastTrailPoint = current;
  addTrailMarker(lat, lng, equippedTrail);
}
