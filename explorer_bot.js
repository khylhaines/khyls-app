/* =========================================================
   EXPLORER BOT
   BarrowQuest — Old Tom Location Guide
   =========================================================
   
   What this does:
   - Old Tom pulses and glows when player is near a pin
   - Player taps Old Tom → he introduces the location
   - Menu appears with 8 options
   - Knows who's playing (kids / teen / adult)
   - Generates quizzes and activities from pin data
   - Speaks everything via TTS
   - Connects to Old Tom's local AI brain for deeper answers
   
   Import in app.js:
   import { initExplorerBot } from './explorer_bot.js';
   Then call: initExplorerBot();
========================================================= */

import {
  getPinData,
  getPinIntro,
  getPinQuiz,
  getPinActivities,
  getRandomActivity,
  getRandomQuizQuestion,
} from './explorer_pins_data.js';

// ── Old Tom local AI endpoint ─────────────────────────────
const OLD_TOM_API = "http://192.168.1.71:8000";

// ── State ─────────────────────────────────────────────────
let explorerState = {
  currentPin: null,
  currentPinId: null,
  tier: "kids",
  usedQuizIds: [],
  isOpen: false,
  lastPulsePin: null,
};

// ── Get current tier from app state ──────────────────────
function getCurrentTier() {
  if (window.state?.activePack === "adult") return "adult";
  const tierMode = window.state?.tierMode || "kid";
  if (tierMode === "teen") return "teen";
  if (tierMode === "adult") return "adult";
  return "kids";
}

// ── Text to speech ────────────────────────────────────────
function speak(text) {
  if (window.speakText) {
    window.speakText(text);
  } else if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-GB";
    utt.rate = 0.92;
    window.speechSynthesis.speak(utt);
  }
}

