/* =========================================================
   qa_family.js
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

function makePrompt(text, mode = "family") {
  return {
    id: makeQuestionId("family", text),
    q: text,
    options: ["DONE", "NOT YET", "SKIP", "UNSAFE"],
    answer: 0,
    fact: "",
    meta: {
      promptOnly: true,
      mode: "family",
    },
  };
}

const FAMILY_BY_GROUP = {
  park_history: {
    kid: [
      "Everyone do the same silly walk together.",
      "Group hug time — everyone in.",
      "Tap everyone’s shoulder as fast as you can.",
    ],
    teen: [
      "Move as a group doing the same ridiculous walk.",
      "Instant group hug — no warning.",
      "Quick shoulder tap across the group.",
    ],
    adult: [
      "Perform a synchronised exaggerated walk together.",
      "Immediate group embrace.",
      "Light shoulder tap across the group.",
    ],
  },

  town_history: {
    kid: [
      "Everyone point at the same object together.",
      "Say one funny word together.",
    ],
    teen: [
      "Name three things as a group.",
      "Make up a quick group slogan.",
    ],
    adult: [
      "Observe the area together and agree on one key detail.",
      "Create a short group description of this place.",
    ],
  },

  abbey_history: {
    kid: [
      "Stand together like a team of explorers.",
      "Point to the oldest-looking thing together.",
    ],
    teen: [
      "Walk together quietly for 5 seconds.",
      "As a group, choose the eeriest detail here.",
    ],
    adult: [
      "Pause together in silence and notice the atmosphere.",
      "As a group, identify the strongest historic feature nearby.",
    ],
  },
};

const FAMILY_FALLBACK = {
  kid: [
    "Everyone do the same silly walk together.",
    "Say a weird word together.",
    "Link up and move as a team.",
  ],
  teen: [
    "Move together in sync.",
    "Create a quick team slogan.",
    "Choose one leader and copy them.",
  ],
  adult: [
    "Coordinate a shared movement together.",
    "Make a short group observation about the area.",
    "Move together while maintaining formation.",
  ],
};

export function getFamilyQuestion(input = {}) {
  const group = input.group || input.pin?.qaGroup || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier) ? input.tier : "kid";
  const salt = Number(input.salt || 0);

  const groupPool = FAMILY_BY_GROUP[group]?.[tier];

  if (Array.isArray(groupPool) && groupPool.length) {
    const picked = pickOne(groupPool, salt);
    return makePrompt(picked);
  }

  const fallbackPool = FAMILY_FALLBACK[tier] || FAMILY_FALLBACK.kid;
  const fallback = pickOne(fallbackPool, salt);

  return makePrompt(fallback || "Do something together as a group.");
}
