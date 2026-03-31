/* =========================================================
   qa_logic.js
   BARROW QUEST LOGIC / RIDDLES / THINKING TASKS
   SAFE SPLIT (WORKS LIKE OLD QA SYSTEM)
========================================================= */

/* =========================================================
   SHARED RIDDLE POOL
========================================================= */

export const RIDDLE_POOL = [
  {
    q: {
      kid: "What has keys all over it, but still can’t open locks?",
      teen: "What has loads of keys but is useless at opening locks?",
      adult: "What has many keys, but none of them can open a lock?",
    },
    a: "A piano",
  },
  {
    q: {
      kid: "What has hands but never gives you a high five?",
      teen: "What has hands but can’t clap, wave, or fight?",
      adult: "What has hands, but can’t clap, hold, or touch?",
    },
    a: "A clock",
  },
  {
    q: {
      kid: "What gets wetter every time it helps dry something?",
      teen: "What’s meant to dry things but ends up wetter instead?",
      adult: "What is used for drying, yet becomes wetter with use?",
    },
    a: "A towel",
  },
  {
    q: {
      kid: "What do you go up and down on, but it stays in the same place?",
      teen: "What do people go up and down on all day, but it never moves?",
      adult: "What is used for movement up and down, but never moves itself?",
    },
    a: "Stairs",
  },
  {
    q: {
      kid: "What has one eye, but can’t see at all?",
      teen: "What has one eye but is completely blind?",
      adult: "What has an eye, yet lacks all ability to see?",
    },
    a: "A needle",
  },
  {
    q: {
      kid: "What has a neck but no head?",
      teen: "What has a neck, but no head at all?",
      adult: "What has a neck, yet no head?",
    },
    a: "A bottle",
  },
  {
    q: {
      kid: "What can run, but doesn’t have legs?",
      teen: "What runs but has no legs at all?",
      adult: "What runs, but has no physical form to walk?",
    },
    a: "Water",
  },
  {
    q: {
      kid: "What has lots of teeth but doesn’t bite?",
      teen: "What has loads of teeth but is harmless?",
      adult: "What has numerous teeth, but no ability to bite?",
    },
    a: "A comb",
  },
  {
    q: {
      kid: "What can you catch, but never throw?",
      teen: "What can you catch, but you definitely can’t throw back?",
      adult: "What can be caught, yet cannot be thrown?",
    },
    a: "A cold",
  },
  {
    q: {
      kid: "The more you take, the more you leave behind. What am I?",
      teen: "The more you take, the more you leave behind — what is it?",
      adult: "The more you take, the more you leave behind. What are they?",
    },
    a: "Footsteps",
  },
  {
    q: {
      kid: "What comes down, but never goes back up?",
      teen: "What falls down, but never rises back up?",
      adult: "What comes down, yet never returns upward?",
    },
    a: "Rain",
  },
  {
    q: {
      kid: "What has lots of cities, but no houses?",
      teen: "What has cities all over it, but no actual houses?",
      adult: "What contains cities, yet no houses?",
    },
    a: "A map",
  },
  {
    q: {
      kid: "What can fill a whole room, but doesn’t take up any space?",
      teen: "What can fill a room completely, but takes up no space at all?",
      adult: "What can fill an entire room, yet occupies no space?",
    },
    a: "Light",
  },
  {
    q: {
      kid: "What goes up every year, but never comes back down?",
      teen: "What keeps going up, but never drops back down?",
      adult: "What increases steadily, yet never decreases?",
    },
    a: "Your age",
  },
  {
    q: {
      kid: "What is full of holes, but still holds water?",
      teen: "What’s covered in holes, but still manages to hold water?",
      adult: "What is full of holes, yet still retains water?",
    },
    a: "A sponge",
  },
  {
    q: {
      kid: "What is always coming, but never actually gets here?",
      teen: "What’s always on the way, but never really arrives?",
      adult: "What is always approaching, yet never truly arrives?",
    },
    a: "Tomorrow",
  },
  {
    q: {
      kid: "What can’t be used until it’s broken?",
      teen: "What only becomes useful after you break it?",
      adult: "What cannot be used until it has been broken?",
    },
    a: "An egg",
  },
  {
    q: {
      kid: "What disappears as soon as you say its name?",
      teen: "What vanishes the moment you say it out loud?",
      adult: "What disappears the instant its name is spoken?",
    },
    a: "Silence",
  },
  {
    q: {
      kid: "What has a ring, but no finger?",
      teen: "What has a ring, but never goes on your hand?",
      adult: "What has a ring, yet no finger?",
    },
    a: "A phone",
  },
  {
    q: {
      kid: "What has branches, but no leaves?",
      teen: "What has branches, but none of them grow leaves?",
      adult: "What has branches, yet no leaves?",
    },
    a: "A bank",
  },
];

/* =========================================================
   PIN OVERRIDES
========================================================= */