function stopSpeaking() {
  if (window.stopSpeech) window.stopSpeech();
  else if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// ── Ask Old Tom's AI brain for deeper answers ─────────────
async function askOldTomBrain(question, pinName) {
  try {
    const response = await fetch(`${OLD_TOM_API}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `At ${pinName}: ${question}`,
        bot_id: "explorer-bot",
        bot_type: "mapping_bot",
        context: `BarrowQuest Explorer mode at ${pinName}`,
      }),
    });
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.answer || null;
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════
// PULSE & GLOW — Old Tom reacts when near a pin
// ══════════════════════════════════════════════════════════

export function updateExplorerBotPulse(nearbyPin) {
  const btn = document.getElementById("btn-old-tom-float");
  if (!btn) return;

  if (!nearbyPin) {
    // Not near any pin — normal state
    btn.style.boxShadow = "0 0 24px rgba(255,213,74,.35), 0 4px 14px rgba(0,0,0,.5)";
    btn.style.animation = "";
    btn.style.transform = "scale(1)";
    explorerState.lastPulsePin = null;
    return;
  }

  const pinData = getPinData(nearbyPin.id);

  if (pinData && explorerState.lastPulsePin !== nearbyPin.id) {
    // Near a pin with knowledge — pulse and glow
    explorerState.lastPulsePin = nearbyPin.id;

    btn.style.animation = "oldTomPulse 1.5s ease-in-out infinite";
    btn.style.boxShadow = "0 0 40px rgba(255,213,74,.8), 0 0 80px rgba(255,213,74,.4), 0 4px 14px rgba(0,0,0,.5)";

    // Add pulse animation if not already in document
    if (!document.getElementById("old-tom-pulse-style")) {
      const style = document.createElement("style");
      style.id = "old-tom-pulse-style";
      style.textContent = `
        @keyframes oldTomPulse {
          0%   { transform: scale(1);    box-shadow: 0 0 24px rgba(255,213,74,.5), 0 4px 14px rgba(0,0,0,.5); }
          50%  { transform: scale(1.12); box-shadow: 0 0 60px rgba(255,213,74,.9), 0 0 100px rgba(255,213,74,.4); }
          100% { transform: scale(1);    box-shadow: 0 0 24px rgba(255,213,74,.5), 0 4px 14px rgba(0,0,0,.5); }
        }
      `;
      document.head.appendChild(style);
    }
  } else if (!pinData) {
    // Near a pin but no specific knowledge — gentle glow only
    btn.style.animation = "";
    btn.style.boxShadow = "0 0 36px rgba(255,213,74,.55), 0 4px 14px rgba(0,0,0,.5)";
    btn.style.transform = "scale(1)";
  }
}

// ══════════════════════════════════════════════════════════
// OPEN EXPLORER BOT — main entry point
// ══════════════════════════════════════════════════════════

export function openExplorerBot(pin) {
  if (!pin) return;

  explorerState.currentPin = pin;
  explorerState.currentPinId = pin.id;
  explorerState.tier = getCurrentTier();
  explorerState.usedQuizIds = [];
  explorerState.isOpen = true;

  const pinData = getPinData(pin.id);

  if (pinData) {
    // We have specific knowledge for this pin
    showExplorerIntro(pin, pinData);
  } else {
    // No specific data — ask Old Tom's brain directly
    showExplorerGeneric(pin);
  }
}

// ══════════════════════════════════════════════════════════
// INTRO SCREEN
// ══════════════════════════════════════════════════════════

function showExplorerIntro(pin, pinData) {
  const tier = explorerState.tier;
  const intro = getPinIntro(pin.id, tier);

  // Remove any existing explorer modal
  document.getElementById("explorer-bot-modal")?.remove();

  const modal = document.createElement("div");
  modal.id = "explorer-bot-modal";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#0a0c0e,#050709);
    display:flex;flex-direction:column;
    font-family:system-ui,-apple-system,sans-serif;
    overflow:hidden;
  `;

  modal.innerHTML = `
    <!-- HEADER -->
    <div style="
      padding:14px 16px;
      background:linear-gradient(180deg,#1a1508,#0d1008);
      border-bottom:1px solid rgba(255,213,74,.2);
      display:flex;align-items:center;gap:14px;flex-shrink:0;
    ">
      <div style="
        width:48px;height:48px;border-radius:50%;
        background:linear-gradient(135deg,#2a1f08,#1a1508);
        border:2px solid #ffd54a;
        display:flex;align-items:center;justify-content:center;
        font-size:24px;
        box-shadow:0 0 18px rgba(255,213,74,.35);
      ">🧙</div>
      <div style="flex:1;">
        <div style="font-size:15px;font-weight:900;color:#ffd54a;">OLD TOM</div>
        <div style="font-size:11px;opacity:.6;margin-top:1px;">${pin.n}</div>
      </div>
      <div style="
        padding:4px 10px;border-radius:12px;
        background:rgba(255,213,74,.15);
        border:1px solid rgba(255,213,74,.3);
        font-size:11px;font-weight:900;color:#ffd54a;
        margin-right:8px;
      ">${tier.toUpperCase()}</div>
      <button id="btn-explorer-close" type="button" style="
        width:38px;height:38px;border-radius:50%;
        background:#111827;color:white;
        border:1px solid rgba(255,255,255,.15);
        font-size:16px;cursor:pointer;
      ">✕</button>
    </div>

    <!-- INTRO TEXT -->
    <div style="
      flex:1;overflow-y:auto;padding:20px 16px;
      display:flex;flex-direction:column;gap:16px;
    ">
      <!-- Location badge -->
      <div style="
        display:flex;align-items:center;gap:10px;
        padding:10px 14px;border-radius:14px;
        background:rgba(255,213,74,.08);
        border:1px solid rgba(255,213,74,.2);
      ">
        <span style="font-size:28px;">${pin.i || "📍"}</span>
        <div>
          <div style="font-weight:900;font-size:15px;color:#ffd54a;">${pin.n}</div>
          <div style="font-size:12px;opacity:.6;margin-top:2px;">${pinData.category} · ${pinData.zone}</div>
        </div>
      </div>

      <!-- Old Tom's intro -->
      <div style="
        padding:16px;border-radius:16px;
        background:linear-gradient(135deg,#1a1508,#111);
        border:1px solid rgba(255,213,74,.25);
        color:rgba(255,255,255,.92);font-size:15px;line-height:1.65;
        font-style:italic;
      ">"${intro}"</div>

      <!-- What would you like? -->
      <div style="
        font-size:13px;font-weight:900;
        color:rgba(255,255,255,.5);
        text-align:center;letter-spacing:.05em;
        margin-top:4px;
      ">WHAT WOULD YOU LIKE?</div>

      <!-- MENU GRID -->
      <div id="explorer-menu" style="
        display:grid;grid-template-columns:1fr 1fr;gap:10px;
      ">
        ${[
          { id: "history",    icon: "📖", label: "History",    desc: "Tell me the story" },
          { id: "quiz",       icon: "❓", label: "Quiz Me",    desc: "Test my knowledge" },
          { id: "activity",   icon: "🎯", label: "Activity",   desc: "Something to do" },
          { id: "nature",     icon: "🌿", label: "Nature",     desc: "Wildlife & outdoors" },
          { id: "look",       icon: "👁️", label: "Look Around", desc: "What to observe" },
          { id: "deeper",     icon: "🔍", label: "Go Deeper",  desc: "More history" },
          { id: "nearby",     icon: "📍", label: "Nearby",     desc: "What else is close" },
          { id: "audiobook",  icon: "🎧", label: "Audio Walk", desc: "Walking story" },
        ].map(item => `
          <button class="explorer-menu-btn" data-action="${item.id}" type="button" style="
            padding:14px 12px;border-radius:16px;
            background:rgba(255,255,255,.05);
            border:1px solid rgba(255,255,255,.1);
            color:white;cursor:pointer;text-align:left;
            display:flex;flex-direction:column;gap:4px;
            transition:all .15s ease;
          ">
            <span style="font-size:22px;">${item.icon}</span>
            <span style="font-size:13px;font-weight:900;color:#ffd54a;">${item.label}</span>
            <span style="font-size:11px;opacity:.55;">${item.desc}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Speak the intro
  stopSpeaking();
  speak(intro);

  // Close button
  document.getElementById("btn-explorer-close")?.addEventListener("click", () => {
    stopSpeaking();
    modal.remove();
    explorerState.isOpen = false;
  });

  // Menu buttons
  modal.querySelectorAll(".explorer-menu-btn").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(255,213,74,.12)";
      btn.style.borderColor = "rgba(255,213,74,.4)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "rgba(255,255,255,.05)";
      btn.style.borderColor = "rgba(255,255,255,.1)";
    });
    btn.addEventListener("click", () => {
      handleMenuAction(btn.dataset.action, pin, pinData);
    });
  });
}

