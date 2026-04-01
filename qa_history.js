/* =========================================================
   qa_history.js
   BARROW QUEST HISTORY / START INTROS / HISTORY OVERRIDES
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
   START INTROS
========================================================= */

export const PIN_START_INTROS = {
  home_base_marsh_st: {
    kid: "Home Base reached. This is where your Barrow Quest begins.",
    teen:
      "Home Base reached. This is your reset point before the map opens into bigger stories.",
    adult:
      "Home Base reached. This is your point of origin — where every route and decision begins.",
  },

  cenotaph_core: {
    kid: "The Cenotaph reached. This is a place to remember brave people and show respect.",
    teen:
      "The Cenotaph reached. This landmark is about memory, sacrifice, and respect.",
    adult:
      "The Cenotaph reached. You are entering a space of civic remembrance and collective memory.",
  },

  park_bandstand_core: {
    kid: "Park Bandstand reached. This is a fun place linked to music and performances.",
    teen:
      "Park Bandstand reached. This is a performance space and part of the park’s public life.",
    adult:
      "Park Bandstand reached. This pin marks a civic leisure structure built for gathering and performance.",
  },

  furness_abbey_core: {
    kid: "Furness Abbey reached. These old ruins are full of mystery and history.",
    teen:
      "Furness Abbey reached. This is one of the deepest history pins on the map.",
    adult:
      "Furness Abbey reached. You are entering one of the most historically charged sites in the region.",
  },

  town_hall_clock: {
    kid: "Town Hall Clock reached. This is one of the most important places in town.",
    teen:
      "Town Hall Clock reached. This landmark is part of the town’s civic heartbeat.",
    adult:
      "Town Hall Clock reached. You are standing at a civic time-marker and public symbol.",
  },

  dock_museum_anchor: {
    kid: "Dock Museum Anchor reached. This area is all about ships and Barrow’s dock history.",
    teen:
      "Dock Museum Anchor reached. This pin marks one of the strongest maritime identities on the map.",
    adult:
      "Dock Museum Anchor reached. You are stepping into Barrow’s maritime-industrial narrative.",
  },

  dock_museum_submarine: {
    kid: "Dock Museum Submarine reached. This is where Barrow’s ship story becomes huge.",
    teen:
      "Dock Museum Submarine reached. This landmark connects the town’s past and present through engineering.",
    adult:
      "Dock Museum Submarine reached. This is one of the clearest expressions of Barrow’s strategic-industrial identity.",
  },

  henry_schneider_statue: {
    kid: "Statue of Henry Schneider reached. This place remembers an important figure in Barrow’s history.",
    teen:
      "Statue of Henry Schneider reached. This is a landmark tied to people who helped Barrow grow.",
    adult:
      "Statue of Henry Schneider reached. This monument represents industrial change and public memory.",
  },

  james_ramsden_statue: {
    kid: "Statue of James Ramsden reached. This pin remembers one of the men linked to Barrow’s growth.",
    teen: "Statue of James Ramsden reached. This is one of the town’s memory-markers.",
    adult:
      "Statue of James Ramsden reached. This monument reflects leadership, ambition, and public memory.",
  },

  barrow_library: {
    kid: "Barrow Library reached. This is a place full of stories and facts.",
    teen:
      "Barrow Library reached. This pin is about knowledge, memory, and local culture.",
    adult:
      "Barrow Library reached. You are entering a civic archive of learning and memory.",
  },

  custom_house: {
    kid: "The Custom House reached. This building connects to trade and town history.",
    teen:
      "The Custom House reached. This pin is tied to movement, administration, and exchange.",
    adult:
      "The Custom House reached. This is a threshold building where trade and civic regulation meet.",
  },

  emlyn_hughes_statue: {
    kid: "Emlyn Hughes Statue reached. This pin celebrates a famous footballer from Barrow.",
    teen:
      "Emlyn Hughes Statue reached. This landmark shows how towns remember local people with wider fame.",
    adult:
      "Emlyn Hughes Statue reached. This monument reflects public memory through sport and civic pride.",
  },

  salthouse_mills: {
    kid: "Salthouse Mills reached. This is part of Barrow’s strong working history.",
    teen:
      "Salthouse Mills reached. This pin takes you into the industrial side of the map.",
    adult:
      "Salthouse Mills reached. This is an industrial memory-site shaped by labour and production.",
  },

  submarine_memorial: {
    kid: "Submarine Memorial reached. This place remembers people and work connected to the sea.",
    teen:
      "Submarine Memorial reached. This pin links memory with the town’s modern defence identity.",
    adult:
      "Submarine Memorial reached. This site binds remembrance to Barrow’s submarine legacy.",
  },

  walney_bridge_entrance: {
    kid: "Walney Bridge Entrance reached. This is the crossing point between Barrow and Walney.",
    teen:
      "Walney Bridge Entrance reached. This pin is about crossing, transition, and identity.",
    adult:
      "Walney Bridge Entrance reached. You are at a threshold structure where geography and identity meet.",
  },

  earnse_bay: {
    kid: "Earnse Bay reached. This is a big coastal place with sea air and wide views.",
    teen:
      "Earnse Bay reached. This pin opens the map outward into coast and horizon.",
    adult:
      "Earnse Bay reached. This is a landscape pin where weather, coast, and scale dominate.",
  },

  piel_castle: {
    kid: "Piel Castle reached. This island castle once helped protect the coast.",
    teen:
      "Piel Castle reached. This landmark feels separate for a reason — defence and the sea matter here.",
    adult:
      "Piel Castle reached. You are entering a defensive coastal site where isolation and strategy converge.",
  },

  roose_station_platform: {
    kid: "Roose Station Platform reached. Trains helped connect people and places.",
    teen:
      "Roose Station Platform reached. This pin is about movement and route networks.",
    adult:
      "Roose Station Platform reached. This site reflects transport infrastructure and everyday movement.",
  },
};

