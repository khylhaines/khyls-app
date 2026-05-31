/* =========================================================
   MINDFULNESS SYSTEM — ENGINE & ADAPTIVE LOGIC
   Barrow Quest
   =========================================================
   Drives all logic, questions, routines, adaptive system
   Learns your patterns and serves the right content
========================================================= */

import {
  loadMindfulnessProfile,
  saveMindfulnessProfile,
  saveCheckinEntry,
  awardMindfulnessXP,
  getSuggestedState,
  getMindfulnessTierText,
} from "./mindfulness_profile.js";

/* =========================================================
   STATE OPTIONS
========================================================= */

export const MINDFULNESS_STATES = [
  { id: "CALM", icon: "🌊", label: "CALM", desc: "Slow down. Breathe easy." },
  { id: "FOCUSED", icon: "🎯", label: "FOCUSED", desc: "Sharp and on it." },
  { id: "STRONG", icon: "💪", label: "STRONG", desc: "Powered up and ready." },
  { id: "CREATIVE", icon: "✨", label: "CREATIVE", desc: "Open and flowing." },
  { id: "STEADY", icon: "⚖️", label: "STEADY", desc: "Balanced and grounded." },
  { id: "READY", icon: "🚀", label: "READY", desc: "Set and switched on." },
  { id: "GENTLE", icon: "🌿", label: "GENTLE", desc: "Easy does it today." },
];

/* =========================================================
   MORNING CHECK-IN FLOW
========================================================= */

export function openMorningCheckin() {
  const profile = loadMindfulnessProfile();
  const tier = profile.ageTier || "adult";

  // Check if already done today
  const today = new Date().toISOString().slice(0, 10);
  if (profile.todayCheckin?.date === today) {
    openMindfulnessHome();
    return;
  }

  const old = document.getElementById("mindfulness-checkin-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "mindfulness-checkin-screen";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  const greeting = getMindfulnessTierText("greeting", tier);

  modal.innerHTML = `
    <div style="max-width:520px;margin:0 auto;">

      <div style="text-align:center;padding:24px 0 18px;">
        <div style="font-size:42px;margin-bottom:10px;">🧘</div>
        <div style="font-size:11px;color:#00d4ff;font-weight:900;letter-spacing:.12em;margin-bottom:6px;">MORNING CHECK-IN</div>
        <div style="font-size:18px;font-weight:900;line-height:1.4;">${greeting}</div>
      </div>

      <!-- Q1: SLEEP -->
      <div class="checkin-card" style="padding:16px;border-radius:18px;background:#0f1a2e;border:1px solid rgba(255,255,255,.08);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">
          ${getMindfulnessTierText("sleep_question", tier)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="sleep-options">
          ${["Very Deep", "Good", "Normal", "Light", "Restless", "Hardly slept"].map(opt => `
            <button class="checkin-option" data-group="sleep" data-value="${opt}" type="button" style="
              min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.06);color:white;font-weight:900;font-size:13px;cursor:pointer;
            ">${opt}</button>
          `).join("")}
        </div>
      </div>

      <!-- Q2: ENERGY -->
      <div class="checkin-card" style="padding:16px;border-radius:18px;background:#0f1a2e;border:1px solid rgba(255,255,255,.08);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">
          ${getMindfulnessTierText("energy_question", tier)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="energy-options">
          ${["Full", "Good", "Normal", "Low", "Very Low", "Heavy"].map(opt => `
            <button class="checkin-option" data-group="energy" data-value="${opt}" type="button" style="
              min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.06);color:white;font-weight:900;font-size:13px;cursor:pointer;
            ">${opt}</button>
          `).join("")}
        </div>
      </div>

      <!-- Q3: HEAD -->
      <div class="checkin-card" style="padding:16px;border-radius:18px;background:#0f1a2e;border:1px solid rgba(255,255,255,.08);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">
          ${getMindfulnessTierText("head_question", tier)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="head-options">
          ${["Clear", "Sharp", "Normal", "Busy", "Full", "Foggy"].map(opt => `
            <button class="checkin-option" data-group="head" data-value="${opt}" type="button" style="
              min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.06);color:white;font-weight:900;font-size:13px;cursor:pointer;
            ">${opt}</button>
          `).join("")}
        </div>
      </div>

      <!-- Q4: BODY -->
      <div class="checkin-card" style="padding:16px;border-radius:18px;background:#0f1a2e;border:1px solid rgba(255,255,255,.08);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">
          ${getMindfulnessTierText("body_question", tier)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="body-options">
          ${["Good", "Comfortable", "Normal", "Achey", "Tense", "Heavy"].map(opt => `
            <button class="checkin-option" data-group="body" data-value="${opt}" type="button" style="
              min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.06);color:white;font-weight:900;font-size:13px;cursor:pointer;
            ">${opt}</button>
          `).join("")}
        </div>
      </div>

      <!-- Q5: MAIN THING -->
      <div class="checkin-card" style="padding:16px;border-radius:18px;background:#0f1a2e;border:1px solid rgba(255,255,255,.08);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">
          ${getMindfulnessTierText("main_thing", tier)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="main-options">
          ${["Work", "School", "Family", "Rest", "Create", "Travel", "Something Important", "Just getting through"].map(opt => `
            <button class="checkin-option" data-group="main" data-value="${opt}" type="button" style="
              min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.15);
              background:rgba(255,255,255,.06);color:white;font-weight:900;font-size:13px;cursor:pointer;
            ">${opt}</button>
          `).join("")}
        </div>
      </div>

      <button id="btn-checkin-submit" type="button" style="
        width:100%;min-height:56px;border-radius:18px;
        background:linear-gradient(180deg,#00e5ff,#00d4ff 55%,#00aacc);
        color:#05070b;font-weight:1000;font-size:16px;
        border:none;cursor:pointer;margin-bottom:10px;
        opacity:.5;
      " disabled>SET MY STATE FOR TODAY</button>

      <button id="btn-checkin-skip" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">SKIP FOR NOW</button>

    </div>

    <style>
      .checkin-option.selected {
        background: rgba(0,212,255,.22) !important;
        border-color: rgba(0,212,255,.75) !important;
        color: #00d4ff !important;
      }
    </style>
  `;

  document.body.appendChild(modal);

  // Selection tracking
  const selections = { sleep: null, energy: null, head: null, body: null, main: null };

  const checkAllSelected = () => {
    const allDone = Object.values(selections).every(v => v !== null);
    const btn = document.getElementById("btn-checkin-submit");
    if (btn) {
      btn.disabled = !allDone;
      btn.style.opacity = allDone ? "1" : ".5";
    }
  };

  modal.querySelectorAll(".checkin-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group;
      const value = btn.dataset.value;

      // Deselect others in group
      modal.querySelectorAll(`[data-group="${group}"]`).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      selections[group] = value;
      checkAllSelected();
    });
  });

  document.getElementById("btn-checkin-skip")?.addEventListener("click", () => {
    modal.remove();
    openMindfulnessHome();
  });

  document.getElementById("btn-checkin-submit")?.addEventListener("click", () => {
    const checkin = {
      sleepQuality: selections.sleep,
      energy: selections.energy,
      headState: selections.head,
      bodyState: selections.body,
      mainThing: selections.main,
    };

    const savedEntry = saveCheckinEntry(checkin);
    const updatedProfile = loadMindfulnessProfile();
    const suggestedState = getSuggestedState(savedEntry, updatedProfile);

    modal.remove();
    openStateSelector(suggestedState, savedEntry, updatedProfile);
  });
}

