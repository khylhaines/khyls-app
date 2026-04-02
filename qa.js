import { PINS } from "./pins.js";
import { getQuizQuestion } from "./qa_quiz.js";
import { getHistoryReading } from "./qa_history.js";
import {
  RIDDLE_POOL,
  getHistoryMasterBank,
} from "./qa_groups.js";
import { getActivityQuestion } from "./qa_activity.js";
import { getFamilyQuestion } from "./qa_family.js";
import { getLogicQuestion } from "./qa_logic.js";
import { getGhostQuestion } from "./qa_ghost.js";
import { getBossQuestion } from "./qa_boss.js";
import { getPinStartIntro } from "./qa_start_intro.js";

/* =========================================================
   HELPERS
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
  return [...new Set(values.filter(Boolean).map(String))];
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
  return Math.abs(Number(salt)) % length;
}

function pickOne(arr, salt = 0) {
  if (!arr?.length) return null;
  return arr[seededIndex(arr.length, salt)];
}

function shuffleSeeded(arr, salt = 0) {
  const out = [...arr];
  let seed = Math.abs(Number(salt));

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
  if (entry?.q) return `${prefix}_${slugify(entry.q)}`;
  return `${prefix}_item`;
}

/* =========================================================
   START INTROS (external)
========================================================= */

export { getPinStartIntro };

/* =========================================================
   PIN HELPERS
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
  return (input.recentQuestionIds || []).map(String);
}

/* =========================================================
   ADAPTIVE PROFILE
========================================================= */

const ADAPTIVE_TIER_DEFAULTS = {
  kid: { rating: 55, min: 1, max: 100 },
  teen: { rating: 150, min: 101, max: 200 },
  adult: { rating: 250, min: 201, max: 300 },
};

export function normaliseAdaptiveProfile(profile = {}, tier = "kid") {
  const safeTier = normaliseTier(tier);
  const base = ADAPTIVE_TIER_DEFAULTS[safeTier];

  return {
    tier: safeTier,
    rating: clamp(profile.rating ?? base.rating, base.min, base.max),
    confidence: clamp(profile.confidence ?? 0.5, 0, 1),
    streak: profile.streak || 0,
    correct: profile.correct || 0,
    wrong: profile.wrong || 0,
    tagRatings: profile.tagRatings || {},
    recentTags: profile.recentTags || [],
    recentQuestionIds: profile.recentQuestionIds || [],
  };
}

/* =========================================================
   FINALISE QUESTION
========================================================= */

function finaliseQuestion(question, context) {
  if (!question) {
    return {
      id: "fallback",
      q: "No task available.",
      options: ["OK"],
      answer: 0,
      meta: { fallback: true },
    };
  }

  if (question.q && Array.isArray(question.options)) {
    const options = shuffleSeeded(question.options, context.salt);
    const answer = options.indexOf(question.options[question.answer]);

    return {
      ...question,
      options,
      answer,
      meta: {
        ...question.meta,
        mode: context.mode,
        pinId: context.pinId,
        zone: context.zone,
        tier: context.tier,
      },
    };
  }

  return question;
}

/* =========================================================
   MAIN ROUTER
========================================================= */

export function getQA(input = {}) {
  const pinId = input.pinId || null;
  const pin = getPinById(pinId);
  const zone = input.zone || getPinZone(pin);
  const group = getPinGroup(pin);
  const mode = input.mode || "quiz";
  const tier = normaliseTier(input.tier || "kid");
  const recentIds = getRecentIds(input);

  const salt =
    Number(input.salt || Date.now()) +
    String(pinId).length * 97 +
    String(mode).length * 19;

  const adaptiveProfile = normaliseAdaptiveProfile(
    input.adaptiveProfile || {},
    tier
  );

  const context = {
    pinId,
    pin,
    zone,
    group,
    mode,
    tier,
    salt,
    adaptiveProfile,
  };

  /* ================= MODE SWITCH ================= */

  if (mode === "quiz") {
    return finaliseQuestion(
      getQuizQuestion({ ...context, recentIds }),
      context
    );
  }

  if (mode === "history") {
    return {
      id: `history_${pinId || zone}`,
      q: getHistoryReading(context),
      options: ["CONTINUE"],
      answer: 0,
      meta: { mode: "history", reading: true },
    };
  }

  if (mode === "activity") {
    return finaliseQuestion(
      getActivityQuestion({ ...context, recentIds }),
      context
    );
  }

  if (mode === "family") {
    return finaliseQuestion(
      getFamilyQuestion({ ...context, recentIds }),
      context
    );
  }

  if (mode === "logic") {
    return finaliseQuestion(
      getLogicQuestion({
        ...context,
        recentIds,
        riddlePool: RIDDLE_POOL,
      }),
      context
    );
  }

  if (mode === "ghost") {
    return finaliseQuestion(
      getGhostQuestion({ ...context, recentIds }),
      context
    );
  }

  if (mode === "boss") {
    return finaliseQuestion(
      getBossQuestion({ ...context, recentIds }),
      context
    );
  }

  /* ================= FALLBACK ================= */

  return {
    id: "fallback",
    q: `No ${mode} content found.`,
    options: ["OK"],
    answer: 0,
    meta: { fallback: true },
  };
}
