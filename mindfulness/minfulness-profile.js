/* =========================================================
   MINDFULNESS SYSTEM — PROFILE & ADAPTIVE LEARNING
   Barrow Quest
   =========================================================
   Saves all user data, patterns, stats, levels
   Learns when you wake, how you feel, your energy
   Builds your personal pattern profile over time
========================================================= */

const MINDFULNESS_STORAGE_KEY = "bq_mindfulness_v1";

/* =========================================================
   DEFAULT PROFILE
========================================================= */

function createDefaultMindfulnessProfile() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),

    // Basic info
    ageTier: "adult", // kid / teen / adult

    // Level & XP
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,

    // Badges earned
    badges: [],

    // Today's check-in
    todayCheckin: null,
    todayState: null,

    // Full check-in history — one entry per day
    checkinHistory: [],

    // Pattern profile — built over time
    patterns: {
      averageWakeTime: null,
      bestEnergyDays: [],
      lowEnergyTriggers: [],
      stressTriggers: [],
      focusNeeds: [],
      calmNeeds: [],
      totalDataPoints: 0,
    },

    // Unlocked content
    unlockedSections: ["grounding", "awareness", "energy"],
    unlockedMeditations: [],

    // Settings
    safeLocationSet: false,
    safeLocationName: "Home",
    notificationsEnabled: false,
    morningReminderTime: "07:00",
  };
}

/* =========================================================
   LOAD / SAVE
========================================================= */

function loadMindfulnessProfile() {
  try {
    const raw = localStorage.getItem(MINDFULNESS_STORAGE_KEY);
    if (!raw) return createDefaultMindfulnessProfile();
    return { ...createDefaultMindfulnessProfile(), ...JSON.parse(raw) };
  } catch {
    return createDefaultMindfulnessProfile();
  }
}

