import { PINS } from "./pins.js";

import * as QaQuiz from "./qa_quiz.js";
import * as QaHistory from "./qa_history.js";
import * as QaLogic from "./qa_logic.js";
import * as QaActivity from "./qa_activity.js";
import * as QaFamily from "./qa_family.js";
import * as QaGhost from "./qa_ghost.js";
import * as QaBoss from "./qa_boss.js";
import * as QaGroups from "./qa_groups.js";

/* ================= BASIC HELPERS ================= */

function normaliseTier(tier = "kid") {
  return ["kid", "teen", "adult"].includes(tier) ? tier : "kid";
}

function pickOne(arr = []) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPinById(pinId) {
  return PINS.find(p => String(p.id) === String(pinId));
}

/* ================= ADAPTIVE ================= */

export function getDefaultAdaptiveProfile(tier = "kid") {
  return {
    tier,
    rating: tier === "adult" ? 250 : tier === "teen" ? 150 : 55,
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
  return {
    ...getDefaultAdaptiveProfile(tier),
    ...profile,
    tier: normaliseTier(profile.tier || tier),
  };
}

export function updateAdaptiveProfile(profile = {}, result = {}) {
  return {
    ...profile,
    streak: result.isCorrect ? (profile.streak || 0) + 1 : 0,
    correct: (profile.correct || 0) + (result.isCorrect ? 1 : 0),
    wrong: (profile.wrong || 0) + (result.isCorrect ? 0 : 1),
  };
}

/* ================= MAIN ENGINE ================= */

export function getPinStartIntro(pinId, tier = "kid") {
  return "";
}

export function getQA(input = {}) {
  const pin = getPinById(input.pinId);
  const group = pin?.qaGroup;

  const tier = normaliseTier(input.tier || "kid");
  const mode = input.mode || "quiz";

  if (mode === "activity") {
    const groupData = QaActivity.QA_ACTIVITY_BY_GROUP[group];

    if (groupData && groupData[tier]) {
      const item = pickOne(groupData[tier]);

      return {
        id: "activity",
        q: item.task,
        options: ["DONE", "SKIP"],
        answer: 0,
        meta: { type: "activity" },
      };
    }
  }

  if (mode === "history") {
    const groupData = QaHistory.QA_HISTORY_BY_GROUP?.[group];

    if (groupData && groupData[tier]) {
      return pickOne(groupData[tier]);
    }
  }

  if (mode === "quiz") {
    const pool = QaQuiz.MASTER_QUIZ_BANK?.[tier] || [];
    return pickOne(pool);
  }

  if (mode === "logic") {
    const pool = QaLogic.RIDDLE_POOL || [];
    return pickOne(pool);
  }

  return {
    id: "fallback",
    q: "No content found",
    options: ["OK"],
    answer: 0,
  };
}
