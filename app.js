import {
  getQA,
  getPinStartIntro,
  getDefaultAdaptiveProfile,
  normaliseAdaptiveProfile,
  updateAdaptiveProfile,
} from "./qa.js";
import { createTerritorySystem } from "./territory_system.js";
import { PINS } from "./pins.js";
import { ADULT_PINS } from "./adult_pins.js";
import { ADULT_CONTENT } from "./adult_content.js";
import { createAbbeySystem } from "./abbey_system.js";
import { applyReward } from "./progression.js";
import { getRandomMystery } from "./mysteries.js";
import { createAudioSystem } from "./audio_system.js";
import { createBossSystem } from "./boss_system.js";
import  { renderShop } from "./shop_ui.js";
import { createTrailSystem } from "./trail_system.js";
import { SHOP_ITEMS } from "./shop_items.js";
import {
  getShopItemById,
  getShopSections,
  getItemsForSection,
  isStackableItem,
  isEquippableItem,
  getEquipSlot,
  ensureDefaultOwnedInventory,
  buyShopItem,
} from "./shop_system.js";

const $ = (id) => document.getElementById(id);

/* ============================
   STORAGE SYSTEM
============================ */
const SAVE_VERSION = 4;
const SAVE_KEY = "bq_world_v20_phase4_boss";
const BACKUP_KEY = "bq_world_v20_phase4_boss_backup";
const EXPORT_FILENAME = "barrow-quest-save.json";

let autosaveTimer = null;
let lastSaveHash = "";

function stableStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function queueSaveState(delay = 160) {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    saveStateNow();
  }, delay);
}

function computeStorageHealth() {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    app: "Barrow Quest",
    saveKey: SAVE_KEY,
  };
}

function createBackupSnapshot(payload) {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("Backup snapshot failed:", err);
  }
}

function saveStateNow(force = false) {
  try {
    const payload = buildSavePayload();
    const raw = stableStringify(payload);
    if (!raw) return false;

    if (!force && raw === lastSaveHash) return true;

    localStorage.setItem(SAVE_KEY, raw);
    createBackupSnapshot(payload);
    lastSaveHash = raw;
    return true;
  } catch (err) {
    console.error("SAVE ERROR:", err);
    return false;
  }
}

function exportSaveFile() {
  try {
    const payload = buildSavePayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = EXPORT_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("EXPORT SAVE FAILED:", err);
    return false;
  }
}

async function importSaveFileFromInput(file) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const migrated = migrateSave(parsed);
    state = normaliseLoadedState(migrated);
    saveStateNow(true);
    renderEverything();
    return true;
  } catch (err) {
    console.error("IMPORT SAVE FAILED:", err);
    return false;
  }
}

function resetAllProgress() {
  try {
    localStorage.removeItem(SAVE_KEY);
    state = structuredClone(DEFAULT_STATE);
    saveStateNow(true);
    renderEverything();
    return true;
  } catch (err) {
    console.error("RESET FAILED:", err);
    return false;
  }
}

window.BQStorage = {
  exportSaveFile,
  importSaveFileFromInput,
  resetAllProgress,
  saveNow: () => saveStateNow(true),
  getState: () => structuredClone(state),
};

function migrateSave(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const version = Number(source?.storage?.version || source?.saveVersion || 0);

  if (version >= SAVE_VERSION) return source;

  const migrated = {
    ...source,
  };

  if (!migrated.storage || typeof migrated.storage !== "object") {
    migrated.storage = {};
  }

  if (!migrated.captainNotes) migrated.captainNotes = [];
  if (!migrated.route) migrated.route = null;
  if (!migrated.rebuild) {
    migrated.rebuild = {
      abbey: {
        points: 0,
        stage: 0,
        completedRoutes: [],
        unlockedCore: false,
        completedCore: false,
        finished: false,
      },
    };
  }

  if (!migrated.bossProgress || typeof migrated.bossProgress !== "object") {
    migrated.bossProgress = {};
  }

if (!migrated.territory || typeof migrated.territory !== "object") {
    migrated.territory = { nodes: {} };
  }

  if (!migrated.territory.nodes || typeof migrated.territory.nodes !== "object") {
    migrated.territory.nodes = {};
  }
  
  migrated.storage.version = SAVE_VERSION;
  migrated.storage.migratedFrom = version;
  migrated.storage.migratedAt = new Date().toISOString();

  return migrated;
}

/* ============================
   CONSTANTS
============================ */
const BADGE_MILESTONES = [
  { captures: 1, name: "Scout", icon: "🧭" },
  { captures: 5, name: "Explorer", icon: "🥾" },
  { captures: 10, name: "Tracker", icon: "🗺️" },
  { captures: 20, name: "Pathfinder", icon: "🧱" },
  { captures: 50, name: "Adventurer", icon: "⚔️" },
  { captures: 100, name: "Legend", icon: "👑" },
];

const PIN_REWARD_IMAGES = {
  park_cenotaph: {
    src: "./images/rewards/cenotaph.jpg",
    caption: "The Cenotaph complete.",
  },
  park_bandstand: {
    src: "./images/rewards/bandstand.jpg",
    caption: "Bandstand complete.",
  },
  park_leisure_centre: {
    src: "./images/rewards/leisure.jpg",
    caption: "Leisure Centre complete.",
  },
  park_mini_railway: {
    src: "./images/rewards/railway.jpg",
    caption: "Mini Railway complete.",
  },
};



const BOSS_MODE_PIN_IDS = ["abbey_boss"];

const BOSS_DEFS = {
  abbey_boss: {
    id: "abbey_boss",
    title: "Furness Abbey: The Lost Order Boss Trial",
    badgeName: "Abbey Archivist",
    badgeIcon: "👑",
    rewardImage: "./monk.jpg",
    rewardCaption:
      "You solved the Abbey boss trial and restored the final lost sequence.",
    penalty: {
      coins: 10,
      xp: 5,
    },
    kids: {
      autoOrder: true,
      steps: [
        {
          kind: "story",
          title: "The Abbey Begins",
          text:
            "Long ago, Furness Abbey was founded as a place of worship, work, order, and learning. People came here to live by rules, prayer, and daily routine.",
          reward: { coins: 12, xp: 8 },
        },
        {
          kind: "story",
          title: "Life Inside the Walls",
          text:
            "The monks did not only pray. They worked, farmed, stored knowledge, and kept the Abbey running every day. The place was alive with routine and purpose.",
          reward: { coins: 12, xp: 8 },
        },
        {
          kind: "puzzle",
          title: "Boss Puzzle: Right Call in the Right Order",
          text:
            "Put these in the right order: Founded first, destroyed later. Then the game will add them together for you.",
          options: [
            "1537 then 1127",
            "1127 then 1537",
            "1200 then 1400",
          ],
          answer: 1,
          autoSolve: "sum_found_destroyed",
          autoSolveValue: 2664,
          successText:
            "Correct. Founded first, dissolved later. 1127 + 1537 = 2664.",
          reward: { coins: 30, xp: 18 },
          routeComplete: true,
        },
      ],
    },
    teen: {
      autoOrder: false,
      steps: [
        {
          kind: "story",
          title: "A Powerful Religious House",
          text:
            "Furness Abbey grew into one of the great monastic houses in the region. It was not just a church ruin. It once held wealth, land, structure, labour, and influence.",
          reward: { coins: 12, xp: 8 },
        },
        {
          kind: "story",
          title: "Order and Routine",
          text:
            "Monastic life depended on discipline. Prayer, labour, silence, movement, and duty all followed pattern. The Abbey functioned because structure held it together.",
          reward: { coins: 12, xp: 8 },
        },
        {
          kind: "story",
          title: "A Changing World",
          text:
            "What made the Abbey strong also made it vulnerable when royal power turned against the monasteries. The old system could not survive the coming break.",
          reward: { coins: 12, xp: 8 },
        },
        {
          kind: "puzzle",
          title: "Step Puzzle 1",
          text: "What came first in Abbey history?",
          options: [
            "Its destruction",
            "Its founding",
            "Its rediscovery",
          ],
          answer: 1,
          successText: "Yes. The Abbey had to begin before it could fall.",
          reward: { coins: 14, xp: 10 },
        },
        {
          kind: "puzzle",
          title: "Step Puzzle 2",
          text:
            "Which number is the foundation year for the Abbey boss trial?",
          options: ["1127", "1537", "1664"],
          answer: 0,
          successText: "Correct. 1127 is the foundation year used here.",
          reward: { coins: 14, xp: 10 },
        },
        {
          kind: "puzzle",
          title: "Boss Puzzle: Right Call in the Right Order",
          text:
            "Now solve it properly. Enter the numbers in the right order, then add them together.",
          inputMode: "ordered_sum",
          expectedOrder: ["1127", "1537"],
          expectedValue: 2664,
          successText:
            "Correct. 1127 first, 1537 second, total 2664.",
          reward: { coins: 36, xp: 22 },
          routeComplete: true,
        },
      ],
    },
    adult: {
      autoOrder: false,
      steps: [
        {
          kind: "story",
          title: "Foundation",
          text:
            "Furness Abbey was founded in 1127, in an age when monasteries were not passive relics but engines of belief, administration, labour, landholding, and control. The Abbey was a working institution, not merely a sacred shell.",
          reward: { coins: 14, xp: 10 },
        },
        {
          kind: "story",
          title: "Power and Routine",
          text:
            "Inside its walls, routine created power. Prayer ordered the day, but so did labour, storage, supply, discipline, and obedience. The Abbey shaped land, people, and movement. Knowledge survived because a system carried it.",
          reward: { coins: 14, xp: 10 },
        },
        {
          kind: "story",
          title: "Wealth, Authority, and Vulnerability",
          text:
            "Like many major religious houses, Furness Abbey accumulated influence as well as devotion. That strength became a weakness when the Crown moved against monasteries. What had once appeared permanent could be dismantled by force of policy and power.",
          reward: { coins: 14, xp: 10 },
        },
        {
          kind: "story",
          title: "Dissolution",
          text:
            "In 1537, during the Dissolution of the Monasteries, the Abbey’s institutional life was broken. Stone remained, but the living order behind it was cut apart. What survived afterward was ruin, memory, and fragments.",
          reward: { coins: 14, xp: 10 },
        },
        {
          kind: "puzzle",
          title: "Boss Step 1: Chronology",
          text: "Choose the correct chronological order.",
          options: [
            "1537 then 1127",
            "1127 then 1537",
            "1127 then 1664",
          ],
          answer: 1,
          successText:
            "Correct. Foundation first. Dissolution later.",
          reward: { coins: 16, xp: 12 },
        },
        {
          kind: "puzzle",
          title: "Boss Step 2: Final Sum",
          text:
            "Now enter the ordered years and give the final total. This is the right call in the right order.",
          inputMode: "ordered_sum",
          expectedOrder: ["1127", "1537"],
          expectedValue: 2664,
          successText:
            "Correct. 1127 + 1537 = 2664. You restored the final sequence.",
          reward: { coins: 42, xp: 28 },
          routeComplete: true,
        },
      ],
    },
  },
};

/* ============================
   DEFAULT STATE
============================ */
const DEFAULT_STATE = {
  storage: {
    version: SAVE_VERSION,
    savedAt: null,
    app: "Barrow Quest",
    saveKey: SAVE_KEY,
    migratedFrom: null,
    migratedAt: null,
  },

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

  territory: {
    nodes: {},
  },

  bossProgress: {},
};




/* ============================
   GLOBAL STATE / RUNTIME
============================ */
let state = loadState();

if (!state) {
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
}

window.state = state;

state.inventory = state.inventory || {};
state.purchasedItems = state.purchasedItems || [];

let territoryZoneLayers = [];
let map = null;
let heroMarker = null;
let activeMarkers = {};
let currentPin = null;
let currentTask = null;
let nightVisionOn = false;
let locationWatchId = null;
let arStream = null;
let audioSystem = null;
let trailSystem = null;
let abbeySystem = null;
let bossSystem = null;
let territorySystem = null;
let activeGameMode = "explorer";
const gameModes = {};
let lastTerritoryAutoOpenPinId = null;
let lastZoneCount = 0;

const CHARACTER_ICONS = {
  hero_duo: "🧭",
  ninja: "🥷",
  wizard: "🧙",
  robot: "🤖",
  pirate: "🏴‍☠️",
  monk: "monk.jpg",
  khylan: "khylan.jpg",
  piper: "piper.jpg",
  char_chicken: "🐔",
  char_frog: "🐸",
  char_ghost: "👻",
};

const CLASSIC_MODE_META = {
  quiz: { label: "QUIZ", icon: "❓" },
  history: { label: "HISTORY", icon: "📜" },
  logic: { label: "LOGIC", icon: "🧩" },
  activity: { label: "ACTIVITY", icon: "🎯" },
  family: { label: "FAMILY", icon: "👨‍👩‍👧" },
  speed: { label: "SPEED", icon: "⚡" },
  ghost: { label: "GHOST", icon: "👻" },
  boss: { label: "BOSS", icon: "👑" },
  discovery: { label: "DISCOVERY", icon: "🔎" },
};

const CLASSIC_MODE_ORDER = [
  "quiz",
  "history",
  "logic",
  "activity",
  "family",
  "speed",
  "ghost",
  "boss",
  "discovery",
];


/* ============================
   STATE NORMALISERS
============================ */
function normaliseAdultLock(lock = {}) {
  return {
    unlocked: !!lock.unlocked,
    pin: typeof lock.pin === "string" ? lock.pin : "",
    sessionApproved: !!lock.sessionApproved,
    hideWhenKidsMode: !!lock.hideWhenKidsMode,
  };
}

