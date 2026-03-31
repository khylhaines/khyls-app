/* =========================================================
   qa_activity.js
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

function makePrompt(text, mode = "activity", id = null) {
  return {
    id: id || makeQuestionId(mode, text),
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

export const SPEED_POOL = {
  kid: [
    "Point to the nearest tree, sign, or bench.",
    "Can you stand on one foot without wobbling?",
    "Look around and tell me what you saw!",
    "Pull your silliest face!",
    "Close your eyes and name one sound you hear.",
  ],
  teen: [
    "Quickly point out 3 things around you.",
    "Hold a one-foot balance with no wobbling.",
    "Scan and recall 3 things.",
    "Give your best dramatic face.",
    "Point to the fastest way out of this area.",
  ],
  adult: [
    "Identify 3 nearby features within 10 seconds.",
    "Hold a stable one-foot balance position.",
    "Perform a quick scan, then recall 3 details.",
    "Display a bold or exaggerated expression.",
    "Identify one possible risk in the environment.",
  ],
};

const ACTIVITY_BY_GROUP = {
  park_history: {
    kid: [
      "Run to the nearest tree and back!",
      "Spin around 5 times and point at something random!",
    ],
    teen: [
      "Do a full lap of the area without stopping.",
      "Do a dance move in public for 5 seconds.",
    ],
    adult: [
      "Walk the longest visible path and return.",
      "Do a full dance confidently.",
    ],
  },

  town_history: {
    kid: [
      "Find something red nearby.",
    ],
    teen: [
      "Spot 3 different buildings and describe them.",
    ],
    adult: [
      "Pause and observe your surroundings for 10 seconds.",
    ],
  },

  docks_submarines: {
    kid: [
      "Pretend you're steering a submarine!",
    ],
    teen: [
      "Walk in a straight line like you're on a ship deck.",
    ],
    adult: [
      "Stand still and listen to all surrounding sounds.",
    ],
  },

  abbey_history: {
    kid: [
      "Find something old or broken nearby.",
    ],
    teen: [
      "Walk slowly and look for hidden details.",
    ],
    adult: [
      "Walk in silence and take in the atmosphere.",
    ],
  },

  islands_nature: {
    kid: [
      "Find something that moves nearby.",
    ],
    teen: [
      "Look out to the horizon for 10 seconds.",
    ],
    adult: [
      "Stand still and feel the wind or air around you.",
    ],
  },
};

const ACTIVITY_OVERRIDES = {
  park_bandstand_core: {
    kid: "Dance like you're on stage!",
    teen: "Do a quick public performance.",
    adult: "Perform a full dance confidently.",
  },
};

const ACTIVITY_FALLBACK = {
  kid: [
    "You’re the captain now — steer your ship!",
    "Stand tall and give your best salute!",
    "Find the brightest thing you can see!",
    "Celebrate like you just beat a boss!",
    "Do the silliest walk you can!",
  ],
  teen: [
    "You’re in control — act like you’re steering something big.",
    "Give a clean, sharp salute.",
    "What stands out the most here?",
    "Hit a victory pose like you just won.",
    "Do the most ridiculous walk you can think of.",
  ],
  adult: [
    "Simulate controlling a vehicle or vessel.",
    "Perform a respectful gesture.",
    "Identify the most visually prominent feature.",
    "Celebrate like you’ve just won.",
    "Perform a deliberately exaggerated or comedic walk.",
  ],
};

export function getActivityQuestion(input = {}) {
  const pinId = input.pinId || input.pin?.id || "";
  const group = input.group || input.pin?.qaGroup || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier) ? input.tier : "kid";
  const salt = Number(input.salt || 0);
  const forceMode = input.forceMode || "activity";

  if (forceMode === "speed") {
    const speedText = pickOne(SPEED_POOL[tier] || SPEED_POOL.kid, salt);
    return makePrompt(
      speedText || "Move quickly and complete the task.",
      "speed",
      makeQuestionId("speed", speedText || "speed_task")
    );
  }

  const overrideText = ACTIVITY_OVERRIDES[pinId]?.[tier];
  if (overrideText) {
    return makePrompt(
      overrideText,
      "activity",
      makeQuestionId("activity_override", overrideText)
    );
  }

  const groupPool = ACTIVITY_BY_GROUP[group]?.[tier];
  if (Array.isArray(groupPool) && groupPool.length) {
    const picked = pickOne(groupPool, salt);
    return makePrompt(
      picked,
      "activity",
      makeQuestionId(`activity_${group || "group"}`, picked)
    );
  }

  const fallbackPool = ACTIVITY_FALLBACK[tier] || ACTIVITY_FALLBACK.kid;
  const fallbackText = pickOne(fallbackPool, salt) || "Look around and explore your surroundings.";

  return makePrompt(
    fallbackText,
    "activity",
    makeQuestionId("activity_fallback", fallbackText)
  );
}
