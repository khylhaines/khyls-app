// ==========================
// IMPORTS
// ==========================

import * as StorageModule from "./systems/storage_system.js";
import * as PlayerModule from "./systems/player_system.js";
import * as MapModule from "./systems/map_system.js";
import * as NotesModule from "./systems/notes_system.js";
import * as ModalModule from "./systems/modal_system.js";
import * as ShopBridgeModule from "./systems/shop_bridge.js";
import * as AdultLockModule from "./systems/adult_lock_system.js";
import * as ProgressionModule from "./systems/progression_system.js";
import * as UIModule from "./systems/ui_system.js";
import * as AppWiringModule from "./systems/app_wiring.js";

import {
  getDefaultAdaptiveProfile,
  normaliseAdaptiveProfile,
} from "./qa.js";

import { renderShop } from "./shop_ui.js";

// ==========================
// HELPERS
// ==========================

function $(id) {
  return document.getElementById(id);
}

function getLevelFromXP(xp) {
  const safeXp = Math.max(0, Number(xp || 0));
  return Math.floor(safeXp / 100) + 1;
}

function noop() {}

function safeCall(fn, ...args) {
  if (typeof fn === "function") {
    return fn(...args);
  }
  return undefined;
}

function resolveFactory(mod, createName, registerName) {
  if (typeof mod?.[createName] === "function") return mod[createName];
  if (typeof mod?.[registerName] === "function") return mod[registerName];
  return null;
}

function isRegisterStyle(mod, createName, registerName) {
  return typeof mod?.[registerName] === "function" && typeof mod?.[createName] !== "function";
}

function makeDefaultState() {
  return {
    players: [
      { id: "p1", name: "Player 1", coins: 0, enabled: true },
      { id: "p2", name: "Player 2", coins: 0, enabled: false },
      { id: "p3", name: "Player 3", coins: 0, enabled: false },
      { id: "p4", name: "Player 4", coins: 0, enabled: false },
    ],
    activePlayerId: "p1",
    mapMode: "core",
    activePack: "classic",
    activeAdultCategory: null,
    tierMode: "kid",
    unlockedMysteries: [],
    completedQuestionIds: [],
    recentQuestionTags: [],
    quizProfiles: {
      kid: getDefaultAdaptiveProfile("kid"),
      teen: getDefaultAdaptiveProfile("teen"),
      adult: getDefaultAdaptiveProfile("adult"),
    },
    purchasedItems: [],
    inventory: {},
    captainNotes: [],
    completedPins: {},
    pinStats: {
      totalCompleted: 0,
      totalFirstCompletions: 0,
      totalRepeatCompletions: 0,
    },
    meta: {
      xp: 0,
      tokens: 0,
      badges: [],
    },
    settings: {
      radius: 35,
      voicePitch: 1,
      voiceRate: 1,
      voiceName: "",
      sfxVol: 80,
      zoomUI: false,
      character: "hero_duo",
      equippedTrail: "trail_none",
      mapTheme: "map_classic",
    },
    adultLock: {
      unlocked: false,
      pin: "",
      sessionApproved: false,
      hideWhenKidsMode: false,
    },
    route: null,
    rebuild: {
      abbey: {
        points: 0,
        stage: 0,
        completedRoutes: [],
        unlockedCore: false,
        completedCore: false,
        finished: false,
      },
    },
    bossProgress: {},
  };
}