export const QA_LOGIC_PIN_OVERRIDES = {
  abbey_monk_path: {
    kid: [
      {
        q: "Why would monks use a path like this?",
        options: [
          "To move quietly",
          "To race cars",
          "To fly planes",
          "To build robots",
        ],
        answer: 0,
        fact: "Monastic paths often supported quiet movement and routine.",
      },
    ],
    teen: [
      {
        q: "What best fits a monk path?",
        options: [
          "Quiet movement and purpose",
          "Public racing route",
          "Heavy machine transport",
          "Airfield access",
        ],
        answer: 0,
        fact: "A monk path suggests controlled movement and purpose.",
      },
    ],
    adult: [
      {
        q: "What does a route like this most strongly suggest?",
        options: [
          "Structured movement within a religious site",
          "Industrial freight movement",
          "Modern crowd entertainment",
          "Random landscape use",
        ],
        answer: 0,
        fact: "Paths like this suggest organised movement inside a working religious landscape.",
      },
    ],
  },

  park_mudman: {
    kid: [
      {
        q: "What helps solve a mystery best?",
        options: [
          "Careful thinking",
          "Random shouting",
          "Running away",
          "Ignoring clues",
        ],
        answer: 0,
        fact: "Good mystery solving starts with careful thinking.",
      },
    ],
    teen: [
      {
        q: "What wins a mystery challenge?",
        options: [
          "Observation and logic",
          "Noise and speed only",
          "Guessing wildly",
          "Walking off",
        ],
        answer: 0,
        fact: "Observation and logic are the strongest mystery tools.",
      },
    ],
    adult: [
      {
        q: "What makes a logic pin satisfying?",
        options: [
          "Pattern, clue, and reveal",
          "Chaos without meaning",
          "Noise without thought",
          "Pure chance alone",
        ],
        answer: 0,
        fact: "The best logic pins rely on pattern, clue, and reveal.",
      },
    ],
  },

  abbey_cloister: {
    kid: [
      {
        q: "What would people do in a cloister walk?",
        options: [
          "Walk and reflect",
          "Race motorbikes",
          "Play football",
          "Launch boats",
        ],
        answer: 0,
        fact: "Cloister walks were places of movement, thought, and routine.",
      },
    ],
    teen: [
      {
        q: "What does a cloister suggest most?",
        options: [
          "Order and reflection",
          "Modern transport",
          "Cargo storage",
          "Street entertainment",
        ],
        answer: 0,
        fact: "A cloister suggests order, reflection, and structured movement.",
      },
    ],
    adult: [
      {
        q: "What is the strongest interpretation of a cloister path?",
        options: [
          "Disciplined ritual movement",
          "Commercial movement only",
          "Military defence line",
          "Public road network",
        ],
        answer: 0,
        fact: "A cloister path reflects disciplined ritual and movement within monastic life.",
      },
    ],
  },
};

/* =========================================================
   GROUP LOGIC CONTENT
========================================================= */

