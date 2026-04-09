// =========================
// IMPORTS
// =========================
import {
  getShopSections,
  getItemsForSection,
  getShopItemById,
  isEquippableItem,
  getEquipSlot,
} from "./shop_items.js";

import {
  initTrailSystem,
  updateTrailSystem,
  clearTrailSystem,
} from "./trail_system.js";

// =========================
// GLOBAL STATE
// =========================
let map;
let heroMarker;
let activeMarkers = {};
let currentPin = null;
let locationWatchId = null;

// =========================
// BASE STATE
// =========================
const DEFAULT_STATE = {
  xp: 0,
  coins: 0,
  inventory: {},
  settings: {
    character: "hero_duo",
    equippedTrail: "trail_none",
    mapTheme: "map_default",
    radius: 35,
    zoomUI: false,
    voicePitch: 1,
    voiceRate: 1,
    sfxVol: 80,
  },
};

let state = loadState();

// =========================
// LOAD / SAVE
// =========================
function loadState() {
  try {
    const raw = localStorage.getItem("barrowQuestState");
    if (!raw) return structuredClone(DEFAULT_STATE);

    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: {
        ...DEFAULT_STATE.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem("barrowQuestState", JSON.stringify(state));
}

// =========================
// MAP INIT
// =========================
function initMap() {
  const lat = 54.110;
  const lng = -3.230;
  const zoom = 15;

  map = L.map("map", {
    zoomControl: !!state.settings.zoomUI,
  }).setView([lat, lng], zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  initTrailSystem(map);

  heroMarker = L.marker([lat, lng], {
    icon: createHeroIcon(),
  }).addTo(map);

  startLocationWatch();
}
// =========================
// HERO ICON
// =========================
function createHeroIcon() {
  return L.divIcon({
    className: "hero-icon",
    html: `<div style="font-size:28px">🧍</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// =========================
// LOCATION TRACKING
// =========================
function startLocationWatch() {
  if (!navigator.geolocation) return;

  locationWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (heroMarker) {
        heroMarker.setLatLng([lat, lng]);
      }

      updateTrailSystem({
        lat,
        lng,
        equippedTrail: state.settings.equippedTrail,
      });
    },
    () => {},
    {
      enableHighAccuracy: true,
    }
  );
}

// =========================
// RESET MAP
// =========================
function resetMap() {
  if (locationWatchId) {
    navigator.geolocation.clearWatch(locationWatchId);
  }

  clearTrailSystem();

  if (map) {
    map.remove();
  }

  initMap();
}// =========================
// INVENTORY HELPERS
// =========================
function getInventoryCount(id) {
  return state.inventory[id] || 0;
}

function addToInventory(id) {
  state.inventory[id] = (state.inventory[id] || 0) + 1;
}

// =========================
// BUY ITEM
// =========================
function buyShopItem(itemId) {
  const item = getShopItemById(itemId);
  if (!item) return;

  if (state.coins < item.cost) {
    speakText("Not enough coins.");
    return;
  }

  state.coins -= item.cost;
  addToInventory(itemId);

  saveState();
  renderShop();

  speakText(`${item.name} purchased.`);
}

window.buyShopItem = buyShopItem;

// =========================
// EQUIP ITEM
// =========================
function equipShopItem(itemId) {
  const item = getShopItemById(itemId);
  if (!item) return false;

  if (!isEquippableItem(item)) return false;
  if (getInventoryCount(itemId) < 1) return false;

  const slot = getEquipSlot(item);

  if (slot === "character") {
    state.settings.character = item.id;

    if (heroMarker) {
      heroMarker.setIcon(createHeroIcon());
    }
  }

  if (slot === "trail") {
    state.settings.equippedTrail = item.id;
  }

  if (slot === "mapTheme") {
    state.settings.mapTheme = item.id;
  }

  saveState();
  renderShop();

  speakText(`${item.name} equipped.`);
  return true;
}

window.equipShopItem = equipShopItem;// =========================
// RENDER SHOP
// =========================
function renderShop() {
  const list = document.getElementById("shop-list");
  if (!list) return;

  const inv = state.inventory;

  list.innerHTML = getShopSections()
    .map((section) => {
      const items = getItemsForSection(section);

      if (!items.length) return "";

      return `
        <div class="shop-card">
          <h3>${section.title}</h3>

          ${items
            .map((item) => {
              const owned = inv[item.id];
              const equipped =
                state.settings.character === item.id ||
                state.settings.equippedTrail === item.id ||
                state.settings.mapTheme === item.id;

              return `
                <div class="shop-item">
                  <div class="shop-item-top">
                    <strong>${item.name}</strong>
                    <span class="shop-cost">${item.cost}</span>
                  </div>

                  <div class="shop-mini">${item.desc}</div>

                  ${
                    equipped
                      ? `<div class="owned-tag">EQUIPPED</div>`
                      : owned && item.equippable
                      ? `<button class="win-btn" onclick="equipShopItem('${item.id}')">EQUIP</button>`
                      : owned
                      ? `<div class="owned-tag">OWNED</div>`
                      : `<button class="win-btn" onclick="buyShopItem('${item.id}')">BUY</button>`
                  }
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    })
    .join("");
}

// =========================
// SPEECH
// =========================
function speakText(text) {
  if (!("speechSynthesis" in window)) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = state.settings.voicePitch;
  utter.rate = state.settings.voiceRate;

  speechSynthesis.speak(utter);
}

// =========================
// START
// =========================
window.addEventListener("load", () => {
  initMap();
  renderShop();
});
