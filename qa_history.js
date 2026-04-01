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

morrisons_retail: {

  kid: [
    "This might feel like just a normal shop now… but places like this tell a story too.",
    "Towns change over time.",
    "Old buildings disappear. New places arrive.",
    "People still come here, meet here, buy things here, and move through it every day.",
    "So even somewhere modern like this matters.",
    "Because town life isn’t only old history… it’s the way people live right now."
  ],

  teen: [
    "Not every important place in a town has to be ancient.",
    "Modern retail spaces show how everyday life keeps changing.",
    "Where people shop, gather, and move says a lot about what the town has become.",
    "Places like this replace older systems, older streets, older habits.",
    "So even a supermarket sits inside a bigger story — how a town evolves, adapts, and keeps going."
  ],

  adult: [
    "Modern retail space reflects a different phase of town life.",
    "Not industrial expansion, not civic ceremony — but everyday circulation.",
    "Consumption, convenience, repetition, and routine.",
    "Places like this reveal how urban life shifts over time, replacing older forms of trade and social exchange with newer ones.",
    "It may not carry the romance of older landmarks… but it still records change.",
    "And change is part of history too."
  ]
},

park_railway_core: {

  kid: [
    "This little railway feels fun… but it’s part of the park’s story too.",
    "Places like this were made to give people something to enjoy.",
    "Not work. Not rushing. Just fun.",
    "It turns the park into more than open grass — it makes it feel alive.",
    "So even something small like this matters.",
    "Because joy leaves a mark as well."
  ],

  teen: [
    "The park railway represents leisure by design.",
    "It wasn’t built for industry or necessity — it was built for enjoyment.",
    "That matters, because towns are not only shaped by work.",
    "They’re shaped by what people do when they’re free.",
    "The railway adds movement, memory, and atmosphere to the park.",
    "A small feature… but part of a much bigger idea: public space built for experience."
  ],

  adult: [
    "The park railway reflects civic leisure in miniature form.",
    "It transforms public space into something interactive, memorable, and shared.",
    "Unlike the infrastructure of labour, this is infrastructure of enjoyment.",
    "That distinction matters.",
    "Because a town is not only defined by how it works… but by how it allows people to live within it.",
    "Even a modest railway can reveal that deeper intention — to make space not just functional, but human."
  ]
},

boating_lake_core: {

  kid: [
    "The lake changes the whole feeling of the park.",
    "Water does that.",
    "It slows things down. Makes people stop and look.",
    "Boats, birds, reflections, movement — all of it makes this place feel calm and alive at the same time.",
    "It’s not just a lake.",
    "It’s one of the parts that gives the park its magic."
  ],

  teen: [
    "The boating lake is one of the park’s strongest atmosphere points.",
    "Water creates space differently — softer, slower, more reflective.",
    "It gives people somewhere to gather, watch, move, and pause.",
    "That matters in a town, because not every important place has to be loud.",
    "Some places matter because they change how people feel.",
    "And this is one of them."
  ],

  adult: [
    "The boating lake introduces a softer kind of public design.",
    "It reshapes the park through reflection, movement, and stillness.",
    "Unlike roads, mills, or civic buildings, it does not impose structure through force.",
    "Instead, it creates atmosphere.",
    "It allows pause, observation, and shared calm within the town.",
    "That is its value — not utility in the hard sense, but emotional architecture.",
    "A place designed to alter the pace of experience."
  ]
},

bridgegate_ave: {

  kid: [
    "Roads like this might not look exciting at first… but they matter.",
    "They connect places together.",
    "People move through them every day.",
    "Homes, journeys, small routines — all of that happens here.",
    "Not every important place has a statue or a big sign.",
    "Sometimes history is built from ordinary streets."
  ],

  teen: [
    "Bridgegate Avenue is part of the everyday shape of the town.",
    "Places like this don’t always stand out, but they hold routine, movement, and local life.",
    "They connect homes, routes, and neighbourhood patterns.",
    "That matters, because towns are not only made from landmarks.",
    "They’re made from ordinary spaces repeated over time.",
    "That’s where real daily history happens."
  ],

  adult: [
    "Residential and connecting streets carry a quieter form of historical value.",
    "They do not announce themselves with memorials or monuments, yet they hold continuity.",
    "Routine movement, domestic life, neighbourhood identity — all pass through spaces like this.",
    "A town is never built only from its major sites.",
    "It is sustained by the ordinary routes that bind its people together.",
    "Bridgegate Avenue belongs to that quieter layer — the lived framework beneath the visible story."
  ]
},

fryers_lane: {

  kid: [
    "This feels more hidden… more tucked away.",
    "Places like this make a town feel bigger than it looks.",
    "Not because they’re huge — but because they hold quiet corners and different moods.",
    "You can imagine people passing through here for years.",
    "Sometimes the smaller routes feel the most secret.",
    "And that makes them interesting."
  ],

  teen: [
    "Fryer’s Lane has a different energy from the main roads.",
    "Smaller routes like this change the feeling of a place.",
    "They feel more local, more tucked inside the town, less public and more lived-in.",
    "That matters, because atmosphere often comes from these in-between spaces.",
    "Not landmarks… but connectors.",
    "Quiet routes with their own identity."
  ],

  adult: [
    "Lanes and secondary routes create texture within the urban landscape.",
    "They resist the openness of main roads, offering something narrower, quieter, and more intimate.",
    "Fryer’s Lane belongs to that subtler geography — less about display, more about passage.",
    "Places like this shape local atmosphere in ways that major civic structures cannot.",
    "They hold familiarity, repetition, and low-level memory.",
    "Not dramatic on the surface… but essential to the lived character of a town."
  ]
},

flashlight_bend: {

  kid: [
    "This place feels different… like something could happen here.",
    "Bends in the road always do that.",
    "You can’t see what’s coming next.",
    "That’s why places like this feel mysterious.",
    "Every turn holds a new view, a new path, a new possibility.",
    "Even a simple bend can feel like the start of an adventure."
  ],

  teen: [
    "Bends like this change how you experience space.",
    "They break visibility.",
    "They create anticipation.",
    "You don’t see everything at once — you discover it as you move.",
    "That’s powerful in both real places and games.",
    "Because movement becomes part of the experience, not just the destination."
  ],

  adult: [
    "A bend in the road alters perception more than it seems.",
    "It interrupts linear vision and replaces it with unfolding space.",
    "You move without full knowledge of what’s ahead.",
    "That creates tension, curiosity, and subtle awareness.",
    "Urban design often overlooks this… but psychologically, it matters.",
    "It turns movement into discovery."
  ]
},

red_river_walk_core: {

  kid: [
    "This river looks calm… but it has a story.",
    "The water here once ran red.",
    "Not magic… but iron.",
    "From the land, from the ground, from the past.",
    "It carried the colour of industry long before you stood here.",
    "This path isn’t just a walk… it’s part of Barrow’s deeper story."
  ],

  teen: [
    "The Red River gets its name from iron in the soil.",
    "When water runs through it, it carries that colour with it.",
    "That connects this place directly to Barrow’s industrial past.",
    "Mining, extraction, material — all of it leaves traces.",
    "Even in nature.",
    "So this isn’t just a woodland walk.",
    "It’s where industry and landscape meet."
  ],

  adult: [
    "The Red River is a subtle but powerful indicator of geological and industrial history.",
    "Its colouring reflects iron-rich deposits — the same resource that helped drive Barrow’s expansion.",
    "Water becomes a carrier of memory here.",
    "It reveals what lies beneath the surface.",
    "This path is not separate from industry — it is shaped by it.",
    "Nature and extraction layered together, still visible if you know what you’re looking at."
  ]
},

furness_abbey_core: {

  kid: [
    "This place is old… really old.",
    "Long before the town, before the roads, before everything you know.",
    "Monks lived here.",
    "Worked here.",
    "Built something huge, powerful, and important.",
    "Now it’s ruins… but you can still feel it.",
    "Like the place remembers what it used to be."
  ],

  teen: [
    "Furness Abbey was once one of the most powerful monasteries in the country.",
    "Built in the 1100s, it controlled land, wealth, and influence across the region.",
    "Monks here didn’t just pray — they worked, managed land, and built systems.",
    "This wasn’t just a religious site.",
    "It was power.",
    "What you see now are the remains… but the scale of what stood here was massive."
  ],

  adult: [
    "Furness Abbey represents one of the most significant monastic institutions in medieval England.",
    "Founded in the 12th century, it operated as both a religious centre and an economic force.",
    "Its reach extended across land, industry, and regional control.",
    "The monks here were not passive — they were administrators, builders, and power brokers.",
    "What remains now is architectural absence… but historical presence.",
    "These ruins are not empty.",
    "They are the outline of a system that once shaped the entire area."
  ]
},

dock_museum_anchor: {

  kid: [
    "This anchor looks simple… but it held something huge.",
    "Ships don’t stop without something like this.",
    "It’s what keeps them steady.",
    "Barrow has always been about ships, docks, and the sea.",
    "So even this one object connects to something much bigger.",
    "It’s part of the town’s story on the water."
  ],

  teen: [
    "An anchor is all about control.",
    "Without it, a ship drifts.",
    "With it, a ship holds position.",
    "Barrow’s history is tied to shipbuilding and the docks.",
    "So this isn’t just a display piece.",
    "It represents the scale and function of maritime life here."
  ],

  adult: [
    "The anchor represents stability within a system built on movement.",
    "Maritime industry depends on control — knowing when to move, and when to hold.",
    "Barrow’s identity is deeply tied to shipbuilding and naval engineering.",
    "This object, though static now, reflects that dynamic world.",
    "It symbolises restraint within power — the ability to stop something immense.",
    "A small object, carrying industrial significance."
  ]
},

town_hall_clock: {

  kid: [
    "This clock has been watching over the town for years.",
    "People look up at it every day.",
    "It tells everyone the same thing — time.",
    "Meet here, pass here, live around it.",
    "It’s like the town has a heartbeat… and this is part of it.",
    "Tick… tock… always moving."
  ],

  teen: [
    "Clocks like this used to matter a lot more than they do now.",
    "Before phones, before digital time, this was how people stayed in sync.",
    "Work, meetings, daily life — all linked to public time.",
    "The Town Hall clock wasn’t just decoration.",
    "It was coordination.",
    "A shared rhythm for the whole town."
  ],

  adult: [
    "Public clocks once served a critical civic function.",
    "They synchronised daily life across a population.",
    "Before personal timekeeping devices, this was authority.",
    "Work hours, meetings, routines — all aligned to structures like this.",
    "The Town Hall clock represents more than time.",
    "It represents shared order.",
    "A central reference point in the organisation of urban life."
  ]
},

custom_house: {

  kid: [
    "This building helped control what came in… and what went out.",
    "Ships arrived carrying goods from far away.",
    "People had to check them, count them, and make sure everything was right.",
    "That’s what happened here.",
    "It was like a gate for trade.",
    "If something came into Barrow by sea… it passed through here."
  ],

  teen: [
    "The Custom House played a key role in trade and control.",
    "Goods arriving by ship weren’t just unloaded and forgotten.",
    "They were recorded, taxed, and inspected.",
    "That’s how governments kept order over trade.",
    "Barrow was a working port, not just a place on the map.",
    "And this building was part of that system — managing what moved through the docks."
  ],

  adult: [
    "The Custom House functioned as a regulatory checkpoint within the maritime economy.",
    "Imports and exports were not informal processes — they were monitored, taxed, and controlled.",
    "Officials here ensured compliance with national trade laws.",
    "That made this building part of a much larger economic network.",
    "Barrow’s docks connected to global movement, and the Custom House acted as the filter.",
    "A point where local activity met international systems of control."
  ]
},