function ensureCoreStateShape(state) {
  if (!state || typeof state !== "object") state = {};

  const fallback = makeDefaultState();

  state.players = Array.isArray(state.players) ? state.players : fallback.players;
  state.activePlayerId = state.activePlayerId || "p1";
  state.mapMode = state.mapMode || "core";
  state.activePack = state.activePack || "classic";
  state.activeAdultCategory =
    state.activeAdultCategory === undefined ? null : state.activeAdultCategory;
  state.tierMode = state.tierMode || "kid";

  state.unlockedMysteries = Array.isArray(state.unlockedMysteries)
    ? state.unlockedMysteries
    : [];
  state.completedQuestionIds = Array.isArray(state.completedQuestionIds)
    ? state.completedQuestionIds
    : [];
  state.recentQuestionTags = Array.isArray(state.recentQuestionTags)
    ? state.recentQuestionTags
    : [];

  state.quizProfiles =
    state.quizProfiles && typeof state.quizProfiles === "object"
      ? state.quizProfiles
      : fallback.quizProfiles;

  state.purchasedItems = Array.isArray(state.purchasedItems)
    ? state.purchasedItems
    : [];
  state.inventory =
    state.inventory && typeof state.inventory === "object" ? state.inventory : {};
  state.captainNotes = Array.isArray(state.captainNotes) ? state.captainNotes : [];
  state.completedPins =
    state.completedPins && typeof state.completedPins === "object"
      ? state.completedPins
      : {};
  state.pinStats =
    state.pinStats && typeof state.pinStats === "object"
      ? state.pinStats
      : fallback.pinStats;
  state.meta =
    state.meta && typeof state.meta === "object" ? state.meta : fallback.meta;
  state.settings =
    state.settings && typeof state.settings === "object"
      ? { ...fallback.settings, ...state.settings }
      : fallback.settings;
  state.adultLock =
    state.adultLock && typeof state.adultLock === "object"
      ? { ...fallback.adultLock, ...state.adultLock }
      : fallback.adultLock;
  state.rebuild =
    state.rebuild && typeof state.rebuild === "object"
      ? state.rebuild
      : fallback.rebuild;
  state.bossProgress =
    state.bossProgress && typeof state.bossProgress === "object"
      ? state.bossProgress
      : {};
  state.route = state.route || null;

  if (!state.settings.character) state.settings.character = "hero_duo";
  if (!state.settings.equippedTrail) state.settings.equippedTrail = "trail_none";
  if (!state.settings.mapTheme) state.settings.mapTheme = "map_classic";

  return state;
}

// ==========================
// GLOBAL APP OBJECT
// ==========================

const BQ = {
  $,
  getLevelFromXP,
  state: ensureCoreStateShape(makeDefaultState()),
  map: null,
  heroMarker: null,
  activeMarkers: {},
  currentPin: null,
  currentTask: null,
  systems: {},
};

// ==========================
// STORAGE SYSTEM
// ==========================

const storageFactory = resolveFactory(
  StorageModule,
  "createStorageSystem",
  "registerStorageSystem"
);

const storageSystem = storageFactory
  ? isRegisterStyle(StorageModule, "createStorageSystem", "registerStorageSystem")
    ? (storageFactory(BQ), BQ)
    : storageFactory({
        getDefaultAdaptiveProfile,
        normaliseAdaptiveProfile,
      })
  : {};

BQ.systems.storage = storageSystem;

const loadedState =
  safeCall(storageSystem.loadState) ||
  safeCall(storageSystem.load) ||
  BQ.state;

BQ.state = ensureCoreStateShape(loadedState);
window.state = BQ.state;

function saveStateNow(force = false) {
  if (typeof storageSystem.saveStateNow === "function") {
    return storageSystem.saveStateNow(force);
  }
  if (typeof storageSystem.saveNow === "function") {
    return storageSystem.saveNow(force);
  }
  if (typeof storageSystem.saveState === "function") {
    return storageSystem.saveState(force);
  }
  return false;
}

function saveState() {
  if (typeof storageSystem.saveState === "function") {
    return storageSystem.saveState();
  }
  return saveStateNow(false);
}

// ==========================
// PLAYER SYSTEM
// ==========================

const playerFactory = resolveFactory(
  PlayerModule,
  "createPlayerSystem",
  "registerPlayerSystem"
);

const playerSystem = playerFactory
  ? isRegisterStyle(PlayerModule, "createPlayerSystem", "registerPlayerSystem")
    ? (playerFactory(BQ), BQ)
    : playerFactory({
        state: BQ.state,
        saveState,
        saveStateNow,
        renderShop,
        getLevelFromXP,
      })
  : {};

BQ.systems.player = playerSystem;

// ==========================
// MODAL SYSTEM
// ==========================

const modalFactory = resolveFactory(
  ModalModule,
  "createModalSystem",
  "registerModalSystem"
);

const modalSystem = modalFactory
  ? isRegisterStyle(ModalModule, "createModalSystem", "registerModalSystem")
    ? (modalFactory(BQ), BQ)
    : modalFactory({ $ })
  : {};

BQ.systems.modal = modalSystem;

// ==========================
// NOTES SYSTEM
// ==========================

