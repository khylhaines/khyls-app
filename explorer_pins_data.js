/* =========================================================
   EXPLORER BOT — PIN KNOWLEDGE DATA
   BarrowQuest / Old Tom
   =========================================================
   Every pin Old Tom knows about.
   Three age levels: kids, teen, adult
   
   Structure per pin:
   - intro: Old Tom's spoken welcome when you arrive
   - facts: key facts he can draw from
   - quiz: pre-written questions with answers
   - activities: things to do at this location
   - nearby: what else is close
   - audiobook: walking narrative chapter
========================================================= */

export const EXPLORER_PIN_DATA = {

  // ═══════════════════════════════════════════════════════
  // FURNESS ABBEY
  // ═══════════════════════════════════════════════════════
  furness_abbey_core: {
    name: "Furness Abbey",
    zone: "abbey",
    category: "heritage",

    intro: {
      kids: "Wow, you've made it to Furness Abbey! This amazing place is nearly 900 years old. Monks used to live here and pray every single day. Let's find out what happened to them!",
      teen: "You're standing in the Vale of Nightshade at Furness Abbey — founded in 1127, dissolved in 1537, and one of the most powerful monasteries in northern England. Let's explore what's left.",
      adult: "Welcome to Furness Abbey, founded in 1127 by Stephen of Blois in the Vale of Nightshade. For over 400 years this was one of the wealthiest Cistercian houses in England — until Henry VIII ended it all in 1537. What you see around you is what survived the Dissolution."
    },

    facts: [
      "Furness Abbey was founded in 1127 by Stephen of Blois, who later became King of England.",
      "The abbey was home to Cistercian monks who followed a strict rule of prayer, silence and hard work.",
      "At its peak Furness Abbey was the second wealthiest Cistercian monastery in England after Fountains Abbey.",
      "The abbey controlled vast estates across the Furness Peninsula, the Lake District and parts of Ireland.",
      "Henry VIII dissolved Furness Abbey in 1537 as part of the Dissolution of the Monasteries.",
      "The monks built Piel Castle on Piel Island as a warehouse and defensive post.",
      "The red sandstone ruins are managed today by English Heritage.",
      "The Vale of Nightshade where the abbey stands was chosen for its isolation and fertile land.",
      "The abbey church was over 300 feet long — one of the longest in northern England.",
      "William Wordsworth visited Furness Abbey and wrote about it in his poetry.",
    ],

    quiz: {
      kids: [
        { q: "What year was Furness Abbey founded?", options: ["1127", "1500", "1066"], answer: 0, fact: "Furness Abbey was founded in 1127 — nearly 900 years ago!" },
        { q: "Who lived at Furness Abbey?", options: ["Knights", "Monks", "Pirates"], answer: 1, fact: "Cistercian monks lived here, praying and working every day." },
        { q: "What happened to the abbey in 1537?", options: ["It burned down", "It was pulled down by Henry VIII", "It flooded"], answer: 1, fact: "Henry VIII shut down all the monasteries in England — including this one." },
        { q: "What is the abbey built from?", options: ["Brick", "Marble", "Red sandstone"], answer: 2, fact: "The beautiful red sandstone came from local quarries." },
        { q: "Who looks after Furness Abbey today?", options: ["English Heritage", "The monks", "Barrow Council"], answer: 0, fact: "English Heritage manages the abbey and keeps it open for visitors." },
      ],
      teen: [
        { q: "Who founded Furness Abbey in 1127?", options: ["Henry VIII", "Stephen of Blois", "William the Conqueror"], answer: 1, fact: "Stephen of Blois founded the abbey and later became King Stephen of England." },
        { q: "Which monastic order ran Furness Abbey?", options: ["Benedictine", "Dominican", "Cistercian"], answer: 2, fact: "The Cistercians were known for their strict rule and hard work — white habits, isolated locations." },
        { q: "At its height Furness Abbey was the second wealthiest Cistercian house after which abbey?", options: ["Fountains Abbey", "Rievaulx Abbey", "Westminster Abbey"], answer: 0, fact: "Only Fountains Abbey in Yorkshire was wealthier among English Cistercian houses." },
        { q: "What did the monks of Furness Abbey build on Piel Island?", options: ["A lighthouse", "A castle", "A harbour"], answer: 1, fact: "Piel Castle was built by the monks as a warehouse and defensive post to protect their trade." },
        { q: "In what year was Furness Abbey dissolved?", options: ["1527", "1537", "1547"], answer: 1, fact: "The Dissolution of the Monasteries between 1536 and 1541 ended monastic life across England." },
      ],
      adult: [
        { q: "Furness Abbey was originally founded at Tulketh near Preston before moving to its current site. In what year did it move?", options: ["1123", "1127", "1135"], answer: 1, fact: "The abbey moved to the Vale of Nightshade in 1127, three years after its original foundation." },
        { q: "Which royal figure visited Furness Abbey in 1332 seeking military support?", options: ["Edward II", "Edward III", "Robert the Bruce"], answer: 2, fact: "Robert the Bruce visited Furness Abbey in 1332, illustrating the abbey's political significance." },
        { q: "The Dissolution of Furness Abbey in 1537 came after the abbot Roger Pele signed what document?", options: ["A deed of surrender", "A treaty of peace", "A letter to the Pope"], answer: 0, fact: "Abbot Pele signed the deed of surrender in April 1537, ending over 400 years of monastic life." },
        { q: "Which poet wrote about Furness Abbey in The Prelude?", options: ["John Keats", "William Wordsworth", "Samuel Taylor Coleridge"], answer: 1, fact: "Wordsworth visited the abbey and described it movingly in The Prelude." },
        { q: "What class of heritage listing does Furness Abbey hold?", options: ["Grade II", "Grade II*", "Grade I"], answer: 2, fact: "Furness Abbey holds Grade I listed building status — the highest level of protection." },
      ],
    },

    activities: {
      kids: [
        { type: "observation", title: "Stone Counting", desc: "Count how many separate archways you can see still standing. Write the number down — we'll check it against Old Tom's records!" },
        { type: "physical", title: "Monk's Walk", desc: "The monks walked the same path every day for hundreds of years. Walk slowly around the main ruins without talking for 2 minutes — just like a monk would." },
        { type: "creative", title: "Abbey Sketch", desc: "Find the most impressive piece of wall you can see and draw it. Include any arches, windows or carvings you can spot." },
        { type: "observation", title: "Red Stone Hunt", desc: "The abbey is built from red sandstone. Find three different shades of red in the stone around you." },
        { type: "family", title: "Monk's Day", desc: "Monks woke at 3am to pray! Pretend you're a monk — what would your day look like? Act out three things a monk would do." },
      ],
      teen: [
        { type: "observation", title: "Architecture Detective", desc: "Find examples of Norman and Gothic architecture in the ruins. What's the difference between the rounded Norman arches and the pointed Gothic ones?" },
        { type: "knowledge", title: "Power Mapping", desc: "The abbey once controlled land from here to Ireland. Using what Old Tom told you, list three places the monks controlled and find them on your map." },
        { type: "physical", title: "Perimeter Walk", desc: "Walk the full perimeter of the abbey ruins and estimate the total length. The original church was over 300 feet long — does your estimate match?" },
        { type: "observation", title: "Dissolution Evidence", desc: "Look for evidence that the abbey was deliberately destroyed. What do you notice about the stonework? Where did all the good stone go after 1537?" },
        { type: "creative", title: "1536 Report", desc: "You're a reporter in 1536. Write three sentences describing what you see as the monks leave the abbey for the last time." },
      ],
      adult: [
        { type: "observation", title: "Architectural Timeline", desc: "The abbey was built and extended over 200 years. Walk through and identify where the building styles change — from early Romanesque to later Gothic." },
        { type: "knowledge", title: "Economic Power", desc: "The abbey controlled iron, farming, fishing and trade. Standing here, consider: how much of what you can see around you would the monks have owned in 1500?" },
        { type: "observation", title: "Dissolution Damage", desc: "Much of the stone was removed after 1537 and reused in local buildings. Look at the remaining walls — can you tell where stone has been deliberately removed?" },
        { type: "physical", title: "Monk's Circuit", desc: "The monks walked the cloister in contemplation daily. Find the cloister area and walk it in silence — consider what daily life here would have felt like." },
        { type: "creative", title: "Last Day", desc: "April 9th 1537 — the day the abbot surrendered. Stand in the abbey church ruins and think: what would the last service here have felt like?" },
      ],
    },

    nearby: ["abbey_church", "abbey_cloister", "abbey_chapter_house", "abbey_viewpoint", "abbey_boss"],
    audiobook_chapter: "shipyard_trail_chapter_abbey",
  },

  // ═══════════════════════════════════════════════════════
  // THE CENOTAPH
  // ═══════════════════════════════════════════════════════
  cenotaph_core: {
    name: "The Cenotaph",
    zone: "memorial",
    category: "memorial",

    intro: {
      kids: "You're standing at the Barrow Cenotaph. This is a very special and important place. It's here to help us remember the men and women from Barrow who gave their lives in the World Wars. Let's find out their story.",
      teen: "The Barrow Cenotaph stands as a permanent reminder of the men from this town who died in two World Wars. Barrow was a major shipbuilding target — let's explore what that meant for the people who lived here.",
      adult: "The Barrow Cenotaph commemorates the men of Barrow-in-Furness who fell in the First and Second World Wars. As a major shipbuilding centre, Barrow was both vital to the war effort and a target for enemy bombing. The human cost was profound."
    },

    facts: [
      "The Barrow Cenotaph commemorates the men of Barrow who died in the First and Second World Wars.",
      "Barrow was bombed by the German Luftwaffe in April and May 1941 in what became known as the Barrow Blitz.",
      "The shipyards at Barrow were a primary target for German bombers because of their strategic importance.",
      "During the First World War Barrow's shipyards worked around the clock producing warships and submarines.",
      "Remembrance Sunday is held at the Cenotaph every November to honour those who gave their lives.",
      "The word cenotaph comes from the Greek meaning empty tomb — a monument to those buried elsewhere.",
      "Hundreds of Barrow men served and died in both World Wars.",
      "The Barrow Blitz of 1941 caused significant damage to the town including civilian casualties.",
    ],

    quiz: {
      kids: [
        { q: "What is a cenotaph?", options: ["A type of ship", "A monument to remember people who died in war", "An old clock tower"], answer: 1, fact: "Cenotaph means empty tomb — it remembers people buried far from home." },
        { q: "Which wars does the Barrow Cenotaph remember?", options: ["The Civil War", "The First and Second World Wars", "The Viking Wars"], answer: 1, fact: "The Cenotaph honours those who died in WWI and WWII." },
        { q: "Why was Barrow important during the wars?", options: ["It had a big airport", "It built ships and submarines", "It grew food for soldiers"], answer: 1, fact: "Barrow's shipyards built warships and submarines that were vital to Britain's war effort." },
        { q: "When do people gather at the Cenotaph to remember those who died?", options: ["Christmas Day", "Remembrance Sunday in November", "Easter Sunday"], answer: 1, fact: "Every November on Remembrance Sunday people gather to pay their respects." },
      ],
      teen: [
        { q: "What does the word cenotaph mean in Greek?", options: ["Stone of remembrance", "Empty tomb", "War memorial"], answer: 1, fact: "Cenotaph literally means empty tomb — honouring those buried elsewhere." },
        { q: "Why did Germany bomb Barrow in 1941?", options: ["Because of the town centre", "Because of the shipyards and submarine works", "Because of the railway station"], answer: 1, fact: "The Devonshire Dock Hall and BAE Systems site were prime military targets." },
        { q: "What type of vessels was Barrow most famous for producing during WW2?", options: ["Aircraft carriers", "Submarines", "Destroyers"], answer: 1, fact: "Barrow built submarines that played a crucial role in the Battle of the Atlantic." },
      ],
      adult: [
        { q: "In which months in 1941 did the Barrow Blitz occur?", options: ["January and February", "April and May", "August and September"], answer: 1, fact: "The Luftwaffe attacked Barrow in April and May 1941, causing significant damage." },
        { q: "The Barrow Cenotaph is located in which park?", options: ["Barrow Park", "Hollywood Park", "Vickerstown Park"], answer: 0, fact: "The Cenotaph stands in Barrow Park, the town's main public park." },
        { q: "During WW1 what famous class of vessel was Barrow producing for the Royal Navy?", options: ["Dreadnought battleships", "E-class submarines", "Monitor warships"], answer: 1, fact: "Barrow was producing E-class submarines — critical to the naval war effort." },
      ],
    },

    activities: {
      kids: [
        { type: "quiet", title: "One Minute Silence", desc: "Stand quietly at the Cenotaph for one minute. Think about all the people from Barrow who never came home. This is how we remember them." },
        { type: "observation", title: "Name Count", desc: "Look at the Cenotaph carefully. How many names can you see? What do you notice about them?" },
        { type: "family", title: "Thank You Letter", desc: "Write or say out loud a short thank you to someone who fought for us. It doesn't have to be long — just honest." },
      ],
      teen: [
        { type: "knowledge", title: "Local Impact", desc: "Think about Barrow in 1914 — a town of 70,000 people. If 500 men died in WW1, what does that mean for a town this size? How many families were affected?" },
        { type: "observation", title: "Memorial Study", desc: "Study the design of the Cenotaph. Why do you think this design was chosen? What does it say without words?" },
        { type: "quiet", title: "Moment of Reflection", desc: "Stand at the Cenotaph and think about what it would mean to live in Barrow during the Blitz of 1941 — your town being bombed, your neighbours working in the shipyards day and night." },
      ],
      adult: [
        { type: "knowledge", title: "Strategic Context", desc: "Barrow produced submarines critical to the Battle of the Atlantic. Stand here and consider — how much did this town's industrial output affect the outcome of WW2?" },
        { type: "observation", title: "Architecture of Grief", desc: "The cenotaph as a form emerged after WW1. Consider how the design communicates loss — what design choices were made and why?" },
        { type: "quiet", title: "The Blitz", desc: "In April 1941 bombs fell on this town. The shipyards were the target but civilians died. Stand here and consider what that night must have been like for Barrow's residents." },
      ],
    },

    nearby: ["park_bandstand_core", "park_railway_core", "boating_lake_core"],
    audiobook_chapter: "war_memorial_walk_chapter_1",
  },

  // ═══════════════════════════════════════════════════════
  // DOCK MUSEUM ANCHOR
  // ═══════════════════════════════════════════════════════
  dock_museum_anchor: {
    name: "Dock Museum",
    zone: "docks",
    category: "heritage",

    intro: {
      kids: "Welcome to the Dock Museum! This is where Barrow tells its amazing story of building ships. Did you know Barrow built some of the biggest and most powerful ships in the world right here? Let's find out more!",
      teen: "The Dock Museum sits over a Victorian graving dock — one of the original docks built when Barrow was expanding rapidly in the 1870s. Inside you'll find the story of how a tiny village became one of the greatest shipbuilding towns on earth.",
      adult: "The Dock Museum stands over a Victorian graving dock dating from 1873, one of the original infrastructure investments that transformed Barrow into a major industrial port. The museum tells the story of the town's extraordinary rise — from hamlet to industrial giant in less than 30 years."
    },

    facts: [
      "The Dock Museum is built over a Victorian graving dock dating from 1873.",
      "Barrow built its first ship in 1873 and went on to become one of the world's great shipbuilding centres.",
      "The museum tells the story of Barrow's transformation from a tiny hamlet to a major industrial town.",
      "Over 100 submarines have been built at Barrow since Holland 1 in 1901.",
      "The RMS Lusitania — one of the largest ocean liners of its time — was built at Barrow in 1906.",
      "A graving dock is a dry dock used for repairing and inspecting the hulls of ships.",
      "Barrow's docks were built to handle the iron ore and steel that drove the town's growth.",
      "The Devonshire Dock Hall visible from the museum is where nuclear submarines are built today.",
    ],

    quiz: {
      kids: [
        { q: "What is the Dock Museum built over?", options: ["An old market", "A Victorian graving dock", "An underground tunnel"], answer: 1, fact: "A graving dock is a dry dock for repairing ships — this one dates from 1873." },
        { q: "What was the first submarine built at Barrow called?", options: ["Holland 1", "HMS Astute", "HMS Vanguard"], answer: 0, fact: "Holland 1 was built in 1901 and was the Royal Navy's very first submarine!" },
        { q: "What famous ocean liner was built at Barrow?", options: ["The Titanic", "RMS Lusitania", "RMS Queen Mary"], answer: 1, fact: "The RMS Lusitania was built at Barrow in 1906 and was one of the largest ships in the world." },
      ],
      teen: [
        { q: "What year was the graving dock beneath the museum built?", options: ["1853", "1873", "1893"], answer: 1, fact: "The graving dock dates from 1873, built during Barrow's rapid industrial expansion." },
        { q: "How many submarines have been built at Barrow since 1901?", options: ["Over 50", "Over 100", "Over 200"], answer: 1, fact: "Over 100 submarines have been built at Barrow — more than anywhere else in the UK." },
        { q: "What is a graving dock used for?", options: ["Building new ships", "Repairing and inspecting ship hulls", "Loading cargo"], answer: 1, fact: "Ships are floated into a graving dock, then the water is pumped out to expose the hull." },
      ],
      adult: [
        { q: "The RMS Lusitania was sunk by a German U-boat in 1915. Where was she built?", options: ["Glasgow", "Belfast", "Barrow-in-Furness"], answer: 2, fact: "The Lusitania was built at Barrow by Vickers Sons and Maxim and launched in 1906." },
        { q: "What company operated the Barrow shipyard when it built Holland 1 in 1901?", options: ["BAE Systems", "Vickers Sons and Maxim", "Naval Construction and Armaments Company"], answer: 1, fact: "Vickers Sons and Maxim built Holland 1 — the company that would eventually become BAE Systems." },
        { q: "Barrow was transformed from a hamlet to a town of how many people by 1870?", options: ["8,000", "18,000", "38,000"], answer: 1, fact: "From fewer than 150 people in 1840 to over 18,000 by 1870 — one of the fastest urban growths in Victorian England." },
      ],
    },

    activities: {
      kids: [
        { type: "observation", title: "Spot the Dock", desc: "Look down into the old graving dock beneath the museum. How deep do you think it is? What would it have looked like full of water with a ship inside?" },
        { type: "physical", title: "Ship Builder Challenge", desc: "Building a ship takes thousands of workers. Act out three different jobs a shipyard worker might do." },
        { type: "family", title: "Biggest Ship", desc: "The Lusitania was 787 feet long. Walk 50 steps in a straight line — that's about a quarter of its length. How big does that feel?" },
      ],
      teen: [
        { type: "observation", title: "Industrial Scale", desc: "Look at the Devonshire Dock Hall from here. That building is where nuclear submarines are built today. How does its scale compare to what you can see of the Victorian docks?" },
        { type: "knowledge", title: "Timeline", desc: "1840: 150 people. 1870: 18,000 people. 1900: 60,000 people. What drove each of those growth stages? Use what Old Tom told you." },
        { type: "observation", title: "Then and Now", desc: "The Victorian docks handled iron ore and steel. The modern yard builds nuclear submarines. What stayed the same? What changed completely?" },
      ],
      adult: [
        { type: "knowledge", title: "Industrial Geography", desc: "Why here? What made this specific location — a tidal estuary on the edge of the Irish Sea — the right place to build one of Britain's greatest shipyards?" },
        { type: "observation", title: "Victorian Infrastructure", desc: "The graving dock beneath you was state of the art in 1873. Look at the engineering — what does it tell you about the ambition of those who built it?" },
        { type: "creative", title: "1906 Launch Day", desc: "The Lusitania launched from this yard in June 1906 — the largest ship in the world. 40,000 people watched. Stand here and imagine that scene." },
      ],
    },

    nearby: ["graving_dock", "dock_museum_submarine", "bae_main_gate", "bae_the_bridge"],
    audiobook_chapter: "shipyard_trail_chapter_docks",
  },

  // ═══════════════════════════════════════════════════════
  // BAE SYSTEMS MAIN GATE
  // ═══════════════════════════════════════════════════════
  bae_main_gate: {
    name: "BAE Systems Main Gate",
    zone: "docks",
    category: "industry",

    intro: {
      kids: "You're standing at the entrance to BAE Systems — one of the most important and secret places in Britain! Behind these gates they build nuclear submarines for the Royal Navy. It's one of the most amazing engineering jobs in the world!",
      teen: "BAE Systems Submarines is the only place in the UK that builds nuclear submarines. Behind this gate is the Devonshire Dock Hall — one of the largest indoor construction facilities in Europe. Around 10,000 people work here.",
      adult: "BAE Systems Submarines at Barrow is the sole manufacturer of nuclear submarines for the Royal Navy. The site employs around 10,000 people and is the economic backbone of the town. The current programme — building Astute class attack submarines and Dreadnought class ballistic missile submarines — represents billions of pounds of investment."
    },

    facts: [
      "BAE Systems Submarines is the only place in the UK where nuclear submarines are built.",
      "Around 10,000 people work at BAE Systems in Barrow — the town's largest employer by far.",
      "The Devonshire Dock Hall opened in 1986 and is one of the largest covered construction facilities in Europe.",
      "The Astute class submarines being built here are the most advanced attack submarines ever built in Britain.",
      "BAE Systems traces its history at Barrow back to 1871 when the Naval Construction and Armaments Company was established.",
      "The Vanguard class submarines here carry the Trident nuclear deterrent — Britain's nuclear weapons system.",
      "Each Astute class submarine costs over £1 billion and takes around a decade to build.",
      "Holland 1, built here in 1901, was the Royal Navy's first ever submarine.",
      "The site was formerly known as Vickers, then VSEL, before becoming BAE Systems.",
      "The Dreadnought class submarines now under construction will replace the Vanguard class from the 2030s.",
    ],

    quiz: {
      kids: [
        { q: "What does BAE Systems build at Barrow?", options: ["Aeroplanes", "Nuclear submarines", "Aircraft carriers"], answer: 1, fact: "BAE Systems is the only place in the UK that builds nuclear submarines." },
        { q: "How many people work at BAE Systems in Barrow?", options: ["Around 1,000", "Around 10,000", "Around 100,000"], answer: 1, fact: "Around 10,000 people — making it Barrow's biggest employer by far." },
        { q: "What was the name of the first submarine ever built at Barrow?", options: ["HMS Astute", "Holland 1", "HMS Vanguard"], answer: 1, fact: "Holland 1 was built in 1901 and was the Royal Navy's very first submarine." },
      ],
      teen: [
        { q: "What is the Devonshire Dock Hall?", options: ["A storage facility for ships", "The covered hall where submarines are built", "The original Victorian dock"], answer: 1, fact: "The DDH opened in 1986 and is large enough to build multiple submarines simultaneously." },
        { q: "Which class of submarine carries Britain's Trident nuclear deterrent?", options: ["Astute class", "Vanguard class", "Dreadnought class"], answer: 1, fact: "The four Vanguard class submarines carry Trident ballistic missiles — Britain's nuclear deterrent." },
        { q: "BAE Systems at Barrow traces its origins to which company established in 1871?", options: ["Vickers Sons and Maxim", "Naval Construction and Armaments Company", "Barrow Shipbuilding Company"], answer: 1, fact: "The Naval Construction and Armaments Company was established at Barrow in 1871." },
      ],
      adult: [
        { q: "How long does it typically take to build an Astute class submarine at Barrow?", options: ["Around 3 years", "Around 5 years", "Around a decade"], answer: 2, fact: "The complexity of nuclear submarines means construction takes approximately 10 years from start to launch." },
        { q: "What programme is currently under construction at BAE Systems to replace the Vanguard class?", options: ["Astute class", "Successor programme", "Dreadnought class"], answer: 2, fact: "The Dreadnought class programme will provide the UK's nuclear deterrent from the 2030s." },
        { q: "VSEL — the predecessor to BAE Systems at Barrow — stood for what?", options: ["Vickers Submarine Engineering Ltd", "Vickers Shipbuilding and Engineering Ltd", "Victorian Submarine Engineering Ltd"], answer: 1, fact: "VSEL — Vickers Shipbuilding and Engineering Limited — was privatised in 1986 before becoming part of BAE Systems." },
      ],
    },

    activities: {
      kids: [
        { type: "observation", title: "Size Check", desc: "An Astute class submarine is 97 metres long. Count 97 steps away from the gate — that's how long one submarine is!" },
        { type: "knowledge", title: "Secret Job", desc: "What job would you want at BAE Systems? Engineer, welder, diver, electrician? Tell Old Tom what you'd choose and why." },
        { type: "observation", title: "Spot the Hall", desc: "Can you see the Devonshire Dock Hall from here? It's enormous. Try to estimate how many double-decker buses you could fit inside." },
      ],
      teen: [
        { type: "knowledge", title: "Economic Impact", desc: "10,000 workers. Each earning an average wage. Calculate roughly how much money flows into Barrow every week just from BAE Systems wages." },
        { type: "observation", title: "Security Study", desc: "Look at the security around the main gate. Why is a submarine building facility this heavily protected? What are the risks?" },
        { type: "knowledge", title: "Supply Chain", desc: "A submarine has over one million individual components. They can't all be made here. Where do you think the parts come from and how do they get here?" },
      ],
      adult: [
        { type: "knowledge", title: "Strategic Dependency", desc: "Barrow is the sole UK manufacturer of nuclear submarines. What are the strategic risks of that concentration? What happens if this site faces problems?" },
        { type: "observation", title: "Industrial Heritage", desc: "This site has been continuously building warships since 1871. Look at what you can see — what remnants of that Victorian heritage remain alongside the modern facilities?" },
        { type: "knowledge", title: "Nuclear Deterrent", desc: "The submarines built here carry Britain's only nuclear weapons. Standing at this gate, consider the weight of what happens inside — and the arguments for and against it." },
      ],
    },

    nearby: ["dock_museum_anchor", "graving_dock", "bae_the_bridge", "dock_museum_submarine"],
    audiobook_chapter: "shipyard_trail_chapter_bae",
  },

  // ═══════════════════════════════════════════════════════
  // TOWN HALL CLOCK
  // ═══════════════════════════════════════════════════════
  town_hall_clock: {
    name: "Barrow Town Hall",
    zone: "town",
    category: "heritage",

    intro: {
      kids: "You're standing in front of Barrow Town Hall — one of the most beautiful buildings in the whole town! It was built in 1887 when Queen Victoria was on the throne. This is where the people in charge of Barrow make decisions for the whole town.",
      teen: "Barrow Town Hall was built in 1887 — the same year as Queen Victoria's Golden Jubilee. Its Victorian Gothic style reflects the enormous confidence of a town that had grown from nothing to a major industrial city in just 40 years.",
      adult: "Barrow Town Hall, completed in 1887, is a Grade II* listed building designed in the Victorian Gothic style. It was built at the height of Barrow's industrial confidence — the town had transformed from a hamlet of 150 people to a borough of over 50,000 in less than five decades."
    },

    facts: [
      "Barrow Town Hall was built in 1887 during Queen Victoria's Golden Jubilee year.",
      "The building is Grade II* listed — one of the highest heritage protection levels.",
      "The Victorian Gothic style was popular for civic buildings in the 1880s.",
      "James Ramsden became Barrow's first Mayor when it received its charter in 1867.",
      "The town hall clock tower is one of the most recognisable landmarks in Barrow.",
      "Barrow received its charter of incorporation as a municipal borough in 1867.",
      "The building reflects the extraordinary confidence of Victorian Barrow at the height of its industrial power.",
      "The architect was W. Henry Lynn, who designed several important Victorian buildings.",
    ],

    quiz: {
      kids: [
        { q: "What year was Barrow Town Hall built?", options: ["1887", "1950", "1066"], answer: 0, fact: "Built in 1887 during Queen Victoria's Golden Jubilee — over 130 years ago!" },
        { q: "Who was Barrow's first ever Mayor?", options: ["Henry Schneider", "James Ramsden", "George Romney"], answer: 1, fact: "James Ramsden became Barrow's first Mayor when the town got its charter in 1867." },
        { q: "What style is the Town Hall built in?", options: ["Modern", "Victorian Gothic", "Roman"], answer: 1, fact: "Victorian Gothic was a popular style for grand civic buildings in the 1880s." },
      ],
      teen: [
        { q: "What heritage listing does Barrow Town Hall hold?", options: ["Grade II", "Grade II*", "Grade I"], answer: 1, fact: "Grade II* means it's particularly important — the middle tier of the three-level system." },
        { q: "In what year did Barrow receive its charter of incorporation?", options: ["1847", "1867", "1887"], answer: 1, fact: "Barrow became a municipal borough in 1867 — just 27 years after being a hamlet." },
        { q: "The Town Hall was built the same year as which royal milestone?", options: ["Queen Victoria's coronation", "Queen Victoria's Golden Jubilee", "Queen Victoria's Diamond Jubilee"], answer: 1, fact: "1887 was Queen Victoria's Golden Jubilee — 50 years on the throne." },
      ],
      adult: [
        { q: "Who designed Barrow Town Hall?", options: ["George Gilbert Scott", "W. Henry Lynn", "Alfred Waterhouse"], answer: 1, fact: "W. Henry Lynn designed the Town Hall — he was known for his Victorian Gothic civic buildings." },
        { q: "Barrow grew from 150 people in 1840 to approximately how many by 1881?", options: ["20,000", "47,000", "70,000"], answer: 1, fact: "By 1881 Barrow had around 47,000 inhabitants — extraordinary growth driven entirely by industry." },
        { q: "The Town Hall was built during whose mayoralty?", options: ["James Ramsden", "Henry Schneider", "William Gradwell"], answer: 2, fact: "William Gradwell was Mayor when the Town Hall was completed in 1887." },
      ],
    },

    activities: {
      kids: [
        { type: "observation", title: "Clock Watch", desc: "Look up at the Town Hall clock. What time does it say? Is it right? Town hall clocks were once the most accurate time source in town — before everyone had phones!" },
        { type: "observation", title: "Architecture Spotter", desc: "Count the number of different shapes you can see on the Town Hall building — arches, towers, windows, decorations. How many can you find?" },
        { type: "creative", title: "Town Mayor", desc: "If you were Mayor of Barrow what's the first thing you'd do for the town? Tell Old Tom your plan!" },
      ],
      teen: [
        { type: "knowledge", title: "Civic Pride", desc: "In 1887 Barrow spent a huge amount of money on this building. Why would a relatively new industrial town invest so heavily in such an ornate building? What was it trying to say?" },
        { type: "observation", title: "Gothic Details", desc: "Victorian Gothic borrowed from medieval church architecture. Find three features on the Town Hall that you'd also expect to see on a medieval cathedral." },
        { type: "knowledge", title: "40 Years of Growth", desc: "From charter in 1867 to this building in 1887 is just 20 years. List three things that must have happened in Barrow during those 20 years to justify building something this grand." },
      ],
      adult: [
        { type: "observation", title: "Architectural Confidence", desc: "This building was designed to say something about Barrow's status. Standing here, what does it say? Does it succeed? How does it compare to town halls in larger cities?" },
        { type: "knowledge", title: "Industrial Civic Culture", desc: "Victorian industrialists built grand civic buildings — libraries, town halls, museums. What was the relationship between industrial wealth and civic investment? Do we do the same today?" },
        { type: "observation", title: "Heritage Layer", desc: "This Grade II* building sits in a town that has changed enormously since 1887. Look around — what layers of different eras can you see from this spot?" },
      ],
    },

    nearby: ["henry_schneider_statue", "james_ramsden_statue", "submarine_memorial", "the_forum"],
    audiobook_chapter: "iron_town_trail_chapter_2",
  },

  // ═══════════════════════════════════════════════════════
  // PIEL CASTLE
  // ═══════════════════════════════════════════════════════
  piel_castle: {
    name: "Piel Castle",
    zone: "islands",
    category: "heritage",

    intro: {
      kids: "You've made it to Piel Castle on Piel Island — one of the most exciting places near Barrow! This castle was built by monks over 600 years ago. And there's an amazing story about a boy who nearly became King of England right here on this island!",
      teen: "Piel Castle on Piel Island was built by the monks of Furness Abbey in the 14th century. In 1487 it became the landing point for one of the most audacious — and ultimately doomed — attempts to seize the English throne.",
      adult: "Piel Castle, a scheduled ancient monument, was built by the monks of Furness Abbey in the 14th century to protect their trading interests. In June 1487 it became famous as the landing point of Lambert Simnel's invasion force — one of the last serious Yorkist challenges to the Tudor dynasty."
    },

    facts: [
      "Piel Castle was built by the monks of Furness Abbey in the 14th century as a warehouse and defensive post.",
      "Lambert Simnel landed at Piel Island in June 1487 with an army of 2,000 Irish and German mercenaries.",
      "Lambert Simnel claimed to be Edward Earl of Warwick and challenged Henry VII for the English throne.",
      "Simnel's army was defeated at the Battle of Stoke Field and he was pardoned and put to work in the royal kitchen.",
      "The King of Piel tradition involves the landlord of the Ship Inn being crowned King in a ceremony with a rusty sword.",
      "Piel Island is accessible only by ferry from Roa Island.",
      "The Ship Inn on Piel Island is one of the most remote pubs in England.",
      "Piel Castle is a Grade I listed building and Scheduled Ancient Monument.",
      "The castle keep still stands to a considerable height despite centuries of neglect.",
      "English Heritage has carried out consolidation work on the castle to prevent further deterioration.",
    ],

    quiz: {
      kids: [
        { q: "Who built Piel Castle?", options: ["The Romans", "The monks of Furness Abbey", "King Henry VIII"], answer: 1, fact: "The monks built it in the 1300s to protect their trading ships." },
        { q: "What happened at Piel Island in 1487?", options: ["A big storm", "A boy pretending to be a prince landed with an army", "The monks moved here"], answer: 1, fact: "Lambert Simnel arrived with 2,000 soldiers trying to become King of England!" },
        { q: "How do you get to Piel Island?", options: ["By bridge", "By ferry from Roa Island", "You can walk at low tide"], answer: 1, fact: "A small ferry runs from Roa Island to Piel Island when the weather is good." },
        { q: "What unusual tradition happens on Piel Island?", options: ["A monthly market", "The pub landlord gets crowned King", "A Viking festival"], answer: 1, fact: "The King of Piel ceremony crowns the Ship Inn landlord with a rusty helmet and sword!" },
      ],
      teen: [
        { q: "Lambert Simnel claimed to be which royal figure?", options: ["Richard III", "Edward Prince of Wales", "Edward Earl of Warwick"], answer: 2, fact: "Simnel claimed to be Edward, Earl of Warwick — nephew of Edward IV and a Yorkist claimant to the throne." },
        { q: "What happened to Lambert Simnel after his defeat at Stoke Field?", options: ["He was executed", "He escaped to France", "He was pardoned and worked in the royal kitchen"], answer: 2, fact: "Henry VII showed unusual mercy — perhaps recognising Simnel was a puppet of greater conspirators." },
        { q: "In the 14th century Furness Abbey built Piel Castle for what purpose?", options: ["As a holiday retreat", "As a warehouse and defensive post for their trading ships", "As a prison for troublesome monks"], answer: 1, fact: "The abbey had significant trading interests and needed to protect goods arriving by sea." },
      ],
      adult: [
        { q: "The Battle of Stoke Field in 1487 is sometimes considered the last battle of which conflict?", options: ["The Hundred Years War", "The Wars of the Roses", "The Norman Conquest"], answer: 1, fact: "Stoke Field is often considered the true final battle of the Wars of the Roses, two years after Bosworth." },
        { q: "Piel Castle holds which heritage designation?", options: ["Grade II listed", "Grade I listed and Scheduled Ancient Monument", "Grade II* listed"], answer: 1, fact: "As both Grade I listed and a Scheduled Ancient Monument, Piel Castle has the highest level of protection." },
        { q: "The monks of Furness Abbey built Piel Castle primarily to protect their trade in what commodity?", options: ["Iron ore", "Wool", "Salt fish"], answer: 1, fact: "Wool was the abbey's primary export — the castle protected ships loading wool for export to Europe." },
      ],
    },

    activities: {
      kids: [
        { type: "observation", title: "Castle Walls", desc: "Look at the castle walls. How thick do you think they are? Why would you need such thick walls in a castle?" },
        { type: "creative", title: "Lambert Simnel's Story", desc: "Pretend you're Lambert Simnel arriving on this island in 1487. You have 2,000 soldiers and you think you're about to become King. What are you feeling?" },
        { type: "physical", title: "Island Explorer", desc: "Walk around the outside of the castle ruins. How many sides does it have? What shape is it?" },
        { type: "family", title: "King of Piel", desc: "The pub landlord here gets crowned King! If you were King of Piel Island for a day what rule would you make?" },
      ],
      teen: [
        { type: "knowledge", title: "Strategic Location", desc: "Why would monks build a castle here rather than closer to the abbey? Think about trade routes, visibility and defence." },
        { type: "observation", title: "Medieval Engineering", desc: "These walls have stood for 600 years. Look at the construction — what materials were used? How were they put together without modern machinery?" },
        { type: "knowledge", title: "Simnel's Route", desc: "Simnel landed here and marched south. Using a map, trace the likely route his army would have taken from Piel Island to the Battle of Stoke Field in Nottinghamshire." },
      ],
      adult: [
        { type: "knowledge", title: "Monastic Power", desc: "The monks built a castle. Consider what this tells you about the nature of monastic power in medieval England — these were not purely spiritual institutions." },
        { type: "observation", title: "Decay and Survival", desc: "This castle has been neglected for centuries yet significant walls remain. What does that tell you about the quality of medieval construction? What has survived best?" },
        { type: "knowledge", title: "1487 in Context", desc: "Simnel's invasion came just two years after Bosworth. Tudor rule was still fragile. Why might the choice of Piel Island as a landing point have been strategically significant?" },
      ],
    },

    nearby: ["roa_island_jetty", "ship_inn_piel", "lifeboat_station_roa"],
    audiobook_chapter: "island_crossing_chapter_piel",
  },

  // ═══════════════════════════════════════════════════════
  // WALNEY BRIDGE
  // ═══════════════════════════════════════════════════════
  walney_bridge_entrance: {
    name: "Walney Bridge",
    zone: "islands",
    category: "heritage",

    intro: {
      kids: "You're at Walney Bridge — the crossing that connects Barrow to Walney Island! Walney is one of the longest islands in England. On the other side is a whole different world of beaches, nature and history. Let's find out about it!",
      teen: "Walney Bridge connects Barrow to Walney Island — 11 miles long and one of the largest islands off the English coast. The island was transformed in the early 1900s when Vickerstown was built to house the workers of the Vickers shipyard.",
      adult: "Walney Bridge links Barrow to Walney Island, a 11-mile barrier island that has played a significant role in the area's history. Vickerstown — a planned workers' settlement built by Vickers in the early 1900s — represents one of the best examples of early 20th century company town planning in England."
    },

    facts: [
      "Walney Island is approximately 11 miles long and one of the largest islands off the English coast.",
      "Vickerstown on Walney Island was built by Vickers in the early 1900s to house shipyard workers.",
      "Vickerstown was designed as a model village with wide streets and good quality housing.",
      "The Jubilee Bridge connecting Barrow to Walney Island was opened in 1908.",
      "South Walney Nature Reserve at the island's tip is one of England's most important gull colonies.",
      "The Walney Wind Farm offshore is one of the largest wind farms in the world.",
      "North Walney National Nature Reserve protects rare sand dune habitats and the natterjack toad.",
      "Walney Island has a lighthouse at its southern tip that has guided ships since 1790.",
      "The island has two nature reserves at its north and south ends — a remarkable concentration of wildlife.",
      "Grey seals regularly haul out on the beaches of South Walney.",
    ],

    quiz: {
      kids: [
        { q: "How long is Walney Island?", options: ["2 miles", "11 miles", "50 miles"], answer: 1, fact: "Walney Island is 11 miles long — one of the longest islands off the English coast!" },
        { q: "What was Vickerstown built for?", options: ["A holiday resort", "Houses for shipyard workers", "A military base"], answer: 1, fact: "Vickers built Vickerstown to give their workers good quality homes near the shipyard." },
        { q: "What can you find at the southern tip of Walney Island?", options: ["A theme park", "A nature reserve with seals and rare birds", "A submarine base"], answer: 1, fact: "South Walney Nature Reserve is home to seals, rare birds and one of England's largest gull colonies." },
      ],
      teen: [
        { q: "In what year was the Jubilee Bridge connecting Barrow to Walney opened?", options: ["1888", "1908", "1928"], answer: 1, fact: "The Jubilee Bridge opened in 1908, finally connecting Walney Island directly to Barrow." },
        { q: "What rare amphibian breeds at North Walney National Nature Reserve?", options: ["Great crested newt", "Natterjack toad", "Common frog"], answer: 1, fact: "The natterjack toad is one of Britain's rarest amphibians — Walney is one of its last strongholds." },
        { q: "Vickerstown was built as what type of settlement?", options: ["A fishing village", "A military compound", "A planned model village for workers"], answer: 2, fact: "Vickerstown followed the model village tradition — good housing, wide streets, planned for workers' wellbeing." },
      ],
      adult: [
        { q: "Walney Island's lighthouse at its southern tip has guided ships since approximately when?", options: ["1690", "1790", "1890"], answer: 1, fact: "Walney Lighthouse has been operational since around 1790, guiding ships through the Walney Channel." },
        { q: "How does Vickerstown compare to other examples of planned workers' settlements?", options: ["It's unique in England", "It follows a tradition including Saltaire and Port Sunlight", "It was poorly planned compared to similar settlements"], answer: 1, fact: "Vickerstown follows a tradition of enlightened industrial town planning alongside Saltaire, Bournville and Port Sunlight." },
        { q: "The Walney Wind Farm offshore became the world's largest wind farm upon completion in which year?", options: ["2012", "2018", "2020"], answer: 0, fact: "The Walney Wind Farm was the world's largest offshore wind farm when completed in 2012." },
      ],
    },

    activities: {
      kids: [
        { type: "observation", title: "Bridge Watch", desc: "Stand on the bridge and look both ways. On one side is Barrow. On the other side is Walney Island. What differences can you spot between the two sides?" },
        { type: "physical", title: "Island Walk", desc: "You're about to enter an island! Walk to the middle of the bridge and look down at the water below. How wide is the channel between Barrow and Walney?" },
        { type: "family", title: "Wind Check", desc: "Walney is famous for being windy. Stand on the bridge — which way is the wind blowing? Can you see the wind farm offshore?" },
      ],
      teen: [
        { type: "observation", title: "Industrial View", desc: "From the bridge you can see both the BAE Systems site and Walney Island. How does the industrial landscape of Barrow compare to the natural landscape of Walney?" },
        { type: "knowledge", title: "Why Here?", desc: "Why did Vickers choose to build a whole new village on an island rather than in Barrow itself? What advantages would Vickerstown have had for both workers and the company?" },
        { type: "observation", title: "Wind Energy", desc: "The Walney Wind Farm is one of the world's largest. Can you see the turbines from here? How does offshore wind energy fit into the industrial history of this area?" },
      ],
      adult: [
        { type: "knowledge", title: "Island Identity", desc: "Walney Island has a distinct identity separate from Barrow. What factors create and maintain that sense of separateness even though it's connected by a bridge?" },
        { type: "observation", title: "Industrial to Natural", desc: "From this bridge you can see both BAE Systems and Walney's nature reserves within the same view. What does that juxtaposition say about this area's relationship with industry and nature?" },
        { type: "knowledge", title: "Company Towns", desc: "Vickerstown was built to house Vickers workers in the early 1900s. What were the advantages and disadvantages of living in a house provided by your employer? Does that model still exist anywhere today?" },
      ],
    },

    nearby: ["jubilee_bridge_midpoint", "vickerstown_park", "north_walney_reserve_gate", "earnse_bay"],
    audiobook_chapter: "island_crossing_chapter_bridge",
  },

};

