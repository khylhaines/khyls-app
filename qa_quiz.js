import { PINS } from "./pins.js";
import { MASTER_QUIZ_BANK } from "./qa_quiz.js";
import {
  RIDDLE_POOL,
  SPEED_POOL,
  BATTLE_POOL,
  FAMILY_POOL,
  ACTIVITY_POOL,
  ABBEY_GHOST_POOL,
  GENERIC_GHOST_POOL,
  DISCOVERY_PIN_CONTENT,
  GHOST_PIN_CONTENT,
  BOSS_PIN_CONTENT,
} from "./qa_groups.js";
import { HISTORY_MASTER_BANK } from "./qa_history.js";

/* =========================================================
   qa.js
   BARROW QUEST QA ROUTER
   SAFE SPLIT MAIN FILE
   - imports quiz/history/groups files
   - keeps app.js API unchanged
========================================================= */

function normaliseTier(tier = "kid") {
  return ["kid", "teen", "adult"].includes(tier) ? tier : "kid";
}

function seededIndex(length, salt = 0) {
  if (!length) return 0;
  const n = Math.abs(Number(salt) || 0);
  return n % length;
}

function pickOne(arr, salt = 0) {
  if (!Array.isArray(arr) || !arr.length) return null;
  return arr[seededIndex(arr.length, salt)];
}

function shuffleSeeded(arr, salt = 0) {
  const out = [...arr];
  let seed = Math.abs(Number(salt) || Date.now());

  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];

  for (const item of arr || []) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function combinePools(...pools) {
  return uniqBy(pools.flat().filter(Boolean), (item) => {
    if (typeof item === "string") return `str:${item}`;
    if (item?.id) return `id:${item.id}`;
    if (item?.q && Array.isArray(item?.options)) {
      return `mcq:${
        typeof item.q === "string" ? item.q : JSON.stringify(item.q)
      }`;
    }
    if (item?.q && item?.a) {
      return `riddle:${
        typeof item.q === "string" ? item.q : JSON.stringify(item.q)
      }|${item.a}`;
    }
    return JSON.stringify(item);
  });
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function getTieredText(value, tier = "kid") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return value[tier] || value.kid || Object.values(value)[0] || "";
  }
  return "";
}

function makeQuestionId(prefix, entry) {
  if (entry?.id) return String(entry.id);
  if (typeof entry === "string") return `${prefix}_${slugify(entry)}`;
  if (entry?.q && Array.isArray(entry?.options)) {
    const qText =
      typeof entry.q === "string" ? entry.q : getTieredText(entry.q, "kid");
    return `${prefix}_${slugify(qText)}`;
  }
  if (entry?.q && entry?.a) {
    const qText =
      typeof entry.q === "string" ? entry.q : getTieredText(entry.q, "kid");
    return `${prefix}_${slugify(qText)}_${slugify(entry.a)}`;
  }
  return `${prefix}_item`;
}

function attachIds(pool, prefix) {
  return (pool || []).map((item, idx) => {
    if (typeof item === "string") {
      return {
        _type: "prompt",
        id: makeQuestionId(`${prefix}_${idx}`, item),
        value: item,
      };
    }

    return {
      ...item,
      id: makeQuestionId(`${prefix}_${idx}`, item),
    };
  });
}

function makePromptTask(prompt, mode = "activity", id = "prompt_task") {
  return {
    id,
    q: prompt,
    options: ["DONE", "NOT YET", "SKIP", "UNSAFE"],
    answer: 0,
    fact: "",
    meta: { promptOnly: true, mode },
  };
}

function makeFallbackTask(message, meta = {}) {
  return {
    id: `fallback_${slugify(message) || "task"}`,
    q: message,
    options: ["DONE", "NOT YET", "SKIP", "UNSAFE"],
    answer: 0,
    fact: "",
    meta: { fallback: true, ...meta },
  };
}

/* =========================================================
   START INTROS
========================================================= */

