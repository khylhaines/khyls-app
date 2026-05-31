/* =========================================================
   MINDFULNESS SYSTEM — ROUTINES
   Barrow Quest
   =========================================================
   Daily flows: morning, midday check-in, evening wind down,
   bedtime, and stress reset. Each one is a guided routine
   that walks the user through step by step.
========================================================= */

import {
  loadMindfulnessProfile,
  saveMindfulnessProfile,
  awardMindfulnessXP,
  getMindfulnessTierText,
} from "./mindfulness_profile.js";

/* =========================================================
   ALL ROUTINES DEFINITION
========================================================= */

export const ROUTINES = [
  {
    id: "morning_setup",
    title: "MORNING SETUP",
    icon: "🌅",
    duration: 5,
    description: "Set yourself up right for the day. Check in, pick your state, breathe.",
    tier: ["kid", "teen", "adult"],
    timeOfDay: "morning",
    steps: [
      { type: "intro", text: "Good morning. This takes about 5 minutes and sets you up properly for the day." },
      { type: "breath", text: "Start with 3 slow breaths. In through the nose. Out through the mouth. Let everything settle.", duration: 30 },
      { type: "scan", text: "Quick body scan. Feet. Legs. Belly. Chest. Shoulders. Head. Just notice. No fixing. Just checking in." },
      { type: "question", text: "What is the one most important thing you need to bring today — energy, focus, calm, or patience?" },
      { type: "intention", text: "Set your intention. Say it quietly in your head: Today I will bring ___. Keep it simple. One thing." },
      { type: "breath", text: "One final breath. In for 4. Hold for 2. Out for 6. You are set. Go.", duration: 15 },
    ],
  },
  {
    id: "midday_reset",
    title: "MIDDAY RESET",
    icon: "☀️",
    duration: 3,
    description: "Quick reset in the middle of the day. Clears the head, refills the tank.",
    tier: ["teen", "adult"],
    timeOfDay: "midday",
    steps: [
      { type: "intro", text: "3 minute midday reset. Stop everything for a moment." },
      { type: "breath", text: "4 box breaths. In 4 — Hold 4 — Out 4 — Hold 4. Do this 4 times now.", duration: 60, hasBreathCircle: true },
      { type: "scan", text: "Where are you carrying tension right now? Jaw? Shoulders? Hands? Take a breath into that place and let it soften." },
      { type: "question", text: "What has been the best thing so far today? Hold it for a second. Let it land." },
      { type: "intention", text: "What does the rest of the day need from you? Pick one word. Bring that." },
    ],
  },
  {
    id: "evening_winddown",
    title: "EVENING WIND DOWN",
    icon: "🌆",
    duration: 7,
    description: "Transition from the day. Let go of what happened. Prepare for rest.",
    tier: ["kid", "teen", "adult"],
    timeOfDay: "evening",
    steps: [
      { type: "intro", text: "Evening wind down. Time to start letting the day go." },
      { type: "breath", text: "Breathe in slowly. Breathe out even slower. Let your body start to shift gear.", duration: 30 },
      { type: "review", text: "Think back over today. What went well? Even one small thing counts. Hold it. That happened." },
      { type: "review", text: "What was hard today? Acknowledge it. You do not need to fix it right now. Just name it and set it down." },
      { type: "gratitude", text: "Three things you are grateful for from today. They can be tiny. The point is to find them." },
      { type: "body", text: "Roll your shoulders back. Relax your jaw. Unclench your hands. Let your body know — the day is ending." },
      { type: "breath", text: "Long slow breath in. Even longer breath out. You made it through today. That is enough.", duration: 30 },
    ],
  },
  {
    id: "bedtime_settle",
    title: "BEDTIME SETTLE",
    icon: "🌙",
    duration: 10,
    description: "Guided wind down for sleep. Slow breathing, body relaxation, mind quiet.",
    tier: ["kid", "teen", "adult"],
    timeOfDay: "bedtime",
    requiresSafeLocation: true,
    steps: [
      { type: "intro", text: "Bedtime. Find a comfortable position. You do not need to do anything except breathe and follow along." },
      { type: "breath", text: "Breathe in for 4. Hold for 4. Breathe out for 8. The long out-breath activates your rest system. Repeat slowly.", duration: 60, hasBreathCircle: true },
      { type: "body", text: "Start at your feet. Tense them for 3 seconds. Then let go completely. Feel them sink." },
      { type: "body", text: "Move up to your calves and thighs. Tense for 3 seconds. Release. Let them go heavy." },
      { type: "body", text: "Belly and chest. Tense. Hold. Release. Feel your breathing slow." },
      { type: "body", text: "Shoulders and arms. Pull them up toward your ears. Hold. Drop them. Feel the weight leave." },
      { type: "body", text: "Face and jaw. Scrunch everything up. Hold. Let go completely. Soft face. Soft jaw." },
      { type: "visualise", text: "Your whole body is now heavy and soft. Imagine you are somewhere safe and quiet. Warm. Still. Nothing needed from you." },
      { type: "breath", text: "Just breathe now. Slow and steady. In and out. Let sleep come to you. You do not need to chase it.", duration: 60 },
    ],
  },
  {
    id: "stress_reset",
    title: "STRESS RESET",
    icon: "🔴",
    duration: 4,
    description: "When things are getting too much. Quick emergency reset to bring you back.",
    tier: ["teen", "adult"],
    timeOfDay: "anytime",
    steps: [
      { type: "intro", text: "Stop. You are okay. This takes 4 minutes and it works. Follow along." },
      { type: "grounding", text: "Name 5 things you can see right now. Say them out loud or in your head. Take your time." },
      { type: "breath", text: "Breathe in through your nose for 4 counts. Hold for 4. Out through your mouth for 8. Repeat 4 times.", duration: 60, hasBreathCircle: true },
      { type: "grounding", text: "Feel your feet on the floor. Feel your weight in the chair or on the ground. You are here. You are safe." },
      { type: "scan", text: "Where in your body is the stress sitting right now? Breathe directly into that place. Imagine space opening up there." },
      { type: "question", text: "Is there anything you can actually do about this right now? If yes — one small step. If no — set it down for now." },
      { type: "breath", text: "One more slow breath. In for 4. Out for 8. You handled it. You are still here.", duration: 20 },
    ],
  },
  {
    id: "kids_calm",
    title: "CALM DOWN",
    icon: "🌈",
    duration: 3,
    description: "For when things feel too big. A simple calm-down routine for kids.",
    tier: ["kid"],
    timeOfDay: "anytime",
    steps: [
      { type: "intro", text: "Hey. It is okay. Let us do something together to help you feel better." },
      { type: "breath", text: "Breathe in and make yourself as big as you can. Then breathe out and go all floppy like a rag doll. Do that 3 times.", duration: 30 },
      { type: "grounding", text: "Look around the room. Find something red. Find something blue. Find something that makes you smile." },
      { type: "body", text: "Shake your hands out like you are shaking off water. Shake your arms. Roll your shoulders. Get rid of the yucky feeling." },
      { type: "breath", text: "One big slow breath in. Hold it for a second. Then let it all out with a big sigh. Ahhhh. Better.", duration: 20 },
      { type: "intention", text: "You are okay. You handled that. What is one good thing about right now?" },
    ],
  },
  {
    id: "focus_boost",
    title: "FOCUS BOOST",
    icon: "🎯",
    duration: 4,
    description: "Before a big task, exam, or anything that needs full concentration.",
    tier: ["teen", "adult"],
    timeOfDay: "anytime",
    steps: [
      { type: "intro", text: "4 minute focus boost. Use this before anything that needs your full attention." },
      { type: "breath", text: "In for 4. Hold for 7. Out for 8. This breath pattern sharpens focus fast. Do it 3 times.", duration: 45, hasBreathCircle: true },
      { type: "scan", text: "Clear your physical space if you can. Tidy one thing. Your environment affects your focus more than you think." },
      { type: "intention", text: "What exactly are you about to do? Say it specifically. Not 'work' — say the actual task. Get precise." },
      { type: "question", text: "How long will you focus for? Pick a realistic time. 25 minutes is usually the sweet spot. Commit to it." },
      { type: "breath", text: "Final breath. In. Hold. Out. You are sharp. You are ready. Start now.", duration: 15 },
    ],
  },
];

