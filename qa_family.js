/* =========================================================
   qa_family.js
   BARROW QUEST FAMILY TASKS
   SAFE SPLIT (WORKS LIKE OLD QA SYSTEM)
========================================================= */

/* =========================================================
   SHARED FAMILY POOL
========================================================= */

export const FAMILY_POOL = {
  kid: [
    "Everyone do the same silly walk together — no one can laugh!",
    "Surprise hug! Everyone in at once!",
    "Tap everyone’s shoulder — GO!",
    "Link up fast — don’t let the chain break!",
    "Act like a chicken for 5 seconds — LOUDLY!",
    "Say the weirdest word you can think of!",
    "Be a robot, pirate, or wizard — GO!",
    "Walk like a superhero… but WAY too dramatic!",
  ],

  teen: [
    "Move as a group doing the same ridiculous walk — stay in sync.",
    "Instant group hug — no warning, just go.",
    "Quick shoulder tap across the group — move fast.",
    "Link quickly — maintain full connection under pressure.",
    "Full animal mode — no holding back.",
    "Invent a nonsense phrase and shout it.",
    "Pick a role instantly — act it out.",
    "Over-the-top hero walk — no shame allowed.",
  ],

  adult: [
    "Perform a synchronised exaggerated walk together — maintain coordination.",
    "Immediate group embrace — brief and natural.",
    "Light shoulder tap across the group — quick connection.",
    "Rapid link formation — maintain cohesion.",
    "Perform a loud, exaggerated animal impression.",
    "Create and project a ridiculous phrase.",
    "Assume a character — commit briefly.",
    "Perform an exaggerated heroic walk — fully commit.",
  ],
};

/* =========================================================
   PIN OVERRIDES
========================================================= */

export const QA_FAMILY_PIN_OVERRIDES = {
  boating_lake_core: {
    kid: [
      {
        q: "What makes a lake stop good for families?",
        options: [
          "It feels calm and shared",
          "It is made for racing lorries",
          "It is only for machines",
          "It is too noisy to enjoy",
        ],
        answer: 0,
        fact: "Lake stops work well for families because they feel calm and shared.",
      },
    ],
    teen: [
      {
        q: "Why do family groups often enjoy lake areas?",
        options: [
          "They suit relaxed shared time",
          "They are industrial only",
          "They remove all atmosphere",
          "They are built for freight",
        ],
        answer: 0,
        fact: "Lake areas often suit relaxed shared family time.",
      },
    ],
    adult: [
      {
        q: "What makes a family-friendly waterfront stop effective?",
        options: [
          "Calm space and shared attention",
          "High-speed traffic",
          "Industrial isolation",
          "Noise dominance",
        ],
        answer: 0,
        fact: "Family-friendly waterfront stops work best through calm space and shared attention.",
      },
    ],
  },

  park_playground: {
    kid: [
      {
        q: "What is a playground best for?",
        options: [
          "Playing together",
          "Launching ships",
          "Fixing trains",
          "Storing cargo",
        ],
        answer: 0,
        fact: "Playgrounds are built for shared play and movement.",
      },
    ],
    teen: [
      {
        q: "What makes playground stops good for family mode?",
        options: [
          "Shared action and fun",
          "Heavy machinery",
          "Silent storage",
          "Transport control",
        ],
        answer: 0,
        fact: "Playground stops are good for family mode because they support shared fun.",
      },
    ],
    adult: [
      {
        q: "Why do playground spaces matter in family routes?",
        options: [
          "They create active shared experience",
          "They reduce all interaction",
          "They serve industrial work",
          "They function as freight zones",
        ],
        answer: 0,
        fact: "Playground spaces matter because they create active shared experience.",
      },
    ],
  },

  park_cafe_core: {
    kid: [
      {
        q: "Why is a café a good family stop?",
        options: [
          "People can gather there",
          "It launches rockets",
          "It controls traffic",
          "It makes storms",
        ],
        answer: 0,
        fact: "Cafés work well as family stops because people can gather there.",
      },
    ],
    teen: [
      {
        q: "What makes a park café useful on a family route?",
        options: [
          "It gives a shared pause point",
          "It is a cargo depot",
          "It is a dock gate",
          "It removes atmosphere",
        ],
        answer: 0,
        fact: "A park café gives a route a shared pause point.",
      },
    ],
    adult: [
      {
        q: "What role does a café often play in a family experience?",
        options: [
          "Social pause and regrouping",
          "Industrial control",
          "Defensive access",
          "Transport scheduling",
        ],
        answer: 0,
        fact: "Cafés often serve as social pause and regrouping points.",
      },
    ],
  },

  earnse_bay: {
    kid: [
      {
        q: "What makes the seaside good for family time?",
        options: [
          "Wide space and views",
          "Only loud machines",
          "Dark tunnels",
          "Train tracks",
        ],
        answer: 0,
        fact: "Seaside places are often good for family time because of open space and views.",
      },
    ],
    teen: [
      {
        q: "Why do coastal places work well for families?",
        options: [
          "They feel open and shared",
          "They are built for freight only",
          "They are closed in",
          "They stop conversation",
        ],
        answer: 0,
        fact: "Coastal places often work well for families because they feel open and shared.",
      },
    ],
    adult: [
      {
        q: "What is one strong family advantage of a coastal stop?",
        options: [
          "Shared space and atmosphere",
          "Industrial speed",
          "Restricted movement",
          "Noise pressure",
        ],
        answer: 0,
        fact: "A coastal stop offers shared space and atmosphere for family groups.",
      },
    ],
  },
};