the_forum: {

  kid: [
    "This place is all about people coming together.",
    "Music, shows, lights, and voices.",
    "It’s where stories get told on a stage instead of in books.",
    "Lots of people have stood here… performing, watching, cheering.",
    "Even if it changes one day… those moments don’t disappear.",
    "They stay part of the town."
  ],

  teen: [
    "The Forum represents modern cultural space.",
    "It’s where entertainment, performance, and community meet.",
    "Theatre, music, events — all happening under one roof.",
    "Even if buildings like this change over time, their role stays important.",
    "They give people a place to gather, express, and experience something together.",
    "That’s a different kind of history — not built from stone, but from moments."
  ],

  adult: [
    "The Forum reflects contemporary civic culture.",
    "Unlike industrial or religious structures, its purpose is experiential.",
    "Performance, gathering, shared attention — these define its role.",
    "Even as such venues face closure or transformation, their impact remains.",
    "They capture a different layer of history.",
    "Not production or power, but expression.",
    "A record of how a town chooses to represent itself in its own time."
  ]
},

barrow_library: {

  kid: [
    "This place is full of knowledge.",
    "Books, stories, facts, ideas — all in one building.",
    "People come here to learn things they didn’t know before.",
    "Some books are new… some are very old.",
    "That means this place connects the past and the present.",
    "It’s like a treasure chest for your mind."
  ],

  teen: [
    "Libraries are one of the most important public spaces in a town.",
    "They give access to knowledge, regardless of background.",
    "That’s powerful.",
    "Barrow Library has been part of that system — education, learning, and access.",
    "Not loud. Not dramatic.",
    "But essential.",
    "Because knowledge shapes everything else."
  ],

  adult: [
    "The library represents structured access to knowledge within civic life.",
    "It removes barriers — economic, social, intellectual.",
    "By making information available to all, it supports long-term development of the population.",
    "Barrow Library is part of that tradition.",
    "A quiet institution, but foundational.",
    "Because every other system — industry, governance, culture — depends on informed individuals.",
    "This is where that begins."
  ]
},

henry_schneider_statue: {

  kid: [
    "This statue is here for a reason.",
    "Henry Schneider helped build Barrow into what it became.",
    "Before him, this place was small.",
    "After him, it started to grow fast.",
    "He helped bring industry, jobs, and change.",
    "That’s why he’s remembered like this."
  ],

  teen: [
    "Henry Schneider was one of the key figures behind Barrow’s rise.",
    "He helped develop the iron industry that powered the town’s growth.",
    "That changed everything.",
    "More jobs, more buildings, more people.",
    "Barrow didn’t just grow naturally — it was driven by people like him.",
    "This statue marks that influence."
  ],

  adult: [
    "Henry Schneider represents industrial transformation at a regional level.",
    "His involvement in iron production and industrial expansion directly contributed to Barrow’s rapid growth in the 19th century.",
    "This was not passive development — it was driven by investment, planning, and exploitation of natural resources.",
    "The town’s identity as an industrial centre is tied to figures like Schneider.",
    "This statue is not simply recognition.",
    "It is a marker of influence.",
    "A reminder that individuals can reshape entire environments."
  ]
},

james_ramsden_statue: {

  kid: [
    "This man helped shape the town too.",
    "James Ramsden didn’t just build things — he helped plan them.",
    "Roads, buildings, the way the town looks today.",
    "He helped turn ideas into real places.",
    "That’s why he’s remembered here.",
    "Because the town still shows what he started."
  ],

  teen: [
    "James Ramsden played a major role in designing and organising Barrow.",
    "He wasn’t just part of industry — he helped structure the town itself.",
    "That includes planning, layout, and development.",
    "So while others built factories, he helped shape how everything fit together.",
    "That’s a different kind of influence.",
    "More long-term. More visible in everyday life."
  ],

  adult: [
    "James Ramsden represents strategic urban and industrial planning.",
    "His influence extended beyond production into the organisation of space itself.",
    "He contributed to shaping Barrow as a functioning town — not just an industrial site.",
    "Infrastructure, layout, and expansion all reflect that role.",
    "Where Schneider represents industrial force, Ramsden represents structure.",
    "Together, they define the framework of Barrow’s development.",
    "This statue stands as recognition of that architectural and civic influence."
  ]
},

old_fire_station: {

  kid: [
    "This building used to protect people.",
    "Firefighters worked here, ready to go at any moment.",
    "When alarms rang, they rushed out to help.",
    "Saving homes, helping people, stopping fires.",
    "Now it’s changed… but it still remembers what it was.",
    "A place built for action."
  ],

  teen: [
    "The old fire station was part of the town’s emergency system.",
    "Before modern upgrades, places like this were the centre of response.",
    "Firefighters stayed ready, always on call.",
    "It wasn’t just a building — it was a base for protection.",
    "Even though it’s no longer used the same way, its purpose still matters.",
    "It represents safety, response, and responsibility."
  ],

  adult: [
    "The old fire station reflects early organised emergency response within the town.",
    "Before modern infrastructure, these buildings served as critical operational hubs.",
    "Personnel, equipment, and readiness were concentrated here.",
    "It represents the evolution of public safety systems.",
    "Though its function has changed, its role in protecting the town remains part of its legacy.",
    "A structure tied to urgency, discipline, and service."
  ]
},

market_hall: {

  kid: [
    "This place used to be full of life.",
    "Stalls, voices, people buying and selling.",
    "Food, goods, everything happening at once.",
    "It was busy, loud, and full of energy.",
    "Places like this bring people together.",
    "Even if it changes… those moments stay part of the town."
  ],

  teen: [
    "Market halls were once the centre of everyday trade.",
    "Before supermarkets, this is where people came for everything.",
    "Food, goods, conversation, community.",
    "It wasn’t just shopping — it was social.",
    "Over time, places like this decline as new systems replace them.",
    "But their importance doesn’t disappear.",
    "They show how people used to live and interact."
  ],

  adult: [
    "The Market Hall represents traditional local commerce at its peak.",
    "Before large-scale retail chains, these spaces functioned as central trade hubs.",
    "They facilitated not only economic exchange but also social interaction.",
    "Community identity was built in places like this.",
    "Its decline reflects a broader shift toward modern retail systems.",
    "Yet its historical importance remains significant.",
    "It stands as a reminder of a more direct, localised economy."
  ]
},

duke_of_edinburgh: {

  kid: [
    "This is a place people come to relax.",
    "Talk, laugh, and spend time together.",
    "Pubs have always been part of town life.",
    "They’re not just buildings… they’re meeting places.",
    "Stories get told here.",
    "And memories are made."
  ],

  teen: [
    "Pubs like this are part of social history.",
    "They’re where people meet, talk, and connect.",
    "Not formal, not official — just real interaction.",
    "Every town has places like this.",
    "They might seem simple, but they play a role.",
    "They hold everyday stories."
  ],

  adult: [
    "Public houses have long served as informal social hubs within towns.",
    "They facilitate interaction outside structured environments like work or home.",
    "Conversation, community, and shared experience define their role.",
    "The Duke of Edinburgh fits into that tradition.",
    "It reflects continuity in social behaviour.",
    "A place where everyday life unfolds in its simplest form."
  ]
},

emlyn_hughes_statue: {

  kid: [
    "This statue is for someone special.",
    "Emlyn Hughes was a football legend.",
    "He grew up here, just like people in this town.",
    "Then he became one of the best.",
    "He played with passion, energy, and pride.",
    "That’s why he’s remembered here."
  ],

  teen: [
    "Emlyn Hughes was one of England’s great footballers.",
    "Born in Barrow, he went on to captain Liverpool and England.",
    "Known for his energy, leadership, and determination.",
    "He wasn’t just talented — he worked for it.",
    "This statue represents more than football.",
    "It represents what someone from this town can become."
  ],

  adult: [
    "Emlyn Hughes stands as a symbol of athletic excellence emerging from a local origin.",
    "Born in Barrow, he rose to captain both Liverpool FC and the England national team.",
    "His playing style was defined by intensity, leadership, and relentless effort.",
    "He embodied commitment on and off the field.",
    "This statue represents more than sporting achievement.",
    "It reflects aspiration.",
    "A reminder that global recognition can begin in places like this."
  ]
},

graving_dock: {

  kid: [
    "This place was built for big ships.",
    "Massive ones.",
    "Ships would come in, water would drain out, and workers could fix them.",
    "It’s like a giant repair station.",
    "Barrow has always been about ships.",
    "And this is where some of that work happened."
  ],

  teen: [
    "The graving dock was used to repair and maintain ships.",
    "Water is drained out so workers can access the hull.",
    "That’s essential for large-scale shipbuilding and maintenance.",
    "Barrow’s connection to naval engineering runs deep.",
    "Places like this supported that system.",
    "Behind every ship… there’s infrastructure like this."
  ],

  adult: [
    "The graving dock represents critical maritime infrastructure.",
    "It allows vessels to be serviced below the waterline — something impossible under normal conditions.",
    "This capability is essential in naval and industrial shipbuilding.",
    "Barrow’s role in submarine and ship production relies on systems like this.",
    "It reflects precision engineering and large-scale coordination.",
    "Not visible work… but absolutely essential."
  ]
},

slag_bank: {

  kid: [
    "This hill wasn’t always meant to be here.",
    "It was made from waste.",
    "Leftovers from making iron and steel.",
    "Over time… it built up into something huge.",
    "Now it looks like part of the land.",
    "But it’s actually part of Barrow’s industrial past."
  ],

  teen: [
    "The Slag Bank is man-made.",
    "It comes from waste produced during iron and steel production.",
    "Instead of disappearing, it built up over time.",
    "Now it’s part of the landscape.",
    "That’s what industry does — it changes the land itself.",
    "This isn’t natural… but now it feels like it is."
  ],

  adult: [
    "The Slag Bank is a physical consequence of industrial production.",
    "Waste material from iron and steel processes accumulated over time, forming an entirely artificial landform.",
    "It represents transformation at scale — not just economic, but environmental.",
    "Industry does not only build structures.",
    "It reshapes terrain.",
    "This is a visible record of that impact, still present long after production has slowed."
  ]
},

walney_bridge_entrance: {

  kid: [
    "This is where the land connects.",
    "One side is Barrow… the other leads to Walney Island.",
    "Bridges like this bring places together.",
    "Without it, getting across would be much harder.",
    "It’s like a gateway.",
    "One step… and you’re somewhere new."
  ],

  teen: [
    "The bridge marks a transition point.",
    "From mainland Barrow to Walney Island.",
    "Connections like this are critical.",
    "They allow movement, travel, and expansion.",
    "Without crossings like this, places stay separate.",
    "With them, everything links together."
  ],

  adult: [
    "Bridges are strategic infrastructure.",
    "They connect separated land masses and enable continuous movement.",
    "Walney Bridge transforms the island from isolated space into accessible territory.",
    "That changes everything — economically, socially, and structurally.",
    "It represents connection over separation.",
    "A controlled crossing between two distinct environments."
  ]
},

