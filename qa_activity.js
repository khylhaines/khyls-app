/* =========================================================
   qa_activity.js
   OLD-STYLE MATCHING FILE FOR CURRENT qa.js
========================================================= */

export function getActivityQuestion(pin, tier = "kid") {
  const zone = pin?.zone || pin?.set || "core";
  const pinId = pin?.id || "";

  const OVERRIDES = {
    park_bandstand_core: {
      kid: "Dance like you're on stage!",
      teen: "Do a quick public performance.",
      adult: "Perform a full dance confidently.",
    },
  };

  const GROUPS = {
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

  const ACTIVITY_POOL = {
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

  if (OVERRIDES[pinId]?.[tier]) {
    return OVERRIDES[pinId][tier];
  }

  const group = pin?.qaGroup;
  if (group && GROUPS[group]?.[tier]?.length) {
    return GROUPS[group][tier][Math.floor(Math.random() * GROUPS[group][tier].length)];
  }

  if (ACTIVITY_POOL[tier]?.length) {
    return ACTIVITY_POOL[tier][Math.floor(Math.random() * ACTIVITY_POOL[tier].length)];
  }

  return "Look around and explore your surroundings.";
}

export const SPEED_POOL = {
  kid: [
    "Point to the nearest tree, sign, or bench.",
    "Can you stand on one foot without wobbling?",
    "Look around and tell me what you saw!",
    "Pull your silliest face!",
  ],
  teen: [
    "Quickly point out 3 things around you.",
    "Hold a one-foot balance with no wobbling.",
    "Scan and recall 3 things.",
    "Give your best dramatic face.",
  ],
  adult: [
    "Identify 3 nearby features within 10 seconds.",
    "Hold a stable one-foot balance position.",
    "Perform a quick scan, then recall 3 details.",
    "Display a bold or exaggerated expression.",
  ],
};
