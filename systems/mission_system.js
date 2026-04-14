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

import { renderShop } from "./shop_ui.js";

let state = {};
let map;

const storageSystem = createStorageSystem({
  getState: () => state,
  setState: (s) => (state = s),
});

state = storageSystem.loadState();

const playerSystem = createPlayerSystem({
  getState: () => state,
  saveState: storageSystem.saveState,
});

const modalSystem = createModalSystem();

const notesSystem = createNotesSystem({
  getState: () => state,
  saveState: storageSystem.saveState,
});

const shopBridge = createShopBridge({
  getState: () => state,
  saveState: storageSystem.saveState,
});

const progressionSystem = createProgressionSystem({
  getState: () => state,
  saveState: storageSystem.saveState,
});

const mapSystem = createMapSystem({
  getState: () => state,
  getMap: () => map,
});

const uiSystem = createUISystem({
  renderShop,
  renderHomeLog: notesSystem.renderHomeLog,
});

const adultSystem = createAdultLockSystem({
  getState: () => state,
  saveState: storageSystem.saveState,
});

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