earnse_bay: {

  kid: [
    "This place feels open… wide… endless.",
    "The sea stretches out as far as you can see.",
    "Waves move, wind blows, everything feels bigger here.",
    "Places like this make you stop and look.",
    "It’s not loud… but it’s powerful.",
    "The kind of place you remember."
  ],

  teen: [
    "Earnse Bay is all about space.",
    "Open horizon, sea air, and constant movement.",
    "It’s very different from the town.",
    "Less structure, more nature.",
    "Places like this change how you think and feel.",
    "They give you distance — physically and mentally."
  ],

  adult: [
    "Earnse Bay represents exposure to natural scale.",
    "Unlike the structured environment of the town, this space is open, shifting, and uncontrolled.",
    "The horizon expands perception.",
    "The sound, the wind, the movement — all reduce the sense of confinement.",
    "It offers contrast.",
    "A necessary counterbalance to industrial and urban density."
  ]
},

walney_lighthouse: {

  kid: [
    "This lighthouse helped guide ships.",
    "When it was dark, or foggy, or dangerous.",
    "Its light showed the way.",
    "Keeping people safe from the rocks and the shore.",
    "It stood here, watching, helping.",
    "A signal in the distance."
  ],

  teen: [
    "Lighthouses are all about guidance and safety.",
    "They help ships navigate difficult waters.",
    "Especially in poor visibility.",
    "Walney Lighthouse was part of that system.",
    "It helped reduce risk in a dangerous environment.",
    "Simple idea… but critical function."
  ],

  adult: [
    "The lighthouse represents controlled navigation within an unpredictable environment.",
    "Maritime travel carries inherent risk — visibility, weather, and terrain all play a role.",
    "Structures like this reduce that uncertainty.",
    "They provide fixed reference points in a shifting landscape.",
    "Walney Lighthouse is part of a wider coastal safety network.",
    "A quiet but essential element in maritime history."
  ]
},

round_house: {

  kid: [
    "This building looks different from the others.",
    "Round, unusual, a bit mysterious.",
    "Places like this make you wonder why they were built that way.",
    "Every building has a reason.",
    "Even if you can’t see it straight away.",
    "That’s what makes it interesting."
  ],

  teen: [
    "The Round House stands out because of its shape.",
    "Most buildings follow straight lines.",
    "This one doesn’t.",
    "That makes it feel different — more noticeable, more unique.",
    "Architecture isn’t always about function alone.",
    "Sometimes it’s about identity too."
  ],

  adult: [
    "The Round House represents deviation from standard architectural form.",
    "Circular structures are less common, often requiring deliberate design choices.",
    "That makes them more intentional.",
    "It suggests purpose beyond simple construction.",
    "Whether practical or symbolic, it creates distinction.",
    "A reminder that not all structures follow the expected pattern."
  ]
},

biggar_village: {

  kid: [
    "This place feels quieter… slower.",
    "Like it hasn’t rushed to change.",
    "Villages like this hold onto their own way of life.",
    "Not everything needs to be big or busy.",
    "Sometimes small places feel stronger.",
    "Because they keep their own identity."
  ],

  teen: [
    "Biggar Village shows a different side of the area.",
    "Less industrial, less crowded, more local.",
    "Places like this don’t change as fast as towns.",
    "They keep older patterns of living.",
    "That contrast matters.",
    "Because it shows not everything moves at the same speed."
  ],

  adult: [
    "Biggar Village represents continuity at a smaller scale.",
    "Unlike rapidly expanding industrial areas, villages often retain older structures and rhythms.",
    "This creates contrast within the wider region.",
    "It reflects stability rather than expansion.",
    "A reminder that not all development is driven by growth.",
    "Some places persist by remaining consistent."
  ]
},

piel_castle: {

  kid: [
    "This castle stands out in the sea… strong and alone.",
    "It was built to protect the area.",
    "To watch, defend, and control who came close.",
    "Long ago, this place was important for safety.",
    "Now it’s quiet… but it still feels powerful.",
    "Like it’s guarding something."
  ],

  teen: [
    "Piel Castle was built for defence and control.",
    "Positioned on an island, it could watch the surrounding waters.",
    "That made it strategically important.",
    "It wasn’t just a building — it was protection.",
    "A way to control movement and defend the coast.",
    "Even now, its location shows how carefully it was chosen."
  ],

  adult: [
    "Piel Castle represents coastal defence through strategic positioning.",
    "Located on an island, it provided visibility and control over surrounding waters.",
    "This allowed for early detection of threats and regulation of movement.",
    "Its construction reflects a period where control of territory required physical presence.",
    "Now reduced to ruins, it still conveys authority.",
    "A structure built for dominance, now standing as historical residue."
  ]
},

roa_island_jetty: {

  kid: [
    "This jetty reaches out into the water.",
    "Like it’s trying to connect land and sea.",
    "Boats, people, journeys — all pass through places like this.",
    "It’s where movement begins… or ends.",
    "Simple… but important.",
    "Because it links two worlds together."
  ],

  teen: [
    "Jetties act as transition points.",
    "From land to water.",
    "They allow access, travel, and connection.",
    "Roa Island’s jetty is part of that system.",
    "Not dramatic, but essential.",
    "Because without places like this, movement becomes limited."
  ],

  adult: [
    "The jetty represents functional interface between land and maritime movement.",
    "It enables transfer — of people, goods, and access.",
    "These structures are often overlooked, yet they are critical to connectivity.",
    "Roa Island’s jetty plays a supporting role in the wider coastal system.",
    "It is not symbolic or monumental.",
    "It is practical — and that is precisely its value."
  ]
},

amphitheatre_core: {

  kid: [
    "This place feels like it was made for something.",
    "Like people gathered here.",
    "Sat, watched, listened.",
    "You can imagine voices echoing… sounds carrying.",
    "It’s shaped like a space for something to happen.",
    "And that’s what makes it feel alive."
  ],

  teen: [
    "Spaces like this are designed for gathering.",
    "The shape helps sound travel.",
    "People sit, watch, and focus on what’s happening in the centre.",
    "It turns space into experience.",
    "Not random — intentional.",
    "Built so something can happen here."
  ],

  adult: [
    "The amphitheatre reflects deliberate spatial design for collective experience.",
    "Its structure supports visibility, acoustics, and shared focus.",
    "This is architecture shaped by interaction.",
    "A place where attention is directed and controlled.",
    "Even without active use, the form suggests purpose.",
    "It is built to hold moments — performance, gathering, presence."
  ]
},

abbey_ruins_marker: {

  kid: [
    "These stones are part of something much bigger.",
    "They’re not just random pieces.",
    "They used to be walls, rooms, part of a huge place.",
    "Now only parts remain.",
    "But they still tell the story.",
    "If you look closely."
  ],

  teen: [
    "Ruins like this are fragments of something that once stood complete.",
    "Time breaks structures down, but it doesn’t erase them completely.",
    "What’s left becomes evidence.",
    "You can trace what used to be here.",
    "Piece by piece.",
    "History doesn’t disappear — it fades into forms like this."
  ],

  adult: [
    "The ruins represent structural memory.",
    "What remains is not the full design, but enough to indicate what once existed.",
    "Stone persists where function has disappeared.",
    "These fragments allow reconstruction — not physically, but intellectually.",
    "They are incomplete, yet informative.",
    "A visible trace of something that no longer operates, but still defines the space."
  ]
},

park_playground: {

  kid: [
    "This place is built for energy.",
    "Running, climbing, laughing, shouting.",
    "A playground isn’t just equipment — it’s a space made for fun.",
    "That matters, because towns need places where kids can just be kids.",
    "Places like this hold memories.",
    "Not written in books… but felt."
  ],

  teen: [
    "A playground tells you something about a town.",
    "It shows that space has been set aside for play, not just work or movement.",
    "That matters more than it seems.",
    "Because public life isn’t only about roads, buildings, and systems.",
    "It’s also about growing up, spending time together, and building memories.",
    "Places like this shape that side of life."
  ],

  adult: [
    "Playgrounds are a form of social infrastructure.",
    "They provide more than recreation — they shape early experience, memory, and community use of public space.",
    "Their value is often underestimated because they appear informal.",
    "Yet they play a critical role in how families inhabit a town.",
    "This is not decorative space.",
    "It is developmental space, built into everyday life."
  ]
},

park_bowling_green_core: {

  kid: [
    "This part of the park feels calmer.",
    "Slower. More careful.",
    "Bowling isn’t about rushing — it’s about control.",
    "That gives this place a different kind of energy.",
    "Quiet, focused, steady.",
    "A reminder that parks can hold more than one kind of fun."
  ],

  teen: [
    "The bowling green shows a different side of public leisure.",
    "Not loud, not fast — measured and precise.",
    "That changes the atmosphere around it.",
    "It adds variety to the park.",
    "Different people, different pace, different use of the same space.",
    "That’s part of what makes parks work well."
  ],

  adult: [
    "The bowling green reflects structured leisure within public design.",
    "Unlike open play areas, it requires order, maintenance, and controlled use.",
    "It represents a more formal tradition of recreation.",
    "Its presence broadens the social function of the park.",
    "Not all leisure is spontaneous.",
    "Some of it is deliberate, disciplined, and quietly communal."
  ]
},

park_cafe_core: {

  kid: [
    "This is where the park slows down for a bit.",
    "People stop, sit, eat, drink, and talk.",
    "That’s important too.",
    "Not every part of a place has to be action.",
    "Sometimes the best part is just pausing together.",
    "And this is a place built for that."
  ],

  teen: [
    "A park café does more than sell food and drinks.",
    "It gives people a reason to stay longer.",
    "To sit, talk, rest, and take the place in.",
    "That makes it part of the social life of the park.",
    "Not the loudest feature, but one of the most human.",
    "A pause point in the middle of movement."
  ],

  adult: [
    "The park café represents social pause within public space.",
    "It supports lingering rather than simple movement through.",
    "That changes how the park functions.",
    "People gather, rest, observe, and remain longer.",
    "This kind of amenity turns open space into inhabitable space.",
    "A subtle but important shift from landscape… to lived environment."
  ]
},

ormsgill_reservoir: {

  kid: [
    "Water like this does an important job.",
    "It isn’t just there to look at.",
    "Reservoirs help store water for people to use.",
    "So even if it seems quiet… it matters a lot.",
    "Big systems can look simple from the outside.",
    "But they keep everything running."
  ],

  teen: [
    "A reservoir is part of the town’s hidden support system.",
    "Most people don’t think about it much.",
    "But water storage is essential.",
    "It supports homes, services, and everyday life.",
    "That makes this place part of the town’s infrastructure.",
    "Quiet, practical, and easy to overlook — but important."
  ],

  adult: [
    "The reservoir reflects infrastructure at its most understated.",
    "It is not ceremonial, expressive, or visible in the way landmarks are.",
    "Yet it supports the basic continuity of daily life.",
    "Water storage is foundational to any functioning settlement.",
    "This places Ormsgill Reservoir within the logic of civic systems.",
    "A hidden layer of support beneath the visible town."
  ]
},

barrow_afc_grounds: {

  kid: [
    "This is where the football feeling lives.",
    "Crowds, noise, excitement, people all focused on the same thing.",
    "Places like this hold big moments.",
    "Wins, losses, chants, memories.",
    "It’s more than just a pitch.",
    "It’s part of what the town feels like."
  ],

  teen: [
    "Football grounds carry local identity in a powerful way.",
    "They bring people together through loyalty, competition, and emotion.",
    "Barrow AFC’s ground is part of that.",
    "It holds more than matches.",
    "It holds atmosphere, belonging, and shared memory.",
    "That makes it an important part of the town’s culture."
  ],

  adult: [
    "A football ground functions as a civic-emotional space.",
    "It concentrates identity, loyalty, and collective attention.",
    "Barrow AFC’s grounds are not only about sport.",
    "They are about belonging — where local pride is performed and reinforced.",
    "Such places matter because they create recurring, shared experience.",
    "Not abstract identity… but lived identity, voiced in public."
  ]
},