const notesFactory = resolveFactory(
  NotesModule,
  "createNotesSystem",
  "registerNotesSystem"
);

const notesSystem = notesFactory
  ? isRegisterStyle(NotesModule, "createNotesSystem", "registerNotesSystem")
    ? (notesFactory(BQ), BQ)
    : notesFactory({
        state: BQ.state,
        saveState,
        saveStateNow,
        $,
      })
  : {};

BQ.systems.notes = notesSystem;

// ==========================
// MAP SYSTEM
// ==========================

const mapFactory = resolveFactory(
  MapModule,
  "createMapSystem",
  "registerMapSystem"
);

const mapSystem = mapFactory
  ? isRegisterStyle(MapModule, "createMapSystem", "registerMapSystem")
    ? (mapFactory(BQ), BQ)
    : mapFactory({
        state: BQ.state,
        $,
      })
  : {};

BQ.systems.map = mapSystem;

// ==========================
// SHOP BRIDGE
// ==========================

const shopFactory = resolveFactory(
  ShopBridgeModule,
  "createShopBridge",
  "registerShopBridge"
);

const shopBridge = shopFactory
  ? isRegisterStyle(ShopBridgeModule, "createShopBridge", "registerShopBridge")
    ? (shopFactory(BQ), BQ)
    : shopFactory({
        state: BQ.state,
        getState: () => BQ.state,
        saveState,
        saveStateNow,
      })
  : {};

BQ.systems.shop = shopBridge;

// ==========================
// ADULT LOCK
// ==========================

const adultFactory = resolveFactory(
  AdultLockModule,
  "createAdultLockSystem",
  "registerAdultLockSystem"
);

const adultLockSystem = adultFactory
  ? isRegisterStyle(
      AdultLockModule,
      "createAdultLockSystem",
      "registerAdultLockSystem"
    )
    ? (adultFactory(BQ), BQ)
    : adultFactory({
        state: BQ.state,
        saveState,
        saveStateNow,
        $,
      })
  : {};

BQ.systems.adultLock = adultLockSystem;

// ==========================
// PROGRESSION
// ==========================

const progressionFactory = resolveFactory(
  ProgressionModule,
  "createProgressionSystem",
  "registerProgressionSystem"
);

const progressionSystem = progressionFactory
  ? isRegisterStyle(
      ProgressionModule,
      "createProgressionSystem",
      "registerProgressionSystem"
    )
    ? (progressionFactory(BQ), BQ)
    : progressionFactory({
        state: BQ.state,
        saveState,
        saveStateNow,
      })
  : {};

BQ.systems.progression = progressionSystem;

// ==========================
// UI SYSTEM
// ==========================

const uiFactory = resolveFactory(
  UIModule,
  "createUISystem",
  "registerUISystem"
);

const uiSystem = uiFactory
  ? isRegisterStyle(UIModule, "createUISystem", "registerUISystem")
    ? (uiFactory(BQ), BQ)
    : uiFactory({
        state: BQ.state,
        $,
      })
  : {};

BQ.systems.ui = uiSystem;

// ==========================
// SHOP DEFAULTS
// ==========================

function ensureShopDefaults() {
  BQ.state = ensureCoreStateShape(BQ.state);

  if (typeof shopBridge.ensureShopDefaults === "function") {
    shopBridge.ensureShopDefaults();
  } else if (typeof window.ensureDefaultOwnedInventory === "function") {
    const normalised = window.ensureDefaultOwnedInventory(
      BQ.state.inventory,
      BQ.state.purchasedItems
    );
    BQ.state.inventory = normalised.inventory || {};
    BQ.state.purchasedItems = normalised.purchasedItems || [];
  }

  if (!BQ.state.settings.equippedTrail) BQ.state.settings.equippedTrail = "trail_none";
  if (!BQ.state.settings.mapTheme) BQ.state.settings.mapTheme = "map_classic";
  if (!BQ.state.settings.character) BQ.state.settings.character = "hero_duo";
}

function getInventoryCount(itemId) {
  return Number(BQ.state?.inventory?.[itemId] || 0);
}

// ==========================
// GLOBALS NEEDED BY SHOP / UI
// ==========================

window.state = BQ.state;
window.renderShop = renderShop;
window.getLevelFromXP = getLevelFromXP;
window.getInventoryCount = getInventoryCount;
window.ensureShopDefaults = ensureShopDefaults;

