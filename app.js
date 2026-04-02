import {
  getQA,
  getPinStartIntro,
  getDefaultAdaptiveProfile,
  normaliseAdaptiveProfile,
  updateAdaptiveProfile,
} from "./qa.js";
import { PINS } from "./pins.js";
import { ADULT_PINS } from "./adult_pins.js";
import { ADULT_CONTENT } from "./adult_content.js";
import { applyReward } from "./progression.js";
import { getRandomMystery } from "./mysteries.js";

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

const ABBEY_ROUTE_APPROACH_PIN_IDS = [
  "abbey_valley_view",
  "abbey_gate",
  "abbey_church",
  "abbey_boss",
];

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

const SHOP_ITEMS = [
  {
    id: "hint_basic",
    name: "Hint Token",
    cost: 50,
    desc: "Use later for clue help.",
    type: "consumable",
  },
  {
    id: "double_reward",
    name: "Double Reward",
    cost: 120,
    desc: "Boost your next mission reward.",
    type: "consumable",
  },
  {
    id: "ghost_badge",
    name: "Ghost Badge",
    cost: 80,
    desc: "Collectible badge for spooky explorers.",
    type: "badge",
  },
  {
    id: "history_badge",
    name: "History Badge",
    cost: 80,
    desc: "Collectible badge for history hunters.",
    type: "badge",
  },
  {
    id: "park_badge",
    name: "Park Badge",
    cost: 65,
    desc: "Collectible badge for park explorers.",
    type: "badge",
  },
  {
    id: "abbey_badge",
    name: "Abbey Badge",
    cost: 65,
    desc: "Collectible badge for abbey runs.",
    type: "badge",
  },
  {
    id: "route_glow_pack",
    name: "Route Glow",
    cost: 95,
    desc: "Adds a brighter glow to completed routes.",
    type: "cosmetic",
  },
];