// ══════════════════════════════════════════════════════════
// GENERIC — pins without specific data
// ══════════════════════════════════════════════════════════

async function showExplorerGeneric(pin) {
  const tier = explorerState.tier;

  document.getElementById("explorer-bot-modal")?.remove();

  const modal = document.createElement("div");
  modal.id = "explorer-bot-modal";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#0a0c0e,#050709);
    display:flex;flex-direction:column;
    font-family:system-ui,-apple-system,sans-serif;
  `;

  modal.innerHTML = `
    <div style="padding:14px 16px;background:linear-gradient(180deg,#1a1508,#0d1008);border-bottom:1px solid rgba(255,213,74,.2);display:flex;align-items:center;gap:14px;flex-shrink:0;">
      <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#2a1f08,#1a1508);border:2px solid #ffd54a;display:flex;align-items:center;justify-content:center;font-size:24px;">🧙</div>
      <div style="flex:1;">
        <div style="font-size:15px;font-weight:900;color:#ffd54a;">OLD TOM</div>
        <div style="font-size:11px;opacity:.6;">${pin.n}</div>
      </div>
      <button id="btn-explorer-close" type="button" style="width:38px;height:38px;border-radius:50%;background:#111827;color:white;border:1px solid rgba(255,255,255,.15);font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px;">
      <div id="explorer-loading" style="text-align:center;color:rgba(255,255,255,.5);font-style:italic;">
        <div style="font-size:32px;margin-bottom:12px;">🧙</div>
        <div>Old Tom is thinking...</div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("btn-explorer-close")?.addEventListener("click", () => {
    stopSpeaking();
    modal.remove();
    explorerState.isOpen = false;
  });

  // Ask Old Tom's brain
  const question = `Tell me about ${pin.n} in Barrow-in-Furness. Keep it to 2-3 sentences.`;
  const answer = await askOldTomBrain(question, pin.n);

  const loading = document.getElementById("explorer-loading");
  if (loading && answer) {
    loading.innerHTML = `
      <div style="
        padding:16px;border-radius:16px;
        background:linear-gradient(135deg,#1a1508,#111);
        border:1px solid rgba(255,213,74,.25);
        color:rgba(255,255,255,.92);font-size:15px;line-height:1.65;
        font-style:italic;text-align:left;
      ">"${answer}"</div>
    `;
    speak(answer);
  } else if (loading) {
    loading.innerHTML = `<div style="color:rgba(255,255,255,.5);font-style:italic;">"I don't have much on ${pin.n} yet, friend. Ask me something specific and I'll do my best."</div>`;
  }
}

