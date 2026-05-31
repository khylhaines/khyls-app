/* =========================================================
   MINDFULNESS SYSTEM — ALL CONTENT
   Barrow Quest
   =========================================================
   Every exercise, meditation, and practice
   Split by type and age tier
========================================================= */

/* =========================================================
   BREATH & GROUNDING EXERCISES
========================================================= */

export const GROUNDING_EXERCISES = [
  {
    id: "five_senses",
    title: "5-4-3-2-1 METHOD",
    icon: "👁️",
    duration: 3,
    tier: ["kid", "teen", "adult"],
    section: "grounding",
    description: "Bring yourself back to right here, right now.",
    steps: [
      "Look around and name 5 things you can SEE.",
      "Find 4 things you can TOUCH. Feel them.",
      "Listen for 3 things you can HEAR right now.",
      "Notice 2 things you can SMELL.",
      "Find 1 thing you can TASTE.",
      "You are here. You are present. You are safe.",
    ],
  },
  {
    id: "feet_on_earth",
    title: "FEET ON EARTH",
    icon: "🌍",
    duration: 2,
    tier: ["kid", "teen", "adult"],
    section: "grounding",
    description: "Feel solid, connected, and safe.",
    steps: [
      "Sit or stand with both feet flat on the floor.",
      "Feel the weight of your feet pressing down.",
      "Feel the floor pushing back up against you.",
      "You are solid. You are connected. You are supported.",
      "Take a slow breath in. Let it out.",
      "Stay here for a moment. You are grounded.",
    ],
  },
  {
    id: "box_breath",
    title: "BOX BREATH",
    icon: "📦",
    duration: 4,
    tier: ["kid", "teen", "adult"],
    section: "grounding",
    description: "Slows everything down. Clears the head.",
    steps: [
      "Breathe IN for 4 counts.",
      "HOLD for 4 counts.",
      "Breathe OUT for 4 counts.",
      "HOLD for 4 counts.",
      "Repeat 4 times.",
      "Notice how much slower and clearer everything feels.",
    ],
    hasBreathCircle: true,
    breathCycle: 4,
  },
  {
    id: "safe_zone_breath",
    title: "SAFE ZONE BREATH",
    icon: "🛡️",
    duration: 3,
    tier: ["teen", "adult"],
    section: "grounding",
    description: "When stressed, cross, or overwhelmed. Breathe in safety, breathe out tension.",
    steps: [
      "Find somewhere you can sit for 2 minutes.",
      "On your breath IN — imagine breathing in calm, safety, strength.",
      "On your breath OUT — imagine breathing out tension, worry, stress.",
      "With each breath, feel yourself getting steadier.",
      "Do this for 6 breaths.",
      "You are safe. You are steady. You are in control.",
    ],
  },
];

/* =========================================================
   AWARENESS & SAFETY EXERCISES
========================================================= */

export const AWARENESS_EXERCISES = [
  {
    id: "read_the_room",
    title: "READ THE ROOM",
    icon: "👀",
    duration: 3,
    tier: ["teen", "adult"],
    section: "awareness",
    description: "Your exact thing. Mindfulness that keeps you safe and switched on.",
    steps: [
      "Stop. Take one slow breath.",
      "Who is here? Count the people. Notice who they are.",
      "What is happening? Is anything changing?",
      "What sounds can you hear? What feels normal? What stands out?",
      "What feels safe? What feels off?",
      "What are the exits? Where would you go if you needed to move?",
      "You are switched on. You are aware. You are ready.",
    ],
  },
  {
    id: "spot_the_signs",
    title: "SPOT THE SIGNS",
    icon: "⚡",
    duration: 4,
    tier: ["teen", "adult"],
    section: "awareness",
    description: "Learn your own early warning signs. Know when you're moving from Green to Amber.",
    steps: [
      "Think about a time you felt stressed or overwhelmed.",
      "What happened in your BODY first? Tight chest? Shoulders up? Stomach turning?",
      "What happened in your HEAD? Racing thoughts? Going blank? Getting sharp?",
      "What happened in your HANDS? Clenching? Sweating? Moving?",
      "Those are YOUR early warning signs. Learn them.",
      "The earlier you spot them, the easier it is to stay in control.",
      "Practice noticing them now, before you need to.",
    ],
  },
  {
    id: "situational_check",
    title: "SITUATIONAL CHECK",
    icon: "🗺️",
    duration: 3,
    tier: ["teen", "adult"],
    section: "awareness",
    description: "Notice exits, safe places, trusted people — before you need them.",
    steps: [
      "Look around the space you are in right now.",
      "Where are the exits? How would you leave if you had to?",
      "Who around you would you trust if something went wrong?",
      "Is there anything in this space you could use to help yourself?",
      "What is the nearest safe place outside this building?",
      "You have done your check. You are prepared. Now relax.",
    ],
  },
  {
    id: "noise_vs_signal",
    title: "NOISE VS SIGNAL",
    icon: "📡",
    duration: 4,
    tier: ["teen", "adult"],
    section: "awareness",
    description: "Learn to tell the difference between real threats and just your head being loud.",
    steps: [
      "Notice what is going on in your head right now.",
      "For each thought or worry — ask: Is this actually happening right now?",
      "If no — that is NOISE. Your brain being busy. You can set it down.",
      "If yes — that is a SIGNAL. Something that actually needs your attention.",
      "Only act on the signals. Let the noise pass through.",
      "Your brain wants to protect you. But not every loud thought needs action.",
      "You decide what gets your energy.",
    ],
  },
];

