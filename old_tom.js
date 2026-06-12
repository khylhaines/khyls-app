/* =========================================================
   OLD TOM — BARROW HISTORIAN
   Barrow Quest / LEOIDS
   =========================================================
   A wise storyteller from Barrow-in-Furness.
   Powered by your LOCAL Old Tom AI brain at localhost:8000
   Answers anything about Barrow, Furness Abbey, the docks,
   the islands, the people.
   Available any time from the home screen or map.
========================================================= */

/* =========================================================
   LOCAL OLD TOM API SETTINGS
   Points to your Old Tom server running on your PC
========================================================= */

const OLD_TOM_API = "http://192.168.1.71:8000";

/* =========================================================
   CONVERSATION HISTORY
   Keeps track of the chat so Tom remembers context
========================================================= */

let tomHistory = [];

/* =========================================================
   CALL YOUR LOCAL OLD TOM BRAIN
========================================================= */

async function askTom(userMessage) {
  tomHistory.push({ role: "user", content: userMessage });

  try {
    const response = await fetch(`${OLD_TOM_API}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: userMessage,
        bot_id: "barrowquest-app",
        bot_type: "mapping_bot",
        context: "BarrowQuest mobile app"
      }),
    });

    if (!response.ok) {
      throw new Error(`Old Tom server returned ${response.status}`);
    }

    const data = await response.json();

    const reply = data.answer
      || "The connection's gone a bit foggy, friend. Try again in a moment.";

    tomHistory.push({ role: "assistant", content: reply });

    // Keep history to last 20 messages to avoid overload
    if (tomHistory.length > 20) {
      tomHistory = tomHistory.slice(-20);
    }

    return reply;

  } catch (err) {
    console.error("Old Tom API error:", err);

    // Friendly fallback messages
    const fallbacks = [
      "The connection's gone a bit foggy, friend. Make sure Old Tom is running on your PC and try again.",
      "I seem to have lost my train of thought there. Check Old Tom is running and ask me again.",
      "Something's gone quiet on my end, friend. Try again in a moment.",
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

/* =========================================================
   CHECK IF OLD TOM SERVER IS RUNNING
========================================================= */

async function checkOldTomOnline() {
  try {
    const response = await fetch(`${OLD_TOM_API}/`, { method: "GET" });
    return response.ok;
  } catch {
    return false;
  }
}

/* =========================================================
   OLD TOM CHAT SCREEN
========================================================= */

export function openOldTomChat(contextPinName = null) {
  const old = document.getElementById("old-tom-chat");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "old-tom-chat";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#0a0c0e,#050709);
    display:flex;flex-direction:column;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  // Build opening message based on context
  const openingMessage = contextPinName
    ? `Ah, you're standing near ${contextPinName}. A fine place with a fine story. What would you like to know?`
    : "Good to see you, friend. Ask me anything about Barrow and Furness — the history, the people, the places. I've lived here all my life and I love to talk about it.";

  // Pre-populate history with opening
  if (tomHistory.length === 0) {
    tomHistory.push({ role: "assistant", content: openingMessage });
  }

  modal.innerHTML = `
    <!-- HEADER -->
    <div style="
      padding:14px 16px;
      background:linear-gradient(180deg,#1a1508,#0d1008);
      border-bottom:1px solid rgba(255,213,74,.2);
      display:flex;align-items:center;gap:14px;
      flex-shrink:0;
    ">
      <div style="
        width:48px;height:48px;border-radius:50%;
        background:linear-gradient(135deg,#2a1f08,#1a1508);
        border:2px solid #ffd54a;
        display:flex;align-items:center;justify-content:center;
        font-size:24px;flex-shrink:0;
        box-shadow:0 0 18px rgba(255,213,74,.25);
      ">🧙</div>
      <div style="flex:1;">
        <div style="font-size:15px;font-weight:1000;color:#ffd54a;">OLD TOM</div>
        <div style="font-size:12px;opacity:.65;margin-top:1px;">Barrow Historian · Local AI</div>
      </div>
      <div id="tom-status-dot" style="
        width:8px;height:8px;border-radius:50%;
        background:#666;margin-right:4px;flex-shrink:0;
      "></div>
      <button id="btn-tom-close" type="button" style="
        width:40px;height:40px;border-radius:50%;
        background:#111827;color:white;
        border:1px solid rgba(255,255,255,.15);
        font-size:18px;cursor:pointer;flex-shrink:0;
      ">✕</button>
    </div>

    <!-- MESSAGES -->
    <div id="tom-messages" style="
      flex:1;overflow-y:auto;padding:16px;
      display:flex;flex-direction:column;gap:12px;
      min-height:0;
    ">
      <!-- Opening message -->
      <div class="tom-msg-tom" style="
        max-width:88%;align-self:flex-start;
        padding:14px 16px;border-radius:20px 20px 20px 4px;
        background:linear-gradient(135deg,#1a1508,#111);
        border:1px solid rgba(255,213,74,.25);
        color:rgba(255,255,255,.92);font-size:15px;line-height:1.6;
        font-style:italic;
      ">"${openingMessage}"</div>
    </div>

    <!-- SUGGESTED QUESTIONS -->
    <div id="tom-suggestions" style="
      padding:10px 16px 4px;flex-shrink:0;
      display:flex;gap:8px;overflow-x:auto;
      scrollbar-width:none;
    ">
      ${[
        "Tell me about Furness Abbey",
        "How did Barrow grow so fast?",
        "What about the submarines?",
        "Tell me about Piel Castle",
        "Who built Barrow?",
        "What's special about Walney Island?",
        "Who was Stan Laurel?",
        "Tell me about BAE Systems",
      ].map(q => `
        <button class="tom-suggestion" type="button" style="
          flex-shrink:0;padding:8px 14px;border-radius:20px;
          background:rgba(255,213,74,.12);
          color:#ffd54a;font-size:12px;font-weight:900;
          border:1px solid rgba(255,213,74,.3);cursor:pointer;
          white-space:nowrap;
        ">${q}</button>
      `).join("")}
    </div>

    <!-- INPUT -->
    <div style="
      padding:12px 16px 16px;flex-shrink:0;
      display:flex;gap:10px;align-items:flex-end;
      border-top:1px solid rgba(255,255,255,.06);
      background:rgba(0,0,0,.3);
    ">
      <textarea id="tom-input" placeholder="Ask Old Tom anything about Barrow..." rows="1" style="
        flex:1;min-height:46px;max-height:120px;
        border-radius:16px;border:1px solid rgba(255,213,74,.3);
        background:#111827;color:white;padding:12px 14px;
        font-size:15px;font-family:inherit;resize:none;outline:none;
        line-height:1.4;
      "></textarea>
      <button id="btn-tom-send" type="button" style="
        width:46px;height:46px;border-radius:50%;flex-shrink:0;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-size:20px;font-weight:1000;
        border:none;cursor:pointer;
        display:flex;align-items:center;justify-content:center;
      ">➤</button>
    </div>
  `;

  document.body.appendChild(modal);

  const messagesEl = document.getElementById("tom-messages");
  const inputEl = document.getElementById("tom-input");
  const statusDot = document.getElementById("tom-status-dot");

  // Check if Old Tom server is online and update status dot
  checkOldTomOnline().then(online => {
    if (statusDot) {
      statusDot.style.background = online ? "#22c55e" : "#ef4444";
      statusDot.title = online ? "Old Tom is online" : "Old Tom offline — start your PC server";
    }
    if (!online) {
      addMessage(
        "I'm having trouble connecting to my memory right now. Make sure Old Tom is running on your PC, then try again.",
        "tom"
      );
    }
  });

  // Close
  document.getElementById("btn-tom-close")?.addEventListener("click", () => modal.remove());

  // Auto-resize textarea
  inputEl?.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
  });

  // Send on Enter (Shift+Enter for newline)
  inputEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.getElementById("btn-tom-send")?.addEventListener("click", sendMessage);

  // Suggestion buttons
  modal.querySelectorAll(".tom-suggestion").forEach(btn => {
    btn.addEventListener("click", () => {
      if (inputEl) inputEl.value = btn.innerText;
      sendMessage();
    });
  });

  function addMessage(text, role) {
    const msg = document.createElement("div");
    msg.style.cssText = role === "user" ? `
      max-width:80%;align-self:flex-end;
      padding:12px 16px;border-radius:20px 20px 4px 20px;
      background:rgba(0,212,255,.15);
      border:1px solid rgba(0,212,255,.25);
      color:white;font-size:15px;line-height:1.5;
    ` : `
      max-width:88%;align-self:flex-start;
      padding:14px 16px;border-radius:20px 20px 20px 4px;
      background:linear-gradient(135deg,#1a1508,#111);
      border:1px solid rgba(255,213,74,.25);
      color:rgba(255,255,255,.92);font-size:15px;line-height:1.6;
      font-style:italic;
    `;

    msg.innerText = role === "user" ? text : `"${text}"`;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.id = "tom-typing";
    typing.style.cssText = `
      max-width:88%;align-self:flex-start;
      padding:14px 16px;border-radius:20px 20px 20px 4px;
      background:linear-gradient(135deg,#1a1508,#111);
      border:1px solid rgba(255,213,74,.25);
      color:rgba(255,255,255,.5);font-size:15px;font-style:italic;
    `;
    typing.innerText = "Tom is thinking...";
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    document.getElementById("tom-typing")?.remove();
  }

  async function sendMessage() {
    const text = inputEl?.value?.trim() || "";
    if (!text) return;

    // Hide suggestions after first message
    const suggestions = document.getElementById("tom-suggestions");
    if (suggestions) suggestions.style.display = "none";

    inputEl.value = "";
    inputEl.style.height = "auto";

    const sendBtn = document.getElementById("btn-tom-send");
    if (sendBtn) sendBtn.disabled = true;

    addMessage(text, "user");
    showTyping();

    const reply = await askTom(text);

    removeTyping();
    addMessage(reply, "tom");

    if (sendBtn) sendBtn.disabled = false;
    inputEl.focus();
  }
}

/* =========================================================
   STATIC CONTENT — for pins without AI (fallback)
========================================================= */

export function hasCoverage(pinId) {
  // All pins covered by Old Tom AI — always returns true
  return true;
}

/* =========================================================
   INIT — call from app.js
========================================================= */

export function initOldTom() {
  window.oldTom = {
    openChat: openOldTomChat,
    hasCoverage,
    resetHistory: () => { tomHistory = []; },
    checkOnline: checkOldTomOnline,
  };

  console.log("Old Tom initialised — connected to local AI brain at " + OLD_TOM_API);
}

export default { openOldTomChat, hasCoverage, initOldTom };