function normaliseRoute(route = null) {
  if (!route || typeof route !== "object") return null;
  return {
    type: typeof route.type === "string" ? route.type : "abbey",
    path: typeof route.path === "string" ? route.path : null,
    startedAt: route.startedAt || null,
    step: Number.isFinite(route.step) ? route.step : 0,
    clues: Array.isArray(route.clues) ? route.clues : [],
    completedNodes: Number.isFinite(route.completedNodes)
      ? route.completedNodes
      : 0,
    rebuildPoints: Number.isFinite(route.rebuildPoints)
      ? route.rebuildPoints
      : 0,
    awaitFollowUp: route.awaitFollowUp || null,
    lastCompletedPath:
      typeof route.lastCompletedPath === "string" ? route.lastCompletedPath : null,
    coreUnlocked: !!route.coreUnlocked,
    coreCompleted: !!route.coreCompleted,
  };
}

function normaliseRebuild(rebuild = {}) {
  const abbey = rebuild.abbey || {};
  return {
    abbey: {
      points: Number.isFinite(abbey.points) ? abbey.points : 0,
      stage: Number.isFinite(abbey.stage) ? abbey.stage : 0,
      completedRoutes: Array.isArray(abbey.completedRoutes)
        ? abbey.completedRoutes
        : [],
      unlockedCore: !!abbey.unlockedCore,
      completedCore: !!abbey.completedCore,
      finished: !!abbey.finished,
    },
  };
}

function normaliseBossProgress(progress = {}) {
  const out = {};
  Object.entries(progress || {}).forEach(([key, value]) => {
    const safe = value && typeof value === "object" ? value : {};
    out[key] = {
      startedAt: safe.startedAt || null,
      completedAt: safe.completedAt || null,
      currentStep: Number.isFinite(safe.currentStep) ? safe.currentStep : 0,
      failedAttempts: Number.isFinite(safe.failedAttempts)
        ? safe.failedAttempts
        : 0,
      wrongAnswers: Number.isFinite(safe.wrongAnswers)
        ? safe.wrongAnswers
        : 0,
      solved: !!safe.solved,
      unlocked: !!safe.unlocked,
      notes: Array.isArray(safe.notes) ? safe.notes : [],
      enteredOrder: Array.isArray(safe.enteredOrder) ? safe.enteredOrder : [],
      finalAnswer:
        safe.finalAnswer === null || safe.finalAnswer === undefined
          ? ""
          : String(safe.finalAnswer),
    };
  });
  return out;
}

function normaliseStorage(storage = {}) {
  return {
    ...computeStorageHealth(),
    ...storage,
    version: SAVE_VERSION,
  };
}

function normaliseLoadedState(parsed) {
  const safe = parsed && typeof parsed === "object" ? parsed : {};

  return {
    ...structuredClone(DEFAULT_STATE),
    ...safe,

    storage: normaliseStorage(safe.storage || {}),

    settings: {
      ...structuredClone(DEFAULT_STATE.settings),
      ...(safe.settings || {}),
    },

    players:
      Array.isArray(safe.players) && safe.players.length
        ? safe.players
        : structuredClone(DEFAULT_STATE.players),

    unlockedMysteries: Array.isArray(safe.unlockedMysteries)
      ? safe.unlockedMysteries
      : [],

    completedQuestionIds: Array.isArray(safe.completedQuestionIds)
      ? safe.completedQuestionIds
      : [],

    recentQuestionTags: Array.isArray(safe.recentQuestionTags)
      ? safe.recentQuestionTags
      : [],

    quizProfiles:
      safe.quizProfiles && typeof safe.quizProfiles === "object"
        ? {
            kid: normaliseAdaptiveProfile(safe.quizProfiles.kid || {}, "kid"),
            teen: normaliseAdaptiveProfile(safe.quizProfiles.teen || {}, "teen"),
            adult: normaliseAdaptiveProfile(
              safe.quizProfiles.adult || {},
              "adult"
            ),
          }
        : {
            kid: getDefaultAdaptiveProfile("kid"),
            teen: getDefaultAdaptiveProfile("teen"),
            adult: getDefaultAdaptiveProfile("adult"),
          },

    purchasedItems: Array.isArray(safe.purchasedItems)
      ? safe.purchasedItems
      : [],

    inventory:
      safe.inventory && typeof safe.inventory === "object"
        ? safe.inventory
        : {},

    captainNotes: Array.isArray(safe.captainNotes)
      ? safe.captainNotes
      : [],

    completedPins:
      safe.completedPins && typeof safe.completedPins === "object"
        ? safe.completedPins
        : {},

    pinStats: {
      ...structuredClone(DEFAULT_STATE.pinStats),
      ...(safe.pinStats || {}),
    },

    meta: {
      ...structuredClone(DEFAULT_STATE.meta),
      ...(safe.meta || {}),
      badges: Array.isArray(safe?.meta?.badges) ? safe.meta.badges : [],
    },

    adultLock: normaliseAdultLock(safe.adultLock || {}),
    route: normaliseRoute(safe.route || null),
    rebuild: normaliseRebuild(safe.rebuild || {}),
  territory:
      safe.territory && typeof safe.territory === "object"
        ? {
            nodes:
              safe.territory.nodes && typeof safe.territory.nodes === "object"
                ? safe.territory.nodes
                : {},
          }
        : { nodes: {} },
    bossProgress: normaliseBossProgress(safe.bossProgress || {}),
  };
}

function buildSavePayload() {
  return {
    ...state,
    storage: {
      ...computeStorageHealth(),
      ...(state.storage || {}),
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
    },
    saveVersion: SAVE_VERSION,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);

    const parsed = JSON.parse(raw);
    const migrated = migrateSave(parsed);
    const loaded = normaliseLoadedState(migrated);
    lastSaveHash = stableStringify(buildSavePayloadFromState(loaded));
    return loaded;
  } catch (err) {
    console.warn("Primary save failed, trying backup:", err);
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (!backup) return structuredClone(DEFAULT_STATE);
      const parsedBackup = JSON.parse(backup);
      const migratedBackup = migrateSave(parsedBackup);
      const loadedBackup = normaliseLoadedState(migratedBackup);
      lastSaveHash = stableStringify(buildSavePayloadFromState(loadedBackup));
      return loadedBackup;
    } catch (backupErr) {
      console.error("Backup load failed:", backupErr);
      return structuredClone(DEFAULT_STATE);
    }
  }
}

function buildSavePayloadFromState(sourceState) {
  return {
    ...sourceState,
    storage: {
      ...computeStorageHealth(),
      ...(sourceState.storage || {}),
      version: SAVE_VERSION,
    },
    saveVersion: SAVE_VERSION,
  };
}

function saveState() {
  queueSaveState();
}

/* ============================
   ADULT LOCK
============================ */
function getAdultLock() {
  state.adultLock = normaliseAdultLock(state.adultLock || {});
  return state.adultLock;
}

function clearAdultSessionApproval() {
  const lock = getAdultLock();
  lock.sessionApproved = false;
  saveState();
}

function refreshAdultLockUI() {
  const lock = getAdultLock();

  const showAdult =
    !lock.hideWhenKidsMode || state.tierMode !== "kid" || lock.sessionApproved;

  const trueCrime = $("pill-truecrime");
  const conspiracy = $("pill-conspiracy");
  const history = $("pill-history");

  [trueCrime, conspiracy, history].forEach((btn) => {
    if (!btn) return;
    btn.style.display = showAdult ? "" : "none";
  });

  const setAdultPillState = (el, label, isLocked) => {
    if (!el) return;
    el.innerText = isLocked ? `🔒 ${label}` : label;
    el.dataset.locked = isLocked ? "true" : "false";
    el.style.opacity = isLocked ? "0.9" : "1";
  };

  setAdultPillState(trueCrime, "TRUE CRIME", !lock.unlocked);
  setAdultPillState(conspiracy, "CONSPIRACY", !lock.unlocked);
  setAdultPillState(history, "HISTORY", !lock.unlocked);
}

function isValidParentPin(value) {
  return /^\d{4}$/.test(String(value || "").trim());
}

function promptToCreateAdultPin() {
  alert(
    "Adult mode is locked.\n\nCreate a 4-digit parent PIN to unlock adult content on this device."
  );

  const pin1 = prompt("Create a 4-digit parent PIN");
  if (pin1 === null) return false;
  if (!isValidParentPin(pin1)) {
    alert("PIN must be exactly 4 digits.");
    return false;
  }

  const pin2 = prompt("Re-enter the 4-digit PIN");
  if (pin2 === null) return false;
  if (String(pin1).trim() !== String(pin2).trim()) {
    alert("PINs did not match.");
    return false;
  }

  const lock = getAdultLock();
  lock.pin = String(pin1).trim();
  lock.unlocked = true;
  lock.sessionApproved = true;
  saveState();
  refreshAdultLockUI();
  speakText("Adult archive unlocked.");
  return true;
}

function promptForAdultPinApproval() {
  const lock = getAdultLock();

  if (!lock.unlocked || !lock.pin) {
    return promptToCreateAdultPin();
  }

  const entered = prompt("Enter parent PIN for adult content");
  if (entered === null) return false;

  if (String(entered).trim() !== lock.pin) {
    alert("Incorrect parent PIN.");
    speakText("Incorrect parent PIN.");
    return false;
  }

  lock.sessionApproved = true;
  saveState();
  speakText("Adult archive approved.");
  return true;
}

function ensureAdultAccess() {
  const lock = getAdultLock();
  if (!lock.unlocked) return promptToCreateAdultPin();
  if (lock.sessionApproved) return true;
  return promptForAdultPinApproval();
}

function openAdultCategory(category, spokenLabel) {
  if (!ensureAdultAccess()) return;

  state.activePack = "adult";
  state.activeAdultCategory = category;
  saveState();
  updateStartButtons();
  refreshAdultLockUI();
  resetMap();
  speakText(`${spokenLabel} selected.`);
}

/* ============================
   BADGES / LEVELS
============================ */
function getLevelFromXP(xp) {
  const safeXp = Math.max(0, Number(xp || 0));
  return Math.floor(safeXp / 100) + 1;
}

function getLevelProgress(xp) {
  const safeXp = Math.max(0, Number(xp || 0));
  return safeXp % 100;
}

function hasBadge(name) {
  return Array.isArray(state.meta?.badges)
    ? state.meta.badges.some((b) => b.name === name)
    : false;
}

function showBadgePopup(badge) {
  const popup = $("badge-popup");
  const icon = $("badge-icon");
  const title = $("badge-title");
  const text = $("badge-text");

  if (!popup || !icon || !title || !text) return;

  icon.innerText = badge.icon;
  title.innerText = "BADGE UNLOCKED";
  text.innerText = `${badge.name} • ${badge.captures} node${
    badge.captures === 1 ? "" : "s"
  }`;

  popup.classList.remove("hidden");
  speakText(`Badge unlocked. ${badge.name}.`);

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 3200);
}

function awardBadge(badge) {
  if (!badge || hasBadge(badge.name)) return false;
  state.meta.badges.push({
    ...badge,
    awardedAt: new Date().toISOString(),
  });
  showBadgePopup(badge);
  return true;
}

function checkBadgeUnlocksByCaptures() {
  const captures = Number(state.pinStats?.totalFirstCompletions || 0);
  let unlockedAny = false;

  BADGE_MILESTONES.forEach((badge) => {
    if (captures >= badge.captures && !hasBadge(badge.name)) {
      if (awardBadge(badge)) unlockedAny = true;
    }
  });

  if (unlockedAny) saveState();
}

/* ============================
   REWARD IMAGES
============================ */
function getRewardImageForPin(pin) {
  if (!pin?.id) return null;
  return PIN_REWARD_IMAGES[pin.id] || null;
}

function showRewardImage(pin, fallbackText = "") {
  const reward = getRewardImageForPin(pin);
  if (!reward || !reward.src) return;

  const img = $("reward-image");
  const caption = $("reward-image-caption");

  if (!img || !caption) return;

  img.src = reward.src;
  img.alt = pin?.n || "Reward";
  caption.innerText = reward.caption || fallbackText || "";

  showModal("reward-image-modal");
}

function showScriptedRewardImage(title, captionText, src = "") {
  const img = $("reward-image");
  const caption = $("reward-image-caption");

  if (!img || !caption) return;

  img.src = src || "./monk.jpg";
  img.alt = title || "Reward";
  caption.innerText = captionText || "";

  showModal("reward-image-modal");
}

function closeRewardImageModal() {
  closeModal("reward-image-modal");
}