/* =========================================================
   GROUP FAMILY CONTENT
========================================================= */

export const QA_FAMILY_BY_GROUP = {
  park_history: {
    kid: [
      {
        q: "What makes a park good for families?",
        options: [
          "Space to play together",
          "Submarine testing",
          "Heavy traffic",
          "Cargo storage",
        ],
        answer: 0,
        fact: "Parks are good for families because they give space to play together.",
      },
    ],
    teen: [
      {
        q: "Why do parks work well in family mode?",
        options: [
          "They support shared activity",
          "They remove fun",
          "They are built for lorries",
          "They stop movement",
        ],
        answer: 0,
        fact: "Parks work well in family mode because they support shared activity.",
      },
    ],
    adult: [
      {
        q: "What is the strongest family value of a public park?",
        options: [
          "Shared social space",
          "Private industrial use",
          "Restricted movement",
          "Freight handling",
        ],
        answer: 0,
        fact: "A public park’s strongest family value is shared social space.",
      },
    ],
  },

  islands_nature: {
    kid: [
      {
        q: "Why do beaches and coastal places feel fun for families?",
        options: [
          "They feel open and exciting",
          "They are full of factories",
          "They are tiny dark rooms",
          "They stop people talking",
        ],
        answer: 0,
        fact: "Coastal places often feel fun for families because they feel open and exciting.",
      },
    ],
    teen: [
      {
        q: "What makes a coastal stop work in family mode?",
        options: [
          "Shared views and open space",
          "Freight machinery",
          "Traffic noise only",
          "Closed industrial yards",
        ],
        answer: 0,
        fact: "Shared views and open space help coastal stops work in family mode.",
      },
    ],
    adult: [
      {
        q: "Why are coastal locations strong for family routes?",
        options: [
          "Atmosphere and shared openness",
          "Security restrictions",
          "Industrial output",
          "Urban pressure",
        ],
        answer: 0,
        fact: "Coastal locations are strong for family routes because of atmosphere and shared openness.",
      },
    ],
  },

  town_history: {
    kid: [
      {
        q: "What makes a place family-friendly?",
        options: [
          "People can enjoy it together",
          "It is dangerous and noisy",
          "It is only for lorries",
          "It is always closed",
        ],
        answer: 0,
        fact: "Family-friendly places are ones people can enjoy together.",
      },
    ],
    teen: [
      {
        q: "What matters most in a family stop?",
        options: [
          "Shared experience",
          "Fast traffic",
          "Noise only",
          "Being uncomfortable",
        ],
        answer: 0,
        fact: "Family stops work best when they create shared experience.",
      },
    ],
    adult: [
      {
        q: "What is central to a strong family location?",
        options: [
          "Comfort and shared engagement",
          "Pure efficiency",
          "Restricted access",
          "Industrial isolation",
        ],
        answer: 0,
        fact: "A strong family location depends on comfort and shared engagement.",
      },
    ],
  },

  abbey_history: {
    kid: [
      {
        q: "Can old places still be fun to explore together?",
        options: [
          "Yes",
          "No",
          "Only for robots",
          "Only at night",
        ],
        answer: 0,
        fact: "Old places can still be great to explore together.",
      },
    ],
    teen: [
      {
        q: "Why can abbey areas still work in family mode?",
        options: [
          "They mix history and exploration",
          "They remove all fun",
          "They are only for machines",
          "They are just storage",
        ],
        answer: 0,
        fact: "Abbey areas work in family mode because they mix history and exploration.",
      },
    ],
    adult: [
      {
        q: "What makes a historic site usable for family exploration?",
        options: [
          "Shared curiosity",
          "Industrial pressure",
          "Noise dominance",
          "Freight movement",
        ],
        answer: 0,
        fact: "Historic sites work for family exploration when they create shared curiosity.",
      },
    ],
  },

  docks_submarines: {
    kid: [
      {
        q: "What makes a family stop interesting near the docks?",
        options: [
          "Big things to look at together",
          "Nothing at all",
          "Only closed doors",
          "No views",
        ],
        answer: 0,
        fact: "Dock areas can be interesting for families because there are big things to look at together.",
      },
    ],
    teen: [
      {
        q: "Why can docks still work as a family route stop?",
        options: [
          "They create shared curiosity",
          "They remove all atmosphere",
          "They are only silence",
          "They stop observation",
        ],
        answer: 0,
        fact: "Dock stops can work for families when they create shared curiosity.",
      },
    ],
    adult: [
      {
        q: "What gives an industrial location family-route value?",
        options: [
          "Scale and shared observation",
          "Restricted silence",
          "Speed alone",
          "Isolation only",
        ],
        answer: 0,
        fact: "Industrial locations gain family-route value through scale and shared observation.",
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

function makePromptTask(text, id) {
  return {
    id,
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

function toPromptTasks(list = [], prefix = "family") {
  return list.map((text, index) => makePromptTask(text, `${prefix}_${index + 1}`));
}

/* =========================================================
   MAIN GETTER
========================================================= */

export function getFamilyForPin(pinId, tier = "kid", getGroupForPin) {
  const override = QA_FAMILY_PIN_OVERRIDES[pinId];
  if (override && Array.isArray(override[tier]) && override[tier].length) {
    return override[tier];
  }

  const group = getGroupFromPin(pinId, getGroupForPin);
  const groupData = QA_FAMILY_BY_GROUP[group];
  if (groupData && Array.isArray(groupData[tier]) && groupData[tier].length) {
    return groupData[tier];
  }

  return toPromptTasks(FAMILY_POOL[tier] || FAMILY_POOL.kid, `family_${tier}`);
}