/* ============================
   SCRIPTED ABBEY ROUTES
============================ */
const ABBEY_ROUTE_DEFS = {
  investigate: {
    id: "investigate",
    title: "Investigate the Monk Paths",
    intro:
      "Not all paths to the Abbey were visible. Some were used quietly by those who protected knowledge.",
    steps: [
      {
        title: "The Hidden Path",
        desc: "Why would a hidden path be important here?",
        storyCategory: "place",
        story:
          "Not all paths to the Abbey were visible.\nSome were used only by those who needed to move quietly… and without notice.",
        options: [
          "For private movement and protected knowledge",
          "For horse racing",
          "For public trading",
        ],
        answer: 0,
        fact:
          "You’ve stepped onto the monks’ route. Hidden movement mattered here.",
        clue: { value: "2", importance: "high", saveLabel: "Hidden Path = 2" },
        rebuild: 2,
        reward: { coins: 22, xp: 12 },
      },
      {
        title: "Control and Structure",
        desc: "What would monks value most in a place like this?",
        storyCategory: "purpose",
        story:
          "The Abbey was not chaos.\nEvery movement… every path… had purpose.",
        options: ["Order and routine", "Speed", "Noise"],
        answer: 0,
        fact:
          "The Abbey worked because everything followed structure and routine.",
        rebuild: 2,
        reward: { coins: 24, xp: 14 },
      },
      {
        title: "Work and Life",
        desc: "What would monks likely be doing here each day?",
        storyCategory: "people",
        story:
          "These paths were not just for prayer.\nThey carried workers, supplies… and daily life.",
        options: ["Farming and labour", "Fighting", "Public trading"],
        answer: 0,
        fact:
          "Work and worship were connected here. The Abbey was lived, not just visited.",
        clue: {
          value: "4",
          importance: "low",
          saveLabel: "Work and Worship = 4",
        },
        rebuild: 3,
        reward: { coins: 28, xp: 16 },
      },
      {
        title: "The Purpose",
        desc: "What were these routes truly protecting?",
        storyCategory: "loss",
        story:
          "The hidden paths were not built to hide.\nThey were built to protect what mattered.",
        options: ["Knowledge and structure", "Food", "Money"],
        answer: 0,
        fact: "You are beginning to see the Abbey as it once was.",
        clue: {
          value: "6",
          importance: "high",
          saveLabel: "Protected Knowledge = 6",
        },
        rebuild: 5,
        reward: { coins: 36, xp: 22 },
        routeComplete: true,
      },
    ],
  },

  explore: {
    id: "explore",
    title: "Explore the Outer Grounds",
    intro:
      "Some truths are found by looking, walking, and noticing what others pass by.",
    steps: [
      {
        title: "Outer Ground Marker",
        desc: "What kind of place does this feel like?",
        storyCategory: "place",
        story:
          "The outer grounds gave first impressions.\nWhat you notice here shapes what comes next.",
        options: ["Open historic space", "Busy market", "Modern street"],
        answer: 0,
        fact: "You’ve marked the first outer landmark.",
        rebuild: 1,
        reward: { coins: 18, xp: 10 },
      },
      {
        title: "Walking the Edge",
        desc: "What matters most when exploring a place like this?",
        storyCategory: "people",
        story:
          "The fastest walkers miss things.\nThe best explorers notice what remains.",
        options: ["Looking carefully", "Rushing", "Ignoring details"],
        answer: 0,
        fact: "Exploration reveals what the eye almost misses.",
        clue: {
          value: "3",
          importance: "low",
          saveLabel: "Outer Edge = 3",
        },
        rebuild: 2,
        reward: { coins: 20, xp: 12 },
      },
      {
        title: "A Place Revealed",
        desc: "What gives this place its meaning?",
        storyCategory: "restoration",
        story:
          "The Abbey is more than stone.\nIt is memory, place, and what people carried into it.",
        options: ["Its history and people", "Its speed", "Its noise"],
        answer: 0,
        fact: "You’ve restored part of the Abbey’s outer story.",
        rebuild: 3,
        reward: { coins: 24, xp: 14 },
        routeComplete: true,
      },
    ],
  },

  advance: {
    id: "advance",
    title: "Advance Toward the Core",
    intro:
      "You’ve followed the outer paths. Now you step closer to the heart of the Abbey.",
    steps: [
      {
        title: "Path Forward",
        desc: "To move forward… you need to prove you understand the Abbey.",
        storyCategory: "purpose",
        story:
          "You’ve followed the outer paths.\nNow you step closer to the heart of the Abbey.",
        options: [
          "Military defence",
          "Worship, work, and community",
          "Trade hub",
        ],
        answer: 1,
        fact: "Path forward unlocked.",
        rebuild: 2,
        reward: { coins: 24, xp: 14 },
      },
      {
        title: "Closer to the Core",
        desc: "What kept the Abbey running every day?",
        storyCategory: "people",
        story:
          "You’re close now.\nThis is where the Abbey’s structure became most important.",
        options: ["Random activity", "Strict routine and order", "External trade"],
        answer: 1,
        fact: "You understand how the Abbey functioned.",
        rebuild: 2,
        reward: { coins: 28, xp: 16 },
      },
      {
        title: "Pre-Core Pressure",
        desc: "Answer quickly. What was the Abbey built to protect?",
        storyCategory: "loss",
        story:
          "You’re almost there.\nThis is where mistakes mattered.",
        options: ["Wealth", "Knowledge and belief", "Soldiers"],
        answer: 1,
        followUp: {
          desc: "And what kept it stable?",
          options: ["Strict order", "Freedom", "Trade"],
          answer: 0,
        },
        fact: "The Abbey core is now within reach.",
        clue: {
          value: "8",
          importance: "high",
          saveLabel: "Core Pressure = 8",
        },
        rebuild: 4,
        reward: { coins: 34, xp: 20 },
        routeComplete: true,
      },
    ],
  },

  core: {
    id: "core",
    title: "The Lost Order Core",
    intro:
      "You’ve reached it. The heart of the Abbey. Everything you’ve followed led you here.",
    steps: [
      {
        title: "The Heart of the Abbey",
        desc: "What was the true purpose of the Abbey?",
        storyCategory: "restoration",
        story:
          "You’ve reached it…\nThe heart of the Abbey.\nEverything you’ve followed… every path… every clue… led you here.",
        options: ["Power", "Wealth", "Faith, structure, and way of life"],
        answer: 2,
        fact:
          "You understand. The Abbey was held together by faith, order, labour, and shared purpose.",
        rebuild: 10,
        reward: { coins: 150, xp: 100 },
        clue: {
          value: "CORE",
          importance: "high",
          saveLabel: "Heart of the Abbey = CORE",
        },
        routeComplete: true,
        coreComplete: true,
      },
    ],
  },
};

