/* =========================================================
   qa_boss.js
   BARROW QUEST BOSS TASKS
   SAFE SPLIT (WORKS LIKE OLD QA SYSTEM)
========================================================= */

/* =========================================================
   PIN BOSS CONTENT
========================================================= */

export const QA_BOSS_PIN_OVERRIDES = {
  abbey_boss: {
    kid: [
      {
        q: "Final Abbey Trial: Who lived here long ago?",
        options: ["Monks", "Aliens", "Pirates", "Cheese wizards"],
        answer: 0,
        fact: "Monks lived at Furness Abbey for centuries.",
      },
    ],

    teen: [
      {
        q: "FINAL BOSS: What event ended the abbey’s power?",
        options: [
          "The Dissolution of the Monasteries",
          "A volcano",
          "A railway crash",
          "A football riot",
        ],
        answer: 0,
        fact: "The Dissolution of the Monasteries ended its power.",
      },
    ],

    adult: [
      {
        q: "FINAL BOSS: What does Furness Abbey most strongly represent?",
        options: [
          "Religious power, memory, and political change",
          "Modern retail expansion",
          "Airport growth",
          "Weapons testing",
        ],
        answer: 0,
        fact: "It represents religious power, memory, and political change.",
      },
    ],
  },

  park_boss_bandstand: {
    kid: [
      {
        q: "BOSS: Festival Revival! What is this place linked to?",
        options: [
          "Music and performance",
          "Mining",
          "Air travel",
          "Submarine docks",
        ],
        answer: 0,
        fact: "The bandstand is linked to music and public performance.",
      },
    ],

    teen: [
      {
        q: "BOSS: Festival Revival! What atmosphere fits this place best?",
        options: [
          "Performance and celebration",
          "Heavy industry",
          "Silent prayer only",
          "Airport security",
        ],
        answer: 0,
        fact: "This boss is tied to performance and celebration.",
      },
    ],

    adult: [
      {
        q: "BOSS: Festival Revival! What public role does a bandstand often symbolise?",
        options: [
          "Shared entertainment and gathering",
          "Freight shipping",
          "Border defence",
          "Agricultural storage",
        ],
        answer: 0,
        fact: "Bandstands often symbolise gathering and entertainment.",
      },
    ],
  },

  park_boss_cenotaph: {
    kid: [
      {
        q: "BOSS: Memory Keeper! What does the cenotaph honour?",
        options: [
          "Those lost in war",
          "Football winners",
          "Train drivers",
          "Shop owners",
        ],
        answer: 0,
        fact: "The cenotaph honours those lost in war.",
      },
    ],

    teen: [
      {
        q: "BOSS: Memory Keeper! Why should this place be treated respectfully?",
        options: [
          "It is a memorial space",
          "It is a car park",
          "It is a skate zone",
          "It is a market lane",
        ],
        answer: 0,
        fact: "It is a memorial space for remembrance.",
      },
    ],

    adult: [
      {
        q: "BOSS: Memory Keeper! What civic purpose does a cenotaph serve?",
        options: [
          "Collective remembrance",
          "Retail promotion",
          "Cargo storage",
          "Ticket inspection",
        ],
        answer: 0,
        fact: "It serves collective remembrance.",
      },
    ],
  },

  park_boss_skate: {
    kid: [
      {
        q: "BOSS: Park Champion! What matters most during a challenge?",
        options: [
          "Trying your best safely",
          "Cheating fast",
          "Giving up",
          "Ignoring everyone",
        ],
        answer: 0,
        fact: "The best win is doing your best safely.",
      },
    ],

    teen: [
      {
        q: "BOSS: Park Champion! What makes a strong challenger?",
        options: [
          "Confidence and control",
          "Chaos only",
          "Running away",
          "Breaking rules",
        ],
        answer: 0,
        fact: "A strong challenger shows confidence and control.",
      },
    ],

    adult: [
      {
        q: "BOSS: Park Champion! What does challenge mode reward most?",
        options: [
          "Skill, movement, and effort",
          "Noise only",
          "Stillness only",
          "Luck alone",
        ],
        answer: 0,
        fact: "Challenge mode rewards effort and skill.",
      },
    ],
  },

  park_boss_mudman: {
    kid: [
      {
        q: "BOSS: Mudman Mystery! What best fits a mystery boss?",
        options: [
          "Clues and careful thinking",
          "Only shouting",
          "Only running",
          "Only sleeping",
        ],
        answer: 0,
        fact: "Mystery bosses are about clues and thinking.",
      },
    ],

    teen: [
      {
        q: "BOSS: Mudman Mystery! What wins a mystery challenge?",
        options: [
          "Observation and logic",
          "Random guessing only",
          "Ignoring clues",
          "Walking away",
        ],
        answer: 0,
        fact: "Observation and logic win mystery challenges.",
      },
    ],

    adult: [
      {
        q: "BOSS: Mudman Mystery! What makes mystery pins satisfying?",
        options: [
          "Pattern, clue, and reveal",
          "Pure noise",
          "Fast driving",
          "Ticket scanning",
        ],
        answer: 0,
        fact: "Mystery works through pattern, clue, and reveal.",
      },
    ],
  },
};