export const PIN_START_INTROS = {
  home_base_marsh_st: {
    kid: "Home Base reached. This is where your Barrow Quest begins.",
    teen: "Home Base reached. This is your reset point before the map opens into bigger stories.",
    adult:
      "Home Base reached. This is your point of origin — where every route and decision begins.",
  },

  cenotaph_core: {
    kid: "The Cenotaph reached. This is a place to remember brave people and show respect.",
    teen: "The Cenotaph reached. This landmark is about memory, sacrifice, and respect.",
    adult:
      "The Cenotaph reached. You are entering a space of civic remembrance and collective memory.",
  },

  park_bandstand_core: {
    kid: "Park Bandstand reached. This is a fun place linked to music and performances.",
    teen: "Park Bandstand reached. This is a performance space and part of the park’s public life.",
    adult:
      "Park Bandstand reached. This pin marks a civic leisure structure built for gathering and performance.",
  },

  furness_abbey_core: {
    kid: "Furness Abbey reached. These old ruins are full of mystery and history.",
    teen: "Furness Abbey reached. This is one of the deepest history pins on the map.",
    adult:
      "Furness Abbey reached. You are entering one of the most historically charged sites in the region.",
  },

  town_hall_clock: {
    kid: "Town Hall Clock reached. This is one of the most important places in town.",
    teen: "Town Hall Clock reached. This landmark is part of the town’s civic heartbeat.",
    adult:
      "Town Hall Clock reached. You are standing at a civic time-marker and public symbol.",
  },

  dock_museum_anchor: {
    kid: "Dock Museum Anchor reached. This area is all about ships and Barrow’s dock history.",
    teen: "Dock Museum Anchor reached. This pin marks one of the strongest maritime identities on the map.",
    adult:
      "Dock Museum Anchor reached. You are stepping into Barrow’s maritime-industrial narrative.",
  },

  dock_museum_submarine: {
    kid: "Dock Museum Submarine reached. This is where Barrow’s ship story becomes huge.",
    teen: "Dock Museum Submarine reached. This landmark connects the town’s past and present through engineering.",
    adult:
      "Dock Museum Submarine reached. This is one of the clearest expressions of Barrow’s strategic-industrial identity.",
  },

  henry_schneider_statue: {
    kid: "Statue of Henry Schneider reached. This place remembers an important figure in Barrow’s history.",
    teen: "Statue of Henry Schneider reached. This is a landmark tied to people who helped Barrow grow.",
    adult:
      "Statue of Henry Schneider reached. This monument represents industrial change and public memory.",
  },

  james_ramsden_statue: {
    kid: "Statue of James Ramsden reached. This pin remembers one of the men linked to Barrow’s growth.",
    teen: "Statue of James Ramsden reached. This is one of the town’s memory-markers.",
    adult:
      "Statue of James Ramsden reached. This monument reflects leadership, ambition, and public memory.",
  },

  barrow_library: {
    kid: "Barrow Library reached. This is a place full of stories and facts.",
    teen: "Barrow Library reached. This pin is about knowledge, memory, and local culture.",
    adult:
      "Barrow Library reached. You are entering a civic archive of learning and memory.",
  },

  custom_house: {
    kid: "The Custom House reached. This building connects to trade and town history.",
    teen: "The Custom House reached. This pin is tied to movement, administration, and exchange.",
    adult:
      "The Custom House reached. This is a threshold building where trade and civic regulation meet.",
  },

  emlyn_hughes_statue: {
    kid: "Emlyn Hughes Statue reached. This pin celebrates a famous footballer from Barrow.",
    teen: "Emlyn Hughes Statue reached. This landmark shows how towns remember local people with wider fame.",
    adult:
      "Emlyn Hughes Statue reached. This monument reflects public memory through sport and civic pride.",
  },

  salthouse_mills: {
    kid: "Salthouse Mills reached. This is part of Barrow’s strong working history.",
    teen: "Salthouse Mills reached. This pin takes you into the industrial side of the map.",
    adult:
      "Salthouse Mills reached. This is an industrial memory-site shaped by labour and production.",
  },

  submarine_memorial: {
    kid: "Submarine Memorial reached. This place remembers people and work connected to the sea.",
    teen: "Submarine Memorial reached. This pin links memory with the town’s modern defence identity.",
    adult:
      "Submarine Memorial reached. This site binds remembrance to Barrow’s submarine legacy.",
  },

  walney_bridge_entrance: {
    kid: "Walney Bridge Entrance reached. This is the crossing point between Barrow and Walney.",
    teen: "Walney Bridge Entrance reached. This pin is about crossing, transition, and identity.",
    adult:
      "Walney Bridge Entrance reached. You are at a threshold structure where geography and identity meet.",
  },

  earnse_bay: {
    kid: "Earnse Bay reached. This is a big coastal place with sea air and wide views.",
    teen: "Earnse Bay reached. This pin opens the map outward into coast and horizon.",
    adult:
      "Earnse Bay reached. This is a landscape pin where weather, coast, and scale dominate.",
  },

  piel_castle: {
    kid: "Piel Castle reached. This island castle once helped protect the coast.",
    teen: "Piel Castle reached. This landmark feels separate for a reason — defence and the sea matter here.",
    adult:
      "Piel Castle reached. You are entering a defensive coastal site where isolation and strategy converge.",
  },

  roose_station_platform: {
    kid: "Roose Station Platform reached. Trains helped connect people and places.",
    teen: "Roose Station Platform reached. This pin is about movement and route networks.",
    adult:
      "Roose Station Platform reached. This site reflects transport infrastructure and everyday movement.",
  },
};

