/* =========================================================
   qa_activity.js
   BARROW QUEST ACTIVITIES / SPEED / DISCOVERY
   CLEAN SPLIT FOR qa.js
========================================================= */

/* =========================================================
   SHARED ACTIVITY POOL
========================================================= */

export const ACTIVITY_POOL = {
  kid: [
    "You’re the captain now — steer your ship!",
    "Stand tall and give your best salute!",
    "Find the brightest thing you can see!",
    "Celebrate like you just beat a boss!",
    "GO! First to touch a tree, bench, or sign wins!",
    "One leads — everyone copy them!",
    "Do the silliest walk you can!",
    "Shout a funny word!",
    "Everyone together — don’t break the chain!",
    "GO! Do 3 things in a row as fast as you can!",
    "GO! First to touch something metal wins!",
    "Who can clap 3 times the fastest?",
    "GO! Follow the leader — don’t get left behind!",
  ],

  teen: [
    "You’re in control — act like you’re steering something big.",
    "Give a clean, sharp salute.",
    "What stands out the most here?",
    "Hit a victory pose like you just won.",
    "GO — first to reach a tree, bench, or sign wins.",
    "Pick a leader — everyone mirrors them.",
    "Do the most ridiculous walk you can think of.",
    "Say something random or weird out loud.",
    "Stay linked — no one breaks formation.",
    "GO — complete 3 actions back-to-back, fast.",
    "GO — first to find and touch something metal wins.",
    "First to clap 3 times wins.",
    "GO — stay with the leader, no gaps.",
  ],

  adult: [
    "Simulate controlling a vehicle or vessel.",
    "Perform a respectful gesture.",
    "Identify the most visually prominent feature.",
    "Celebrate like you’ve just won.",
    "On signal, reach a nearby object — tree, bench, or sign.",
    "One person leads, others mirror the movement.",
    "Perform a deliberately exaggerated or comedic walk.",
    "Say something unusual out loud.",
    "Maintain group formation while moving.",
    "On signal, execute 3 rapid actions in sequence.",
    "On signal, reach and touch a metal object.",
    "Complete 3 claps — fastest wins.",
    "On signal, follow the leader without losing pace.",
  ],
};

/* =========================================================
   SPEED POOL
========================================================= */

export const SPEED_POOL = {
  kid: [
    "Point to the nearest tree, sign, or bench.",
    "Can you stand on one foot without wobbling?",
    "Look around… now tell me what you saw!",
    "Pull your silliest face!",
    "Close your eyes — what can you hear?",
    "Give this place a fun name.",
    "Wait… GO! Clap as fast as you can!",
    "Show me where you would go to leave this area.",
    "Find something that might not be safe here.",
    "Pick: coins, clue, or bonus!",
    "Be a statue… don’t move!",
    "Bounce 3 times like a spring!",
  ],

  teen: [
    "Quickly point out 3 things around you.",
    "Hold a one-foot balance — no wobbling allowed.",
    "Scan, turn, recall — name 3 things.",
    "Give your best dramatic face.",
    "Pause and listen — what stands out most?",
    "Invent a quick slogan for this spot.",
    "Wait for it… GO! React instantly.",
    "Point to the fastest way out of here.",
    "What’s one thing here that could be risky?",
    "Choose fast: coins, clue, or power-up.",
    "Go completely still — statue mode.",
    "3 fast jumps — no delay.",
  ],

  adult: [
    "Identify 3 nearby features within 10 seconds.",
    "Hold a stable one-foot balance position.",
    "Perform a quick scan, then recall 3 details accurately.",
    "Display a bold or exaggerated expression.",
    "Pause briefly and identify the most noticeable sound.",
    "Create a concise description of this location.",
    "Delay, then react immediately on cue.",
    "Indicate the most efficient exit route.",
    "Identify one potential risk in the environment.",
    "Make a quick choice: reward, clue, or advantage.",
    "Enter full stillness — no movement.",
    "Execute 3 rapid jumps without pause.",
  ],
};

/* =========================================================
   OPTIONAL BATTLE POOL
========================================================= */

export const BATTLE_POOL = {
  kid: [],
  teen: [],
  adult: [],
};

/* =========================================================
   ACTIVITY BY GROUP
   Must match qa.js format
========================================================= */