// ══════════════════════════════════════════════════════════
// MENU ACTIONS
// ══════════════════════════════════════════════════════════

function handleMenuAction(action, pin, pinData) {
  stopSpeaking();

  switch (action) {
    case "history":   showHistory(pin, pinData); break;
    case "quiz":      showQuiz(pin, pinData); break;
    case "activity":  showActivity(pin, pinData); break;
    case "nature":    showNature(pin, pinData); break;
    case "look":      showLookAround(pin, pinData); break;
    case "deeper":    showDeeper(pin, pinData); break;
    case "nearby":    showNearby(pin, pinData); break;
    case "audiobook": showAudioBook(pin, pinData); break;
  }
}

// ── HISTORY ──────────────────────────────────────────────
function showHistory(pin, pinData) {
  const tier = explorerState.tier;
  const facts = pinData.facts || [];
  const text = facts.slice(0, 4).join(" ");

  showContentScreen(pin, "📖 History", text, () => showExplorerIntro(pin, pinData));
  speak(text);
}

// ── QUIZ ──────────────────────────────────────────────────
function showQuiz(pin, pinData) {
  const tier = explorerState.tier;
  const questions = getPinQuiz(pin.id, tier);
  if (!questions.length) {
    showContentScreen(pin, "❓ Quiz", "Old Tom doesn't have a quiz ready for this spot yet — ask him something directly!", () => showExplorerIntro(pin, pinData));
    return;
  }

  // Pick unused question
  const unused = questions.filter((_, i) => !explorerState.usedQuizIds.includes(i));
  const pool = unused.length ? unused : questions;
  const qIndex = questions.indexOf(pool[Math.floor(Math.random() * pool.length)]);
  explorerState.usedQuizIds.push(qIndex);
  const q = questions[qIndex];

  document.getElementById("explorer-bot-modal")?.remove();

  const modal = document.createElement("div");
  modal.id = "explorer-bot-modal";
  modal.style.cssText = `position:fixed;inset:0;z-index:999999;background:linear-gradient(180deg,#0a0c0e,#050709);display:flex;flex-direction:column;font-family:system-ui,-apple-system,sans-serif;`;

  modal.innerHTML = `
    <div style="padding:14px 16px;background:linear-gradient(180deg,#1a1508,#0d1008);border-bottom:1px solid rgba(255,213,74,.2);display:flex;align-items:center;gap:14px;flex-shrink:0;">
      <span style="font-size:22px;">❓</span>
      <div style="flex:1;font-size:14px;font-weight:900;color:#ffd54a;">QUIZ — ${pin.n}</div>
      <button id="btn-explorer-close" type="button" style="width:38px;height:38px;border-radius:50%;background:#111827;color:white;border:1px solid rgba(255,255,255,.15);font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:20px 16px;display:flex;flex-direction:column;gap:16px;">
      <div style="padding:16px;border-radius:16px;background:rgba(255,213,74,.08);border:1px solid rgba(255,213,74,.2);color:white;font-size:16px;line-height:1.55;font-weight:600;">${q.q}</div>
      <div id="quiz-options" style="display:flex;flex-direction:column;gap:10px;">
        ${q.options.map((opt, i) => `
          <button class="quiz-opt" data-index="${i}" type="button" style="
            padding:14px 16px;border-radius:14px;
            background:rgba(255,255,255,.06);
            border:1px solid rgba(255,255,255,.12);
            color:white;font-size:14px;font-weight:600;
            cursor:pointer;text-align:left;
          ">${opt}</button>
        `).join("")}
      </div>
      <div id="quiz-feedback" style="display:none;padding:14px;border-radius:14px;font-size:14px;line-height:1.55;"></div>
      <button id="btn-quiz-back" type="button" style="display:none;padding:12px;border-radius:14px;background:rgba(255,213,74,.15);border:1px solid rgba(255,213,74,.3);color:#ffd54a;font-weight:900;cursor:pointer;">ANOTHER QUESTION</button>
      <button id="btn-quiz-menu" type="button" style="display:none;padding:12px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:white;cursor:pointer;">BACK TO MENU</button>
    </div>
  `;

  document.body.appendChild(modal);
  speak(q.q);

  document.getElementById("btn-explorer-close")?.addEventListener("click", () => { stopSpeaking(); modal.remove(); explorerState.isOpen = false; });
  document.getElementById("btn-quiz-back")?.addEventListener("click", () => showQuiz(pin, pinData));
  document.getElementById("btn-quiz-menu")?.addEventListener("click", () => showExplorerIntro(pin, pinData));

  modal.querySelectorAll(".quiz-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const chosen = parseInt(btn.dataset.index);
      const correct = chosen === q.answer;
      const feedback = document.getElementById("quiz-feedback");
      const backBtn = document.getElementById("btn-quiz-back");
      const menuBtn = document.getElementById("btn-quiz-menu");

      modal.querySelectorAll(".quiz-opt").forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) {
          b.style.background = "rgba(34,197,94,.2)";
          b.style.borderColor = "#22c55e";
          b.style.color = "#4ade80";
        } else if (i === chosen && !correct) {
          b.style.background = "rgba(239,68,68,.2)";
          b.style.borderColor = "#ef4444";
          b.style.color = "#f87171";
        }
      });

      if (feedback) {
        feedback.style.display = "block";
        if (correct) {
          feedback.style.background = "rgba(34,197,94,.1)";
          feedback.style.border = "1px solid rgba(34,197,94,.3)";
          feedback.style.color = "#4ade80";
          feedback.innerHTML = `✅ <strong>Correct!</strong><br><span style="color:rgba(255,255,255,.7);margin-top:6px;display:block;">${q.fact}</span>`;
          speak(`Correct! ${q.fact}`);
        } else {
          feedback.style.background = "rgba(239,68,68,.1)";
          feedback.style.border = "1px solid rgba(239,68,68,.3)";
          feedback.style.color = "#f87171";
          feedback.innerHTML = `❌ <strong>Not quite.</strong> The answer was: ${q.options[q.answer]}<br><span style="color:rgba(255,255,255,.7);margin-top:6px;display:block;">${q.fact}</span>`;
          speak(`Not quite. The answer was ${q.options[q.answer]}. ${q.fact}`);
        }
      }

      if (backBtn) backBtn.style.display = "block";
      if (menuBtn) menuBtn.style.display = "block";
    });
  });
}

