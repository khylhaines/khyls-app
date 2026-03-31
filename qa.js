import { PINS } from "./pins.js";
import { PIN_START_INTROS } from "./qa_groups.js";
import { QUIZ_PIN_CONTENT, QUIZ_GROUP_CONTENT } from "./qa_quiz.js";
import { HISTORY_PIN_CONTENT, HISTORY_GROUP_CONTENT } from "./qa_history.js";
import { LOGIC_PIN_CONTENT, LOGIC_GROUP_CONTENT } from "./qa_logic.js";
import { ACTIVITY_PIN_CONTENT, ACTIVITY_GROUP_CONTENT } from "./qa_activity.js";
import { FAMILY_PIN_CONTENT, FAMILY_GROUP_CONTENT } from "./qa_family.js";
import { GHOST_PIN_CONTENT, GHOST_GROUP_CONTENT } from "./qa_ghost.js";
import { BOSS_PIN_CONTENT, BOSS_GROUP_CONTENT } from "./qa_boss.js";

/* =========================================================
   qa.js
   CLEAN MASTER QA FILE
   - links split QA files together
   - keeps old app.js imports working
   - exports:
       getQA
       getPinStartIntro
       getDefaultAdaptiveProfile
       normaliseAdaptiveProfile
       updateAdaptiveProfile
========================================================= */

function normaliseTier(tier = "kid") {
  return ["kid", "teen", "adult"].includes(tier) ? tier : "kid";
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);
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
  return uniqBy(
    pools.flat().filter(Boolean),
    (item) => {
      if (typeof item === "string") return `str:${item}`;
      if (item?.id) return `id:${item.id}`;
      if (item?.q && Array.isArray(item?.options)) {
        return `mcq:${typeof item.q === "string" ? item.q : JSON.stringify(item.q)}`;
      }
      if (item?.q && item?.a) {
        return `riddle:${typeof item.q === "string" ? item.q : JSON.stringify(item.q)}|${item.a}`;
      }
      return JSON.stringify(item);
    }
  );
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

const MODULES = {
  quiz: {
    pin: QUIZ_PIN_CONTENT || {},
    group: QUIZ_GROUP_CONTENT || {},
  },
  history: {
    pin: HISTORY_PIN_CONTENT || {},
    group: HISTORY_GROUP_CONTENT || {},
  },
  logic: {
    pin: LOGIC_PIN_CONTENT || {},
    group: LOGIC_GROUP_CONTENT || {},
  },
  activity: {
    pin: ACTIVITY_PIN_CONTENT || {},
    group: ACTIVITY_GROUP_CONTENT || {},
  },
  family: {
    pin: FAMILY_PIN_CONTENT || {},
    group: FAMILY_GROUP_CONTENT || {},
  },
  ghost: {
    pin: GHOST_PIN_CONTENT || {},
    group: GHOST_GROUP_CONTENT || {},
  },
  boss: {
    pin: BOSS_PIN_CONTENT || {},
    group: BOSS_GROUP_CONTENT || {},
  },
};

const ADAPTIVE_TIER_DEFAULTS = {
  kid: { rating: 55, min: 1, max: 100 },
  teen: { rating: 150, min: 101, max: 200 },
  adult: { rating: 250, min: 201, max: 300 },
};

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

function getPoolFromPinModule(pinId, mode, tier) {
  const mod = MODULES[mode];
  if (!mod) return [];

  const pinBlock = mod.pin?.[pinId];
  if (!pinBlock) return [];

  const exact = pinBlock?.[mode]?.[tier] || [];
  const kidFallback = tier !== "kid" ? pinBlock?.[mode]?.kid || [] : [];

  return attachIds(combinePools(exact, kidFallback), `${pinId}_${mode}_${tier}`);
}

function getPoolFromGroupModule(group, mode, tier) {
  const mod = MODULES[mode];
  if (!mod || !group) return [];

  const groupBlock = mod.group?.[group];
  if (!groupBlock) return [];

  const exact = groupBlock?.[mode]?.[tier] || [];
  const kidFallback = tier !== "kid" ? groupBlock?.[mode]?.kid || [] : [];

  return attachIds(
    combinePools(exact, kidFallback),
    `${group}_${mode}_${tier}`
  );
}

function resolvePinStartIntro(pinId, tier = "kid") {
  return (
    PIN_START_INTROS?.[pinId]?.[tier] ||
    PIN_START_INTROS?.[pinId]?.kid ||
    ""
  );
}

function resolvePool({ pinId, pin, group, mode, tier }) {
  const pinPool = getPoolFromPinModule(pinId, mode, tier);
  if (pinPool.length) {
    return {
      pool: pinPool,
      source: "pin-exact",
    };
  }

  const groupPool = getPoolFromGroupModule(group, mode, tier);
  if (groupPool.length) {
    return {
      pool: groupPool,
      source: `group-${group}`,
    };
  }

  return {
    pool: [],
    source: "none",
  };
}

/* =========================================================
   ADAPTIVE PROFILE
========================================================= */

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

  if (Array.isArray(entry?.tags)) {
    tags.push(...entry.tags);
  }

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
    ? tags.reduce((sum, tag) => sum + Number(tagRatings[tag] || 0), 0) / tags.length
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
