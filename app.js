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

let state = {};
let map;

// STORAGE
const storageSystem = createStorageSystem({
  getDefaultAdaptiveProfile,
  normaliseAdaptiveProfile,
});

// LOAD STATE
state = storageSystem.loadState();

// PLAYER
const playerSystem = createPlayerSystem({
  state,
  saveState: storageSystem.saveState,
  renderShop,
  getLevelFromXP,
});

// MODALS
const modalSystem = createModalSystem();

// NOTES
const notesSystem = createNotesSystem({
  getState: () => state,
  saveState: storageSystem.saveState,
});

// SHOP
const shopBridge = createShopBridge({
  getState: () => state,
  saveState: storageSystem.saveState,
});

// PROGRESSION
const progressionSystem = createProgressionSystem({
  getState: () => state,
  saveState: storageSystem.saveState,
});

// MAP
const mapSystem = createMapSystem({
  getState: () => state,
  getMap: () => map,
});

// UI
const uiSystem = createUISystem({
  renderShop,
  renderHomeLog: notesSystem.renderHomeLog,
});

// ADULT LOCK
const adultSystem = createAdultLockSystem({
  getState: () => state,
  saveState: storageSystem.saveState,
});

// GLOBAL WIRING
wireApp({
  playerSystem,
  modalSystem,
  shopBridge,
  progressionSystem,
  mapSystem,
  notesSystem,
});

// INIT
document.addEventListener("DOMContentLoaded", () => {
  shopBridge.ensureShopDefaults();
  playerSystem.renderHUD();
  uiSystem.renderAllUI();
});