/* =========================================================
   GROUP BOSS CONTENT
========================================================= */

export const QA_BOSS_BY_GROUP = {
  abbey_history: {
    kid: [
      {
        q: "BOSS: What kind of place was Furness Abbey?",
        options: [
          "A monastery",
          "A shopping centre",
          "A race track",
          "A bus station",
        ],
        answer: 0,
        fact: "Furness Abbey was a monastery.",
      },
    ],

    teen: [
      {
        q: "BOSS: Which king closed many monasteries, including Furness Abbey?",
        options: ["Henry VIII", "King John", "Charles II", "Alfred"],
        answer: 0,
        fact: "Henry VIII dissolved monasteries across England.",
      },
    ],

    adult: [
      {
        q: "BOSS: What event ended Furness Abbey’s great power?",
        options: [
          "The Dissolution of the Monasteries",
          "A railway merger",
          "A coastal flood scheme",
          "A dock expansion",
        ],
        answer: 0,
        fact: "The Dissolution ended its monastic power.",
      },
    ],
  },

  park_cenotaph: {
    kid: [
      {
        q: "BOSS: What does the cenotaph honour?",
        options: [
          "Those lost in war",
          "Football winners",
          "Shop owners",
          "Bus drivers only",
        ],
        answer: 0,
        fact: "The cenotaph honours those lost in war.",
      },
    ],

    teen: [
      {
        q: "BOSS: Why should a cenotaph be treated respectfully?",
        options: [
          "It is a memorial space",
          "It is a race track",
          "It is a market lane",
          "It is a skate zone",
        ],
        answer: 0,
        fact: "A cenotaph is a memorial space for remembrance.",
      },
    ],

    adult: [
      {
        q: "BOSS: What civic purpose does a cenotaph serve?",
        options: [
          "Collective remembrance",
          "Retail promotion",
          "Cargo storage",
          "Traffic control",
        ],
        answer: 0,
        fact: "A cenotaph serves collective remembrance.",
      },
    ],
  },

  park_history: {
    kid: [
      {
        q: "BOSS: What is a bandstand mainly used for?",
        options: [
          "Music and performances",
          "Fixing tractors",
          "Rocket launches",
          "Fishing boats",
        ],
        answer: 0,
        fact: "Bandstands are used for music and performances.",
      },
    ],

    teen: [
      {
        q: "BOSS: What atmosphere fits a bandstand best?",
        options: [
          "Performance and celebration",
          "Heavy industry",
          "Freight loading",
          "Road repair",
        ],
        answer: 0,
        fact: "A bandstand is tied to performance and celebration.",
      },
    ],

    adult: [
      {
        q: "BOSS: What public role does a bandstand often symbolise?",
        options: [
          "Shared entertainment and gathering",
          "Freight shipping",
          "Border defence",
          "Industrial storage",
        ],
        answer: 0,
        fact: "Bandstands often symbolise gathering and entertainment.",
      },
    ],
  },
};

/* =========================================================
   HELPERS
========================================================= */

function getGroupFromPin(pinId, getGroupForPin) {
  if (typeof getGroupForPin === "function") {
    return getGroupForPin(pinId);
  }
  return null;
}

function buildFallbackBoss(tier = "kid") {
  if (tier === "adult") {
    return [
      {
        q: "BOSS: What matters most in a final trial?",
        options: [
          "Focus and correct reasoning",
          "Random guessing",
          "Ignoring clues",
          "Rushing badly",
        ],
        answer: 0,
        fact: "Final trials are won through focus and correct reasoning.",
      },
    ];
  }

  if (tier === "teen") {
    return [
      {
        q: "BOSS: What helps most in a final challenge?",
        options: [
          "Focus and control",
          "Guessing wildly",
          "Walking away",
          "Ignoring the task",
        ],
        answer: 0,
        fact: "Boss challenges are beaten through focus and control.",
      },
    ];
  }

  return [
    {
      q: "BOSS: What helps you win a final challenge?",
      options: [
        "Thinking carefully",
        "Cheating",
        "Giving up",
        "Ignoring clues",
      ],
      answer: 0,
      fact: "Thinking carefully helps you win final challenges.",
    },
  ];
}

/* =========================================================
   MAIN GETTER
========================================================= */

export function getBossForPin(pinId, tier = "kid", getGroupForPin) {
  const pinOverride = QA_BOSS_PIN_OVERRIDES[pinId];
  if (pinOverride && Array.isArray(pinOverride[tier]) && pinOverride[tier].length) {
    return pinOverride[tier];
  }

  const group = getGroupFromPin(pinId, getGroupForPin);
  const groupPool = QA_BOSS_BY_GROUP[group];
  if (groupPool && Array.isArray(groupPool[tier]) && groupPool[tier].length) {
    return groupPool[tier];
  }

  return buildFallbackBoss(tier);
}