/* =========================================================
   EXACT PIN OVERRIDES
========================================================= */

export const QA_PIN_OVERRIDES = {
  home_base_marsh_st: {
    start: PIN_START_INTROS.home_base_marsh_st,
  },

  cenotaph_core: {
    start: PIN_START_INTROS.cenotaph_core,
  },

  park_bandstand_core: {
    start: PIN_START_INTROS.park_bandstand_core,
  },

  furness_abbey_core: {
    start: PIN_START_INTROS.furness_abbey_core,
  },

  town_hall_clock: {
    start: PIN_START_INTROS.town_hall_clock,
  },

  barrow_library: {
    start: PIN_START_INTROS.barrow_library,
  },

  james_ramsden_statue: {
    start: PIN_START_INTROS.james_ramsden_statue,
  },

  henry_schneider_statue: {
    start: PIN_START_INTROS.henry_schneider_statue,
  },

  custom_house: {
    start: PIN_START_INTROS.custom_house,
  },

  dock_museum_anchor: {
    start: PIN_START_INTROS.dock_museum_anchor,
  },

  dock_museum_submarine: {
    start: PIN_START_INTROS.dock_museum_submarine,
  },

  emlyn_hughes_statue: {
    start: PIN_START_INTROS.emlyn_hughes_statue,
  },

  salthouse_mills: {
    start: PIN_START_INTROS.salthouse_mills,
  },

  submarine_memorial: {
    start: PIN_START_INTROS.submarine_memorial,
  },

  walney_bridge_entrance: {
    start: PIN_START_INTROS.walney_bridge_entrance,
  },

  earnse_bay: {
    start: PIN_START_INTROS.earnse_bay,
  },

  piel_castle: {
    start: PIN_START_INTROS.piel_castle,
  },

  roose_station_platform: {
    start: PIN_START_INTROS.roose_station_platform,
  },
};

/* =========================================================
   ADAPTIVE SYSTEM
========================================================= */

const ADAPTIVE_TIER_DEFAULTS = {
  kid: { rating: 55, min: 1, max: 100 },
  teen: { rating: 150, min: 101, max: 200 },
  adult: { rating: 250, min: 201, max: 300 },
};

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function uniqueStrings(values = []) {
  return [...new Set((values || []).filter(Boolean).map((v) => String(v)))];
}

function getPinById(pinId) {
  if (!pinId || !Array.isArray(PINS)) return null;
  return PINS.find((p) => String(p.id) === String(pinId)) || null;
}

function getPinZone(pin) {
  return pin?.zone || pin?.set || "core";
}

