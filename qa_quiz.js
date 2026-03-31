/* =========================================================
   qa_quiz.js
   BARROW QUEST QUIZ BANK
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
   MASTER QUIZ BANK
   1–100 = KIDS
   101–200 = TEENS
   201–300 = ADULTS
========================================================= */

export const MASTER_QUIZ_BANK = {
  kid: [
    mq(
      "001",
      1,
      ["general", "space"],
      "Which planet is known as the Red Planet?",
      ["Venus", "Mars", "Jupiter", "Saturn"],
      1,
      "Mars looks red because of iron oxide on its surface."
    ),
    mq(
      "002",
      2,
      ["barrow", "industry"],
      "What is Barrow famous for building?",
      ["Submarines", "Castles", "Aeroplanes", "Race tracks"],
      0,
      "Barrow is strongly associated with submarine building."
    ),
    mq(
      "003",
      3,
      ["uk", "geography"],
      "Barrow is in which country?",
      ["England", "Germany", "Spain", "Italy"],
      0,
      "Barrow-in-Furness is in England."
    ),
    mq(
      "004",
      4,
      ["uk", "capital"],
      "What is the capital city of England?",
      ["London", "Leeds", "York", "Bristol"],
      0,
      "London is the capital of England."
    ),
    mq(
      "005",
      5,
      ["barrow", "coast"],
      "What natural feature is Barrow right beside?",
      ["The sea", "A desert", "A jungle", "A volcano"],
      0,
      "Barrow is a coastal town."
    ),
    mq(
      "006",
      6,
      ["logic", "place"],
      "Which one would NOT make sense to see in Barrow?",
      ["Ships", "The sea", "Houses", "Pyramids"],
      3,
      "Barrow has ships, houses, and the sea — not pyramids."
    ),
    mq(
      "007",
      7,
      ["barrow", "industry"],
      "Why is Barrow a good place for shipbuilding?",
      [
        "Because it is near the sea",
        "Because it is hot",
        "Because it is quiet",
        "Because it is tiny",
      ],
      0,
      "Sea access makes shipbuilding practical."
    ),
    mq(
      "008",
      8,
      ["space"],
      "Which planet is the biggest in our solar system?",
      ["Earth", "Mars", "Jupiter", "Venus"],
      2,
      "Jupiter is the largest planet in our solar system."
    ),
    mq(
      "009",
      9,
      ["animals", "world"],
      "Which animal causes the most human deaths each year?",
      ["Shark", "Lion", "Mosquito", "Snake"],
      2,
      "Mosquitoes are deadliest because they spread disease."
    ),
    mq(
      "010",
      10,
      ["animals"],
      "Which animal has three hearts?",
      ["Octopus", "Shark", "Dolphin", "Whale"],
      0,
      "An octopus has three hearts."
    ),
    mq(
      "011",
      11,
      ["science", "physics"],
      "If you dropped a hammer and a feather where there was no air, what would happen?",
      [
        "The feather falls slower",
        "The hammer falls faster",
        "They fall at the same speed",
        "It depends on colour",
      ],
      2,
      "Without air resistance, they fall the same."
    ),
    mq(
      "012",
      12,
      ["body"],
      "What is the largest organ in the human body?",
      ["Brain", "Liver", "Skin", "Heart"],
      2,
      "Skin is the body’s largest organ."
    ),
    mq(
      "013",
      13,
      ["world", "time"],
      "Which country has the most time zones?",
      ["USA", "Russia", "France", "China"],
      2,
      "France has the most time zones because of its overseas territories."
    ),
    mq(
      "014",
      14,
      ["science", "chemistry"],
      "What is the most common element in the universe?",
      ["Oxygen", "Hydrogen", "Carbon", "Iron"],
      1,
      "Hydrogen is the most abundant element in the universe."
    ),
    mq(
      "015",
      15,
      ["space"],
      "Which planet spins the opposite way to most planets?",
      ["Mars", "Venus", "Jupiter", "Saturn"],
      1,
      "Venus rotates in the opposite direction to most planets."
    ),
    mq(
      "016",
      16,
      ["world", "animals"],
      "Which continent has no native ants?",
      ["Africa", "Antarctica", "Australia", "Europe"],
      1,
      "Antarctica is too cold for native ants."
    ),
    mq(
      "017",
      17,
      ["animals"],
      "Which animal has its heart in its head region?",
      ["Octopus", "Shrimp", "Crab", "Jellyfish"],
      1,
      "A shrimp’s heart is located in its head region."
    ),
    mq(
      "018",
      18,
      ["technology", "ai"],
      "What does AI stand for?",
      [
        "Artificial Intelligence",
        "Automatic Internet",
        "Advanced Input",
        "Active Interface",
      ],
      0,
      "AI stands for Artificial Intelligence."
    ),
    mq(
      "019",
      19,
      ["maths"],
      "Which is bigger?",
      ["0.5", "1/2", "They are the same", "It depends"],
      2,
      "0.5 and 1/2 are exactly the same value."
    ),
    mq(
      "020",
      20,
      ["language"],
      "Which word is spelled correctly?",
      ["Definately", "Definitely", "Defanitely", "Definetly"],
      1,
      "Definitely is the correct spelling."
    ),
    mq(
      "021",
      21,
      ["science", "light"],
      "Which travels faster?",
      ["Sound", "Light", "Wind", "A car"],
      1,
      "Light travels much faster than sound."
    ),
    mq(
      "022",
      22,
      ["body"],
      "Which of these is not a bone?",
      ["Skull", "Rib", "Muscle", "Spine"],
      2,
      "A muscle is not a bone."
    ),
    mq(
      "023",
      23,
      ["barrow", "weather"],
      "Why does Barrow often feel windy?",
      [
        "It is near the coast",
        "It is very hot",
        "It is underground",
        "It has no roads",
      ],
      0,
      "Coastal exposure often makes places windier."
    ),
    mq(
      "024",
      24,
      ["animals"],
      "Which of these can live the longest?",
      ["Dog", "Elephant", "Tortoise", "Cat"],
      2,
      "Some tortoises can live for well over 100 years."
    ),
    mq(
      "025",
      25,
      ["science", "states"],
      "Which of these is NOT a liquid?",
      ["Water", "Oil", "Ice", "Milk"],
      2,
      "Ice is solid water."
    ),
    mq(
      "026",
      26,
      ["science", "heat"],
      "Which would melt fastest?",
      [
        "Ice in the sun",
        "Ice in the fridge",
        "Ice in the freezer",
        "Ice in the shade",
      ],
      0,
      "Heat speeds up melting."
    ),
    mq(
      "027",
      27,
      ["world", "oceans"],
      "Which is the largest ocean?",
      ["Atlantic", "Indian", "Pacific", "Arctic"],
      2,
      "The Pacific is the largest ocean on Earth."
    ),
    mq(
      "028",
      28,
      ["animals", "biology"],
      "Which of these is a mammal?",
      ["Shark", "Dolphin", "Tuna", "Octopus"],
      1,
      "Dolphins are mammals, not fish."
    ),
    mq(
      "029",
      29,
      ["science", "floating"],
      "Which of these would usually float?",
      ["Rock", "Coin", "Wood", "Metal bar"],
      2,
      "Wood often floats because it is less dense than water."
    ),
    mq(
      "030",
      30,
      ["barrow", "sea"],
      "Why has the sea been important to Barrow?",
      ["Fishing and ships", "Warmer weather", "Bigger roads", "Less rain"],
      0,
      "Sea access helped Barrow grow through ships and industry."
    ),
    mq(
      "031",
      31,
      ["water"],
      "Which contains the most water?",
      ["A cup", "A lake", "The ocean", "A bottle"],
      2,
      "The oceans contain most of Earth’s water."
    ),
    mq(
      "032",
      32,
      ["science", "boiling"],
      "What happens when water boils?",
      ["It freezes", "It turns into gas", "It disappears", "It gets heavier"],
      1,
      "Boiling turns liquid water into gas."
    ),
    mq(
      "033",
      33,
      ["space"],
      "Which object is closest to Earth?",
      ["The Moon", "The Sun", "Mars", "Jupiter"],
      0,
      "The Moon is Earth’s closest celestial neighbour."
    ),
    mq(
      "034",
      34,
      ["navigation"],
      "Which tool helps you find direction?",
      ["Compass", "Clock", "Calculator", "Thermometer"],
      0,
      "A compass helps you navigate by direction."
    ),
    mq(
      "035",
      35,
      ["animals"],
      "Which animal breathes through gills?",
      ["Dog", "Fish", "Bird", "Horse"],
      1,
      "Fish use gills to breathe underwater."
    ),
    mq(
      "036",
      36,
      ["heat"],
      "Which of these is hottest?",
      ["Ice", "Fire", "Water", "Wind"],
      1,
      "Fire is hotter than the others listed."
    ),
    mq(
      "037",
      37,
      ["barrow", "docks"],
      "Why does Barrow have docks?",
      ["For ships", "For cars", "For farms", "For houses"],
      0,
      "Barrow’s docks were built for shipping and industry."
    ),
    mq(
      "038",
      38,
      ["body", "energy"],
      "Which gives your body energy?",
      ["Food", "Air", "Water", "Light"],
      0,
      "Food provides the body with energy."
    ),
    mq(
      "039",
      39,
      ["space"],
      "Which of these is not now classed as a full planet?",
      ["Mars", "Venus", "Pluto", "Earth"],
      2,
      "Pluto is classed as a dwarf planet."
    ),
    mq(
      "040",
      40,
      ["materials"],
      "Which is the hardest natural material?",
      ["Wood", "Steel", "Diamond", "Glass"],
      2,
      "Diamond is the hardest naturally occurring material."
    ),
    mq(
      "041",
      41,
      ["animals"],
      "Which animal is cold-blooded?",
      ["Dog", "Snake", "Bird", "Horse"],
      1,
      "Snakes are cold-blooded."
    ),
    mq(
      "042",
      42,
      ["science", "floating"],
      "Which of these would sink in water?",
      ["Plastic bottle", "Wooden stick", "Metal spoon", "Sponge"],
      2,
      "A metal spoon sinks because it is denser than water."
    ),
    mq(
      "043",
      43,
      ["plants"],
      "What do plants need to make food?",
      ["Sunlight", "Darkness", "Wind", "Noise"],
      0,
      "Plants use sunlight during photosynthesis."
    ),
    mq(
      "044",
      44,
      ["body", "cooling"],
      "Which of these helps cool your body?",
      [
        "Sitting still",
        "Drinking water",
        "Closing your eyes",
        "Standing still",
      ],
      1,
      "Hydration helps your body regulate temperature."
    ),
    mq(
      "045",
      45,
      ["body", "behaviour"],
      "Which is a common sign of nervousness?",
      ["Sweaty hands", "Sleeping", "Eating slowly", "Stretching"],
      0,
      "Nervousness often causes sweaty hands."
    ),
    mq(
      "046",
      46,
      ["money", "modern"],
      "Which of these usually costs the most?",
      ["A sandwich", "A phone", "A pen", "A bottle of water"],
      1,
      "Phones usually cost much more than the other options."
    ),
    mq(
      "047",
      47,
      ["time", "behaviour"],
      "When does time often feel slow?",
      [
        "When you are bored",
        "When you are having fun",
        "When you are asleep",
        "When you are laughing",
      ],
      0,
      "Boredom often makes time feel slower."
    ),
    mq(
      "048",
      48,
      ["safety"],
      "What should you do first if something is too hot to touch?",
      ["Grab it", "Blow on it", "Ignore it", "Throw it"],
      1,
      "Blowing can help cool a hot surface slightly."
    ),
    mq(
      "049",
      49,
      ["social"],
      "Which of these is polite?",
      ["Interrupting", "Saying thank you", "Shouting", "Ignoring people"],
      1,
      "Saying thank you is polite."
    ),
    mq(
      "050",
      50,
      ["weight", "objects"],
      "Which of these would be hardest to carry for a long time?",
      ["A backpack", "A heavy suitcase", "A book", "A phone"],
      1,
      "Heavier objects take more effort to carry."
    ),
    mq(
      "051",
      51,
      ["animals"],
      "Which animal is known for poor eyesight?",
      ["Eagle", "Mole", "Cat", "Hawk"],
      1,
      "Moles rely more on touch and smell than vision."
    ),
    mq(
      "052",
      52,
      ["animals"],
      "Which of these has no bones?",
      ["Spider", "Jellyfish", "Fish", "Bird"],
      1,
      "Jellyfish do not have bones."
    ),
    mq(
      "053",
      53,
      ["vision"],
      "What helps you see better in the dark?",
      [
        "Turning lights off quickly",
        "Letting your eyes adjust",
        "Looking at your phone",
        "Closing one eye",
      ],
      1,
      "Your eyes need time to adjust to darkness."
    ),
    mq(
      "054",
      54,
      ["logic", "weight"],
      "Which is heavier?",
      ["1kg of feathers", "1kg of metal", "They weigh the same", "It depends"],
      2,
      "A kilogram is a kilogram whatever it is made of."
    ),
    mq(
      "055",
      55,
      ["survival", "body"],
      "Which helps you stay warm best?",
      [
        "Wet clothes",
        "Layered clothing",
        "Drinking cold water",
        "Standing still",
      ],
      1,
      "Layers trap warm air and help keep heat in."
    ),
    mq(
      "056",
      56,
      ["modern", "technology"],
      "Which of these stops working without electricity?",
      ["A book", "A phone", "A chair", "A shoe"],
      1,
      "A phone depends on electrical power."
    ),
    mq(
      "057",
      57,
      ["endurance", "humans"],
      "Which is actually very good over long distances?",
      ["Cheetah", "Horse", "Human", "Dog"],
      2,
      "Humans are surprisingly strong endurance runners."
    ),
    mq(
      "058",
      58,
      ["body", "cooling"],
      "What cools your body most naturally?",
      ["Sitting still", "Sweating", "Sleeping", "Blinking"],
      1,
      "Sweating cools the body as it evaporates."
    ),
    mq(
      "059",
      59,
      ["food", "health"],
      "Which of these can contain a lot of sugar?",
      ["Fruit juice", "Water", "Milk", "Bread"],
      0,
      "Fruit juice can contain a surprising amount of sugar."
    ),
    mq(
      "060",
      60,
      ["biology", "life"],
      "Which of these is not fully considered alive?",
      ["Tree", "Mushroom", "Virus", "Bacteria"],
      2,
      "Viruses cannot reproduce on their own."
    ),
    mq(
      "061",
      61,
      ["survival", "cold"],
      "Which makes you lose heat fastest?",
      ["Dry cold", "Wet cold", "Warm air", "A hat"],
      1,
      "Water removes body heat faster than dry air."
    ),
    mq(
      "062",
      62,
      ["visibility", "night"],
      "Which is hardest to see at night?",
      ["White shirt", "Yellow jacket", "Black clothing", "Reflective strip"],
      2,
      "Dark clothing is hardest to see at night."
    ),
    mq(
      "063",
      63,
      ["clothing", "survival"],
      "Which keeps you warmest?",
      [
        "One thick jacket",
        "Several thin layers",
        "Wet clothes",
        "Tight clothing",
      ],
      1,
      "Several layers trap more warm air."
    ),
    mq(
      "064",
      64,
      ["survival", "body"],
      "Which becomes critical first for survival?",
      ["Oxygen", "Water", "Food", "Sleep"],
      0,
      "You can only survive a few minutes without oxygen."
    ),
    mq(
      "065",
      65,
      ["science", "heat"],
      "Which keeps heat for longer?",
      ["Metal", "Water", "Air", "Paper"],
      1,
      "Water has a high heat capacity."
    ),
    mq(
      "066",
      66,
      ["sound"],
      "Which sound is hardest to hear?",
      ["Loud music", "Whisper", "Shouting", "Siren"],
      1,
      "A whisper has the lowest loudness."
    ),
    mq(
      "067",
      67,
      ["science", "evaporation"],
      "Which would dry fastest?",
      [
        "Water in the sun",
        "Water in the shade",
        "Water in a fridge",
        "Water indoors",
      ],
      0,
      "Warmth speeds up evaporation."
    ),
    mq(
      "068",
      68,
      ["weather", "body"],
      "Which makes you feel colder fastest?",
      ["Wind", "Still air", "Warm clothes", "Standing still"],
      0,
      "Wind chill strips heat away quickly."
    ),
    mq(
      "069",
      69,
      ["survival", "physics"],
      "Which causes the fastest heat loss?",
      ["Dry cold air", "Wet skin in wind", "Warm air", "Still air"],
      1,
      "Wet skin plus wind causes very rapid heat loss."
    ),
    mq(
      "070",
      70,
      ["survival", "body"],
      "What becomes critical fastest in your body?",
      ["Oxygen", "Water", "Fat", "Muscle"],
      0,
      "Oxygen deprivation becomes dangerous extremely quickly."
    ),
    mq(
      "071",
      71,
      ["science", "heat"],
      "Which cools down the slowest?",
      ["Metal", "Water", "Air", "Paper"],
      1,
      "Water changes temperature more slowly."
    ),
    mq(
      "072",
      72,
      ["physics", "movement"],
      "Which is hardest to stop once moving?",
      ["Bicycle", "Car", "Train", "Person"],
      2,
      "A train has huge momentum."
    ),
    mq(
      "073",
      73,
      ["fire", "science"],
      "What makes fire burn faster?",
      ["More oxygen", "Less oxygen", "Darkness", "Cold air"],
      0,
      "Fire needs oxygen to burn strongly."
    ),
    mq(
      "074",
      74,
      ["visibility", "weather"],
      "Which is hardest to see in fog?",
      ["Bright yellow", "White", "Reflective strip", "Flashing light"],
      1,
      "White can blend into fog."
    ),
    mq(
      "075",
      75,
      ["probability", "cards"],
      "If you shuffle a deck of cards properly, what is most likely true?",
      [
        "That exact order has probably happened before",
        "That exact order is likely completely new",
        "Deck orders repeat often",
        "There are only a few possible orders",
      ],
      1,
      "There are so many card orders that a shuffle is likely unique."
    ),
    mq(
      "076",
      76,
      ["probability", "coins"],
      "Which is true about exact coin-flip patterns?",
      [
        "A mixed-looking sequence is more likely",
        "Ten heads in a row is more likely",
        "Any exact sequence is equally likely",
        "It depends how random it feels",
      ],
      2,
      "Any exact sequence of fair flips is equally likely."
    ),
    mq(
      "077",
      77,
      ["science", "ships"],
      "Why can huge steel ships float?",
      [
        "Steel is lighter than water",
        "They displace enough water",
        "Their engines hold them up",
        "The sea wants them to float",
      ],
      1,
      "Floating depends on density and displacement, not just material."
    ),
    mq(
      "078",
      78,
      ["memory", "thinking"],
      "Which is often more accurate before you overthink?",
      [
        "Your first answer",
        "Your second answer",
        "A random answer",
        "The longest answer",
      ],
      0,
      "People often talk themselves out of correct first answers."
    ),
    mq(
      "079",
      79,
      ["science", "mirrors"],
      "Why does a mirror seem to swap left and right?",
      [
        "It flips everything sideways",
        "It reverses front-to-back",
        "Because of gravity",
        "Because it is magic",
      ],
      1,
      "Mirrors reverse front-to-back, and your brain interprets that strangely."
    ),
    mq(
      "080",
      80,
      ["weather", "space"],
      "Why do we see lightning before hearing thunder?",
      [
        "Light travels faster than sound",
        "Thunder happens later",
        "Clouds delay the sound on purpose",
        "Rain blocks thunder",
      ],
      0,
      "Light reaches you almost instantly compared with sound."
    ),
    mq(
      "081",
      81,
      ["logic", "language"],
      "How many letters are in the phrase 'the alphabet'?",
      ["26", "11", "10", "13"],
      1,
      "The phrase 'the alphabet' has 11 letters."
    ),
    mq(
      "082",
      82,
      ["logic", "wordplay"],
      "What has a neck but no head?",
      ["Bottle", "Shirt", "Person", "Guitar"],
      0,
      "A bottle has a neck."
    ),
    mq(
      "083",
      83,
      ["technology", "ai"],
      "Which of these can learn from lots of data?",
      ["Calculator", "AI system", "Clock", "Remote control"],
      1,
      "AI systems can learn patterns from data."
    ),
    mq(
      "084",
      84,
      ["logic", "paradox"],
      "If nothing is better than happiness, and pizza is better than nothing, what follows?",
      [
        "Pizza is worse than happiness",
        "Pizza is better than happiness",
        "Happiness is better than pizza",
        "No conclusion",
      ],
      1,
      "It is a word trick that makes pizza come out on top."
    ),
    mq(
      "085",
      85,
      ["maths", "logic"],
      "How many times can you take 1 away from 5?",
      ["5", "4", "1", "Infinite"],
      2,
      "After the first time, it is no longer 5."
    ),
    mq(
      "086",
      86,
      ["language"],
      "Which pair sounds the same but means different things?",
      ["Their / There", "Big / Large", "Run / Walk", "Fast / Quick"],
      0,
      "Their and there are homophones."
    ),
    mq(
      "087",
      87,
      ["logic", "lying"],
      "Which of these can intentionally lie?",
      ["A rock", "A book", "A person", "A chair"],
      2,
      "Lying requires intention."
    ),
    mq(
      "088",
      88,
      ["logic", "language"],
      "Which of these cannot be broken in a physical way?",
      ["Glass", "Stick", "Promise", "Phone"],
      2,
      "A promise is abstract, not physical."
    ),
    mq(
      "089",
      89,
      ["logic", "positions"],
      "If you pass the runner in second place, what place are you in?",
      ["First", "Second", "Third", "It depends"],
      1,
      "You take second place, not first."
    ),
    mq(
      "090",
      90,
      ["patterns", "maths"],
      "What comes next: 2, 6, 7, 21, 22...?",
      ["23", "44", "66", "24"],
      2,
      "The pattern alternates ×3 and +1."
    ),
    mq(
      "091",
      91,
      ["maths", "negatives"],
      "Which number comes before 0?",
      ["1", "-1", "0.5", "Nothing"],
      1,
      "The number line continues into negatives."
    ),
    mq(
      "092",
      92,
      ["logic", "classification"],
      "If all cats are animals, what must be true?",
      [
        "All animals are cats",
        "Some animals are cats",
        "No animals are cats",
        "Cats are not animals",
      ],
      1,
      "If cats are animals, then some animals are cats."
    ),
    mq(
      "093",
      93,
      ["time", "travel"],
      "If it takes 10 minutes to walk somewhere, how long is there and back?",
      ["10 minutes", "15 minutes", "20 minutes", "25 minutes"],
      2,
      "10 there and 10 back makes 20."
    ),
    mq(
      "094",
      94,
      ["patterns", "maths"],
      "What comes next: 1, 4, 9, 16...?",
      ["20", "25", "36", "18"],
      1,
      "These are square numbers."
    ),
    mq(
      "095",
      95,
      ["logic", "geometry"],
      "Which of these is impossible?",
      [
        "A square with 4 sides",
        "A triangle with 3 sides",
        "A circle with corners",
        "A rectangle with 4 sides",
      ],
      2,
      "A circle has no corners."
    ),
    mq(
      "096",
      96,
      ["barrow", "history", "industry"],
      "What most strongly helped Barrow grow long ago?",
      ["Industry and shipbuilding", "Only farming", "Only tourism", "Castles"],
      0,
      "Barrow grew rapidly through industry, docks, and shipbuilding."
    ),
    mq(
      "097",
      97,
      ["maths", "logic"],
      "A bat and a ball cost £1.10 in total. The bat costs £1 more than the ball. How much is the ball?",
      ["10p", "5p", "1p", "20p"],
      1,
      "The common wrong answer is 10p, but that would make the total £1.20."
    ),
    mq(
      "098",
      98,
      ["logic", "objects"],
      "You have a match, a candle, a lamp, and a fire. What do you light first?",
      ["The candle", "The lamp", "The fire", "The match"],
      3,
      "You must light the match first."
    ),
    mq(
      "099",
      99,
      ["science", "water"],
      "If you drop a stone into a glass already full of water, what happens?",
      [
        "Nothing",
        "Water spills out",
        "The water disappears",
        "The stone floats",
      ],
      1,
      "The stone displaces water, so it overflows."
    ),
    mq(
      "100",
      100,
      ["weather", "sound"],
      "If you see lightning and hear thunder 5 seconds later, roughly how far away is the storm?",
      ["1 mile", "5 miles", "10 miles", "Right above you"],
      0,
      "A rough rule is about 1 mile per 5 seconds."
    ),
  ],

  teen: [
    mq(
      "101",
      101,
      ["logic", "weight"],
      "Which weighs more?",
      ["1kg of feathers", "1kg of bricks", "They weigh the same", "It depends"],
      2,
      "A kilogram is a kilogram whatever it is made of."
    ),
    mq(
      "102",
      102,
      ["maths", "numbers"],
      "Which of these is a prime number?",
      ["9", "15", "17", "21"],
      2,
      "17 is prime because it is only divisible by 1 and itself."
    ),
    mq(
      "103",
      103,
      ["world", "geography"],
      "Which of these is not a continent?",
      ["Europe", "Africa", "Arctic", "Asia"],
      2,
      "The Arctic is a region, not a continent."
    ),
    mq(
      "104",
      104,
      ["science", "states"],
      "At boiling point, what does water turn into?",
      ["Ice", "Gas", "Solid", "Nothing"],
      1,
      "Boiling changes liquid water into gas."
    ),
    mq(
      "105",
      105,
      ["animals"],
      "Which is the fastest land animal?",
      ["Lion", "Cheetah", "Horse", "Tiger"],
      1,
      "The cheetah is the fastest land animal."
    ),
    mq(
      "106",
      106,
      ["maths", "shapes"],
      "Which shape has the greatest number of sides?",
      ["Pentagon", "Hexagon", "Octagon", "Triangle"],
      2,
      "An octagon has 8 sides."
    ),
    mq(
      "107",
      107,
      ["logic", "classification"],
      "Which one is the odd one out?",
      ["Apple", "Banana", "Carrot", "Orange"],
      2,
      "Carrot is a vegetable; the others are fruits."
    ),
    mq(
      "108",
      108,
      ["time"],
      "How many minutes are in an hour?",
      ["50", "60", "70", "100"],
      1,
      "There are 60 minutes in an hour."
    ),
    mq(
      "109",
      109,
      ["maths"],
      "Which value is larger?",
      ["0.25", "1/3", "They are equal", "0.2"],
      1,
      "1/3 is about 0.333..., so it is larger."
    ),
    mq(
      "110",
      110,
      ["plants", "science"],
      "Which input is essential for photosynthesis?",
      ["Sunlight", "Sand", "Metal", "Plastic"],
      0,
      "Plants use sunlight to make food."
    ),
    mq(
      "111",
      111,
      ["modern", "language"],
      "In texting, what does LOL stand for?",
      ["Lots of Luck", "Laugh Out Loud", "Love Our Life", "Look Over Left"],
      1,
      "LOL usually means Laugh Out Loud."
    ),
    mq(
      "112",
      112,
      ["logic", "time"],
      "Which month has 28 days?",
      ["February", "January", "All of them", "December"],
      2,
      "Every month has at least 28 days."
    ),
    mq(
      "113",
      113,
      ["language"],
      "What is the antonym of 'increase'?",
      ["Expand", "Reduce", "Improve", "Multiply"],
      1,
      "Reduce is the opposite of increase."
    ),
    mq(
      "114",
      114,
      ["modern", "technology"],
      "Which device usually requires charging?",
      ["Book", "Phone", "Table", "Spoon"],
      1,
      "Phones normally require electrical charging."
    ),
    mq(
      "115",
      115,
      ["maths"],
      "What is 2 + 2?",
      ["3", "4", "5", "6"],
      1,
      "2 + 2 = 4."
    ),
    mq(
      "116",
      116,
      ["science", "floating"],
      "Which of these can float on water?",
      ["Rock", "Apple", "Brick", "Metal bar"],
      1,
      "Apples float because they contain air."
    ),
    mq(
      "117",
      117,
      ["animals"],
      "What is a young dog called?",
      ["Cub", "Puppy", "Kitten", "Calf"],
      1,
      "A young dog is called a puppy."
    ),
    mq(
      "118",
      118,
      ["patterns", "maths"],
      "What comes next: 2, 4, 6, 8...?",
      ["9", "10", "11", "12"],
      1,
      "The pattern increases by 2 each time."
    ),
    mq(
      "119",
      119,
      ["modern", "internet"],
      "Which app is best known for short-form videos?",
      ["WhatsApp", "TikTok", "Excel", "Gmail"],
      1,
      "TikTok is known for short-form video content."
    ),
    mq(
      "120",
      120,
      ["science", "life"],
      "Which of these is non-living?",
      ["Tree", "Dog", "Rock", "Human"],
      2,
      "A rock is non-living."
    ),
    mq(
      "121",
      121,
      ["riddle", "logic"],
      "What gets wetter the more it dries?",
      ["Sponge", "Towel", "Paper", "Cloth"],
      1,
      "A towel gets wetter as it dries things."
    ),
    mq(
      "122",
      122,
      ["science", "sound"],
      "Which of these cannot be physically touched as an object?",
      ["Air", "Sound", "Water", "Sand"],
      1,
      "You can detect sound, but it is not a solid object."
    ),
    mq(
      "123",
      123,
      ["physics"],
      "Which object would likely hurt most if dropped on your foot?",
      ["Feather", "Brick", "Leaf", "Sponge"],
      1,
      "A brick has far greater mass and impact."
    ),
    mq(
      "124",
      124,
      ["language"],
      "Which word is a synonym of 'fast'?",
      ["Slow", "Quick", "Late", "Weak"],
      1,
      "Quick is a synonym of fast."
    ),
    mq(
      "125",
      125,
      ["maths"],
      "What is 1 minus 1?",
      ["1", "0", "2", "It depends"],
      1,
      "1 - 1 = 0."
    ),
    mq(
      "126",
      126,
      ["science", "heat"],
      "Which of these melts under enough heat first?",
      ["Ice", "Stone", "Glass", "Wood"],
      0,
      "Ice melts at a much lower temperature."
    ),
    mq(
      "127",
      127,
      ["logic"],
      "Which of these is not a number?",
      ["7", "12", "Blue", "100"],
      2,
      "Blue is a colour, not a number."
    ),
    mq(
      "128",
      128,
      ["modern"],
      "Which device is commonly used to take a selfie?",
      ["Phone", "Book", "Chair", "Plate"],
      0,
      "Phones are commonly used for selfies."
    ),
    mq(
      "129",
      129,
      ["maths"],
      "Which is the smallest?",
      ["1", "0", "10", "100"],
      1,
      "Zero is smaller than the other values listed."
    ),
    mq(
      "130",
      130,
      ["animals"],
      "Which of these can fly?",
      ["Dog", "Bird", "Cat", "Horse"],
      1,
      "Birds are adapted for flight."
    ),
    mq(
      "131",
      131,
      ["logic", "weight"],
      "Which weighs more?",
      [
        "A tonne of steel",
        "A tonne of feathers",
        "They weigh the same",
        "It depends",
      ],
      2,
      "A tonne is a tonne regardless of material."
    ),
    mq(
      "132",
      132,
      ["geometry", "logic"],
      "How many sides does a circle technically have?",
      ["0", "1", "Infinite", "2"],
      0,
      "A circle has no straight edges."
    ),
    mq(
      "133",
      133,
      ["patterns", "maths"],
      "What comes next: 1, 1, 2, 3, 5...?",
      ["6", "7", "8", "10"],
      2,
      "This is the Fibonacci sequence."
    ),
    mq(
      "134",
      134,
      ["language", "logic"],
      "Which word does not belong?",
      ["Running", "Swimming", "Thinking", "Jumping"],
      2,
      "Thinking is mental; the others are physical actions."
    ),
    mq(
      "135",
      135,
      ["physics"],
      "If dropped together in normal air, which lands first?",
      ["Ball", "Feather", "Same time", "It depends on colour"],
      0,
      "Air resistance slows the feather more."
    ),
    mq(
      "136",
      136,
      ["maths"],
      "Which of these is an odd number?",
      ["12", "18", "21", "30"],
      2,
      "21 is not divisible by 2."
    ),
    mq(
      "137",
      137,
      ["logic", "animals"],
      "Which statement is always correct?",
      [
        "All birds can fly",
        "All fish swim",
        "Some birds cannot fly",
        "All animals run",
      ],
      2,
      "Some birds, such as penguins, cannot fly."
    ),
    mq(
      "138",
      138,
      ["technology"],
      "Which of these stores the most data?",
      ["KB", "MB", "GB", "TB"],
      3,
      "A terabyte is larger than a gigabyte."
    ),
    mq(
      "139",
      139,
      ["maths"],
      "What is 3 minus 2?",
      ["1", "2", "3", "0"],
      0,
      "3 - 2 = 1."
    ),
    mq(
      "140",
      140,
      ["logic", "shapes"],
      "Which item is the odd one out?",
      ["Square", "Triangle", "Rectangle", "Cube"],
      1,
      "Triangle is the only 2D shape listed with 3 sides."
    ),
    mq(
      "141",
      141,
      ["logic", "positions"],
      "If you pass the person in 2nd place, what place are you now?",
      ["First", "Second", "Third", "Last"],
      1,
      "You take second place."
    ),
    mq(
      "142",
      142,
      ["patterns", "maths"],
      "Find the next number: 2, 6, 7, 21, 22...?",
      ["23", "44", "66", "24"],
      2,
      "The pattern alternates ×3 and +1."
    ),
    mq(
      "143",
      143,
      ["language"],
      "Which sentence is grammatically correct?",
      [
        "He don't like it",
        "He doesn't likes it",
        "He doesn't like it",
        "He not like it",
      ],
      2,
      "After doesn't, the verb stays in its base form."
    ),
    mq(
      "144",
      144,
      ["science", "mass"],
      "Which weighs more?",
      ["1kg of water", "1kg of ice", "They weigh the same", "Ice is heavier"],
      2,
      "Changing state changes volume, not mass."
    ),
    mq(
      "145",
      145,
      ["maths", "numberline"],
      "Which integer comes before zero?",
      ["1", "-1", "0.5", "None"],
      1,
      "Negative numbers continue below zero."
    ),
    mq(
      "146",
      146,
      ["logic"],
      "If all cats are animals, what follows?",
      [
        "All animals are cats",
        "Some animals are cats",
        "No animals are cats",
        "Cats are not animals",
      ],
      1,
      "If cats exist, then some animals are cats."
    ),
    mq(
      "147",
      147,
      ["time", "travel"],
      "If a trip takes 10 minutes one way, how long is the round trip?",
      ["10 minutes", "15 minutes", "20 minutes", "25 minutes"],
      2,
      "10 + 10 = 20 minutes."
    ),
    mq(
      "148",
      148,
      ["logic", "time"],
      "Which of these always increases?",
      ["Age", "Height", "Money", "Speed"],
      0,
      "Age always increases over time."
    ),
    mq(
      "149",
      149,
      ["patterns", "maths"],
      "What comes next: 1, 4, 9, 16...?",
      ["20", "25", "36", "18"],
      1,
      "These are square numbers."
    ),
    mq(
      "150",
      150,
      ["logic", "geometry"],
      "Which of these is impossible?",
      [
        "A square with 4 sides",
        "A triangle with 3 sides",
        "A circle with corners",
        "A rectangle with 4 sides",
      ],
      2,
      "A circle cannot have corners."
    ),
    mq(
      "151",
      151,
      ["science", "realworld"],
      "What is the main reason people wear sunglasses?",
      [
        "To look cool",
        "To protect eyes from sunlight",
        "To see better at night",
        "To hear better",
      ],
      1,
      "Sunglasses mainly protect the eyes from bright light and UV."
    ),
    mq(
      "152",
      152,
      ["animals"],
      "Which of these animals sleeps the least?",
      ["Cat", "Dog", "Giraffe", "Lion"],
      2,
      "Giraffes can sleep very little compared with many animals."
    ),
    mq(
      "153",
      153,
      ["modern", "technology"],
      "What is most likely to happen at 1% phone battery?",
      ["It charges itself", "It shuts down", "It gets faster", "Nothing"],
      1,
      "Most phones shut down when battery is critically low."
    ),
    mq(
      "154",
      154,
      ["information", "logic"],
      "Which source is least reliable by itself?",
      ["A science book", "A random online comment", "A teacher", "A textbook"],
      1,
      "Random online comments are not reliable sources on their own."
    ),
    mq(
      "155",
      155,
      ["science", "heat"],
      "Which has the lowest melting point among these?",
      ["Ice", "Metal", "Stone", "Glass"],
      0,
      "Ice melts much more easily than the others."
    ),
    mq(
      "156",
      156,
      ["body", "science"],
      "What is one accepted explanation for yawning?",
      [
        "To get more oxygen",
        "To grow stronger",
        "To stretch hands",
        "To sleep faster",
      ],
      0,
      "Yawning is linked with body and brain regulation."
    ),
    mq(
      "157",
      157,
      ["materials"],
      "Which object is most fragile?",
      ["Rubber ball", "Glass", "Metal spoon", "Plastic toy"],
      1,
      "Glass is brittle and breaks more easily."
    ),
    mq(
      "158",
      158,
      ["modern", "technology"],
      "Which device relies heavily on Wi-Fi?",
      ["Smartphone", "Notebook", "Chair", "Pen"],
      0,
      "Smartphones often depend on Wi-Fi for internet access."
    ),
    mq(
      "159",
      159,
      ["science", "states"],
      "Which state of matter changes shape most easily?",
      ["Solid", "Liquid", "Metal", "Rock"],
      1,
      "Liquids take the shape of their container."
    ),
    mq(
      "160",
      160,
      ["science", "visibility"],
      "Which of these is invisible?",
      ["Air", "Water", "Glass", "Ice"],
      0,
      "Air is invisible to the naked eye."
    ),
    mq(
      "161",
      161,
      ["logic", "language"],
      "How many letters are in 'the alphabet'?",
      ["26", "11", "10", "13"],
      1,
      "The phrase itself contains 11 letters."
    ),
    mq(
      "162",
      162,
      ["logic", "wordplay"],
      "Which object has a neck but no head?",
      ["Bottle", "Shirt", "Guitar", "Person"],
      0,
      "A bottle has a neck."
    ),
    mq(
      "163",
      163,
      ["technology", "ai"],
      "Which of these can adapt by learning from data?",
      ["Calculator", "AI system", "Clock", "Remote control"],
      1,
      "AI systems can learn patterns from data."
    ),
    mq(
      "164",
      164,
      ["logic", "paradox"],
      "If a person somehow ate their own body mass entirely, what would remain?",
      [
        "They double in size",
        "They disappear",
        "Nothing changes",
        "They get stronger",
      ],
      1,
      "If all of it were consumed, there would be no body left."
    ),
    mq(
      "165",
      165,
      ["logic", "language"],
      "If nothing is better than happiness, and pizza is better than nothing, what follows?",
      [
        "Pizza is better than happiness",
        "Happiness is better than pizza",
        "Nothing can be known",
        "Pizza equals happiness",
      ],
      0,
      "It is a wording trap that makes pizza seem better than happiness."
    ),
    mq(
      "166",
      166,
      ["time", "logic"],
      "What goes up but never comes down?",
      ["Age", "Temperature", "Money", "Speed"],
      0,
      "Age only increases."
    ),
    mq(
      "167",
      167,
      ["logic", "maths"],
      "How many times can you subtract 1 from 5?",
      ["5", "4", "1", "Infinite"],
      2,
      "After the first subtraction, it is no longer 5."
    ),
    mq(
      "168",
      168,
      ["language"],
      "Which pair are homophones?",
      ["Their / There", "Big / Large", "Run / Walk", "Fast / Quick"],
      0,
      "Homophones sound the same but have different meanings."
    ),
    mq(
      "169",
      169,
      ["logic", "social"],
      "Which of these can intentionally give false information?",
      ["A rock", "A chair", "A person", "A cloud"],
      2,
      "Intentional deception requires awareness."
    ),
    mq(
      "170",
      170,
      ["logic", "abstract"],
      "Which of these cannot be broken physically?",
      ["Glass", "Stick", "Promise", "Screen"],
      2,
      "A promise is abstract rather than physical."
    ),
    mq(
      "171",
      171,
      ["probability", "cards"],
      "If you shuffle a deck of cards properly, what is most likely true?",
      [
        "The order has probably existed before",
        "The order is likely completely new",
        "There are only a few possible orders",
        "It repeats every few shuffles",
      ],
      1,
      "There are so many possible orders that a proper shuffle is likely unique."
    ),
    mq(
      "172",
      172,
      ["probability", "coins"],
      "Which statement about exact sequences of 10 fair coin flips is true?",
      [
        "A mixed sequence is more likely",
        "10 heads is more likely",
        "Any exact sequence is equally likely",
        "It depends on the pattern",
      ],
      2,
      "Any exact sequence has the same probability."
    ),
    mq(
      "173",
      173,
      ["science", "ships"],
      "Why do large ships made of steel float?",
      [
        "Steel is lighter than water",
        "They trap enough air and displace enough water",
        "The sea pushes them up",
        "Engines hold them up",
      ],
      1,
      "Shape, displacement, and overall density matter more than material alone."
    ),
    mq(
      "174",
      174,
      ["thinking", "memory"],
      "Which is often more accurate in a test before overthinking?",
      [
        "Your first guess",
        "Your second guess",
        "A random guess",
        "The longest answer",
      ],
      0,
      "People often change correct first answers when overthinking."
    ),
    mq(
      "175",
      175,
      ["maths"],
      "What is 0.1 × 0.1?",
      ["0.1", "0.01", "0.001", "1"],
      1,
      "Multiplying decimals can make numbers smaller."
    ),
    mq(
      "176",
      176,
      ["science", "mirrors"],
      "Why do mirrors seem to reverse left and right?",
      [
        "They flip sideways",
        "They reverse front-to-back",
        "They bend gravity",
        "They rotate the image",
      ],
      1,
      "The apparent left-right reversal comes from a front-back reversal."
    ),
    mq(
      "177",
      177,
      ["maths", "social"],
      "If everyone in a room shakes hands with everyone else once, what determines the total number of handshakes?",
      ["Number of people", "Time spent", "Room size", "Grip strength"],
      0,
      "The total depends on how many unique pairs of people there are."
    ),
    mq(
      "178",
      178,
      ["science", "heat"],
      "Which surprising effect has sometimes been observed under certain conditions?",
      [
        "Hot water can freeze faster than cold water",
        "Cold water always boils first",
        "Ice burns hotter than fire",
        "Steam weighs nothing",
      ],
      0,
      "The Mpemba effect is the observation that hot water can sometimes freeze faster."
    ),
    mq(
      "179",
      179,
      ["geography", "logic"],
      "If a plane flies over the North Pole and continues, what direction is it now flying?",
      ["North", "South", "East", "West"],
      1,
      "Once past the North Pole, every direction is south."
    ),
    mq(
      "180",
      180,
      ["science", "weather"],
      "Why do we hear thunder after seeing lightning?",
      [
        "Light travels faster than sound",
        "Thunder starts later",
        "Clouds block thunder",
        "Rain delays sound",
      ],
      0,
      "Light reaches you before sound does."
    ),
    mq(
      "181",
      181,
      ["maths", "growth"],
      "If you could fold paper in half 50 times, what is surprising about the thickness?",
      [
        "It would stay small",
        "It would be a few metres",
        "It would become enormous",
        "It would stop doubling",
      ],
      2,
      "Repeated doubling creates huge exponential growth."
    ),
    mq(
      "182",
      182,
      ["physics"],
      "Why is a long stick easier to balance than a short one?",
      [
        "It is heavier",
        "It tips more slowly",
        "It grips better",
        "It is always straighter",
      ],
      1,
      "A longer stick rotates more slowly, giving you more time to react."
    ),
    mq(
      "183",
      183,
      ["systems", "failure"],
      "Which is more dangerous over time?",
      [
        "One large mistake",
        "Many small repeated mistakes",
        "No mistakes",
        "Random pauses",
      ],
      1,
      "Small repeated errors can compound into serious failure."
    ),
    mq(
      "184",
      184,
      ["growth", "maths"],
      "If you improve by 1% every day for a year, what happens overall?",
      [
        "A tiny improvement",
        "A doubled result",
        "A huge improvement",
        "Almost no change",
      ],
      2,
      "Small daily improvements compound into major growth."
    ),
    mq(
      "185",
      185,
      ["weather", "body"],
      "Why does wind make people feel colder?",
      [
        "It lowers air temperature",
        "It removes body heat faster",
        "It changes gravity",
        "It increases blood pressure",
      ],
      1,
      "Wind strips away the warmer air around your body."
    ),
    mq(
      "186",
      186,
      ["logic", "social"],
      "Which is harder to detect?",
      ["A lie mixed with truth", "A full lie", "Silence", "A guess"],
      0,
      "Truth mixed with lies sounds more believable."
    ),
    mq(
      "187",
      187,
      ["memory"],
      "Why do unusual events often stay in memory better?",
      [
        "They happen less often",
        "They are louder",
        "They last longer",
        "They are always happier",
      ],
      0,
      "Unusual events stand out more strongly in memory."
    ),
    mq(
      "188",
      188,
      ["social", "information"],
      "Which type of information often spreads fastest?",
      ["A secret", "A neutral fact", "A timetable", "A correction"],
      0,
      "Exclusive or emotional information tends to spread quickly."
    ),
    mq(
      "189",
      189,
      ["time", "planning"],
      "Why do people often underestimate time needed for tasks?",
      [
        "They are optimistic",
        "Time speeds up",
        "Tasks get shorter",
        "Clocks are wrong",
      ],
      0,
      "People often underestimate time because of optimism and poor planning."
    ),
    mq(
      "190",
      190,
      ["maths", "growth"],
      "Which grows faster long-term?",
      [
        "Adding the same amount each time",
        "Doubling each time",
        "Subtracting each time",
        "Staying the same",
      ],
      1,
      "Exponential growth quickly beats linear growth."
    ),
    mq(
      "191",
      191,
      ["logic", "order"],
      "You have a match, a candle, a lamp, and a fireplace. What do you light first?",
      ["Candle", "Lamp", "Fireplace", "Match"],
      3,
      "The match must be lit first."
    ),
    mq(
      "192",
      192,
      ["science", "water"],
      "Which weighs more?",
      [
        "A full glass of water",
        "The same glass with ice floating in it",
        "They weigh the same",
        "The one with ice",
      ],
      2,
      "Floating ice displaces its own weight in water."
    ),
    mq(
      "193",
      193,
      ["maths", "logic"],
      "A bat and a ball cost £1.10 total. The bat costs £1 more than the ball. What does the ball cost?",
      ["10p", "5p", "1p", "20p"],
      1,
      "5p and £1.05 make the correct total."
    ),
    mq(
      "194",
      194,
      ["science", "water"],
      "If you drop a stone into a completely full glass of water, what happens?",
      ["Nothing", "Water spills out", "The stone floats", "The glass empties"],
      1,
      "The stone displaces water, so overflow happens."
    ),
    mq(
      "195",
      195,
      ["probability", "maths"],
      "Which is more likely on a fair die?",
      [
        "Rolling a 6",
        "Rolling any even number",
        "Both are equal",
        "It depends on colour",
      ],
      1,
      "An even number has three successful outcomes: 2, 4, and 6."
    ),
    mq(
      "196",
      196,
      ["logic", "positions"],
      "You pass the person in last place in a race. What position are you now?",
      ["First", "Second", "Last", "Middle"],
      2,
      "You cannot pass the last person unless you become last."
    ),
    mq(
      "197",
      197,
      ["physics", "energy"],
      "Which uses more energy?",
      ["Standing still", "Walking upstairs", "Both use the same", "Blinking"],
      1,
      "Walking upstairs means lifting your body against gravity."
    ),
    mq(
      "198",
      198,
      ["geometry", "spatial"],
      "If a painted cube is cut into smaller cubes, which cubes have the most paint?",
      ["Centre cubes", "Edge cubes", "Corner cubes", "All the same"],
      2,
      "Corner cubes have three painted faces."
    ),
    mq(
      "199",
      199,
      ["science", "light"],
      "Which travels faster?",
      ["Sound", "Light", "Both are equal", "It depends on weather"],
      1,
      "Light travels much faster than sound."
    ),
    mq(
      "200",
      200,
      ["weather", "sound"],
      "You see lightning and hear thunder 5 seconds later. Roughly how far away is the storm?",
      ["1 mile", "5 miles", "10 miles", "Directly above you"],
      0,
      "A rough estimate is around 1 mile per 5 seconds."
    ),
  ],

  adult: [
    mq(
      "201",
      201,
      ["physics", "flight"],
      "Why do aeroplanes fly more efficiently at high altitude?",
      [
        "Less gravity",
        "Thinner air reduces drag",
        "Engines work harder",
        "More oxygen",
      ],
      1,
      "Higher altitude means less drag because the air is thinner."
    ),
    mq(
      "202",
      202,
      ["memory", "learning"],
      "Which of these most improves long-term memory?",
      [
        "Re-reading notes",
        "Testing yourself",
        "Highlighting text",
        "Watching videos",
      ],
      1,
      "Active recall is more effective than passive review."
    ),
    mq(
      "203",
      203,
      ["science", "weather"],
      "Why can we see our breath on a cold day?",
      [
        "Cold air creates smoke",
        "Water vapour condenses",
        "Oxygen becomes visible",
        "Air freezes",
      ],
      1,
      "Warm breath meets cold air and the moisture condenses."
    ),
    mq(
      "204",
      204,
      ["memory", "thinking"],
      "Which situation is most likely to create a false memory?",
      [
        "Seeing something once",
        "Repeatedly imagining it",
        "Ignoring it",
        "Writing it once",
      ],
      1,
      "Repeated imagination can blur into memory."
    ),
    mq(
      "205",
      205,
      ["money", "psychology"],
      "Why do prices often end in .99 instead of .00?",
      [
        "Easier to calculate",
        "They feel cheaper psychologically",
        "Tax reasons",
        "No reason",
      ],
      1,
      "Prices ending in .99 exploit perception and seem lower."
    ),
    mq(
      "206",
      206,
      ["body", "cooling"],
      "Which would cool the body fastest?",
      [
        "Sitting still",
        "Sweating with airflow",
        "Drinking cold water",
        "Standing in shade",
      ],
      1,
      "Evaporation is a very effective cooling mechanism."
    ),
    mq(
      "207",
      207,
      ["science", "mirrors"],
      "Why do mirrors appear to reverse left and right?",
      [
        "They flip horizontally",
        "They flip front-to-back",
        "They reflect sideways",
        "They distort the eye",
      ],
      1,
      "Mirrors reverse depth rather than truly swapping left and right."
    ),
    mq(
      "208",
      208,
      ["information", "truth"],
      "Which is more reliable over time?",
      [
        "A single expert opinion",
        "Multiple independent sources",
        "A viral post",
        "A guess",
      ],
      1,
      "Independent agreement is stronger than one isolated source."
    ),
    mq(
      "209",
      209,
      ["science", "chemistry"],
      "Why do onions make your eyes water?",
      [
        "Heat release",
        "A gas irritates your eyes",
        "Oxygen exposure",
        "A smell reaction only",
      ],
      1,
      "Cutting onions releases irritating chemicals that affect the eyes."
    ),
    mq(
      "210",
      210,
      ["maths", "growth"],
      "Which grows faster over time?",
      [
        "Adding the same amount repeatedly",
        "Increasing by a percentage",
        "Random change",
        "No growth",
      ],
      1,
      "Percentage growth compounds over time."
    ),
    mq(
      "211",
      211,
      ["thinking", "errors"],
      "Why is it harder to spot your own mistakes than someone else’s?",
      [
        "You care less",
        "Your brain fills in what it expects",
        "You forget faster",
        "You are always tired",
      ],
      1,
      "The brain often auto-corrects expected patterns."
    ),
    mq(
      "212",
      212,
      ["systems", "scale"],
      "If a system works 99% of the time, what becomes obvious at huge scale?",
      [
        "It becomes perfect",
        "Errors become noticeable",
        "It stops working",
        "Nothing changes",
      ],
      1,
      "Small failure rates become significant when repeated enough times."
    ),
    mq(
      "213",
      213,
      ["social", "communication"],
      "Why do people often trust confident speakers more than accurate ones?",
      [
        "Confidence signals certainty",
        "Accuracy is harder to judge",
        "People prefer simple delivery",
        "All of the above",
      ],
      3,
      "Confidence often feels convincing even when accuracy is weak."
    ),
    mq(
      "214",
      214,
      ["decision", "logic"],
      "Which decision is usually the most dangerous?",
      [
        "A rushed decision",
        "A delayed decision",
        "A confident but wrong decision",
        "No decision at all",
      ],
      2,
      "Confidence can make bad decisions harder to question."
    ),
    mq(
      "215",
      215,
      ["habits", "brain"],
      "Why do habits become easier over time?",
      [
        "They require less thought",
        "They become automatic",
        "The brain optimises them",
        "All of the above",
      ],
      3,
      "Habits reduce cognitive effort by becoming automatic."
    ),
    mq(
      "216",
      216,
      ["growth", "systems"],
      "Which is usually more powerful over time?",
      [
        "A big one-time effort",
        "Small consistent actions",
        "Random effort",
        "Waiting",
      ],
      1,
      "Consistency compounds."
    ),
    mq(
      "217",
      217,
      ["planning", "time"],
      "Why do people struggle to estimate time accurately?",
      [
        "They guess",
        "They ignore details",
        "They underestimate complexity",
        "Time changes speed",
      ],
      2,
      "People often miss hidden steps and underestimate complexity."
    ),
    mq(
      "218",
      218,
      ["habits", "change"],
      "Which is harder to change?",
      ["A decision", "A habit", "A thought", "A plan"],
      1,
      "Habits are deeply reinforced and automatic."
    ),
    mq(
      "219",
      219,
      ["information", "communication"],
      "Why do simple ideas spread faster than complex ones?",
      [
        "Easier to understand",
        "Easier to remember",
        "Easier to repeat",
        "All of the above",
      ],
      3,
      "Simple ideas move faster because they are easier to process and repeat."
    ),
    mq(
      "220",
      220,
      ["learning", "performance"],
      "Which is most likely to improve performance?",
      [
        "Doing something once",
        "Repeating with feedback",
        "Guessing",
        "Watching others only",
      ],
      1,
      "Feedback loops improve learning far more than repetition alone."
    ),
    mq(
      "221",
      221,
      ["travel", "safety"],
      "Why are cabin lights dimmed on some night flights before landing?",
      [
        "To save power",
        "To help passengers sleep",
        "To prepare eyes for darkness",
        "To cool the cabin",
      ],
      2,
      "Dark-adapted eyes help in emergencies."
    ),
    mq(
      "222",
      222,
      ["science", "electricity"],
      "Which metal is most commonly used in electrical wiring?",
      ["Iron", "Copper", "Gold", "Silver"],
      1,
      "Copper is highly conductive and affordable."
    ),
    mq(
      "223",
      223,
      ["science", "density"],
      "Why does ice float on water?",
      [
        "It weighs less",
        "It has lower density",
        "Water rejects it",
        "It traps magical air",
      ],
      1,
      "Frozen water expands and becomes less dense."
    ),
    mq(
      "224",
      224,
      ["world", "roads"],
      "Which country drives on the left side of the road?",
      ["Germany", "USA", "Japan", "France"],
      2,
      "Japan drives on the left."
    ),
    mq(
      "225",
      225,
      ["science", "sound"],
      "What happens to sound as it travels through air?",
      [
        "It speeds up",
        "It slows down to zero",
        "It loses energy",
        "It gets sharper",
      ],
      2,
      "Sound fades as energy spreads out and is lost."
    ),
    mq(
      "226",
      226,
      ["food", "chemistry"],
      "Which of these foods can last extremely long without spoiling?",
      ["Bread", "Honey", "Milk", "Cheese"],
      1,
      "Honey resists bacterial growth and can last for years."
    ),
    mq(
      "227",
      227,
      ["engineering", "transport"],
      "Why do tyres have tread patterns?",
      [
        "For design",
        "To reduce noise",
        "To grip and move water",
        "To look expensive",
      ],
      2,
      "Tread helps maintain grip and channels water away."
    ),
    mq(
      "228",
      228,
      ["space"],
      "Which planet has the most known moons?",
      ["Earth", "Mars", "Jupiter", "Venus"],
      2,
      "Jupiter is famous for having many moons."
    ),
    mq(
      "229",
      229,
      ["weather", "roads"],
      "Why is salt put on icy roads?",
      ["To melt ice", "To warm the road", "To dry water", "To stop wind"],
      0,
      "Salt lowers the freezing point of water."
    ),
    mq(
      "230",
      230,
      ["body", "brain"],
      "Which part of the brain is strongly linked to balance and coordination?",
      ["Cerebrum", "Cerebellum", "Brainstem", "Amygdala"],
      1,
      "The cerebellum helps control balance and coordination."
    ),
    mq(
      "231",
      231,
      ["barrow", "industry"],
      "Why are submarines built in Barrow rather than inland?",
      ["Cheaper labour", "Direct sea access", "Better weather", "Fewer houses"],
      1,
      "Direct sea access is essential for launching and testing."
    ),
    mq(
      "232",
      232,
      ["social", "reputation"],
      "Which is hardest to reverse once started?",
      ["A decision", "A habit", "A reputation", "A plan"],
      2,
      "Reputation can spread and become very hard to undo."
    ),
    mq(
      "233",
      233,
      ["science", "ships"],
      "Why can a metal ship float while a smaller metal object sinks?",
      [
        "Engine power",
        "Shape and displacement",
        "Paint colour",
        "Sea temperature",
      ],
      1,
      "Overall density and displaced water matter more than material alone."
    ),
    mq(
      "234",
      234,
      ["systems", "failure"],
      "What most often causes long-term system failure?",
      [
        "One major issue",
        "Small unnoticed errors",
        "Slow speed",
        "Too much space",
      ],
      1,
      "Small ignored errors can compound over time."
    ),
    mq(
      "235",
      235,
      ["barrow", "abbey"],
      "Why was Furness Abbey built away from a dense urban centre?",
      [
        "For tourism",
        "For isolation and religious focus",
        "For football",
        "For airport access",
      ],
      1,
      "Monastic sites often valued isolation and control."
    ),
    mq(
      "236",
      236,
      ["growth", "maths"],
      "Which outpaces the others most dramatically over time?",
      [
        "Adding 100 each time",
        "Doubling each time",
        "Random growth",
        "No growth",
      ],
      1,
      "Exponential growth quickly overtakes linear growth."
    ),
    mq(
      "237",
      237,
      ["thinking", "bias"],
      "Why do people trust familiar information more easily?",
      [
        "It is always more accurate",
        "It feels truer because it is familiar",
        "It is shorter",
        "It is newer",
      ],
      1,
      "Familiarity can create a false sense of truth."
    ),
    mq(
      "238",
      238,
      ["barrow", "walney"],
      "Why was Walney strategically useful to Barrow’s development?",
      [
        "For farming",
        "For coastal protection and access",
        "For jungle cover",
        "For mountain transport",
      ],
      1,
      "Walney helps shape access and shelter around the docks."
    ),
    mq(
      "239",
      239,
      ["decision", "analysis"],
      "Which is usually best for strong decision-making?",
      ["Experience alone", "Data alone", "Both combined", "Instinct alone"],
      2,
      "Good decisions often combine evidence and judgment."
    ),
    mq(
      "240",
      240,
      ["thinking", "accuracy"],
      "Why does slowing down often improve accuracy?",
      ["More time to think", "Better luck", "Less gravity", "More noise"],
      0,
      "Rushing tends to increase mistakes."
    ),
    mq(
      "241",
      241,
      ["barrow", "industry", "coast"],
      "Why did heavy industry often grow in coastal towns like Barrow rather than far inland?",
      [
        "Better weather",
        "Easier access to imported materials",
        "Less daylight",
        "More forests",
      ],
      1,
      "Sea access helped bring in raw materials and move heavy goods."
    ),
    mq(
      "242",
      242,
      ["thinking", "change"],
      "Which is hardest for the brain to notice?",
      ["Sudden change", "Gradual change", "Bright light", "A loud bang"],
      1,
      "Gradual change is easy to miss because it happens slowly."
    ),
    mq(
      "243",
      243,
      ["engineering", "docks"],
      "Why are dock systems often built with controlled entrances instead of open water alone?",
      [
        "To look better",
        "To manage water levels and security",
        "To reduce sky exposure",
        "To confuse birds",
      ],
      1,
      "Controlled access improves safety, security, and water management."
    ),
    mq(
      "244",
      244,
      ["barrow", "walney", "industry"],
      "What was the practical advantage of the Walney Channel for shipbuilding?",
      [
        "Fresh water",
        "Calmer sheltered waters",
        "Hotter air",
        "Better farming",
      ],
      1,
      "Sheltered waters make building and launching safer."
    ),
    mq(
      "245",
      245,
      ["systems", "improvement"],
      "Which creates the biggest long-term advantage?",
      [
        "Fast early success",
        "Consistent small improvements",
        "One lucky break",
        "Sudden noise",
      ],
      1,
      "Small consistent gains compound over time."
    ),
    mq(
      "246",
      246,
      ["maths", "thinking"],
      "Why do humans struggle with exponential growth?",
      [
        "It is too slow",
        "We tend to think linearly",
        "It is too simple",
        "We see too many numbers",
      ],
      1,
      "Human intuition usually expects linear rather than exponential change."
    ),
    mq(
      "247",
      247,
      ["barrow", "railway"],
      "Why was the Furness Railway critical to Barrow’s growth?",
      [
        "Passenger fun trips",
        "Linking raw materials to industry",
        "Because trains are louder",
        "For tourism only",
      ],
      1,
      "Rail linked mines, docks, and factories."
    ),
    mq(
      "248",
      248,
      ["decision", "bias"],
      "Which is more dangerous in decision-making?",
      [
        "Not knowing",
        "Being confidently wrong",
        "Asking questions",
        "Changing your mind",
      ],
      1,
      "Confidence can make wrong ideas harder to challenge."
    ),
    mq(
      "249",
      249,
      ["systems", "resilience"],
      "What makes a system resilient?",
      [
        "Strength alone",
        "Flexibility and redundancy",
        "Speed only",
        "Noise reduction",
      ],
      1,
      "Resilient systems adapt and have backups."
    ),
    mq(
      "250",
      250,
      ["barrow", "industry", "history"],
      "Why did rapid industrial growth in towns like Barrow eventually slow?",
      ["Lack of clouds", "Global industrial change", "No roads", "No clocks"],
      1,
      "Economic and industrial shifts affect even strong industrial towns."
    ),
    mq(
      "251",
      251,
      ["barrow", "docks"],
      "Why do enclosed dock systems matter in places like Barrow?",
      [
        "Decoration",
        "Control of water levels and ship protection",
        "To make maps easier",
        "To stop gulls",
      ],
      1,
      "Enclosed docks help control conditions for ships."
    ),
    mq(
      "252",
      252,
      ["barrow", "buildings"],
      "Why were many industrial-era buildings built in stone rather than wood?",
      [
        "Colour preference",
        "Fire resistance",
        "Because stone is soft",
        "Because wood floats",
      ],
      1,
      "Stone offered better resistance to industrial fire risk."
    ),
    mq(
      "253",
      253,
      ["barrow", "townplanning"],
      "What does the layout of older streets in Barrow suggest?",
      [
        "Random medieval growth",
        "Planned expansion",
        "Jungle paths",
        "Volcanic settlement",
      ],
      1,
      "Barrow expanded rapidly through industrial planning."
    ),
    mq(
      "254",
      254,
      ["industry", "ships"],
      "Why are shipyards positioned by deep water rather than inland?",
      [
        "Noise control",
        "Immediate launch access",
        "More sheep",
        "Fewer windows",
      ],
      1,
      "Large vessels need direct access to navigable water."
    ),
    mq(
      "255",
      255,
      ["barrow", "weather", "walney"],
      "Why can places like Walney feel windier than inland areas?",
      ["Higher gravity", "Less shelter from land", "More trees", "Thicker air"],
      1,
      "Exposure to open sea winds increases wind intensity."
    ),
    mq(
      "256",
      256,
      ["industry", "history"],
      "Why can a town grow quickly in a short period instead of over centuries?",
      [
        "Only tourism",
        "Industrial demand",
        "Because clocks change",
        "Because maps shrink",
      ],
      1,
      "Industrial demand can drive rapid expansion."
    ),
    mq(
      "257",
      257,
      ["barrow", "industry", "materials"],
      "Why was proximity to iron ore and coal important for early industry?",
      [
        "Decoration",
        "Fuel and raw material supply",
        "More rain",
        "Larger birds",
      ],
      1,
      "Industry needs both materials and fuel."
    ),
    mq(
      "258",
      258,
      ["economics", "coast"],
      "Why can coastal industrial towns decline sharply when industries change?",
      [
        "Too much sea",
        "Dependency on one industry",
        "Too many roads",
        "Cold weather",
      ],
      1,
      "Economic dependence on one sector increases vulnerability."
    ),
    mq(
      "259",
      259,
      ["townplanning", "history"],
      "Why are many industrial towns laid out with straight grid-like streets?",
      [
        "For style",
        "For faster planning and expansion",
        "For racing",
        "For stronger wind",
      ],
      1,
      "Grids make rapid expansion and infrastructure easier."
    ),
    mq(
      "260",
      260,
      ["barrow", "abbey", "history"],
      "How could a place like Furness Abbey hold major influence despite isolation?",
      [
        "Only by defence",
        "Through religious and economic control",
        "Through airports",
        "Through skyscrapers",
      ],
      1,
      "Monasteries could control land, wealth, and local influence."
    ),
    mq(
      "261",
      261,
      ["barrow", "transport"],
      "Why is Walney Bridge more than just a normal crossing?",
      [
        "It looks good",
        "It acts as a key access bottleneck",
        "It is the oldest bridge on Earth",
        "It moves boats",
      ],
      1,
      "It is a major access point between island and mainland."
    ),
    mq(
      "262",
      262,
      ["social", "trust"],
      "Which failure is often hardest to recover from?",
      ["Physical strain", "Financial loss", "Loss of trust", "Missing a train"],
      2,
      "Trust can be much harder to rebuild than money or strength."
    ),
    mq(
      "263",
      263,
      ["learning"],
      "Why does repetition usually improve performance?",
      ["Memory reinforcement", "Luck", "Random energy", "Lower gravity"],
      0,
      "Repetition strengthens recall and efficiency."
    ),
    mq(
      "264",
      264,
      ["barrow", "industry", "water"],
      "Why would shipbuilding locations value water depth over width?",
      [
        "For prettier maps",
        "For launch safety of large vessels",
        "For fish colour",
        "For smaller ropes",
      ],
      1,
      "Large vessels need deep enough water immediately after launch."
    ),
    mq(
      "265",
      265,
      ["bias", "thinking"],
      "What often creates an illusion of control?",
      ["Knowledge alone", "Familiar patterns", "Silence", "Distance"],
      1,
      "Familiar patterns can make random events feel predictable."
    ),
    mq(
      "266",
      266,
      ["statistics"],
      "Why can averages be misleading?",
      [
        "They are always false",
        "They hide variation and extremes",
        "They are too emotional",
        "They are too loud",
      ],
      1,
      "An average can hide important spread and outliers."
    ),
    mq(
      "267",
      267,
      ["barrow", "buildings", "trade"],
      "Why were some older dockside buildings taller than expected?",
      [
        "For fun",
        "To improve storage and trade efficiency",
        "To reach birds",
        "To block the moon",
      ],
      1,
      "Vertical storage made better use of dockside space."
    ),
    mq(
      "268",
      268,
      ["thinking"],
      "Which improves thinking more?",
      [
        "More information",
        "Better questions",
        "More shouting",
        "Faster talking",
      ],
      1,
      "The quality of questions strongly shapes the quality of thought."
    ),
    mq(
      "269",
      269,
      ["risk", "bias"],
      "Why do humans often overestimate rare dangers?",
      [
        "Fear and vividness",
        "Perfect logic",
        "High maths skill",
        "Too much sunlight",
      ],
      0,
      "Emotionally vivid risks feel more likely than they are."
    ),
    mq(
      "270",
      270,
      ["barrow", "logistics"],
      "Why were industrial towns like Barrow built around several transport types?",
      [
        "Because maps demanded it",
        "For redundancy and efficiency",
        "To impress tourists",
        "To reduce gravity",
      ],
      1,
      "Combining rail and sea improved logistics and flexibility."
    ),
    mq(
      "271",
      271,
      ["physics", "perception"],
      "Why can very large ships look slow even when moving quickly?",
      [
        "They are always slow",
        "Their scale changes speed perception",
        "The water lies",
        "They bend light",
      ],
      1,
      "Large objects often appear slower because of scale."
    ),
    mq(
      "272",
      272,
      ["engineering", "docks"],
      "Why might a dock gate remain closed even when no ship is entering?",
      [
        "For decoration",
        "To maintain water level",
        "To block sunlight",
        "To create fog",
      ],
      1,
      "Dock gates help control water conditions continuously."
    ),
    mq(
      "273",
      273,
      ["barrow", "walney"],
      "Why is Walney Bridge strategically important beyond traffic alone?",
      [
        "It is colourful",
        "It is a key land connection",
        "It is the tallest structure",
        "It attracts rain",
      ],
      1,
      "It is a critical connection between Barrow and Walney."
    ),
    mq(
      "274",
      274,
      ["social", "trust"],
      "Which failure is often the hardest to repair?",
      ["Physical", "Financial", "Trust", "Muscle"],
      2,
      "Trust can be fragile and slow to rebuild."
    ),
    mq(
      "275",
      275,
      ["learning", "brain"],
      "Why does repetition improve performance?",
      [
        "Memory reinforcement",
        "Higher gravity",
        "Noise reduction",
        "Shorter time",
      ],
      0,
      "Repetition strengthens neural pathways and memory."
    ),
    mq(
      "276",
      276,
      ["barrow", "shipbuilding"],
      "Why would shipbuilding locations prioritise deep water so strongly?",
      [
        "For beauty",
        "For safe launch of large vessels",
        "To cool the air",
        "To make tides louder",
      ],
      1,
      "Deep water is crucial for large vessel movement after launch."
    ),
    mq(
      "277",
      277,
      ["bias", "thinking"],
      "What commonly creates an illusion of control?",
      [
        "Familiar patterns",
        "Complete randomness awareness",
        "Silence",
        "Forgetfulness",
      ],
      0,
      "Repeated patterns can make randomness feel controllable."
    ),
    mq(
      "278",
      278,
      ["statistics"],
      "Why can the word 'average' hide important truth?",
      [
        "It removes extremes",
        "It hides distribution",
        "It deletes numbers",
        "It is always wrong",
      ],
      1,
      "Averages can conceal how spread out the data really is."
    ),
    mq(
      "279",
      279,
      ["barrow", "trade", "buildings"],
      "Why were some buildings near docks unusually tall?",
      [
        "For sport",
        "For storage and handling efficiency",
        "To catch lightning",
        "To hold fog",
      ],
      1,
      "Dockside storage often used height efficiently."
    ),
    mq(
      "280",
      280,
      ["thinking"],
      "What tends to improve reasoning most?",
      ["Better questions", "More shouting", "Less reading", "Random speed"],
      0,
      "Better questions improve the quality of thought."
    ),
    mq(
      "281",
      281,
      ["risk", "psychology"],
      "Why do rare events often feel more likely than they are?",
      [
        "Fear makes them vivid",
        "Maths is weak",
        "They happen more",
        "They are shorter",
      ],
      0,
      "Emotionally vivid events distort probability judgment."
    ),
    mq(
      "282",
      282,
      ["barrow", "transport", "industry"],
      "Why did industrial towns benefit from rail and sea together?",
      [
        "For decoration",
        "For flexibility and logistics",
        "For warmer nights",
        "For bird control",
      ],
      1,
      "Multiple transport systems improve movement of goods and resilience."
    ),
    mq(
      "283",
      283,
      ["systems", "growth"],
      "Which scales better over time?",
      ["Effort alone", "Skill alone", "Systems", "Luck"],
      2,
      "Systems scale more effectively than raw effort."
    ),
    mq(
      "284",
      284,
      ["change", "behaviour"],
      "Why do people resist better solutions?",
      [
        "They love bad outcomes",
        "Familiarity feels safer",
        "Logic disappears",
        "Weather changes",
      ],
      1,
      "People often prefer familiar habits over better alternatives."
    ),
    mq(
      "285",
      285,
      ["barrow", "townplanning"],
      "Why can Barrow feel more spread out than many older towns?",
      [
        "Because it floats",
        "Because of planned industrial layout",
        "Because it moves",
        "Because streets are random",
      ],
      1,
      "Rapid planned expansion can create a more spread-out feel."
    ),
    mq(
      "286",
      286,
      ["learning", "ego"],
      "What often limits learning more than lack of intelligence?",
      ["Time", "Ego", "Weather", "Noise"],
      1,
      "Believing you already know enough can block learning."
    ),
    mq(
      "287",
      287,
      ["decision", "thinking"],
      "Why does slowing down often improve decisions?",
      [
        "More processing time",
        "More luck",
        "Lower noise",
        "Higher temperature",
      ],
      0,
      "Slower thinking can reduce careless error."
    ),
    mq(
      "288",
      288,
      ["barrow", "coast", "industry"],
      "Why would industry choose a harsher coastal environment?",
      [
        "For comfort",
        "For strategic advantage",
        "For more rain",
        "For fewer waves",
      ],
      1,
      "Industrial priorities often favour access and logistics over comfort."
    ),
    mq(
      "289",
      289,
      ["memory"],
      "What most strongly makes something memorable?",
      ["Emotion", "Length", "Silence", "Order"],
      0,
      "Emotion tends to anchor memory strongly."
    ),
    mq(
      "290",
      290,
      ["economics", "logic"],
      "Which is hardest to measure precisely?",
      ["Time", "Value", "Distance", "Speed"],
      1,
      "Value depends heavily on context and perspective."
    ),
    mq(
      "291",
      291,
      ["barrow", "roads", "industry"],
      "Why were some industrial-era roads unusually wide?",
      [
        "For style",
        "For movement of goods and machinery",
        "For horse racing",
        "For extra rain",
      ],
      1,
      "Industrial movement required space for materials and machinery."
    ),
    mq(
      "292",
      292,
      ["systems"],
      "Why do simple systems often outperform very complex ones?",
      [
        "They are louder",
        "They have fewer failure points",
        "They are always faster",
        "They look better",
      ],
      1,
      "Complexity often increases fragility."
    ),
    mq(
      "293",
      293,
      ["bias", "thinking"],
      "Which cognitive bias most often reinforces existing beliefs?",
      ["Confirmation bias", "Recency bias", "Framing only", "Anchoring only"],
      0,
      "Confirmation bias makes people favour evidence that fits what they already believe."
    ),
    mq(
      "294",
      294,
      ["barrow", "docks", "economics"],
      "Why was controlling dock access important beyond shipping alone?",
      [
        "For noise",
        "For security and economic control",
        "For gulls",
        "For shorter tides",
      ],
      1,
      "Control of access often meant control of trade and wealth."
    ),
    mq(
      "295",
      295,
      ["learning", "precision"],
      "What improves accuracy most reliably?",
      ["Practice", "Speed", "Talent alone", "Guessing"],
      0,
      "Deliberate practice improves precision."
    ),
    mq(
      "296",
      296,
      ["social", "behaviour"],
      "Why do people often follow crowds?",
      ["Safety and social proof", "Better maths", "More gravity", "Silence"],
      0,
      "People often assume the group knows something they do not."
    ),
    mq(
      "297",
      297,
      ["barrow", "infrastructure"],
      "Why do industrial landmarks shape a town long after the original industry changes?",
      ["Colour", "Infrastructure legacy", "Tourism alone", "Tall roofs"],
      1,
      "Infrastructure can influence layout and movement for decades."
    ),
    mq(
      "298",
      298,
      ["habits", "change"],
      "Which is usually hardest to change directly?",
      ["Skill", "Habit", "Knowledge", "A timetable"],
      1,
      "Habits are deeply embedded patterns of behaviour."
    ),
    mq(
      "299",
      299,
      ["time", "perception"],
      "Why do people misjudge time so easily?",
      [
        "Distraction changes perception",
        "Clocks are weak",
        "Time is random",
        "Air pressure",
      ],
      0,
      "Attention strongly affects how time feels."
    ),
    mq(
      "300",
      300,
      ["barrow", "familiarity", "thinking"],
      "Why can a place like Barrow feel ordinary to locals but complex to outsiders?",
      ["Size", "Familiarity hides detail", "More maps", "Less weather"],
      1,
      "Familiarity often makes people stop consciously noticing detail."
    ),
  ],
};

export function getQuizQuestion(input = {}) {
  const pool =
    (typeof QA_QUIZ_BY_GROUP !== "undefined" && QA_QUIZ_BY_GROUP) ||
    (typeof QUIZ_BY_GROUP !== "undefined" && QUIZ_BY_GROUP) ||
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
