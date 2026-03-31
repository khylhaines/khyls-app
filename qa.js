import { PINS } from "./pins.js";
import { getQuizQuestion } from "./qa_quiz.js";
import { getHistoryQuestion } from "./qa_history.js";
import {
  RIDDLE_POOL,
  getHistoryMasterBank,
} from "./qa_groups.js";
import { getActivityQuestion } from "./qa_activity.js";
import { getFamilyQuestion } from "./qa_family.js";
import { getLogicQuestion } from "./qa_logic.js";
import { getGhostQuestion } from "./qa_ghost.js";
import { getBossQuestion } from "./qa_boss.js";

/* =========================================================
   qa.js
   BARROW QUEST QA ROUTER
   SAFE MASTER FILE
   - keeps old app contract working
   - routes modes to split QA files
   - preserves adaptive helpers
   - preserves getPinStartIntro support
========================================================= */

function normaliseTier(tier = "kid") {
  return ["kid", "teen", "adult"].includes(tier) ? tier : "kid";
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function uniqueStrings(values = []) {
  return [...new Set((values || []).filter(Boolean).map((v) => String(v)))];
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
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

function makeQuestionId(prefix, entry) {
  if (entry?.id) return String(entry.id);
  if (typeof entry === "string") return `${prefix}_${slugify(entry)}`;
  if (entry?.q && Array.isArray(entry?.options)) {
    return `${prefix}_${slugify(entry.q)}`;
  }
  if (entry?.q && entry?.a) {
    return `${prefix}_${slugify(entry.q)}_${slugify(entry.a)}`;
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

function getTieredText(value, tier = "kid") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return value[tier] || value.kid || Object.values(value)[0] || "";
  }
  return "";
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

export function getPinStartIntro(pinId, tier = "kid") {
  const safeTier = normaliseTier(tier);
  return (
    PIN_START_INTROS?.[pinId]?.[safeTier] ||
    PIN_START_INTROS?.[pinId]?.kid ||
    ""
  );
}

/* =========================================================
   PIN / GROUP HELPERS
========================================================= */

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

/* =========================================================
   ADAPTIVE PROFILE
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
   LOGIC FALLBACK BUILDER
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
   MODE ROUTERS
========================================================= */

function getSafeMeta({
  pinId,
  pin,
  zone,
  group,
  mode,
  tier,
  source,
  question,
  adaptiveProfile,
}) {
  const existingTags = Array.isArray(question?.meta?.tags)
    ? question.meta.tags
    : Array.isArray(question?.tags)
    ? question.tags
    : [];

  return {
    ...(question?.meta || {}),
    zone,
    group,
    pinId,
    source,
    mode,
    tier,
    questionId: question?.id || makeQuestionId(`${mode}_${pinId || zone}`, question),
    difficulty: Number.isFinite(Number(question?.difficulty))
      ? Number(question.difficulty)
      : Number(adaptiveProfile?.rating || 0),
    tags: uniqueStrings([
      ...existingTags,
      mode,
      `zone:${zone}`,
      ...(group ? [`group:${group}`] : []),
      ...(pinId ? [`pin:${pinId}`] : []),
      ...(source ? [`source:${source}`] : []),
    ]),
    adaptiveRating: adaptiveProfile?.rating,
  };
}

function finaliseQuestion(question, context) {
  if (!question) {
    return makeFallbackTask("No task found.", context);
  }

  if (question?._type === "prompt" && typeof question.value === "string") {
    const built = makePromptTask(
      question.value,
      context.mode,
      question.id || makeQuestionId(context.mode, question.value)
    );
    built.meta = getSafeMeta({
      ...context,
      question: built,
      source: context.source || "prompt",
      adaptiveProfile: context.adaptiveProfile,
    });
    return built;
  }

  if (typeof question === "string") {
    const built = makePromptTask(question, context.mode);
    built.meta = getSafeMeta({
      ...context,
      question: built,
      source: context.source || "prompt",
      adaptiveProfile: context.adaptiveProfile,
    });
    return built;
  }

  if (question?.q && question?.a && !Array.isArray(question?.options)) {
    const built = makeMcqFromRiddle(
      question,
      context.tier,
      context.salt,
      question.id
    );
    built.meta = getSafeMeta({
      ...context,
      question: built,
      source: context.source || "logic-riddle",
      adaptiveProfile: context.adaptiveProfile,
    });
    return built;
  }

  if (question?.q && Array.isArray(question?.options)) {
    const qText = getTieredText(question.q, context.tier);
    const factText = getTieredText(question.fact, context.tier) || question.fact || "";

    const originalOptions = [...question.options];
    const correctText = originalOptions[question.answer];
    const shuffledOptions = shuffleSeeded(originalOptions, context.salt + 123);
    const answer = shuffledOptions.indexOf(correctText);

    return {
      ...question,
      q: qText,
      fact: factText,
      options: shuffledOptions,
      answer,
      meta: getSafeMeta({
        ...context,
        question,
        adaptiveProfile: context.adaptiveProfile,
      }),
    };
  }

  return makeFallbackTask("Task format not recognised.", context);
}

function getHistoryFallbackFromMaster(tier = "kid", recentIds = [], salt = 0) {
  const pool = attachIds(getHistoryMasterBank(tier) || [], `history_master_${tier}`);
  const recentSet = new Set((recentIds || []).map(String));
  const filtered = pool.filter((item) => !recentSet.has(String(item.id)));
  return pickOne(filtered.length ? filtered : pool, salt);
}

/* =========================================================
   MAIN ENTRY
========================================================= */

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

  const adaptiveProfile = normaliseAdaptiveProfile(
    input.adaptiveProfile || input.quizProfile || {},
    tier
  );

  const baseContext = {
    input,
    pinId,
    pin,
    zone,
    group,
    mode,
    tier,
    salt: stableSalt,
    recentIds,
    adaptiveProfile,
    source: "unknown",
  };

  let question = null;

  if (mode === "quiz") {
    question = getQuizQuestion({
      pinId,
      pin,
      zone,
      group,
      tier,
      salt: stableSalt,
      recentIds,
      recentQuestionIds: recentIds,
      adaptiveProfile,
    });
    return finaliseQuestion(question, {
      ...baseContext,
      source: "qa_quiz",
    });
  }

  if (mode === "history") {
    question = getHistoryQuestion({
      pinId,
      pin,
      zone,
      group,
      tier,
      salt: stableSalt,
      recentIds,
      recentQuestionIds: recentIds,
      adaptiveProfile,
    });

    if (!question) {
      question = getHistoryFallbackFromMaster(tier, recentIds, stableSalt);
    }

    return finaliseQuestion(question, {
      ...baseContext,
      source: "qa_history",
    });
  }

  if (mode === "activity") {
    question = getActivityQuestion({
      pinId,
      pin,
      zone,
      group,
      tier,
      salt: stableSalt,
      recentIds,
    });
    return finaliseQuestion(question, {
      ...baseContext,
      source: "qa_activity",
    });
  }

  if (mode === "family") {
    question = getFamilyQuestion({
      pinId,
      pin,
      zone,
      group,
      tier,
      salt: stableSalt,
      recentIds,
    });
    return finaliseQuestion(question, {
      ...baseContext,
      source: "qa_family",
    });
  }

  if (mode === "logic") {
    question = getLogicQuestion({
      pinId,
      pin,
      zone,
      group,
      tier,
      salt: stableSalt,
      recentIds,
      riddlePool: RIDDLE_POOL,
    });
    return finaliseQuestion(question, {
      ...baseContext,
      source: "qa_logic",
    });
  }

  if (mode === "ghost") {
    question = getGhostQuestion({
      pinId,
      pin,
      zone,
      group,
      tier,
      salt: stableSalt,
      recentIds,
    });
    return finaliseQuestion(question, {
      ...baseContext,
      source: "qa_ghost",
    });
  }

  if (mode === "boss") {
    question = getBossQuestion({
      pinId,
      pin,
      zone,
      group,
      tier,
      salt: stableSalt,
      recentIds,
    });
    return finaliseQuestion(question, {
      ...baseContext,
      source: "qa_boss",
    });
  }

  if (mode === "speed") {
    return finaliseQuestion(
      getActivityQuestion({
        pinId,
        pin,
        zone,
        group,
        tier,
        salt: stableSalt,
        recentIds,
        forceMode: "speed",
      }),
      {
        ...baseContext,
        source: "qa_activity_speed",
      }
    );
  }

  if (mode === "discovery") {
    return finaliseQuestion(
      getGhostQuestion({
        pinId,
        pin,
        zone,
        group,
        tier,
        salt: stableSalt,
        recentIds,
        forceMode: "discovery",
      }),
      {
        ...baseContext,
        source: "qa_ghost_discovery",
      }
    );
  }

  return makeFallbackTask(
    `No ${mode} content found for ${pinId || zone} (${tier}).`,
    {
      pinId,
      zone,
      group,
      mode,
      tier,
      source: "qa_router_fallback",
    }
  );
}