function getPinGroup(pin) {
  return pin?.qaGroup || null;
}

function getRecentIds(input = {}) {
  const recent = input.recentQuestionIds || input.recentIds || [];
  return Array.isArray(recent) ? recent.map(String) : [];
}

function getRecentTags(input = {}) {
  const recent = input.recentQuestionTags || input.recentTags || [];
  return Array.isArray(recent) ? recent.map(String) : [];
}

function chooseEntryAvoidingRecent(pool, recentIds, salt = 0) {
  if (!pool.length) return null;

  const recentSet = new Set((recentIds || []).map(String));
  const filtered = pool.filter((item) => !recentSet.has(String(item.id)));

  if (filtered.length) return pickOne(filtered, salt);
  return pickOne(pool, salt);
}

export function getDefaultAdaptiveProfile(tier = "kid") {
  const safeTier = normaliseTier(tier);
  const base = ADAPTIVE_TIER_DEFAULTS[safeTier] || ADAPTIVE_TIER_DEFAULTS.kid;

  return {
    tier: safeTier,
    rating: base.rating,
    confidence: 0.5,
    streak: 0,
    correct: 0,
    wrong: 0,
    tagRatings: {},
    recentTags: [],
    recentQuestionIds: [],
  };
}

export function normaliseAdaptiveProfile(profile = {}, tier = "kid") {
  const safeTier = normaliseTier(tier);
  const base = getDefaultAdaptiveProfile(safeTier);

  return {
    ...base,
    ...(profile || {}),
    tier: safeTier,
    rating: clamp(
      profile?.rating ?? base.rating,
      ADAPTIVE_TIER_DEFAULTS[safeTier].min,
      ADAPTIVE_TIER_DEFAULTS[safeTier].max
    ),
    confidence: clamp(profile?.confidence ?? base.confidence, 0, 1),
    streak: Number.isFinite(Number(profile?.streak))
      ? Number(profile.streak)
      : 0,
    correct: Number.isFinite(Number(profile?.correct))
      ? Number(profile.correct)
      : 0,
    wrong: Number.isFinite(Number(profile?.wrong)) ? Number(profile.wrong) : 0,
    tagRatings:
      profile?.tagRatings && typeof profile.tagRatings === "object"
        ? { ...profile.tagRatings }
        : {},
    recentTags: Array.isArray(profile?.recentTags)
      ? profile.recentTags.map(String).slice(-12)
      : [],
    recentQuestionIds: Array.isArray(profile?.recentQuestionIds)
      ? profile.recentQuestionIds.map(String).slice(-24)
      : [],
  };
}

function getDefaultDifficultyForContext({
  tier = "kid",
  mode = "quiz",
  source = "none",
}) {
  const tierBase = tier === "kid" ? 55 : tier === "teen" ? 150 : 250;

  const modeOffset =
    mode === "quiz"
      ? 0
      : mode === "history"
      ? -8
      : mode === "logic"
      ? 6
      : mode === "boss"
      ? 12
      : mode === "discovery"
      ? -4
      : 0;

  const sourceOffset =
    source === "pin-exact"
      ? 8
      : String(source).startsWith("history-master")
      ? 5
      : String(source).startsWith("mode-pool")
      ? -6
      : 0;

  return tierBase + modeOffset + sourceOffset;
}

function deriveDifficulty(entry, context = {}) {
  if (Number.isFinite(Number(entry?.difficulty))) {
    return Number(entry.difficulty);
  }

  return getDefaultDifficultyForContext(context);
}

function deriveTags(entry, context = {}) {
  const tags = [];

  if (Array.isArray(entry?.tags)) tags.push(...entry.tags);
  if (context.mode) tags.push(context.mode);
  if (context.zone) tags.push(`zone:${context.zone}`);
  if (context.group) tags.push(`group:${context.group}`);
  if (context.pinId) tags.push(`pin:${context.pinId}`);
  if (context.source) tags.push(`source:${context.source}`);

  return uniqueStrings(tags);
}