// ── ACTIVITY ──────────────────────────────────────────────
function showActivity(pin, pinData) {
  const tier = explorerState.tier;
  const activities = getPinActivities(pin.id, tier);
  if (!activities.length) {
    showContentScreen(pin, "🎯 Activity", "Old Tom doesn't have a specific activity for here yet — but look around and see what catches your eye!", () => showExplorerIntro(pin, pinData));
    return;
  }

  const activity = activities[Math.floor(Math.random() * activities.length)];
  const text = `${activity.title}: ${activity.desc}`;
  showContentScreen(pin, `🎯 ${activity.title}`, activity.desc, () => showExplorerIntro(pin, pinData), activity.type);
  speak(text);
}

// ── NATURE ────────────────────────────────────────────────
async function showNature(pin, pinData) {
  const answer = await askOldTomBrain(`What wildlife or nature can be found at or near ${pin.n}?`, pin.n);
  const text = answer || `Look around ${pin.n} carefully — what plants, birds or animals can you spot? This part of Barrow has some wonderful wildlife if you look closely.`;
  showContentScreen(pin, "🌿 Nature", text, () => showExplorerIntro(pin, pinData));
  speak(text);
}

// ── LOOK AROUND ───────────────────────────────────────────
function showLookAround(pin, pinData) {
  const tier = explorerState.tier;
  const tips = {
    kids: `Look all around you at ${pin.n}. What colours can you see? What's the biggest thing near you? What's the oldest looking thing you can spot? What sounds can you hear?`,
    teen: `Take a careful look around ${pin.n}. What architectural or historical details can you spot? What tells you about when this place was built or what it was used for? What seems out of place?`,
    adult: `Observe ${pin.n} carefully. What layers of history can you see? What has changed and what has remained? Look for the details that most people walk past — they often tell the most interesting stories.`,
  };
  const text = tips[tier] || tips.kids;
  showContentScreen(pin, "👁️ Look Around", text, () => showExplorerIntro(pin, pinData));
  speak(text);
}