/* =========================================================
   ROUTINES HOME SCREEN
========================================================= */

export function openRoutinesHome() {
  const profile = loadMindfulnessProfile();
  const tier = profile.ageTier || "adult";
  const hour = new Date().getHours();

  const old = document.getElementById("mindfulness-routines-home");
  if (old) old.remove();

  // Work out what time of day it is
  let timeOfDay = "anytime";
  if (hour >= 5 && hour < 11) timeOfDay = "morning";
  else if (hour >= 11 && hour < 15) timeOfDay = "midday";
  else if (hour >= 15 && hour < 20) timeOfDay = "evening";
  else if (hour >= 20 || hour < 5) timeOfDay = "bedtime";

  const timeLabel = {
    morning: "Good morning",
    midday: "Good afternoon",
    evening: "Good evening",
    bedtime: "Time to wind down",
    anytime: "Good to see you",
  }[timeOfDay] || "Good to see you";

  // Filter routines by tier
  const availableRoutines = ROUTINES.filter(r =>
    r.tier.includes(tier) || r.tier.includes("adult")
  );

  // Suggested routine for this time
  const suggested = availableRoutines.find(r => r.timeOfDay === timeOfDay)
    || availableRoutines[0];

  const modal = document.createElement("div");
  modal.id = "mindfulness-routines-home";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:520px;margin:0 auto;">

      <!-- HEADER -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-routines-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div>
          <div style="font-size:11px;color:#00d4ff;font-weight:900;letter-spacing:.12em;">ROUTINES</div>
          <div style="font-size:20px;font-weight:1000;">${timeLabel}</div>
        </div>
      </div>

      <!-- SUGGESTED -->
      ${suggested ? `
        <div style="margin-bottom:18px;">
          <div style="font-size:12px;color:#ffd54a;font-weight:900;letter-spacing:.08em;margin-bottom:10px;">
            SUGGESTED FOR NOW
          </div>
          <button id="btn-suggested-routine" data-id="${suggested.id}" type="button" style="
            width:100%;padding:18px;border-radius:20px;text-align:left;
            background:linear-gradient(135deg,rgba(0,212,255,.15),rgba(0,170,204,.08));
            border:2px solid rgba(0,212,255,.45);color:white;cursor:pointer;
            display:flex;align-items:center;gap:16px;
          ">
            <div style="font-size:42px;flex-shrink:0;">${suggested.icon}</div>
            <div>
              <div style="font-size:17px;font-weight:1000;">${suggested.title}</div>
              <div style="font-size:13px;opacity:.8;margin-top:4px;line-height:1.4;">${suggested.description}</div>
              <div style="font-size:11px;color:#00d4ff;margin-top:6px;">${suggested.duration} minutes</div>
            </div>
          </button>
        </div>
      ` : ""}

      <!-- ALL ROUTINES -->
      <div style="font-size:12px;color:#ffd54a;font-weight:900;letter-spacing:.08em;margin-bottom:10px;">
        ALL ROUTINES
      </div>

      <div style="display:grid;gap:10px;margin-bottom:16px;">
        ${availableRoutines.map(routine => {
          const isLocked = routine.requiresSafeLocation && !profile.safeLocationSet;
          return `
            <button class="routine-btn" data-id="${routine.id}" ${isLocked ? "disabled" : ""} type="button" style="
              width:100%;padding:14px 16px;border-radius:16px;text-align:left;
              background:linear-gradient(135deg,${isLocked ? "#111" : "#0f1a2e"},#111827);
              border:1px solid ${isLocked ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.1)"};
              color:${isLocked ? "rgba(255,255,255,.35)" : "white"};
              cursor:${isLocked ? "default" : "pointer"};
              display:flex;align-items:center;gap:14px;
            ">
              <div style="font-size:28px;flex-shrink:0;">${isLocked ? "🔒" : routine.icon}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:14px;font-weight:900;">${routine.title}</div>
                <div style="font-size:12px;opacity:.7;margin-top:2px;line-height:1.3;">${routine.description}</div>
              </div>
              <div style="font-size:11px;opacity:.65;flex-shrink:0;">${routine.duration}m</div>
            </button>
          `;
        }).join("")}
      </div>

      <button id="btn-routines-close" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-routines-back")?.addEventListener("click", () => {
    modal.remove();
    window.openMindfulnessHome?.();
  });

  document.getElementById("btn-routines-close")?.addEventListener("click", () => modal.remove());

  document.getElementById("btn-suggested-routine")?.addEventListener("click", () => {
    if (!suggested) return;
    modal.remove();
    openRoutinePlayer(suggested);
  });

  modal.querySelectorAll(".routine-btn:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => {
      const routine = ROUTINES.find(r => r.id === btn.dataset.id);
      if (!routine) return;
      modal.remove();
      openRoutinePlayer(routine);
    });
  });
}