function scoreEntryForAdaptivePick(entry, context = {}) {
  const profile = context.profile;
  const target = Number(
    profile.rating || getDefaultDifficultyForContext(context)
  );
  const difficulty = deriveDifficulty(entry, context);
  const tags = deriveTags(entry, context);
  const recentIds = new Set(getRecentIds(context.input));
  const recentTags = getRecentTags(context.input);
  const recentProfileTags = Array.isArray(profile.recentTags)
    ? profile.recentTags
    : [];
  const mergedRecentTags = [...recentTags, ...recentProfileTags].slice(-12);

  let score = Math.abs(difficulty - target);

  if (recentIds.has(String(entry.id))) score += 1000;

  const overlapCount = tags.filter((tag) =>
    mergedRecentTags.includes(tag)
  ).length;
  score += overlapCount * 9;

  const tagRatings = profile.tagRatings || {};
  const avgTagRating = tags.length
    ? tags.reduce((sum, tag) => sum + Number(tagRatings[tag] || 0), 0) /
      tags.length
    : 0;

  score -= avgTagRating * 1.5;

  const confidenceWindow =
    profile.confidence >= 0.75 ? 14 : profile.confidence >= 0.5 ? 20 : 28;

  const distanceOutsideWindow = Math.max(
    0,
    Math.abs(difficulty - target) - confidenceWindow
  );
  score += distanceOutsideWindow * 2.5;

  return {
    entry,
    score,
    difficulty,
    tags,
  };
}

function chooseAdaptiveEntry(pool, context = {}) {
  if (!Array.isArray(pool) || !pool.length) return null;

  const scored = pool
    .map((entry) => scoreEntryForAdaptivePick(entry, context))
    .sort((a, b) => a.score - b.score);

  const viable = scored.filter((item) => item.score < 1000);
  const shortlist = (viable.length ? viable : scored).slice(0, 5);
  if (!shortlist.length) return null;

  const pick = pickOne(shortlist, context.salt || 0) || shortlist[0];
  return {
    picked: pick.entry,
    difficulty: pick.difficulty,
    tags: pick.tags,
  };
}

export function updateAdaptiveProfile(profileInput = {}, result = {}) {
  const tier = normaliseTier(result?.tier || profileInput?.tier || "kid");
  const profile = normaliseAdaptiveProfile(profileInput, tier);
  const min = ADAPTIVE_TIER_DEFAULTS[tier].min;
  const max = ADAPTIVE_TIER_DEFAULTS[tier].max;

  const isCorrect = !!result.isCorrect;
  const questionDifficulty = Number.isFinite(Number(result?.difficulty))
    ? Number(result.difficulty)
    : profile.rating;

  const recentQuestionIds = [
    ...profile.recentQuestionIds,
    ...(result?.questionId ? [String(result.questionId)] : []),
  ].slice(-24);

  const recentTags = [
    ...profile.recentTags,
    ...(Array.isArray(result?.tags) ? result.tags : []).map(String),
  ].slice(-12);

  const diffDelta = questionDifficulty - profile.rating;
  const difficultyBonus = clamp(Math.round(diffDelta / 12), -4, 4);

  const ratingChange = isCorrect
    ? 7 + Math.max(0, difficultyBonus)
    : -6 + Math.min(0, difficultyBonus);

  const nextRating = clamp(profile.rating + ratingChange, min, max);

  const nextConfidence = clamp(
    profile.confidence + (isCorrect ? 0.06 : -0.05),
    0,
    1
  );

  const nextStreak = isCorrect ? profile.streak + 1 : 0;

  const nextTagRatings = { ...(profile.tagRatings || {}) };
  const tags = Array.isArray(result?.tags) ? result.tags.map(String) : [];
  tags.forEach((tag) => {
    const current = Number(nextTagRatings[tag] || 0);
    nextTagRatings[tag] = clamp(current + (isCorrect ? 1 : -1), -10, 10);
  });

  return {
    ...profile,
    tier,
    rating: nextRating,
    confidence: nextConfidence,
    streak: nextStreak,
    correct: profile.correct + (isCorrect ? 1 : 0),
    wrong: profile.wrong + (isCorrect ? 0 : 1),
    tagRatings: nextTagRatings,
    recentTags,
    recentQuestionIds,
  };
}

