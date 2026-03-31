/* =========================================================
   qa_activity.js
   BARROW QUEST ACTIVITIES / MOVEMENT / FUN TASKS
   SAFE SPLIT (WORKS LIKE OLD QA SYSTEM)
========================================================= */

/* =========================================================
   ACTIVITY BY GROUP
   (Same structure style as your old QA file)
========================================================= */

export const QA_ACTIVITY_BY_GROUP = {

  park_history: {
    kid: [
      {
        type: "movement",
        task: "Run to the nearest tree and back!",
        reward: 10
      },
      {
        type: "fun",
        task: "Spin around 5 times and point at something random!",
        reward: 10
      }
    ],

    teen: [
      {
        type: "challenge",
        task: "Do a full lap of the area without stopping.",
        reward: 20
      },
      {
        type: "fun",
        task: "Do a dance move in public for 5 seconds.",
        reward: 20
      }
    ],

    adult: [
      {
        type: "challenge",
        task: "Walk the longest visible path and return.",
        reward: 30
      },
      {
        type: "social",
        task: "Do a full dance (Macarena or similar) confidently.",
        reward: 30
      }
    ]
  },

  town_history: {
    kid: [
      {
        type: "observe",
        task: "Find something red nearby.",
        reward: 10
      }
    ],

    teen: [
      {
        type: "observe",
        task: "Spot 3 different buildings and describe them.",
        reward: 20
      }
    ],

    adult: [
      {
        type: "awareness",
        task: "Pause and observe your surroundings for 10 seconds.",
        reward: 25
      }
    ]
  },

  docks_submarines: {
    kid: [
      {
        type: "imagine",
        task: "Pretend you're steering a submarine!",
        reward: 10
      }
    ],

    teen: [
      {
        type: "challenge",
        task: "Walk in a straight line like you're on a ship deck.",
        reward: 20
      }
    ],

    adult: [
      {
        type: "focus",
        task: "Stand still and listen to all surrounding sounds.",
        reward: 30
      }
    ]
  },

  abbey_history: {
    kid: [
      {
        type: "explore",
        task: "Find something old or broken nearby.",
        reward: 10
      }
    ],

    teen: [
      {
        type: "explore",
        task: "Walk slowly and look for hidden details.",
        reward: 20
      }
    ],

    adult: [
      {
        type: "immersive",
        task: "Walk in silence and take in the atmosphere.",
        reward: 30
      }
    ]
  },

  islands_nature: {
    kid: [
      {
        type: "nature",
        task: "Find something that moves (bird, water, etc).",
        reward: 10
      }
    ],

    teen: [
      {
        type: "nature",
        task: "Look out to the horizon for 10 seconds.",
        reward: 20
      }
    ],

    adult: [
      {
        type: "mindful",
        task: "Stand still and feel the wind or air around you.",
        reward: 30
      }
    ]
  }

};

/* =========================================================
   PIN OVERRIDES (OPTIONAL — LIKE YOUR OLD SYSTEM)
========================================================= */

export const QA_ACTIVITY_PIN_OVERRIDES = {

  park_bandstand_core: {
    kid: [
      {
        type: "fun",
        task: "Dance like you're on stage!",
        reward: 15
      }
    ],
    teen: [
      {
        type: "fun",
        task: "Do a quick public performance (dance/move).",
        reward: 25
      }
    ],
    adult: [
      {
        type: "social",
        task: "Perform a full dance confidently (Macarena etc).",
        reward: 40
      }
    ]
  }

};

/* =========================================================
   SAFE GETTER (MATCHES YOUR OLD SYSTEM)
========================================================= */

export function getActivityForPin(pinId, tier = "kid", getGroupForPin) {

  // 1. PIN OVERRIDE (priority)
  const override = QA_ACTIVITY_PIN_OVERRIDES[pinId];
  if (override && override[tier]) {
    return override[tier];
  }

  // 2. GROUP BASE
  const group = getGroupForPin(pinId);
  const groupData = QA_ACTIVITY_BY_GROUP[group];

  if (groupData && groupData[tier]) {
    return groupData[tier];
  }

  // 3. FALLBACK (SAFE — never breaks app)
  return [
    {
      type: "fallback",
      task: "Look around and explore your surroundings.",
      reward: 5
    }
  ];
}