// ── Helper function to get pin data ──────────────────────
export function getPinData(pinId) {
  return EXPLORER_PIN_DATA[pinId] || null;
}

// ── Get intro for a pin based on age tier ───────────────
export function getPinIntro(pinId, tier = "kids") {
  const data = EXPLORER_PIN_DATA[pinId];
  if (!data) return null;
  return data.intro[tier] || data.intro.kids;
}

// ── Get quiz questions for a pin based on age tier ──────
export function getPinQuiz(pinId, tier = "kids") {
  const data = EXPLORER_PIN_DATA[pinId];
  if (!data) return [];
  return data.quiz[tier] || data.quiz.kids || [];
}

// ── Get activities for a pin based on age tier ──────────
export function getPinActivities(pinId, tier = "kids") {
  const data = EXPLORER_PIN_DATA[pinId];
  if (!data) return [];
  return data.activities[tier] || data.activities.kids || [];
}

// ── Get random activity for a pin ───────────────────────
export function getRandomActivity(pinId, tier = "kids", type = null) {
  const activities = getPinActivities(pinId, tier);
  if (!activities.length) return null;
  const filtered = type ? activities.filter(a => a.type === type) : activities;
  if (!filtered.length) return activities[Math.floor(Math.random() * activities.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// ── Get random quiz question ─────────────────────────────
export function getRandomQuizQuestion(pinId, tier = "kids", usedIds = []) {
  const questions = getPinQuiz(pinId, tier);
  const unused = questions.filter((_, i) => !usedIds.includes(i));
  if (!unused.length) return questions[Math.floor(Math.random() * questions.length)];
  return unused[Math.floor(Math.random() * unused.length)];
}

export default EXPLORER_PIN_DATA;