/* =========================================================
   RIDDLE / MODE BUILDERS
========================================================= */

const RIDDLE_FUNNY = {
  kid: [
    "A confused potato in a wizard hat",
    "Your dad’s lost TV remote",
    "A chicken wearing sunglasses",
    "A penguin driving a bus",
  ],
  teen: [
    "Your group chat at 2am",
    "A dramatic pigeon with attitude",
    "A seagull running a business",
    "Your mate after one hour of sleep",
  ],
  adult: [
    "That one drawer full of random cables",
    "Your sat-nav after a wrong turn",
    "A neighbour with strong opinions",
    "The weekly shop before payday",
  ],
};

const RIDDLE_CLOSE = {
  kid: ["A shadow", "A map", "A mirror", "A clock"],
  teen: ["An echo", "A sign", "A picture", "A tool"],
  adult: ["A symbol", "A signal", "A reflection", "A marker"],
};

const RIDDLE_VERY_CLOSE = {
  kid: ["A book", "A bottle", "A road", "A bell"],
  teen: ["A keypad", "A notebook", "A footprint", "A tower"],
  adult: ["A memory", "A pattern", "A route", "A record"],
};

function makeMcqFromRiddle(riddle, tier = "kid", salt = 0, forcedId = null) {
  if (!riddle?.q || !riddle?.a) {
    return makeFallbackTask("Broken riddle entry.", { mode: "logic" });
  }

  const correct = riddle.a;
  const funny = pickOne(RIDDLE_FUNNY[tier], salt + 11) || "A confused potato";
  const close = pickOne(RIDDLE_CLOSE[tier], salt + 22) || "A shadow";
  const veryClose = pickOne(RIDDLE_VERY_CLOSE[tier], salt + 33) || "A map";

  let options = [correct, veryClose, close, funny];
  options = [...new Set(options)];

  while (options.length < 4) {
    options.push(`Option ${options.length + 1}`);
  }

  const shuffled = shuffleSeeded(options, salt);
  const answer = shuffled.indexOf(correct);
  const riddleText = getTieredText(riddle.q, tier);

  return {
    id: forcedId || riddle.id || makeQuestionId("logic", riddle),
    q: riddleText,
    options: shuffled,
    answer,
    fact: riddle.a,
    meta: { type: "riddle", tier },
  };
}

/* =========================================================
   POOL RESOLUTION
========================================================= */

function getMasterQuizPoolForTier(tier = "kid") {
  return attachIds(MASTER_QUIZ_BANK?.[tier] || [], `master_quiz_${tier}`);
}

function getHistoryMasterPoolForTier(tier = "kid") {
  return attachIds(HISTORY_MASTER_BANK?.[tier] || [], `history_master_${tier}`);
}

function getExactPinOverride(pinId, mode, tier) {
  return (
    QA_PIN_OVERRIDES?.[pinId]?.[mode]?.[tier] ||
    QA_PIN_OVERRIDES?.[pinId]?.[mode]?.kid ||
    null
  );
}

function getModePool(mode, tier, pin = null) {
  if (mode === "logic") {
    return attachIds(RIDDLE_POOL, `logic_${tier}`);
  }

  if (mode === "activity") {
    return attachIds(
      combinePools(ACTIVITY_POOL[tier] || [], ACTIVITY_POOL.kid || []),
      `activity_${tier}`
    );
  }

  if (mode === "family") {
    return attachIds(
      combinePools(FAMILY_POOL[tier] || [], FAMILY_POOL.kid || []),
      `family_${tier}`
    );
  }

  if (mode === "speed") {
    return attachIds(
      combinePools(SPEED_POOL[tier] || [], SPEED_POOL.kid || []),
      `speed_${tier}`
    );
  }

  if (mode === "battle") {
    return attachIds(
      combinePools(BATTLE_POOL[tier] || [], BATTLE_POOL.kid || []),
      `battle_${tier}`
    );
  }

  if (mode === "ghost") {
    const abbeyLike =
      String(pin?.zone || "").toLowerCase() === "abbey" ||
      String(pin?.set || "").toLowerCase() === "abbey";

    const pool = abbeyLike
      ? combinePools(ABBEY_GHOST_POOL[tier] || [], ABBEY_GHOST_POOL.kid || [])
      : combinePools(
          GENERIC_GHOST_POOL[tier] || [],
          GENERIC_GHOST_POOL.kid || []
        );

    return attachIds(pool, `ghost_${tier}`);
  }

  return [];
}

