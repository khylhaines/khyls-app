/* =========================================================
   qa_groups.js
   BARROW QUEST GROUPS / FUN / RIDDLES / MODE POOLS
   SAFE SPLIT FROM qa.js
========================================================= */

function mq(id, difficulty, tags, q, options, answer, fact) {
  return {
    id: `mq_${id}`,
    difficulty,
    tags,
    q,
    options,
    answer,
    fact,
  };
}

/* =========================================================
   SHARED RIDDLE / FUN CONTENT
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
      teen: "What’s meant to dry things… but ends up wetter instead?",
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

export const BATTLE_POOL = {
  kid: [],
  teen: [],
  adult: [],
};

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
   GHOST / DISCOVERY SUPPORT POOLS
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
   DISCOVERY OVERRIDE CONTENT
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

/* =========================================================
   GHOST PIN CONTENT
========================================================= */

export const GHOST_PIN_CONTENT = {
  abbey_ghost_cloister: {
    ghost: {
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
  },

  abbey_headless_monk: {
    ghost: {
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
  },

  abbey_whispering_trees: {
    ghost: {
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
  },
};

/* =========================================================
   BOSS PIN CONTENT
========================================================= */

export const BOSS_PIN_CONTENT = {
  abbey_boss: {
    boss: {
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
  },

  park_boss_bandstand: {
    boss: {
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
  },

  park_boss_cenotaph: {
    boss: {
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
  },

  park_boss_skate: {
    boss: {
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
  },

  park_boss_mudman: {
    boss: {
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
  },
};

/* =========================================================
   OPTIONAL LOCAL HISTORY MASTER BANK
========================================================= */

export const HISTORY_MASTER_BANK = {
  kid: [
    mq(
      "h001",
      20,
      ["history", "town"],
      "What helped Barrow grow fast in the 1800s?",
      ["Iron and industry", "Snowstorms", "Volcanoes", "Castles"],
      0,
      "Iron, docks, and industry helped Barrow grow quickly."
    ),
    mq(
      "h002",
      24,
      ["history", "abbey"],
      "Who lived at Furness Abbey long ago?",
      ["Monks", "Pirates", "Astronauts", "Robots"],
      0,
      "Monks lived and worshipped at Furness Abbey."
    ),
    mq(
      "h003",
      18,
      ["history", "park"],
      "What is a bandstand mainly used for?",
      ["Music and performances", "Mining", "Fishing", "Rocket launches"],
      0,
      "Bandstands are used for music and performances."
    ),
  ],

  teen: [
    mq(
      "h101",
      130,
      ["history", "industry"],
      "What best explains Barrow’s rapid growth?",
      [
        "Industry, iron, and shipbuilding",
        "Only farming",
        "Royal palaces",
        "Tourism alone",
      ],
      0,
      "Barrow expanded rapidly through industry and shipbuilding."
    ),
    mq(
      "h102",
      138,
      ["history", "abbey"],
      "Which king closed many monasteries, including Furness Abbey?",
      ["Henry VIII", "King John", "Charles II", "Alfred"],
      0,
      "Henry VIII dissolved monasteries across England."
    ),
    mq(
      "h103",
      126,
      ["history", "memorial"],
      "What is the main purpose of a memorial or statue?",
      ["Public remembrance", "Road control", "Ticket sales", "Boat repair"],
      0,
      "Memorials and statues exist to support public remembrance."
    ),
  ],

  adult: [
    mq(
      "h201",
      240,
      ["history", "civic"],
      "How should central Barrow’s historic character be described?",
      [
        "Civic, industrial, and urban",
        "Purely rural",
        "Ancient royal",
        "Only recreational",
      ],
      0,
      "Central Barrow reflects civic life, industry, and urban development."
    ),
    mq(
      "h202",
      248,
      ["history", "abbey"],
      "What event ended Furness Abbey’s great power?",
      [
        "The Dissolution of the Monasteries",
        "A railway merger",
        "A coastal flood scheme",
        "A dock expansion",
      ],
      0,
      "The Dissolution ended its monastic power."
    ),
    mq(
      "h203",
      236,
      ["history", "docks"],
      "Why are the docks historically significant in Barrow?",
      [
        "They enabled industrial output and connections",
        "They existed only for sport",
        "They replaced rail completely",
        "They were built only for tourism",
      ],
      0,
      "The docks were critical to industrial transport and shipbuilding."
    ),
  ],
};

export function getHistoryMasterBank(tier = "kid") {
  return Array.isArray(HISTORY_MASTER_BANK[tier])
    ? HISTORY_MASTER_BANK[tier]
    : HISTORY_MASTER_BANK.kid;
}