export const QA_LOGIC_BY_GROUP = {
  park_history: {
    kid: [
      {
        q: "If a place has paths, signs, and landmarks, what helps most?",
        options: [
          "Looking carefully",
          "Closing your eyes",
          "Running randomly",
          "Ignoring everything",
        ],
        answer: 0,
        fact: "Careful looking helps you understand a place better.",
      },
    ],
    teen: [
      {
        q: "What is strongest in a park logic challenge?",
        options: [
          "Observation",
          "Noise",
          "Luck alone",
          "Speed without thought",
        ],
        answer: 0,
        fact: "Observation usually gives the best edge in a logic challenge.",
      },
    ],
    adult: [
      {
        q: "What makes public-space logic tasks work well?",
        options: [
          "Visible clues and pattern recognition",
          "Complete randomness",
          "No landmarks",
          "Pure speed only",
        ],
        answer: 0,
        fact: "Logic works best when visible details support pattern recognition.",
      },
    ],
  },

  abbey_history: {
    kid: [
      {
        q: "What helps solve an abbey puzzle best?",
        options: [
          "Thinking calmly",
          "Shouting answers",
          "Guessing instantly",
          "Walking away",
        ],
        answer: 0,
        fact: "Calm thinking helps solve abbey puzzles.",
      },
    ],
    teen: [
      {
        q: "What matters most in an old historic mystery?",
        options: [
          "Clues and sequence",
          "Noise and speed",
          "Big gestures",
          "Random luck",
        ],
        answer: 0,
        fact: "Historic mysteries are usually solved with clues and sequence.",
      },
    ],
    adult: [
      {
        q: "What makes abbey logic satisfying?",
        options: [
          "Context, clue, and interpretation",
          "Pure speed",
          "Loud reaction",
          "No structure at all",
        ],
        answer: 0,
        fact: "Abbey logic works best when context, clue, and interpretation come together.",
      },
    ],
  },

  town_history: {
    kid: [
      {
        q: "If you want to work something out in town, what should you do first?",
        options: [
          "Look around",
          "Panic",
          "Run in circles",
          "Close your eyes",
        ],
        answer: 0,
        fact: "Looking around is the first step in solving location puzzles.",
      },
    ],
    teen: [
      {
        q: "What helps most when solving a town-based clue?",
        options: [
          "Noticing details",
          "Ignoring details",
          "Rushing fast",
          "Making noise",
        ],
        answer: 0,
        fact: "Town clues are easiest when you notice the details around you.",
      },
    ],
    adult: [
      {
        q: "What is usually the foundation of real-world clue solving?",
        options: [
          "Observation",
          "Volume",
          "Impulse",
          "Distraction",
        ],
        answer: 0,
        fact: "Observation is usually the base layer of real-world clue solving.",
      },
    ],
  },

  docks_submarines: {
    kid: [
      {
        q: "What helps most if something is hidden?",
        options: [
          "Looking closely",
          "Looking away",
          "Shouting",
          "Leaving",
        ],
        answer: 0,
        fact: "Looking closely helps uncover hidden details.",
      },
    ],
    teen: [
      {
        q: "What kind of thinking helps most around complex structures?",
        options: [
          "Careful scanning",
          "Random guessing",
          "Ignoring shape",
          "Fast panic",
        ],
        answer: 0,
        fact: "Careful scanning helps with complex spaces and clues.",
      },
    ],
    adult: [
      {
        q: "What supports logic best in engineered environments?",
        options: [
          "Spatial awareness",
          "Pure emotion",
          "Noise alone",
          "Luck only",
        ],
        answer: 0,
        fact: "Engineered environments reward spatial awareness and observation.",
      },
    ],
  },

  islands_nature: {
    kid: [
      {
        q: "What helps you notice more in nature?",
        options: [
          "Staying calm and looking",
          "Running wildly",
          "Shouting",
          "Ignoring everything",
        ],
        answer: 0,
        fact: "You notice more in nature when you stay calm and look carefully.",
      },
    ],
    teen: [
      {
        q: "What is most useful when solving nature-based clues?",
        options: [
          "Patience and observation",
          "Noise and rush",
          "Random chance",
          "Standing backwards",
        ],
        answer: 0,
        fact: "Nature clues are easier with patience and observation.",
      },
    ],
    adult: [
      {
        q: "What does landscape logic usually depend on most?",
        options: [
          "Attention to detail",
          "Urgency alone",
          "Force",
          "Distraction",
        ],
        answer: 0,
        fact: "Landscape logic usually depends on careful attention to detail.",
      },
    ],
  },
};

/* =========================================================
   HELPERS
========================================================= */

function getTierText(value, tier = "kid") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return value[tier] || value.kid || "";
  }
  return "";
}

function makeId(prefix, value) {
  return `${prefix}_${String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60)}`;
}

function makeMcqFromRiddle(riddle, tier = "kid", index = 0) {
  const correct = riddle.a;
  const qText = getTierText(riddle.q, tier);

  const wrongPools = {
    kid: ["A chair", "A shoe", "A potato", "A bus", "A pencil", "A hat"],
    teen: ["A charger", "A sign", "A ladder", "A teabag", "A helmet", "A spoon"],
    adult: ["A receipt", "A jacket", "A socket", "A newspaper", "A bottle cap", "A drawer"],
  };

  const wrongAnswers = (wrongPools[tier] || wrongPools.kid)
    .filter((item) => item !== correct)
    .slice(0, 3);

  const options = [correct, ...wrongAnswers];

  return {
    id: makeId("logic_riddle", `${index}_${qText}`),
    q: qText,
    options,
    answer: 0,
    fact: correct,
    meta: {
      type: "riddle",
      mode: "logic",
    },
  };
}

function getGroupFromPin(pinId, getGroupForPin) {
  if (typeof getGroupForPin === "function") {
    return getGroupForPin(pinId);
  }
  return null;
}

/* =========================================================
   MAIN GETTER
========================================================= */

export function getLogicForPin(pinId, tier = "kid", getGroupForPin) {
  const override = QA_LOGIC_PIN_OVERRIDES[pinId];
  if (override && Array.isArray(override[tier]) && override[tier].length) {
    return override[tier];
  }

  const group = getGroupFromPin(pinId, getGroupForPin);
  const groupData = QA_LOGIC_BY_GROUP[group];
  if (groupData && Array.isArray(groupData[tier]) && groupData[tier].length) {
    return groupData[tier];
  }

  return RIDDLE_POOL.map((riddle, index) => makeMcqFromRiddle(riddle, tier, index));
}


export function getLogicQuestion(input = {}) {
  const pool =
    (typeof QA_LOGIC_BY_GROUP !== "undefined" && QA_LOGIC_BY_GROUP) ||
    (typeof LOGIC_BY_GROUP !== "undefined" && LOGIC_BY_GROUP) ||
    null;

  const group = input.group || input.pin?.qaGroup || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier)
    ? input.tier
    : "kid";
  const salt = Number(input.salt || 0);

  function pickOne(arr) {
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr[Math.abs(salt) % arr.length];
  }

  if (pool && pool[group] && pool[group][tier]) {
    return pickOne(pool[group][tier]);
  }

  return null;
}