/* ============================
   GLOBAL STATE / RUNTIME
============================ */
let state = loadState();

let map = null;
let heroMarker = null;
let activeMarkers = {};
let currentPin = null;
let currentTask = null;
let nightVisionOn = false;
let locationWatchId = null;
let arStream = null;

const CHARACTER_ICONS = {
  hero_duo: "🧭",
  ninja: "🥷",
  wizard: "🧙",
  robot: "🤖",
  pirate: "🏴‍☠️",
  monk: "monk.jpg",
  khylan: "khylan.jpg",
  piper: "piper.jpg",
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
   SPEECH / NARRATOR
============================ */
let speechEnabled = true;
let speechVoice = null;

function getAvailableSpeechVoices() {
  try {
    return window.speechSynthesis?.getVoices?.() || [];
  } catch {
    return [];
  }
}

function populateVoiceSelect() {
  const select = $("voice-select");
  if (!select) return;

  const voices = getAvailableSpeechVoices();
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Default system voice";
  select.appendChild(defaultOption);

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    select.appendChild(option);
  });

  select.value = String(state?.settings?.voiceName || "").trim();
}

function loadVoices() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  speechVoice =
    voices.find((v) => /en-GB/i.test(v.lang)) ||
    voices.find((v) => /en/i.test(v.lang)) ||
    voices[0] ||
    null;

  populateVoiceSelect();
}

function stopSpeech() {
  try {
    window.speechSynthesis?.cancel();
  } catch {}
}

function speakText(text, interrupt = true) {
  if (!speechEnabled || !("speechSynthesis" in window) || !text) return;

  try {
    if (interrupt) stopSpeech();

    const utter = new SpeechSynthesisUtterance(String(text));
    utter.pitch = Number(state?.settings?.voicePitch || 1);
    utter.rate = Number(state?.settings?.voiceRate || 1);
    utter.volume = Math.max(
      0,
      Math.min(1, Number(state?.settings?.sfxVol || 80) / 100)
    );

    const selectedVoiceName = String(state?.settings?.voiceName || "").trim();
    let chosenVoice = null;

    if (selectedVoiceName) {
      const voices = getAvailableSpeechVoices();
      chosenVoice =
        voices.find((v) => v.name === selectedVoiceName) ||
        voices.find((v) => v.voiceURI === selectedVoiceName) ||
        null;
    }

    if (!chosenVoice && speechVoice) {
      chosenVoice = speechVoice;
    }

    if (chosenVoice) utter.voice = chosenVoice;

    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.warn("Speech failed:", err);
  }
}

function speakOptions(options = []) {
  if (!Array.isArray(options) || !options.length) return;
  const lines = options.map((opt, i) => `Option ${i + 1}. ${opt}`);
  speakText(lines.join(". "));
}

/* ============================
   LOAD / NORMALISE STATE
============================ */
function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);

    const parsed = JSON.parse(raw);
    const migrated = migrateSave(parsed);
    return normaliseLoadedState(migrated);
  } catch (err) {
    console.warn("LOAD FAILED, USING DEFAULT:", err);
    return structuredClone(DEFAULT_STATE);
  }
}

function normaliseLoadedState(s) {
  const base = structuredClone(DEFAULT_STATE);
  const merged = { ...base, ...s };

  merged.players = Array.isArray(s?.players)
    ? s.players.map((p, i) => ({
        ...base.players[i],
        ...p,
      }))
    : base.players;

  merged.settings = {
    ...base.settings,
    ...(s?.settings || {}),
  };

  if (!merged.settings.voiceName) merged.settings.voiceName = "";

  merged.meta = {
    ...base.meta,
    ...(s?.meta || {}),
  };

  merged.pinStats = {
    ...base.pinStats,
    ...(s?.pinStats || {}),
  };

  merged.quizProfiles = {
    kid: normaliseAdaptiveProfile(s?.quizProfiles?.kid || base.quizProfiles.kid),
    teen: normaliseAdaptiveProfile(s?.quizProfiles?.teen || base.quizProfiles.teen),
    adult: normaliseAdaptiveProfile(s?.quizProfiles?.adult || base.quizProfiles.adult),
  };

  return merged;
}

