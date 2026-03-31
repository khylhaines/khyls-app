/* =========================================================
   qa_ghost.js
   BARROW QUEST GHOST TASKS
   SAFE SPLIT (WORKS LIKE OLD QA SYSTEM)
========================================================= */

/* =========================================================
   SHARED GHOST POOLS
========================================================= */

export const ABBEY_GHOST_POOL = {
  kid: [
    "Stand still like you heard a ghost whisper.",
    "Do a brave monk pose.",
    "Point to where a ghost monk might appear.",
    "Whisper one word that fits the abbey.",
  ],

  teen: [
    "Name one thing here that makes the abbey feel eerie.",
    "Give this place a haunted-title in 3 words.",
    "Stand silent for 10 seconds and listen for echoes.",
    "What detail here would make the best ghost-story clue?",
  ],

  adult: [
    "Describe the abbey atmosphere in one word.",
    "What makes ruins especially effective for ghost stories?",
    "Does this place feel more haunted by memory, history, or imagination?",
    "What matters most here: stone, shadow, echo, or atmosphere?",
  ],
};

export const GENERIC_GHOST_POOL = {
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

/* =========================================================
   PIN GHOST CONTENT
========================================================= */

export const QA_GHOST_PIN_OVERRIDES = {
  abbey_ghost_cloister: {
    kid: [
      {
        q: "GHOST: Cloister Ghost! What should explorers use first in a spooky old place?",
        options: [
          "Courage and calm",
          "Shouting only",
          "Running into walls",
          "Throwing stones",
        ],
        answer: 0,
        fact: "The best explorers stay calm and brave.",
      },
    ],

    teen: [
      {
        q: "GHOST: Cloister Ghost! What gives a cloister its eerie power?",
        options: [
          "Silence, stone, and echo",
          "Traffic lights",
          "Loud music",
          "Shopping signs",
        ],
        answer: 0,
        fact: "Silent stone spaces and echoes give old cloisters their atmosphere.",
      },
    ],

    adult: [
      {
        q: "GHOST: Cloister Ghost! Why do enclosed ruin-spaces often feel haunted?",
        options: [
          "They combine memory, silence, and atmosphere",
          "They improve road traffic",
          "They generate electricity",
          "They hide market stalls",
        ],
        answer: 0,
        fact: "Enclosed ruins often feel haunted because place and imagination work together.",
      },
    ],
  },

  abbey_headless_monk: {
    kid: [
      {
        q: "GHOST ENCOUNTER: A monk appears in the mist. What should explorers use most?",
        options: [
          "Courage and calm",
          "Shouting only",
          "Running into walls",
          "Throwing mud",
        ],
        answer: 0,
        fact: "Ghost encounters work best with courage and calm.",
      },
    ],

    teen: [
      {
        q: "GHOST ENCOUNTER: What gives ghost stories their power?",
        options: [
          "Atmosphere and imagination",
          "Traffic lights",
          "Shopping receipts",
          "Bus timetables",
        ],
        answer: 0,
        fact: "Ghost stories work through atmosphere and imagination.",
      },
    ],

    adult: [
      {
        q: "GHOST ENCOUNTER: Why do haunted legends stay memorable?",
        options: [
          "They combine place, fear, and imagination",
          "They replace road signs",
          "They fuel factories",
          "They control harbour cranes",
        ],
        answer: 0,
        fact: "Haunted legends stay strong because they fuse place and imagination.",
      },
    ],
  },

  abbey_whispering_trees: {
    kid: [
      {
        q: "GHOST: Whispering Trees! What makes trees feel spooky in the wind?",
        options: [
          "Their sounds and shadows",
          "Their engines",
          "Their headlights",
          "Their concrete walls",
        ],
        answer: 0,
        fact: "Wind, shadows, and movement can make trees feel spooky.",
      },
    ],

    teen: [
      {
        q: "GHOST: Whispering Trees! What creates the eerie feeling here most?",
        options: [
          "Movement and sound",
          "Traffic cones",
          "Ticket barriers",
          "Shop windows",
        ],
        answer: 0,
        fact: "Movement and sound are often what make places feel eerie.",
      },
    ],

    adult: [
      {
        q: "GHOST: Whispering Trees! Why are natural spaces so effective in ghost stories?",
        options: [
          "Because sound, darkness, and uncertainty work together",
          "Because they improve Wi-Fi",
          "Because they store cargo",
          "Because they replace roads",
        ],
        answer: 0,
        fact: "Natural spaces often feel haunted because uncertainty and atmosphere build together.",
      },
    ],
  },
};

/* =========================================================
   GROUP GHOST CONTENT
========================================================= */

export const QA_GHOST_BY_GROUP = {
  abbey_history: {
    kid: [
      {
        q: "Why can abbey ruins feel spooky?",
        options: [
          "Because they are old and quiet",
          "Because they are made of plastic",
          "Because they are always bright",
          "Because they are motorways",
        ],
        answer: 0,
        fact: "Old quiet ruins can feel spooky because of silence, age, and imagination.",
      },
    ],

    teen: [
      {
        q: "What gives old abbey ruins their eerie feeling?",
        options: [
          "Silence, age, and atmosphere",
          "Traffic signs",
          "Modern adverts",
          "Airport noise",
        ],
        answer: 0,
        fact: "Abbey ruins often feel eerie because silence, age, and atmosphere combine.",
      },
    ],

    adult: [
      {
        q: "Why are abbey ruins strong ghost-story locations?",
        options: [
          "They combine memory, space, and atmosphere",
          "They are full of retail units",
          "They remove imagination",
          "They behave like office blocks",
        ],
        answer: 0,
        fact: "Abbey ruins are strong ghost-story locations because memory, space, and atmosphere combine there.",
      },
    ],
  },
};

/* =========================================================
   HELPERS
========================================================= */

function makePromptTask(text, id) {
  return {
    id,
    q: text,
    options: ["DONE", "NOT YET", "SKIP", "UNSAFE"],
    answer: 0,
    fact: "",
    meta: {
      promptOnly: true,
      mode: "ghost",
    },
  };
}

function toPromptTasks(list = [], prefix = "ghost") {
  return list.map((text, index) => makePromptTask(text, `${prefix}_${index + 1}`));
}

function getGroupFromPin(pinId, getGroupForPin) {
  if (typeof getGroupForPin === "function") {
    return getGroupForPin(pinId);
  }
  return null;
}

function isAbbeyGhostContext(pinId, group) {
  return (
    String(pinId || "").startsWith("abbey_") ||
    String(group || "") === "abbey_history"
  );
}

/* =========================================================
   MAIN GETTER
========================================================= */

export function getGhostForPin(pinId, tier = "kid", getGroupForPin) {
  const override = QA_GHOST_PIN_OVERRIDES[pinId];
  if (override && Array.isArray(override[tier]) && override[tier].length) {
    return override[tier];
  }

  const group = getGroupFromPin(pinId, getGroupForPin);
  const groupData = QA_GHOST_BY_GROUP[group];
  if (groupData && Array.isArray(groupData[tier]) && groupData[tier].length) {
    return groupData[tier];
  }

  if (isAbbeyGhostContext(pinId, group)) {
    return toPromptTasks(ABBEY_GHOST_POOL[tier] || ABBEY_GHOST_POOL.kid, `abbey_ghost_${tier}`);
  }

  return toPromptTasks(GENERIC_GHOST_POOL[tier] || GENERIC_GHOST_POOL.kid, `ghost_${tier}`);
}