// ── GO DEEPER ─────────────────────────────────────────────
async function showDeeper(pin, pinData) {
  const allFacts = pinData?.facts || [];
  const deepFacts = allFacts.slice(4).join(" ");
  const answer = await askOldTomBrain(`Tell me something deeper or less well known about ${pin.n}`, pin.n);
  const text = answer || deepFacts || `Old Tom is still learning more about ${pin.n}. Check back as his knowledge grows!`;
  showContentScreen(pin, "🔍 Go Deeper", text, () => showExplorerIntro(pin, pinData));
  speak(text);
}

// ── NEARBY ────────────────────────────────────────────────
function showNearby(pin, pinData) {
  const nearby = pinData?.nearby || [];
  if (!nearby.length) {
    showContentScreen(pin, "📍 Nearby", "Explore the area around you — there's plenty to discover nearby!", () => showExplorerIntro(pin, pinData));
    return;
  }

  // Get nearby pin names from app pins
  const allPins = window.PINS || [];
  const nearbyPins = nearby.map(id => allPins.find(p => p.id === id)).filter(Boolean);
  const text = nearbyPins.length
    ? `Near ${pin.n} you'll find: ${nearbyPins.map(p => p.n).join(", ")}.`
    : "There's more to explore nearby — walk around and tap Old Tom when you find something interesting.";

  showContentScreen(pin, "📍 Nearby", text, () => showExplorerIntro(pin, pinData));
  speak(text);
}

// ── AUDIO BOOK ────────────────────────────────────────────
function showAudioBook(pin, pinData) {
  const text = `The Walking Audio Book for this area is coming soon. Old Tom is preparing the full story of ${pin.n} as a walking narrative — where he'll tell you the history as you move through the landscape. Check back soon!`;
  showContentScreen(pin, "🎧 Audio Walk", text, () => showExplorerIntro(pin, pinData));
  speak(text);
}

// ══════════════════════════════════════════════════════════
// CONTENT SCREEN — generic display
// ══════════════════════════════════════════════════════════

