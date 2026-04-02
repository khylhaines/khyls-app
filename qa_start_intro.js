/* =========================================================
   qa_start_intro.js
   BARROW QUEST START INTRO SYSTEM
   - PIN BASED ONLY
   - KID / TEEN / ADULT
========================================================= */

export const PIN_START_INTROS = {
  home_base_marsh_st: {
    kid: [
      "You’re starting right here.",
      "This is your base. Your ground. Your beginning.",
      "Every journey starts somewhere — and this is yours.",
      "From here, you’ll move out, explore, and build your path.",
      "Remember this spot… you’ll return stronger.",
    ],
    teen: [
      "This is where it begins.",
      "Not just a location — your starting point.",
      "Everything you’re about to unlock spreads out from here.",
      "Every move you make traces back to this place.",
      "This is your origin.",
    ],
    adult: [
      "This is your starting point.",
      "A quiet place, but every journey needs one.",
      "From here, the map opens — and the story begins to unfold.",
      "What you build from this point… is entirely yours.",
    ],
  },

  morrisons_retail: {
    kid: [
      "This might look like just a shop… but it’s part of everyday life here.",
      "People come and go all day, picking up what they need.",
      "Places like this keep a town moving.",
      "Even the simple places matter.",
    ],
    teen: [
      "Not everything important looks special at first glance.",
      "This is where daily life happens — constant movement, constant flow.",
      "A town isn’t just history… it’s what people do every day.",
      "And this place is part of that rhythm.",
    ],
    adult: [
      "This is part of the town’s daily engine.",
      "Routine, movement, people passing through — all of it matters.",
      "Not every landmark is historic… some are simply essential.",
      "And this is one of them.",
    ],
  },

  salthouse_mills: {
    kid: [
      "This place helped build the town a long time ago.",
      "Big machines, hard work, and people working together.",
      "It might look quiet now… but it wasn’t always like that.",
      "This is where things were made.",
    ],
    teen: [
      "This is where industry shaped everything.",
      "Work, noise, movement — this place once powered lives.",
      "It may feel still now, but it wasn’t built to be quiet.",
      "This is part of where Barrow became Barrow.",
    ],
    adult: [
      "This is one of the industrial roots of the town.",
      "Production, labour, and long hours shaped this area.",
      "What you see now is only what remains — not what it was.",
      "Places like this built everything that came after.",
    ],
  },

  cenotaph_core: {
    kid: [
      "This is a place to stop.",
      "Not for a game… but to remember.",
      "People are honoured here — people who didn’t come home.",
      "Take a second. Be still. This place matters.",
    ],
    teen: [
      "This isn’t just a landmark.",
      "It’s a place of memory.",
      "Names, lives, stories — all remembered here.",
      "Before you move on… take it in properly.",
    ],
    adult: [
      "This is a place of remembrance.",
      "A still point in the middle of everything else.",
      "Lives lost, names carried forward, memory held in place.",
      "Pause here. This one deserves it.",
    ],
  },

  park_bandstand_core: {
    kid: [
      "This is where people used to gather and perform!",
      "Music, dancing, and fun filled this space.",
      "Imagine the sounds, the crowd, the excitement!",
      "This place was full of life.",
    ],
    teen: [
      "This was a stage — real energy, real presence.",
      "Music, crowds, movement — all happening right here.",
      "Even now, you can feel what it used to be.",
      "This place wasn’t quiet.",
    ],
    adult: [
      "This was a focal point of community life.",
      "Performance, gathering, shared moments.",
      "It held energy — the kind that brings people together.",
      "You can still sense it if you stop long enough.",
    ],
  },

  park_railway_core: {
    kid: [
      "Look at this… a railway inside a park!",
      "Trains used to run here, carrying people for fun.",
      "Not for travel — for experience.",
      "Imagine riding through here, wind in your face, smiling all the way.",
    ],
    teen: [
      "This wasn’t built for necessity — it was built for enjoyment.",
      "A miniature railway, but a real experience.",
      "Movement, sound, and a different way to see the park.",
      "Sometimes the smallest things leave the biggest memory.",
    ],
    adult: [
      "A reminder of when leisure was crafted with care.",
      "A small railway, but a meaningful one.",
      "It wasn’t about getting somewhere — it was about the experience itself.",
      "That idea still holds value.",
    ],
  },

  boating_lake_core: {
    kid: [
      "Water, boats, and space to explore.",
      "People come here to play, relax, and enjoy the moment.",
      "Watch the water… it’s always moving.",
      "This place is calm, but full of life.",
    ],
    teen: [
      "This is where everything slows down.",
      "Water changes the pace — makes you notice more.",
      "It’s not about rushing here… it’s about being in it.",
      "Take a second before moving on.",
    ],
    adult: [
      "A pause point in the middle of movement.",
      "The water reflects everything — light, sky, motion.",
      "Places like this balance a town.",
      "Stillness has its place too.",
    ],
  },

  bridgegate_ave: {
    kid: [
      "This road leads you out… or brings you back.",
      "Every path connects somewhere.",
      "People travel this way every day.",
      "It’s part of the bigger map.",
    ],
    teen: [
      "This is a connector — nothing flashy, but essential.",
      "Every route needs something like this.",
      "Movement, direction, decisions.",
      "Where you go next… starts here.",
    ],
    adult: [
      "A transition point.",
      "Not a destination — but a link between them.",
      "Infrastructure like this shapes how everything flows.",
      "Even the quiet routes matter.",
    ],
  },

  fryers_lane: {
    kid: [
      "This place feels different… quieter.",
      "Less noise, more space to notice things.",
      "Look around — what can you spot?",
      "Sometimes the calm places are the best.",
    ],
    teen: [
      "You can feel the shift here.",
      "Less pressure, less movement — more awareness.",
      "Places like this don’t shout… they sit quietly.",
      "And that’s what makes them interesting.",
    ],
    adult: [
      "A quieter stretch, but not without value.",
      "These spaces create contrast — and contrast matters.",
      "Not everything needs to stand out to be important.",
      "Some places simply exist… and that’s enough.",
    ],
  },

  flashlight_bend: {
    kid: [
      "This place feels a bit mysterious…",
      "Like something could be hiding just out of sight.",
      "If you had a torch, where would you shine it?",
      "Look closely — you might spot something.",
    ],
    teen: [
      "There’s something about this spot.",
      "A slight edge — like it holds more than it shows.",
      "Every route has places like this.",
      "Not obvious… but not empty either.",
    ],
    adult: [
      "A subtle shift in atmosphere.",
      "Not dramatic — but noticeable.",
      "These are the kinds of places that make you pay attention.",
      "And that’s where awareness starts.",
    ],
  },

  red_river_walk_core: {
    kid: [
      "Follow this path… it leads somewhere special.",
      "Trees, water, and quiet all around you.",
      "People have walked this way for a long time.",
      "Keep going… something bigger is ahead.",
    ],
    teen: [
      "This isn’t just a path — it’s a lead-in.",
      "Everything here feels like it’s guiding you somewhere.",
      "The deeper you go, the more the world changes.",
      "You’re not at the destination yet… but you’re close.",
    ],
    adult: [
      "A transition into something older.",
      "The surroundings begin to shift — quieter, more grounded.",
      "Paths like this were never random… they lead with purpose.",
      "And this one leads somewhere significant.",
    ],
  },

  furness_abbey_core: {
    kid: [
      "This place is really, really old.",
      "Long before the town, people lived and worked here.",
      "Monks built this, stone by stone.",
      "You’re standing in history now.",
    ],
    teen: [
      "This is where everything changes.",
      "Before industry, before the town — there was this.",
      "Power, belief, structure… all built into these ruins.",
      "You’re not just visiting a place… you’re stepping into the past.",
    ],
    adult: [
      "This is one of the foundations of the entire area.",
      "A place of power, influence, and long-standing presence.",
      "What remains is only a fragment of what once stood here.",
      "But even now… it carries weight.",
    ],
  },

  dock_museum_anchor: {
    kid: [
      "This anchor once held something huge in place.",
      "Ships, boats, and big machines all needed anchors like this.",
      "It’s heavier than it looks… and stronger too.",
      "This is part of the dock story.",
    ],
    teen: [
      "This isn’t decoration — it’s function.",
      "Something like this controlled movement on a massive scale.",
      "The docks weren’t small operations… they were serious.",
      "And this is a piece of that world.",
    ],
    adult: [
      "A symbol of maritime control and stability.",
      "Anchors like this represent the scale of what operated here.",
      "Industry at the docks wasn’t light work — it was heavy, constant, essential.",
      "This is one of its remnants.",
    ],
  },

  town_hall_clock: {
    kid: [
      "Look up — this clock has been watching over the town.",
      "People have checked the time here for years and years.",
      "It’s always there… always ticking.",
      "Time never stops.",
    ],
    teen: [
      "This is more than a clock — it’s a marker.",
      "People pass it, meet under it, live around it.",
      "It’s part of the town’s rhythm.",
      "Always moving… even when everything else pauses.",
    ],
    adult: [
      "A central reference point.",
      "Timekeeping, structure, daily life — all tied to this.",
      "Landmarks like this anchor a town’s routine.",
      "Reliable, constant, always present.",
    ],
  },

  custom_house: {
    kid: [
      "This building was important a long time ago.",
      "Ships came in, and people checked what they were carrying.",
      "Everything had to be recorded and controlled.",
      "This place helped manage it all.",
    ],
    teen: [
      "Trade passed through here.",
      "Goods, money, decisions — all controlled from this point.",
      "Nothing moved without being checked.",
      "This was power… just not the loud kind.",
    ],
    adult: [
      "A key point of control during the town’s growth.",
      "Imports, exports, taxation — all regulated here.",
      "It represents structure behind expansion.",
      "Not visible power… but essential power.",
    ],
  },

  the_forum: {
    kid: [
      "This is where people come to watch shows and have fun.",
      "Music, acting, lights — all happening inside.",
      "It’s a place for stories and performances.",
      "Something exciting is always going on here.",
    ],
    teen: [
      "This is where the town performs.",
      "Live shows, events, energy — all in one space.",
      "It’s not just a building… it’s where people gather for something bigger.",
      "You can feel that when you’re here.",
    ],
    adult: [
      "A modern cultural centre.",
      "Performance, community, shared experience — all brought together here.",
      "It reflects the town as it is now, not just what it was.",
      "Living culture, not just history.",
    ],
  },

  barrow_library: {
    kid: [
      "This place is full of knowledge.",
      "Books, stories, and ideas from everywhere.",
      "You can learn almost anything here.",
      "Every book holds a new adventure.",
    ],
    teen: [
      "Knowledge is stored here — quietly, but powerfully.",
      "Stories, facts, history… all waiting.",
      "Places like this don’t shout… but they shape people.",
      "And that matters.",
    ],
    adult: [
      "A centre of learning and access.",
      "Information, history, and thought preserved in one place.",
      "Libraries are foundations of understanding.",
      "This is one of them.",
    ],
  },

  henry_schneider_statue: {
    kid: [
      "This statue is of someone who helped build the town.",
      "He made big changes that shaped everything around here.",
      "Without people like him, this place would be different.",
      "He helped start something big.",
    ],
    teen: [
      "This is one of the people behind it all.",
      "Industry didn’t just happen — it was driven.",
      "Decisions, risks, vision… that’s what built this place.",
      "And he was part of that.",
    ],
    adult: [
      "One of the key figures in the town’s industrial rise.",
      "Leadership, investment, and direction all played a role here.",
      "This statue marks influence — not just presence.",
      "The town’s growth didn’t happen by accident.",
    ],
  },

  james_ramsden_statue: {
    kid: [
      "This statue shows someone very important to the town.",
      "He helped design and grow the place you see today.",
      "A lot of what’s here started with him.",
      "He helped shape the town.",
    ],
    teen: [
      "This is another architect of the town’s identity.",
      "Planning, structure, expansion — all guided by people like him.",
      "What you see around you didn’t just appear… it was built with intent.",
      "And he helped lead that.",
    ],
    adult: [
      "A central figure in the development of the town.",
      "Urban planning, industrial growth, and civic structure all connect here.",
      "His influence is still visible in the layout and design.",
      "This is legacy in physical form.",
    ],
  },

  old_fire_station: {
    kid: [
      "This is where firefighters used to rush out from!",
      "When alarms went off, they had to move fast.",
      "Helping people and stopping danger.",
      "This place was all about action.",
    ],
    teen: [
      "This was a place of response.",
      "When something went wrong, this is where it started to be fixed.",
      "Speed, pressure, responsibility — all came from here.",
      "It wasn’t quiet for long.",
    ],
    adult: [
      "A functional hub of emergency response.",
      "Preparedness, urgency, and responsibility were central here.",
      "Places like this protected the town at its most vulnerable moments.",
      "Service, not spotlight.",
    ],
  },

  market_hall: {
    kid: [
      "This is where people come to buy and sell things.",
      "Stalls, food, voices — all in one place.",
      "There’s always something different to see here.",
      "It’s busy, lively, and full of life.",
    ],
    teen: [
      "This is real town energy.",
      "People talking, trading, moving — constant flow.",
      "Not polished, not quiet… just real.",
      "Places like this show what a town actually is.",
    ],
    adult: [
      "A centre of local trade and interaction.",
      "Independent stalls, daily exchange, human contact.",
      "This is where community becomes visible.",
      "Not structured… but alive.",
    ],
  },

  duke_of_edinburgh: {
    kid: [
      "This place is where people come to relax and talk.",
      "After a long day, they come here to unwind.",
      "Laughter, stories, and people spending time together.",
      "It’s part of everyday life.",
    ],
    teen: [
      "This is where conversations happen.",
      "Not official… not planned… just real.",
      "Places like this hold stories you don’t see written anywhere.",
      "And that’s what makes them important.",
    ],
    adult: [
      "A social anchor within the town.",
      "Conversation, connection, and shared space.",
      "These places hold the human side of history.",
      "Not recorded… but remembered.",
    ],
  },

  emlyn_hughes_statue: {
    kid: [
      "This statue is of a football legend!",
      "Someone who played at the highest level.",
      "He came from here — just like you’re standing now.",
      "Big dreams can start anywhere.",
    ],
    teen: [
      "This is proof of where you can go from here.",
      "Local start… global impact.",
      "Effort, skill, drive — that’s what it took.",
      "And it started in a place like this.",
    ],
    adult: [
      "A figure representing achievement beyond the town.",
      "Origin does not limit outcome.",
      "His career reflects what can emerge from places like this.",
      "Recognition, earned.",
    ],
  },

  graving_dock: {
    kid: [
      "This place was built for big ships.",
      "Massive ones.",
      "Ships would come in, get repaired, and go back out again.",
      "This place was full of action.",
    ],
    teen: [
      "This is heavy industry.",
      "Ships brought in, stripped down, rebuilt.",
      "Work, noise, pressure — all constant.",
      "Nothing small happened here.",
    ],
    adult: [
      "A core part of the dockyard operation.",
      "Maintenance, repair, structural work on large vessels.",
      "This was labour at scale.",
      "Demanding, physical, and essential.",
    ],
  },

  slag_bank: {
    kid: [
      "This hill wasn’t always here…",
      "It was made from leftover material from factories.",
      "Over time, it built up into what you see now.",
      "Even waste can turn into something big.",
    ],
    teen: [
      "This is the result of industry.",
      "What’s left behind doesn’t disappear — it builds.",
      "Layer after layer, year after year.",
      "This is what that looks like.",
    ],
    adult: [
      "An industrial byproduct turned landscape.",
      "Accumulated waste from production over time.",
      "It stands as a physical reminder of scale.",
      "Not polished… but honest.",
    ],
  },

  walney_bridge_entrance: {
    kid: [
      "You’re crossing into somewhere different now.",
      "Over the water, onto the island.",
      "Look around — everything starts to feel more open.",
      "This is the way onto Walney.",
    ],
    teen: [
      "This is the crossing point.",
      "Town behind you… island ahead.",
      "The space changes, the air changes, everything shifts slightly.",
      "You’re moving into a different kind of place now.",
    ],
    adult: [
      "A transition between environments.",
      "From town structure to coastal openness.",
      "Crossings like this define movement and identity.",
      "You’re entering a different space entirely.",
    ],
  },

  earnse_bay: {
    kid: [
      "Look out… the sea goes on forever.",
      "Waves, wind, and open space all around you.",
      "You can hear it, feel it, see it moving.",
      "This place feels big.",
    ],
    teen: [
      "This is where everything opens up.",
      "No walls, no limits — just horizon.",
      "The sea doesn’t stop… and neither does the view.",
      "Take a second here.",
    ],
    adult: [
      "An exposed stretch of coastline.",
      "Wind, tide, and horizon dominating the space.",
      "Places like this reset perspective.",
      "Wide, open, uninterrupted.",
    ],
  },

  walney_lighthouse: {
    kid: [
      "This tower helps guide ships safely.",
      "A light in the distance so they don’t get lost.",
      "It stands here watching over the sea.",
      "Always helping, even in the dark.",
    ],
    teen: [
      "This is guidance, built into the landscape.",
      "Ships relied on this — still do.",
      "Out there, direction matters.",
      "And this is part of how they found it.",
    ],
    adult: [
      "A navigational landmark.",
      "Positioned for visibility, built for purpose.",
      "It represents safety, direction, and control in open water.",
      "Functional, but iconic.",
    ],
  },

  round_house: {
    kid: [
      "This house looks different from others.",
      "Round, unusual, and easy to notice.",
      "Not everything has to follow the same shape.",
      "This place stands out.",
    ],
    teen: [
      "Not built like everything else — and that’s the point.",
      "Structure doesn’t always follow rules.",
      "Sometimes design is about being different.",
      "And this definitely is.",
    ],
    adult: [
      "An architectural outlier.",
      "Unconventional form, intentional presence.",
      "It challenges the standard structure of surrounding spaces.",
      "Difference, by design.",
    ],
  },

  biggar_village: {
    kid: [
      "This feels like a small, quiet place.",
      "Houses, roads, and people living their lives.",
      "Not busy, not loud — just calm.",
      "Places like this feel different.",
    ],
    teen: [
      "This is slower.",
      "Less noise, less movement — more space to breathe.",
      "Not everything needs to be fast.",
      "This kind of place proves that.",
    ],
    adult: [
      "A quieter residential area.",
      "Less density, less pressure, more space.",
      "These environments balance the intensity of larger areas.",
      "Calm has value.",
    ],
  },

  piel_castle: {
    kid: [
      "This is a real castle… out on its own island.",
      "Long ago, people lived and defended this place.",
      "It’s been through battles, storms, and time itself.",
      "You’re standing in something ancient.",
    ],
    teen: [
      "This is history you can actually feel.",
      "Isolated, exposed, built for defence.",
      "This place wasn’t peaceful — it had a purpose.",
      "And you can still sense that.",
    ],
    adult: [
      "A coastal stronghold with strategic importance.",
      "Isolation gave it power, but also vulnerability.",
      "It has endured conflict, weather, and centuries of change.",
      "What remains still carries presence.",
    ],
  },

  roa_island_jetty: {
    kid: [
      "This is where boats come and go.",
      "People travel across the water from here.",
      "It connects the land to the sea.",
      "Watch the movement — it never really stops.",
    ],
    teen: [
      "A working edge between land and water.",
      "Movement, transport, transition — all happening here.",
      "This is where journeys begin or end.",
      "Right on the line between two worlds.",
    ],
    adult: [
      "A functional coastal access point.",
      "Transport, connection, and movement converge here.",
      "Jetties like this extend land into sea — deliberately.",
      "A controlled point in an open environment.",
    ],
  },

  amphitheatre_core: {
    kid: [
      "This place feels like a stage.",
      "You could stand here and perform to everyone around you!",
      "Voices would carry, and people would watch.",
      "It’s built for being seen.",
    ],
    teen: [
      "This is structure built for attention.",
      "Sound, focus, presence — all directed here.",
      "Even empty, it feels like something should be happening.",
      "That’s what it was made for.",
    ],
    adult: [
      "A space designed for gathering and performance.",
      "Shape, acoustics, and layout all serve a purpose.",
      "It draws focus naturally.",
      "Even without a crowd, the intention is clear.",
    ],
  },

  abbey_ruins_marker: {
    kid: [
      "These stones are part of something much bigger.",
      "Long ago, this whole area was full of buildings.",
      "Now only parts remain.",
      "But they still tell the story.",
    ],
    teen: [
      "Fragments of something once complete.",
      "What you see is only what’s left behind.",
      "Time removes things… but not everything.",
      "And this is what remains.",
    ],
    adult: [
      "A physical trace of a larger structure.",
      "Partial, worn, but still significant.",
      "Ruins like this are evidence — not decoration.",
      "They show what once stood here.",
    ],
  },

  park_playground: {
    kid: [
      "This is where the fun happens!",
      "Climbing, running, playing — it’s all here.",
      "Energy, laughter, and movement everywhere.",
      "Go on… this is your space.",
    ],
    teen: [
      "Pure movement, no pressure.",
      "Jump in, mess around, use the space.",
      "Not everything needs a reason.",
      "Sometimes it’s just about having fun.",
    ],
    adult: [
      "A space built for play and energy.",
      "Movement, interaction, and freedom of use.",
      "Places like this bring life into the environment.",
      "Simple… but essential.",
    ],
  },

  park_bowling_green_core: {
    kid: [
      "This is where people play a calm, careful game.",
      "It might look simple… but it takes skill.",
      "Slow moves, steady aim.",
      "Not all games are fast.",
    ],
    teen: [
      "This is precision over speed.",
      "Focus, control, small movements that matter.",
      "It’s quieter… but no less competitive.",
      "Different kind of game, same challenge.",
    ],
    adult: [
      "A traditional space for measured sport.",
      "Control, accuracy, and patience define it.",
      "It reflects a slower, more deliberate pace.",
      "Skill over intensity.",
    ],
  },

  park_cafe_core: {
    kid: [
      "This is where people stop for a drink or a snack.",
      "After running around, this is the place to rest.",
      "Warm drinks, food, and a break.",
      "Everyone needs one.",
    ],
    teen: [
      "This is the reset point.",
      "Sit down, take a breath, recharge.",
      "Movement pauses here for a bit.",
      "Then you go again.",
    ],
    adult: [
      "A social and restorative space.",
      "Pause, refresh, and continue.",
      "Places like this support the flow of everything around them.",
      "A necessary balance point.",
    ],
  },

  ormsgill_reservoir: {
    kid: [
      "This water is stored for the town.",
      "It might look calm… but it’s important.",
      "Places like this help everything keep running.",
      "Water is always needed.",
    ],
    teen: [
      "This is quiet, but essential.",
      "Stored water, controlled and managed.",
      "You don’t notice it… until you need it.",
      "That’s how systems work.",
    ],
    adult: [
      "A controlled water source.",
      "Infrastructure, not spectacle — but critical.",
      "It supports daily life without drawing attention.",
      "Function over visibility.",
    ],
  },

  barrow_afc_grounds: {
    kid: [
      "This is where football matches are played!",
      "Crowds, cheering, excitement — all happening here.",
      "People come together to support their team.",
      "This place is full of energy.",
    ],
    teen: [
      "This is local pride.",
      "Competition, pressure, noise — all packed into one space.",
      "Wins matter here.",
      "And so does showing up.",
    ],
    adult: [
      "A focal point of local sport and identity.",
      "Community, competition, and shared experience.",
      "Sport binds people together in ways few things can.",
      "This is one of those places.",
    ],
  },

  rugby_ground: {
    kid: [
      "This is where rugby is played — a tough, fast game!",
      "Players run, tackle, and push hard.",
      "It takes strength and teamwork.",
      "This place is all about action.",
    ],
    teen: [
      "This is impact sport.",
      "Physical, direct, no holding back.",
      "You feel the intensity just standing near it.",
      "This is where strength meets discipline.",
    ],
    adult: [
      "A space defined by physical competition.",
      "Strength, endurance, and structure all tested here.",
      "Rugby demands commitment — and this ground reflects that.",
      "Direct, uncompromising sport.",
    ],
  },

  hollywood_park: {
    kid: [
      "This place is all about fun!",
      "Games, lights, and things to do everywhere.",
      "People come here to play and enjoy themselves.",
      "It’s full of energy.",
    ],
    teen: [
      "This is pure downtime.",
      "No pressure — just games, movement, and noise.",
      "Places like this are about switching off for a bit.",
      "And just enjoying it.",
    ],
    adult: [
      "A modern leisure space.",
      "Entertainment, recreation, and social activity combined.",
      "It provides release from routine.",
      "Structured fun, but still necessary.",
    ],
  },

  furness_general_hospital: {
    kid: [
      "This is where people go when they need help.",
      "Doctors and nurses work here every day.",
      "They take care of people and make them better.",
      "This place is important.",
    ],
    teen: [
      "This is serious.",
      "Real situations, real responsibility.",
      "People rely on places like this every day.",
      "It’s not just a building — it’s essential.",
    ],
    adult: [
      "A critical healthcare facility.",
      "Care, urgency, and responsibility define this space.",
      "Lives are treated, supported, and protected here.",
      "Fundamental to the town’s wellbeing.",
    ],
  },

  rampside_needle: {
    kid: [
      "Look at that tower… standing tall by the sea.",
      "It’s been here a long time, watching everything.",
      "Wind, waves, and time all around it.",
      "It feels different here.",
    ],
    teen: [
      "Isolated, exposed, and still standing.",
      "The sea, the wind — constant pressure.",
      "And it’s still here.",
      "Places like this carry atmosphere.",
    ],
    adult: [
      "A coastal landmark shaped by its environment.",
      "Exposed to weather, time, and isolation.",
      "It stands as both structure and symbol.",
      "Endurance, visible.",
    ],
  },

  st_georges_church: {
    kid: [
      "This is a place where people come to be quiet and think.",
      "It’s calm inside, peaceful and still.",
      "People gather here for important moments.",
      "It’s a special place.",
    ],
    teen: [
      "This is where everything slows down.",
      "Different kind of space — quieter, more focused.",
      "People come here for meaning, not movement.",
      "That changes the feel of it.",
    ],
    adult: [
      "A place of reflection and gathering.",
      "Spiritual, communal, and structured.",
      "It offers contrast to the pace of everyday life.",
      "Stillness, by design.",
    ],
  },

  bae_main_gate: {
    kid: [
      "This is where huge ships are built.",
      "Big machines, big work, and lots of people.",
      "Things made here go out into the world.",
      "It’s a powerful place.",
    ],
    teen: [
      "This is serious industry.",
      "Scale, security, precision — everything controlled.",
      "What happens here isn’t small… and it isn’t simple.",
      "This is where major work happens.",
    ],
    adult: [
      "A controlled entry point to a major industrial operation.",
      "Shipbuilding, engineering, and defence work occur beyond this point.",
      "Scale and complexity define this space.",
      "Restricted, but significant.",
    ],
  },

  hindpool_tiger_core: {
    kid: [
      "This statue stands strong and proud.",
      "It represents power, strength, and spirit.",
      "People recognise it — it’s part of the area.",
      "It’s more than just a statue.",
    ],
    teen: [
      "This is local identity.",
      "Symbolic, bold, and easy to remember.",
      "It stands out — and that’s the point.",
      "Places like this stick with you.",
    ],
    adult: [
      "A symbolic landmark tied to local identity.",
      "It represents strength and recognition within the area.",
      "Simple in form, but strong in meaning.",
      "A visual anchor.",
    ],
  },

  dalton_road_clock: {
    kid: [
      "Another clock watching over the town.",
      "People pass it every day without thinking.",
      "But it’s always there, keeping time.",
      "Ticking, every second.",
    ],
    teen: [
      "This is part of the town’s rhythm.",
      "Time moving, people moving with it.",
      "You don’t notice it until you stop.",
      "But it’s always doing its job.",
    ],
    adult: [
      "A secondary timekeeping landmark.",
      "Less central, but still part of daily flow.",
      "It reinforces structure within movement.",
      "Constant, understated.",
    ],
  },

  voodoo_entrance: {
    kid: [
      "This place feels exciting!",
      "Music, lights, and people coming together.",
      "It’s where fun starts.",
      "Something always happens here.",
    ],
    teen: [
      "This is energy.",
      "Music, movement, atmosphere — all packed in.",
      "Different vibe to everything else.",
      "This is where things come alive.",
    ],
    adult: [
      "A nightlife entry point.",
      "Sound, atmosphere, and social energy define it.",
      "It represents a different side of the town.",
      "Active, expressive, and alive.",
    ],
  },

  bus_depot: {
    kid: [
      "This is where buses come and go.",
      "People travel from here to lots of places.",
      "It’s always moving, always busy.",
      "Journeys start here.",
    ],
    teen: [
      "Movement hub.",
      "People heading out, coming back, passing through.",
      "Constant flow, constant direction.",
      "This place never really stops.",
    ],
    adult: [
      "A transport node within the town.",
      "Logistics, timing, and movement converge here.",
      "It enables connection across wider areas.",
      "Functional and essential.",
    ],
  },

  north_walney_reserve_gate: {
    kid: [
      "You’re about to enter a wild place.",
      "Nature, animals, and open land ahead.",
      "Look carefully — there’s a lot to see.",
      "This is where things feel different.",
    ],
    teen: [
      "This is where the town ends… and nature takes over.",
      "Less structure, more unpredictability.",
      "You notice more when things aren’t controlled.",
      "That’s what makes it interesting.",
    ],
    adult: [
      "A transition into protected natural space.",
      "Less human control, more environmental presence.",
      "These areas preserve balance.",
      "And they change how you move through them.",
    ],
  },

  sandy_gap_beach_access: {
    kid: [
      "You’re heading toward the beach now.",
      "Sand, sea, and space to run around.",
      "Listen to the waves… they’re always moving.",
      "This is where land meets the ocean.",
    ],
    teen: [
      "This is the edge.",
      "No buildings, no barriers — just open coastline.",
      "The sound of the sea takes over everything else.",
      "You’re out in it now.",
    ],
    adult: [
      "A direct access point to open shoreline.",
      "Wind, tide, and exposure define this space.",
      "Less structure, more environment.",
      "The landscape leads here.",
    ],
  },

  walney_airfield_entrance: {
    kid: [
      "Planes used to take off from here!",
      "Imagine them flying up into the sky.",
      "This place connects land to air.",
      "It’s built for movement.",
    ],
    teen: [
      "This is about lift and direction.",
      "Runways, takeoffs, controlled movement into open space.",
      "Even when it’s quiet, it holds that purpose.",
      "Designed for going somewhere.",
    ],
    adult: [
      "An aviation access point.",
      "Structured space built for controlled ascent and landing.",
      "Function defines the layout.",
      "Movement beyond ground level begins here.",
    ],
  },

  vickerstown_park: {
    kid: [
      "This is a place to play and explore.",
      "Trees, space, and room to move around.",
      "You can run, relax, or just look around.",
      "It’s open and free.",
    ],
    teen: [
      "Simple space, but useful.",
      "Move, stop, reset — whatever you need.",
      "Not every place needs to be complicated.",
      "This one just works.",
    ],
    adult: [
      "A local green space.",
      "Accessible, open, and adaptable.",
      "It supports everyday movement and rest.",
      "Functional and available.",
    ],
  },

  king_alfred_pub: {
    kid: [
      "This is where people come to relax and talk.",
      "They share stories and spend time together.",
      "It’s part of everyday life.",
      "A place for people to meet.",
    ],
    teen: [
      "This is a social spot.",
      "Conversations, stories, real interactions.",
      "Not everything happens in big places.",
      "Sometimes it’s right here.",
    ],
    adult: [
      "A local social venue.",
      "Informal interaction, conversation, shared time.",
      "Places like this carry community memory.",
      "Quietly important.",
    ],
  },

  thorny_nook: {
    kid: [
      "This place feels quiet and open.",
      "Less noise, more space to look around.",
      "You might spot something if you pay attention.",
      "Take a moment here.",
    ],
    teen: [
      "This is low activity, high awareness.",
      "Not much happening — and that’s the point.",
      "You notice more when things slow down.",
      "Stay sharp here.",
    ],
    adult: [
      "A quieter, less defined space.",
      "Minimal structure, more environmental presence.",
      "It encourages observation over action.",
      "Subtle, but not empty.",
    ],
  },

  south_walney_reserve_entrance: {
    kid: [
      "You’re entering a wild space now.",
      "Animals, birds, and nature all around you.",
      "This place is protected — it’s their home.",
      "Look carefully… there’s a lot to see.",
    ],
    teen: [
      "This is raw nature.",
      "No control, no structure — just environment.",
      "You’re stepping into something that runs on its own rules.",
      "Stay aware here.",
    ],
    adult: [
      "A protected natural environment.",
      "Minimal human interference, maximum ecological presence.",
      "Spaces like this preserve balance.",
      "You’re entering a different system.",
    ],
  },

  walney_school: {
    kid: [
      "This is where people come to learn.",
      "Classrooms, lessons, and new ideas every day.",
      "Everyone starts somewhere… and this is one of those places.",
      "Learning happens here.",
    ],
    teen: [
      "This is where foundations are built.",
      "Knowledge, structure, progression — all starting here.",
      "It might feel routine… but it shapes everything after.",
      "This is where it begins.",
    ],
    adult: [
      "An educational foundation within the community.",
      "Development, structure, and learning all centred here.",
      "Places like this define future pathways.",
      "Quietly influential.",
    ],
  },

  west_shore_park: {
    kid: [
      "You’ve got the sea right next to you here!",
      "Open space, fresh air, and room to move.",
      "Run, explore, or just look out at the water.",
      "This place feels free.",
    ],
    teen: [
      "Open ground, open view.",
      "Nothing closing you in — just space and coastline.",
      "You can move, stop, or just take it in.",
      "This is freedom in a place.",
    ],
    adult: [
      "An open coastal park space.",
      "Minimal restriction, maximum exposure.",
      "Wind, sea, and land meet here.",
      "Expansive and accessible.",
    ],
  },

  jubilee_bridge_midpoint: {
    kid: [
      "You’re right above the water here!",
      "Look around — everything stretches out around you.",
      "You’re between two sides, not quite on either.",
      "It feels different here.",
    ],
    teen: [
      "Midpoint.",
      "Not where you started, not where you’re going.",
      "Suspended between two places.",
      "That shift matters.",
    ],
    adult: [
      "A transitional midpoint.",
      "Balanced between origin and destination.",
      "These spaces highlight movement itself.",
      "You are in between.",
    ],
  },

  coast_road_entrance: {
    kid: [
      "This road leads along the coast.",
      "Sea on one side, land on the other.",
      "You can follow it and see where it goes.",
      "Adventure starts here.",
    ],
    teen: [
      "This is a route with a view.",
      "Movement alongside open coastline.",
      "You’re not just travelling… you’re experiencing it.",
      "Stay aware of what’s around you.",
    ],
    adult: [
      "A coastal route entry point.",
      "Movement aligned with landscape exposure.",
      "It offers both direction and environment.",
      "Travel becomes part of the experience.",
    ],
  },

  lifeboat_station_roa: {
    kid: [
      "This is where rescue boats launch from.",
      "When people are in danger at sea, this is where help comes from.",
      "Fast, brave, and ready at any time.",
      "This place saves lives.",
    ],
    teen: [
      "This is real response.",
      "No delay, no hesitation — action when it matters.",
      "Out there, things can change fast.",
      "And this is where help starts.",
    ],
    adult: [
      "A critical maritime rescue point.",
      "Rapid response, trained crews, and constant readiness.",
      "Operations here are driven by urgency and precision.",
      "Purpose over everything.",
    ],
  },

  concle_inn: {
    kid: [
      "This is a place where people stop and relax.",
      "After travelling or walking, they come here to rest.",
      "Food, drinks, and stories shared together.",
      "It’s part of the journey.",
    ],
    teen: [
      "This is a pause in the middle of movement.",
      "People come through, stay for a bit, then move on.",
      "Stories pass through places like this.",
      "Not always written down.",
    ],
    adult: [
      "A local stop within a wider route.",
      "Rest, refreshment, and social interaction.",
      "It supports movement by allowing pause.",
      "Part of the journey, not the destination.",
    ],
  },

  abbey_railway_ruins: {
    kid: [
      "Trains used to run through here a long time ago.",
      "Carrying people and goods past the Abbey.",
      "Now only parts remain… but they still show what it was like.",
      "This place used to be busy.",
    ],
    teen: [
      "This is what’s left of movement from another time.",
      "Tracks, routes, connections — all once active.",
      "Now it’s quiet… but not forgotten.",
      "You’re standing where things used to move.",
    ],
    adult: [
      "Remnants of a former transport link.",
      "Rail infrastructure once connected this area to wider networks.",
      "What remains is structural evidence of that system.",
      "Movement, now reduced to trace.",
    ],
  },

  amphitheatre_steps: {
    kid: [
      "These steps lead you up and down like a stage.",
      "You can climb, stand, and look out from here.",
      "It feels like part of something bigger.",
      "Try moving through it.",
    ],
    teen: [
      "These steps shape how you move through the space.",
      "Up, down, positioning — it’s all controlled.",
      "They’re not random… they guide you.",
      "Use them.",
    ],
    adult: [
      "A structural element of the amphitheatre space.",
      "They define movement, position, and perspective.",
      "Design directs behaviour here.",
      "Form shaping experience.",
    ],
  },

  abbey_road_baptist_church: {
    kid: [
      "This is a place where people come together quietly.",
      "They gather, listen, and share moments.",
      "It’s calm and peaceful inside.",
      "A place for reflection.",
    ],
    teen: [
      "This is a different kind of space.",
      "Less noise, more focus.",
      "People come here for meaning, not movement.",
      "That changes everything.",
    ],
    adult: [
      "A place of worship and gathering.",
      "Structured, intentional, and reflective.",
      "It offers contrast to the pace of surrounding areas.",
      "Stillness within activity.",
    ],
  },

  nan_tait_centre: {
    kid: [
      "This is a place for art and creativity.",
      "People come here to make things and express ideas.",
      "Paintings, drawings, and more.",
      "It’s full of imagination.",
    ],
    teen: [
      "This is creative space.",
      "Ideas turned into something real.",
      "Art, expression, individuality — all happening here.",
      "Different kind of energy.",
    ],
    adult: [
      "A local centre for artistic expression.",
      "Creative work, exhibitions, and community involvement.",
      "It supports culture beyond function.",
      "Expression over utility.",
    ],
  },

  barrow_fire_station: {
    kid: [
      "This is where firefighters are ready to go.",
      "When something goes wrong, they move fast.",
      "Helping people and keeping things safe.",
      "This place is always prepared.",
    ],
    teen: [
      "This is response under pressure.",
      "Fast decisions, real consequences.",
      "When something happens, this is where action starts.",
      "No hesitation here.",
    ],
    adult: [
      "An emergency response facility.",
      "Preparedness, coordination, and rapid deployment define it.",
      "Critical in moments of risk.",
      "Service in its most direct form.",
    ],
  },

  submarine_memorial: {
    kid: [
      "This place remembers people who served at sea.",
      "Submarines, deep water, and dangerous journeys.",
      "Not everyone came back.",
      "This place helps us remember them.",
    ],
    teen: [
      "This is memory with weight.",
      "Service, risk, and loss — all connected here.",
      "Submarines operate unseen… but not without cost.",
      "Take this one in.",
    ],
    adult: [
      "A memorial to those who served in submarine operations.",
      "Hidden environments, high risk, and sacrifice.",
      "It honours lives connected to unseen service.",
      "Quiet, but significant.",
    ],
  },

  victoria_hall: {
    kid: [
      "This is a place for shows and events.",
      "People gather here to watch and enjoy performances.",
      "Lights, sound, and excitement.",
      "It brings people together.",
    ],
    teen: [
      "Another performance space — but with its own feel.",
      "Crowds, events, shared moments.",
      "These places build atmosphere.",
      "And people remember that.",
    ],
    adult: [
      "A civic venue for events and performance.",
      "It supports cultural and social gatherings.",
      "Structured space for shared experience.",
      "Community through activity.",
    ],
  },

  barrow_golf_club: {
    kid: [
      "This is where people play golf.",
      "Big open space, careful shots, and practice.",
      "It takes focus and patience.",
      "Not an easy game!",
    ],
    teen: [
      "This is control over power.",
      "Precision matters more than force.",
      "Wide space, but small targets.",
      "Different kind of challenge.",
    ],
    adult: [
      "A structured sporting environment.",
      "Precision, discipline, and consistency define play here.",
      "It reflects a measured approach to competition.",
      "Controlled, deliberate activity.",
    ],
  },

  hawcoat_quarry: {
    kid: [
      "This place was used to dig out stone from the ground.",
      "Big machines and hard work shaped this area.",
      "It might look quiet now… but it wasn’t before.",
      "This place was built by effort.",
    ],
    teen: [
      "This is extraction.",
      "Taking from the ground, shaping the land itself.",
      "What you see now is after the work.",
      "But the impact stays.",
    ],
    adult: [
      "A site of material extraction.",
      "The landscape here has been altered by sustained industrial activity.",
      "It reflects resource demand and physical labour.",
      "The ground itself tells the story.",
    ],
  },

  st_pauls_church: {
    kid: [
      "This is a place where people come to be calm and quiet.",
      "They gather, think, and share moments together.",
      "It feels peaceful here.",
      "A place to slow down.",
    ],
    teen: [
      "This is a pause in everything else.",
      "Less noise, more focus.",
      "People come here for meaning, not movement.",
      "That changes the space.",
    ],
    adult: [
      "A place of worship and reflection.",
      "Structured, calm, and intentional.",
      "It offers contrast to the surrounding pace of life.",
      "Stillness has purpose here.",
    ],
  },

  strawberry_pub: {
    kid: [
      "This is where people come to relax and talk.",
      "Friends meet here and spend time together.",
      "Stories, laughter, and everyday life.",
      "It’s part of the community.",
    ],
    teen: [
      "This is another social space.",
      "Conversations that don’t happen anywhere else.",
      "People come, stay, and move on.",
      "But something always gets shared.",
    ],
    adult: [
      "A local social venue.",
      "Informal interaction and shared time define it.",
      "These places hold everyday stories.",
      "Unrecorded, but meaningful.",
    ],
  },

  red_river_waterfall: {
    kid: [
      "Listen… you can hear the water before you see it.",
      "Flowing, falling, always moving.",
      "This place feels alive.",
      "Stand close and feel it.",
    ],
    teen: [
      "Movement you can hear and feel.",
      "Water cutting through everything around it.",
      "Constant, powerful, never stopping.",
      "This is natural energy.",
    ],
    adult: [
      "A natural point of flow and force.",
      "Water shaping the landscape over time.",
      "Sound, motion, and continuity define it.",
      "A reminder of constant change.",
    ],
  },

  furness_general_main_entrance: {
    kid: [
      "This is where people come into the hospital.",
      "Doctors, nurses, and patients all pass through here.",
      "It’s a busy place with important work happening.",
      "This is where care begins.",
    ],
    teen: [
      "This is the entry point to something serious.",
      "Movement, urgency, responsibility.",
      "People arrive here needing help.",
      "And everything starts from this point.",
    ],
    adult: [
      "The primary access point to a major healthcare facility.",
      "Flow of patients, staff, and emergency response.",
      "It marks the beginning of care pathways.",
      "Structured, critical movement.",
    ],
  },

  roose_station_platform: {
    kid: [
      "This is where trains stop and people get on and off.",
      "They travel to new places from here.",
      "Every train leads somewhere different.",
      "Journeys start right here.",
    ],
    teen: [
      "This is movement on a schedule.",
      "Arrivals, departures — constant flow.",
      "People passing through, heading somewhere else.",
      "This is transition in motion.",
    ],
    adult: [
      "A local rail access point.",
      "Structured transport, timed movement, and connection.",
      "It links this area to wider networks.",
      "Part of a larger system.",
    ],
  },

  ship_inn_piel: {
    kid: [
      "This is a pub on an island!",
      "People come here after travelling across the water.",
      "Food, drinks, and a place to rest.",
      "It feels like part of the adventure.",
    ],
    teen: [
      "You don’t just end up here — you come here.",
      "That makes it different.",
      "Travel, arrival, then pause.",
      "It’s part of the whole experience.",
    ],
    adult: [
      "A destination venue within an isolated setting.",
      "Access requires intent, which shapes its identity.",
      "It supports arrival, rest, and social interaction.",
      "Part of a contained environment.",
    ],
  },

  lifeboat_monument: {
    kid: [
      "This monument remembers brave people who helped others at sea.",
      "When danger came, they went out to help.",
      "Not everyone made it back.",
      "This place helps us remember them.",
    ],
    teen: [
      "This is memory tied to action.",
      "Real risk, real bravery, real loss.",
      "The sea doesn’t forgive mistakes.",
      "And this stands for those who faced it.",
    ],
    adult: [
      "A memorial to maritime rescue efforts and sacrifice.",
      "Lives risked in response to danger at sea.",
      "It represents courage under extreme conditions.",
      "Respect, held in place.",
    ],
  },

  newby_terrace_play_area: {
    kid: [
      "This is a place to play, climb, and have fun.",
      "Run around, explore, and enjoy it.",
      "It’s built for energy and movement.",
      "Go for it.",
    ],
    teen: [
      "Simple space, full of movement.",
      "No pressure — just use it.",
      "Jump in, mess around, keep moving.",
      "That’s what it’s for.",
    ],
    adult: [
      "A local recreational space.",
      "Designed for activity, interaction, and movement.",
      "It supports everyday use within the community.",
      "Functional and accessible.",
    ],
  },

  bae_the_bridge: {
    kid: [
      "This is part of where huge ships are built.",
      "Big structures, big machines, and big work.",
      "Things made here go out into the world.",
      "It’s a powerful place.",
    ],
    teen: [
      "This connects different parts of a massive operation.",
      "Movement, structure, coordination — all happening here.",
      "This isn’t small work.",
      "It’s on a different level.",
    ],
    adult: [
      "An internal link within a major industrial complex.",
      "Infrastructure supporting large-scale shipbuilding operations.",
      "Precision, coordination, and scale define this space.",
      "Integrated, high-level industry.",
    ],
  },

  gas_terminals_main_gates: {
    kid: [
      "This is where energy comes from.",
      "Gas is stored and controlled here.",
      "Big systems, big responsibility.",
      "This place powers things.",
    ],
    teen: [
      "This is controlled power.",
      "Energy moving through systems you don’t see.",
      "Everything here is monitored, precise, and important.",
      "This isn’t small scale.",
    ],
    adult: [
      "A controlled industrial energy site.",
      "Storage, regulation, and distribution of gas.",
      "High-risk, high-importance infrastructure.",
      "Precision and safety define it.",
    ],
  },

  kimberly_clark_factory: {
    kid: [
      "This is a place where things are made.",
      "Machines working, products being created.",
      "People here help make everyday items.",
      "It’s part of how things get to you.",
    ],
    teen: [
      "Production at scale.",
      "Machines, systems, output — constant operation.",
      "This is where everyday products begin.",
      "You just don’t see it happen.",
    ],
    adult: [
      "A large-scale manufacturing facility.",
      "Industrial production processes operating continuously.",
      "It represents modern industry within the town.",
      "Output-driven, structured operation.",
    ],
  },

  spiral_ramp_town_centre: {
    kid: [
      "Look at this… it twists all the way around!",
      "You can walk or move up and down it.",
      "It’s fun, but also useful.",
      "Try following it.",
    ],
    teen: [
      "This is movement with design.",
      "Not straight, not direct — but intentional.",
      "It changes how you move through space.",
      "And that’s the point.",
    ],
    adult: [
      "A designed circulation structure.",
      "Movement guided through form rather than direct path.",
      "It alters pace and direction intentionally.",
      "Functional, but considered.",
    ],
  },

  barrow_park_greenhouse: {
    kid: [
      "This place is full of plants and life.",
      "Things grow here in a warm, safe space.",
      "Flowers, greenery, and nature all around.",
      "It feels calm.",
    ],
    teen: [
      "Controlled nature.",
      "Growth, but managed and contained.",
      "It’s different from wild spaces.",
      "But still alive.",
    ],
    adult: [
      "A cultivated plant environment.",
      "Growth supported through controlled conditions.",
      "It reflects managed interaction with nature.",
      "Structured, but organic.",
    ],
  },

  park_fitness_trail_start: {
    kid: [
      "This is where you start moving!",
      "Running, jumping, and using your energy.",
      "Follow the trail and see what you can do.",
      "Let’s go.",
    ],
    teen: [
      "This is movement, no excuses.",
      "Start here, keep going, push yourself.",
      "It’s built for action.",
      "Use it.",
    ],
    adult: [
      "An entry point to structured physical activity.",
      "Movement, effort, and progression begin here.",
      "Designed to encourage engagement with the environment.",
      "Active by intent.",
    ],
  },

  park_rockery: {
    kid: [
      "Look at all these rocks!",
      "Different shapes, sizes, and patterns.",
      "Nature builds things like this over time.",
      "See what you can find.",
    ],
    teen: [
      "This is nature shaped into something you can explore.",
      "Not random — arranged, but still natural.",
      "Slow it down here for a second.",
      "Look properly.",
    ],
    adult: [
      "A landscaped natural feature.",
      "Stone, elevation, and plant integration.",
      "Designed to reflect natural formation.",
      "Subtle but intentional.",
    ],
  },

  park_rose_garden: {
    kid: [
      "Look at all the flowers!",
      "Different colours, different smells.",
      "This place is full of life.",
      "Take a moment and enjoy it.",
    ],
    teen: [
      "This is calm space.",
      "Colour, detail, and stillness.",
      "You don’t rush through here.",
      "You take it in.",
    ],
    adult: [
      "A cultivated floral environment.",
      "Designed for visual impact and calm engagement.",
      "Maintenance and care sustain it.",
      "A controlled natural space.",
    ],
  },

  greenway_path_barrow_island: {
    kid: [
      "This is a path you can follow through nature.",
      "Walk along and see what you notice.",
      "Things change as you move.",
      "Keep going.",
    ],
    teen: [
      "This is a route — simple, but important.",
      "It connects places without noise.",
      "Movement without distraction.",
      "Just keep moving.",
    ],
    adult: [
      "A connecting pathway through a quieter zone.",
      "Designed for movement and access.",
      "Functional, but offers environmental contrast.",
      "Transitional space.",
    ],
  },

  barrow_island_primary: {
    kid: [
      "This is a school where kids learn and grow.",
      "People come here every day to learn new things.",
      "It’s part of growing up.",
      "Everyone starts somewhere.",
    ],
    teen: [
      "This is where it begins for a lot of people.",
      "Early years, first lessons, first structure.",
      "Everyone passes through places like this.",
      "It sets the foundation.",
    ],
    adult: [
      "A primary education facility.",
      "Supports early-stage development and learning.",
      "Core part of community structure.",
      "Foundational environment.",
    ],
  },

  old_brickworks: {
    kid: [
      "This place used to make bricks.",
      "Bricks help build houses and buildings.",
      "A long time ago, this would have been busy.",
      "Now it’s part of history.",
    ],
    teen: [
      "This is old industry.",
      "Work that built the town piece by piece.",
      "It might be quiet now…",
      "But it wasn’t always.",
    ],
    adult: [
      "A former industrial production site.",
      "Brick manufacturing supported construction and expansion.",
      "Represents early-stage industrial growth.",
      "Now part of the town’s past.",
    ],
  },

  cavendish_dock_water_gate: {
    kid: [
      "This is where water moves in and out of the docks.",
      "Big ships need places like this.",
      "It helps control the water.",
      "That’s how everything works properly.",
    ],
    teen: [
      "This is control.",
      "Water doesn’t just sit — it’s managed.",
      "Levels, flow, timing — all important.",
      "Without this, things don’t work.",
    ],
    adult: [
      "A controlled dock water system.",
      "Regulates flow, levels, and access for vessels.",
      "Critical to dock functionality and safety.",
      "Infrastructure behind the scenes.",
    ],
  },

  bowling_alley_hollywood_park: {
    kid: [
      "This is where you roll a ball and knock the pins down!",
      "Try to hit them all in one go.",
      "It’s fun, loud, and exciting.",
      "Give it a go.",
    ],
    teen: [
      "Simple game — but it’s all about control.",
      "Aim, release, follow through.",
      "Looks easy… until you try it properly.",
      "Then it gets interesting.",
    ],
    adult: [
      "A recreational leisure facility.",
      "Skill-based, repeatable gameplay.",
      "Social and competitive environment.",
      "Designed for engagement.",
    ],
  },

  skate_park_core: {
    kid: [
      "This is where you can ride, jump, and do tricks!",
      "Skateboards, scooters, bikes — all welcome.",
      "Try something new.",
      "Have fun with it.",
    ],
    teen: [
      "This is movement and skill.",
      "Balance, control, confidence.",
      "You either commit — or you fall.",
      "That’s the game.",
    ],
    adult: [
      "A purpose-built recreational movement space.",
      "Supports skill development and physical challenge.",
      "Dynamic, user-driven activity.",
      "Energy and progression.",
    ],
  },

  dock_museum_submarine: {
    kid: [
      "This is a real submarine!",
      "It used to go underwater.",
      "People worked and travelled inside it.",
      "It’s like a hidden world beneath the sea.",
    ],
    teen: [
      "This isn’t just a display — it’s real history.",
      "Tight space, high pressure, serious work.",
      "Life underwater isn’t easy.",
      "This shows what it took.",
    ],
    adult: [
      "A preserved submarine representing naval engineering.",
      "Confined operational space under extreme conditions.",
      "Reflects the reality of underwater service.",
      "Technical and historical significance.",
    ],
  },

  barrow_cricket_club: {
    kid: [
      "This is where people play cricket!",
      "Hitting the ball, running, and scoring points.",
      "It’s a fun team game.",
      "Lots of action.",
    ],
    teen: [
      "This is patience and timing.",
      "Not fast — but precise.",
      "Every move matters.",
      "It’s a different kind of game.",
    ],
    adult: [
      "A structured sports venue.",
      "Cricket requires strategy, timing, and discipline.",
      "Long-form gameplay with tactical depth.",
      "A traditional sporting environment.",
    ],
  },

  twelve_laws_stone: {
    kid: [
      "This is a place about ideas.",
      "Big ideas about how things work.",
      "How you think… how you act…",
      "It all matters.",
    ],
    teen: [
      "This is mindset.",
      "The way you see things shapes what happens.",
      "Energy, actions, choices — all connected.",
      "Think about it.",
    ],
    adult: [
      "A symbolic reference point.",
      "Represents belief systems around thought, action, and outcome.",
      "Interpretation is individual.",
      "Meaning comes from perspective.",
    ],
  },

  spirit_of_barrow_mural: {
    kid: [
      "Look at this artwork!",
      "It shows the spirit of the town.",
      "People, history, and life all in one place.",
      "There’s a lot to see.",
    ],
    teen: [
      "This is identity on a wall.",
      "Everything about the town — expressed visually.",
      "Stories, people, culture.",
      "It’s all here.",
    ],
    adult: [
      "A visual representation of local identity.",
      "Combines history, culture, and community themes.",
      "Public art used to communicate collective meaning.",
      "Interpretive and symbolic.",
    ],
  },

  final_boss_gate_marsh_st: {
    kid: [
      "You made it here.",
      "This is the final point.",
      "Everything you’ve done has led to this.",
      "Get ready.",
    ],
    teen: [
      "This is it.",
      "End of the route — or the start of something bigger.",
      "Everything you’ve seen, everything you’ve done…",
      "Now it comes together.",
    ],
    adult: [
      "The final progression point.",
      "Represents completion of the journey.",
      "All prior movement, learning, and interaction lead here.",
      "A defined endpoint — or transition.",
    ],
  },

  wicks: {
    kid: [
      "This is part of your world.",
      "A place you recognise.",
      "Not everything has to be big to matter.",
      "It’s part of your journey.",
    ],
    teen: [
      "Local spot.",
      "Familiar ground.",
      "Every journey includes places like this.",
      "It all counts.",
    ],
    adult: [
      "A personal or local reference point.",
      "Significance comes from familiarity and use.",
      "Not all value is historical or large-scale.",
      "Context defines importance.",
    ],
  },

  brew_room: {
    kid: [
      "This is another place in your world.",
      "Somewhere part of everyday life.",
      "Every place has a role.",
      "Even small ones.",
    ],
    teen: [
      "Another stop, another piece of the map.",
      "It’s not about size — it’s about connection.",
      "Everything links together.",
      "You’re building the full picture.",
    ],
    adult: [
      "A localised environment with contextual relevance.",
      "Importance defined by use and familiarity.",
      "Part of a broader mapped experience.",
      "Small-scale, but integrated.",
    ],
  },

  reception: {
    kid: [
      "This is where people arrive and get started.",
      "It’s the first step into something new.",
      "Everyone passes through here at some point.",
      "It’s where things begin.",
    ],
    teen: [
      "This is entry point energy.",
      "You check in, you step forward, you move on.",
      "Not the destination — but important.",
      "Every journey starts somewhere.",
    ],
    adult: [
      "A point of entry and interaction.",
      "Used for orientation, access, and first contact.",
      "Transitional, but necessary.",
      "Start of process.",
    ],
  },

  bitches_house: {
    kid: [
      "This is a place you know.",
      "Somewhere familiar.",
      "Places like this are part of your world.",
      "They matter in their own way.",
    ],
    teen: [
      "Local spot.",
      "Real life, not just the route.",
      "Every map has places that mean something to you.",
      "This is one of them.",
    ],
    adult: [
      "A personal location within the mapped environment.",
      "Significance comes from lived experience.",
      "Not historical — but meaningful in context.",
      "Part of your journey.",
    ],
  },

  dads_house: {
    kid: [
      "This is a home.",
      "A place where people live and spend time together.",
      "Homes are important.",
      "They’re part of your story.",
    ],
    teen: [
      "This is personal ground.",
      "Not part of the route… but still part of everything.",
      "Where you come from matters.",
      "It always does.",
    ],
    adult: [
      "A personal residential location.",
      "Defined by relationship and experience rather than function.",
      "Adds depth beyond the mapped system.",
      "Contextual importance.",
    ],
  },

  tinas_house: {
    kid: [
      "Another place that’s part of your world.",
      "Familiar, known, and important to you.",
      "Every place like this has meaning.",
      "Even if others don’t see it.",
    ],
    teen: [
      "This is your map, not just the game’s.",
      "Real places, real connections.",
      "That’s what makes it different.",
      "It’s yours.",
    ],
    adult: [
      "A personal reference point.",
      "Meaning derived from familiarity and connection.",
      "Not public significance — private value.",
      "Completes the personal layer.",
    ],
  },
};

export function getPinStartIntro(input = {}) {
  const pinId = input.pinId || input.pin?.id || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier)
    ? input.tier
    : "kid";

  if (
    PIN_START_INTROS &&
    PIN_START_INTROS[pinId] &&
    PIN_START_INTROS[pinId][tier]
  ) {
    return PIN_START_INTROS[pinId][tier];
  }

  return [
    "You’ve reached a new point on the map.",
    "Take a look around before you move on.",
  ];
}