/* =========================================================
   STATE SELECTOR
   Shows suggested state, lets user pick or change
========================================================= */

export function openStateSelector(suggestedState, checkin, profile) {
  const old = document.getElementById("mindfulness-state-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "mindfulness-state-screen";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  const suggested = MINDFULNESS_STATES.find(s => s.id === suggestedState) || MINDFULNESS_STATES[4];

  modal.innerHTML = `
    <div style="max-width:520px;margin:0 auto;">

      <div style="text-align:center;padding:20px 0 16px;">
        <div style="font-size:11px;color:#00d4ff;font-weight:900;letter-spacing:.12em;margin-bottom:8px;">SET YOUR STATE</div>
        <div style="font-size:16px;opacity:.85;line-height:1.5;">
          From what you said and what I know about you,<br>
          I think today you will do best being:
        </div>
      </div>

      <!-- SUGGESTED STATE -->
      <div style="
        padding:20px;border-radius:22px;margin-bottom:20px;text-align:center;
        background:rgba(0,212,255,.12);border:2px solid rgba(0,212,255,.55);
      ">
        <div style="font-size:48px;margin-bottom:8px;">${suggested.icon}</div>
        <div style="font-size:26px;font-weight:1000;color:#00d4ff;">${suggested.label}</div>
        <div style="font-size:14px;opacity:.85;margin-top:6px;">${suggested.desc}</div>
      </div>

      <div style="font-size:13px;opacity:.75;text-align:center;margin-bottom:14px;">
        Or pick a different state:
      </div>

      <!-- ALL STATES -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
        ${MINDFULNESS_STATES.filter(s => s.id !== suggested.id).map(state => `
          <button class="state-option" data-state="${state.id}" type="button" style="
            min-height:70px;border-radius:16px;
            background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
            color:white;cursor:pointer;padding:12px;
          ">
            <div style="font-size:24px;">${state.icon}</div>
            <div style="font-size:13px;font-weight:900;margin-top:4px;">${state.label}</div>
          </button>
        `).join("")}
      </div>

      <button id="btn-use-suggested" type="button" style="
        width:100%;min-height:56px;border-radius:18px;
        background:linear-gradient(180deg,#00e5ff,#00d4ff 55%,#00aacc);
        color:#05070b;font-weight:1000;font-size:16px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">USE ${suggested.label} — SET MY DAY</button>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-use-suggested")?.addEventListener("click", () => {
    modal.remove();
    startStateExercise(suggested.id, profile);
  });

  modal.querySelectorAll(".state-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const stateId = btn.dataset.state;
      modal.remove();
      startStateExercise(stateId, profile);
    });
  });
}

/* =========================================================
   STATE EXERCISE LAUNCHER
   Picks the right breathing/movement exercise for the state
========================================================= */

export function startStateExercise(stateId, profile) {
  const exercises = {
    CALM: { title: "BOX BREATH", icon: "🌊", duration: 4, instruction: "Breathe In 4 → Hold 4 → Out 4 → Hold 4.\nRepeat 4 times. Let everything slow down." },
    FOCUSED: { title: "SHARP BREATH", icon: "🎯", duration: 3, instruction: "Breathe In 4 → Hold 7 → Out 8.\nClears the head and brings sharp focus." },
    STRONG: { title: "POWER BREATH", icon: "💪", duration: 3, instruction: "Breathe In deep through nose → Hold 2 → Strong exhale through mouth.\nFeel your energy rise with each breath." },
    CREATIVE: { title: "OPEN BREATH", icon: "✨", duration: 3, instruction: "Slow breath in → Pause at the top → Long slow breath out.\nLet your mind open and soften." },
    STEADY: { title: "GROUNDING BREATH", icon: "⚖️", duration: 4, instruction: "Feel your feet on the floor.\nBreathe In 4 → Out 6. Slow and steady." },
    READY: { title: "ACTIVATION BREATH", icon: "🚀", duration: 3, instruction: "Short sharp breath in → Hold 2 → Strong out.\nDo this 3 times. Switch yourself on." },
    GENTLE: { title: "SOFT BREATH", icon: "🌿", duration: 5, instruction: "Very slow breath in through nose → Very slow out.\nNo force. Just soft and easy." },
  };

  const exercise = exercises[stateId] || exercises.STEADY;

  const old = document.getElementById("mindfulness-exercise-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "mindfulness-exercise-screen";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:28px;text-align:center;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:480px;width:100%;">
      <div style="font-size:64px;margin-bottom:14px;">${exercise.icon}</div>
      <div style="font-size:11px;color:#00d4ff;font-weight:900;letter-spacing:.12em;margin-bottom:6px;">SET YOUR STATE</div>
      <div style="font-size:24px;font-weight:1000;margin-bottom:14px;">${exercise.title}</div>

      <div style="
        padding:20px;border-radius:20px;margin-bottom:22px;
        background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
        font-size:16px;line-height:1.7;white-space:pre-line;
      ">${exercise.instruction}</div>

      <!-- Breath circle animation -->
      <div id="breath-circle" style="
        width:120px;height:120px;border-radius:50%;margin:0 auto 24px;
        background:rgba(0,212,255,.18);border:3px solid #00d4ff;
        display:flex;align-items:center;justify-content:center;
        font-size:14px;font-weight:900;color:#00d4ff;
        transition:transform .5s ease,background .5s ease;
      ">BREATHE</div>

      <div id="breath-instruction" style="font-size:16px;font-weight:900;color:#00d4ff;margin-bottom:24px;min-height:24px;"></div>

      <button id="btn-exercise-done" type="button" style="
        width:100%;min-height:54px;border-radius:18px;
        background:linear-gradient(180deg,#00e5ff,#00d4ff 55%,#00aacc);
        color:#05070b;font-weight:1000;font-size:16px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">I'M READY — DONE</button>

      <button id="btn-exercise-skip" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">SKIP EXERCISE</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Breath animation
  startBreathAnimation(exercise.duration);

  const finish = () => {
    modal.remove();
    stopBreathAnimation();
    awardMindfulnessXP(20, "morning checkin");
    openMindfulnessHome();
  };

  document.getElementById("btn-exercise-done")?.addEventListener("click", finish);
  document.getElementById("btn-exercise-skip")?.addEventListener("click", finish);
}

/* =========================================================
   BREATH ANIMATION
========================================================= */

let breathInterval = null;

function startBreathAnimation(cycleSecs = 4) {
  stopBreathAnimation();

  const circle = document.getElementById("breath-circle");
  const instruction = document.getElementById("breath-instruction");
  if (!circle || !instruction) return;

  const phases = [
    { label: "BREATHE IN", scale: 1.35, bg: "rgba(0,212,255,.35)", duration: cycleSecs * 1000 },
    { label: "HOLD", scale: 1.35, bg: "rgba(0,212,255,.25)", duration: cycleSecs * 500 },
    { label: "BREATHE OUT", scale: 1, bg: "rgba(0,212,255,.1)", duration: cycleSecs * 1000 },
    { label: "HOLD", scale: 1, bg: "rgba(0,212,255,.08)", duration: cycleSecs * 500 },
  ];

  let phaseIndex = 0;

  const runPhase = () => {
    const phase = phases[phaseIndex % phases.length];
    circle.style.transform = `scale(${phase.scale})`;
    circle.style.background = phase.bg;
    if (instruction) instruction.innerText = phase.label;
    phaseIndex++;
    breathInterval = setTimeout(runPhase, phase.duration);
  };

  runPhase();
}

function stopBreathAnimation() {
  if (breathInterval) {
    clearTimeout(breathInterval);
    breathInterval = null;
  }
}


