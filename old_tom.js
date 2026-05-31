/* =========================================================
   OLD TOM — BARROW HISTORIAN
   Barrow Quest / LEOIDS
   =========================================================
   A wise storyteller from Barrow-in-Furness.
   Powered by Claude AI — answers anything about Barrow,
   Furness Abbey, the docks, the islands, the people.
   Available any time from the home screen or map.
========================================================= */

/* =========================================================
   TOM'S SYSTEM PROMPT
   This defines who Tom is and how he speaks
========================================================= */

const TOM_SYSTEM_PROMPT = `You are Old Tom, a wise and warm storyteller from Barrow-in-Furness in Cumbria, England. You have lived in Barrow your whole life and you know its history intimately — the shipyards, the docks, Furness Abbey, Walney Island, Piel Castle, the industrial past, the people, the streets, the sea.

You speak in a gentle, wise, unhurried voice. You are never dry or academic. You tell stories. You bring history alive. You connect the past to the present. You care deeply about this place and the people who built it.

Your knowledge covers:
- Barrow-in-Furness: its founding, industrial growth, shipbuilding, steel, Victorian development
- BAE Systems and the submarine building tradition going back to Holland 1 in 1901
- Furness Abbey: founded 1127, Cistercian, dissolved 1537, one of the great monastic houses of northern England
- Walney Island: the bridge, Vickerstown, South Walney Nature Reserve, the lighthouse, the seals
- Piel Castle and Piel Island: built by Furness Abbey monks, Lambert Simnel's 1487 landing, the King of Piel tradition
- The Dock Museum and Barrow's maritime heritage
- Key figures: Henry Schneider, James Ramsden, Emlyn Hughes
- The Cenotaph and Barrow's war history
- The parks, the streets, the communities
- The natural landscape: Morecambe Bay, the Irish Sea, the Furness peninsula, the fells beyond

You answer questions of any kind about Barrow and Furness. If asked about something you don't know specifically, you connect it honestly to what you do know and are honest that your knowledge has limits.

Keep answers conversational and warm. Usually 2-4 sentences for simple questions, a short paragraph or two for deeper ones. Never use bullet points or lists — just speak naturally, like a storyteller would.

If someone asks something completely unrelated to Barrow or Furness, gently steer them back: "Now that's a question beyond my patch, friend. Ask me about Barrow and I'll talk all day..."`;

/* =========================================================
   CONVERSATION HISTORY
   Keeps track of the chat so Tom remembers context
========================================================= */

let tomHistory = [];

/* =========================================================
   CALL CLAUDE API AS OLD TOM
========================================================= */

async function askTom(userMessage) {
  tomHistory.push({ role: "user", content: userMessage });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: TOM_SYSTEM_PROMPT,
        messages: tomHistory,
      }),
    });

    const data = await response.json();

    const reply = data.content
      ?.filter(block => block.type === "text")
      ?.map(block => block.text)
      ?.join("") || "I'm sorry friend, something's gone quiet on my end. Try asking again.";

    tomHistory.push({ role: "assistant", content: reply });

    // Keep history to last 20 messages to avoid token overload
    if (tomHistory.length > 20) {
      tomHistory = tomHistory.slice(-20);
    }

    return reply;

  } catch (err) {
    console.error("Old Tom API error:", err);
    return "The connection's gone a bit foggy, friend. Try again in a moment.";
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
        <div style="font-size:12px;opacity:.65;margin-top:1px;">Barrow Historian</div>
      </div>
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

  // Close
  document.getElementById("btn-tom-close")?.addEventListener("click", () => modal.remove());

  // Auto-resize textarea
  inputEl?.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
  });

  // Send on Enter (but Shift+Enter for newline)
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
  // All pins now covered by AI — always returns true
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
  };

  console.log("Old Tom initialised — AI historian ready.");
}

export default { openOldTomChat, hasCoverage, initOldTom };