/* =========================================================
   GROUP HISTORY CONTENT
========================================================= */

export const QA_HISTORY_BY_GROUP = {
  town_history: {
    quiz: {
      kid: [
        {
          q: "What kind of place was Barrow before heavy industry?",
          options: ["A village", "A capital city", "A giant castle", "A theme park"],
          answer: 0,
          fact: "Barrow began as a much smaller settlement before industrial growth.",
        },
        {
          q: "What helped Barrow grow quickly in the 1800s?",
          options: ["Iron and industry", "Banana farms", "Volcanoes", "Theme parks"],
          answer: 0,
          fact: "Iron, docks, and industry helped Barrow grow fast.",
        },
      ],
      teen: [
        {
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
          q: "What kind of history do many central Barrow landmarks share?",
          options: [
            "Civic and industrial history",
            "Jungle history",
            "Desert history",
            "Volcanic history",
          ],
          answer: 0,
          fact: "Much of central Barrow reflects civic growth and industrial identity.",
        },
      ],
      adult: [
        {
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
          q: "What ties many town-centre landmarks together?",
          options: [
            "Public life, memory, and growth",
            "Deep sea fishing only",
            "Airport logistics",
            "Monastic seclusion",
          ],
          answer: 0,
          fact: "Town-centre landmarks often express public life, memory, and growth.",
        },
      ],
    },

    history: {
      kid: [
        {
          q: "Do town buildings help tell local history?",
          options: ["Yes", "No", "Only castles do", "Only beaches do"],
          answer: 0,
          fact: "Town buildings often help show how a place grew and changed.",
        },
      ],
      teen: [
        {
          q: "Why are town landmarks useful in local history?",
          options: [
            "They show how public life changed",
            "They replace maps",
            "They hide tunnels only",
            "They grow crops",
          ],
          answer: 0,
          fact: "Town landmarks help show how civic and daily life developed.",
        },
      ],
      adult: [
        {
          q: "What do civic landmarks often preserve?",
          options: [
            "Public memory and identity",
            "Only private wealth",
            "Only transport schedules",
            "Only military secrets",
          ],
          answer: 0,
          fact: "Civic landmarks often preserve public memory and identity.",
        },
      ],
    },
  },

  industry_history: {
    quiz: {
      kid: [
        {
          q: "What kind of work helped Barrow become famous?",
          options: [
            "Industry and shipbuilding",
            "Chocolate making",
            "Only farming",
            "Wizard school",
          ],
          answer: 0,
          fact: "Barrow became famous through industry and shipbuilding.",
        },
      ],
      teen: [
        {
          q: "What made Barrow important in industrial Britain?",
          options: [
            "Shipbuilding and heavy industry",
            "Only beaches",
            "Only theatre",
            "Only farming",
          ],
          answer: 0,
          fact: "Barrow became important through shipbuilding and heavy industry.",
        },
      ],
      adult: [
        {
          q: "What does an industrial landmark in Barrow usually point back to?",
          options: [
            "Labour, production, and growth",
            "Monastic prayer only",
            "Holiday tourism only",
            "Royal ceremony only",
          ],
          answer: 0,
          fact: "Industrial landmarks in Barrow often point to labour, production, and growth.",
        },
      ],
    },

    history: {
      kid: [
        {
          q: "Did factories and mills change Barrow?",
          options: ["Yes", "No", "Only a little", "Not at all"],
          answer: 0,
          fact: "Factories, mills, and industry changed Barrow in major ways.",
        },
      ],
      teen: [
        {
          q: "Why do industrial sites matter historically?",
          options: [
            "They show how work shaped the town",
            "They are only decorative",
            "They replaced all roads",
            "They built castles",
          ],
          answer: 0,
          fact: "Industrial sites show how labour and production shaped the town.",
        },
      ],
      adult: [
        {
          q: "What is the historic value of industrial sites?",
          options: [
            "They preserve the story of labour and transformation",
            "They exist only for scenery",
            "They replaced civic life",
            "They were built mainly for tourism",
          ],
          answer: 0,
          fact: "Industrial sites preserve the story of labour and material transformation.",
        },
      ],
    },
  },

  statues_memorial: {
    quiz: {
      kid: [
        {
          q: "Why do towns have statues and memorials?",
          options: [
            "To remember people and events",
            "To hide treasure",
            "To launch rockets",
            "To grow food",
          ],
          answer: 0,
          fact: "Statues and memorials help towns remember people and events.",
        },
      ],
      teen: [
        {
          q: "What is the main purpose of a memorial or statue?",
          options: ["Public remembrance", "Road control", "Ticket sales", "Boat repair"],
          answer: 0,
          fact: "Memorials and statues exist to support public remembrance.",
        },
      ],
      adult: [
        {
          q: "What do memorials and statues reveal about a town?",
          options: [
            "Who and what it chooses to remember",
            "Its crop yields",
            "Its underground caves",
            "Its weather patterns only",
          ],
          answer: 0,
          fact: "Memorials reveal who and what a town chooses to remember publicly.",
        },
      ],
    },

    history: {
      kid: [
        {
          q: "Can statues help tell the story of a town?",
          options: ["Yes", "No", "Only maps can", "Only shops can"],
          answer: 0,
          fact: "Statues can help tell the story of a town and its people.",
        },
      ],
      teen: [
        {
          q: "Why are statues part of local history?",
          options: [
            "They preserve memory in public space",
            "They replace schools",
            "They run transport",
            "They build factories",
          ],
          answer: 0,
          fact: "Statues preserve memory in public space.",
        },
      ],
      adult: [
        {
          q: "What does a public statue most clearly do?",
          options: [
            "Turn memory into a visible civic object",
            "Direct road traffic",
            "Store official documents",
            "Control harbour trade",
          ],
          answer: 0,
          fact: "A public statue turns memory into a visible civic object.",
        },
      ],
    },
  },

  park_history: {
    quiz: {
      kid: [
        {
          q: "What kind of place is Barrow Park?",
          options: ["A park", "A harbour", "A factory", "An airport"],
          answer: 0,
          fact: "Barrow Park is one of the town’s important green spaces.",
        },
        {
          q: "What can people do in a park?",
          options: [
            "Play and relax",
            "Launch submarines",
            "Mine iron",
            "Build factories",
          ],
          answer: 0,
          fact: "Parks are made for play, walking, and shared public time.",
        },
      ],
      teen: [
        {
          q: "What makes the park good for quests?",
          options: [
            "Open space and landmarks",
            "Cargo cranes",
            "Runways",
            "Only shops",
          ],
          answer: 0,
          fact: "The park works well for quests because of its routes and landmarks.",
        },
        {
          q: "Why do parks matter in towns?",
          options: [
            "They create shared public space",
            "They replace ports",
            "They power factories",
            "They store cargo",
          ],
          answer: 0,
          fact: "Parks create shared public space in towns.",
        },
      ],
      adult: [
        {
          q: "What public role does a park often serve?",
          options: [
            "Leisure, memory, and social space",
            "Heavy freight movement",
            "Border control",
            "Industrial storage",
          ],
          answer: 0,
          fact: "Parks often serve leisure, memory, and social space.",
        },
        {
          q: "What best describes a strong park landmark?",
          options: [
            "A civic leisure feature",
            "A port loading tool",
            "A private military structure",
            "A freight yard device",
          ],
          answer: 0,
          fact: "Park landmarks are often civic leisure features within public space.",
        },
      ],
    },

    history: {
      kid: [
        {
          q: "Can a park be an important part of town life?",
          options: ["Yes", "No", "Only roads matter", "Only factories matter"],
          answer: 0,
          fact: "Parks are important because they are shared spaces for the public.",
        },
      ],
      teen: [
        {
          q: "Why is a park part of local history?",
          options: [
            "It shows how towns value public leisure",
            "It replaces schools",
            "It acts like a factory",
            "It controls the sea",
          ],
          answer: 0,
          fact: "Parks show how towns create space for public leisure and gathering.",
        },
      ],
      adult: [
        {
          q: "How should a historic park be understood?",
          options: [
            "As designed public space",
            "As industrial overflow",
            "As transport-only land",
            "As unused leftover ground",
          ],
          answer: 0,
          fact: "A historic park should be understood as designed public space.",
        },
      ],
    },
  },

  park_cenotaph: {
    quiz: {
      kid: [
        {
          q: "What does the cenotaph honour?",
          options: ["Those lost in war", "Football winners", "Shop owners", "Bus drivers only"],
          answer: 0,
          fact: "The cenotaph honours those lost in war.",
        },
      ],
      teen: [
        {
          q: "Why should a cenotaph be treated respectfully?",
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
          q: "What civic purpose does a cenotaph serve?",
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

    history: {
      kid: [
        {
          q: "Is the cenotaph a place to remember people?",
          options: ["Yes", "No", "It is just decoration", "It is only for games"],
          answer: 0,
          fact: "The cenotaph is a place for remembrance.",
        },
      ],
      teen: [
        {
          q: "What does the cenotaph show about the town?",
          options: [
            "That remembrance matters",
            "That only shopping matters",
            "That parks do not matter",
            "That roads are more important than memory",
          ],
          answer: 0,
          fact: "The cenotaph shows that remembrance matters in public life.",
        },
      ],
      adult: [
        {
          q: "Why is the cenotaph historically important?",
          options: [
            "It anchors public memory",
            "It stores old machinery",
            "It marks a rail junction",
            "It replaced a church",
          ],
          answer: 0,
          fact: "The cenotaph is historically important because it anchors public memory.",
        },
      ],
    },
  },

  abbey_history: {
    quiz: {
      kid: [
        {
          q: "Who lived at Furness Abbey long ago?",
          options: ["Monks", "Pirates", "Astronauts", "Robots"],
          answer: 0,
          fact: "Monks lived and worshipped at Furness Abbey.",
        },
        {
          q: "How old is Furness Abbey?",
          options: ["20 years", "100 years", "Over 800 years", "Built last week"],
          answer: 2,
          fact: "Furness Abbey was founded in the 12th century.",
        },
      ],
      teen: [
        {
          q: "What kind of place was Furness Abbey?",
          options: ["A monastery", "A football ground", "A shopping centre", "A train station"],
          answer: 0,
          fact: "Furness Abbey was a monastery.",
        },
        {
          q: "Which king closed many monasteries, including Furness Abbey?",
          options: ["Henry VIII", "King John", "Charles II", "Alfred"],
          answer: 0,
          fact: "Henry VIII dissolved monasteries across England.",
        },
      ],
      adult: [
        {
          q: "What was Furness Abbey’s main historic role?",
          options: [
            "Religious life and monastic power",
            "Modern retail",
            "Air travel",
            "Submarine launching",
          ],
          answer: 0,
          fact: "The abbey was a major religious and monastic site.",
        },
        {
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
      ],
    },

    history: {
      kid: [
        {
          q: "Is Furness Abbey very old?",
          options: ["Yes", "No", "Only 20 years old", "Built last week"],
          answer: 0,
          fact: "Furness Abbey is hundreds of years old.",
        },
      ],
      teen: [
        {
          q: "What gives the abbey its strong atmosphere?",
          options: ["Ruins and history", "Airport lights", "Factory smoke", "Shopping signs"],
          answer: 0,
          fact: "Its ruins and long history give it atmosphere.",
        },
      ],
      adult: [
        {
          q: "Why is Furness Abbey historically significant?",
          options: [
            "It reflects religious power and change",
            "It was a motorway junction",
            "It was a cinema complex",
            "It was a dock gate",
          ],
          answer: 0,
          fact: "Furness Abbey reflects major religious and political change.",
        },
      ],
    },
  },

  docks_submarines: {
    quiz: {
      kid: [
        {
          q: "What is Barrow known for building today?",
          options: ["Submarines", "Chocolate castles", "Flying tractors", "Theme parks"],
          answer: 0,
          fact: "Barrow is known for building submarines.",
        },
        {
          q: "Where can you learn about Barrow’s dock history?",
          options: ["Dock Museum", "Only the beach", "A farm", "A cinema"],
          answer: 0,
          fact: "The Dock Museum helps tell Barrow’s dock and ship story.",
        },
      ],
      teen: [
        {
          q: "Why are the docks important to Barrow?",
          options: [
            "They connect industry to trade",
            "They only grow food",
            "They replace roads",
            "They train actors",
          ],
          answer: 0,
          fact: "The docks supported shipbuilding, transport, and trade.",
        },
        {
          q: "Why is Barrow internationally known today?",
          options: [
            "Submarine building",
            "Volcano research",
            "Space launches",
            "Castle tourism",
          ],
          answer: 0,
          fact: "Barrow remains strongly associated with submarine construction.",
        },
      ],
      adult: [
        {
          q: "What gives Barrow continuing national importance?",
          options: [
            "Its defence and shipbuilding role",
            "Its medieval royal court",
            "Its airport network",
            "Its mountain agriculture",
          ],
          answer: 0,
          fact: "Barrow remains closely tied to defence manufacturing.",
        },
        {
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
    },

    history: {
      kid: [
        {
          q: "Did ships and docks help Barrow grow?",
          options: ["Yes", "No", "Only roads did", "Only farms did"],
          answer: 0,
          fact: "Ships and docks helped Barrow grow.",
        },
      ],
      teen: [
        {
          q: "What does the Dock Museum help preserve?",
          options: [
            "Barrow’s maritime and industrial story",
            "Only football history",
            "Only farming tools",
            "Only cinema posters",
          ],
          answer: 0,
          fact: "The Dock Museum preserves maritime and industrial history.",
        },
      ],
      adult: [
        {
          q: "What does the Dock Museum most strongly interpret?",
          options: [
            "Maritime industry, labour, and identity",
            "Luxury trade only",
            "Roman religion only",
            "Theatre culture only",
          ],
          answer: 0,
          fact: "The museum helps explain how shipbuilding shaped Barrow’s identity.",
        },
      ],
    },
  },

  islands_nature: {
    quiz: {
      kid: [
        {
          q: "What connects Walney Island to Barrow?",
          options: ["Bridge", "Volcano", "Castle wall", "Tunnel under London"],
          answer: 0,
          fact: "Walney Bridge connects Walney to Barrow.",
        },
        {
          q: "What can you often enjoy at coastal places like Earnse Bay?",
          options: ["Views and sea air", "Underground mines", "Skyscrapers", "Desert dunes"],
          answer: 0,
          fact: "Coastal places are known for sea air, views, and changing weather.",
        },
      ],
      teen: [
        {
          q: "What is Walney known for as well as its size?",
          options: ["Wildlife and coastline", "Skyscrapers", "Coal mines", "Underground rail"],
          answer: 0,
          fact: "Walney is known for wildlife, coastline, and birdlife.",
        },
        {
          q: "What kind of place is Piel Castle?",
          options: [
            "A coastal defensive castle",
            "A shopping arcade",
            "A train depot",
            "A factory",
          ],
          answer: 0,
          fact: "Piel Castle was built to help protect the coast.",
        },
      ],
      adult: [
        {
          q: "How should Walney be understood in relation to Barrow?",
          options: [
            "As part of the area’s wider coastal identity",
            "As an inland district",
            "As a market tunnel",
            "As a former abbey court",
          ],
          answer: 0,
          fact: "Walney adds an important coastal and ecological dimension to Barrow’s identity.",
        },
        {
          q: "What does Piel Castle symbolise in the wider landscape?",
          options: [
            "Coastal defence and strategic control",
            "Modern retail expansion",
            "Agricultural reform",
            "Airport planning",
          ],
          answer: 0,
          fact: "Piel Castle reflects the need to secure the coast and surrounding waters.",
        },
      ],
    },

    history: {
      kid: [
        {
          q: "Is Walney an island?",
          options: ["Yes", "No", "Only sometimes", "Only in winter"],
          answer: 0,
          fact: "Walney is one of England’s largest islands.",
        },
      ],
      teen: [
        {
          q: "Why do island and coast pins feel different from town pins?",
          options: [
            "They are shaped by sea and landscape",
            "They are full of factories only",
            "They are indoor only",
            "They have no history",
          ],
          answer: 0,
          fact: "Coastal pins feel different because sea and landscape change the experience.",
        },
      ],
      adult: [
        {
          q: "What does a coastal landmark often add to a route?",
          options: [
            "Scale, exposure, and atmosphere",
            "Only traffic noise",
            "Only retail",
            "Only street lighting",
          ],
          answer: 0,
          fact: "Coastal landmarks often add scale, exposure, and atmosphere.",
        },
      ],
    },
  },
};

/* =========================================================
   HISTORY PIN OVERRIDES
========================================================= */

export const QA_HISTORY_PIN_OVERRIDES = {
  home_base_marsh_st: {
    start: PIN_START_INTROS.home_base_marsh_st,
  },

  cenotaph_core: {
    start: PIN_START_INTROS.cenotaph_core,
    quiz: {
      kid: [
        {
          q: "What does the cenotaph remember?",
          options: ["War heroes", "Shopping days", "Markets", "Football matches"],
          answer: 0,
          fact: "The cenotaph remembers people lost in war.",
        },
      ],
      teen: [
        {
          q: "Why should the cenotaph be treated with respect?",
          options: [
            "It is a memorial space",
            "It is a race track",
            "It is a market lane",
            "It is a game zone",
          ],
          answer: 0,
          fact: "The cenotaph is a memorial space for remembrance.",
        },
      ],
      adult: [
        {
          q: "What does the cenotaph most strongly represent?",
          options: [
            "Collective remembrance",
            "Retail activity",
            "Traffic management",
            "Tourist entertainment",
          ],
          answer: 0,
          fact: "The cenotaph represents collective remembrance.",
        },
      ],
    },
    history: {
      kid: [
        {
          q: "Is the cenotaph a place to remember people?",
          options: ["Yes", "No", "Only at night", "Only in summer"],
          answer: 0,
          fact: "The cenotaph is a place of remembrance.",
        },
      ],
      teen: [
        {
          q: "What does the cenotaph show about the town?",
          options: [
            "That remembrance matters",
            "That only roads matter",
            "That only sport matters",
            "That history is unimportant",
          ],
          answer: 0,
          fact: "The cenotaph shows that remembrance matters in public life.",
        },
      ],
      adult: [
        {
          q: "Why is the cenotaph historically important?",
          options: [
            "It anchors public memory",
            "It stores cargo",
            "It marks a shopping route",
            "It controls town traffic",
          ],
          answer: 0,
          fact: "The cenotaph is historically important because it anchors public memory.",
        },
      ],
    },
  },

  park_bandstand_core: {
    start: PIN_START_INTROS.park_bandstand_core,
    quiz: {
      kid: [
        {
          q: "What is a bandstand mainly used for?",
          options: ["Music and performances", "Fixing tractors", "Rocket launches", "Fishing boats"],
          answer: 0,
          fact: "Bandstands are used for music and performances.",
        },
      ],
      teen: [
        {
          q: "What atmosphere fits a bandstand best?",
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
          q: "What public role does a bandstand often symbolise?",
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
  },

  furness_abbey_core: {
    start: PIN_START_INTROS.furness_abbey_core,
  },

  town_hall_clock: {
    start: PIN_START_INTROS.town_hall_clock,
    quiz: {
      kid: [
        {
          q: "What does a town hall clock help people do?",
          options: ["Know the time", "Bake bread", "Build ships", "Grow flowers"],
          answer: 0,
          fact: "Clock landmarks helped towns run to a shared daily rhythm.",
        },
      ],
      teen: [
        {
          q: "Why are clock landmarks important in towns?",
          options: [
            "They help organise public life",
            "They replace libraries",
            "They launch trains",
            "They store cargo",
          ],
          answer: 0,
          fact: "Clock landmarks helped structure daily civic life.",
        },
      ],
      adult: [
        {
          q: "What does a civic clock most strongly represent?",
          options: [
            "Shared public rhythm",
            "Private wealth only",
            "Military secrecy",
            "Agricultural isolation",
          ],
          answer: 0,
          fact: "Civic clocks symbolise order, coordination, and shared urban time.",
        },
      ],
    },
  },

  barrow_library: {
    start: PIN_START_INTROS.barrow_library,
    quiz: {
      kid: [
        {
          q: "What do libraries help people do?",
          options: ["Learn and read", "Launch rockets", "Fix engines", "Catch fish"],
          answer: 0,
          fact: "Libraries are places of learning, reading, and discovery.",
        },
      ],
      teen: [
        {
          q: "Why is a library important in a town?",
          options: [
            "It keeps knowledge available to everyone",
            "It replaces factories",
            "It controls traffic",
            "It stores submarines",
          ],
          answer: 0,
          fact: "Libraries are part of the public knowledge system of a town.",
        },
      ],
      adult: [
        {
          q: "What does a public library represent in civic life?",
          options: [
            "Shared access to knowledge",
            "Private military planning",
            "Trade regulation only",
            "Industrial extraction",
          ],
          answer: 0,
          fact: "A public library represents education, memory, and shared civic access to knowledge.",
        },
      ],
    },
  },

  james_ramsden_statue: {
    start: PIN_START_INTROS.james_ramsden_statue,
  },

  henry_schneider_statue: {
    start: PIN_START_INTROS.henry_schneider_statue,
  },

  custom_house: {
    start: PIN_START_INTROS.custom_house,
  },

  dock_museum_anchor: {
    start: PIN_START_INTROS.dock_museum_anchor,
  },

  dock_museum_submarine: {
    start: PIN_START_INTROS.dock_museum_submarine,
  },

  emlyn_hughes_statue: {
    start: PIN_START_INTROS.emlyn_hughes_statue,
  },

  salthouse_mills: {
    start: PIN_START_INTROS.salthouse_mills,
  },

  submarine_memorial: {
    start: PIN_START_INTROS.submarine_memorial,
  },

  walney_bridge_entrance: {
    start: PIN_START_INTROS.walney_bridge_entrance,
  },

  earnse_bay: {
    start: PIN_START_INTROS.earnse_bay,
  },

  piel_castle: {
    start: PIN_START_INTROS.piel_castle,
  },

  roose_station_platform: {
    start: PIN_START_INTROS.roose_station_platform,
  },
};

/* =========================================================
   OPTIONAL HISTORY MASTER BANK
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

/* =========================================================
   HISTORY READING SYSTEM (NON-QUIZ — PURE STORY MODE)
========================================================= */

export const QA_HISTORY_READING = {

home_base_marsh_st: {

  kid: [
    "Alright… this is where everything starts.",
    "This is your Home Base.",
    "Every journey begins somewhere… and this is yours.",
    "From here, you’ll move out, explore, discover things you didn’t expect.",
    "But no matter where you go… this is your starting point.",
    "So take it in… because this is step one."
  ],

  teen: [
    "This is your starting point — Home Base.",
    "Every route, every decision, every direction begins here.",
    "It might seem simple… but starting points matter.",
    "They set the tone for everything that follows.",
    "From here, the map opens up.",
    "And what you do next… is up to you."
  ],

  adult: [
    "This is your point of origin.",
    "Before movement, before choice — there is always a start.",
    "Home Base anchors everything that follows.",
    "Every route you take expands outward from here.",
    "It may seem like just another location… but beginnings carry weight.",
    "Because once you leave… the experience unfolds, and it doesn’t reverse.",
    "So this is where it starts."
  ]
},

park_bandstand_core: {

  kid: [
    "This place might look calm… but imagine it full of sound.",
    "Music playing, people watching, everything happening right here.",
    "That’s what this was built for.",
    "This is where people came together… to enjoy something.",
    "So don’t just look at it… picture it alive.",
    "Because that’s what it was meant to be."
  ],

  teen: [
    "The bandstand isn’t just a structure — it’s a performance space.",
    "Music, events, people gathering… this was designed for shared experience.",
    "Places like this bring energy into public space.",
    "Even when it’s quiet now, that purpose is still there.",
    "It’s built for people… not just to look at."
  ],

  adult: [
    "The bandstand represents a deliberate space for public gathering and performance.",
    "It was designed to bring people together — to create shared experience through sound and presence.",
    "Even in stillness, that purpose remains embedded in the structure.",
    "It reflects a time when public space was actively shaped for community life.",
    "Not just movement… but interaction, attention, and connection."
  ]
},

furness_abbey_core: {

  kid: [
    "Take a look around… this wasn’t always broken like this.",
    "These walls used to be full of life.",
    "People lived here… worked here… prayed here.",
    "This was a powerful place.",
    "Now it’s quiet… but it still feels important, doesn’t it?",
    "That’s because history doesn’t just disappear… it stays."
  ],

  teen: [
    "Furness Abbey wasn’t just a building — it was a centre of power.",
    "Monks lived here, worked here, and controlled land around it.",
    "This place had influence.",
    "But then everything changed.",
    "Henry VIII shut monasteries down… and this is what remains.",
    "What you’re seeing now is what’s left after that shift."
  ],

  adult: [
    "You are standing within what was once a dominant religious and economic institution.",
    "Furness Abbey held power — not only spiritual, but territorial and social.",
    "It shaped the surrounding landscape and the lives within it.",
    "Its destruction under Henry VIII was not gradual… it was decisive.",
    "What remains is not just ruin… but evidence.",
    "A structure that once held authority, now reduced to form and silence.",
    "And yet… the weight of what it was still lingers here."
  ]
},

town_hall_clock: {

  kid: [
    "Look up for a second.",
    "That clock wasn’t just there to look nice.",
    "People used it to know when to start, stop, and move.",
    "Before phones… this mattered.",
    "It helped the whole town stay in time together.",
    "That’s how important it was."
  ],

  teen: [
    "This clock helped organise daily life in the town.",
    "Before personal devices, people relied on shared time.",
    "It controlled rhythm — when work started, when things stopped.",
    "It wasn’t decoration… it was function.",
    "A visible system everyone followed."
  ],

  adult: [
    "This clock represents the regulation of shared time.",
    "In a growing industrial town, coordination was essential.",
    "Work, movement, routine — all aligned through visible markers like this.",
    "It reflects a system where time was not personal… but collective.",
    "Structured, imposed, and followed.",
    "An unseen control… made visible."
  ]
},

dock_museum_anchor: {

  kid: [
    "That anchor might look simple… but it’s heavy for a reason.",
    "It held massive ships in place.",
    "Ships that travelled far beyond here.",
    "This town built things that moved across the world.",
    "And this… is a piece of that story.",
    "Small part… big meaning."
  ],

  teen: [
    "This anchor connects directly to Barrow’s shipbuilding history.",
    "It’s not just an object — it represents scale, weight, and movement.",
    "Ships built here travelled globally.",
    "And everything starts with components like this.",
    "It’s a symbol of something much larger."
  ],

  adult: [
    "This anchor is a fragment — but it represents an entire industrial system.",
    "Shipbuilding, engineering, and global movement all converge in objects like this.",
    "It held vessels in place… while those vessels connected this town to the wider world.",
    "It is both functional and symbolic.",
    "Weight, stability, and control — embedded in a single form.",
    "A small object… carrying the scale of an entire industry."
  ]
},

cenotaph_core: {

  kid: [
    "Alright… slow down here.",
    "This isn’t just another stop… this place means something.",
    "The Cenotaph is here to remember people who went to war… and never came back.",
    "Real people. Real lives.",
    "Families stood here… and they still do.",
    "So when you’re here… you don’t rush.",
    "You stand still for a second.",
    "Because this place… is about respect."
  ],

  teen: [
    "Take a moment here — this isn’t just another location on the map.",
    "The Cenotaph represents people who lost their lives in war.",
    "Not just history — real individuals, with families, stories, futures that never happened.",
    "Memorials like this exist so that loss isn’t forgotten.",
    "That’s why people treat this space differently.",
    "There’s a weight to it.",
    "And whether you realise it or not… you feel it when you stand here."
  ],

  adult: [
    "Pause here.",
    "The Cenotaph is not defined by what is present… but by what is absent.",
    "It represents those who left… and did not return.",
    "Lives interrupted. Futures removed. Families permanently altered.",
    "Names carved into stone are only the surface of what this place holds.",
    "It anchors memory into the physical space of the town.",
    "Not loudly… but persistently.",
    "This is not a place to pass through quickly.",
    "It asks for recognition.",
    "Because remembrance is not automatic — it is chosen.",
    "And here… it is held in place."
  ]
},

henry_schneider_statue: {

  kid: [
    "This statue isn’t just someone standing there…",
    "This is one of the people who helped build Barrow.",
    "Before all of this… this place was much smaller.",
    "People like Henry Schneider changed that.",
    "He helped bring industry here.",
    "He helped the town grow.",
    "So when you look at this… you’re looking at someone who changed everything."
  ],

  teen: [
    "Henry Schneider played a major role in Barrow’s growth.",
    "He helped develop industry and bring opportunity into the area.",
    "Without figures like him, the town wouldn’t have expanded the way it did.",
    "This statue isn’t just about remembering a person.",
    "It’s about recognising impact.",
    "How one individual can influence an entire place."
  ],

  adult: [
    "Henry Schneider represents industrial acceleration.",
    "A figure who didn’t simply exist within Barrow’s growth… but actively drove it.",
    "His involvement in developing industry helped transform this area from a small settlement into a functioning industrial town.",
    "This statue marks more than a person — it marks influence.",
    "The ability of an individual to redirect the trajectory of an entire place.",
    "But influence is never neutral.",
    "Growth brings opportunity… but also consequence.",
    "And this figure sits at the centre of that transformation."
  ]
},

james_ramsden_statue: {

  kid: [
    "This is James Ramsden.",
    "He didn’t just live here… he helped shape the town.",
    "He planned things, built things, organised things.",
    "Without people like him… Barrow wouldn’t look like it does now.",
    "So this isn’t just a statue…",
    "It’s someone who helped design the place you’re standing in."
  ],

  teen: [
    "James Ramsden was one of the key planners behind Barrow’s development.",
    "He helped organise how the town grew.",
    "Not just industry — but layout, structure, direction.",
    "This statue represents planning, leadership, and control.",
    "The idea that towns don’t just happen… they’re designed."
  ],

  adult: [
    "James Ramsden represents structured development.",
    "Where Schneider drove industrial force… Ramsden helped shape its direction.",
    "Planning, infrastructure, organisation — the systems that turn growth into something sustainable.",
    "This statue reflects intentional design.",
    "The transformation of land into a functioning town.",
    "It’s a reminder that places like this are not accidental.",
    "They are constructed — through decision, authority, and long-term vision."
  ]
},

barrow_library: {

  kid: [
    "This place might be quiet… but it’s powerful.",
    "Inside here are stories, facts, ideas — loads of them.",
    "People come here to learn things they didn’t know before.",
    "It’s not loud like other places…",
    "But it helps people grow.",
    "That’s what makes it important."
  ],

  teen: [
    "The library is about access to knowledge.",
    "Not just books — information, learning, discovery.",
    "It gives people the chance to understand more about the world.",
    "Places like this don’t stand out loudly…",
    "But they shape how people think.",
    "And that matters."
  ],

  adult: [
    "The library represents intellectual infrastructure.",
    "A civic space dedicated to preserving and sharing knowledge.",
    "Unlike industry, which produces material output… this produces understanding.",
    "It allows access — not restricted, but open.",
    "And that accessibility is what gives it power.",
    "Because informed individuals shape stronger societies.",
    "Quietly… consistently… over time."
  ]
},

custom_house: {

  kid: [
    "This building had an important job.",
    "When ships came in… this is where things were checked.",
    "What came into the town… what left it.",
    "Nothing just passed through without being noticed.",
    "This place helped control it all.",
    "That’s how important it was."
  ],

  teen: [
    "The Custom House was part of how trade worked.",
    "Goods coming through the docks were recorded, checked, and controlled here.",
    "It wasn’t just about moving things — it was about managing them.",
    "Money, goods, movement — all tracked.",
    "This building sat right in the middle of that system."
  ],

  adult: [
    "The Custom House operated at the intersection of trade and authority.",
    "Every item passing through the docks was subject to control — recorded, taxed, regulated.",
    "It represents the administrative backbone of industrial movement.",
    "Without systems like this, large-scale trade does not function.",
    "It is not the visible force of industry…",
    "But the structure that makes it possible.",
    "An unseen control layer… embedded within the flow of goods and power."
  ]
},

dock_museum_submarine: {

  kid: [
    "Look at that… it’s massive.",
    "That’s a submarine.",
    "And it wasn’t built somewhere far away… it was built right here.",
    "People from this town helped create something that can travel deep under the sea.",
    "It’s not just big… it’s powerful.",
    "And it all connects back to this place."
  ],

  teen: [
    "This submarine shows what Barrow is known for today.",
    "Advanced engineering. Precision. Design at a serious level.",
    "These aren’t simple machines — they operate deep underwater, in extreme conditions.",
    "And they’re built here.",
    "This isn’t just history — this is ongoing relevance.",
    "Barrow still matters because of this."
  ],

  adult: [
    "This submarine represents modern industrial capability at its highest level.",
    "Designed for endurance, precision, and strategic function beneath the surface.",
    "Built here, it connects Barrow to national defence and global systems.",
    "This is not a relic — it is a continuation.",
    "A direct line from past industry… into present-day relevance.",
    "Complex, controlled, and engineered for environments most people will never experience."
  ]
},

submarine_memorial: {

  kid: [
    "This place feels different… doesn’t it?",
    "It’s quieter.",
    "That’s because it remembers people.",
    "Not just submarines… not just machines… people.",
    "People who were part of something bigger.",
    "So when you’re here… you stop for a second.",
    "Because this place… matters."
  ],

  teen: [
    "This memorial connects Barrow’s engineering to real human lives.",
    "Behind every submarine, every system… there are people.",
    "And not all of them came back.",
    "That’s what this place represents.",
    "It’s not just about achievement — it’s about cost.",
    "And that’s why it feels different when you stand here."
  ],

  adult: [
    "The Submarine Memorial exists at the intersection of engineering and loss.",
    "It acknowledges not just the machines built here… but the lives tied to them.",
    "Service, risk, and consequence — all contained within this space.",
    "It reframes industrial achievement through a human lens.",
    "Because progress and sacrifice are often linked.",
    "And here… that connection is made visible."
  ]
},

salthouse_mills: {

  kid: [
    "This place used to be full of noise.",
    "Machines running… people working… everything moving.",
    "It was busy.",
    "Now it’s quieter.",
    "But that doesn’t mean it wasn’t important.",
    "This is part of how the town grew."
  ],

  teen: [
    "Salthouse Mills was part of Barrow’s industrial engine.",
    "Places like this produced goods, created jobs, and kept the town moving.",
    "It was loud, active, and full of energy.",
    "But over time… things changed.",
    "Industry slowed, and places like this became quieter.",
    "Now it stands as part of that story."
  ],

  adult: [
    "Salthouse Mills reflects the full lifecycle of industrial space.",
    "Once defined by labour, machinery, and continuous output.",
    "It contributed to the economic force that shaped the town.",
    "But industry is not static.",
    "It rises, peaks, and eventually recedes.",
    "What remains is structure — and memory.",
    "A physical reminder of production, effort… and transition."
  ]
},

walney_bridge_entrance: {

  kid: [
    "You’re about to cross over.",
    "From Barrow… to Walney.",
    "It might not look like much… but it changes things.",
    "One side feels different to the other.",
    "So when you cross… notice it.",
    "Because you’re moving into somewhere new."
  ],

  teen: [
    "Walney Bridge is more than just a crossing point.",
    "It connects two different environments.",
    "Town on one side… island on the other.",
    "As you move across, the space opens up.",
    "It’s a shift — not just in location, but in feeling."
  ],

  adult: [
    "Walney Bridge represents transition between distinct spatial identities.",
    "Urban density gives way to coastal openness.",
    "Structure shifts into exposure.",
    "Crossing it is not simply movement — it is a change in environment and perception.",
    "A boundary, defined not by walls… but by experience."
  ]
},

earnse_bay: {

  kid: [
    "Look out there…",
    "It just keeps going.",
    "The sea… the sky… the wind.",
    "There’s nothing blocking it.",
    "It feels bigger than everywhere else you’ve been.",
    "That’s what makes this place special."
  ],

  teen: [
    "Earnse Bay changes everything.",
    "No buildings, no tight streets — just open space.",
    "Sea, sky, horizon.",
    "It feels wider… quieter… different.",
    "Places like this remind you how big everything really is."
  ],

  adult: [
    "Earnse Bay introduces scale through openness.",
    "The built environment disappears, replaced by horizon and exposure.",
    "Sea and sky dominate, removing boundaries and structure.",
    "It shifts perception — from contained space to expansive environment.",
    "Here, control fades… and the natural world takes over."
  ]
},
};

   
 
export function getHistoryQuestion(input = {}) {
  const pool =
    (typeof QA_HISTORY_BY_GROUP !== "undefined" && QA_HISTORY_BY_GROUP) ||
    (typeof HISTORY_BY_GROUP !== "undefined" && HISTORY_BY_GROUP) ||
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

export function getHistoryReading(input = {}) {
  const group = input.group || input.pin?.qaGroup || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier)
    ? input.tier
    : "kid";
  const salt = Number(input.salt || 0);

  const pool =
    (typeof QA_HISTORY_READING !== "undefined" && QA_HISTORY_READING) || null;

  function pickOne(arr) {
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr[Math.abs(salt) % arr.length];
  }

  if (pool && pool[group] && pool[group][tier]) {
    return pickOne(pool[group][tier]);
  }

  return "Take a moment to observe your surroundings.";
}
