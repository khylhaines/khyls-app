import { PINS } from "./pins.js";

import * as QaQuiz from "./qa_quiz.js";
import * as QaHistory from "./qa_history.js";
import * as QaLogic from "./qa_logic.js";
import * as QaActivity from "./qa_activity.js";
import * as QaFamily from "./qa_family.js";
import * as QaGhost from "./qa_ghost.js";
import * as QaBoss from "./qa_boss.js";
import * as QaGroups from "./qa_groups.js";

/* =========================================================
   BARROW QUEST QA ENGINE
   FULL CLEAN REPLACEMENT
   - works with split QA files
   - exports required by apps.js
   - exact pin override priority
   - qaGroup support
   - adaptive quiz support
   - stable ids
========================================================= */

function normaliseTier(tier = "kid") {
  return ["kid", "teen", "adult"].includes(tier) ? tier : "kid";
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
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

function uniqueStrings(values = []) {
  return [...new Set((values || []).filter(Boolean).map((v) => String(v)))];
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

function makeQuestionId(prefix, entry) {
  if (entry?.id) return String(entry.id);

  if (typeof entry === "string") {
    return `${prefix}_${slugify(entry)}`;
  }

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

/* =========================================================
   IMPORTED BANKS / POOLS
========================================================= */

const MASTER_QUIZ_BANK = QaQuiz.MASTER_QUIZ_BANK || {
  kid: [],
  teen: [],
  adult: [],
};

const QA_HISTORY_BY_GROUP =
  QaHistory.QA_HISTORY_BY_GROUP ||
  QaHistory.QA_BY_GROUP ||
  QaHistory.HISTORY_BY_GROUP ||
  {};

const QA_QUIZ_BY_GROUP =
  QaQuiz.QA_QUIZ_BY_GROUP ||
  QaQuiz.QA_BY_GROUP ||
  QaQuiz.QUIZ_BY_GROUP ||
  {};

const QA_LOGIC_BY_GROUP =
  QaLogic.QA_LOGIC_BY_GROUP ||
  QaLogic.QA_BY_GROUP ||
  QaLogic.LOGIC_BY_GROUP ||
  {};

const QA_ACTIVITY_BY_GROUP =
  QaActivity.QA_ACTIVITY_BY_GROUP ||
  QaActivity.QA_BY_GROUP ||
  QaActivity.ACTIVITY_BY_GROUP ||
  {};

const QA_FAMILY_BY_GROUP =
  QaFamily.QA_FAMILY_BY_GROUP ||
  QaFamily.QA_BY_GROUP ||
  QaFamily.FAMILY_BY_GROUP ||
  {};

const QA_GHOST_BY_GROUP =
  QaGhost.QA_GHOST_BY_GROUP ||
  QaGhost.QA_BY_GROUP ||
  QaGhost.GHOST_BY_GROUP ||
  {};

const QA_BOSS_BY_GROUP =
  QaBoss.QA_BOSS_BY_GROUP ||
  QaBoss.QA_BY_GROUP ||
  QaBoss.BOSS_BY_GROUP ||
  {};

const PIN_START_INTROS =
  QaGroups.PIN_START_INTROS ||
  QaHistory.PIN_START_INTROS ||
  QaQuiz.PIN_START_INTROS ||
  {};

const QA_PIN_OVERRIDES = {
  ...(QaGroups.QA_PIN_OVERRIDES || {}),
  ...(QaQuiz.QA_PIN_OVERRIDES || {}),
  ...(QaHistory.QA_PIN_OVERRIDES || {}),
  ...(QaLogic.QA_PIN_OVERRIDES || {}),
  ...(QaActivity.QA_PIN_OVERRIDES || {}),
  ...(QaFamily.QA_PIN_OVERRIDES || {}),
  ...(QaGhost.QA_PIN_OVERRIDES || {}),
  ...(QaBoss.QA_PIN_OVERRIDES || {}),
};

const RIDDLE_POOL =
  QaLogic.RIDDLE_POOL ||
  QaGroups.RIDDLE_POOL ||
  [];

const ACTIVITY_POOL =
  QaActivity.ACTIVITY_POOL ||
  QaGroups.ACTIVITY_POOL ||
  { kid: [], teen: [], adult: [] };

const FAMILY_POOL =
  QaFamily.FAMILY_POOL ||
  QaGroups.FAMILY_POOL ||
  { kid: [], teen: [], adult: [] };

const SPEED_POOL =
  QaActivity.SPEED_POOL ||
  QaGroups.SPEED_POOL ||
  { kid: [], teen: [], adult: [] };

const BATTLE_POOL =
  QaActivity.BATTLE_POOL ||
  QaGroups.BATTLE_POOL ||
  { kid: [], teen: [], adult: [] };

const GENERIC_GHOST_POOL =
  QaGhost.GENERIC_GHOST_POOL ||
  QaGroups.GENERIC_GHOST_POOL ||
  { kid: [], teen: [], adult: [] };

const ABBEY_GHOST_POOL =
  QaGhost.ABBEY_GHOST_POOL ||
  QaGroups.ABBEY_GHOST_POOL ||
  { kid: [], teen: [], adult: [] };

const DISCOVERY_PIN_CONTENT =
  QaActivity.DISCOVERY_PIN_CONTENT ||
  QaGroups.DISCOVERY_PIN_CONTENT ||
  {};

const GHOST_PIN_CONTENT =
  QaGhost.GHOST_PIN_CONTENT ||
  QaGroups.GHOST_PIN_CONTENT ||
  {};

const BOSS_PIN_CONTENT =
  QaBoss.BOSS_PIN_CONTENT ||
  QaGroups.BOSS_PIN_CONTENT ||
  {};

/* =========================================================
   RIDDLE BUILDERS
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
   ADAPTIVE SYSTEM
========================================================= */

const ADAPTIVE_TIER_DEFAULTS = {
  kid: { rating: 55, min: 1, max: 100 },
  teen: { rating: 150, min: 101, max: 200 },
  adult: { rating: 250, min: 201, max: 300 },
};

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
    wrong: Number.isFinite(Number(profile?.wrong))
      ? Number(profile.wrong)
      : 0,
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
      : String(source).startsWith("group-")
      ? 4
      : String(source).startsWith("zone-fun-")
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

  if (context.mode === "quiz") {
    if (String(context.source).includes("group-")) tags.push("local");
    if (String(context.zone).includes("abbey")) tags.push("history");
    if (String(context.zone).includes("park")) tags.push("park");
    if (String(context.zone).includes("core")) tags.push("core");
  }

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
   RESOLUTION HELPERS
========================================================= */

function getExactPinOverride(pinId, mode, tier) {
  return (
    QA_PIN_OVERRIDES?.[pinId]?.[mode]?.[tier] ||
    QA_PIN_OVERRIDES?.[pinId]?.[mode]?.kid ||
    null
  );
}

function getGroupModeBank(mode) {
  if (mode === "quiz") return QA_QUIZ_BY_GROUP;
  if (mode === "history") return QA_HISTORY_BY_GROUP;
  if (mode === "logic") return QA_LOGIC_BY_GROUP;
  if (mode === "activity") return QA_ACTIVITY_BY_GROUP;
  if (mode === "family") return QA_FAMILY_BY_GROUP;
  if (mode === "ghost") return QA_GHOST_BY_GROUP;
  if (mode === "boss") return QA_BOSS_BY_GROUP;
  return {};
}

function getGroupPool(group, mode, tier) {
  if (!group) return [];

  if (mode === "logic") {
    const logicBank = getGroupModeBank("logic");
    const exactLogic =
      logicBank?.[group]?.logic?.[tier] ||
      logicBank?.[group]?.[tier] ||
      [];
    if (Array.isArray(exactLogic) && exactLogic.length) {
      return attachIds(exactLogic, `${group}_logic_${tier}`);
    }
    return attachIds(RIDDLE_POOL, `${group}_logic_${tier}`);
  }

  if (mode === "activity") {
    const exact =
      QA_ACTIVITY_BY_GROUP?.[group]?.activity?.[tier] ||
      QA_ACTIVITY_BY_GROUP?.[group]?.[tier] ||
      [];
    const fallback = combinePools(exact, ACTIVITY_POOL[tier] || [], ACTIVITY_POOL.kid || []);
    return attachIds(fallback, `${group}_activity_${tier}`);
  }

  if (mode === "family") {
    const exact =
      QA_FAMILY_BY_GROUP?.[group]?.family?.[tier] ||
      QA_FAMILY_BY_GROUP?.[group]?.[tier] ||
      [];
    const fallback = combinePools(exact, FAMILY_POOL[tier] || [], FAMILY_POOL.kid || []);
    return attachIds(fallback, `${group}_family_${tier}`);
  }

  if (mode === "speed") {
    return attachIds(
      combinePools(SPEED_POOL[tier] || [], SPEED_POOL.kid || []),
      `${group}_speed_${tier}`
    );
  }

  if (mode === "battle") {
    return attachIds(
      combinePools(BATTLE_POOL[tier] || [], BATTLE_POOL.kid || []),
      `${group}_battle_${tier}`
    );
  }

  const bank = getGroupModeBank(mode);
  const exact =
    bank?.[group]?.[mode]?.[tier] ||
    bank?.[group]?.[tier] ||
    [];
  const kidFallback = tier !== "kid"
    ? bank?.[group]?.[mode]?.kid || bank?.[group]?.kid || []
    : [];

  return attachIds(
    combinePools(exact, kidFallback),
    `${group}_${mode}_${tier}`
  );
}

function getZoneFunPool(zone, mode, tier) {
  if (mode === "logic") {
    return attachIds(RIDDLE_POOL, `${zone}_logic_${tier}`);
  }

  if (mode === "activity") {
    return attachIds(
      combinePools(ACTIVITY_POOL[tier] || [], ACTIVITY_POOL.kid || []),
      `${zone}_activity_${tier}`
    );
  }

  if (mode === "family") {
    return attachIds(
      combinePools(FAMILY_POOL[tier] || [], FAMILY_POOL.kid || []),
      `${zone}_family_${tier}`
    );
  }

  if (mode === "speed") {
    return attachIds(
      combinePools(SPEED_POOL[tier] || [], SPEED_POOL.kid || []),
      `${zone}_speed_${tier}`
    );
  }

  if (mode === "battle") {
    return attachIds(
      combinePools(BATTLE_POOL[tier] || [], BATTLE_POOL.kid || []),
      `${zone}_battle_${tier}`
    );
  }

  if (mode === "ghost") {
    const pool = zone === "abbey" ? ABBEY_GHOST_POOL : GENERIC_GHOST_POOL;
    return attachIds(
      combinePools(pool[tier] || [], pool.kid || []),
      `${zone}_ghost_${tier}`
    );
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

  if (mode === "discovery") {
    const discoveryOverride =
      DISCOVERY_PIN_CONTENT?.[pinId]?.discovery?.[tier] ||
      DISCOVERY_PIN_CONTENT?.[pinId]?.discovery?.kid ||
      QA_PIN_OVERRIDES?.[pinId]?.discovery?.[tier] ||
      QA_PIN_OVERRIDES?.[pinId]?.discovery?.kid ||
      [];

    if (Array.isArray(discoveryOverride) && discoveryOverride.length) {
      return {
        pool: attachIds(discoveryOverride, `${pinId}_discovery_${tier}`),
        source: "pin-discovery",
      };
    }
  }

  if (mode === "ghost") {
    const ghostOverride =
      GHOST_PIN_CONTENT?.[pinId]?.ghost?.[tier] ||
      GHOST_PIN_CONTENT?.[pinId]?.ghost?.kid ||
      QA_PIN_OVERRIDES?.[pinId]?.ghost?.[tier] ||
      QA_PIN_OVERRIDES?.[pinId]?.ghost?.kid ||
      [];

    if (Array.isArray(ghostOverride) && ghostOverride.length) {
      return {
        pool: attachIds(ghostOverride, `${pinId}_ghost_${tier}`),
        source: "pin-ghost",
      };
    }
  }

  if (mode === "boss") {
    const bossOverride =
      BOSS_PIN_CONTENT?.[pinId]?.boss?.[tier] ||
      BOSS_PIN_CONTENT?.[pinId]?.boss?.kid ||
      QA_PIN_OVERRIDES?.[pinId]?.boss?.[tier] ||
      QA_PIN_OVERRIDES?.[pinId]?.boss?.kid ||
      [];

    if (Array.isArray(bossOverride) && bossOverride.length) {
      return {
        pool: attachIds(bossOverride, `${pinId}_boss_${tier}`),
        source: "pin-boss",
      };
    }
  }

  const groupPool = getGroupPool(group, mode, tier);
  if (groupPool.length) {
    return {
      pool: groupPool,
      source: `group-${group}`,
    };
  }

  const zoneFunPool = getZoneFunPool(zone, mode, tier);
  if (zoneFunPool.length) {
    return {
      pool: zoneFunPool,
      source: `zone-fun-${zone}`,
    };
  }

  return {
    pool: [],
    source: "none",
  };
}

function getMasterQuizPoolForTier(tier = "kid") {
  return attachIds(MASTER_QUIZ_BANK?.[tier] || [], `master_quiz_${tier}`);
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

  let pool = resolved.pool;
  let source = resolved.source;

  if (mode === "quiz") {
    const masterPool = getMasterQuizPoolForTier(tier);

    if (masterPool.length) {
      const blended = [...masterPool];

      if (resolved.pool?.length) {
        const localMixCount = Math.min(3, resolved.pool.length);
        const localSlice = shuffleSeeded(
          [...resolved.pool],
          stableSalt + 500
        ).slice(0, localMixCount);
        blended.push(...localSlice);
      }

      pool = combinePools(blended);
      pool = attachIds(pool, `adaptive_quiz_${tier}`);
      source = resolved.pool?.length
        ? `master+${resolved.source}`
        : "master-quiz";
    }
  }

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
  if (mode === "quiz") {
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