rugby_ground: {

  kid: [
    "This is another place full of energy.",
    "Running, tackling, teamwork.",
    "Rugby is tough, fast, and full of action.",
    "Places like this bring people together.",
    "Players on the field… people watching and cheering.",
    "It’s all part of the feeling of the town."
  ],

  teen: [
    "Rugby grounds represent a different kind of sport culture.",
    "More physical, more direct, more intense.",
    "But just like football, it builds identity.",
    "Teams, supporters, community.",
    "These places become part of how people connect.",
    "Sport turns space into something shared."
  ],

  adult: [
    "The rugby ground reflects organised sport as a form of structured community interaction.",
    "It creates a space where competition, discipline, and teamwork are performed publicly.",
    "Like football grounds, it reinforces local identity.",
    "But through a different tone — more physical, more direct.",
    "It represents another layer of civic life.",
    "Where shared attention builds collective meaning."
  ]
},

hollywood_park: {

  kid: [
    "This place is all about fun.",
    "Games, lights, movement, noise.",
    "Bowling, playing, spending time together.",
    "It’s made for enjoyment.",
    "Not serious… just fun.",
    "And that matters too."
  ],

  teen: [
    "Entertainment spaces like this show a modern side of town life.",
    "Leisure, games, and social time.",
    "It’s not about work or history — it’s about experience.",
    "Places like this give people a break from routine.",
    "They create shared moments.",
    "That’s part of how a town feels alive."
  ],

  adult: [
    "Hollywood Park reflects contemporary leisure culture.",
    "It provides structured entertainment in a controlled environment.",
    "Unlike older social spaces, it is designed around experience and consumption.",
    "This marks a shift in how people spend free time.",
    "From informal gathering to organised activity.",
    "It represents modern patterns of recreation within the town."
  ]
},

furness_general_hospital: {

  kid: [
    "This place helps people when they need it most.",
    "Doctors, nurses, care, and support.",
    "Hospitals are where people go to get better.",
    "It’s a place of help, even when things are hard.",
    "Quiet, serious, important.",
    "A place that looks after the town."
  ],

  teen: [
    "Hospitals are one of the most important parts of any town.",
    "They provide care, treatment, and emergency support.",
    "Furness General plays that role here.",
    "It’s not always visible from the outside.",
    "But inside, critical work is happening every day.",
    "It represents protection at a different level — health."
  ],

  adult: [
    "Furness General Hospital represents essential healthcare infrastructure.",
    "It supports the physical wellbeing of the population.",
    "Unlike other civic structures, its function is continuous and critical.",
    "Care, treatment, and emergency response operate here at all times.",
    "It is not symbolic — it is functional at the highest level.",
    "A core system within the town’s structure."
  ]
},

rampside_needle: {

  kid: [
    "This tall stone stands out against the sky.",
    "It looks like a marker… like it’s pointing somewhere.",
    "Long ago, places like this helped guide people.",
    "Showing direction, warning of danger, or marking a path.",
    "It’s quiet now… but it still stands strong.",
    "Like it’s watching the coast."
  ],

  teen: [
    "Rampside Needle is a navigational marker.",
    "Structures like this helped guide ships along the coastline.",
    "Before modern technology, physical markers were essential.",
    "They showed safe routes and warned of hazards.",
    "This is part of that system.",
    "Simple, but incredibly important at the time."
  ],

  adult: [
    "Rampside Needle represents early navigational infrastructure.",
    "Before electronic systems, coastal markers provided essential guidance.",
    "They indicated position, direction, and potential hazards.",
    "This structure formed part of that network.",
    "Its presence reflects reliance on fixed visual reference points in maritime travel.",
    "A functional object that once carried critical importance."
  ]
},

st_georges_church: {

  kid: [
    "This building is quiet… calm… peaceful.",
    "Churches are places where people come to think, reflect, and be still.",
    "They’ve been part of towns for a long time.",
    "People gather here for important moments in life.",
    "Happy and sad ones.",
    "That’s what gives places like this meaning."
  ],

  teen: [
    "Churches have always been central to community life.",
    "Not just for religion, but for gathering and shared experience.",
    "St. George’s is part of that tradition.",
    "It holds history through the people who have passed through it.",
    "Events, ceremonies, generations.",
    "It’s a place shaped by time as much as structure."
  ],

  adult: [
    "St. George’s Church represents religious and social continuity within the town.",
    "Churches function as both spiritual centres and communal spaces.",
    "They host key life events — birth, marriage, death.",
    "This gives them lasting significance beyond architecture.",
    "The building becomes a container for collective memory.",
    "A place where time is marked through human experience."
  ]
},

bae_main_gate: {

  kid: [
    "Behind these gates… big things are built.",
    "Really big.",
    "Submarines, machines, things that go deep under the sea.",
    "People work here every day, building something powerful.",
    "It’s one of the most important places in Barrow.",
    "Even if you can’t see inside… it’s always working."
  ],

  teen: [
    "BAE Systems is one of the biggest parts of Barrow’s identity.",
    "This is where submarines are designed and built.",
    "Not small ones — massive, advanced machines.",
    "People here work with precision, engineering, and responsibility.",
    "This isn’t just local industry.",
    "It connects Barrow to national defence and global systems."
  ],

  adult: [
    "BAE Systems represents the modern continuation of Barrow’s industrial legacy.",
    "Specialising in submarine construction, it operates at a high level of engineering complexity.",
    "This site connects the town directly to national defence infrastructure.",
    "Work here involves precision, security, and advanced manufacturing.",
    "It reflects continuity — from iron and steel to modern naval engineering.",
    "A direct line from Barrow’s past into its present."
  ]
},

hindpool_tiger_core: {

  kid: [
    "This tiger stands out.",
    "Strong, bold, impossible to ignore.",
    "It feels like a symbol of something.",
    "Power, energy, presence.",
    "Places like this make you stop and look.",
    "And remember it."
  ],

  teen: [
    "The Hindpool Tiger is a visual landmark.",
    "It represents identity through image.",
    "Strong, bold, and noticeable.",
    "Symbols like this give areas character.",
    "They turn ordinary space into something recognisable.",
    "Something people remember."
  ],

  adult: [
    "The Hindpool Tiger functions as a symbolic landmark.",
    "It introduces identity through visual impact rather than historical depth.",
    "Such markers shape perception of place.",
    "They create recognition and association.",
    "Not all meaning comes from history.",
    "Some comes from presence.",
    "And this is a clear example of that."
  ]
},

dalton_road_clock: {

  kid: [
    "Another clock… another rhythm of the town.",
    "People pass by it every day.",
    "Checking time, moving on, living life.",
    "Clocks like this keep everything in sync.",
    "They’re part of the town’s flow.",
    "Always ticking."
  ],

  teen: [
    "Clocks like this once helped organise daily life.",
    "Before everyone had phones, this mattered.",
    "It gave people a shared sense of time.",
    "Work, travel, meetings — all linked to it.",
    "It’s simple now, but it used to be essential.",
    "A public reference point."
  ],

  adult: [
    "The Dalton Road clock reflects decentralised public timekeeping.",
    "Multiple clocks across a town ensured synchronisation of activity.",
    "Before personal devices, these structures held authority.",
    "They regulated movement, work, and coordination.",
    "It represents distributed order within urban space.",
    "A system of shared temporal structure."
  ]
},

voodoo_entrance: {

  kid: [
    "This place feels different.",
    "Music, lights, energy.",
    "It’s where people come to enjoy themselves.",
    "Loud, fun, alive.",
    "Places like this bring excitement to the town.",
    "They change the mood."
  ],

  teen: [
    "This is part of the town’s nightlife and entertainment.",
    "Music, socialising, energy.",
    "Places like this offer release from routine.",
    "They’re about experience, not structure.",
    "That makes them important in a different way.",
    "They shape how people enjoy their time."
  ],

  adult: [
    "Venues like this represent contemporary social release.",
    "They provide environments for music, interaction, and temporary escape from routine.",
    "Unlike traditional civic spaces, they are built around atmosphere and experience.",
    "They contribute to the emotional landscape of the town.",
    "Not structured… but expressive.",
    "A different layer of urban life."
  ]
},

bus_depot: {

  kid: [
    "This is where journeys begin.",
    "Buses come and go, people travel from place to place.",
    "It connects everything together.",
    "Without places like this, moving around would be harder.",
    "It’s always busy… always moving.",
    "Part of the town’s rhythm."
  ],

  teen: [
    "The bus depot is part of the town’s transport system.",
    "It connects different areas and keeps people moving.",
    "Work, school, travel — all depend on it.",
    "It might not stand out, but it’s essential.",
    "Movement is what keeps a town alive.",
    "And this is part of that system."
  ],

  adult: [
    "The bus depot represents organised public transport infrastructure.",
    "It supports movement across the town and beyond.",
    "This enables access to work, services, and connection between areas.",
    "Transport systems are foundational to urban function.",
    "Often overlooked, but critical.",
    "They sustain the flow that keeps the town operational."
  ]
},

north_walney_reserve_gate: {

  kid: [
    "This is where things start to feel different.",
    "More nature. More space. More quiet.",
    "Animals live here, birds fly here, the land feels alive.",
    "It’s not like the town.",
    "It’s wilder.",
    "And that’s what makes it special."
  ],

  teen: [
    "This gate marks the entrance to a protected natural space.",
    "North Walney is known for wildlife and open landscape.",
    "It’s less controlled, less structured than the town.",
    "That change matters.",
    "Because it shows a different side of the area.",
    "Not built… but preserved."
  ],

  adult: [
    "North Walney Nature Reserve represents environmental preservation within the region.",
    "Unlike the industrial and urban zones, this space is protected rather than developed.",
    "It supports wildlife, biodiversity, and natural systems.",
    "This contrast is important.",
    "It shows that not all land is shaped for human expansion.",
    "Some is maintained for balance."
  ]
},

sandy_gap_beach_access: {

  kid: [
    "This is where you reach the beach.",
    "Sand, sea, wind, waves.",
    "It feels open and free.",
    "Nothing blocking your view.",
    "Places like this feel bigger than everything else.",
    "Like the world just keeps going."
  ],

  teen: [
    "Beach access points connect people to open coastline.",
    "Once you step through, everything changes.",
    "No buildings, no structure — just space.",
    "That shift in environment is powerful.",
    "It resets how you feel.",
    "From town… to open world."
  ],

  adult: [
    "Beach access marks transition into exposed coastal environment.",
    "The structured, controlled space of the town gives way to open, dynamic terrain.",
    "Wind, tide, and horizon redefine perception.",
    "This shift has psychological impact.",
    "It reduces confinement and expands awareness.",
    "A boundary between built space and natural scale."
  ]
},

walney_airfield_entrance: {

  kid: [
    "Planes once used places like this.",
    "Taking off, landing, moving through the sky.",
    "It’s about travel, distance, and movement.",
    "Even if it’s quiet now… it still feels like something happened here.",
    "Like it was built for motion.",
    "And the sky above it."
  ],

  teen: [
    "Airfields represent another layer of transport.",
    "Not roads. Not sea. Air.",
    "They connect places over long distances.",
    "Walney’s airfield shows that this area wasn’t isolated.",
    "It had links beyond land and water.",
    "Movement in every direction."
  ],

  adult: [
    "The airfield represents aerial infrastructure within a multi-layered transport system.",
    "Land, sea, and air all intersect within the region’s development.",
    "Though less dominant than maritime industry, aviation adds another dimension of connectivity.",
    "It reflects expansion of movement beyond physical terrain.",
    "A shift from surface travel to vertical space."
  ]
},