function saveMindfulnessProfile(profile) {
  try {
    localStorage.setItem(MINDFULNESS_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   SAVE CHECK-IN ENTRY
========================================================= */

function saveCheckinEntry(entry) {
  const profile = loadMindfulnessProfile();

  const fullEntry = {
    id: `checkin_${Date.now()}`,
    timestamp: new Date().toISOString(),
    dayOfWeek: new Date().toLocaleDateString("en-GB", { weekday: "long" }),
    date: new Date().toISOString().slice(0, 10),
    wakeTime: new Date().toTimeString().slice(0, 5),
    ...entry,
  };

  if (!Array.isArray(profile.checkinHistory)) profile.checkinHistory = [];

  // Replace today's entry if already exists
  const todayDate = fullEntry.date;
  profile.checkinHistory = profile.checkinHistory.filter(e => e.date !== todayDate);
  profile.checkinHistory.unshift(fullEntry);

  // Keep last 365 entries
  profile.checkinHistory = profile.checkinHistory.slice(0, 365);

  profile.todayCheckin = fullEntry;
  profile.todayState = entry.selectedState || null;

  saveMindfulnessProfile(profile);

  // Run pattern analysis
  analysePatterns(profile);

  return fullEntry;
}

/* =========================================================
   AWARD XP
========================================================= */

function awardMindfulnessXP(amount = 10, reason = "") {
  const profile = loadMindfulnessProfile();

  profile.xp = Number(profile.xp || 0) + amount;
  profile.totalSessions = Number(profile.totalSessions || 0) + 1;

  // Level up check
  while (profile.xp >= profile.xpToNextLevel) {
    profile.xp -= profile.xpToNextLevel;
    profile.level = Number(profile.level || 1) + 1;
    profile.xpToNextLevel = Math.floor(100 * Math.pow(1.25, profile.level - 1));

    unlockContentForLevel(profile);

    showMindfulnessLevelUp(profile.level);
  }

  // Streak
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (profile.lastPracticeDate === yesterday) {
    profile.currentStreak = Number(profile.currentStreak || 0) + 1;
  } else if (profile.lastPracticeDate !== today) {
    profile.currentStreak = 1;
  }

  if (profile.currentStreak > Number(profile.longestStreak || 0)) {
    profile.longestStreak = profile.currentStreak;
  }

  profile.lastPracticeDate = today;

  saveMindfulnessProfile(profile);

  checkMindfulnessBadges(profile);

  return profile;
}

/* =========================================================
   UNLOCK CONTENT BY LEVEL
========================================================= */

function unlockContentForLevel(profile) {
  const level = profile.level;

  if (level >= 2) profile.unlockedSections = [...new Set([...profile.unlockedSections, "focus"])];
  if (level >= 3) profile.unlockedSections = [...new Set([...profile.unlockedSections, "balance"])];
  if (level >= 4) profile.unlockedMeditations = [...new Set([...profile.unlockedMeditations, "inner_safe_place"])];
  if (level >= 5) profile.unlockedSections = [...new Set([...profile.unlockedSections, "deep"])];
  if (level >= 6) profile.unlockedMeditations = [...new Set([...profile.unlockedMeditations, "observer_mind"])];
  if (level >= 8) profile.unlockedMeditations = [...new Set([...profile.unlockedMeditations, "flow_state"])];
  if (level >= 10) profile.unlockedMeditations = [...new Set([...profile.unlockedMeditations, "zone_mapping"])];

  return profile;
}

/* =========================================================
   BADGE CHECKER
========================================================= */

const MINDFULNESS_BADGES = [
  { id: "steady_one", label: "STEADY ONE", icon: "🥇", desc: "Complete 7 days in a row", check: (p) => p.currentStreak >= 7 },
  { id: "sharp_eye", label: "SHARP EYE", icon: "👁️", desc: "Complete 5 awareness exercises", check: (p) => (p.awarenessCount || 0) >= 5 },
  { id: "early_warning", label: "EARLY WARNING", icon: "⚡", desc: "Complete zone mapping 3 times", check: (p) => (p.zoneMappingCount || 0) >= 3 },
  { id: "deep_roots", label: "DEEP ROOTS", icon: "🌳", desc: "Complete 10 grounding sessions", check: (p) => (p.groundingCount || 0) >= 10 },
  { id: "clear_light", label: "CLEAR LIGHT", icon: "✨", desc: "Complete 10 focus sessions", check: (p) => (p.focusCount || 0) >= 10 },
  { id: "first_step", label: "FIRST STEP", icon: "🚶", desc: "Complete your first check-in", check: (p) => p.totalSessions >= 1 },
  { id: "week_warrior", label: "WEEK WARRIOR", icon: "📅", desc: "Use the app 7 days total", check: (p) => p.totalSessions >= 7 },
  { id: "level_5", label: "RISING", icon: "🌅", desc: "Reach level 5", check: (p) => p.level >= 5 },
  { id: "level_10", label: "STEADY MIND", icon: "🧘", desc: "Reach level 10", check: (p) => p.level >= 10 },
];

function checkMindfulnessBadges(profile) {
  if (!Array.isArray(profile.badges)) profile.badges = [];

  let newBadge = false;

  MINDFULNESS_BADGES.forEach(badge => {
    if (profile.badges.includes(badge.id)) return;
    if (badge.check(profile)) {
      profile.badges.push(badge.id);
      newBadge = true;
      showMindfulnessBadge(badge);
    }
  });

  if (newBadge) saveMindfulnessProfile(profile);

  return profile;
}

/* =========================================================
   PATTERN ANALYSER
   Runs after each check-in to build personal model
========================================================= */

function analysePatterns(profile) {
  const history = profile.checkinHistory || [];
  if (history.length < 3) return profile;

  const patterns = profile.patterns || {};
  patterns.totalDataPoints = history.length;

  // Average wake time
  const wakeTimes = history
    .filter(e => e.wakeTime)
    .map(e => {
      const [h, m] = e.wakeTime.split(":").map(Number);
      return h * 60 + m;
    });

  if (wakeTimes.length) {
    const avgMinutes = Math.round(wakeTimes.reduce((a, b) => a + b, 0) / wakeTimes.length);
    const h = Math.floor(avgMinutes / 60);
    const m = avgMinutes % 60;
    patterns.averageWakeTime = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // Best energy days
  const energyByDay = {};
  history.forEach(e => {
    if (!e.dayOfWeek || !e.energy) return;
    if (!energyByDay[e.dayOfWeek]) energyByDay[e.dayOfWeek] = [];
    const score = { "Full": 5, "Good": 4, "Normal": 3, "Low": 2, "Very Low": 1, "Heavy": 1 }[e.energy] || 3;
    energyByDay[e.dayOfWeek].push(score);
  });

  const dayAverages = Object.entries(energyByDay).map(([day, scores]) => ({
    day,
    avg: scores.reduce((a, b) => a + b, 0) / scores.length,
  }));

  patterns.bestEnergyDays = dayAverages
    .filter(d => d.avg >= 4)
    .map(d => d.day);

  // Low energy triggers
  const triggers = [];
  history.forEach(e => {
    if (e.sleepQuality === "Hardly slept" || e.sleepQuality === "Restless") {
      if (e.energy === "Low" || e.energy === "Very Low") {
        triggers.push("poor sleep");
      }
    }
    if (e.dayOfWeek === "Monday" && (e.energy === "Low" || e.energy === "Very Low")) {
      triggers.push("Monday");
    }
  });

  patterns.lowEnergyTriggers = [...new Set(triggers)];

  // Focus needs
  const focusNeeds = [];
  history.forEach(e => {
    if (e.mainThing === "Work" || e.mainThing === "School") focusNeeds.push("work day");
    if ((e.sleepQuality === "Hardly slept" || e.sleepQuality === "Light") && e.headState === "Foggy") focusNeeds.push("after bad sleep");
  });
  patterns.focusNeeds = [...new Set(focusNeeds)];

  // Calm needs
  const calmNeeds = [];
  history.forEach(e => {
    if (e.energy === "Full" && e.headState === "Busy") calmNeeds.push("high energy busy head");
    if (e.dayOfWeek === "Friday" && e.headState === "Full") calmNeeds.push("end of week");
  });
  patterns.calmNeeds = [...new Set(calmNeeds)];

  profile.patterns = patterns;
  saveMindfulnessProfile(profile);

  return profile;
}

/* =========================================================
   SMART SUGGESTION ENGINE
   Looks at today's check-in + patterns and suggests state
========================================================= */

function getSuggestedState(checkin, profile) {
  if (!checkin) return "STEADY";

  const { sleepQuality, energy, headState, bodyState, mainThing } = checkin;
  const patterns = profile.patterns || {};

  // Low energy → steady or gentle
  if (energy === "Very Low" || energy === "Heavy") return "GENTLE";

  // Bad sleep → focus help
  if (sleepQuality === "Hardly slept" || sleepQuality === "Restless") {
    if (patterns.focusNeeds?.includes("after bad sleep")) return "FOCUSED";
    return "STEADY";
  }

  // Busy head → calm
  if (headState === "Busy" || headState === "Full") return "CALM";

  // Work day → focused
  if (mainThing === "Work" || mainThing === "School") return "FOCUSED";

  // High energy → strong or creative
  if (energy === "Full" && headState === "Clear") return "STRONG";

  // Rest day → gentle
  if (mainThing === "Rest") return "GENTLE";

  return "STEADY";
}

/* =========================================================
   BADGE DISPLAY
========================================================= */

function showMindfulnessBadge(badge) {
  const old = document.getElementById("mindfulness-badge-popup");
  if (old) old.remove();

  const popup = document.createElement("div");
  popup.id = "mindfulness-badge-popup";
  popup.style.cssText = `
    position:fixed;top:20px;left:50%;transform:translateX(-50%);
    z-index:999999;
    width:min(92vw,380px);
    border:2px solid #ffd54a;border-radius:24px;
    background:linear-gradient(180deg,#171b2b,#05070b);
    color:white;padding:20px;text-align:center;
    box-shadow:0 0 38px rgba(255,213,74,.35);
    font-family:system-ui,-apple-system,sans-serif;
  `;

  popup.innerHTML = `
    <div style="font-size:48px;margin-bottom:8px;">${badge.icon}</div>
    <div style="font-size:11px;color:#ffd54a;font-weight:900;letter-spacing:.12em;margin-bottom:4px;">BADGE UNLOCKED</div>
    <div style="font-size:20px;font-weight:1000;">${badge.label}</div>
    <div style="font-size:13px;opacity:.8;margin-top:6px;">${badge.desc}</div>
  `;

  document.body.appendChild(popup);

  popup.animate(
    [{ opacity: 0, transform: "translateX(-50%) scale(.85)" }, { opacity: 1, transform: "translateX(-50%) scale(1)" }],
    { duration: 350, easing: "ease-out", fill: "forwards" }
  );

  setTimeout(() => {
    popup.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 400, easing: "ease-in", fill: "forwards" }
    );
    setTimeout(() => popup.remove(), 420);
  }, 3500);
}

/* =========================================================
   LEVEL UP DISPLAY
========================================================= */

function showMindfulnessLevelUp(level) {
  const old = document.getElementById("mindfulness-levelup-popup");
  if (old) old.remove();

  const popup = document.createElement("div");
  popup.id = "mindfulness-levelup-popup";
  popup.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:rgba(0,0,0,.88);
    display:flex;align-items:center;justify-content:center;
    padding:20px;
    font-family:system-ui,-apple-system,sans-serif;
  `;

  popup.innerHTML = `
    <div style="
      width:min(92vw,380px);text-align:center;color:white;
      border:2px solid #00d4ff;border-radius:28px;
      background:linear-gradient(180deg,#101827,#05070b);
      padding:28px;box-shadow:0 0 42px rgba(0,212,255,.35);
    ">
      <div style="font-size:58px;margin-bottom:10px;">🧘</div>
      <div style="font-size:13px;color:#00d4ff;font-weight:900;letter-spacing:.12em;margin-bottom:6px;">LEVEL UP</div>
      <div style="font-size:38px;font-weight:1000;color:#ffd54a;">LEVEL ${level}</div>
      <div style="font-size:14px;opacity:.85;margin-top:10px;line-height:1.5;">
        New practices and deeper content unlocked.
      </div>
      <button id="btn-levelup-close" type="button" style="
        margin-top:18px;width:100%;min-height:46px;border-radius:16px;
        background:#00d4ff;color:#05070b;font-weight:1000;border:none;cursor:pointer;
      ">KEEP GOING</button>
    </div>
  `;

  document.body.appendChild(popup);
  document.getElementById("btn-levelup-close")?.addEventListener("click", () => popup.remove());
}

/* =========================================================
   GET AGE TIER TEXT ADJUSTMENTS
========================================================= */

function getMindfulnessTierText(key, tier = "adult") {
  const texts = {
    greeting: {
      kid: "Hey! How are you feeling today?",
      teen: "Quick check-in. How's today starting?",
      adult: "Good morning. Let's check in and get you set for the day.",
    },
    sleep_question: {
      kid: "How did you sleep?",
      teen: "How did you sleep last night?",
      adult: "How did you sleep last night?",
    },
    energy_question: {
      kid: "How full of energy are you?",
      teen: "What's your energy like right now?",
      adult: "How is your ENERGY right now?",
    },
    head_question: {
      kid: "How does your head feel?",
      teen: "What's going on in your head?",
      adult: "How is your HEAD right now?",
    },
    body_question: {
      kid: "How does your body feel?",
      teen: "How is your body feeling?",
      adult: "How is your BODY right now?",
    },
    main_thing: {
      kid: "What are you doing today?",
      teen: "What's your main thing today?",
      adult: "What is your MAIN THING for today?",
    },
  };

  return texts[key]?.[tier] || texts[key]?.adult || "";
}

/* =========================================================
   EXPORTS
========================================================= */

export {
  loadMindfulnessProfile,
  saveMindfulnessProfile,
  saveCheckinEntry,
  awardMindfulnessXP,
  analysePatterns,
  getSuggestedState,
  checkMindfulnessBadges,
  getMindfulnessTierText,
  showMindfulnessBadge,
  showMindfulnessLevelUp,
  MINDFULNESS_BADGES,
};