window.getActivePlayer =
  playerSystem.getActivePlayer ||
  BQ.getActivePlayer ||
  function () {
    return (
      BQ.state.players.find(
        (p) => p.id === BQ.state.activePlayerId && p.enabled
      ) ||
      BQ.state.players.find((p) => p.enabled) ||
      BQ.state.players[0]
    );
  };

window.renderHUD =
  playerSystem.renderHUD ||
  BQ.renderHUD ||
  noop;

window.setActivePlayer =
  playerSystem.setActivePlayer ||
  BQ.setActivePlayer ||
  noop;

window.setPlayerCount =
  playerSystem.setPlayerCount ||
  BQ.setPlayerCount ||
  noop;

window.updateCoins =
  playerSystem.updateCoins ||
  BQ.updateCoins ||
  noop;

window.saveState = saveState;
window.saveStateNow = saveStateNow;

window.applySettingsToUI =
  uiSystem.applySettingsToUI ||
  BQ.applySettingsToUI ||
  noop;

window.renderHomeLog =
  uiSystem.renderHomeLog ||
  BQ.renderHomeLog ||
  noop;

window.updateStartButtons =
  uiSystem.updateStartButtons ||
  BQ.updateStartButtons ||
  noop;

window.speakText =
  uiSystem.speakText ||
  BQ.speakText ||
  noop;

window.playSound =
  uiSystem.playSound ||
  BQ.playSound ||
  noop;

window.clearTrailLayers =
  mapSystem.clearTrailLayers ||
  BQ.clearTrailLayers ||
  noop;

window.applyMapTheme =
  mapSystem.applyMapTheme ||
  BQ.applyMapTheme ||
  noop;

window.createHeroIcon =
  mapSystem.createHeroIcon ||
  BQ.createHeroIcon ||
  (() => null);

window.refreshHeroMarker = function refreshHeroMarker() {
  if (typeof mapSystem.refreshHeroMarker === "function") {
    return mapSystem.refreshHeroMarker();
  }
  if (
    BQ.heroMarker &&
    typeof window.createHeroIcon === "function" &&
    typeof BQ.heroMarker.setIcon === "function"
  ) {
    BQ.heroMarker.setIcon(window.createHeroIcon());
  }
};

window.showModal =
  modalSystem.showModal ||
  BQ.showModal ||
  function (id) {
    const el = $(id);
    if (el) el.style.display = "block";
  };

window.closeModal =
  modalSystem.closeModal ||
  BQ.closeModal ||
  function (id) {
    const el = $(id);
    if (el) el.style.display = "none";
  };

// ==========================
// APP WIRING
// ==========================

const wireAppFn =
  AppWiringModule.wireApp ||
  AppWiringModule.createAppWiring ||
  AppWiringModule.registerAppWiring ||
  null;

// ==========================
// BOOT
// ==========================

function boot() {
  try {
    ensureShopDefaults();

    if (typeof wireAppFn === "function") {
      wireAppFn({
        BQ,
        state: BQ.state,
        $,
        storageSystem,
        playerSystem,
        mapSystem,
        notesSystem,
        modalSystem,
        shopBridge,
        adultLockSystem,
        progressionSystem,
        uiSystem,
        renderShop,
        saveState,
        saveStateNow,
      });
    }

    safeCall(window.applySettingsToUI);
    safeCall(window.updateStartButtons);

    if (typeof adultLockSystem.refreshAdultLockUI === "function") {
      adultLockSystem.refreshAdultLockUI();
    } else if (typeof BQ.refreshAdultLockUI === "function") {
      BQ.refreshAdultLockUI();
    }

    safeCall(window.renderHUD);
    safeCall(window.renderHomeLog);
    safeCall(renderShop);

    if (typeof notesSystem.renderCaptainNotes === "function") {
      notesSystem.renderCaptainNotes();
    } else if (typeof BQ.renderCaptainNotes === "function") {
      BQ.renderCaptainNotes();
    }

    if (typeof mapSystem.initMap === "function") {
      mapSystem.initMap();
    } else if (typeof BQ.initMap === "function") {
      BQ.initMap();
    }

    console.log("App loaded");
  } catch (err) {
    console.error("BOOT ERROR:", err);
  }
}

window.addEventListener("DOMContentLoaded", boot);