/* =========================================================
   ENERGY & BALANCE EXERCISES
========================================================= */

export const ENERGY_EXERCISES = [
  {
    id: "energy_scan",
    title: "ENERGY SCAN",
    icon: "🔋",
    duration: 4,
    tier: ["kid", "teen", "adult"],
    section: "energy",
    description: "Go through your body and mind. Find what's light and what's heavy.",
    steps: [
      "Start at your feet. How do they feel? Light? Heavy? Tight? Relaxed?",
      "Move up to your legs. Any tension? Any tiredness?",
      "Check your belly and chest. Tight? Open? Knotted? Easy?",
      "Your shoulders and neck. The most common place we carry stress.",
      "Your head and face. Tight jaw? Furrowed brow? Soft?",
      "Your mind. Busy? Quiet? Clear? Scattered?",
      "Now you know where you are. That is your starting point.",
    ],
  },
  {
    id: "charge_and_drain",
    title: "CHARGE & DRAIN",
    icon: "⚡",
    duration: 5,
    tier: ["teen", "adult"],
    section: "energy",
    description: "Learn what fills you up and what steals your energy.",
    steps: [
      "Think back over the last 24 hours.",
      "What gave you energy? What made you feel better, lighter, more alive?",
      "Write it or just hold it in your mind — those are your CHARGERS.",
      "What stole your energy? What left you feeling heavy, drained, low?",
      "Those are your DRAINS.",
      "Over time — do more of the chargers. Protect yourself from the drains.",
      "This is how you manage your own energy. Nobody else can do it for you.",
    ],
  },
  {
    id: "up_and_down",
    title: "UP & DOWN",
    icon: "📈",
    duration: 3,
    tier: ["teen", "adult"],
    section: "energy",
    description: "Notice how your energy moves through the day. Work with it.",
    steps: [
      "Think about yesterday. When were you sharpest?",
      "When did you feel the most dip?",
      "Most people have a pattern — high in the morning, dip after lunch, second wind later.",
      "What is YOUR pattern?",
      "Start putting your hardest tasks in your high energy times.",
      "Use your low times for easy or restful things.",
      "You cannot fight your energy. But you can work with it.",
    ],
  },
];

/* =========================================================
   FOCUS & CLARITY EXERCISES
========================================================= */

export const FOCUS_EXERCISES = [
  {
    id: "drop_the_load",
    title: "DROP THE LOAD",
    icon: "📦",
    duration: 4,
    tier: ["kid", "teen", "adult"],
    section: "focus",
    description: "For when your head is full. Put it all down for a moment.",
    steps: [
      "Close your eyes if you can.",
      "Imagine a big table in front of you.",
      "One by one — take every worry, job, thought, and thing — and place it on the table.",
      "You are not throwing them away. They will be there when you come back.",
      "Right now — you just need to step away from the table for a moment.",
      "Take a breath. You are not carrying it right now.",
      "When you are ready, you can go back and pick up only what you need.",
    ],
  },
  {
    id: "one_thing",
    title: "ONE THING AT A TIME",
    icon: "🎯",
    duration: 3,
    tier: ["kid", "teen", "adult"],
    section: "focus",
    description: "Bring your mind back to what you are actually doing right now.",
    steps: [
      "Notice what you are doing right now. Just this one thing.",
      "Every time your mind runs off somewhere else — notice it. That is normal.",
      "Gently bring it back. No frustration. Just — back to this.",
      "You are not failing when your mind wanders. You are succeeding every time you bring it back.",
      "Each time you bring it back is one rep of mental fitness.",
      "Keep going. One thing. Right now.",
    ],
  },
  {
    id: "make_space",
    title: "MAKE SPACE",
    icon: "🌌",
    duration: 4,
    tier: ["teen", "adult"],
    section: "focus",
    description: "See your thoughts like cars going past. You watch them. You don't have to get in.",
    steps: [
      "Sit quietly for a moment.",
      "Notice the thoughts coming into your mind.",
      "Do not try to stop them or chase them.",
      "Just watch them. Like cars going past on a road.",
      "You can see them. You do not have to get in.",
      "You are not your thoughts. You are the one watching them.",
      "From here — you choose which ones get your attention.",
    ],
  },
];

/* =========================================================
   DEEP MEDITATIONS — locked until level 4+
========================================================= */

