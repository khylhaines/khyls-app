/* =========================================================
   qa_boss.js
   MATCHES CURRENT qa.js
========================================================= */

function pickOne(arr, salt = 0) {
  if (!Array.isArray(arr) || !arr.length) return null;
  const n = Math.abs(Number(salt) || 0);
  return arr[n % arr.length];
}

function makeQuestionId(prefix, text) {
  return `${prefix}_${String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80)}`;
}

function makePrompt(text, mode = "boss") {
  return {
    id: makeQuestionId("boss", text),
    q: text,
    options: ["DONE", "FAILED", "SKIP", "UNSAFE"],
    answer: 0,
    fact: "",
    meta: {
      promptOnly: true,
      mode: "boss",
    },
  };
}

const BOSS_BY_GROUP = {
  park_history: {
    kid: [
      "Boss Challenge: Complete 3 activities without stopping!",
    ],
    teen: [
      "Boss Challenge: Complete a full lap and finish with a pose.",
    ],
    adult: [
      "Boss Challenge: Combine movement, awareness, and control into one sequence.",
    ],
  },

  town_history: {
    kid: [
      "Boss Challenge: Find 3 different colours nearby!",
    ],
    teen: [
      "Boss Challenge: Describe 3 buildings in detail.",
    ],
    adult: [
      "Boss Challenge: Observe and describe the full environment.",
    ],
  },

  abbey_history: {
    kid: [
      "Boss Challenge: Find something ancient-looking.",
    ],
    teen: [
      "Boss Challenge: Explore quietly and identify 3 details.",
    ],
    adult: [
      "Boss Challenge: Move slowly and fully absorb the atmosphere.",
    ],
  },
};

const BOSS_FALLBACK = {
  kid: [
    "Boss Challenge: Complete any 2 tasks in a row!",
  ],
  teen: [
    "Boss Challenge: Perform 2 actions without hesitation!",
  ],
  adult: [
    "Boss Challenge: Execute a composed multi-step action sequence.",
  ],
};

export function getBossQuestion(input = {}) {
  const group = input.group || input.pin?.qaGroup || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier) ? input.tier : "kid";
  const salt = Number(input.salt || 0);

  const groupPool = BOSS_BY_GROUP[group]?.[tier];

  if (Array.isArray(groupPool) && groupPool.length) {
    const picked = pickOne(groupPool, salt);
    return makePrompt(picked);
  }

  const fallbackPool = BOSS_FALLBACK[tier] || BOSS_FALLBACK.kid;
  const fallback = pickOne(fallbackPool, salt);

  return makePrompt(fallback || "Complete a boss-level action.");
}