vickerstown_park: {

  kid: [
    "This is another place to stop, play, and relax.",
    "Green space, open air, somewhere to just be.",
    "Not every important place is big or famous.",
    "Some are just part of everyday life.",
    "And that’s what makes them important.",
    "Because people use them all the time."
  ],

  teen: [
    "Parks like this support daily life.",
    "They give people space to move, relax, and spend time.",
    "Not dramatic, but necessary.",
    "They balance out the built environment.",
    "Without places like this, towns feel heavier.",
    "More closed in."
  ],

  adult: [
    "Vickerstown Park reflects distributed public space within residential areas.",
    "It provides access to open environment without requiring travel to larger parks.",
    "This decentralisation of green space supports everyday use.",
    "It contributes to livability rather than spectacle.",
    "A quieter but essential part of urban design."
  ]
},

king_alfred_pub: {

  kid: [
    "Another place where people come together.",
    "Talking, laughing, sharing time.",
    "Pubs like this are part of everyday life.",
    "Not big… but important.",
    "Because people meet here.",
    "And that’s what matters."
  ],

  teen: [
    "Pubs like this are part of local social life.",
    "They give people a place to gather and connect.",
    "Not formal, not structured.",
    "Just real interaction.",
    "Every area has places like this.",
    "They hold everyday stories."
  ],

  adult: [
    "Local pubs function as informal social nodes within communities.",
    "They support interaction outside structured environments.",
    "Conversation, familiarity, and routine define their role.",
    "The King Alfred fits into this pattern.",
    "Not historically dominant, but socially consistent.",
    "A place where daily life becomes shared experience."
  ]
},

thorny_nook: {

  kid: [
    "This place feels quiet… almost hidden.",
    "Like not everyone comes this way.",
    "Places like this feel different.",
    "Less noise, less movement, more calm.",
    "It’s the kind of place where you notice things more.",
    "Because everything slows down."
  ],

  teen: [
    "Thorny Nook has a more secluded feel.",
    "Less traffic, less activity.",
    "That changes how you experience it.",
    "It becomes more about awareness than movement.",
    "Places like this aren’t built to stand out.",
    "They’re built to exist quietly."
  ],

  adult: [
    "Thorny Nook represents low-intensity spatial use.",
    "It lacks the density and structure of more active areas.",
    "This creates a different psychological effect.",
    "Reduced noise, reduced interruption, increased awareness.",
    "Such spaces are often overlooked, yet they provide balance.",
    "A quieter layer within the wider environment."
  ]
},

south_walney_reserve_entrance: {

  kid: [
    "This is where the wild part really begins.",
    "Birds, sea, wind, open land.",
    "Not controlled, not built — just nature.",
    "Places like this feel bigger than you.",
    "That’s what makes them exciting.",
    "And a little bit powerful."
  ],

  teen: [
    "South Walney is one of the most exposed natural areas here.",
    "Wildlife, coastline, and open terrain dominate the space.",
    "There’s less control, more unpredictability.",
    "That changes how you move and how you think.",
    "You’re not shaping the environment here.",
    "You’re entering it."
  ],

  adult: [
    "South Walney Nature Reserve represents minimal human control over landscape.",
    "It is exposed, dynamic, and shaped primarily by natural forces.",
    "Wind, tide, and wildlife define its character.",
    "Unlike urban environments, this space resists structure.",
    "It requires adaptation rather than control.",
    "A reminder of scale beyond human design."
  ]
},

walney_school: {

  kid: [
    "This is where people learn and grow.",
    "Not just reading and writing… but everything.",
    "Friends, experiences, memories.",
    "Places like this shape who people become.",
    "It’s more than a building.",
    "It’s where journeys begin."
  ],

  teen: [
    "Schools are foundational to any community.",
    "They shape knowledge, behaviour, and future paths.",
    "Walney School is part of that system.",
    "It supports the next generation.",
    "Not always visible from the outside.",
    "But incredibly important over time."
  ],

  adult: [
    "Walney School represents structured education within the local system.",
    "It contributes to long-term development of individuals and community.",
    "Education shapes capability, opportunity, and progression.",
    "Its impact is gradual but significant.",
    "A core institution within the social framework.",
    "Quietly influencing the future of the area."
  ]
},

west_shore_park: {

  kid: [
    "This place feels open… but calmer than the beach.",
    "You can still feel the sea, but it’s softer here.",
    "Space to move, to play, to breathe.",
    "Not loud… not busy… just right.",
    "Places like this give you room.",
    "And that’s important."
  ],

  teen: [
    "West Shore Park sits between built space and open coastline.",
    "It blends structure with openness.",
    "That makes it easier to use, but still connected to nature.",
    "It’s a transition space.",
    "Not fully wild, not fully urban.",
    "Balanced between both."
  ],

  adult: [
    "West Shore Park represents a moderated coastal environment.",
    "It provides access to open space while maintaining usability and structure.",
    "This creates a controlled version of exposure.",
    "Less extreme than the coastline, but still expansive.",
    "It bridges the gap between urban design and natural landscape.",
    "A hybrid space within the system."
  ]
},

jubilee_bridge_midpoint: {

  kid: [
    "Right here… you’re between two places.",
    "Land on one side… land on the other.",
    "And water all around.",
    "It feels different standing here.",
    "Like you’re crossing from one world to another.",
    "Halfway between both."
  ],

  teen: [
    "The midpoint of a bridge is a transition zone.",
    "You’re no longer in one place, but not fully in the next.",
    "That creates a unique feeling.",
    "Movement becomes more noticeable.",
    "You’re aware of crossing, not just arriving.",
    "That’s what makes places like this stand out."
  ],

  adult: [
    "The midpoint of a bridge represents spatial transition in its purest form.",
    "It is neither origin nor destination.",
    "Instead, it is defined by movement itself.",
    "Suspended between two environments.",
    "This creates heightened awareness of position and change.",
    "A moment of passage rather than place."
  ]
},

coast_road_entrance: {

  kid: [
    "This road leads along the edge of the land.",
    "One side… the sea.",
    "The other… the island.",
    "It feels different driving or walking here.",
    "Like you’re right on the edge of everything.",
    "Where land meets something much bigger."
  ],

  teen: [
    "Coast roads change how you experience movement.",
    "You’re not surrounded by buildings anymore.",
    "You’re exposed — sea, wind, open space.",
    "That creates a different kind of awareness.",
    "You feel the environment more directly.",
    "Less control… more presence."
  ],

  adult: [
    "Coastal roads represent movement along environmental boundaries.",
    "They exist at the edge of stability — between land and open water.",
    "This creates a heightened sensory experience.",
    "Wind, visibility, and exposure all increase.",
    "It reinforces awareness of scale beyond the built environment.",
    "A route defined by its position at the limit."
  ]
},

lifeboat_station_roa: {

  kid: [
    "This is where heroes set out.",
    "When people are in trouble at sea… they go.",
    "No hesitation.",
    "Through waves, wind, and danger.",
    "To bring people back safely.",
    "That’s what this place stands for."
  ],

  teen: [
    "Lifeboat stations exist for emergency rescue at sea.",
    "When something goes wrong, this is where response begins.",
    "Crews launch into dangerous conditions to save lives.",
    "It requires skill, courage, and commitment.",
    "This isn’t routine work.",
    "It’s high risk, real responsibility."
  ],

  adult: [
    "The lifeboat station represents frontline maritime rescue capability.",
    "Operations launched from here respond to emergencies under unpredictable and often severe conditions.",
    "This requires trained crews, rapid deployment, and high-risk decision-making.",
    "It reflects a system built around preservation of life.",
    "Unlike industrial or commercial infrastructure, its purpose is immediate and critical.",
    "A place defined by action under pressure."
  ]
},

concle_inn: {

  kid: [
    "This is a place people stop on their journey.",
    "Eat, rest, talk, and take a break.",
    "Places like this are part of travelling.",
    "You don’t just move — you pause too.",
    "And that’s part of the experience.",
    "Stopping matters as much as going."
  ],

  teen: [
    "Inns like this have always supported movement.",
    "Travellers stop, rest, and continue on.",
    "They’re part of the journey system.",
    "Not the destination, but still important.",
    "They connect routes through people and time.",
    "A place between places."
  ],

  adult: [
    "The Concle Inn reflects traditional support structures for travel.",
    "It provides rest, refreshment, and temporary pause within longer journeys.",
    "Such places are transitional in nature.",
    "They are not endpoints, but necessary interruptions.",
    "Movement requires moments of stillness.",
    "This is where that balance is maintained."
  ]
},

abbey_railway_ruins: {

  kid: [
    "Trains once moved through here.",
    "Tracks, engines, journeys.",
    "Now only pieces remain.",
    "But you can still imagine it.",
    "The noise, the movement, the travel.",
    "A path that used to be alive."
  ],

  teen: [
    "These ruins are part of an old railway system.",
    "Trains once connected this area to others.",
    "Moving people, goods, and industry.",
    "Over time, systems change, and parts are left behind.",
    "But they don’t disappear completely.",
    "They leave traces like this."
  ],

  adult: [
    "The railway ruins represent infrastructure that once supported movement and industry.",
    "Rail networks were essential to expansion, transport, and economic growth.",
    "As systems evolve, parts become redundant.",
    "What remains is structural evidence.",
    "These fragments show how the area was once connected and utilised.",
    "A visible layer of past mobility."
  ]
},

amphitheatre_steps: {

  kid: [
    "These steps lead somewhere special.",
    "Up, down, around — shaping the space.",
    "Places like this guide how people move.",
    "They turn simple ground into something designed.",
    "You don’t just walk here… you follow it.",
    "And that makes it feel different."
  ],

  teen: [
    "Steps like these control movement and position.",
    "They guide people into specific viewpoints and areas.",
    "That’s part of design.",
    "Not random, but intentional.",
    "They shape how the space is used.",
    "And how it’s experienced."
  ],

  adult: [
    "The amphitheatre steps represent controlled movement within designed space.",
    "They direct flow, position, and perspective.",
    "This is architecture influencing behaviour.",
    "People do not move freely here — they are guided.",
    "Such design creates structure within open environments.",
    "A subtle but effective form of spatial control."
  ]
},

abbey_road_baptist_church: {

  kid: [
    "This is a place where people come to be still.",
    "To think, to pray, and to be together.",
    "Churches are more than buildings.",
    "They hold moments that matter.",
    "Big moments. Quiet moments.",
    "That’s what gives places like this their meaning."
  ],

  teen: [
    "Churches like this are part of the town’s deeper social history.",
    "They’re not only about religion.",
    "They’re about community, gathering, and important life events.",
    "People come here in happy times and hard times.",
    "That means the building becomes part of memory itself.",
    "More than structure — it becomes part of people’s lives."
  ],

  adult: [
    "Abbey Road Baptist Church represents spiritual continuity within the civic landscape.",
    "Religious buildings like this do more than serve belief.",
    "They support community, ritual, and shared reflection.",
    "Over time, they become containers of memory.",
    "Birth, marriage, grief, hope — all pass through spaces like this.",
    "Its importance lies not only in architecture, but in accumulated human experience."
  ]
},