function buildSavePayload() {
  return {
    ...state,
    storage: computeStorageHealth(),
  };
}

/* ============================
   BASIC HELPERS
============================ */
function getActivePlayer() {
  return state.players.find((p) => p.id === state.activePlayerId);
}

function addCoins(amount) {
  const player = getActivePlayer();
  if (!player) return;
  player.coins = Math.max(0, (player.coins || 0) + amount);
  updateTopBar();
  queueSaveState();
}

function addXP(amount) {
  state.meta.xp = Math.max(0, (state.meta.xp || 0) + amount);
  updateTopBar();
  queueSaveState();
}

function addToken(amount = 1) {
  state.meta.tokens = Math.max(0, (state.meta.tokens || 0) + amount);
  updateTopBar();
  queueSaveState();
}

function updateTopBar() {
  if ($("top-xp")) $("top-xp").textContent = state.meta.xp || 0;

  const player = getActivePlayer();
  if ($("top-coins")) $("top-coins").textContent = player?.coins || 0;

  if ($("top-tokens")) $("top-tokens").textContent = state.meta.tokens || 0;
}

/* ============================
   MAP SYSTEM
============================ */
function initMap() {
  map = L.map("map", {
    zoomControl: false,
  }).setView([54.110, -3.227], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  spawnPins();
}

function spawnPins() {
  Object.values(activeMarkers).forEach((m) => m.remove());
  activeMarkers = {};

  const pins = state.activePack === "adult" ? ADULT_PINS : PINS;

  pins.forEach((pin) => {
    const marker = L.marker([pin.lat, pin.lng]).addTo(map);

    marker.on("click", () => {
      currentPin = pin;
      openQuestModal(pin);
    });

    activeMarkers[pin.id] = marker;
  });
}

function updateHeroPosition(lat, lng) {
  if (!map) return;

  if (!heroMarker) {
    heroMarker = L.marker([lat, lng]).addTo(map);
  } else {
    heroMarker.setLatLng([lat, lng]);
  }
}

function startLocationTracking() {
  if (!("geolocation" in navigator)) return;

  locationWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      updateHeroPosition(latitude, longitude);
    },
    (err) => console.warn("GPS ERROR:", err),
    { enableHighAccuracy: true }
  );
}

/* ============================
   QUEST / PIN SYSTEM
============================ */
function openQuestModal(pin) {
  if (!pin) return;

  $("q-name").textContent = pin.name || "ZONE";
  $("quest-status").textContent = buildPinStatus(pin);

  $("quest-modal").style.display = "block";

  speakText(getPinStartIntro(pin.id) || "New location discovered.");
}

function buildPinStatus(pin) {
  const completed = state.completedPins[pin.id];
  if (completed) return "STATUS: COMPLETED";
  return "STATUS: ACTIVE";
}

/* ============================
   TASK SYSTEM
============================ */
function openTask(mode) {
  if (!currentPin) return;

  const qa = getQA(currentPin.id, mode, state.tierMode);
  if (!qa) return;

  currentTask = qa;

  $("task-title").textContent = qa.title || "MISSION";
  $("task-desc").textContent = qa.question || "";

  const optionsWrap = $("task-options");
  optionsWrap.innerHTML = "";

  if (qa.options && qa.options.length) {
    qa.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "win-btn";
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(i);
      optionsWrap.appendChild(btn);
    });
  }

  $("task-modal").style.display = "block";

  speakText(qa.question);
}

function handleAnswer(index) {
  if (!currentTask) return;

  const correct = index === currentTask.answer;

  const feedback = $("task-feedback");
  feedback.style.display = "block";

  if (correct) {
    feedback.textContent = "Correct";
    addCoins(currentTask.reward?.coins || 10);
    addXP(currentTask.reward?.xp || 5);

    completePin(currentPin.id);
  } else {
    feedback.textContent = "Try again";
  }

  queueSaveState();
}