function getPinSpecificPool(pinId, mode, tier) {
  if (mode === "discovery") {
    const pool =
      DISCOVERY_PIN_CONTENT?.[pinId]?.discovery?.[tier] ||
      DISCOVERY_PIN_CONTENT?.[pinId]?.discovery?.kid ||
      [];
    return attachIds(pool, `${pinId}_discovery_${tier}`);
  }

  if (mode === "ghost") {
    const pool =
      GHOST_PIN_CONTENT?.[pinId]?.ghost?.[tier] ||
      GHOST_PIN_CONTENT?.[pinId]?.ghost?.kid ||
      [];
    return attachIds(pool, `${pinId}_ghost_${tier}`);
  }

  if (mode === "boss") {
    const pool =
      BOSS_PIN_CONTENT?.[pinId]?.boss?.[tier] ||
      BOSS_PIN_CONTENT?.[pinId]?.boss?.kid ||
      [];
    return attachIds(pool, `${pinId}_boss_${tier}`);
  }

  return [];
}

function resolvePinStartIntro(pinId, tier = "kid") {
  return (
    QA_PIN_OVERRIDES?.[pinId]?.start?.[tier] ||
    QA_PIN_OVERRIDES?.[pinId]?.start?.kid ||
    PIN_START_INTROS?.[pinId]?.[tier] ||
    PIN_START_INTROS?.[pinId]?.kid ||
    ""
  );
}

function resolvePool({ pinId, pin, zone, group, mode, tier }) {
  const exactOverride = getExactPinOverride(pinId, mode, tier);
  if (Array.isArray(exactOverride) && exactOverride.length) {
    return {
      pool: attachIds(exactOverride, `${pinId}_${mode}_${tier}`),
      source: "pin-exact",
    };
  }

  const pinSpecificPool = getPinSpecificPool(pinId, mode, tier);
  if (pinSpecificPool.length) {
    return {
      pool: pinSpecificPool,
      source: "pin-specific",
    };
  }

  if (mode === "history") {
    const historyPool = getHistoryMasterPoolForTier(tier);
    if (historyPool.length) {
      return {
        pool: historyPool,
        source: "history-master",
      };
    }
  }

  if (mode === "quiz") {
    const quizPool = getMasterQuizPoolForTier(tier);
    if (quizPool.length) {
      return {
        pool: quizPool,
        source: "master-quiz",
      };
    }
  }

  const modePool = getModePool(mode, tier, pin);
  if (modePool.length) {
    return {
      pool: modePool,
      source: `mode-pool-${mode}`,
    };
  }

  return {
    pool: [],
    source: "none",
  };
}

/* =========================================================
   MAIN EXPORTS
========================================================= */

export function getPinStartIntro(pinId, tier = "kid") {
  return resolvePinStartIntro(pinId, normaliseTier(tier));
}