nan_tait_centre: {

  kid: [
    "This is a place for creativity.",
    "Art, ideas, expression.",
    "Not every important place is about building things with steel or stone.",
    "Some places build with imagination.",
    "That matters too.",
    "Because a town needs colour as well as structure."
  ],

  teen: [
    "The Nan Tait Centre represents creativity inside the town.",
    "Art spaces give people somewhere to express, explore, and make things.",
    "That’s important, because identity is not only built through industry.",
    "It’s also built through culture.",
    "Places like this make room for another side of town life.",
    "The part that thinks, creates, and experiments."
  ],

  adult: [
    "The Nan Tait Centre represents cultural production within the town’s civic fabric.",
    "It provides space for artistic work, exhibition, and expression.",
    "That role matters because culture expands how a place understands itself.",
    "Industry builds the material framework of a town.",
    "Art reshapes its internal meaning.",
    "This centre stands for that quieter but essential process — creation beyond utility."
  ]
},

barrow_fire_station: {

  kid: [
    "This is where help stands ready.",
    "Firefighters, engines, alarms, action.",
    "When something goes wrong, this place moves fast.",
    "It protects homes, streets, and people.",
    "That makes it one of the town’s strongest places.",
    "Always ready. Always important."
  ],

  teen: [
    "The fire station is part of the town’s emergency system.",
    "It exists for response — fast, disciplined, and direct.",
    "When danger happens, this is where action begins.",
    "That makes it more than just a building.",
    "It’s a readiness point.",
    "A place built around protection."
  ],

  adult: [
    "Barrow Fire Station represents organised emergency response in its active form.",
    "Unlike retired or historic service buildings, this site operates in the present tense.",
    "It is built around readiness, speed, and coordinated action.",
    "Its significance lies in function under pressure.",
    "Protection here is not symbolic.",
    "It is immediate, operational, and essential to the town’s resilience."
  ]
},

submarine_memorial: {

  kid: [
    "This place is quiet for a reason.",
    "It remembers people connected to submarines and the sea.",
    "Not just machines… people.",
    "People who served, worked, and were part of something serious.",
    "So when you’re here, you slow down a bit.",
    "Because this place is about remembering."
  ],

  teen: [
    "The Submarine Memorial connects Barrow’s engineering identity to human lives.",
    "Behind the submarines, behind the systems, there were real people.",
    "Some of them never came back.",
    "That’s why this place feels different.",
    "It doesn’t celebrate machinery on its own.",
    "It reminds you of the cost that can sit behind achievement."
  ],

  adult: [
    "The Submarine Memorial exists at the meeting point of engineering, service, and loss.",
    "It forces recognition that technological achievement is never entirely separate from human consequence.",
    "Barrow’s submarine legacy is often understood through industry and national defence.",
    "This memorial shifts the focus.",
    "It centres the lives tied to that system — those who served within it, and those who were lost to it.",
    "What stands here is not simply pride.",
    "It is remembrance under pressure.",
    "A place where production, duty, and sacrifice become impossible to separate."
  ]
},

victoria_hall: {

  kid: [
    "This place was made for people coming together.",
    "Shows, voices, events, and big moments.",
    "Buildings like this hold excitement.",
    "They make space for things to happen.",
    "Not just work… not just passing through.",
    "But shared moments people remember."
  ],

  teen: [
    "Victoria Hall is part of the town’s performance and gathering history.",
    "Places like this hold events, music, speaking, and shared attention.",
    "That makes them important in a different way from factories or offices.",
    "They create cultural memory.",
    "A place where people don’t just live in the town — they experience it together."
  ],

  adult: [
    "Victoria Hall represents collective gathering through culture and event.",
    "Such spaces support performance, ceremony, and public attention.",
    "Their importance lies in concentration — people brought together for a shared experience.",
    "That creates memory at scale.",
    "Not industrial output, not private life, but civic presence.",
    "A hall like this becomes part of how a town stages itself to its own people."
  ]
},

barrow_golf_club: {

  kid: [
    "This place is all about space and precision.",
    "Wide fields, careful shots, quiet focus.",
    "Golf isn’t fast — it’s controlled.",
    "That makes this place feel calm.",
    "Different from loud sports.",
    "More about thinking than rushing."
  ],

  teen: [
    "Golf spaces are designed very differently from other sports areas.",
    "They’re spread out, controlled, and quiet.",
    "That changes how people use them.",
    "Less intensity, more precision.",
    "It’s another layer of leisure in the town.",
    "Showing not all activity is high energy."
  ],

  adult: [
    "Barrow Golf Club represents structured leisure across extended landscape.",
    "Unlike compact sports grounds, it requires space, planning, and maintenance.",
    "The pace is slower, the focus more deliberate.",
    "This introduces variation in how recreation is experienced.",
    "Not all activity is collective intensity.",
    "Some is quiet control within open terrain."
  ]
},

hawcoat_quarry: {

  kid: [
    "This place used to be about digging into the ground.",
    "Taking stone, shaping land, changing what was here.",
    "Quarries don’t just sit on the land… they cut into it.",
    "That means this place looks different because of people.",
    "Not just nature.",
    "But work."
  ],

  teen: [
    "Hawcoat Quarry shows how industry directly reshapes land.",
    "Stone was extracted from here for building and development.",
    "That process leaves visible marks.",
    "It’s not just something you read about — you can see it.",
    "The shape of the land changes.",
    "That’s industry at ground level."
  ],

  adult: [
    "Hawcoat Quarry represents extraction-based industry at a physical level.",
    "Unlike factories, which build upward, quarries cut downward into terrain.",
    "This creates permanent alteration of landscape.",
    "Material removed here would have contributed to wider construction and development.",
    "The site itself becomes evidence of that process.",
    "A visible imprint of industrial intervention."
  ]
},

st_pauls_church: {

  kid: [
    "This is another quiet place in the town.",
    "A place to stop, think, and reflect.",
    "Churches have been part of life for a long time.",
    "People come here for important moments.",
    "That’s what gives it meaning.",
    "Not just the building… but what happens inside it."
  ],

  teen: [
    "St. Paul’s Church is part of the town’s long-standing community structure.",
    "It’s not only about religion.",
    "It’s about gathering, ceremony, and shared experience.",
    "Places like this connect generations.",
    "People come here at key points in life.",
    "That’s what builds lasting significance."
  ],

  adult: [
    "St. Paul’s Church reflects continuity within the town’s civic and spiritual framework.",
    "It serves as a site for ritual, gathering, and shared meaning.",
    "Over time, such buildings accumulate human experience.",
    "They become more than architecture.",
    "They become reference points for life events.",
    "A stable presence within a changing environment."
  ]
},

strawberry_pub: {

  kid: [
    "This is another place where people meet.",
    "Talk, laugh, and spend time together.",
    "Places like this are part of everyday life.",
    "Not big… but important.",
    "Because people come here.",
    "And that’s what gives it meaning."
  ],

  teen: [
    "Local pubs like this are part of social life.",
    "They give people a place to connect outside of work or home.",
    "Simple, but important.",
    "They hold conversations, routines, and familiar faces.",
    "That builds a sense of place.",
    "Even without big history behind them."
  ],

  adult: [
    "The Strawberry Pub represents informal social infrastructure.",
    "It supports everyday interaction within the community.",
    "Unlike major civic spaces, it operates on familiarity and routine.",
    "Its value lies in consistency rather than scale.",
    "A place where local life continues without ceremony.",
    "Quietly reinforcing connection."
  ]
},

red_river_waterfall: {

  kid: [
    "The water moves faster here.",
    "You can hear it before you see it.",
    "It rushes, falls, and keeps going.",
    "This is the same river… but stronger here.",
    "It shows how things can change along the way.",
    "From calm… to powerful."
  ],

  teen: [
    "The Red River changes character here.",
    "From slow movement to faster, more forceful flow.",
    "That shows how environment shapes behaviour.",
    "Same river — different conditions.",
    "It becomes more noticeable, more intense.",
    "Movement becomes visible energy."
  ],

  adult: [
    "The waterfall marks a shift in the river’s behaviour.",
    "Gradient, terrain, and flow combine to increase energy and movement.",
    "What was subtle becomes visible.",
    "This reflects how systems change under different conditions.",
    "The same river expresses itself differently depending on context.",
    "A localised display of natural force within a controlled landscape."
  ]
},

furness_general_main_entrance: {

  kid: [
    "This is where people arrive when they need help.",
    "The main entrance… the first step inside.",
    "It can feel serious, quiet, important.",
    "People come here for many reasons.",
    "To get better, to be looked after.",
    "It’s a place of care."
  ],

  teen: [
    "The main entrance to the hospital is a point of transition.",
    "From outside life… into care and treatment.",
    "People arrive here in many different situations.",
    "Some routine, some urgent.",
    "That gives this place a certain weight.",
    "It’s where the process begins."
  ],

  adult: [
    "The main entrance represents threshold into healthcare infrastructure.",
    "It marks the transition from independent life into structured medical support.",
    "Every entry carries context — routine, emergency, uncertainty.",
    "This space absorbs that range of human experience.",
    "It is not neutral.",
    "It is a point where vulnerability meets system."
  ]
},

roose_station_platform: {

  kid: [
    "This is where trains stop and people wait.",
    "Journeys start here… and end here.",
    "You can imagine trains arriving, doors opening, people stepping out.",
    "Places like this are always moving, even when they look still.",
    "Because travel never really stops.",
    "It just pauses."
  ],

  teen: [
    "Train platforms are part of a larger movement system.",
    "People pass through, connecting places and routes.",
    "Roose Station links this area to wider networks.",
    "That’s important for work, travel, and access.",
    "It might seem small, but it’s part of something bigger.",
    "A node in a wider system."
  ],

  adult: [
    "Roose Station platform represents local integration into national rail networks.",
    "Transport nodes like this enable mobility beyond immediate geography.",
    "They support commuting, connection, and access to opportunity.",
    "The platform itself is transitional space.",
    "Defined not by staying, but by movement.",
    "A point where journeys intersect."
  ]
},

ship_inn_piel: {

  kid: [
    "This place sits close to the sea.",
    "A place for people to stop, rest, and talk.",
    "You can imagine sailors, travellers, people passing through.",
    "Stories being shared.",
    "Places like this hold those stories.",
    "Even if you don’t hear them."
  ],

  teen: [
    "The Ship Inn connects to the maritime character of the area.",
    "Places like this would have served travellers, sailors, and visitors.",
    "Not just for food or rest, but for interaction.",
    "They become part of the journey experience.",
    "A stop that carries its own atmosphere.",
    "Linked to the movement around it."
  ],

  adult: [
    "The Ship Inn reflects traditional coastal hospitality tied to maritime movement.",
    "Such locations served those arriving by sea or passing through the area.",
    "They supported both practical needs and social interaction.",
    "Over time, they accumulate narrative — stories tied to travel and experience.",
    "They exist as part of a wider system of movement and pause.",
    "A human layer within coastal infrastructure."
  ]
},

lifeboat_monument: {

  kid: [
    "This place remembers something important.",
    "People who went out to sea… and didn’t come back.",
    "They were helping others.",
    "Trying to save lives.",
    "This is here so they’re not forgotten.",
    "A place to stop… and remember."
  ],

  teen: [
    "The lifeboat monument represents real events, not just history.",
    "Rescue missions at sea are dangerous.",
    "Not everyone returns.",
    "This memorial marks that reality.",
    "It honours those who risked everything to help others.",
    "That’s why it feels different from other places."
  ],

  adult: [
    "The lifeboat monument stands as a marker of loss within service.",
    "Maritime rescue carries inherent risk, often undertaken in extreme conditions.",
    "This site acknowledges those who did not return.",
    "It shifts focus from action to consequence.",
    "From bravery to remembrance.",
    "It exists to ensure that sacrifice is not absorbed into silence.",
    "A fixed point of memory against the movement of the sea."
  ]
},

