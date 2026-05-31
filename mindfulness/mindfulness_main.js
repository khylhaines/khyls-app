/* =========================================================
   MINDFULNESS SYSTEM — MAIN ENTRY POINT
   Barrow Quest
   =========================================================
   Loads all sections. Main home screen. Wires everything.
   Import this from app.js and call initMindfulness()
========================================================= */

import {
  loadMindfulnessProfile,
  saveMindfulnessProfile,
  awardMindfulnessXP,
  MINDFULNESS_BADGES,
} from "./mindfulness_profile.js";

import {
  openMorningCheckin,
  startStateExercise,
  MINDFULNESS_STATES,
} from "./mindfulness_engine.js";

import {
  getContentBySection,
  getContentById,
  DEEP_MEDITATIONS,
} from "./mindfulness_content.js";

/* =========================================================
   MINDFULNESS HOME SCREEN
========================================================= */

export function openMindfulnessHome() {
  const old = document.getElementById("mindfulness-home");
  if (old) old.remove();

  const profile = loadMindfulnessProfile();
  const tier = profile.ageTier || "adult";
  const today = new Date().toISOString().slice(0, 10);
  const checkedInToday = profile.todayCheckin?.date === today;
  const currentState = profile.todayState || null;
  const stateObj = MINDFULNESS_STATES.find(s => s.id === currentState);

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  const modal = document.createElement("div");
  modal.id = "mindfulness-home";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;overflow-y:auto;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;padding:18px;">

      <!-- HEADER -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
        <div>
          <div style="font-size:11px;font-weight:900;color:#00d4ff;letter-spacing:.12em;">MINDFULNESS</div>
          <div style="font-size:22px;font-weight:1000;margin-top:2px;">Your Practice</div>
        </div>
        <button id="btn-mind-close" type="button" style="
          width:44px;height:44px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:20px;font-weight:900;cursor:pointer;
        ">✕</button>
      </div>

      <!-- LEVEL & XP -->
      <div style="
        padding:16px;border-radius:18px;margin-bottom:16px;
        background:linear-gradient(135deg,#0f1a2e,#111827);
        border:1px solid rgba(0,212,255,.2);
      ">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <div style="font-size:11px;opacity:.7;letter-spacing:.08em;">LEVEL</div>
            <div style="font-size:28px;font-weight:1000;color:#ffd54a;">${profile.level}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:11px;opacity:.7;letter-spacing:.08em;">STREAK</div>
            <div style="font-size:22px;font-weight:1000;color:#22c55e;">${profile.currentStreak} 🔥</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;opacity:.7;letter-spacing:.08em;">SESSIONS</div>
            <div style="font-size:22px;font-weight:1000;">${profile.totalSessions}</div>
          </div>
        </div>
        <div style="background:rgba(255,255,255,.1);border-radius:99px;height:8px;overflow:hidden;">
          <div style="height:100%;width:${xpPercent}%;background:linear-gradient(90deg,#00d4ff,#00aacc);border-radius:99px;transition:width .5s;"></div>
        </div>
        <div style="font-size:11px;opacity:.6;margin-top:5px;text-align:right;">${profile.xp} / ${profile.xpToNextLevel} XP</div>
      </div>

      <!-- TODAY'S STATE -->
      ${checkedInToday && stateObj ? `
        <div style="
          padding:14px 16px;border-radius:16px;margin-bottom:16px;
          background:rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.35);
          display:flex;align-items:center;gap:12px;
        ">
          <div style="font-size:32px;">${stateObj.icon}</div>
          <div>
            <div style="font-size:11px;opacity:.7;letter-spacing:.08em;">TODAY'S STATE</div>
            <div style="font-size:18px;font-weight:1000;color:#00d4ff;">${stateObj.label}</div>
          </div>
          <button id="btn-change-state" type="button" style="
            margin-left:auto;min-height:36px;padding:0 14px;
            border-radius:12px;background:rgba(255,255,255,.1);
            color:white;font-weight:900;border:none;cursor:pointer;font-size:12px;
          ">CHANGE</button>
        </div>
      ` : `
        <button id="btn-morning-checkin" type="button" style="
          width:100%;min-height:64px;border-radius:20px;margin-bottom:16px;
          background:linear-gradient(180deg,#00e5ff,#00d4ff 55%,#00aacc);
          color:#05070b;font-weight:1000;font-size:17px;border:none;cursor:pointer;
          box-shadow:0 0 28px rgba(0,212,255,.35);
        ">🌅 MORNING CHECK-IN</button>
      `}

      <!-- QUICK PRACTICES -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:900;color:#ffd54a;letter-spacing:.08em;margin-bottom:10px;">QUICK PRACTICES</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">

          <button class="practice-btn" data-section="grounding" type="button" style="
            min-height:80px;border-radius:18px;padding:14px;
            background:linear-gradient(135deg,#0f2233,#111827);
            border:1px solid rgba(0,212,255,.2);color:white;cursor:pointer;text-align:left;
          ">
            <div style="font-size:24px;">🌍</div>
            <div style="font-size:13px;font-weight:900;margin-top:6px;">GROUNDING</div>
            <div style="font-size:11px;opacity:.7;margin-top:2px;">Come back to now</div>
          </button>

          <button class="practice-btn" data-section="awareness" type="button" style="
            min-height:80px;border-radius:18px;padding:14px;
            background:linear-gradient(135deg,#0f2233,#111827);
            border:1px solid rgba(0,212,255,.2);color:white;cursor:pointer;text-align:left;
          ">
            <div style="font-size:24px;">👁️</div>
            <div style="font-size:13px;font-weight:900;margin-top:6px;">AWARENESS</div>
            <div style="font-size:11px;opacity:.7;margin-top:2px;">Stay switched on</div>
          </button>

          <button class="practice-btn" data-section="energy" type="button" style="
            min-height:80px;border-radius:18px;padding:14px;
            background:linear-gradient(135deg,#0f2233,#111827);
            border:1px solid rgba(0,212,255,.2);color:white;cursor:pointer;text-align:left;
          ">
            <div style="font-size:24px;">🔋</div>
            <div style="font-size:13px;font-weight:900;margin-top:6px;">ENERGY</div>
            <div style="font-size:11px;opacity:.7;margin-top:2px;">Charge up. Balance out.</div>
          </button>

          <button class="practice-btn" data-section="focus"
            ${!profile.unlockedSections.includes("focus") ? 'data-locked="true"' : ""}
            type="button" style="
            min-height:80px;border-radius:18px;padding:14px;
            background:linear-gradient(135deg,${profile.unlockedSections.includes("focus") ? "#0f2233" : "#111"},#111827);
            border:1px solid ${profile.unlockedSections.includes("focus") ? "rgba(0,212,255,.2)" : "rgba(255,255,255,.08)"};
            color:${profile.unlockedSections.includes("focus") ? "white" : "rgba(255,255,255,.4)"};
            cursor:${profile.unlockedSections.includes("focus") ? "pointer" : "default"};text-align:left;
          ">
            <div style="font-size:24px;">${profile.unlockedSections.includes("focus") ? "🎯" : "🔒"}</div>
            <div style="font-size:13px;font-weight:900;margin-top:6px;">FOCUS</div>
            <div style="font-size:11px;opacity:.7;margin-top:2px;">${profile.unlockedSections.includes("focus") ? "Clear the noise" : "Unlock at level 2"}</div>
          </button>

        </div>
      </div>

      <!-- DEEP MEDITATION -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:900;color:#ffd54a;letter-spacing:.08em;margin-bottom:10px;">DEEP WORK</div>

        <button id="btn-deep-meditation" type="button" style="
          width:100%;min-height:70px;border-radius:18px;padding:16px;
          background:linear-gradient(135deg,${profile.unlockedSections.includes("deep") ? "#0f1f0f" : "#111"},#111827);
          border:1px solid ${profile.unlockedSections.includes("deep") ? "rgba(34,197,94,.3)" : "rgba(255,255,255,.08)"};
          color:${profile.unlockedSections.includes("deep") ? "white" : "rgba(255,255,255,.4)"};
          cursor:${profile.unlockedSections.includes("deep") ? "pointer" : "default"};
          text-align:left;display:flex;align-items:center;gap:14px;
        ">
          <div style="font-size:32px;">${profile.unlockedSections.includes("deep") ? "🧘" : "🔒"}</div>
          <div>
            <div style="font-size:15px;font-weight:900;">DEEP MEDITATION</div>
            <div style="font-size:12px;opacity:.75;margin-top:3px;">
              ${profile.unlockedSections.includes("deep") ? "Inner safe place, observer mind, flow state" : "Unlocks at level 5 — must be at home"}
            </div>
          </div>
        </button>
      </div>

      <!-- BADGES -->
      ${profile.badges.length ? `
        <div style="margin-bottom:16px;">
          <div style="font-size:13px;font-weight:900;color:#ffd54a;letter-spacing:.08em;margin-bottom:10px;">YOUR BADGES</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${profile.badges.map(badgeId => {
              const badge = MINDFULNESS_BADGES.find(b => b.id === badgeId);
              return badge ? `
                <div style="
                  padding:8px 12px;border-radius:12px;
                  background:rgba(255,213,74,.12);border:1px solid rgba(255,213,74,.35);
                  display:flex;align-items:center;gap:6px;
                ">
                  <span style="font-size:18px;">${badge.icon}</span>
                  <span style="font-size:12px;font-weight:900;color:#ffd54a;">${badge.label}</span>
                </div>
              ` : "";
            }).join("")}
          </div>
        </div>
      ` : ""}

      <!-- SETTINGS -->
      <button id="btn-mind-settings" type="button" style="
        width:100%;min-height:48px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;margin-bottom:10px;
      ">⚙️ Settings & Age Tier</button>

      <button id="btn-mind-close-bottom" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>

    </div>
  `;

  document.body.appendChild(modal);

  // Close
  document.getElementById("btn-mind-close")?.addEventListener("click", () => modal.remove());
  document.getElementById("btn-mind-close-bottom")?.addEventListener("click", () => modal.remove());

  // Morning check-in
  document.getElementById("btn-morning-checkin")?.addEventListener("click", () => {
    modal.remove();
    openMorningCheckin();
  });

  // Change state
  document.getElementById("btn-change-state")?.addEventListener("click", () => {
    modal.remove();
    openMorningCheckin();
  });

  // Practice sections
  modal.querySelectorAll(".practice-btn").forEach(btn => {
    if (btn.dataset.locked) return;
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;
      modal.remove();
      openPracticeSection(section);
    });
  });

  // Deep meditation
  document.getElementById("btn-deep-meditation")?.addEventListener("click", () => {
    if (!profile.unlockedSections.includes("deep")) return;
    modal.remove();
    openDeepMeditationSection();
  });

  // Settings
  document.getElementById("btn-mind-settings")?.addEventListener("click", () => {
    modal.remove();
    openMindfulnessSettings();
  });
}

/* =========================================================
   PRACTICE SECTION SCREEN
========================================================= */

export function openPracticeSection(section) {
  const profile = loadMindfulnessProfile();
  const tier = profile.ageTier || "adult";
  const exercises = getContentBySection(section, tier);

  const sectionLabels = {
    grounding: { label: "GROUNDING", icon: "🌍", color: "#00d4ff" },
    awareness: { label: "AWARENESS", icon: "👁️", color: "#ffd54a" },
    energy: { label: "ENERGY", icon: "🔋", color: "#22c55e" },
    focus: { label: "FOCUS", icon: "🎯", color: "#ff9f00" },
    deep: { label: "DEEP WORK", icon: "🧘", color: "#a78bfa" },
  };

  const sec = sectionLabels[section] || sectionLabels.grounding;

  const old = document.getElementById("mindfulness-section-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "mindfulness-section-screen";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:520px;margin:0 auto;">

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-section-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div>
          <div style="font-size:11px;color:${sec.color};font-weight:900;letter-spacing:.12em;">${sec.icon} ${sec.label}</div>
          <div style="font-size:20px;font-weight:1000;">Choose a Practice</div>
        </div>
      </div>

      <div style="display:grid;gap:12px;margin-bottom:16px;">
        ${exercises.map(ex => `
          <button class="exercise-btn" data-id="${ex.id}" type="button" style="
            width:100%;padding:16px;border-radius:18px;text-align:left;
            background:linear-gradient(135deg,#0f1a2e,#111827);
            border:1px solid rgba(255,255,255,.1);color:white;cursor:pointer;
            display:flex;align-items:center;gap:14px;
          ">
            <div style="font-size:32px;flex-shrink:0;">${ex.icon}</div>
            <div>
              <div style="font-size:15px;font-weight:900;">${ex.title}</div>
              <div style="font-size:12px;opacity:.75;margin-top:3px;line-height:1.4;">${ex.description}</div>
              <div style="font-size:11px;color:${sec.color};margin-top:5px;">${ex.duration} min</div>
            </div>
          </button>
        `).join("")}
      </div>

      <button id="btn-section-close" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-section-back")?.addEventListener("click", () => {
    modal.remove();
    openMindfulnessHome();
  });

  document.getElementById("btn-section-close")?.addEventListener("click", () => modal.remove());

  modal.querySelectorAll(".exercise-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const ex = getContentById(btn.dataset.id);
      if (!ex) return;
      modal.remove();
      openExerciseScreen(ex);
    });
  });
}

/* =========================================================
   EXERCISE SCREEN
========================================================= */

export function openExerciseScreen(exercise) {
  const old = document.getElementById("mindfulness-exercise-player");
  if (old) old.remove();

  let currentStep = 0;

  const modal = document.createElement("div");
  modal.id = "mindfulness-exercise-player";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;display:flex;flex-direction:column;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  const renderStep = () => {
    const step = exercise.steps[currentStep];
    const isLast = currentStep === exercise.steps.length - 1;
    const progress = Math.round(((currentStep + 1) / exercise.steps.length) * 100);

    const content = document.getElementById("exercise-content");
    if (!content) return;

    content.innerHTML = `
      <!-- PROGRESS -->
      <div style="padding:16px 18px 0;flex-shrink:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:12px;opacity:.7;">Step ${currentStep + 1} of ${exercise.steps.length}</div>
          <div style="font-size:12px;color:#00d4ff;font-weight:900;">${progress}%</div>
        </div>
        <div style="background:rgba(255,255,255,.1);border-radius:99px;height:4px;">
          <div style="height:100%;width:${progress}%;background:#00d4ff;border-radius:99px;transition:width .3s;"></div>
        </div>
      </div>

      <!-- STEP CONTENT -->
      <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:28px;text-align:center;">
        <div style="max-width:420px;">
          <div style="font-size:52px;margin-bottom:18px;">${exercise.icon}</div>
          <div style="font-size:20px;font-weight:900;line-height:1.5;color:white;">${step}</div>
        </div>
      </div>

      <!-- BUTTONS -->
      <div style="padding:16px 18px;display:grid;gap:10px;flex-shrink:0;">
        <button id="btn-step-next" type="button" style="
          width:100%;min-height:56px;border-radius:18px;
          background:linear-gradient(180deg,#00e5ff,#00d4ff 55%,#00aacc);
          color:#05070b;font-weight:1000;font-size:16px;border:none;cursor:pointer;
        ">${isLast ? "COMPLETE ✓" : "NEXT →"}</button>

        ${currentStep > 0 ? `
          <button id="btn-step-back" type="button" style="
            width:100%;min-height:44px;border-radius:16px;
            background:#111827;color:white;font-weight:900;
            border:1px solid rgba(255,255,255,.1);cursor:pointer;
          ">← BACK</button>
        ` : `
          <button id="btn-step-quit" type="button" style="
            width:100%;min-height:44px;border-radius:16px;
            background:#111827;color:white;font-weight:900;
            border:1px solid rgba(255,255,255,.1);cursor:pointer;
          ">QUIT</button>
        `}
      </div>
    `;

    // Wire buttons
    document.getElementById("btn-step-next")?.addEventListener("click", () => {
      if (isLast) {
        completeExercise(exercise);
        modal.remove();
      } else {
        currentStep++;
        renderStep();
      }
    });

    document.getElementById("btn-step-back")?.addEventListener("click", () => {
      currentStep--;
      renderStep();
    });

    document.getElementById("btn-step-quit")?.addEventListener("click", () => {
      modal.remove();
      openMindfulnessHome();
    });
  };

  modal.innerHTML = `
    <!-- HEADER -->
    <div style="
      padding:14px 18px;background:rgba(0,0,0,.3);
      border-bottom:1px solid rgba(255,255,255,.08);
      flex-shrink:0;
    ">
      <div style="font-size:11px;color:#00d4ff;font-weight:900;letter-spacing:.12em;">${exercise.title}</div>
      <div style="font-size:14px;opacity:.75;margin-top:2px;">${exercise.duration} minute practice</div>
    </div>
    <div id="exercise-content" style="flex:1;display:flex;flex-direction:column;min-height:0;"></div>
  `;

  document.body.appendChild(modal);
  renderStep();
}

/* =========================================================
   COMPLETE EXERCISE
========================================================= */

function completeExercise(exercise) {
  const xpAmount = exercise.requiresSafeLocation ? 40 : 20;
  awardMindfulnessXP(xpAmount, exercise.id);

  const profile = loadMindfulnessProfile();

  // Track counts for badges
  if (exercise.section === "grounding") profile.groundingCount = (profile.groundingCount || 0) + 1;
  if (exercise.section === "awareness") profile.awarenessCount = (profile.awarenessCount || 0) + 1;
  if (exercise.section === "focus") profile.focusCount = (profile.focusCount || 0) + 1;
  if (exercise.id === "zone_mapping") profile.zoneMappingCount = (profile.zoneMappingCount || 0) + 1;

  saveMindfulnessProfile(profile);

  // Completion toast
  const toast = document.createElement("div");
  toast.style.cssText = `
    position:fixed;top:20px;left:50%;transform:translateX(-50%);
    z-index:9999999;
    background:#22c55e;color:#05070b;font-weight:1000;font-size:15px;
    padding:14px 22px;border-radius:18px;
    box-shadow:0 0 24px rgba(34,197,94,.5);
    font-family:system-ui,-apple-system,sans-serif;
    white-space:nowrap;
  `;
  toast.innerText = `✓ ${exercise.title} complete  +${xpAmount} XP`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
    setTimeout(() => toast.remove(), 420);
  }, 3000);

  setTimeout(() => openMindfulnessHome(), 400);
}

/* =========================================================
   DEEP MEDITATION SECTION
========================================================= */

export function openDeepMeditationSection() {
  const profile = loadMindfulnessProfile();

  const old = document.getElementById("mindfulness-deep-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "mindfulness-deep-screen";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  const atSafeLocation = profile.safeLocationSet;

  modal.innerHTML = `
    <div style="max-width:520px;margin:0 auto;">

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-deep-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div>
          <div style="font-size:11px;color:#a78bfa;font-weight:900;letter-spacing:.12em;">🧘 DEEP WORK</div>
          <div style="font-size:20px;font-weight:1000;">Deep Meditation</div>
        </div>
      </div>

      ${!atSafeLocation ? `
        <div style="
          padding:14px;border-radius:16px;margin-bottom:16px;
          background:rgba(255,176,0,.12);border:1px solid rgba(255,176,0,.35);
        ">
          <div style="font-weight:900;color:#ffb000;">⚠️ SAFE LOCATION REQUIRED</div>
          <div style="font-size:13px;opacity:.85;margin-top:6px;line-height:1.5;">
            Deep meditation only unlocks when you are at your safe location (home). Mark your safe location in settings first.
          </div>
          <button id="btn-mark-safe" type="button" style="
            width:100%;min-height:44px;border-radius:14px;
            background:#ffb000;color:#05070b;font-weight:1000;
            border:none;cursor:pointer;margin-top:10px;
          ">MARK THIS AS MY SAFE LOCATION</button>
        </div>
      ` : ""}

      <div style="display:grid;gap:12px;margin-bottom:16px;">
        ${DEEP_MEDITATIONS.map(med => {
          const locked = med.requiresLevel > profile.level || (med.requiresSafeLocation && !atSafeLocation);
          return `
            <button class="deep-btn" data-id="${med.id}" ${locked ? "disabled" : ""} type="button" style="
              width:100%;padding:16px;border-radius:18px;text-align:left;
              background:linear-gradient(135deg,${locked ? "#111" : "#0f1a2e"},#111827);
              border:1px solid ${locked ? "rgba(255,255,255,.06)" : "rgba(167,139,250,.25)"};
              color:${locked ? "rgba(255,255,255,.35)" : "white"};
              cursor:${locked ? "default" : "pointer"};
              display:flex;align-items:center;gap:14px;
            ">
              <div style="font-size:32px;flex-shrink:0;">${locked ? "🔒" : med.icon}</div>
              <div>
                <div style="font-size:15px;font-weight:900;">${med.title}</div>
                <div style="font-size:12px;opacity:.75;margin-top:3px;line-height:1.4;">${med.description}</div>
                <div style="font-size:11px;margin-top:5px;color:${locked ? "rgba(255,255,255,.35)" : "#a78bfa"};">
                  ${locked ? `Requires level ${med.requiresLevel}` : `${med.duration} minutes`}
                </div>
              </div>
            </button>
          `;
        }).join("")}
      </div>

      <button id="btn-deep-close" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-deep-back")?.addEventListener("click", () => {
    modal.remove();
    openMindfulnessHome();
  });

  document.getElementById("btn-deep-close")?.addEventListener("click", () => modal.remove());

  document.getElementById("btn-mark-safe")?.addEventListener("click", () => {
    const p = loadMindfulnessProfile();
    p.safeLocationSet = true;
    saveMindfulnessProfile(p);
    modal.remove();
    openDeepMeditationSection();
  });

  modal.querySelectorAll(".deep-btn:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => {
      const ex = DEEP_MEDITATIONS.find(m => m.id === btn.dataset.id);
      if (!ex) return;
      modal.remove();
      openExerciseScreen(ex);
    });
  });
}

/* =========================================================
   MINDFULNESS SETTINGS
========================================================= */

function openMindfulnessSettings() {
  const profile = loadMindfulnessProfile();

  const old = document.getElementById("mindfulness-settings");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "mindfulness-settings";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#070d1a,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:520px;margin:0 auto;">

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-msettings-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Mindfulness Settings</div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">AGE TIER</div>
        ${["kid", "teen", "adult"].map(t => `
          <label style="
            display:flex;align-items:center;gap:12px;
            padding:12px;border-radius:14px;margin-bottom:8px;cursor:pointer;
            background:${profile.ageTier === t ? "rgba(0,212,255,.12)" : "rgba(255,255,255,.04)"};
            border:1px solid ${profile.ageTier === t ? "rgba(0,212,255,.45)" : "rgba(255,255,255,.08)"};
          ">
            <input type="radio" name="age-tier" value="${t}" ${profile.ageTier === t ? "checked" : ""} style="width:18px;height:18px;" />
            <div style="font-weight:900;">${t === "kid" ? "👦 KID (under 12)" : t === "teen" ? "🧑 TEEN (12-17)" : "🧑‍💼 ADULT (18+)"}</div>
          </label>
        `).join("")}
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">SAFE LOCATION</div>
        <div style="font-size:13px;opacity:.8;margin-bottom:10px;">
          Mark your home or safe place to unlock deep meditation content.
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="flex:1;font-weight:900;color:${profile.safeLocationSet ? "#22c55e" : "rgba(255,255,255,.5)"};">
            ${profile.safeLocationSet ? "✓ Safe location marked" : "Not set"}
          </div>
          <button id="btn-toggle-safe" type="button" style="
            min-height:40px;padding:0 16px;border-radius:12px;
            background:${profile.safeLocationSet ? "#3a1111" : "#22c55e"};
            color:${profile.safeLocationSet ? "white" : "#05070b"};
            font-weight:1000;border:none;cursor:pointer;font-size:13px;
          ">${profile.safeLocationSet ? "UNMARK" : "MARK HERE"}</button>
        </div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:10px;">YOUR PROGRESS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="padding:10px;border-radius:12px;background:rgba(255,255,255,.06);text-align:center;">
            <div style="font-size:10px;opacity:.65;">LEVEL</div>
            <div style="font-size:22px;font-weight:1000;color:#ffd54a;">${profile.level}</div>
          </div>
          <div style="padding:10px;border-radius:12px;background:rgba(255,255,255,.06);text-align:center;">
            <div style="font-size:10px;opacity:.65;">STREAK</div>
            <div style="font-size:22px;font-weight:1000;color:#22c55e;">${profile.currentStreak} days</div>
          </div>
          <div style="padding:10px;border-radius:12px;background:rgba(255,255,255,.06);text-align:center;">
            <div style="font-size:10px;opacity:.65;">SESSIONS</div>
            <div style="font-size:22px;font-weight:1000;">${profile.totalSessions}</div>
          </div>
          <div style="padding:10px;border-radius:12px;background:rgba(255,255,255,.06);text-align:center;">
            <div style="font-size:10px;opacity:.65;">BADGES</div>
            <div style="font-size:22px;font-weight:1000;color:#ffd54a;">${profile.badges.length}</div>
          </div>
        </div>
      </div>

      <button id="btn-msettings-save" type="button" style="
        width:100%;min-height:52px;border-radius:16px;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-weight:1000;border:none;cursor:pointer;margin-bottom:10px;
      ">SAVE SETTINGS</button>

      <button id="btn-msettings-close" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-msettings-back")?.addEventListener("click", () => {
    modal.remove();
    openMindfulnessHome();
  });

  document.getElementById("btn-msettings-close")?.addEventListener("click", () => modal.remove());

  document.getElementById("btn-toggle-safe")?.addEventListener("click", () => {
    profile.safeLocationSet = !profile.safeLocationSet;
    saveMindfulnessProfile(profile);
    modal.remove();
    openMindfulnessSettings();
  });

  document.getElementById("btn-msettings-save")?.addEventListener("click", () => {
    const selectedTier = document.querySelector("input[name='age-tier']:checked")?.value || "adult";
    profile.ageTier = selectedTier;
    saveMindfulnessProfile(profile);
    modal.remove();
    openMindfulnessHome();
  });
}

/* =========================================================
   INIT — call from app.js
========================================================= */

export function initMindfulness() {
  window.openMindfulnessHome = openMindfulnessHome;
  window.openMorningCheckin = openMorningCheckin;
  window.openPracticeSection = openPracticeSection;
  window.openExerciseScreen = openExerciseScreen;
  window.openDeepMeditationSection = openDeepMeditationSection;

  console.log("Mindfulness system initialised.");
}
