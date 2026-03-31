/* =========================================================
   qa_groups.js
   MATCHES CURRENT qa.js
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
      kid: "What has one eye, but can’t see at all?",
      teen: "What has one eye but is completely blind?",
      adult: "What has an eye, yet lacks all ability to see?",
    },
    a: "A needle",
  },
  {
    q: {
      kid: "What can you catch, but never throw?",
      teen: "What can you catch, but you definitely can’t throw back?",
      adult: "What can be caught, yet cannot be thrown?",
    },
    a: "A cold",
  },
];

export const HISTORY_MASTER_BANK = {
  kid: [
    {
      id: "h001",
      difficulty: 20,
      tags: ["history", "town"],
      q: "What helped Barrow grow fast in the 1800s?",
      options: ["Iron and industry", "Snowstorms", "Volcanoes", "Castles"],
      answer: 0,
      fact: "Iron, docks, and industry helped Barrow grow quickly.",
    },
    {
      id: "h002",
      difficulty: 24,
      tags: ["history", "abbey"],
      q: "Who lived at Furness Abbey long ago?",
      options: ["Monks", "Pirates", "Astronauts", "Robots"],
      answer: 0,
      fact: "Monks lived and worshipped at Furness Abbey.",
    },
    {
      id: "h003",
      difficulty: 18,
      tags: ["history", "park"],
      q: "What is a bandstand mainly used for?",
      options: ["Music and performances", "Mining", "Fishing", "Rocket launches"],
      answer: 0,
      fact: "Bandstands are used for music and performances.",
    },
  ],

  teen: [
    {
      id: "h101",
      difficulty: 130,
      tags: ["history", "industry"],
      q: "What best explains Barrow’s rapid growth?",
      options: [
        "Industry, iron, and shipbuilding",
        "Only farming",
        "Royal palaces",
        "Tourism alone",
      ],
      answer: 0,
      fact: "Barrow expanded rapidly through industry and shipbuilding.",
    },
    {
      id: "h102",
      difficulty: 138,
      tags: ["history", "abbey"],
      q: "Which king closed many monasteries, including Furness Abbey?",
      options: ["Henry VIII", "King John", "Charles II", "Alfred"],
      answer: 0,
      fact: "Henry VIII dissolved monasteries across England.",
    },
    {
      id: "h103",
      difficulty: 126,
      tags: ["history", "memorial"],
      q: "What is the main purpose of a memorial or statue?",
      options: ["Public remembrance", "Road control", "Ticket sales", "Boat repair"],
      answer: 0,
      fact: "Memorials and statues exist to support public remembrance.",
    },
  ],

  adult: [
    {
      id: "h201",
      difficulty: 240,
      tags: ["history", "civic"],
      q: "How should central Barrow’s historic character be described?",
      options: [
        "Civic, industrial, and urban",
        "Purely rural",
        "Ancient royal",
        "Only recreational",
      ],
      answer: 0,
      fact: "Central Barrow reflects civic life, industry, and urban development.",
    },
    {
      id: "h202",
      difficulty: 248,
      tags: ["history", "abbey"],
      q: "What event ended Furness Abbey’s great power?",
      options: [
        "The Dissolution of the Monasteries",
        "A railway merger",
        "A coastal flood scheme",
        "A dock expansion",
      ],
      answer: 0,
      fact: "The Dissolution ended its monastic power.",
    },
    {
      id: "h203",
      difficulty: 236,
      tags: ["history", "docks"],
      q: "Why are the docks historically significant in Barrow?",
      options: [
        "They enabled industrial output and connections",
        "They existed only for sport",
        "They replaced rail completely",
        "They were built only for tourism",
      ],
      answer: 0,
      fact: "The docks were critical to industrial transport and shipbuilding.",
    },
  ],
};

export function getHistoryMasterBank(tier = "kid") {
  return Array.isArray(HISTORY_MASTER_BANK[tier])
    ? HISTORY_MASTER_BANK[tier]
    : HISTORY_MASTER_BANK.kid;
}