newby_terrace_play_area: {

  kid: [
    "This is another place full of energy.",
    "Running, climbing, playing, laughing.",
    "Places like this are made for fun.",
    "Not serious… just enjoying being here.",
    "That’s important too.",
    "Because fun is part of life."
  ],

  teen: [
    "Play areas like this support everyday life.",
    "They give space for movement, interaction, and energy.",
    "Not structured, not formal.",
    "Just activity.",
    "That balance matters in a town.",
    "Not everything should feel controlled."
  ],

  adult: [
    "Play areas represent informal use of public space.",
    "They provide opportunity for movement without strict structure.",
    "This supports social interaction, development, and accessibility.",
    "They are small in scale, but consistent in impact.",
    "Part of the everyday rhythm of residential areas.",
    "A functional and social layer combined."
  ]
},

bae_the_bridge: {

  kid: [
    "This is where some of the biggest things in the town are made.",
    "Huge machines, huge buildings… and submarines.",
    "Not the kind you see every day.",
    "Hidden, powerful, built for deep water.",
    "This place is busy, even if you can’t see it all.",
    "Something important is always happening here."
  ],

  teen: [
    "BAE Systems is one of the most important parts of Barrow.",
    "Submarines are built here — highly advanced and complex.",
    "A lot of what happens here isn’t visible to the public.",
    "That adds a sense of mystery and scale.",
    "It’s not just a workplace.",
    "It’s a key part of the town’s identity."
  ],

  adult: [
    "BAE Systems represents the core of Barrow’s industrial identity.",
    "Submarine construction here operates at a high level of technical precision and security.",
    "Much of the work is intentionally unseen.",
    "This creates a dual presence — physically dominant, yet partially hidden.",
    "The town’s economy and identity are deeply tied to this site.",
    "It is both infrastructure and symbol."
  ]
},

gas_terminals_main_gates: {

  kid: [
    "This place deals with energy.",
    "Gas that travels long distances.",
    "It comes here, gets processed, and moved again.",
    "You can’t always see what’s happening.",
    "But it’s powerful.",
    "And important."
  ],

  teen: [
    "Gas terminals handle large-scale energy movement.",
    "Resources come in, get processed, and are distributed.",
    "This supports homes, industry, and infrastructure.",
    "It’s not very visible, but it’s essential.",
    "A hidden part of how modern life works.",
    "Always running in the background."
  ],

  adult: [
    "The gas terminals represent energy infrastructure at scale.",
    "They process and route resources critical to domestic and industrial use.",
    "Operations here are continuous and largely unseen.",
    "This reflects how modern systems rely on invisible support structures.",
    "Without sites like this, broader networks fail.",
    "A silent but essential component of national supply."
  ]
},

kimberly_clark_factory: {

  kid: [
    "This factory makes things people use every day.",
    "Things you might not think about much.",
    "But they’re always needed.",
    "Places like this keep life running smoothly.",
    "Even if they don’t look exciting.",
    "They’re important."
  ],

  teen: [
    "Kimberly-Clark produces everyday essentials.",
    "Products that are constantly used and replaced.",
    "That means continuous production.",
    "Factories like this support daily life in a steady way.",
    "Not dramatic — but essential.",
    "Quiet reliability."
  ],

  adult: [
    "Kimberly-Clark represents high-volume consumer goods production.",
    "Its output supports everyday necessity rather than specialised industry.",
    "This creates consistent demand and continuous operation.",
    "Unlike heavy industry, its impact is subtle but widespread.",
    "It reinforces stability within the local economy.",
    "A background system sustaining routine life."
  ]
},

spiral_ramp_town_centre: {

  kid: [
    "This place twists and turns.",
    "A spiral that keeps going round.",
    "Up or down… depending where you start.",
    "It feels different from normal roads.",
    "More like a loop than a straight path.",
    "A different way to move."
  ],

  teen: [
    "Spiral ramps are designed to manage movement in tight spaces.",
    "Instead of straight paths, they use rotation.",
    "That allows smooth transitions between levels.",
    "It’s practical, but also changes how movement feels.",
    "Less direct, more continuous.",
    "A controlled flow."
  ],

  adult: [
    "The spiral ramp demonstrates spatial efficiency in urban design.",
    "It allows vertical transition within limited horizontal space.",
    "Movement becomes continuous rather than segmented.",
    "This alters perception of distance and direction.",
    "A functional structure that subtly reshapes experience.",
    "Flow engineered through geometry."
  ]
},

barrow_park_greenhouse: {

  kid: [
    "Inside here, plants grow in a special way.",
    "Protected, warm, looked after.",
    "Even when it’s cold outside.",
    "It’s like a different world inside.",
    "Full of life.",
    "Growing quietly."
  ],

  teen: [
    "Greenhouses create controlled environments for plant growth.",
    "They protect against weather and allow steady conditions.",
    "That means plants can grow more reliably.",
    "It’s a mix of nature and control.",
    "Helping life grow where it normally couldn’t.",
    "A managed ecosystem."
  ],

  adult: [
    "The greenhouse represents controlled biological environment within public space.",
    "It enables plant growth beyond natural external conditions.",
    "Temperature, humidity, and exposure are regulated.",
    "This creates stability within otherwise variable systems.",
    "A fusion of natural process and human intervention.",
    "Cultivation through control."
  ]
},

park_fitness_trail_start: {

  kid: [
    "This is where movement begins.",
    "Running, jumping, climbing.",
    "Your body starts working.",
    "Heart beating faster.",
    "Energy building up.",
    "This is the start of action."
  ],

  teen: [
    "Fitness trails are designed to push movement.",
    "Different stations, different challenges.",
    "It’s not just running — it’s controlled effort.",
    "Strength, balance, endurance.",
    "You feel the change as you move through it.",
    "It’s active space with purpose."
  ],

  adult: [
    "The fitness trail represents structured physical engagement within public space.",
    "It introduces intentional movement rather than passive activity.",
    "Stations guide exertion across multiple physical domains.",
    "Strength, endurance, coordination.",
    "It transforms environment into functional training space.",
    "A designed interaction between body and landscape."
  ]
},

park_rockery: {

  kid: [
    "This place feels different.",
    "Rocks, shapes, layers.",
    "Not flat like the rest of the park.",
    "You can climb, look, explore.",
    "It’s like a small hidden world.",
    "Built into the ground."
  ],

  teen: [
    "Rockeries are designed to break up flat space.",
    "They add texture, levels, and variation.",
    "It changes how people move through the area.",
    "Slower, more careful, more observant.",
    "It’s a small shift — but noticeable.",
    "Design shaping behaviour."
  ],

  adult: [
    "The rockery introduces terrain variation within an otherwise controlled park environment.",
    "Elevation, texture, and irregularity alter movement patterns.",
    "It disrupts uniformity.",
    "Encouraging exploration rather than direct traversal.",
    "Aesthetic and functional design combined.",
    "Micro-landscape within structured space."
  ]
},

park_rose_garden: {

  kid: [
    "This place is calm and colourful.",
    "Flowers growing in neat rows.",
    "Carefully looked after.",
    "It feels peaceful here.",
    "Slower than the rest of the park.",
    "A place to stop."
  ],

  teen: [
    "Rose gardens are controlled natural spaces.",
    "Everything is arranged, maintained, and shaped.",
    "It creates a calm environment.",
    "Different from open fields or busy areas.",
    "More about stillness and detail.",
    "A quieter experience."
  ],

  adult: [
    "The rose garden represents cultivated nature within structured design.",
    "Order, maintenance, and aesthetics define the space.",
    "It encourages slower movement and focused observation.",
    "A contrast to open or high-activity areas.",
    "Control applied to organic growth.",
    "Nature shaped into deliberate form."
  ]
},

greenway_path_barrow_island: {

  kid: [
    "This path leads you forward.",
    "Step by step, it keeps going.",
    "You follow it, and it guides you.",
    "Not fast… just steady.",
    "Paths like this connect places.",
    "They show you the way."
  ],

  teen: [
    "Greenways are designed for movement and connection.",
    "They link different parts of an area together.",
    "Walking, cycling, passing through.",
    "It’s not a destination — it’s a route.",
    "Movement is the purpose.",
    "Connection is the result."
  ],

  adult: [
    "The greenway path functions as connective infrastructure.",
    "It enables continuous movement between locations.",
    "Designed for accessibility and flow.",
    "It does not hold people — it moves them.",
    "A transitional space rather than a fixed one.",
    "Linking systems through physical passage."
  ]
},

barrow_island_primary: {

  kid: [
    "This is a place where people learn.",
    "Where kids grow, learn, and play.",
    "Every day starts here for someone.",
    "Lessons, friends, routines.",
    "It’s part of growing up.",
    "A place full of beginnings."
  ],

  teen: [
    "Schools are part of everyday structure.",
    "They shape routines, learning, and development.",
    "Barrow Island Primary is part of that system.",
    "It supports the next generation.",
    "Not dramatic — but essential.",
    "Foundation for everything that follows."
  ],

  adult: [
    "Barrow Island Primary represents foundational education within the community.",
    "It structures early development, routine, and socialisation.",
    "Its impact extends beyond the building itself.",
    "Shaping individuals over time.",
    "A core layer of long-term societal function.",
    "Quietly defining future pathways."
  ]
},

old_brickworks: {

  kid: [
    "This place used to make bricks.",
    "Bricks that built buildings, streets, homes.",
    "Everything starts somewhere.",
    "Even something as simple as a wall.",
    "It all begins with places like this.",
    "Where materials are made."
  ],

  teen: [
    "Brickworks were part of early construction industry.",
    "They supplied materials for buildings across the area.",
    "Before large factories, places like this were essential.",
    "They supported growth and expansion.",
    "Turning raw material into structure.",
    "A foundation before everything else."
  ],

  adult: [
    "The old brickworks represent foundational industrial production.",
    "Supplying materials essential for urban development.",
    "Before large-scale prefabrication, local production was key.",
    "This site contributed directly to physical expansion of the town.",
    "Turning earth into structure.",
    "An early stage in the industrial chain."
  ]
},

cavendish_dock_water_gate: {

  kid: [
    "This is where water is controlled.",
    "In… out… held back or released.",
    "It might look simple.",
    "But it controls something powerful.",
    "The sea doesn’t stop.",
    "So this helps manage it."
  ],

  teen: [
    "Water gates control movement between dock and sea.",
    "They manage levels, flow, and access.",
    "Without them, docks wouldn’t function properly.",
    "It’s a control point.",
    "Managing something that naturally moves constantly.",
    "Order applied to water."
  ],

  adult: [
    "The dock water gate represents control within a dynamic maritime system.",
    "It regulates flow between dock infrastructure and open sea.",
    "Managing pressure, access, and stability.",
    "Without this, the system becomes unstable.",
    "It is a boundary mechanism.",
    "Where natural force meets engineered control."
  ]
},

bowling_alley_hollywood_park: {

  kid: [
    "This is a place for games and fun.",
    "Rolling the ball, knocking pins down.",
    "Simple… but exciting.",
    "People come here to enjoy themselves.",
    "To play, laugh, and compete.",
    "It’s all about fun."
  ],

  teen: [
    "Bowling is a social activity space.",
    "It mixes competition with entertainment.",
    "People come here to relax and interact.",
    "Not serious sport — but still engaging.",
    "It adds to the town’s leisure options.",
    "Fun with structure."
  ],

  adult: [
    "The bowling alley represents structured leisure within a controlled environment.",
    "It blends recreation with social interaction.",
    "Low barrier to entry, accessible to many.",
    "It supports informal competition and shared experience.",
    "Part of modern entertainment infrastructure.",
    "Leisure designed for participation."
  ]
},

