/* =========================================================
   qa_ghost.js
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

function makePrompt(text, mode = "ghost") {
  return {
    id: makeQuestionId(mode, text),
    q: text,
    options: ["DONE", "NOT YET", "SKIP", "UNSAFE"],
    answer: 0,
    fact: "",
    meta: {
      promptOnly: true,
      mode,
    },
  };
}

const GHOST_BY_GROUP = {
  abbey_history: {
    kid: [
      "Stand still like you heard a ghost whisper.",
      "Do a brave monk pose.",
      "Point to where a ghost monk might appear.",
      "Whisper one word that fits the abbey.",
    ],
    teen: [
      "Name one thing here that makes the abbey feel eerie.",
      "Give this place a haunted title in 3 words.",
      "Stand silent for 10 seconds and listen for echoes.",
      "What detail here would make the best ghost-story clue?",
    ],
    adult: [
      "Describe the abbey atmosphere in one word.",
      "What makes ruins especially effective for ghost stories?",
      "Does this place feel more haunted by memory, history, or imagination?",
      "What matters most here: stone, shadow, echo, or atmosphere?",
    ],
  },
};

const GHOST_FALLBACK = {
  kid: [
    "Stand still for 5 seconds and listen for the tiniest sound nearby.",
    "Do a spooky statue pose.",
    "Point at the place a ghost might hide.",
    "Whisper one word that fits this place.",
  ],
  teen: [
    "Name one thing here that feels eerie.",
    "Give this place a ghost-story title.",
    "Stand silent for 10 seconds and listen.",
    "Say a one-line warning for this area.",
  ],
  adult: [
    "Describe the atmosphere here in one word.",
    "What detail makes this place feel unsettled or still?",
    "Stand quietly for 10 seconds and notice the soundscape.",
    "What would make this location work in a local ghost story?",
  ],
};

const DISCOVERY_BY_PIN = {
  park_hidden_old_tree: {
    kid: {
      q: "DISCOVERY: What makes old trees special?",
      options: [
        "They hold age and history",
        "They are made of metal",
        "They float at sea",
        "They drive buses",
      ],
      answer: 0,
      fact: "Old trees can make places feel ancient and special.",
    },
    teen: {
      q: "DISCOVERY: Why might an old tree feel important in a park?",
      options: [
        "It gives character and memory",
        "It runs the café",
        "It powers the lights",
        "It sells tickets",
      ],
      answer: 0,
      fact: "Old trees often give a park character and memory.",
    },
    adult: {
      q: "DISCOVERY: What can an old tree add to a landscape?",
      options: [
        "Depth, age, and continuity",
        "Traffic control",
        "Retail signage",
        "Industrial noise",
      ],
      answer: 0,
      fact: "An old tree adds a sense of depth and continuity.",
    },
  },
};

export function getGhostQuestion(input = {}) {
  const pinId = input.pinId || input.pin?.id || "";
  const group = input.group || input.pin?.qaGroup || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier) ? input.tier : "kid";
  const salt = Number(input.salt || 0);
  const forceMode = input.forceMode || "ghost";

  if (forceMode === "discovery") {
    const found = DISCOVERY_BY_PIN[pinId]?.[tier] || DISCOVERY_BY_PIN[pinId]?.kid;
    if (found) return found;
    return makePrompt("Look carefully. Something hidden matters here.", "discovery");
  }

  const groupPool = GHOST_BY_GROUP[group]?.[tier];
  if (Array.isArray(groupPool) && groupPool.length) {
    return makePrompt(pickOne(groupPool, salt), "ghost");
  }

  const fallbackPool = GHOST_FALLBACK[tier] || GHOST_FALLBACK.kid;
  return makePrompt(
    pickOne(fallbackPool, salt) || "Something feels strange here.",
    "ghost"
  );
}