export const DEEP_MEDITATIONS = [
  {
    id: "zone_mapping",
    title: "MAP YOUR ZONES",
    icon: "🗺️",
    duration: 15,
    tier: ["teen", "adult"],
    section: "deep",
    requiresLevel: 4,
    requiresSafeLocation: true,
    description: "Build your internal LEOIDS. Map your Green, Amber, and Red zones.",
    steps: [
      "Find somewhere comfortable and quiet. Close your eyes.",
      "Think about a time you felt completely safe, calm, clear, and strong. That is your GREEN ZONE.",
      "What does it feel like in your body when you are in Green? Hold that feeling.",
      "Now think about a time when things started to get hard — tired, stressed, starting to lose it. That is AMBER.",
      "What happens in your body at the first moment you move from Green into Amber?",
      "That moment — that first sign — is your early warning. Learn it.",
      "Now think about RED — overwhelmed, gone, lost control. What causes it for you?",
      "What brings you back? What always works to pull you out of Red?",
      "You now have your map. Green is home. Amber is the warning. Red is the limit.",
      "Your job is to stay in Green as much as possible — and catch yourself in Amber before you hit Red.",
    ],
  },
  {
    id: "inner_safe_place",
    title: "BUILD YOUR INNER SAFE PLACE",
    icon: "🏠",
    duration: 20,
    tier: ["teen", "adult"],
    section: "deep",
    requiresLevel: 4,
    requiresSafeLocation: true,
    description: "Build a place in your mind that is 100% yours. Nobody else can get in.",
    steps: [
      "Close your eyes. Take 3 slow deep breaths.",
      "Imagine you are walking somewhere. It can be real or made up.",
      "Find a place that feels completely safe. Completely yours.",
      "What does the ground feel like under your feet?",
      "What does the air smell like?",
      "What can you see around you? Sky, walls, trees, water?",
      "What sounds do you hear?",
      "Is there anyone else here with you, or are you alone? Either is fine.",
      "This place is yours. Nobody can touch it. Nobody can take it.",
      "Spend a few minutes just being here.",
      "You can come back any time. In any situation. In seconds.",
      "All you have to do is close your eyes and walk back in.",
    ],
  },
  {
    id: "observer_mind",
    title: "OBSERVER MIND",
    icon: "🧠",
    duration: 15,
    tier: ["teen", "adult"],
    section: "deep",
    requiresLevel: 6,
    requiresSafeLocation: true,
    description: "Learn the difference between you and what you think. Stay in control.",
    steps: [
      "Close your eyes and settle.",
      "Notice what thoughts are in your mind right now.",
      "Here is the key thing — you are not those thoughts. You are the one who is watching them.",
      "The part of you that can watch your thoughts — that is the Observer.",
      "The Observer never panics. Never gets pulled in. Never loses control.",
      "Practice being the Observer right now. Just watch.",
      "A thought comes — you see it. It passes — you let it go.",
      "You do not need to fix every thought or feeling.",
      "You just need to remember — you are not them. You are watching them.",
      "From this place — you are always in control.",
    ],
  },
  {
    id: "flow_state",
    title: "FLOW STATE",
    icon: "🌊",
    duration: 20,
    tier: ["adult"],
    section: "deep",
    requiresLevel: 8,
    requiresSafeLocation: true,
    description: "Learn how to get into that state where everything connects and works easy.",
    steps: [
      "Think of a time when you were completely in the zone. Totally absorbed.",
      "What were you doing? How did time feel?",
      "Flow happens when your skill matches the challenge. Not too easy. Not too hard.",
      "Close your eyes. Slow your breathing right down.",
      "Feel yourself becoming present — not in the past, not in the future. Just here.",
      "Let your mind soften. No forcing. No pushing.",
      "Think about what you are about to do today.",
      "Imagine yourself doing it with total ease and clarity.",
      "Everything flowing. Everything connecting. Everything working.",
      "That state is available to you. You have been there before.",
      "You can find it again.",
    ],
  },
];

/* =========================================================
   GET CONTENT BY SECTION
========================================================= */

export function getContentBySection(section, tier = "adult") {
  const all = [
    ...GROUNDING_EXERCISES,
    ...AWARENESS_EXERCISES,
    ...ENERGY_EXERCISES,
    ...FOCUS_EXERCISES,
    ...DEEP_MEDITATIONS,
  ];

  return all.filter(item =>
    item.section === section &&
    (item.tier.includes(tier) || item.tier.includes("adult"))
  );
}

export function getAllContent(tier = "adult") {
  return [
    ...GROUNDING_EXERCISES,
    ...AWARENESS_EXERCISES,
    ...ENERGY_EXERCISES,
    ...FOCUS_EXERCISES,
    ...DEEP_MEDITATIONS,
  ].filter(item => item.tier.includes(tier) || item.tier.includes("adult"));
}

export function getContentById(id) {
  return [
    ...GROUNDING_EXERCISES,
    ...AWARENESS_EXERCISES,
    ...ENERGY_EXERCISES,
    ...FOCUS_EXERCISES,
    ...DEEP_MEDITATIONS,
  ].find(item => item.id === id) || null;
}