export function getQA(input = {}) {
  const pinId = input.pinId || null;
  const pin = getPinById(pinId);
  const zone = input.zone || getPinZone(pin);
  const group = getPinGroup(pin);
  const mode = input.mode || "quiz";
  const tier = normaliseTier(input.tier || "kid");
  const recentIds = getRecentIds(input);

  const rawSalt = Number(input.salt || Date.now());
  const stableSalt =
    rawSalt +
    String(pinId || "none").length * 97 +
    String(zone).length * 37 +
    String(mode).length * 19 +
    String(tier).length * 11 +
    String(group || "nogroup").length * 13;

  const resolved = resolvePool({
    pinId,
    pin,
    zone,
    group,
    mode,
    tier,
  });

  const pool = resolved.pool;
  const source = resolved.source;

  if (!pool.length) {
    return makeFallbackTask(
      `No ${mode} content found for ${pinId || zone} (${tier}).`,
      {
        pinId,
        zone,
        group,
        mode,
        tier,
        source,
      }
    );
  }

  const adaptiveProfile = normaliseAdaptiveProfile(
    input.adaptiveProfile || input.quizProfile || {},
    tier
  );

  let adaptivePick = null;
  if (mode === "quiz" || mode === "history") {
    adaptivePick = chooseAdaptiveEntry(pool, {
      profile: adaptiveProfile,
      input,
      tier,
      mode,
      zone,
      group,
      pinId,
      source,
      salt: stableSalt,
    });
  }

  const picked =
    adaptivePick?.picked ||
    chooseEntryAvoidingRecent(pool, recentIds, stableSalt);

  if (!picked) {
    return makeFallbackTask("No task could be chosen.", {
      pinId,
      zone,
      group,
      source,
      mode,
      tier,
    });
  }

  if (mode === "logic" && picked?.q && picked?.a) {
    const built = makeMcqFromRiddle(picked, tier, stableSalt, picked.id);
    built.meta = {
      ...(built.meta || {}),
      zone,
      group,
      pinId,
      source,
      mode,
      tier,
      questionId: built.id,
      difficulty: deriveDifficulty(picked, { tier, mode, source }),
      tags: deriveTags(picked, { tier, mode, source, zone, group, pinId }),
      adaptiveRating: adaptiveProfile.rating,
    };
    return built;
  }

  if (picked?.q && Array.isArray(picked?.options)) {
    const originalOptions = [...picked.options];
    const correctText = originalOptions[picked.answer];
    const shuffledOptions = shuffleSeeded(originalOptions, stableSalt + 123);
    const answer = shuffledOptions.indexOf(correctText);

    const qText = getTieredText(picked.q, tier);
    const factText = getTieredText(picked.fact, tier) || picked.fact || "";
    const difficulty =
      adaptivePick?.difficulty ??
      deriveDifficulty(picked, { tier, mode, source });
    const tags =
      adaptivePick?.tags ??
      deriveTags(picked, { tier, mode, source, zone, group, pinId });

    return {
      ...picked,
      q: qText,
      fact: factText,
      options: shuffledOptions,
      answer,
      meta: {
        ...(picked.meta || {}),
        zone,
        group,
        pinId,
        source,
        mode,
        tier,
        questionId: picked.id,
        difficulty,
        tags,
        adaptiveRating: adaptiveProfile.rating,
      },
    };
  }

  if (picked?._type === "prompt" && typeof picked.value === "string") {
    return {
      ...makePromptTask(picked.value, mode, picked.id),
      meta: {
        zone,
        group,
        pinId,
        source,
        mode,
        tier,
        promptOnly: true,
        questionId: picked.id,
        difficulty: deriveDifficulty(picked, { tier, mode, source }),
        tags: deriveTags(picked, { tier, mode, source, zone, group, pinId }),
        adaptiveRating: adaptiveProfile.rating,
      },
    };
  }

  if (typeof picked === "string") {
    return {
      ...makePromptTask(picked, mode),
      meta: {
        zone,
        group,
        pinId,
        source,
        mode,
        tier,
        promptOnly: true,
        questionId: makeQuestionId(
          `${zone}_${group || "nogroup"}_${mode}_${tier}`,
          picked
        ),
        difficulty: deriveDifficulty({ q: picked }, { tier, mode, source }),
        tags: deriveTags(
          { q: picked },
          { tier, mode, source, zone, group, pinId }
        ),
        adaptiveRating: adaptiveProfile.rating,
      },
    };
  }

  return makeFallbackTask("Task format not recognised.", {
    zone,
    group,
    pinId,
    source,
    mode,
    tier,
  });
}