export const QA_ACTIVITY_BY_GROUP = {
  park_history: {
    activity: {
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
  },

  town_history: {
    activity: {
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
  },

  docks_submarines: {
    activity: {
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
  },

  abbey_history: {
    activity: {
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
  },

  islands_nature: {
    activity: {
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
  },
};

/* =========================================================
   PIN OVERRIDES
   Must match qa.js expectations
========================================================= */

export const QA_PIN_OVERRIDES = {
  park_bandstand_core: {
    activity: {
      kid: [
        "Dance like you're on stage!",
      ],
      teen: [
        "Do a quick public performance.",
      ],
      adult: [
        "Perform a full dance confidently.",
      ],
    },
  },
};

/* =========================================================
   DISCOVERY CONTENT
========================================================= */

export const DISCOVERY_PIN_CONTENT = {
  park_hidden_old_tree: {
    discovery: {
      kid: [
        {
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
      ],
      teen: [
        {
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
      ],
      adult: [
        {
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
      ],
    },
  },

  park_hidden_quiet_bench: {
    discovery: {
      kid: [
        {
          q: "DISCOVERY: Why is a quiet bench useful in a park?",
          options: [
            "It gives a calm place to rest",
            "It launches boats",
            "It repairs trains",
            "It grows apples",
          ],
          answer: 0,
          fact: "Quiet places help explorers rest and notice more.",
        },
      ],
      teen: [
        {
          q: "DISCOVERY: What does a hidden quiet bench add to a map?",
          options: [
            "A pause point",
            "A boss arena",
            "A market route",
            "A repair station",
          ],
          answer: 0,
          fact: "Quiet bench spots create pause points in a route.",
        },
      ],
      adult: [
        {
          q: "DISCOVERY: What is valuable about hidden quiet spots?",
          options: [
            "They create reflection and contrast",
            "They produce power",
            "They direct traffic",
            "They store freight",
          ],
          answer: 0,
          fact: "Quiet hidden spots give reflection and contrast.",
        },
      ],
    },
  },

  park_hidden_secret_garden: {
    discovery: {
      kid: [
        {
          q: "DISCOVERY: What makes a secret garden feel special?",
          options: [
            "It feels hidden and magical",
            "It feels like a motorway",
            "It is noisy machinery",
            "It is a shipyard",
          ],
          answer: 0,
          fact: "Secret gardens feel special because they seem hidden and magical.",
        },
      ],
      teen: [
        {
          q: "DISCOVERY: Why do hidden garden spots work well in games?",
          options: [
            "They feel like secret rewards",
            "They feel like traffic jams",
            "They remove exploration",
            "They act like factories",
          ],
          answer: 0,
          fact: "Hidden gardens feel like secret rewards.",
        },
      ],
      adult: [
        {
          q: "DISCOVERY: What does a hidden garden add to a quest map?",
          options: [
            "Atmosphere and contrast",
            "Freight logistics",
            "Industrial output",
            "Street lighting only",
          ],
          answer: 0,
          fact: "A hidden garden adds atmosphere and contrast.",
        },
      ],
    },
  },

  park_hidden_lake_spot: {
    discovery: {
      kid: [
        {
          q: "DISCOVERY: What makes lake spots fun for explorers?",
          options: [
            "They are calm and scenic",
            "They are loud factories",
            "They are airport gates",
            "They are bus depots",
          ],
          answer: 0,
          fact: "Lake spots often feel calm and scenic.",
        },
      ],
      teen: [
        {
          q: "DISCOVERY: What vibe does a hidden lake spot usually give?",
          options: [
            "Calm and observation",
            "Panic and noise",
            "Cargo loading",
            "City traffic",
          ],
          answer: 0,
          fact: "Hidden lake spots work well as calm observation points.",
        },
      ],
      adult: [
        {
          q: "DISCOVERY: What does water add to a route experience?",
          options: [
            "Pause and atmosphere",
            "Only danger",
            "Only commerce",
            "Only speed",
          ],
          answer: 0,
          fact: "Water often adds pause and atmosphere.",
        },
      ],
    },
  },

  abbey_hidden_stone: {
    discovery: {
      kid: [
        {
          q: "DISCOVERY: A silent stone is hidden here. Why do stones matter in ruins?",
          options: [
            "They carry clues from the past",
            "They are remote controls",
            "They run trains",
            "They sell tickets",
          ],
          answer: 0,
          fact: "Stones in ruins can feel like clues from the past.",
        },
      ],
    },
  },

  abbey_hidden_mirror: {
    discovery: {
      teen: [
        {
          q: "DISCOVERY: Valley Mirror found. What do reflective hidden spots add?",
          options: [
            "Mood and mystery",
            "Cargo loading",
            "Market noise",
            "Traffic policing",
          ],
          answer: 0,
          fact: "Reflective hidden spots add mood and mystery.",
        },
      ],
    },
  },

  abbey_hidden_forge: {
    discovery: {
      adult: [
        {
          q: "DISCOVERY: Iron Forge Ruins found. What does a forge site suggest?",
          options: [
            "Labour and transformation",
            "Beach tourism only",
            "Airport lounges",
            "Religious silence only",
          ],
          answer: 0,
          fact: "Forge ruins suggest labour, heat, and transformation.",
        },
      ],
    },
  },
};