/* ============================
   NOTES / STORAGE HELPERS
============================ */
function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCaptainNotes() {
  const list = $("captain-notes-list");
  if (!list) return;

  const notes = Array.isArray(state.captainNotes) ? state.captainNotes : [];

  if (!notes.length) {
    list.innerHTML = `
      <div style="
        border:1px solid rgba(255,255,255,0.08);
        border-radius:14px;
        padding:12px;
        background:#111;
        color:var(--muted);
      ">
        No captain notes saved yet.
      </div>
    `;
    return;
  }

  list.innerHTML = notes
    .map(
      (note, index) => `
        <div style="
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:12px;
          background:#111;
        ">
          <div style="font-size:12px;color:var(--gold);margin-bottom:6px;">
            NOTE ${notes.length - index}
          </div>
          <div style="white-space:pre-wrap;line-height:1.45;">${escapeHtml(
            note.text
          )}</div>
          <div style="margin-top:6px;font-size:11px;color:var(--muted);">
            ${note.kind ? String(note.kind).toUpperCase() : "NOTE"} • ${
        note.createdAt
          ? new Date(note.createdAt).toLocaleString()
          : "saved"
      }
          </div>
          <div style="margin-top:10px;">
            <button
              class="win-btn captain-note-delete-btn"
              data-note-id="${note.id}"
              style="background:#2a2a2a;color:#fff;"
            >
              DELETE
            </button>
          </div>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".captain-note-delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteCaptainNote(btn.dataset.noteId);
    });
  });
}

function saveCaptainNote(text, kind = "note", source = "") {
  const clean = String(text || "").trim();
  if (!clean) return false;

  if (!Array.isArray(state.captainNotes)) {
    state.captainNotes = [];
  }

  state.captainNotes.unshift({
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    text: clean,
    kind,
    source,
    createdAt: new Date().toISOString(),
  });

  state.captainNotes = state.captainNotes.slice(0, 120);
  saveState();
  renderCaptainNotes();
  return true;
}

function deleteCaptainNote(noteId) {
  if (!noteId || !Array.isArray(state.captainNotes)) return;
  state.captainNotes = state.captainNotes.filter((n) => n.id !== noteId);
  saveState();
  renderCaptainNotes();
}

function saveClueToCaptainNotes(clue, sourceTitle = "Clue") {
  if (!clue) return;
  const line =
    typeof clue === "string"
      ? clue
      : `${sourceTitle}: ${clue.saveLabel || clue.value || "clue"}`;
  saveCaptainNote(line, "clue", sourceTitle);
}

function saveRouteStoryToNotes(title, storyText, category = "story") {
  if (!storyText) return false;
  return saveCaptainNote(`${title}\n\n${storyText}`, category, title);
}

function sendBroadcastMessage() {
  const input = $("broadcast-input");
  if (!input) return;

  const text = String(input.value || "").trim();
  if (!text) {
    alert("Type a message first.");
    return;
  }

  speakText(text);
  input.value = "";
}

function handleSaveCaptainNote() {
  const input = $("captain-note-input");
  if (!input) return;

  const text = String(input.value || "").trim();
  if (!text) {
    alert("Write a note first.");
    return;
  }

  const ok = saveCaptainNote(text, "note", "Commander");
  if (!ok) return;

  speakText("Captain note saved.");
  input.value = "";
}

/* ============================
   NODE CAPTURE SYSTEM
============================ */
function getCaptureRequired(pin) {
  const value = Number(pin?.captureRequired || 4);
  return Math.max(1, Math.min(6, value));
}

function getMustIncludeModes(pin) {
  return Array.isArray(pin?.mustInclude)
    ? pin.mustInclude.map((x) => String(x).toLowerCase())
    : [];
}

function getPinProgressKey(pin) {
  if (!pin?.id) return null;
  const pack = state.activePack || "classic";
  const mode = state.mapMode || "core";
  const adult = state.activeAdultCategory || "none";
  return `${pack}__${mode}__${adult}__${pin.id}`;
}

function createEmptyPinProgress(pin) {
  return {
    pinId: pin.id,
    pinName: pin.n || pin.id,
    pack: state.activePack,
    mapMode: state.mapMode,
    adultCategory: state.activeAdultCategory,
    firstCompletedAt: null,
    lastCompletedAt: null,
    missionPlayCount: 0,
    captureCount: 0,
    captureRequired: getCaptureRequired(pin),
    mustInclude: getMustIncludeModes(pin),
    completedModes: [],
    fullyCaptured: false,
    lastQuestionId: null,
    lastReward: {
      coins: 0,
      xp: 0,
      tokens: 0,
    },
  };
}

function getPinProgress(pin) {
  const key = getPinProgressKey(pin);
  if (!key) return null;

  const existing = state.completedPins[key];
  if (!existing) return null;

  return {
    ...createEmptyPinProgress(pin),
    ...existing,
    completedModes: Array.isArray(existing.completedModes)
      ? existing.completedModes
      : [],
    mustInclude: Array.isArray(existing.mustInclude)
      ? existing.mustInclude
      : getMustIncludeModes(pin),
  };
}

function getCompletedModesForPin(pin) {
  return getPinProgress(pin)?.completedModes || [];
}

function isModeCompletedForPin(pin, mode) {
  const completed = getCompletedModesForPin(pin);
  return completed.includes(String(mode || "").toLowerCase());
}

function getCaptureStatus(pin) {
  const progress = getPinProgress(pin) || createEmptyPinProgress(pin);
  const completedModes = Array.isArray(progress.completedModes)
    ? progress.completedModes
    : [];
  const required = Number(progress.captureRequired || getCaptureRequired(pin));
  const mustInclude = Array.isArray(progress.mustInclude)
    ? progress.mustInclude
    : getMustIncludeModes(pin);

  const missingRequired = mustInclude.filter(
    (mode) => !completedModes.includes(mode)
  );
  const completedCount = completedModes.length;
  const fullyCaptured = completedCount >= required && missingRequired.length === 0;

  return {
    completedCount,
    required,
    mustInclude,
    missingRequired,
    fullyCaptured,
    completedModes,
    progress,
  };
}

function isPinCompleted(pin) {
  return getCaptureStatus(pin).fullyCaptured;
}

function getMissionReward({ mode, isNewMode }) {
  const base = applyReward({
    mode,
    correct: true,
  }) || { coins: 20, xp: 8, tokens: 0 };

  if (isNewMode) {
    return {
      coins: Math.max(6, Math.floor(Number(base.coins || 0) * 0.55)),
      xp: Math.max(4, Math.floor(Number(base.xp || 0) * 0.55)),
      tokens: 0,
    };
  }

  return {
    coins: Math.max(2, Math.floor(Number(base.coins || 0) * 0.2)),
    xp: Math.max(1, Math.floor(Number(base.xp || 0) * 0.2)),
    tokens: 0,
  };
}

function getFullCaptureBonus(pin) {
  const required = getCaptureRequired(pin);
  return {
    coins: 15 + required * 3,
    xp: 10 + required * 2,
    tokens: 1,
  };
}

function recordMissionCompletion(pin, mode, rewardResult, questionId) {
  const key = getPinProgressKey(pin);
  if (!key) {
    return {
      firstModeTime: false,
      fullCaptureJustUnlocked: false,
      record: null,
      status: null,
    };
  }

  const now = new Date().toISOString();
  const existing = getPinProgress(pin) || createEmptyPinProgress(pin);
  const safeMode = String(mode || "").toLowerCase();
  const beforeStatus = getCaptureStatus(pin);
  const alreadyHadMode = existing.completedModes.includes(safeMode);

  existing.missionPlayCount = Number(existing.missionPlayCount || 0) + 1;
  existing.lastCompletedAt = now;
  existing.lastQuestionId = questionId || existing.lastQuestionId || null;
  existing.captureRequired = getCaptureRequired(pin);
  existing.mustInclude = getMustIncludeModes(pin);

  if (!alreadyHadMode && safeMode) {
    existing.completedModes.push(safeMode);
    existing.captureCount = existing.completedModes.length;
  }

  const afterMissingRequired = existing.mustInclude.filter(
    (x) => !existing.completedModes.includes(x)
  );
  const afterFullyCaptured =
    existing.completedModes.length >= existing.captureRequired &&
    afterMissingRequired.length === 0;

  const fullCaptureJustUnlocked = !beforeStatus.fullyCaptured && afterFullyCaptured;

  if (fullCaptureJustUnlocked) {
    existing.fullyCaptured = true;
    existing.firstCompletedAt = existing.firstCompletedAt || now;
    state.pinStats.totalCompleted += 1;
    state.pinStats.totalFirstCompletions += 1;
  } else if (alreadyHadMode) {
    state.pinStats.totalRepeatCompletions += 1;
  }

  existing.lastReward = {
    coins: Number(rewardResult?.coins || 0),
    xp: Number(rewardResult?.xp || 0),
    tokens: Number(rewardResult?.tokens || 0),
  };

  state.completedPins[key] = existing;

  return {
    firstModeTime: !alreadyHadMode,
    fullCaptureJustUnlocked,
    record: existing,
    status: {
      completedCount: existing.completedModes.length,
      required: existing.captureRequired,
      mustInclude: existing.mustInclude,
      missingRequired: afterMissingRequired,
      fullyCaptured: afterFullyCaptured,
      completedModes: existing.completedModes,
    },
  };
}

function getCurrentModeProgress() {
  const pins = getCurrentPins();
  const total = pins.length;
  const completed = pins.filter((pin) => isPinCompleted(pin)).length;
  const remaining = Math.max(0, total - completed);
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, remaining, percent };
}

/* ============================
   BOSS SYSTEM
============================ */

/* ============================
   ABBEY ROUTE / REBUILD SYSTEM
============================ */




/* ============================
   PLAYERS / HUD
============================ */
function getEnabledPlayers() {
  return state.players.filter((p) => p.enabled);
}

function getActivePlayer() {
  return (
    state.players.find((p) => p.id === state.activePlayerId && p.enabled) ||
    getEnabledPlayers()[0] ||
    state.players[0]
  );
}

function setActivePlayer(id) {
  const player = state.players.find((p) => p.id === id && p.enabled);
  if (!player) return;
  state.activePlayerId = id;
  saveState();
  renderHUD();
  renderShop();
}

function setPlayerCount(count) {
  state.players.forEach((p, i) => {
    p.enabled = i < count;
  });

  const active = getActivePlayer();
  state.activePlayerId = active.id;
  saveState();
  renderHUD();
  renderShop();
}

function updateCoins(playerId, amount) {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return;
  player.coins = Math.max(0, Number(player.coins || 0) + Number(amount || 0));
  saveState();
  renderHUD();
  renderShop();
}

function renderHUD() {
  const active = getActivePlayer();
  const coins = active?.coins || 0;
  const xp = Number(state.meta?.xp || 0);
  const level = getLevelFromXP(xp);

  if ($("top-coins")) $("top-coins").innerText = String(coins);
  if ($("top-xp")) $("top-xp").innerText = `L${level} • ${xp}`;

  const legacyTokens = $("top-tokens");
  if (legacyTokens) {
    legacyTokens.parentElement?.classList.add("hidden");
  }

  const title = document.querySelector(".top-pill");
  if (title && state.activePack === "classic" && state.mapMode === "abbey") {
    const abbey = getAbbeyRebuild();
    title.innerText =
      abbey.stage > 0
        ? `LOST ORDER • R${abbey.points}`
        : "BARROW QUEST";
  } else if (title) {
    title.innerText = "BARROW QUEST";
  }
}

/* ============================
   MODALS
============================ */
function hideAllModals() {
  document.querySelectorAll(".full-modal").forEach((el) => {
    el.style.display = "none";
  });
}

function showModal(id) {
  hideAllModals();
  const el = $(id);
  if (el) el.style.display = "block";
}

function closeModal(id) {
  const el = $(id);
  if (el) el.style.display = "none";
}

/* ============================
   HELPERS
============================ */

function showWelcomeMessage() {
  const overlay = document.getElementById("welcome-overlay");
  const text = document.getElementById("welcome-text");

  if (!overlay || !text) return;

  const player = window.getActivePlayer?.();
  const name = player?.name || "Explorer";

  text.innerText = `Welcome to Barrow Quest, ${name}.`;

 overlay.classList.remove("hidden");
window.playUISound?.("welcome_popup.mp3");

  document.addEventListener(
    "click",
    () => {
      try {
        const fx = new Audio("./sounds/welcome_whoosh.mp3");
        fx.volume = 0.45;
        fx.play().catch(() => {});
      } catch {}

      setTimeout(() => {
        window.speakText?.(`Welcome to Barrow Quest, ${name}`);
      }, 150);
    },
    { once: true }
  );

  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 3000);
}


  
function getInventoryCount(itemId) {
  return Number(window.state?.inventory?.[itemId] || 0);
}

window.getInventoryCount = getInventoryCount;


function hasValidCoords(pin) {
  return (
    Array.isArray(pin?.l) &&
    pin.l.length === 2 &&
    Number.isFinite(pin.l[0]) &&
    Number.isFinite(pin.l[1]) &&
    !(pin.l[0] === 0 && pin.l[1] === 0)
  );
}

function ensureShopDefaults() {
  if (!state) return;

  if (!state.inventory || typeof state.inventory !== "object") {
    state.inventory = {};
  }

  if (!Array.isArray(state.purchasedItems)) {
    state.purchasedItems = [];
  }

  if (!state.settings || typeof state.settings !== "object") {
    state.settings = {};
  }

  const normalised = ensureDefaultOwnedInventory(
    state.inventory,
    state.purchasedItems
  );

  state.inventory = normalised.inventory || {};
  state.purchasedItems = normalised.purchasedItems || [];

  if (!state.settings.equippedTrail) state.settings.equippedTrail = "trail_none";
  if (!state.settings.mapTheme) state.settings.mapTheme = "map_classic";
}



function getEffectiveTier() {
  if (state.activePack === "adult") return "adult";
  if (state.tierMode === "auto") {
    return getEnabledPlayers().length <= 1 ? "adult" : "teen";
  }
  return state.tierMode || "kid";
}

function getCurrentQuizProfile() {
  const tier = getEffectiveTier();
  const base = state.quizProfiles?.[tier] || getDefaultAdaptiveProfile(tier);
  return normaliseAdaptiveProfile(base, tier);
}

function rememberQuestionTags(tags = []) {
  if (!Array.isArray(tags) || !tags.length) return;
  const merged = [...(state.recentQuestionTags || []), ...tags.map(String)];
  state.recentQuestionTags = merged.slice(-20);
}

function getCurrentPins() {
  if (state.activePack === "adult") {
    if (!state.activeAdultCategory) return ADULT_PINS.filter(hasValidCoords);
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
  if (state.activePack === "adult") {
    const pins = getCurrentPins();
    if (pins.length) return [pins[0].l[0], pins[0].l[1], 14];
    return [54.11371, -3.218448, 14];
  }

  if (state.mapMode === "park") return [54.1174, -3.2168, 16];
  if (state.mapMode === "abbey") return [54.1344, -3.1964, 15];
  return [54.11371, -3.218448, 14];
}

function getClassicWorld(pin) {
  return String(pin?.set || state.mapMode || "core").toLowerCase();
}

function getClassicZone(pin) {
  return String(pin?.zone || pin?.set || state.mapMode || "core").toLowerCase();
}

function createHeroIcon() {
  const char = state.settings.character || "hero_duo";
  const value = CHARACTER_ICONS[char] || "🧭";

  if (value.endsWith(".jpg") || value.endsWith(".png")) {
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
  if (!map) return;

  const theme = state.settings?.mapTheme || "map_classic";
  const el = $("map");
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
  if (
  activeGameMode === "territory" &&
  territorySystem &&
  state.activePack === "classic"
) {
    const node = territorySystem.getNode(pin);
    const ownerId = node?.ownerId || null;
    const level = Math.max(1, Math.min(3, Number(node?.level || 1)));
    const defence = Math.max(0, Math.min(100, Number(node?.defencePercent || 0)));

    let ownerColor = "#bdbdbd";
    let ownerLabel = "FREE";

    if (ownerId === "p1") {
      ownerColor = "#4da3ff";
      ownerLabel = "P1";
    } else if (ownerId === "p2") {
      ownerColor = "#ff5d5d";
      ownerLabel = "P2";
    } else if (ownerId === "p3") {
      ownerColor = "#63ffd3";
      ownerLabel = "P3";
    } else if (ownerId === "p4") {
      ownerColor = "#9c6bff";
      ownerLabel = "P4";
    }

    const circumference = 113;
    const offset = circumference - (defence / 100) * circumference;

    return L.divIcon({
      className: "marker-logo",
      html: `
        <div style="position:relative;width:54px;height:54px;">
          <svg width="54" height="54" viewBox="0 0 54 54" style="position:absolute;inset:0;">
            <circle cx="27" cy="27" r="18" fill="rgba(0,0,0,0.72)" stroke="rgba(255,255,255,0.18)" stroke-width="5"></circle>
            <circle cx="27" cy="27" r="18" fill="none" stroke="${ownerColor}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 27 27)"></circle>
          </svg>

          <div style="
            position:absolute;
            inset:9px;
            border-radius:50%;
            background:radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), rgba(0,0,0,0.82));
            border:2px solid ${ownerColor};
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 0 10px rgba(0,0,0,0.75), 0 0 12px ${ownerColor};
            font-size:20px;
          ">⚔️</div>

          <div style="
            position:absolute;
            left:50%;
            top:-8px;
            transform:translateX(-50%);
            min-width:34px;
            height:17px;
            padding:0 5px;
            border-radius:999px;
            background:${ownerColor};
            color:#111;
            border:2px solid #111;
            font-size:9px;
            font-weight:900;
            display:flex;
            align-items:center;
            justify-content:center;
            line-height:1;
          ">${ownerLabel}</div>

          <div style="
            position:absolute;
            right:-8px;
            bottom:-4px;
            min-width:27px;
            height:20px;
            padding:0 5px;
            border-radius:999px;
            background:#ffd54a;
            color:#111;
            border:2px solid #111;
            font-size:10px;
            font-weight:900;
            display:flex;
            align-items:center;
            justify-content:center;
            line-height:1;
          ">L${level}</div>

          <div style="
            position:absolute;
            left:-8px;
            bottom:-4px;
            min-width:31px;
            height:20px;
            padding:0 5px;
            border-radius:999px;
            background:#111;
            color:#fff;
            border:2px solid ${ownerColor};
            font-size:9px;
            font-weight:900;
            display:flex;
            align-items:center;
            justify-content:center;
            line-height:1;
          ">${Math.round(defence)}%</div>
        </div>
      `,
      iconSize: [54, 54],
      iconAnchor: [27, 27],
    });
  }

  const status = getCaptureStatus(pin);
  const icon = pin.i || "📍";
  const abbey = getAbbeyRebuild();
  const hasGlowPack = getInventoryCount("route_glow_pack") > 0;

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
    state.activePack === "classic" &&
    state.mapMode === "abbey" &&
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

function getAdultContentForPin(pin) {
  if (!pin) return null;
  return ADULT_CONTENT?.[pin.id] || null;
}

function showQuestLayoutForPack() {
  const classicWrap = $("classic-mission-wrap");
  const adultWrap = $("adult-investigation-wrap");

  if (classicWrap) {
    classicWrap.style.display = state.activePack === "adult" ? "none" : "block";
  }

  if (adultWrap) {
    adultWrap.style.display = state.activePack === "adult" ? "block" : "none";
  }
}

function normaliseClassicModeFromPin(pin) {
  if (!pin) return "quiz";

  const type = String(pin.type || "").toLowerCase();

  if (!type || type === "start") return "quiz";
  if (type === "story") return "history";
  if (type === "battle") return "activity";

  if (
    [
      "quiz",
      "history",
      "logic",
      "activity",
      "family",
      "speed",
      "ghost",
      "boss",
      "discovery",
    ].includes(type)
  ) {
    return type;
  }

  return "quiz";
}

function getClassicModePoolForPin(pin) {
  const primary = normaliseClassicModeFromPin(pin);
  const world = getClassicWorld(pin);
  const zone = getClassicZone(pin);
  const unique = [];

  const pushUnique = (value) => {
    if (!value) return;
    if (!CLASSIC_MODE_META[value]) return;
    if (!unique.includes(value)) unique.push(value);
  };

  const worldPools = {
    core: ["quiz", "history", "logic", "activity", "family", "speed"],
    park: ["quiz", "history", "activity", "family", "speed", "logic"],
    abbey: ["history", "quiz", "logic", "activity", "ghost", "family", "speed", "boss"],
  };

  pushUnique(primary);

  if (primary === "boss") {
    pushUnique("quiz");
    pushUnique("history");
    pushUnique("logic");
  }

  if (primary === "ghost") {
    pushUnique("logic");
    pushUnique("history");
  }

  if (primary === "discovery") {
    pushUnique("activity");
    pushUnique("family");
  }

  if (zone === "memorial") {
    pushUnique("history");
    pushUnique("quiz");
  }

  if (zone === "abbey") {
    pushUnique("ghost");
    pushUnique("logic");
    pushUnique("history");
    if (isBossPin(pin)) pushUnique("boss");
  }

  if (zone === "docks") {
    pushUnique("history");
    pushUnique("quiz");
    pushUnique("logic");
  }

  if (zone === "nature" || zone === "park") {
    pushUnique("activity");
    pushUnique("family");
    pushUnique("speed");
  }

  (worldPools[world] || worldPools.core).forEach((mode) => pushUnique(mode));

  if (pin?.hidden) pushUnique("discovery");
  if (primary === "boss") pushUnique("boss");
  if (primary === "ghost") pushUnique("ghost");

  return unique.filter(Boolean);
}

function pickClassicModesForPin(pin, count = 6) {
  const pool = getClassicModePoolForPin(pin);
  const primary = normaliseClassicModeFromPin(pin);
  const selected = [];

  const pushUnique = (value) => {
    if (!value) return;
    if (!selected.includes(value)) selected.push(value);
  };

  pushUnique(primary);

  const remaining = pool.filter((mode) => mode !== primary);
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);

  shuffled.forEach((mode) => {
    if (selected.length < count) pushUnique(mode);
  });

  CLASSIC_MODE_ORDER.forEach((mode) => {
    if (selected.length < count && pool.includes(mode)) pushUnique(mode);
  });

  return selected.slice(0, count);
}

function renderClassicModeChoices(pin) {
  const tiles = Array.from(document.querySelectorAll(".m-tile"));
  if (!tiles.length) return;

  const chosenModes = pickClassicModesForPin(pin, 7);
  const chosenSet = new Set(chosenModes);

  tiles.forEach((tile) => {
    const mode = tile.dataset.mode;
    if (!mode) return;

    if (mode === "health" || mode === "battle") {
      tile.classList.add("hidden");
      return;
    }

    if (!chosenSet.has(mode)) {
      tile.classList.add("hidden");
      return;
    }

    tile.classList.remove("hidden");

    const meta = CLASSIC_MODE_META[mode];
    const done = isModeCompletedForPin(pin, mode);
    if (meta) {
      tile.innerHTML = `<span>${done ? "✅" : meta.icon}</span>${meta.label}`;
      tile.style.opacity = done ? "0.75" : "1";
    }
  });
}

function clearTaskBlocks() {
  const ids = [
    "task-block-story",
    "task-block-evidence",
    "task-block-clue",
    "task-block-boss",
  ];

  ids.forEach((id) => {
    const el = $(id);
    if (el) el.classList.add("hidden");
  });

  if ($("task-story")) $("task-story").innerText = "";
  if ($("task-evidence")) $("task-evidence").innerText = "";
  if ($("task-clue")) $("task-clue").innerText = "";
  if ($("task-boss-summary")) $("task-boss-summary").innerText = "";

  if ($("btn-read-answers")) {
    $("btn-read-answers").classList.add("hidden");
  }
}

function setTaskBlock(id, bodyId, text) {
  const block = $(id);
  const body = $(bodyId);
  if (!block || !body) return;

  if (text) {
    body.innerText = text;
    block.classList.remove("hidden");
  } else {
    body.innerText = "";
    block.classList.add("hidden");
  }
}

function speakText(text, interrupt = true) {
  audioSystem?.speakText(text, interrupt);
}

function speakOptions(options = []) {
  audioSystem?.speakOptions(options);
}

function stopSpeech() {
  audioSystem?.stopSpeech();
}

function playSound(fileName) {
  if (!window.__audioUnlocked) return;

  try {
    const audio = new Audio(`./sounds/${fileName}`);
    audio.volume = Number(state?.settings?.sfxVol || 80) / 100;
    audio.play().catch((err) => {
      console.warn("Sound failed:", err);
    });
  } catch (err) {
    console.warn("Sound setup failed:", err);
  }
}

function playUISound(fileName) {
  if (!window.userInteracted) return;

  try {
    const audio = new Audio(`./sounds/${fileName}`);
    audio.volume = Number(state?.settings?.sfxVol || 80) / 100;
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn("UI sound failed:", err);
    });
  } catch (err) {
    console.warn("UI sound setup failed:", err);
  }
}


function dropTrailAt(lat, lng) {
  trailSystem?.dropTrailAt(lat, lng);
}

function clearTrailLayers() {
  trailSystem?.clearTrailLayers();
}

function getCurrentTaskEls() {
  return {
    taskTitle: $("task-title"),
    taskDesc: $("task-desc"),
    taskOptions: $("task-options"),
    taskFeedback: $("task-feedback"),
  };
}

function setCurrentTaskValue(value) {
  currentTask = value;
}

function getCurrentPinValue() {
  return currentPin;
}

function getCurrentMapMode() {
  return state.mapMode;
}

function getDefaultRebuildState() {
  return structuredClone(DEFAULT_STATE.rebuild);
}

function getAbbeyRebuild() {
  return abbeySystem?.getAbbeyRebuild();
}

function clearActiveRoute() {
  return abbeySystem?.clearActiveRoute();
}

function isAbbeyRouteApproachPin(pin) {
  return abbeySystem?.isAbbeyRouteApproachPin(pin);
}

function getAbbeyRouteStatusText() {
  return abbeySystem?.getAbbeyRouteStatusText() || "";
}

function getRewardPresentationMode() {
  return abbeySystem?.getRewardPresentationMode() || "adult";
}

function getClueAnnouncementText(clue) {
  return abbeySystem?.getClueAnnouncementText(clue) || "";
}

function renderAbbeyRouteChoice() {
  return abbeySystem?.renderAbbeyRouteChoice();
}

function getBossDef(pinId) {
  return bossSystem?.getBossDef(pinId) || null;
}

function getBossProgress(pinId) {
  return bossSystem?.getBossProgress(pinId);
}

function resetBossProgress(pinId) {
  return bossSystem?.resetBossProgress(pinId);
}

function getBossTierSteps(pinId) {
  return bossSystem?.getBossTierSteps(pinId) || [];
}

function isBossPin(pin) {
  return bossSystem?.isBossPin(pin) || false;
}

function getBossUnlockSummary(pinId) {
  return bossSystem?.getBossUnlockSummary(pinId) || "";
}

function showBossProgressBox(pinId) {
  return bossSystem?.showBossProgressBox(pinId);
}

function hideBossProgressBox() {
  return bossSystem?.hideBossProgressBox();
}

function setBossSummaryBlock(text = "") {
  return bossSystem?.setBossSummaryBlock(text);
}

function openBossMission(pin) {
  return bossSystem?.openBossMission(pin);
}

function runBossStep() {
  return bossSystem?.runBossStep();
}

function answerBossOption(index) {
  return bossSystem?.answerBossOption(index);
}

function answerBossOrderedSum() {
  return bossSystem?.answerBossOrderedSum();
}

function finishBossMission() {
  return bossSystem?.finishBossMission();
}

function handlePinOpen(pin) {
  const mode = gameModes[activeGameMode];

  if (mode?.openPin) {
    mode.openPin(pin);
    return;
  }

  currentPin = pin;
  openMissionMenu();
}

/* ============================
   MAP
============================ */
function initMap() {
  const [lat, lng, zoom] = getModeStart();

  map = L.map("map", {
    zoomControl: !!state.settings.zoomUI,
  }).setView([lat, lng], zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  heroMarker = L.marker([lat, lng], { icon: createHeroIcon() }).addTo(map);
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
  clearTrailLayers();

  initMap();
  renderHomeLog();
}

function renderTerritoryZones() {
  if (!map || !territorySystem) return;

  territoryZoneLayers.forEach((layer) => {
    try {
      map.removeLayer(layer);
    } catch {}
  });

  territoryZoneLayers = [];

  const zones = territorySystem.getConnectedZones?.() || [];
  const pins = getCurrentPins();

  if (zones.length > lastZoneCount && activeGameMode === "territory") {
    speakText("Territory zone formed.");
    playUISound?.("correct_answer.mp3");
  }

  lastZoneCount = zones.length;

  zones.forEach((zone) => {
    const coords = zone.nodes
      .map((id) => pins.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => [p.l[0], p.l[1]]);

    if (coords.length !== 3) return;

    let color = "#4da3ff";
    if (zone.ownerId === "p2") color = "#ff5d5d";
    if (zone.ownerId === "p3") color = "#63ffd3";
    if (zone.ownerId === "p4") color = "#9c6bff";

    const polygon = L.polygon(coords, {
      color,
      fillColor: color,
      fillOpacity: 0.2,
      weight: 3,
    }).addTo(map);

    territoryZoneLayers.push(polygon);
  });

  const scores = territorySystem.getTerritoryScores?.() || [];
  const leader = scores[0] || null;
  const victoryScore = 500;

  if (
    leader &&
    leader.score >= victoryScore &&
    activeGameMode === "territory" &&
    !window.__territoryVictoryAnnounced
  ) {
    window.__territoryVictoryAnnounced = true;

    speakText(`${leader.playerName} wins the territory war.`);
    playUISound?.("correct_answer.mp3");

    setTimeout(() => {
      const restart = confirm(
        `🏆 TERRITORY VICTORY\n\n${leader.playerName} wins with ${leader.score} points!\n\nNodes: ${leader.nodes}\nZones: ${leader.zones || 0}\nIncome: +${leader.income}/min\n\nStart a new game?`
      );

      if (restart) {
        state.territory = { nodes: {} };

        window.__territoryVictoryAnnounced = false;
        lastZoneCount = 0;

        saveState();

        refreshAllPinMarkers();
        renderHUD();
        renderHomeLog();

        speakText("New territory game started.");
      }
    }, 300);
  }
}


function renderPins() {
  if (!map) return;

  Object.values(activeMarkers).forEach((m) => map.removeLayer(m));
  activeMarkers = {};

  const pins = getCurrentPins();

  pins.forEach((pin) => {
    const marker = L.marker(pin.l, {
      icon: createPinIcon(pin),
    }).addTo(map);


marker.on("click", () => {
  handlePinOpen(pin);
});

    
    activeMarkers[pin.id] = marker;
  });
}

function refreshAllPinMarkers() {
  Object.keys(activeMarkers).forEach((pinId) => {
    const pin = getCurrentPins().find((p) => p.id === pinId);
    if (pin) {
      activeMarkers[pin.id].setIcon(createPinIcon(pin));
    }
  });
  renderTerritoryZones();
}

function refreshPinMarker(pin) {
  if (!pin || !activeMarkers[pin.id]) return;
  activeMarkers[pin.id].setIcon(createPinIcon(pin));
}

function showActionButton(show) {
  const btn = $("action-trigger");
  if (!btn) return;
  btn.style.display = show ? "block" : "none";
}

function updateCaptureText(text) {
  const actionBtn = $("action-trigger");
  if (actionBtn && text) {
    actionBtn.title = text;
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

function startLocationWatch() {
  if (!navigator.geolocation || !map) return;

  locationWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      dropTrailAt(lat, lng);

      heroMarker?.setLatLng([lat, lng]);
      dropTrailAt(lat, lng);

      const pins = getCurrentPins();
      const radius = Number(state.settings.radius || 35);

      let nearby = null;

      for (const pin of pins) {
        const d = distanceInMeters(lat, lng, pin.l[0], pin.l[1]);
        if (d <= radius) {
          nearby = pin;
          break;
        }
      }

      currentPin = nearby;

if (nearby) {
  if (activeGameMode === "territory") {
    const active = getActivePlayer();

    const label =
      territorySystem?.getNodeLabel(nearby, active?.id || "") ||
      `${nearby.n} • TERRITORY NODE`;

    updateCaptureText(label);
    showActionButton(false);

    // 🔥 THIS IS THE KEY PART
    if (lastTerritoryAutoOpenPinId !== nearby.id) {
      lastTerritoryAutoOpenPinId = nearby.id;

      // delay slightly so UI doesn't spam
      setTimeout(() => {
        openTerritoryCommandPanel(nearby);
      }, 200);
    }

  } else {
    updateCaptureText(`${nearby.n}`);
    showActionButton(true);
  }

} else {
  showActionButton(false);

  lastTerritoryAutoOpenPinId = null;

  if (activeGameMode === "territory") {
    closeModal("territory-command-modal");
  }
}
},
(err) => {
  console.warn("GPS error:", err);
},
{
  enableHighAccuracy: true,
  maximumAge: 5000,
  timeout: 10000,
}
);
}

/* ============================
   QUEST FLOW
============================ */
function openMissionMenu() {
  if (!currentPin) return;

  if (isAbbeyRouteApproachPin(currentPin)) {
    renderAbbeyRouteChoice();
    return;
  }

  showQuestLayoutForPack();

  if ($("q-name")) $("q-name").innerText = currentPin.n;

  const status = getCaptureStatus(currentPin);

  if ($("quest-status")) {
    const requiredText = status.mustInclude.length
      ? ` • REQUIRED: ${status.mustInclude.join(", ").toUpperCase()}`
      : "";
    const routeText =
      state.activePack === "classic" && state.mapMode === "abbey"
        ? ` • ${getAbbeyRouteStatusText()}`
        : "";

    $("quest-status").innerText =
      state.activePack === "adult"
        ? `STATUS: CASE MODE • ${String(
            state.activeAdultCategory || "GENERAL"
          ).toUpperCase()} • ${status.completedCount}/${status.required} CAPTURED${
            status.fullyCaptured ? " • FULLY CAPTURED" : ""
          }`
        : `STATUS: ${state.mapMode.toUpperCase()} • ${status.completedCount}/${
            status.required
          } CAPTURED${requiredText}${
            status.fullyCaptured ? " • FULLY CAPTURED" : ""
          }${routeText}`;
  }

  if ($("mode-banner")) {
    $("mode-banner").style.display = "block";

    const label =
      state.activePack === "adult"
        ? "CASE BRIEFING"
        : state.mapMode === "core"
        ? "FULL BARROW"
        : state.mapMode === "park"
        ? "PARK"
        : "ABBEY";

    $("mode-banner").innerText = status.fullyCaptured
      ? `${label}\n${currentPin.n}\nFULLY CAPTURED`
      : `${label}\n${currentPin.n}\n${status.completedCount}/${status.required} CAPTURED`;
  }

  if ($("boss-banner")) {
    const isBoss = currentPin.type === "boss" || isBossPin(currentPin);
    const abbeyCoreOpen =
      state.activePack === "classic" &&
      state.mapMode === "abbey" &&
      getAbbeyRebuild().unlockedCore;

    $("boss-banner").style.display = isBoss || abbeyCoreOpen ? "block" : "none";
    $("boss-banner").innerText = isBoss
      ? "FINAL TRIAL ACTIVE"
      : abbeyCoreOpen
      ? "ABBEY CORE READY"
      : "";
  }

  let storyText = "";

  if (state.activePack === "adult") {
    const content = getAdultContentForPin(currentPin);
    storyText =
      content?.story || "Case briefing not found for this location yet.";
  } else {
    storyText =
      getPinStartIntro(currentPin.id, getEffectiveTier()) ||
      `${currentPin.n}. Mission briefing ready.`;

    renderClassicModeChoices(currentPin);
  }

  if ($("q-story")) {
    $("q-story").innerText = storyText;
  }

  speakText(storyText);
  showModal("quest-modal");
}

function openTask(mode) {
  if (!currentPin) return;

  if (isAbbeyRouteApproachPin(currentPin)) {
    renderAbbeyRouteChoice();
    return;
  }

  if (mode === "boss" && isBossPin(currentPin)) {
    closeModal("quest-modal");
    openBossMission(currentPin);
    return;
  }

  const tier = getEffectiveTier();
  let task = null;

  clearTaskBlocks();
  setBossSummaryBlock("");
  hideBossProgressBox();

  if (state.activePack === "adult") {
    const content = getAdultContentForPin(currentPin);

    const storyText =
      content?.story ||
      "Case briefing not found for this location yet. Add story content for this adult pin.";
    const evidenceText = content?.evidence || "No evidence logged yet.";
    const clueText = content?.clue || "No clue logged yet.";

    if (mode === "read_case") {
      task = {
        title: content?.title || currentPin.event || currentPin.n,
        desc: `Case briefing for ${currentPin.n}`,
        story: storyText,
        evidence: "",
        clue: "",
        options: [],
        meta: { informational: true, rewardCoins: 0 },
        speech: storyText,
      };
    } else if (mode === "evidence") {
      task = {
        title: content?.title || currentPin.event || currentPin.n,
        desc: `Evidence log for ${currentPin.n}`,
        story: "",
        evidence: evidenceText,
        clue: "",
        options: [],
        meta: { informational: true, rewardCoins: 0 },
        speech: evidenceText,
      };
    } else if (mode === "clue") {
      task = {
        title: content?.title || currentPin.event || currentPin.n,
        desc: `Clue file for ${currentPin.n}`,
        story: "",
        evidence: "",
        clue: clueText,
        options: [],
        meta: { informational: true, rewardCoins: 0 },
        speech: clueText,
      };
    } else if (mode === "ar_verify") {
      task = {
        title: content?.title || currentPin.event || currentPin.n,
        desc: "Use AR verify to confirm the hotspot and compare the real place to the case notes.",
        story: "",
        evidence: "Hotspot verification required on site.",
        clue: "Look for details that match the case briefing before you confirm.",
        options: [],
        meta: { informational: true, rewardCoins: 0 },
        speech:
          "Use AR verify to confirm the hotspot and compare the real place to the case notes.",
      };
    } else {
      task = {
        title: content?.title || currentPin.event || currentPin.n,
        desc: `Case file for ${currentPin.n}`,
        story: storyText,
        evidence: evidenceText,
        clue: clueText,
        options: [],
        meta: { informational: true, rewardCoins: 0 },
        speech: storyText,
      };
    }
  } else {
    task = getQA({
      pinId: currentPin.id,
      mode,
      tier,
      zone: currentPin.zone || currentPin.set || state.mapMode,
      salt: Date.now(),
      recentQuestionIds: state.completedQuestionIds || [],
      recentQuestionTags: state.recentQuestionTags || [],
      adaptiveProfile: getCurrentQuizProfile(),
    });
  }

  currentTask = {
    mode,
    pin: currentPin,
    question: task,
    speedStartedAt: null,
  };

  const status = getCaptureStatus(currentPin);

  if ($("task-title")) {
    $("task-title").innerText =
      state.activePack === "adult"
        ? task?.title || currentPin.n
        : `${mode.toUpperCase()} @ ${currentPin.n}`;
  }

  if ($("task-desc")) {
    const requiredText = status.mustInclude.includes(mode)
      ? `\n\nREQUIRED FOR FULL CAPTURE`
      : "";
    const doneText = isModeCompletedForPin(currentPin, mode)
      ? `\n\nTHIS MODE ALREADY COMPLETED`
      : "";
    $("task-desc").innerText =
      (task?.desc || task?.q || "No mission found for this location.") +
      requiredText +
      doneText;
  }

  setTaskBlock("task-block-story", "task-story", task?.story || "");
  setTaskBlock("task-block-evidence", "task-evidence", task?.evidence || "");
  setTaskBlock("task-block-clue", "task-clue", task?.clue || "");

  renderTaskOptions(task);

  if (task?.speech) {
    speakText(task.speech);
  } else if (task?.q) {
    speakText(task.q);
  } else {
    speakText("No mission found.");
  }

  showModal("task-modal");
}

function buildManualTaskButtons(question) {
  const wrap = $("task-options");
  const readBtn = $("btn-read-answers");
  if (!wrap || !currentTask) return;

  wrap.innerHTML = "";
  wrap.style.display = "grid";
  if (readBtn) readBtn.classList.add("hidden");

  const mode = currentTask.mode;

  if (mode === "speed") {
    const startBtn = document.createElement("button");
    startBtn.className = "mcq-btn";
    startBtn.innerText = "START SPEED TIMER";
    startBtn.addEventListener("click", () => {
      currentTask.speedStartedAt = Date.now();
      if ($("task-feedback")) {
        $("task-feedback").style.display = "block";
        $("task-feedback").style.color = "var(--gold)";
        $("task-feedback").innerText =
          "Speed timer started. Finish within 20 seconds.";
      }
      speakText("Speed timer started.");
    });

    const completeBtn = document.createElement("button");
    completeBtn.className = "mcq-btn";
    completeBtn.innerText = "COMPLETE SPEED TASK";
    completeBtn.addEventListener("click", () => completeCurrentTaskManually());

    wrap.appendChild(startBtn);
    wrap.appendChild(completeBtn);
    return;
  }

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "mcq-btn";

  if (mode === "activity") confirmBtn.innerText = "CONFIRM ACTIVITY COMPLETE";
  else if (mode === "family") confirmBtn.innerText = "CONFIRM FAMILY COMPLETE";
  else if (mode === "history") confirmBtn.innerText = "MARK HISTORY COMPLETE";
  else confirmBtn.innerText = "CONFIRM COMPLETE";

  confirmBtn.addEventListener("click", () => completeCurrentTaskManually());
  wrap.appendChild(confirmBtn);
}

function renderTaskOptions(question) {
  const wrap = $("task-options");
  const readBtn = $("btn-read-answers");
  if (!wrap) return;

  wrap.innerHTML = "";

  const hasOptions = Array.isArray(question?.options) && question.options.length;

  if (!hasOptions) {
    buildManualTaskButtons(question);
    if ($("task-feedback")) {
      $("task-feedback").style.display = "none";
      $("task-feedback").innerText = "";
    }
    return;
  }

  wrap.style.display = "grid";

  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "mcq-btn";
    btn.innerText = option;
    btn.addEventListener("click", () => answerMission(index));
    wrap.appendChild(btn);
  });

  if (readBtn) {
    readBtn.classList.remove("hidden");
  }

  if ($("task-feedback")) {
    $("task-feedback").style.display = "none";
    $("task-feedback").innerText = "";
  }
}

/* ============================
   MYSTERIES
============================ */
function hasUnlockedMystery(id) {
  return state.unlockedMysteries.includes(Number(id));
}

function unlockMystery(id) {
  const num = Number(id);
  if (!Number.isFinite(num)) return;
  if (!hasUnlockedMystery(num)) {
    state.unlockedMysteries.push(num);
    saveState();
  }
}

function maybeUnlockMystery() {
  const chance = 0.35;
  if (Math.random() > chance) return null;

  const mystery = getRandomMystery(state.unlockedMysteries);
  if (!mystery) return null;

  unlockMystery(mystery.id);
  return mystery;
}



/* ============================
   ANSWERS / REWARDS
============================ */
function rememberQuestion(questionId) {
  if (!questionId) return;
  if (!state.completedQuestionIds.includes(questionId)) {
    state.completedQuestionIds.push(questionId);
    if (state.completedQuestionIds.length > 300) {
      state.completedQuestionIds = state.completedQuestionIds.slice(-300);
    }
  }
}

function speakRewardSequence({
  factText,
  rewardCoins,
  rewardXp,
  newLevel,
  oldLevel,
  fullCaptureJustUnlocked,
}) {
  const mode = getRewardPresentationMode();
  const levelUpText =
    newLevel > oldLevel ? ` You reached level ${newLevel}.` : "";
  const captureText = fullCaptureJustUnlocked
    ? " Node fully captured."
    : " Progress saved.";

  if (mode === "kid") {
    const line = `${factText}. You earned ${rewardCoins} coins and ${rewardXp} XP.${captureText}${levelUpText}`;
    speakText(line);
    return 1200;
  }

  if (mode === "teen") {
    const intro = `Correct. You earned ${rewardCoins} coins and ${rewardXp} XP.`;
    const fact = factText ? ` ${factText}.` : "";
    const level = levelUpText ? ` ${levelUpText.trim()}` : "";
    speakText(`${intro}${fact}${captureText}${level}`);
    return 1100;
  }

  const adultLine = `${factText}.${captureText}${levelUpText} You earned ${rewardCoins} coins and ${rewardXp} XP.`;
  speakText(adultLine);
  return 1500;
}

function applyMissionOutcome({
  isCorrect = true,
  manual = false,
}) {
  if (!currentTask) return;

  const q = currentTask.question || {};
  const feedback = $("task-feedback");
  const pin = currentTask.pin;
  const mode = currentTask.mode;

  if (!pin || !feedback) return;

  const wasAlreadyDone = isModeCompletedForPin(pin, mode);
  const missionReward = getMissionReward({
    mode,
    isNewMode: !wasAlreadyDone,
  });

  const questionId = q?.meta?.questionId || q?.id || null;
  const active = getActivePlayer();

  if (active && missionReward.coins) {
    updateCoins(active.id, missionReward.coins);
  }

  const oldLevel = getLevelFromXP(Number(state.meta.xp || 0));
  state.meta.xp = Number(state.meta.xp || 0) + Number(missionReward.xp || 0);
  state.meta.tokens =
    Number(state.meta.tokens || 0) + Number(missionReward.tokens || 0);

  const missionRecord = recordMissionCompletion(
    pin,
    mode,
    missionReward,
    questionId
  );

  let rewardCoins = Number(missionReward.coins || 0);
  let rewardXp = Number(missionReward.xp || 0);
  let rewardTokens = Number(missionReward.tokens || 0);

  if (missionRecord.fullCaptureJustUnlocked) {
    const bonus = getFullCaptureBonus(pin);
    rewardCoins += Number(bonus.coins || 0);
    rewardXp += Number(bonus.xp || 0);
    rewardTokens += Number(bonus.tokens || 0);

    if (active && bonus.coins) {
      updateCoins(active.id, bonus.coins);
    }

    state.meta.xp = Number(state.meta.xp || 0) + Number(bonus.xp || 0);
    state.meta.tokens =
      Number(state.meta.tokens || 0) + Number(bonus.tokens || 0);
  }

  const newLevel = getLevelFromXP(Number(state.meta.xp || 0));

  rememberQuestion(questionId);
  rememberQuestionTags(q?.meta?.tags || []);

  if (mode === "quiz") {
    const tier = getEffectiveTier();
    const currentProfile =
      state.quizProfiles?.[tier] || getDefaultAdaptiveProfile(tier);

    state.quizProfiles[tier] = updateAdaptiveProfile(currentProfile, {
      tier,
      isCorrect,
      difficulty: q?.meta?.difficulty,
      tags: q?.meta?.tags || [],
      questionId,
    });
  }

  const mystery = missionRecord.fullCaptureJustUnlocked ? maybeUnlockMystery() : null;

  checkBadgeUnlocksByCaptures();

  saveState();
  renderHUD();
  renderShop();
  renderHomeLog();
  refreshPinMarker(pin);
  renderClassicModeChoices(pin);

  const status = getCaptureStatus(pin);
  const factText = q.fact || q.desc || "Mission complete.";

  feedback.style.display = "block";
  feedback.style.color = "var(--neon)";

  const lines = [];
  lines.push(wasAlreadyDone ? "MODE REPLAY COMPLETE" : "MODE COMPLETE");
  lines.push(`${status.completedCount}/${status.required} CAPTURED`);

  if (status.missingRequired.length) {
    lines.push(`Still required: ${status.missingRequired.join(", ")}`);
  }

  lines.push("");
  lines.push(factText);
  lines.push("");
  lines.push(`+${rewardCoins} coins`);
  lines.push(`+${rewardXp} XP`);
  if (rewardTokens) lines.push(`+${rewardTokens} tokens`);

  if (missionRecord.fullCaptureJustUnlocked) {
    lines.push("");
    lines.push("FULL NODE CAPTURE COMPLETE");
  }

  if (mystery) {
    lines.push("");
    lines.push(`BONUS MYSTERY UNLOCKED`);
    lines.push(`${mystery.icon || "❓"} ${mystery.title}`);
  }

  feedback.innerText = lines.join("\n");

  const imageDelay = speakRewardSequence({
    factText,
    rewardCoins,
    rewardXp,
    newLevel,
    oldLevel,
    fullCaptureJustUnlocked: missionRecord.fullCaptureJustUnlocked,
  });

  if (missionRecord.fullCaptureJustUnlocked) {
    setTimeout(() => {
      showRewardImage(pin, factText);
    }, imageDelay);
  }
}

function answerMission(index) {
  if (!currentTask) return;

  const q = currentTask.question;
  const feedback = $("task-feedback");
  if (!feedback) return;

  if (!Array.isArray(q?.options) || typeof q.answer !== "number") {
    feedback.style.display = "none";
    return;
  }

  const correct = index === q.answer;
  feedback.style.display = "block";

  if (correct) {
    window.playUISound?.("correct_answer.mp3");
    applyMissionOutcome({ isCorrect: true });
    return;
  }

  window.playUISound?.("wrong_answer.mp3");

  const correctAnswer =
    Array.isArray(q.options) && q.options[q.answer] != null
      ? q.options[q.answer]
      : "Unknown";

  feedback.style.color = "#ff6b6b";
  feedback.innerText = `Wrong answer.\nCorrect answer: ${correctAnswer}`;
  speakText(`Wrong answer. The correct answer is ${correctAnswer}.`);

  if (currentTask.mode === "quiz") {
    const tier = getEffectiveTier();
    const currentProfile =
      state.quizProfiles?.[tier] || getDefaultAdaptiveProfile(tier);

    state.quizProfiles[tier] = updateAdaptiveProfile(currentProfile, {
      tier,
      isCorrect: false,
      difficulty: q?.meta?.difficulty,
      tags: q?.meta?.tags || [],
      questionId: q?.meta?.questionId || q?.id || null,
    });

    rememberQuestionTags(q?.meta?.tags || []);
    saveState();
  }
}


function completeCurrentTaskManually() {
  if (!currentTask) return;

  const feedback = $("task-feedback");
  if (!feedback) return;

  if (currentTask.mode === "speed") {
    if (!currentTask.speedStartedAt) {
      feedback.style.display = "block";
      feedback.style.color = "#ff6b6b";
      feedback.innerText = "Start the speed timer first.";
      speakText("Start the speed timer first.");
      return;
    }

    const elapsed = Date.now() - currentTask.speedStartedAt;
    if (elapsed > 20000) {
      feedback.style.display = "block";
      feedback.style.color = "#ff6b6b";
      feedback.innerText = "Speed task failed. Time ran out.";
      speakText("Speed task failed. Time ran out.");
      return;
    }
  }

  applyMissionOutcome({ isCorrect: true, manual: true });
}

/* ============================
   SETTINGS / HOME
============================ */
function applySettingsToUI() {
  if ($("radius-label")) $("radius-label").innerText = state.settings.radius;
  if ($("pitch-label")) $("pitch-label").innerText = state.settings.voicePitch;
  if ($("rate-label")) $("rate-label").innerText = state.settings.voiceRate;
  if ($("sfx-label")) $("sfx-label").innerText = state.settings.sfxVol;
  if ($("zoomui-label"))
    $("zoomui-label").innerText = state.settings.zoomUI ? "ON" : "OFF";

  if ($("enter-radius")) $("enter-radius").value = state.settings.radius;
  if ($("v-pitch")) $("v-pitch").value = state.settings.voicePitch;
  if ($("v-rate")) $("v-rate").value = state.settings.voiceRate;
  if ($("sfx-vol")) $("sfx-vol").value = state.settings.sfxVol;
  if ($("tier-mode")) $("tier-mode").value = state.tierMode || "kid";
  if ($("voice-select")) $("voice-select").value = state.settings.voiceName || "";
}

function renderHomeLog() {
  const summary = $("home-summary");
  const list = $("home-list");
  if (!summary || !list) return;

  const pins = getCurrentPins();
  const mysteryCount = state.unlockedMysteries?.length || 0;
  const completedCount = state.completedQuestionIds?.length || 0;
  const currentProgress = getCurrentModeProgress();
  const xp = Number(state.meta?.xp || 0);
  const level = getLevelFromXP(xp);
  const levelProgress = getLevelProgress(xp);
  const tier = getEffectiveTier();
  const quizProfile = getCurrentQuizProfile();
  const badges = Array.isArray(state.meta?.badges) ? state.meta.badges : [];
  const lock = getAdultLock();
 const abbey = state?.rebuild?.abbey || {
  points: 0,
  stage: 0,
  completedRoutes: [],
  unlockedCore: false,
  completedCore: false,
  finished: false,
};
  const route = state.route;
  const noteCount = Array.isArray(state.captainNotes) ? state.captainNotes.length : 0;
  const bossSolvedCount = Object.values(state.bossProgress || {}).filter(
    (x) => x?.solved
  ).length;

  summary.innerHTML = `
    <div style="padding:12px;border:1px solid #444;border-radius:14px;background:#111;line-height:1.6;">
      <div><strong>LEVEL:</strong> ${level}</div>
      <div><strong>XP:</strong> ${xp} (${levelProgress}/100 to next level)</div>
      <div><strong>BADGES:</strong> ${badges.length}</div>
      <div><strong>FULL NODES CAPTURED:</strong> ${Number(
        state.pinStats?.totalFirstCompletions || 0
      )}</div>
      <div><strong>PACK:</strong> ${state.activePack}</div>
      <div><strong>MODE:</strong> ${state.mapMode}</div>
      <div><strong>TIER:</strong> ${tier}</div>
      <div><strong>ADULT LOCK:</strong> ${
        lock.unlocked ? "UNLOCKED" : "LOCKED"
      }</div>
      <div><strong>QUIZ RATING:</strong> ${Number(quizProfile.rating || 0)}</div>
      <div><strong>QUIZ STREAK:</strong> ${Number(quizProfile.streak || 0)}</div>
      <div><strong>QUIZ CONFIDENCE:</strong> ${Math.round(
        Number(quizProfile.confidence || 0) * 100
      )}%</div>
      <div><strong>PINS LOADED:</strong> ${pins.length}</div>
      <div><strong>MODE FULLY CAPTURED:</strong> ${currentProgress.completed}/${currentProgress.total} (${currentProgress.percent}%)</div>
      <div><strong>MODE REMAINING:</strong> ${currentProgress.remaining}</div>
      <div><strong>MYSTERIES UNLOCKED:</strong> ${mysteryCount}</div>
      <div><strong>COMPLETED PROMPTS TRACKED:</strong> ${completedCount}</div>
      <div><strong>CAPTAIN NOTES:</strong> ${noteCount}</div>
      <div><strong>ABBEY REBUILD:</strong> ${abbey.points} (Stage ${abbey.stage})</div>
      <div><strong>ABBEY ROUTES COMPLETE:</strong> ${
        abbey.completedRoutes.length ? abbey.completedRoutes.join(", ") : "none"
      }</div>
      <div><strong>ACTIVE ROUTE:</strong> ${
        route?.path ? `${route.path} step ${Number(route.step || 0) + 1}` : "none"
      }</div>
      <div><strong>BOSS TRIALS SOLVED:</strong> ${bossSolvedCount}</div>
    </div>
  `;

  const mysteryBlock = mysteryCount
    ? `
      <div style="padding:10px;border:1px solid #444;border-radius:12px;margin:8px 0 14px;background:#161616;">
        <div style="font-weight:bold;color:var(--gold);">UNLOCKED MYSTERIES</div>
        <div style="margin-top:6px;font-size:13px;opacity:.9;">
          ${state.unlockedMysteries.map((id) => `#${id}`).join(", ")}
        </div>
      </div>
    `
    : `
      <div style="padding:10px;border:1px solid #333;border-radius:12px;margin:8px 0 14px;background:#111;">
        <div style="font-weight:bold;color:var(--gold);">UNLOCKED MYSTERIES</div>
        <div style="margin-top:6px;font-size:13px;opacity:.85;">None yet.</div>
      </div>
    `;

  const badgeBlock = badges.length
    ? `
      <div style="padding:10px;border:1px solid #444;border-radius:12px;margin:8px 0 14px;background:#161616;">
        <div style="font-weight:bold;color:var(--gold);">NODE BADGES</div>
        <div style="margin-top:8px;font-size:13px;line-height:1.6;">
          ${badges
            .map(
              (b) =>
                `${b.icon} ${b.name} ${
                  b.captures ? `(${b.captures} node${b.captures === 1 ? "" : "s"})` : ""
                }`
            )
            .join("<br>")}
        </div>
      </div>
    `
    : "";

  const clueBlock =
    route?.clues?.length
      ? `
    <div style="padding:10px;border:1px solid #444;border-radius:12px;margin:8px 0 14px;background:#161616;">
      <div style="font-weight:bold;color:var(--gold);">ACTIVE ROUTE CLUES</div>
      <div style="margin-top:8px;font-size:13px;line-height:1.6;">
        ${route.clues
          .map((c) => `${c.value} — ${c.saveLabel || c.title || "clue"}`)
          .join("<br>")}
      </div>
    </div>
  `
      : "";

  const bossBlock = Object.keys(state.bossProgress || {}).length
    ? `
      <div style="padding:10px;border:1px solid #444;border-radius:12px;margin:8px 0 14px;background:#161616;">
        <div style="font-weight:bold;color:var(--gold);">BOSS FILES</div>
        <div style="margin-top:8px;font-size:13px;line-height:1.6;">
          ${Object.entries(state.bossProgress)
            .map(
              ([key, value]) =>
                `${key} — ${value?.solved ? "SOLVED" : "IN PROGRESS"} • wrong ${Number(
                  value?.wrongAnswers || 0
                )}`
            )
            .join("<br>")}
        </div>
      </div>
    `
    : "";

  list.innerHTML =
    mysteryBlock +
    badgeBlock +
    clueBlock +
    bossBlock +
    pins
      .slice(0, 50)
      .map((pin) => {
        const status = getCaptureStatus(pin);
        return `
        <div style="padding:10px;border:1px solid #333;border-radius:12px;margin:8px 0;background:${
          status.fullyCaptured ? "rgba(77,255,158,0.08)" : "#111"
        };">
          <div style="font-weight:bold;">${
            status.fullyCaptured ? "✅ " : ""
          }${pin.n}</div>
          <div style="opacity:.85;font-size:12px;">${
            pin.zone || pin.set || pin.category || "unknown"
          }</div>
          <div style="margin-top:6px;font-size:12px;opacity:.82;">
            ${status.completedCount}/${status.required} captured${
              status.mustInclude.length
                ? ` • required: ${status.mustInclude.join(", ")}`
                : ""
            }${isBossPin(pin) ? " • boss trial" : ""}
          </div>
        </div>
      `;
      })
      .join("");
}

function updateStartButtons() {
 
  $("pill-game-explorer")?.classList.toggle(
  "active",
  activeGameMode === "explorer"
);
$("pill-game-territory")?.classList.toggle(
  "active",
  activeGameMode === "territory"
);

  $("pill-full")?.classList.toggle(
    "active",
    state.activePack === "classic" && state.mapMode === "core"
  );
  $("pill-park")?.classList.toggle(
    "active",
    state.activePack === "classic" && state.mapMode === "park"
  );
  $("pill-docks")?.classList.toggle(
    "active",
    state.activePack === "classic" && state.mapMode === "abbey"
  );

  $("pill-kids")?.classList.toggle("active", state.tierMode === "kid");
  $("pill-teen")?.classList.toggle("active", state.tierMode === "teen");

  $("pill-truecrime")?.classList.toggle(
    "active",
    state.activePack === "adult" && state.activeAdultCategory === "true_crime"
  );
  $("pill-conspiracy")?.classList.toggle(
    "active",
    state.activePack === "adult" && state.activeAdultCategory === "conspiracy"
  );
  $("pill-history")?.classList.toggle(
    "active",
    state.activePack === "adult" && state.activeAdultCategory === "history"
  );
}

/* ============================
   AR
============================ */
async function openAR() {
  showModal("ar-modal");

  if ($("ar-readout")) {
    $("ar-readout").innerText = currentPin
      ? `Scanning around ${currentPin.n}`
      : "Scanning...";
  }

  const video = $("ar-video");
  if (!video || !navigator.mediaDevices?.getUserMedia) return;

  try {
    arStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    video.srcObject = arStream;
  } catch (err) {
    console.warn("AR camera failed:", err);
    if ($("ar-readout")) $("ar-readout").innerText = "Camera access failed.";
  }
}

function stopAR() {
  const video = $("ar-video");
  if (video && video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }
  arStream = null;
}

/* ============================
   RENDER ALL / FULL REFRESH
============================ */
function renderEverything() {
  renderHUD();
  applySettingsToUI();
  updateStartButtons();
  refreshAdultLockUI();
  showQuestLayoutForPack();
  renderHomeLog();
  renderShop();
  renderCaptainNotes();

  if (map) {
    refreshAllPinMarkers();
  }
}

function handleActionTrigger() {
  if (!currentPin) return;

  if (activeGameMode === "territory") {
    territorySystem?.handleAction(currentPin, getActivePlayer());
    return;
  }

  openMissionMenu();
}

function runTerritoryBotTurn() {
  if (activeGameMode !== "territory") return;
  if (!territorySystem) return;

  const botPlayer = state.players.find((p) => p.id === "p2");
  if (!botPlayer) return;

  botPlayer.enabled = true;
  botPlayer.name = botPlayer.name || "Player 2";
  botPlayer.coins = Number(botPlayer.coins || 0) + 5;

  const pins = getCurrentPins();
  if (!pins.length) return;

  const botNodes = [];
  const enemyNodes = [];
  const freeNodes = [];

  pins.forEach((pin) => {
    const node = territorySystem.getNode(pin);
    if (!node) return;

    if (!node.ownerId) freeNodes.push(pin);
    else if (node.ownerId === "p2") botNodes.push(pin);
    else enemyNodes.push(pin);
  });

  let target = null;

  if (enemyNodes.length && Math.random() < 0.55) {
    target = enemyNodes[Math.floor(Math.random() * enemyNodes.length)];
    territorySystem.attackNode(target, botPlayer);
  } else if (freeNodes.length) {
    target = freeNodes[Math.floor(Math.random() * freeNodes.length)];
    territorySystem.captureNode(target, botPlayer);
  } else if (botNodes.length) {
    target = botNodes[Math.floor(Math.random() * botNodes.length)];
    territorySystem.upgradeNode(target, botPlayer);
  }

  renderHUD();
  renderHomeLog();
  refreshAllPinMarkers();
}


function getTerritoryOwnerText(ownerId) {
  if (!ownerId) return "FREE";
  if (ownerId === "p1") return "PLAYER 1";
  if (ownerId === "p2") return "PLAYER 2";
  if (ownerId === "p3") return "PLAYER 3";
  if (ownerId === "p4") return "PLAYER 4";
  return ownerId.toUpperCase();
}

function showTerritoryHitFeedback(text = "-10%") {
  const panel = document.querySelector(".territory-panel-card");
  const fill = $("territory-defence-fill");

  if (panel) {
    panel.classList.remove("weapon-hit");
    void panel.offsetWidth;
    panel.classList.add("weapon-hit");
  }

  if (fill) {
    fill.classList.remove("weapon-hit");
    void fill.offsetWidth;
    fill.classList.add("weapon-hit");
  }

  const pop = document.createElement("div");
  pop.className = "territory-damage-pop";
  pop.innerText = text;
  document.body.appendChild(pop);

  setTimeout(() => {
    pop.remove();
  }, 950);
}

function openTerritoryCommandPanel(pin) {
  if (!pin || !territorySystem) return;

  currentPin = pin;

  const active = getActivePlayer();
  const node = territorySystem.getNode(pin);

  const ownerId = node?.ownerId || null;
  const isFree = !ownerId;
  const isMine = ownerId === active?.id;
  const isEnemy = ownerId && !isMine;

  const defence = Math.max(0, Math.min(100, Number(node?.defencePercent || 0)));
  const level = Math.max(1, Math.min(3, Number(node?.level || 1)));
  const storedCoins = Math.floor(Number(node?.storedCoins || 0));
  const defenceName = node?.defenceName || "None";
  const incomeRate = territorySystem.getIncomeRateForLevel?.(level) || 0;

  const woodenArrowCount = getInventoryCount("wooden_arrow");
  const boneArrowCount = getInventoryCount("bone_arrow");
  const handCannonCount = getInventoryCount("hand_cannon");

  if ($("territory-node-name")) $("territory-node-name").innerText = pin.n || "Territory Node";
  if ($("territory-node-owner")) $("territory-node-owner").innerText = getTerritoryOwnerText(ownerId);
  if ($("territory-node-level")) $("territory-node-level").innerText = `L${level}`;
  if ($("territory-node-defence")) $("territory-node-defence").innerText = `${Math.round(defence)}%`;
  if ($("territory-node-stored")) $("territory-node-stored").innerText = `${storedCoins} coins`;
  if ($("territory-node-income")) $("territory-node-income").innerText = `${incomeRate}/min`;

  if ($("territory-defence-fill")) {
    $("territory-defence-fill").style.width = `${defence}%`;
  }

  if ($("territory-node-status")) {
    $("territory-node-status").innerText = isFree ? "NEUTRAL" : isMine ? "YOURS" : "ENEMY";
  }

  const scores = territorySystem?.getTerritoryScores?.() || [];
  const leader = scores[0] || null;
  const victoryScore = 500;

  if ($("territory-panel-message")) {
    if (leader && leader.score >= victoryScore) {
      $("territory-panel-message").innerText = `🏆 ${leader.playerName} is winning the territory war with ${leader.score} points!`;
    } else if (isFree) {
      $("territory-panel-message").innerText = "Neutral node. Capture it to claim the area.";
    } else if (isMine) {
      $("territory-panel-message").innerText = `Your territory. Defence: ${defenceName}. Upgrade, defend, collect coins, or build zones.`;
    } else {
      $("territory-panel-message").innerText = `Enemy territory. Use Bee Arrow weapons or attack to break defence. Defence: ${defenceName}.`;
    }
  }

  if ($("territory-scoreboard")) {
    $("territory-scoreboard").innerHTML = scores.length
      ? scores
          .map(
            (row, index) => `
              <div class="territory-score-line">
                <span>${index + 1}. ${row.playerName}</span>
                <strong>${row.score}/${victoryScore} pts • ${row.nodes} nodes • ${row.zones || 0} zones • +${row.income}/min</strong>
              </div>
            `
          )
          .join("")
      : "No territory claimed yet.";
  }

  if ($("btn-territory-capture")) $("btn-territory-capture").disabled = !isFree;
  if ($("btn-territory-attack")) $("btn-territory-attack").disabled = !isEnemy;
  if ($("btn-territory-upgrade")) $("btn-territory-upgrade").disabled = !isMine || level >= 3;
  if ($("btn-territory-repair")) $("btn-territory-repair").disabled = !isMine || storedCoins <= 0;

  if ($("btn-defence-shield")) $("btn-defence-shield").disabled = !isMine;
  if ($("btn-defence-core")) $("btn-defence-core").disabled = !isMine;
  if ($("btn-defence-bee")) $("btn-defence-bee").disabled = !isMine;

  if ($("btn-weapon-arrow-wood")) {
    $("btn-weapon-arrow-wood").disabled = !isEnemy || woodenArrowCount <= 0;
    $("btn-weapon-arrow-wood").innerHTML = `🐝🏹 Bee Arrow<br><small>-10% • x${woodenArrowCount}</small>`;
  }

  if ($("btn-weapon-arrow-bone")) {
    $("btn-weapon-arrow-bone").disabled = !isEnemy || boneArrowCount <= 0;
    $("btn-weapon-arrow-bone").innerHTML = `🐝🦴 Stinger Arrow<br><small>-20% • x${boneArrowCount}</small>`;
  }

  if ($("btn-weapon-hand-cannon")) {
    $("btn-weapon-hand-cannon").disabled = !isEnemy || handCannonCount <= 0;
    $("btn-weapon-hand-cannon").innerHTML = `🐝🚢 Bee Sub Cannon<br><small>-30% • x${handCannonCount}</small>`;
  }

  showActionButton(false);
  showModal("territory-command-modal");
}

/* ============================
   BUTTONS
============================ */
function wireButtons() {

$("btn-territory-close")?.addEventListener("click", () =>
  closeModal("territory-command-modal")
);

$("btn-territory-close-x")?.addEventListener("click", () =>
  closeModal("territory-command-modal")
);

$("btn-territory-capture")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.captureNode(currentPin, getActivePlayer());
  closeModal("territory-command-modal");
});

$("btn-territory-attack")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.attackNode(currentPin, getActivePlayer());
  openTerritoryCommandPanel(currentPin);
});

$("btn-territory-upgrade")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.upgradeNode(currentPin, getActivePlayer());
  openTerritoryCommandPanel(currentPin);
});

$("btn-territory-repair")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.collectNodeCoins(currentPin, getActivePlayer());
  openTerritoryCommandPanel(currentPin);
});

$("btn-defence-shield")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.installDefence(currentPin, getActivePlayer(), "shield");
  openTerritoryCommandPanel(currentPin);
});

$("btn-defence-core")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.installDefence(currentPin, getActivePlayer(), "core");
  openTerritoryCommandPanel(currentPin);
});

$("btn-defence-bee")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.installDefence(currentPin, getActivePlayer(), "bee_nest");
  openTerritoryCommandPanel(currentPin);
});
  
$("action-trigger")?.addEventListener("click", handleActionTrigger);
  
  $("pill-game-explorer")?.addEventListener("click", () => {
  activeGameMode = "explorer";
  updateStartButtons();
  refreshAllPinMarkers();
  speakText("Explorer mode selected.");
});

$("pill-game-territory")?.addEventListener("click", () => {
  activeGameMode = "territory";
  showActionButton(false);
  updateStartButtons();
  refreshAllPinMarkers();
  speakText("Territory mode selected.");
});
  
  $("btn-start")?.addEventListener("click", () => closeModal("start-modal"));
  $("btn-start-close")?.addEventListener("click", () =>
    closeModal("start-modal")
  );
  $("btn-start-close-x")?.addEventListener("click", () =>
    closeModal("start-modal")
  );

document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    activeGameMode = "explorer";
    speakText("Explorer mode");
  }

  if (e.key === "2") {
    activeGameMode = "territory";
    speakText("Territory mode");
  }
});

$("btn-weapon-arrow-wood")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.useWeaponOnNode(currentPin, getActivePlayer(), "wooden_arrow");
  openTerritoryCommandPanel(currentPin);
});

$("btn-weapon-arrow-bone")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.useWeaponOnNode(currentPin, getActivePlayer(), "bone_arrow");
  openTerritoryCommandPanel(currentPin);
});

$("btn-weapon-hand-cannon")?.addEventListener("click", () => {
  if (!currentPin) return;
  territorySystem?.useWeaponOnNode(currentPin, getActivePlayer(), "hand_cannon");
  openTerritoryCommandPanel(currentPin);
});

  
  $("btn-home")?.addEventListener("click", () => {
    currentPin = null;
    currentTask = null;

    const actionBtn = $("action-trigger");
    if (actionBtn) actionBtn.style.display = "none";

    state.activePack = "classic";
    state.activeAdultCategory = null;
    state.mapMode = "core";
    clearAdultSessionApproval();
    clearActiveRoute();

    saveState();
    updateStartButtons();
    refreshAdultLockUI();
    resetMap();
    showModal("start-modal");
  });

$("btn-shop")?.addEventListener("click", () => {
  renderShop();
  showModal("shop-modal");
  speakText("Shop opened.");
});
 
  $("voice-select")?.addEventListener("change", (e) => {
  state.settings.voiceName = String(e.target.value || "");
  saveState();
  applySettingsToUI();
  speakText("Voice updated.");
  });

  $("btn-shop-close")?.addEventListener("click", () =>
    closeModal("shop-modal")
  );
 
  $("btn-shop-close-x")?.addEventListener("click", () =>
    closeModal("shop-modal")
  );

  $("btn-home-close")?.addEventListener("click", () =>
    closeModal("home-modal")
  );
  $("btn-home-close-x")?.addEventListener("click", () =>
    closeModal("home-modal")
  );

  $("btn-settings")?.addEventListener("click", () => {
    showModal("settings-modal");
    speakText("System config opened.");
  });

  $("btn-open-settings")?.addEventListener("click", () => {
    showModal("settings-modal");
    speakText("System config opened.");
  });

  $("btn-close-settings")?.addEventListener("click", () =>
    closeModal("settings-modal")
  );
  $("btn-close-settings-x")?.addEventListener("click", () =>
    closeModal("settings-modal")
  );

  $("btn-commander")?.addEventListener("click", () => {
    renderHomeLog();
    renderCaptainNotes();
    showModal("commander-hub");
    speakText("Commander hub opened.");
  });

  $("btn-close-commander")?.addEventListener("click", () =>
    closeModal("commander-hub")
  );
  $("btn-close-commander-x")?.addEventListener("click", () =>
    closeModal("commander-hub")
  );

  $("btn-send-broadcast")?.addEventListener("click", sendBroadcastMessage);
  $("btn-save-captain-note")?.addEventListener("click", handleSaveCaptainNote);

  $("btn-close-quest")?.addEventListener("click", () =>
    closeModal("quest-modal")
  );
  $("btn-task-close")?.addEventListener("click", () =>
    closeModal("task-modal")
  );

  $("btn-read-answers")?.addEventListener("click", () => {
    if (currentTask?.mode === "boss") {
      const step =
        currentTask?.boss?.steps?.[Number(currentTask?.boss?.stepIndex || 0)];
      if (step?.options?.length) {
        speakOptions(step.options);
      }
      return;
    }

    if (currentTask?.question?.options?.length) {
      speakOptions(currentTask.question.options);
    }
  });

  $("btn-reward-image-close")?.addEventListener("click", closeRewardImageModal);
  $("btn-reward-image-close-x")?.addEventListener(
    "click",
    closeRewardImageModal
  );


  $("pill-full")?.addEventListener("click", () => {
    state.activePack = "classic";
    state.mapMode = "core";
    state.activeAdultCategory = null;
    clearActiveRoute();
    saveState();
    updateStartButtons();
    refreshAdultLockUI();
    resetMap();
    speakText("Full Barrow selected.");
  });

  $("pill-park")?.addEventListener("click", () => {
    state.activePack = "classic";
    state.mapMode = "park";
    state.activeAdultCategory = null;
    clearActiveRoute();
    saveState();
    updateStartButtons();
    refreshAdultLockUI();
    resetMap();
    speakText("Park selected.");
  });

  $("pill-docks")?.addEventListener("click", () => {
    state.activePack = "classic";
    state.mapMode = "abbey";
    state.activeAdultCategory = null;
    clearActiveRoute();
    saveState();
    updateStartButtons();
    refreshAdultLockUI();
    resetMap();
    speakText("Abbey selected.");
  });

  $("pill-truecrime")?.addEventListener("click", () => {
    openAdultCategory("true_crime", "True crime");
  });

  $("pill-conspiracy")?.addEventListener("click", () => {
    openAdultCategory("conspiracy", "Conspiracy");
  });

  $("pill-history")?.addEventListener("click", () => {
    openAdultCategory("history", "History");
  });

  $("pill-kids")?.addEventListener("click", () => {
    state.tierMode = "kid";
    state.activePack = "classic";
    state.activeAdultCategory = null;
    clearAdultSessionApproval();
    saveState();
    updateStartButtons();
    refreshAdultLockUI();
    speakText("Kids mode selected.");
  });

  $("pill-teen")?.addEventListener("click", () => {
    state.tierMode = "teen";
    saveState();
    updateStartButtons();
    refreshAdultLockUI();
    speakText("Teen mode selected.");
  });

  $("tier-mode")?.addEventListener("change", (e) => {
    state.tierMode = e.target.value;
    if (state.tierMode === "kid") {
      clearAdultSessionApproval();
      if (state.activePack === "adult") {
        state.activePack = "classic";
        state.activeAdultCategory = null;
        resetMap();
      }
    }
    saveState();
    refreshAdultLockUI();
  });

  document.querySelectorAll(".m-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const mode = tile.dataset.mode;
      if (!mode || mode === "battle") return;
      closeModal("quest-modal");
      openTask(mode);
    });
  });

  $("adult-read-case")?.addEventListener("click", () => {
    closeModal("quest-modal");
    openTask("read_case");
  });

  $("adult-view-evidence")?.addEventListener("click", () => {
    closeModal("quest-modal");
    openTask("evidence");
  });

  $("adult-view-clue")?.addEventListener("click", () => {
    closeModal("quest-modal");
    openTask("clue");
  });

  $("adult-ar-verify")?.addEventListener("click", () => {
    closeModal("quest-modal");
    openTask("ar_verify");
  });

  $("btn-player-1")?.addEventListener("click", () => setPlayerCount(1));
  $("btn-player-2")?.addEventListener("click", () => setPlayerCount(2));
  $("btn-player-3")?.addEventListener("click", () => setPlayerCount(3));
  $("btn-player-4")?.addEventListener("click", () => setPlayerCount(4));

  $("btn-hp-k")?.addEventListener("click", () => {
    const p = getEnabledPlayers()[0];
    if (p) setActivePlayer(p.id);
  });

  $("btn-hp-p")?.addEventListener("click", () => {
    const p = getEnabledPlayers()[1] || getEnabledPlayers()[0];
    if (p) setActivePlayer(p.id);
  });

  $("btn-swap")?.addEventListener("click", () => {
    const enabled = getEnabledPlayers();
    if (enabled.length >= 2) {
      const tmp = enabled[0].name;
      enabled[0].name = enabled[1].name;
      enabled[1].name = tmp;
      saveState();
      renderHUD();
      renderShop();
      speakText("Players swapped.");
    }
  });

  $("btn-night")?.addEventListener("click", () => {
    nightVisionOn = !nightVisionOn;
    $("map")?.classList.toggle("night-vision", nightVisionOn);
    speakText(nightVisionOn ? "Night vision on." : "Night vision off.");
  });

  $("btn-zoom-ui")?.addEventListener("click", () => {
    state.settings.zoomUI = !state.settings.zoomUI;
    saveState();
    applySettingsToUI();
    resetMap();
    speakText(state.settings.zoomUI ? "Zoom buttons on." : "Zoom buttons off.");
  });

  $("btn-test")?.addEventListener("click", () => {
    alert("Systems are responding.");
    speakText("Systems are responding.");
  });

  $("enter-radius")?.addEventListener("input", (e) => {
    state.settings.radius = Number(e.target.value);
    saveState();
    applySettingsToUI();
  });

  $("v-pitch")?.addEventListener("input", (e) => {
    state.settings.voicePitch = Number(e.target.value);
    saveState();
    applySettingsToUI();
    speakText(`Voice pitch ${state.settings.voicePitch}`);
  });

  $("v-rate")?.addEventListener("input", (e) => {
    state.settings.voiceRate = Number(e.target.value);
    saveState();
    applySettingsToUI();
    speakText(`Voice rate ${state.settings.voiceRate}`);
  });

  $("sfx-vol")?.addEventListener("input", (e) => {
    state.settings.sfxVol = Number(e.target.value);
    saveState();
    applySettingsToUI();
  });

 

  $("btn-ar-open")?.addEventListener("click", openAR);
  $("btn-ar-stop")?.addEventListener("click", stopAR);
  $("btn-ar-close")?.addEventListener("click", () => {
    stopAR();
    closeModal("ar-modal");
  });
  $("btn-ar-manual")?.addEventListener("click", () => {
    stopAR();
    closeModal("ar-modal");
    speakText("Hotspot verified.");
    alert("Hotspot verified.");
  });

  window.addEventListener("beforeunload", () => {
    saveStateNow(true);
  });
}

window.getActivePlayer = getActivePlayer;
window.getInventoryCount = getInventoryCount;
window.ensureShopDefaults = ensureShopDefaults;
window.getLevelFromXP = getLevelFromXP;
window.applySettingsToUI = applySettingsToUI;
window.renderHUD = renderHUD;
window.speakText = speakText;
window.playSound = playSound;
window.playUISound = playUISound;
window.clearTrailLayers = clearTrailLayers;
window.applyMapTheme = applyMapTheme;
window.createHeroIcon = createHeroIcon;
window.saveState = saveState;
window.renderShop = renderShop;

window.refreshHeroMarker = () => {
  if (heroMarker) {
    heroMarker.setIcon(createHeroIcon());
  }
};


function setupSystems() {
  audioSystem = createAudioSystem({
    getState: () => state,
  });

  trailSystem = createTrailSystem({
    getState: () => state,
    getMap: () => map,
    distanceInMeters,
    playTrailSound: (trailId) => audioSystem?.playTrailSound(trailId),
  });

territorySystem = createTerritorySystem({
    getState: () => state,
    saveState,
    updateCoins,
    renderHUD,
    renderHomeLog,
    refreshAllPinMarkers,
    speakText,
  });

  
  bossSystem = createBossSystem({
    getState: () => state,
    getCurrentTask: () => currentTask,
    setCurrentTask: (nextTask) => {
      currentTask = nextTask;
    },
    getBossDefs: () => BOSS_DEFS,
    getBossModePinIds: () => BOSS_MODE_PIN_IDS,
    getEffectiveTier,
    getActivePlayer,
    updateCoins,
    hasBadge,
    showBadgePopup,
    checkBadgeUnlocksByCaptures,
    saveCaptainNote,
    recordMissionCompletion,
    renderHUD,
    renderHomeLog,
    renderShop,
    refreshPinMarker,
    showScriptedRewardImage,
    saveState,
    speakText,
    showModal,
    clearTaskBlocks,
    setTaskBlock,
    $,
  });
}

gameModes.explorer = {
    openPin(pin) {
      currentPin = pin;
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
    },
  };

gameModes.territory = {
  openPin(pin) {
    openTerritoryCommandPanel(pin);
  },
};

/* ============================
   BOOT
============================ */
function boot() {
  try {
    setupSystems();
    renderEverything();
    wireButtons();

    showWelcomeMessage();

    initMap();
    checkBadgeUnlocksByCaptures();
    saveStateNow(true);

    setInterval(() => {
      if (activeGameMode !== "territory") return;
      if (!territorySystem) return;

      getCurrentPins().forEach((pin) => {
        territorySystem.getNode(pin);
      });

      renderHUD();
      renderHomeLog();
      refreshAllPinMarkers();
    }, 15000);

    setInterval(() => {
      runTerritoryBotTurn();
    }, 30000);

    console.log("App loaded");
  } catch (err) {
    console.error("BOOT ERROR:", err);
  }
}


document.addEventListener(
  "click",
  () => {
    window.__audioUnlocked = true;
  },
  { once: true }
);

window.addEventListener("DOMContentLoaded", boot);
