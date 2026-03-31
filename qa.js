/* =========================================================
   qa.js
   BARROW QUEST CORE QA ROUTER (CLEAN)
========================================================= */

import { PINS } from "./pins.js";

import * as QaQuiz from "./qa_quiz.js";
import * as QaHistory from "./qa_history.js";
import * as QaLogic from "./qa_logic.js";
import * as QaActivity from "./qa_activity.js";
import * as QaFamily from "./qa_family.js";
import * as QaGhost from "./qa_ghost.js";
import * as QaBoss from "./qa_boss.js";

/* =========================================================
   HELPERS
========================================================= */

function normaliseTier(tier) {
  return ["kid", "teen", "adult"].includes(tier) ? tier : "kid";
}

function pick(arr) {
  if (!arr || !arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPin(pinId) {
  return PINS.find(p => p.id === pinId);
}

function getGroup(pin) {
  return pin?.qaGroup || null;
}

function getZone(pin) {
  return pin?.zone || "core";
}

/* =========================================================
   MAIN ROUTER
========================================================= */

export function getQA(input = {}) {
  const pinId = input.pinId;
  const mode = input.mode || "quiz";
  const tier = normaliseTier(input.tier);

  const pin = getPin(pinId);
  const group = getGroup(pin);
  const zone = getZone(pin);

  /* =========================================================
     QUIZ
  ========================================================= */
  if (mode === "quiz") {
    const bank = QaQuiz.MASTER_QUIZ_BANK?.[tier] || [];
    return pick(bank) || fallback("quiz");
  }

  /* =========================================================
     HISTORY
  ========================================================= */
  if (mode === "history") {
    const bank =
      QaHistory.QA_HISTORY_BY_GROUP?.[group]?.[tier] ||
      [];

    return pick(bank) || fallback("history");
  }

  /* =========================================================
     LOGIC / RIDDLES
  ========================================================= */
  if (mode === "logic") {
    const pool = QaLogic.RIDDLE_POOL || [];
    const riddle = pick(pool);

    if (!riddle) return fallback("logic");

    return {
      q: typeof riddle.q === "object" ? riddle.q[tier] : riddle.q,
      options: [riddle.a, "Wrong 1", "Wrong 2", "Wrong 3"],
      answer: 0,
      fact: riddle.a
    };
  }

  /* =========================================================
     ACTIVITY
  ========================================================= */
  if (mode === "activity") {
    const pool =
      QaActivity.QA_ACTIVITY_BY_GROUP?.[group]?.activity?.[tier] ||
      QaActivity.ACTIVITY_POOL?.[tier] ||
      [];

    const task = pick(pool);

    return {
      q: task || "Do something fun!",
      options: ["DONE"],
      answer: 0,
      fact: ""
    };
  }

  /* =========================================================
     SPEED
  ========================================================= */
  if (mode === "speed") {
    const pool = QaActivity.SPEED_POOL?.[tier] || [];

    return {
      q: pick(pool) || "Move fast!",
      options: ["DONE"],
      answer: 0,
      fact: "",
      meta: { speed: true }
    };
  }

  /* =========================================================
     FAMILY
  ========================================================= */
  if (mode === "family") {
    const pool =
      QaFamily.QA_FAMILY_BY_GROUP?.[group]?.[tier] ||
      [];

    return {
      q: pick(pool) || "Do something together!",
      options: ["DONE"],
      answer: 0,
      fact: ""
    };
  }

  /* =========================================================
     GHOST
  ========================================================= */
  if (mode === "ghost") {
    const pool =
      QaGhost.GENERIC_GHOST_POOL?.[tier] ||
      [];

    return {
      q: pick(pool) || "Something feels strange here...",
      options: ["CONTINUE"],
      answer: 0,
      fact: ""
    };
  }

  /* =========================================================
     BOSS
  ========================================================= */
  if (mode === "boss") {
    const pool =
      QaBoss.QA_BOSS_BY_GROUP?.[group]?.[tier] ||
      [];

    return pick(pool) || fallback("boss");
  }

  return fallback("unknown");
}

/* =========================================================
   FALLBACK
========================================================= */

function fallback(mode) {
  return {
    q: `No ${mode} content available.`,
    options: ["OK"],
    answer: 0,
    fact: ""
  };
}