skate_park_core: {

  kid: [
    "This place is fast and full of movement.",
    "Wheels, jumps, tricks.",
    "People push themselves here.",
    "Trying new things.",
    "Falling, getting back up.",
    "Getting better every time."
  ],

  teen: [
    "Skate parks are built for progression.",
    "Practice, repetition, improvement.",
    "It’s not just movement — it’s skill-building.",
    "People push limits here.",
    "Learning through action.",
    "A space for controlled risk."
  ],

  adult: [
    "The skate park represents dynamic, self-directed physical activity.",
    "Users engage with risk, balance, and repetition.",
    "Progression is individually driven.",
    "Unlike structured sport, outcomes are not fixed.",
    "It fosters adaptability and resilience.",
    "A space where movement becomes expression."
  ]
},

dock_museum_submarine: {

  kid: [
    "This is something powerful.",
    "A real submarine.",
    "Built to go deep underwater.",
    "Hidden, silent, strong.",
    "You don’t see things like this every day.",
    "It feels important."
  ],

  teen: [
    "The submarine represents advanced engineering and design.",
    "Built here, in this town.",
    "Used in environments most people never experience.",
    "It shows what this place is capable of.",
    "Precision, complexity, and scale.",
    "A symbol of industrial strength."
  ],

  adult: [
    "The dock museum submarine is a tangible representation of Barrow’s industrial output.",
    "It embodies advanced naval engineering developed locally.",
    "Designed for stealth, endurance, and deep-sea operation.",
    "It connects abstract industry to physical reality.",
    "Making the unseen visible.",
    "A symbol of capability, precision, and national relevance."
  ]
},

barrow_cricket_club: {

  kid: [
    "This place is about teamwork.",
    "Batting, bowling, catching.",
    "Everyone has a role.",
    "You don’t play alone here.",
    "You play together.",
    "That’s what makes it work."
  ],

  teen: [
    "Cricket is built on coordination and patience.",
    "Every player has a specific role.",
    "Timing matters more than speed.",
    "It’s a slower game, but very strategic.",
    "Teamwork is essential.",
    "Everyone contributes to the outcome."
  ],

  adult: [
    "Barrow Cricket Club represents structured team-based sport with strategic depth.",
    "It prioritises coordination, timing, and collective effort.",
    "Unlike fast-paced sports, it unfolds over extended periods.",
    "Requiring patience and precision.",
    "Each role contributes to a larger outcome.",
    "A system of interdependent actions."
  ]
},

twelve_laws_stone: {

  kid: [
    "This place feels different.",
    "Not loud, not busy.",
    "More like a place to think.",
    "To stop for a moment.",
    "Some places aren’t about action.",
    "They’re about understanding."
  ],

  teen: [
    "Some places carry meaning beyond what you see.",
    "They make you think rather than act.",
    "The idea of ‘laws’ suggests rules of how things work.",
    "Not physical rules — bigger ones.",
    "It’s about awareness.",
    "And how you see things."
  ],

  adult: [
    "The 12 Laws Stone represents abstract interpretation within physical space.",
    "It introduces conceptual thinking into an otherwise practical environment.",
    "Shifting focus from action to awareness.",
    "Such locations encourage reflection rather than interaction.",
    "They operate symbolically rather than functionally.",
    "A pause point for perspective."
  ]
},

spirit_of_barrow_mural: {

  kid: [
    "This wall tells a story.",
    "Not with words… but with pictures.",
    "Colours, shapes, people.",
    "It shows what this place is about.",
    "You can look at it and feel something.",
    "That’s what makes it special."
  ],

  teen: [
    "Murals are a way of expressing identity.",
    "They show what a place represents.",
    "History, people, culture.",
    "All in one image.",
    "It’s not just decoration.",
    "It’s a statement."
  ],

  adult: [
    "The Spirit of Barrow mural functions as visual identity expression.",
    "It condenses cultural, industrial, and social elements into a single composition.",
    "Public art like this reinforces collective awareness.",
    "It communicates without instruction.",
    "A narrative embedded in visual form.",
    "Identity translated into imagery."
  ]
},

final_boss_gate_marsh_st: {

  kid: [
    "This is it.",
    "The final point.",
    "Everything leads here.",
    "You’ve travelled, explored, completed challenges.",
    "Now you stand at the end.",
    "Ready to finish what you started."
  ],

  teen: [
    "This is the final checkpoint.",
    "The place where everything comes together.",
    "Every challenge, every route, every step.",
    "You’ve built up to this moment.",
    "Now it’s about finishing strong.",
    "Completing the journey."
  ],

  adult: [
    "The final gate represents completion within the system.",
    "A convergence point for all prior movement and interaction.",
    "It marks transition from progression to closure.",
    "The journey is no longer about exploration.",
    "But about culmination.",
    "All elements resolved at a single point."
  ]
},

wicks: {

  kid: [
    "This is a place where things are built.",
    "Tools, materials, parts.",
    "Everything you need to make something.",
    "From small ideas to big projects.",
    "It all starts with the right pieces.",
    "And putting them together."
  ],

  teen: [
    "Places like this supply building materials.",
    "Tools, equipment, everything needed to create or fix things.",
    "It supports construction and repair.",
    "Not flashy — but very useful.",
    "A place where ideas turn into reality.",
    "Through physical work."
  ],

  adult: [
    "Wicks represents access to construction resources and practical capability.",
    "It supports both professional and personal building activity.",
    "Providing materials that enable transformation of ideas into physical outcomes.",
    "A functional node within the wider construction ecosystem.",
    "Utility over presentation.",
    "Enabling action through supply."
  ]
},

brew_room: {

  kid: [
    "This is a place where things are made.",
    "Not big machines… smaller, more focused.",
    "Careful work, step by step.",
    "Watching, adjusting, getting it right.",
    "It’s about creating something properly.",
    "Taking your time."
  ],

  teen: [
    "A brew room is about process and control.",
    "Small changes can affect the outcome.",
    "Timing, temperature, attention.",
    "It’s not rushed.",
    "It’s about doing things properly.",
    "Precision in a smaller space."
  ],

  adult: [
    "The brew room represents controlled production at a smaller scale.",
    "Unlike large industry, it relies on close monitoring and adjustment.",
    "Outcome is shaped by detail rather than volume.",
    "It reflects precision through process.",
    "A contained system requiring attention.",
    "Craft within structure."
  ]
},

reception: {

  kid: [
    "This is where people arrive first.",
    "The starting point inside a place.",
    "You check in, speak to someone, find your way.",
    "It helps you know where to go.",
    "A simple place… but important.",
    "Because it’s the beginning."
  ],

  teen: [
    "Reception areas manage flow of people.",
    "They guide, organise, and direct.",
    "It’s the first point of contact.",
    "Setting the tone for what comes next.",
    "Simple, but essential.",
    "Structure at the entry point."
  ],

  adult: [
    "Reception functions as an organisational gateway.",
    "It structures entry, directs movement, and manages interaction.",
    "A control point for access and information.",
    "Often overlooked, but critical to flow.",
    "It defines first contact within a system.",
    "Order at the threshold."
  ]
},

bitches_house: {

  kid: [
    "This is a place you know.",
    "Not famous… not big.",
    "But it means something.",
    "Because it’s part of your world.",
    "Places like this matter.",
    "Because they’re real to you."
  ],

  teen: [
    "Not every important place is public or historic.",
    "Some matter because of personal connection.",
    "Experiences, memories, moments.",
    "That’s what gives a place meaning.",
    "Even if no one else knows it.",
    "It’s still part of your map."
  ],

  adult: [
    "This location represents personal geography.",
    "Meaning defined not by public value, but private experience.",
    "Places like this exist outside formal significance.",
    "Yet carry strong individual relevance.",
    "They form a parallel map.",
    "One built from memory rather than history."
  ]
},

dads_house: {

  kid: [
    "This is a place that feels familiar.",
    "Somewhere you’ve been, somewhere you know.",
    "It’s not about what it looks like.",
    "It’s about how it feels.",
    "Places like this stay with you.",
    "Because they matter."
  ],

  teen: [
    "Personal places carry emotional weight.",
    "Not because of history or design.",
    "But because of connection.",
    "Time spent, conversations, experiences.",
    "That builds meaning over time.",
    "Stronger than most public places."
  ],

  adult: [
    "This location represents personal grounding within the wider environment.",
    "Its significance is relational rather than structural.",
    "Defined through connection, time, and experience.",
    "Such places anchor identity.",
    "Providing continuity within change.",
    "A fixed point in a moving system."
  ]
},

tinas_house: {

  kid: [
    "Another place that’s part of your world.",
    "Not big… but important.",
    "Because you know it.",
    "Places like this are part of your story.",
    "Even if others don’t see it.",
    "You do."
  ],

  teen: [
    "Personal locations build your own version of the map.",
    "Different from public or historic places.",
    "They’re based on experience.",
    "What happens there matters more than what it is.",
    "That’s what gives it meaning.",
    "Your own connection."
  ],

  adult: [
    "This site contributes to personal spatial identity.",
    "Its relevance is defined through lived experience.",
    "Rather than function or public recognition.",
    "It exists within a private layer of meaning.",
    "Overlaying the physical environment.",
    "A subjective anchor within objective space."
  ]
},

park_start_parkave: {

  kid: [
    "You’re at the start.",
    "Right here… this is where it begins.",
    "The path is ahead of you.",
    "You don’t know everything yet.",
    "But that’s the point.",
    "Let’s go."
  ],

  teen: [
    "This is your entry point into the park.",
    "Everything ahead connects from here.",
    "Paths, places, challenges.",
    "You’re stepping into the system now.",
    "What happens next depends on you.",
    "Start moving."
  ],

  adult: [
    "This marks the beginning of your route.",
    "An entry point into a structured environment.",
    "From here, movement defines experience.",
    "The system unfolds as you progress.",
    "Direction becomes choice.",
    "The journey begins at this threshold."
  ]
},

park_start_abbeyroad: {

  kid: [
    "Another way in.",
    "Another starting point.",
    "Different entrance… same adventure.",
    "You step through here,",
    "and everything opens up.",
    "Let’s begin."
  ],

  teen: [
    "This entrance gives you access from a different side.",
    "Same park, different perspective.",
    "Where you start changes how you move.",
    "The route builds from here.",
    "Every step adds to the journey.",
    "You’re in now."
  ],

  adult: [
    "This entrance represents alternative access into the same system.",
    "Entry point influences route, perception, and flow.",
    "Movement begins here, but direction is not fixed.",
    "Experience is shaped by starting position.",
    "Multiple paths, one environment.",
    "Initiation through choice."
  ]
},

park_start_daltonroad: {

  kid: [
    "You’re stepping into something new.",
    "From here, you explore.",
    "Run, walk, discover.",
    "There’s more ahead than you can see.",
    "That’s what makes it exciting.",
    "Start now."
  ],

  teen: [
    "This is another access point into the park system.",
    "From here, routes branch out.",
    "Different paths, different experiences.",
    "You choose how you move through it.",
    "Exploration starts here.",
    "Everything builds from this moment."
  ],

  adult: [
    "This entrance initiates engagement with the park’s internal structure.",
    "Movement from here defines trajectory.",
    "Paths offer variation rather than fixed direction.",
    "User interaction determines experience.",
    "A system activated through entry.",
    "Beginning through movement."
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
