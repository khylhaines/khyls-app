console.log("app.js file loaded");
// ==========================
// IMPORTS
// ==========================

import { createStorageSystem } from "./systems/storage_system.js";
import { createPlayerSystem } from "./systems/player_system.js";
import { createMapSystem } from "./systems/map_system.js";
import { createNotesSystem } from "./systems/notes_system.js";
import { createModalSystem } from "./systems/modal_system.js";
import { createShopBridge } from "./systems/shop_bridge.js";
import { createAdultLockSystem } from "./systems/adult_lock_system.js";
import { createProgressionSystem } from "./systems/progression_system.js";
import { createUISystem } from "./systems/ui_system.js";
import { wireApp } from "./systems/app_wiring.js";

import {
  getDefaultAdaptiveProfile,
  normaliseAdaptiveProfile,
} from "./systems/adaptive_system.js";

import { renderShop } from "./shop_ui.js";

// ==========================
// HELPERS
// ==========================

function getLevelFromXP(xp) {
  xp = Number(xp || 0);
  return Math.floor(xp / 100) + 1;
}

function $(id) {
  return document.getElementById(id);
}

// ==========================
// STATE
// ==========================

let state = {};
let map = null;

// ==========================
// STORAGE SYSTEM
// ==========================

const storageSystem = createStorageSystem({
  getDefaultAdaptiveProfile,
  normaliseAdaptiveProfile,
});

// ==========================
// LOAD STATE
// ==========================

state = storageSystem.loadState();

// ==========================
// PLAYER SYSTEM
// ==========================

const playerSystem = createPlayerSystem({
  state,
  saveState: storageSystem.saveStateNow,
  renderShop,
  getLevelFromXP,
});

// expose globally (IMPORTANT)
window.getActivePlayer = playerSystem.getActivePlayer;
window.renderHUD = playerSystem.renderHUD;
window.setActivePlayer = playerSystem.setActivePlayer;
window.setPlayerCount = playerSystem.setPlayerCount;
window.updateCoins = playerSystem.updateCoins;

// ==========================
// MODAL SYSTEM
// ==========================

const modalSystem = createModalSystem({
  $,
});

// ==========================
// NOTES SYSTEM
// ==========================

const notesSystem = createNotesSystem({
  state,
  saveState: storageSystem.saveStateNow,
});

// ==========================
// MAP SYSTEM
// ==========================

const mapSystem = createMapSystem({
  state,
});

// ==========================
// SHOP BRIDGE
// ==========================

const shopBridge = createShopBridge({
  state,
  saveState: storageSystem.saveStateNow,
});

// ==========================
// ADULT LOCK
// ==========================

const adultLockSystem = createAdultLockSystem({
  state,
  saveState: storageSystem.saveStateNow,
  $,
});

// ==========================
// PROGRESSION
// ==========================

const progressionSystem = createProgressionSystem({
  state,
  saveState: storageSystem.saveStateNow,
});

// ==========================
// UI SYSTEM
// ==========================

const uiSystem = createUISystem({
  state,
  $,
});

// ==========================
// APP WIRING
// ==========================

wireApp({
  state,
  storageSystem,
  playerSystem,
  mapSystem,
  notesSystem,
  modalSystem,
  shopBridge,
  adultLockSystem,
  progressionSystem,
  uiSystem,
});

// ==========================
// INITIAL RENDER
// ==========================

window.state = state;

window.renderShop = renderShop;

function boot() {
  try {
    setupSystems();
    renderEverything();
    wireButtons();

    audioSystem?.forceLoadVoices();

    initMap();
    checkBadgeUnlocksByCaptures();
    saveStateNow(true);

    audioSystem?.playWelcomeMessage();

    console.log("App loaded");
  } catch (err) {
    console.error("BOOT ERROR:", err);
  }
}

window.addEventListener("DOMContentLoaded", boot);

playerSystem.renderHUD();
renderShop();