function completePin(pinId) {
  if (!pinId) return;

  if (!state.completedPins[pinId]) {
    state.completedPins[pinId] = true;
    state.pinStats.totalCompleted++;
    state.pinStats.totalFirstCompletions++;

    checkBadges();
  } else {
    state.pinStats.totalRepeatCompletions++;
  }

  queueSaveState();
}

function checkBadges() {
  const total = state.pinStats.totalCompleted;

  BADGE_MILESTONES.forEach((b) => {
    if (total >= b.captures && !state.meta.badges.includes(b.name)) {
      state.meta.badges.push(b.name);
      showBadgePopup(b);
    }
  });
}

function showBadgePopup(badge) {
  $("badge-title").textContent = "BADGE UNLOCKED";
  $("badge-text").textContent = badge.name;
  $("badge-icon").textContent = badge.icon;

  $("badge-popup").classList.remove("hidden");

  setTimeout(() => {
    $("badge-popup").classList.add("hidden");
  }, 2500);
}

/* ============================
   HOME / SHOP / NOTES
============================ */
function renderHomeSummary() {
  if ($("home-summary")) {
    $("home-summary").innerHTML = `
      <div><strong>XP:</strong> ${state.meta.xp || 0}</div>
      <div><strong>TOKENS:</strong> ${state.meta.tokens || 0}</div>
      <div><strong>BADGES:</strong> ${(state.meta.badges || []).length}</div>
      <div><strong>COMPLETED:</strong> ${state.pinStats?.totalCompleted || 0}</div>
      <div><strong>FIRST CAPTURES:</strong> ${state.pinStats?.totalFirstCompletions || 0}</div>
      <div><strong>REPEATS:</strong> ${state.pinStats?.totalRepeatCompletions || 0}</div>
    `;
  }

  if ($("home-list")) {
    const completed = Object.keys(state.completedPins || {});
    $("home-list").innerHTML = completed.length
      ? completed.map((id) => `<div>✅ ${id}</div>`).join("")
      : `<div>No completed pins yet.</div>`;
  }
}

function renderShop() {
  if (!$("shop-summary")) return;
  const player = getActivePlayer();

  $("shop-summary").innerHTML = `
    <div><strong>PLAYER:</strong> ${player?.name || "Player 1"}</div>
    <div><strong>COINS:</strong> ${player?.coins || 0}</div>
    <div><strong>XP:</strong> ${state.meta.xp || 0}</div>
    <div><strong>TOKENS:</strong> ${state.meta.tokens || 0}</div>
  `;

  if ($("shop-list")) {
    $("shop-list").innerHTML = SHOP_ITEMS.map(
      (item) => `
        <div class="shop-item">
          <div><strong>${item.name}</strong></div>
          <div>${item.desc}</div>
          <div style="margin-top:8px;">${item.cost} coins</div>
          <button class="win-btn" onclick="buyItem('${item.id}')">BUY</button>
        </div>
      `
    ).join("");
  }

  if ($("shop-inventory")) {
    const entries = Object.entries(state.inventory || {});
    $("shop-inventory").innerHTML = entries.length
      ? entries.map(([id, qty]) => `<div>${id} × ${qty}</div>`).join("")
      : `<div>No items owned yet.</div>`;
  }
}

window.buyItem = function (itemId) {
  const item = SHOP_ITEMS.find((x) => x.id === itemId);
  const player = getActivePlayer();
  if (!item || !player) return;

  if ((player.coins || 0) < item.cost) {
    alert("Not enough coins.");
    speakText("Not enough coins.");
    return;
  }

  player.coins -= item.cost;
  state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;
  state.purchasedItems = Array.from(
    new Set([...(state.purchasedItems || []), item.id])
  );

  updateTopBar();
  renderShop();
  queueSaveState();

  speakText(`${item.name} purchased.`);
};

function renderCaptainNotes() {
  const wrap = $("captain-notes-list");
  if (!wrap) return;

  const notes = Array.isArray(state.captainNotes) ? state.captainNotes : [];
  wrap.innerHTML = notes.length
    ? notes
        .map(
          (note, i) => `
          <div class="case-block">
            <div class="case-label">NOTE ${i + 1}</div>
            <div class="case-body">${escapeHtml(note.text || "")}</div>
          </div>
        `
        )
        .join("")
    : `<div class="case-body">No notes yet.</div>`;
}