function showContentScreen(pin, title, content, onBack, badge = null) {
  document.getElementById("explorer-bot-modal")?.remove();

  const badgeColors = {
    observation: "#6366f1",
    physical: "#22c55e",
    knowledge: "#f59e0b",
    family: "#ec4899",
    quiet: "#06b6d4",
    creative: "#8b5cf6",
    environmental: "#10b981",
  };

  const modal = document.createElement("div");
  modal.id = "explorer-bot-modal";
  modal.style.cssText = `position:fixed;inset:0;z-index:999999;background:linear-gradient(180deg,#0a0c0e,#050709);display:flex;flex-direction:column;font-family:system-ui,-apple-system,sans-serif;`;

  modal.innerHTML = `
    <div style="padding:14px 16px;background:linear-gradient(180deg,#1a1508,#0d1008);border-bottom:1px solid rgba(255,213,74,.2);display:flex;align-items:center;gap:12px;flex-shrink:0;">
      <button id="btn-content-back" type="button" style="width:36px;height:36px;border-radius:50%;background:#111827;color:#ffd54a;border:1px solid rgba(255,213,74,.3);font-size:16px;cursor:pointer;">←</button>
      <div style="flex:1;font-size:14px;font-weight:900;color:#ffd54a;">${title}</div>
      ${badge ? `<div style="padding:4px 10px;border-radius:10px;background:${badgeColors[badge] || "#6b7280"}33;border:1px solid ${badgeColors[badge] || "#6b7280"}66;font-size:11px;font-weight:900;color:${badgeColors[badge] || "#9ca3af"};">${badge.toUpperCase()}</div>` : ""}
      <button id="btn-content-close" type="button" style="width:36px;height:36px;border-radius:50%;background:#111827;color:white;border:1px solid rgba(255,255,255,.15);font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:20px 16px;">
      <div style="
        padding:18px;border-radius:16px;
        background:linear-gradient(135deg,#1a1508,#111);
        border:1px solid rgba(255,213,74,.2);
        color:rgba(255,255,255,.9);font-size:15px;line-height:1.7;
        font-style:italic;
      ">"${content}"</div>

      <!-- Action buttons -->
      <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">
        <button id="btn-content-repeat" type="button" style="padding:10px 16px;border-radius:12px;background:rgba(255,213,74,.12);border:1px solid rgba(255,213,74,.3);color:#ffd54a;font-size:13px;font-weight:900;cursor:pointer;">🔁 Repeat</button>
        <button id="btn-content-copy" type="button" style="padding:10px 16px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:white;font-size:13px;cursor:pointer;">📋 Copy</button>
        <button id="btn-content-share" type="button" style="padding:10px 16px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:white;font-size:13px;cursor:pointer;">📤 Share</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-content-back")?.addEventListener("click", () => { stopSpeaking(); onBack?.(); });
  document.getElementById("btn-content-close")?.addEventListener("click", () => { stopSpeaking(); modal.remove(); explorerState.isOpen = false; });
  document.getElementById("btn-content-repeat")?.addEventListener("click", () => speak(content));
  document.getElementById("btn-content-copy")?.addEventListener("click", () => {
    navigator.clipboard?.writeText(content);
    const btn = document.getElementById("btn-content-copy");
    if (btn) { btn.textContent = "✅ Copied"; setTimeout(() => btn.textContent = "📋 Copy", 1500); }
  });
  document.getElementById("btn-content-share")?.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({ title: `Old Tom at ${pin.n}`, text: content, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(content);
    }
  });
}

// ══════════════════════════════════════════════════════════
// INIT — wire into app.js
// ══════════════════════════════════════════════════════════

export function initExplorerBot() {
  // Override the existing Old Tom float button behaviour
  const floatBtn = document.getElementById("btn-old-tom-float");
  if (floatBtn) {
    // Remove existing listeners by cloning
    const newBtn = floatBtn.cloneNode(true);
    floatBtn.parentNode.replaceChild(newBtn, floatBtn);

    newBtn.addEventListener("click", () => {
      const currentPin = window.currentPin;
      if (currentPin) {
        openExplorerBot(currentPin);
      } else {
        // Not near a pin — open generic Old Tom chat
        window.oldTom?.openChat?.();
      }
    });
  }

  // Export functions to window for app.js to call
  window.explorerBot = {
    open: openExplorerBot,
    updatePulse: updateExplorerBotPulse,
    isOpen: () => explorerState.isOpen,
  };

  console.log("Explorer Bot initialised — Old Tom location guide ready.");
}

export default { initExplorerBot, openExplorerBot, updateExplorerBotPulse };