/* =========================================================
   ROUTINE PLAYER
   Walks through each step one at a time
========================================================= */

export function openRoutinePlayer(routine) {
  if (!routine) return;

  let currentStep = 0;
  let stepTimer = null;
  let breathInterval = null;

  const old = document.getElementById("mindfulness-routine-player");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "mindfulness-routine-player";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;display:flex;flex-direction:column;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <!-- HEADER -->
    <div style="
      padding:14px 18px;
      background:rgba(0,0,0,.3);
      border-bottom:1px solid rgba(255,255,255,.08);
      flex-shrink:0;display:flex;align-items:center;gap:12px;
    ">
      <div style="font-size:24px;">${routine.icon}</div>
      <div style="flex:1;">
        <div style="font-size:11px;color:#00d4ff;font-weight:900;letter-spacing:.12em;">ROUTINE</div>
        <div style="font-size:16px;font-weight:1000;">${routine.title}</div>
      </div>
      <button id="btn-routine-quit" type="button" style="
        width:38px;height:38px;border-radius:50%;
        background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
        font-size:16px;cursor:pointer;flex-shrink:0;
      ">✕</button>
    </div>

    <!-- PROGRESS BAR -->
    <div style="height:3px;background:rgba(255,255,255,.1);flex-shrink:0;">
      <div id="routine-progress-bar" style="height:100%;background:#00d4ff;transition:width .4s;width:0%;"></div>
    </div>

    <!-- STEP CONTENT -->
    <div id="routine-step-content" style="
      flex:1;display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      padding:28px 20px;text-align:center;min-height:0;overflow-y:auto;
    "></div>

    <!-- TIMER (shown for breath steps) -->
    <div id="routine-timer-bar" style="
      padding:0 18px 8px;flex-shrink:0;display:none;
    ">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div style="font-size:12px;opacity:.65;">Breathing time</div>
        <div id="routine-timer-text" style="font-size:14px;font-weight:900;color:#00d4ff;">0s</div>
      </div>
      <div style="background:rgba(255,255,255,.1);border-radius:99px;height:6px;overflow:hidden;">
        <div id="routine-timer-fill" style="height:100%;background:#00d4ff;border-radius:99px;transition:width 1s linear;width:100%;"></div>
      </div>
    </div>

    <!-- BOTTOM BUTTONS -->
    <div style="padding:14px 18px;display:grid;gap:10px;flex-shrink:0;">
      <button id="btn-routine-next" type="button" style="
        width:100%;min-height:54px;border-radius:18px;
        background:linear-gradient(180deg,#00e5ff,#00d4ff 55%,#00aacc);
        color:#05070b;font-weight:1000;font-size:16px;border:none;cursor:pointer;
      ">NEXT →</button>
      <button id="btn-routine-back-step" type="button" style="
        width:100%;min-height:42px;border-radius:14px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;display:none;
      ">← BACK</button>
    </div>
  `;

  document.body.appendChild(modal);

  function stopTimers() {
    if (stepTimer) { clearInterval(stepTimer); stepTimer = null; }
    if (breathInterval) { clearTimeout(breathInterval); breathInterval = null; }
  }

  function renderStep() {
    stopTimers();

    const step = routine.steps[currentStep];
    if (!step) return;

    const isLast = currentStep === routine.steps.length - 1;
    const progress = Math.round(((currentStep + 1) / routine.steps.length) * 100);

    // Update progress bar
    const progressBar = document.getElementById("routine-progress-bar");
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Update next button
    const nextBtn = document.getElementById("btn-routine-next");
    if (nextBtn) nextBtn.innerText = isLast ? "COMPLETE ✓" : "NEXT →";

    // Show/hide back button
    const backBtn = document.getElementById("btn-routine-back-step");
    if (backBtn) backBtn.style.display = currentStep > 0 ? "block" : "none";

    // Get step icon
    const stepIcons = {
      intro: "🧘",
      breath: "🫁",
      scan: "🔍",
      question: "💭",
      intention: "🎯",
      review: "📋",
      gratitude: "🙏",
      body: "💪",
      grounding: "🌍",
      visualise: "🌙",
    };

    const icon = stepIcons[step.type] || "⚡";

    // Render step content
    const content = document.getElementById("routine-step-content");
    if (content) {
      content.innerHTML = `
        <div style="max-width:420px;width:100%;">
          <div style="font-size:58px;margin-bottom:16px;">${icon}</div>
          <div style="
            font-size:11px;color:#00d4ff;font-weight:900;
            letter-spacing:.12em;margin-bottom:12px;
          ">
            STEP ${currentStep + 1} OF ${routine.steps.length}
          </div>
          <div style="
            font-size:19px;font-weight:900;line-height:1.55;
            color:white;
          ">${step.text}</div>

          ${step.hasBreathCircle ? `
            <div id="breath-circle-routine" style="
              width:110px;height:110px;border-radius:50%;
              margin:24px auto 0;
              background:rgba(0,212,255,.18);
              border:3px solid #00d4ff;
              display:flex;align-items:center;justify-content:center;
              font-size:13px;font-weight:900;color:#00d4ff;
              transition:transform .5s ease,background .5s ease;
            ">BREATHE</div>
            <div id="breath-phase-text" style="
              font-size:15px;font-weight:900;color:#00d4ff;
              margin-top:12px;min-height:22px;
            "></div>
          ` : ""}
        </div>
      `;
    }

    // Handle timed steps
    if (step.duration) {
      const timerBar = document.getElementById("routine-timer-bar");
      const timerText = document.getElementById("routine-timer-text");
      const timerFill = document.getElementById("routine-timer-fill");

      if (timerBar) timerBar.style.display = "block";

      let remaining = step.duration;

      if (timerText) timerText.innerText = `${remaining}s`;
      if (timerFill) timerFill.style.width = "100%";

      // Small delay so CSS transition works
      setTimeout(() => {
        if (timerFill) {
          timerFill.style.transition = `width ${step.duration}s linear`;
          timerFill.style.width = "0%";
        }
      }, 100);

      stepTimer = setInterval(() => {
        remaining--;
        if (timerText) timerText.innerText = `${remaining}s`;

        if (remaining <= 0) {
          clearInterval(stepTimer);
          stepTimer = null;
          if (timerText) timerText.innerText = "Done";
        }
      }, 1000);
    } else {
      const timerBar = document.getElementById("routine-timer-bar");
      if (timerBar) timerBar.style.display = "none";
    }

    // Start breath animation if needed
    if (step.hasBreathCircle) {
      startRoutineBreathAnimation();
    }
  }

  function startRoutineBreathAnimation() {
    const phases = [
      { label: "BREATHE IN", scale: 1.3, bg: "rgba(0,212,255,.35)", ms: 4000 },
      { label: "HOLD", scale: 1.3, bg: "rgba(0,212,255,.2)", ms: 4000 },
      { label: "BREATHE OUT", scale: 1, bg: "rgba(0,212,255,.1)", ms: 4000 },
      { label: "HOLD", scale: 1, bg: "rgba(0,212,255,.08)", ms: 4000 },
    ];

    let phaseIndex = 0;

    const runPhase = () => {
      const circle = document.getElementById("breath-circle-routine");
      const phaseText = document.getElementById("breath-phase-text");
      if (!circle || !phaseText) return;

      const phase = phases[phaseIndex % phases.length];
      circle.style.transform = `scale(${phase.scale})`;
      circle.style.background = phase.bg;
      phaseText.innerText = phase.label;
      phaseIndex++;

      breathInterval = setTimeout(runPhase, phase.ms);
    };

    runPhase();
  }

  // Wire buttons
  document.getElementById("btn-routine-quit")?.addEventListener("click", () => {
    stopTimers();
    modal.remove();
    openRoutinesHome();
  });

  document.getElementById("btn-routine-next")?.addEventListener("click", () => {
    const isLast = currentStep === routine.steps.length - 1;

    if (isLast) {
      stopTimers();
      completeRoutine(routine);
      modal.remove();
      return;
    }

    currentStep++;
    renderStep();
  });

  document.getElementById("btn-routine-back-step")?.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  });

  // Start
  renderStep();
}

/* =========================================================
   COMPLETE ROUTINE
========================================================= */

function completeRoutine(routine) {
  const xpAmount = routine.requiresSafeLocation ? 35 : 25;
  awardMindfulnessXP(xpAmount, routine.id);

  const profile = loadMindfulnessProfile();
  profile.totalMinutes = Number(profile.totalMinutes || 0) + Number(routine.duration || 0);
  saveMindfulnessProfile(profile);

  // Completion screen
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999999;
    background:rgba(0,0,0,.92);
    display:flex;align-items:center;justify-content:center;
    padding:20px;
    font-family:system-ui,-apple-system,sans-serif;
  `;

  overlay.innerHTML = `
    <div style="
      width:min(92vw,420px);text-align:center;color:white;
      border:2px solid #00d4ff;border-radius:28px;
      background:linear-gradient(180deg,#101827,#05070b);
      padding:28px;box-shadow:0 0 42px rgba(0,212,255,.25);
    ">
      <div style="font-size:58px;margin-bottom:12px;">${routine.icon}</div>
      <div style="font-size:13px;color:#00d4ff;font-weight:900;letter-spacing:.12em;margin-bottom:6px;">ROUTINE COMPLETE</div>
      <div style="font-size:24px;font-weight:1000;margin-bottom:10px;">${routine.title}</div>
      <div style="font-size:14px;opacity:.8;line-height:1.5;margin-bottom:18px;">
        ${routine.duration} minutes done.<br>+${xpAmount} XP earned.
      </div>
      <button id="btn-routine-done" type="button" style="
        width:100%;min-height:50px;border-radius:16px;
        background:#00d4ff;color:#05070b;font-weight:1000;
        border:none;cursor:pointer;font-size:15px;
      ">DONE</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("btn-routine-done")?.addEventListener("click", () => {
    overlay.remove();
    window.openMindfulnessHome?.();
  });
}

/* =========================================================
   GET ROUTINE FOR TIME OF DAY
   Returns the best routine for right now
========================================================= */

export function getSuggestedRoutine(tier = "adult") {
  const hour = new Date().getHours();

  let timeOfDay = "anytime";
  if (hour >= 5 && hour < 11) timeOfDay = "morning";
  else if (hour >= 11 && hour < 15) timeOfDay = "midday";
  else if (hour >= 15 && hour < 20) timeOfDay = "evening";
  else if (hour >= 20 || hour < 5) timeOfDay = "bedtime";

  const available = ROUTINES.filter(r => r.tier.includes(tier) || r.tier.includes("adult"));

  return available.find(r => r.timeOfDay === timeOfDay)
    || available.find(r => r.timeOfDay === "anytime")
    || available[0]
    || null;
}

/* =========================================================
   EXPORTS
========================================================= */