function saveCaptainNote(text) {
  const clean = String(text || "").trim();
  if (!clean) return;

  if (!Array.isArray(state.captainNotes)) state.captainNotes = [];
  state.captainNotes.unshift({
    text: clean,
    createdAt: new Date().toISOString(),
  });

  state.captainNotes = state.captainNotes.slice(0, 100);
  renderCaptainNotes();
  queueSaveState();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ============================
   SETTINGS UI
============================ */
function applySettingsToUI() {
  if ($("radius-label")) $("radius-label").textContent = state.settings.radius;
  if ($("pitch-label")) $("pitch-label").textContent = state.settings.voicePitch;
  if ($("rate-label")) $("rate-label").textContent = state.settings.voiceRate;
  if ($("sfx-label")) $("sfx-label").textContent = state.settings.sfxVol;
  if ($("zoomui-label")) {
    $("zoomui-label").textContent = state.settings.zoomUI ? "ON" : "OFF";
  }

  if ($("enter-radius")) $("enter-radius").value = state.settings.radius;
  if ($("v-pitch")) $("v-pitch").value = state.settings.voicePitch;
  if ($("v-rate")) $("v-rate").value = state.settings.voiceRate;
  if ($("sfx-vol")) $("sfx-vol").value = state.settings.sfxVol;
  if ($("char-select")) $("char-select").value = state.settings.character;
  if ($("tier-mode")) $("tier-mode").value = state.tierMode || "kid";
  if ($("voice-select")) $("voice-select").value = state.settings.voiceName || "";
}

function applyTierPills() {
  $("pill-kids")?.classList.toggle("active", state.tierMode === "kid");
  $("pill-teen")?.classList.toggle("active", state.tierMode === "teen");
}

function applyMapPills() {
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
}

function refreshAdultLockUI() {
  const locked = !state.adultLock?.unlocked;

  if ($("pill-truecrime")) {
    $("pill-truecrime").textContent = locked ? "🔒 TRUE CRIME" : "TRUE CRIME";
  }
  if ($("pill-conspiracy")) {
    $("pill-conspiracy").textContent = locked ? "🔒 CONSPIRACY" : "CONSPIRACY";
  }
  if ($("pill-history")) {
    $("pill-history").textContent = locked ? "🔒 HISTORY" : "HISTORY";
  }

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

function renderEverything() {
  updateTopBar();
  renderHomeSummary();
  renderShop();
  renderCaptainNotes();
  applySettingsToUI();
  applyTierPills();
  applyMapPills();
  refreshAdultLockUI();
}

/* ============================
   ADULT LOCK
============================ */
function isValidParentPin(pin) {
  return /^\d{4}$/.test(String(pin || "").trim());
}

function ensureAdultAccess() {
  const lock = state.adultLock || {};

  if (!lock.unlocked) {
    const first = prompt("Create a 4-digit parent PIN");
    if (first === null) return false;
    if (!isValidParentPin(first)) {
      alert("PIN must be exactly 4 digits.");
      return false;
    }

    const second = prompt("Re-enter the 4-digit PIN");
    if (second === null) return false;
    if (String(first).trim() !== String(second).trim()) {
      alert("PINs did not match.");
      return false;
    }

    state.adultLock = {
      ...state.adultLock,
      unlocked: true,
      pin: String(first).trim(),
      sessionApproved: true,
    };

    queueSaveState();
    refreshAdultLockUI();
    return true;
  }

  if (lock.sessionApproved) return true;

  const entered = prompt("Enter parent PIN for adult content");
  if (entered === null) return false;

  if (String(entered).trim() !== String(lock.pin || "")) {
    alert("Incorrect parent PIN.");
    return false;
  }

  state.adultLock.sessionApproved = true;
  queueSaveState();
  refreshAdultLockUI();
  return true;
}

function clearAdultSessionApproval() {
  if (!state.adultLock) return;
  state.adultLock.sessionApproved = false;
  queueSaveState();
}

function openAdultCategory(category) {
  if (!ensureAdultAccess()) return;

  state.activePack = "adult";
  state.activeAdultCategory = category;
  applyMapPills();
  refreshAdultLockUI();
  spawnPins();
  queueSaveState();
}

/* ============================
   MODALS
============================ */
function showModal(id) {
  const el = $(id);
  if (el) el.style.display = "block";
}

function closeModal(id) {
  const el = $(id);
  if (el) el.style.display = "none";
}

function closeAllModals() {
  [
    "start-modal",
    "commander-hub",
    "settings-modal",
    "quest-modal",
    "task-modal",
    "shop-modal",
    "home-modal",
    "ar-modal",
    "reward-image-modal",
  ].forEach(closeModal);
}

/* ============================
   REWARD IMAGE
============================ */
function showRewardImage(src = "", caption = "") {
  if ($("reward-image")) $("reward-image").src = src || "";
  if ($("reward-image-caption")) $("reward-image-caption").textContent = caption || "";
  showModal("reward-image-modal");
}

function closeRewardImageModal() {
  closeModal("reward-image-modal");
}

/* ============================
   AR
============================ */
async function openAR() {
  showModal("ar-modal");

  const video = $("ar-video");
  if (!video || !navigator.mediaDevices?.getUserMedia) return;

  try {
    arStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });

    video.srcObject = arStream;

    if ($("ar-readout")) {
      $("ar-readout").textContent = currentPin
        ? `Scanning around ${currentPin.name || currentPin.n || currentPin.id}`
        : "Scanning...";
    }
  } catch (err) {
    console.warn("AR camera failed:", err);
    if ($("ar-readout")) $("ar-readout").textContent = "Camera access failed.";
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
   EVENT WIRING
============================ */
function wireButtons() {
  $("btn-start")?.addEventListener("click", () => closeModal("start-modal"));
  $("btn-start-close")?.addEventListener("click", () => closeModal("start-modal"));
  $("btn-start-close-x")?.addEventListener("click", () => closeModal("start-modal"));

  $("btn-home")?.addEventListener("click", () => {
    closeAllModals();
    showModal("start-modal");
  });

  $("btn-commander")?.addEventListener("click", () => {
    renderHomeSummary();
    renderCaptainNotes();
    showModal("commander-hub");
  });

  $("btn-close-commander")?.addEventListener("click", () => closeModal("commander-hub"));
  $("btn-close-commander-x")?.addEventListener("click", () => closeModal("commander-hub"));

  $("btn-settings")?.addEventListener("click", () => showModal("settings-modal"));
  $("btn-open-settings")?.addEventListener("click", () => showModal("settings-modal"));
  $("btn-close-settings")?.addEventListener("click", () => closeModal("settings-modal"));
  $("btn-close-settings-x")?.addEventListener("click", () => closeModal("settings-modal"));

  $("btn-shop")?.addEventListener("click", () => {
    renderShop();
    showModal("shop-modal");
  });
  $("btn-shop-close")?.addEventListener("click", () => closeModal("shop-modal"));
  $("btn-shop-close-x")?.addEventListener("click", () => closeModal("shop-modal"));

  $("btn-home-close")?.addEventListener("click", () => closeModal("home-modal"));
  $("btn-home-close-x")?.addEventListener("click", () => closeModal("home-modal"));

  $("btn-close-quest")?.addEventListener("click", () => closeModal("quest-modal"));
  $("btn-task-close")?.addEventListener("click", () => closeModal("task-modal"));

  $("btn-reward-image-close")?.addEventListener("click", closeRewardImageModal);
  $("btn-reward-image-close-x")?.addEventListener("click", closeRewardImageModal);

  $("btn-ar-open")?.addEventListener("click", openAR);
  $("btn-ar-stop")?.addEventListener("click", stopAR);
  $("btn-ar-close")?.addEventListener("click", () => {
    stopAR();
    closeModal("ar-modal");
  });
  $("btn-ar-manual")?.addEventListener("click", () => {
    stopAR();
    closeModal("ar-modal");
    alert("Hotspot verified.");
    speakText("Hotspot verified.");
  });

  $("btn-send-broadcast")?.addEventListener("click", () => {
    const text = $("broadcast-input")?.value || "";
    if (!String(text).trim()) return;
    speakText(text);
  });

  $("btn-save-captain-note")?.addEventListener("click", () => {
    const text = $("captain-note-input")?.value || "";
    if (!String(text).trim()) return;
    saveCaptainNote(text);
    $("captain-note-input").value = "";
    speakText("Captain note saved.");
  });

  $("btn-test")?.addEventListener("click", () => {
    speakText("Systems are responding.");
    alert("Systems are responding.");
  });

  $("pill-kids")?.addEventListener("click", () => {
    state.tierMode = "kid";
    state.activePack = "classic";
    state.activeAdultCategory = null;
    clearAdultSessionApproval();
    renderEverything();
    spawnPins();
    queueSaveState();
  });

  $("pill-teen")?.addEventListener("click", () => {
    state.tierMode = "teen";
    renderEverything();
    queueSaveState();
  });

  $("pill-full")?.addEventListener("click", () => {
    state.activePack = "classic";
    state.activeAdultCategory = null;
    state.mapMode = "core";
    renderEverything();
    spawnPins();
    queueSaveState();
  });

  $("pill-park")?.addEventListener("click", () => {
    state.activePack = "classic";
    state.activeAdultCategory = null;
    state.mapMode = "park";
    renderEverything();
    spawnPins();
    queueSaveState();
  });

  $("pill-docks")?.addEventListener("click", () => {
    state.activePack = "classic";
    state.activeAdultCategory = null;
    state.mapMode = "abbey";
    renderEverything();
    spawnPins();
    queueSaveState();
  });

  $("pill-truecrime")?.addEventListener("click", () => openAdultCategory("true_crime"));
  $("pill-conspiracy")?.addEventListener("click", () => openAdultCategory("conspiracy"));
  $("pill-history")?.addEventListener("click", () => openAdultCategory("history"));

  $("adult-read-case")?.addEventListener("click", () => openTask("history"));
  $("adult-view-evidence")?.addEventListener("click", () => openTask("quiz"));
  $("adult-view-clue")?.addEventListener("click", () => openTask("logic"));
  $("adult-ar-verify")?.addEventListener("click", openAR);

  document.querySelectorAll(".m-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const mode = tile.dataset.mode;
      if (!mode) return;
      openTask(mode);
    });
  });

  $("enter-radius")?.addEventListener("input", (e) => {
    state.settings.radius = Number(e.target.value || 35);
    applySettingsToUI();
    queueSaveState();
  });

  $("v-pitch")?.addEventListener("input", (e) => {
    state.settings.voicePitch = Number(e.target.value || 1);
    applySettingsToUI();
    queueSaveState();
  });

  $("v-rate")?.addEventListener("input", (e) => {
    state.settings.voiceRate = Number(e.target.value || 1);
    applySettingsToUI();
    queueSaveState();
  });

  $("sfx-vol")?.addEventListener("input", (e) => {
    state.settings.sfxVol = Number(e.target.value || 80);
    applySettingsToUI();
    queueSaveState();
  });

  $("char-select")?.addEventListener("change", (e) => {
    state.settings.character = String(e.target.value || "hero_duo");
    applySettingsToUI();
    queueSaveState();
  });

  $("tier-mode")?.addEventListener("change", (e) => {
    state.tierMode = String(e.target.value || "kid");
    applySettingsToUI();
    applyTierPills();
    queueSaveState();
  });

  $("voice-select")?.addEventListener("change", (e) => {
    state.settings.voiceName = String(e.target.value || "");
    applySettingsToUI();
    queueSaveState();
    speakText("Voice updated.");
  });

  $("btn-zoom-ui")?.addEventListener("click", () => {
    state.settings.zoomUI = !state.settings.zoomUI;
    applySettingsToUI();
    queueSaveState();
  });

  window.addEventListener("beforeunload", () => {
    saveStateNow(true);
  });
}

/* ============================
   BOOT
============================ */
function boot() {
  renderEverything();
  wireButtons();
  loadVoices();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }

  initMap();
  startLocationTracking();
  updateTopBar();
}

window.addEventListener("DOMContentLoaded", boot);

/* ============================
   GLOBAL FALLBACKS
============================ */
window.openTask = openTask;
window.openQuestModal = openQuestModal;
window.closeModal = closeModal;
window.showModal = showModal;
