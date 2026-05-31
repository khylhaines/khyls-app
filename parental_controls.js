/* =========================================================
   PARENTAL CONTROLS SYSTEM — PHASE 1
   Barrow Quest / LEOIDS
   =========================================================
   FEATURES:
   - Parent PIN setup and verification
   - Child profile (name, age)
   - SOS emergency button (silent on device, loud for parent)
   - Screen time limits and lock times
   - Feature toggles (map, explorer, true crime, messaging)
   - Lobby type control (public / family / friends only)
   - Approved contacts list
   - Alerts log
========================================================= */

const PARENTAL_STORAGE_KEY = "bq_parental_controls_v1";

/* =========================================================
   DEFAULT CONFIG
========================================================= */

function createDefaultParentalConfig() {
  return {
    version: 1,
    createdAt: null,

    parent: {
      pin: "",
      pinSet: false,
      name: "Parent",
      contactNumber: "",
      approvedContacts: [],
    },

    child: {
      name: "",
      age: null,
      profileSet: false,
    },

    features: {
      mapEnabled: true,
      explorerEnabled: true,
      trueCrimeEnabled: false,
      territoryEnabled: true,
      leoidsEnabled: true,
      messagingEnabled: false,
      leaderboardEnabled: true,
      shopEnabled: true,
    },

    lobbies: {
      allowedType: "family",
      canCreatePublic: false,
      canJoinPublic: false,
      canSendInvites: false,
      canAcceptInvites: true,
    },

    screenTime: {
      enabled: false,
      dailyLimitMinutes: 120,
      lockAfterHour: 21,
      unlockAfterHour: 7,
      blockSchoolHours: false,
      schoolStartHour: 9,
      schoolEndHour: 15,
      sessionStartedAt: null,
      todayUsedMinutes: 0,
      lastResetDate: null,
    },

    sos: {
      lastTriggeredAt: null,
      alertActive: false,
      alertCancelledAt: null,
      alertHistory: [],
    },

    alerts: [],
  };
}

/* =========================================================
   LOAD / SAVE
========================================================= */

function loadParentalConfig() {
  try {
    const raw = localStorage.getItem(PARENTAL_STORAGE_KEY);
    if (!raw) return createDefaultParentalConfig();
    const parsed = JSON.parse(raw);
    return { ...createDefaultParentalConfig(), ...parsed };
  } catch {
    return createDefaultParentalConfig();
  }
}

function saveParentalConfig(config) {
  try {
    localStorage.setItem(PARENTAL_STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   PIN HELPERS
========================================================= */

function isValidPin(value) {
  return /^\d{4}$/.test(String(value || "").trim());
}

function verifyParentPin(config, entered) {
  return String(entered || "").trim() === String(config.parent.pin || "").trim();
}

/* =========================================================
   SCREEN TIME HELPERS
========================================================= */

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentHour() {
  return new Date().getHours();
}

function isLockedByTime(config) {
  if (!config.screenTime.enabled) return false;

  const hour = getCurrentHour();
  const lockAfter = Number(config.screenTime.lockAfterHour ?? 21);
  const unlockAfter = Number(config.screenTime.unlockAfterHour ?? 7);

  if (hour >= lockAfter || hour < unlockAfter) return true;

  if (config.screenTime.blockSchoolHours) {
    const schoolStart = Number(config.screenTime.schoolStartHour ?? 9);
    const schoolEnd = Number(config.screenTime.schoolEndHour ?? 15);
    const today = new Date().getDay();
    const isWeekday = today >= 1 && today <= 5;
    if (isWeekday && hour >= schoolStart && hour < schoolEnd) return true;
  }

  return false;
}

function isLockedByDailyLimit(config) {
  if (!config.screenTime.enabled) return false;

  const today = getTodayDateString();

  if (config.screenTime.lastResetDate !== today) {
    config.screenTime.todayUsedMinutes = 0;
    config.screenTime.lastResetDate = today;
    saveParentalConfig(config);
  }

  const used = Number(config.screenTime.todayUsedMinutes || 0);
  const limit = Number(config.screenTime.dailyLimitMinutes || 120);

  return used >= limit;
}

function tickScreenTime(config) {
  if (!config.screenTime.enabled) return config;

  const today = getTodayDateString();

  if (config.screenTime.lastResetDate !== today) {
    config.screenTime.todayUsedMinutes = 0;
    config.screenTime.lastResetDate = today;
  }

  config.screenTime.todayUsedMinutes =
    Number(config.screenTime.todayUsedMinutes || 0) + 1;

  saveParentalConfig(config);
  return config;
}

/* =========================================================
   ALERTS LOG
========================================================= */

function addAlert(config, message, level = "amber") {
  if (!Array.isArray(config.alerts)) config.alerts = [];

  config.alerts.unshift({
    id: `alert_${Date.now()}`,
    message,
    level,
    createdAt: new Date().toISOString(),
    read: false,
  });

  config.alerts = config.alerts.slice(0, 200);
  saveParentalConfig(config);
  return config;
}

/* =========================================================
   SOS TRIGGER
========================================================= */

function triggerSOS(config) {
  const now = new Date().toISOString();

  config.sos.alertActive = true;
  config.sos.lastTriggeredAt = now;
  config.sos.alertCancelledAt = null;

  const entry = {
    triggeredAt: now,
    cancelledAt: null,
    cancelledBy: null,
  };

  if (!Array.isArray(config.sos.alertHistory)) config.sos.alertHistory = [];
  config.sos.alertHistory.unshift(entry);
  config.sos.alertHistory = config.sos.alertHistory.slice(0, 50);

  addAlert(config, `🚨 SOS ACTIVATED by ${config.child.name || "child"} at ${now}`, "red");

  saveParentalConfig(config);
  return config;
}

function cancelSOS(config, cancelledBy = "parent") {
  config.sos.alertActive = false;
  config.sos.alertCancelledAt = new Date().toISOString();

  if (Array.isArray(config.sos.alertHistory) && config.sos.alertHistory[0]) {
    config.sos.alertHistory[0].cancelledAt = config.sos.alertCancelledAt;
    config.sos.alertHistory[0].cancelledBy = cancelledBy;
  }

  addAlert(config, `✅ SOS cancelled by ${cancelledBy}`, "green");

  saveParentalConfig(config);
  return config;
}

/* =========================================================
   COLOUR HELPERS
========================================================= */

function levelColor(level = "green") {
  if (level === "red") return "#ff3b3b";
  if (level === "amber") return "#ffb000";
  return "#22c55e";
}

function levelIcon(level = "green") {
  if (level === "red") return "🔴";
  if (level === "amber") return "🟡";
  return "🟢";
}

/* =========================================================
   MAIN UI — PARENT DASHBOARD
========================================================= */

function openParentalDashboard() {
  const old = document.getElementById("parental-dashboard");
  if (old) old.remove();

  const config = loadParentalConfig();

  if (!config.parent.pinSet) {
    openParentalSetup();
    return;
  }

  const entered = prompt("Enter parent PIN to open Parental Controls");
  if (!entered) return;

  if (!verifyParentPin(config, entered)) {
    alert("Incorrect PIN.");
    return;
  }

  renderParentalDashboard(config);
}

function renderParentalDashboard(config) {
  const old = document.getElementById("parental-dashboard");
  if (old) old.remove();

  const sosActive = config.sos.alertActive;
  const timeLocked = isLockedByTime(config);
  const limitLocked = isLockedByDailyLimit(config);
  const unreadAlerts = (config.alerts || []).filter((a) => !a.read).length;

  // Get sync state if available
  const syncState = window.getParentalSyncState?.() || {};
  const isLinked = !!syncState.familyId;
  const familyCode = syncState.familyCode || null;

  const modal = document.createElement("div");
  modal.id = "parental-dashboard";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:640px;margin:0 auto;">

      <!-- HEADER -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
        <div>
          <div style="font-size:11px;font-weight:900;color:#ffd54a;letter-spacing:.1em;">PARENTAL CONTROLS</div>
          <div style="font-size:22px;font-weight:1000;margin-top:2px;">Dashboard</div>
        </div>
        <button id="btn-parental-close" type="button" style="
          width:44px;height:44px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:20px;font-weight:900;cursor:pointer;
        ">✕</button>
      </div>

      <!-- SOS ALERT BANNER -->
      ${sosActive ? `
        <div style="
          padding:16px;border-radius:18px;margin-bottom:16px;
          background:rgba(255,59,59,.22);border:2px solid #ff3b3b;
          text-align:center;animation:sosPulse .75s infinite;
        ">
          <div style="font-size:28px;margin-bottom:6px;">🚨</div>
          <div style="font-weight:1000;font-size:18px;color:#ff3b3b;">SOS ALERT ACTIVE</div>
          <div style="font-size:13px;margin-top:6px;opacity:.9;">
            Triggered at ${config.sos.lastTriggeredAt ? new Date(config.sos.lastTriggeredAt).toLocaleString() : "unknown"}
          </div>
          <button id="btn-cancel-sos" type="button" style="
            margin-top:12px;width:100%;min-height:46px;border-radius:14px;
            background:#ff3b3b;color:white;font-weight:1000;border:none;cursor:pointer;
          ">MARK SAFE / CANCEL ALERT</button>
        </div>
      ` : ""}

      <!-- STATUS ROW -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="padding:12px;border-radius:14px;background:#111827;border:1px solid rgba(255,255,255,.08);text-align:center;">
          <div style="font-size:10px;opacity:.7;letter-spacing:.08em;">CHILD</div>
          <div style="font-size:15px;font-weight:900;margin-top:4px;color:#ffd54a;">
            ${config.child.name || "Not set"}
          </div>
        </div>
        <div style="padding:12px;border-radius:14px;background:#111827;border:1px solid rgba(255,255,255,.08);text-align:center;">
          <div style="font-size:10px;opacity:.7;letter-spacing:.08em;">TIME TODAY</div>
          <div style="font-size:15px;font-weight:900;margin-top:4px;color:${limitLocked ? "#ff3b3b" : "#22c55e"};">
            ${Number(config.screenTime.todayUsedMinutes || 0)}min
          </div>
        </div>
        <div style="padding:12px;border-radius:14px;background:#111827;border:1px solid rgba(255,255,255,.08);text-align:center;">
          <div style="font-size:10px;opacity:.7;letter-spacing:.08em;">ALERTS</div>
          <div style="font-size:15px;font-weight:900;margin-top:4px;color:${unreadAlerts > 0 ? "#ffb000" : "#22c55e"};">
            ${unreadAlerts > 0 ? `${unreadAlerts} NEW` : "CLEAR"}
          </div>
        </div>
      </div>

      <!-- LOCK STATUS -->
      ${timeLocked || limitLocked ? `
        <div style="
          padding:14px;border-radius:16px;margin-bottom:16px;
          background:rgba(255,59,59,.14);border:1px solid rgba(255,59,59,.45);
          text-align:center;
        ">
          <div style="font-weight:900;color:#ff3b3b;">🔒 APP CURRENTLY LOCKED</div>
          <div style="font-size:13px;margin-top:6px;opacity:.9;">
            ${timeLocked ? "Outside allowed hours." : "Daily time limit reached."}
          </div>
        </div>
      ` : `
        <div style="
          padding:14px;border-radius:16px;margin-bottom:16px;
          background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.35);
          text-align:center;
        ">
          <div style="font-weight:900;color:#22c55e;">🟢 APP ACTIVE</div>
        </div>
      `}

      <!-- MAIN BUTTONS -->
      <div style="display:grid;gap:10px;margin-bottom:16px;">

        <button id="btn-parental-child-profile" type="button" style="
          width:100%;min-height:52px;border-radius:16px;
          background:linear-gradient(180deg,#1b2538,#111827);
          color:white;font-weight:900;border:1px solid rgba(255,255,255,.1);
          font-size:15px;cursor:pointer;text-align:left;padding:0 16px;
        ">👧 Child Profile — ${config.child.name || "Not set"}</button>

        <button id="btn-parental-screen-time" type="button" style="
          width:100%;min-height:52px;border-radius:16px;
          background:linear-gradient(180deg,#1b2538,#111827);
          color:white;font-weight:900;border:1px solid rgba(255,255,255,.1);
          font-size:15px;cursor:pointer;text-align:left;padding:0 16px;
        ">⏱️ Screen Time — ${config.screenTime.enabled ? `${config.screenTime.dailyLimitMinutes}min/day` : "OFF"}</button>

        <button id="btn-parental-features" type="button" style="
          width:100%;min-height:52px;border-radius:16px;
          background:linear-gradient(180deg,#1b2538,#111827);
          color:white;font-weight:900;border:1px solid rgba(255,255,255,.1);
          font-size:15px;cursor:pointer;text-align:left;padding:0 16px;
        ">🎮 Feature Access Controls</button>

        <button id="btn-parental-lobbies" type="button" style="
          width:100%;min-height:52px;border-radius:16px;
          background:linear-gradient(180deg,#1b2538,#111827);
          color:white;font-weight:900;border:1px solid rgba(255,255,255,.1);
          font-size:15px;cursor:pointer;text-align:left;padding:0 16px;
        ">🌍 Lobby Controls — ${String(config.lobbies.allowedType || "family").toUpperCase()}</button>

        <button id="btn-parental-contacts" type="button" style="
          width:100%;min-height:52px;border-radius:16px;
          background:linear-gradient(180deg,#1b2538,#111827);
          color:white;font-weight:900;border:1px solid rgba(255,255,255,.1);
          font-size:15px;cursor:pointer;text-align:left;padding:0 16px;
        ">📞 Approved Contacts — ${(config.parent.approvedContacts || []).length} added</button>

        <button id="btn-parental-alerts" type="button" style="
          width:100%;min-height:52px;border-radius:16px;
          background:linear-gradient(180deg,${unreadAlerts > 0 ? "#261b08" : "#1b2538"},#111827);
          color:white;font-weight:900;
          border:1px solid ${unreadAlerts > 0 ? "rgba(255,176,0,.45)" : "rgba(255,255,255,.1)"};
          font-size:15px;cursor:pointer;text-align:left;padding:0 16px;
        ">🔔 Alerts Log — ${unreadAlerts > 0 ? `${unreadAlerts} unread` : "All clear"}</button>

        <button id="btn-parental-family-link" type="button" style="
          width:100%;min-height:52px;border-radius:16px;
          background:linear-gradient(180deg,${isLinked ? "#0d2538" : "#1b2538"},#111827);
          color:white;font-weight:900;
          border:1px solid ${isLinked ? "rgba(0,212,255,.45)" : "rgba(255,255,255,.1)"};
          font-size:15px;cursor:pointer;text-align:left;padding:0 16px;
        ">🔗 Family Linking — ${isLinked ? `Linked (${familyCode})` : "Not linked"}</button>

        <button id="btn-parental-change-pin" type="button" style="
          width:100%;min-height:48px;border-radius:16px;
          background:#111827;color:#ffd54a;font-weight:900;
          border:1px solid rgba(255,213,74,.3);
          font-size:14px;cursor:pointer;
        ">🔑 Change Parent PIN</button>

      </div>

      <button id="btn-parental-close-bottom" type="button" style="
        width:100%;min-height:46px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>

    </div>

    <style>
      @keyframes sosPulse {
        0% { box-shadow:0 0 0 rgba(255,59,59,.5); }
        50% { box-shadow:0 0 28px rgba(255,59,59,.75); }
        100% { box-shadow:0 0 0 rgba(255,59,59,.5); }
      }
    </style>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-parental-close")?.addEventListener("click", () => modal.remove());
  document.getElementById("btn-parental-close-bottom")?.addEventListener("click", () => modal.remove());

  document.getElementById("btn-cancel-sos")?.addEventListener("click", () => {
    const updated = cancelSOS(loadParentalConfig(), "parent");
    modal.remove();
    renderParentalDashboard(updated);
  });

  document.getElementById("btn-parental-child-profile")?.addEventListener("click", () => {
    modal.remove();
    openChildProfileEditor();
  });

  document.getElementById("btn-parental-screen-time")?.addEventListener("click", () => {
    modal.remove();
    openScreenTimeEditor();
  });

  document.getElementById("btn-parental-features")?.addEventListener("click", () => {
    modal.remove();
    openFeatureControls();
  });

  document.getElementById("btn-parental-lobbies")?.addEventListener("click", () => {
    modal.remove();
    openLobbyControls();
  });

  document.getElementById("btn-parental-contacts")?.addEventListener("click", () => {
    modal.remove();
    openContactsEditor();
  });

  document.getElementById("btn-parental-alerts")?.addEventListener("click", () => {
    modal.remove();
    openAlertsLog();
  });

  document.getElementById("btn-parental-family-link")?.addEventListener("click", () => {
    modal.remove();
    openFamilyLinkingScreen();
  });

  document.getElementById("btn-parental-change-pin")?.addEventListener("click", () => {
    modal.remove();
    openChangePinScreen();
  });
}
/* =========================================================
   SETUP SCREEN — FIRST TIME
========================================================= */

function openParentalSetup() {
  const old = document.getElementById("parental-setup-screen");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "parental-setup-screen";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:22px;">
        <div style="font-size:42px;margin-bottom:10px;">🛡️</div>
        <div style="font-size:24px;font-weight:1000;color:#ffd54a;">PARENTAL CONTROLS</div>
        <div style="font-size:14px;opacity:.85;margin-top:8px;line-height:1.5;">
          Set up your parent PIN and child profile to protect your family's experience.
        </div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">STEP 1 — YOUR NAME</div>
        <input id="setup-parent-name" type="text" placeholder="Your name (e.g. Khyl)" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
        " />
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">STEP 2 — CREATE PARENT PIN</div>
        <div style="font-size:13px;opacity:.85;margin-bottom:10px;">4 digits only. Keep this private.</div>
        <input id="setup-pin-1" type="password" inputmode="numeric" maxlength="4" placeholder="Create PIN" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:20px;font-weight:900;
          letter-spacing:.3em;outline:none;margin-bottom:10px;
        " />
        <input id="setup-pin-2" type="password" inputmode="numeric" maxlength="4" placeholder="Confirm PIN" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:20px;font-weight:900;
          letter-spacing:.3em;outline:none;
        " />
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">STEP 3 — CHILD DETAILS</div>
        <input id="setup-child-name" type="text" placeholder="Child's name (e.g. Khylan)" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
          margin-bottom:10px;
        " />
        <input id="setup-child-age" type="number" min="4" max="17" placeholder="Child's age" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
        " />
      </div>

      <button id="btn-setup-save" type="button" style="
        width:100%;min-height:54px;border-radius:18px;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-weight:1000;font-size:16px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">SAVE AND ACTIVATE</button>

      <button id="btn-setup-cancel" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CANCEL</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-setup-cancel")?.addEventListener("click", () => modal.remove());

  document.getElementById("btn-setup-save")?.addEventListener("click", () => {
    const parentName = document.getElementById("setup-parent-name")?.value?.trim() || "";
    const pin1 = document.getElementById("setup-pin-1")?.value?.trim() || "";
    const pin2 = document.getElementById("setup-pin-2")?.value?.trim() || "";
    const childName = document.getElementById("setup-child-name")?.value?.trim() || "";
    const childAge = parseInt(document.getElementById("setup-child-age")?.value || "0");

    if (!parentName) { alert("Enter your name."); return; }
    if (!isValidPin(pin1)) { alert("PIN must be exactly 4 digits."); return; }
    if (pin1 !== pin2) { alert("PINs do not match."); return; }
    if (!childName) { alert("Enter child name."); return; }
    if (!childAge || childAge < 4 || childAge > 17) { alert("Enter a valid age between 4 and 17."); return; }

    const config = createDefaultParentalConfig();
    config.createdAt = new Date().toISOString();
    config.parent.name = parentName;
    config.parent.pin = pin1;
    config.parent.pinSet = true;
    config.child.name = childName;
    config.child.age = childAge;
    config.child.profileSet = true;

    if (childAge < 13) {
      config.features.trueCrimeEnabled = false;
      config.lobbies.allowedType = "family";
      config.lobbies.canCreatePublic = false;
      config.lobbies.canJoinPublic = false;
    }

    saveParentalConfig(config);

    modal.remove();

    alert(`Parental controls set up for ${childName}. PIN saved.`);
    renderParentalDashboard(config);
  });
}

/* =========================================================
   CHILD PROFILE EDITOR
========================================================= */

function openChildProfileEditor() {
  const config = loadParentalConfig();

  const modal = document.createElement("div");
  modal.id = "parental-child-profile";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-child-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Child Profile</div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">CHILD NAME</div>
        <input id="child-name-input" type="text" value="${config.child.name || ""}" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
        " />
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">CHILD AGE</div>
        <input id="child-age-input" type="number" min="4" max="17" value="${config.child.age || ""}" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
        " />
      </div>

      <button id="btn-child-save" type="button" style="
        width:100%;min-height:52px;border-radius:16px;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-weight:1000;font-size:15px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">SAVE PROFILE</button>

      <button id="btn-child-cancel" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CANCEL</button>
    </div>
  `;

  document.body.appendChild(modal);

  const back = () => { modal.remove(); renderParentalDashboard(loadParentalConfig()); };

  document.getElementById("btn-child-back")?.addEventListener("click", back);
  document.getElementById("btn-child-cancel")?.addEventListener("click", back);

  document.getElementById("btn-child-save")?.addEventListener("click", () => {
    const name = document.getElementById("child-name-input")?.value?.trim() || "";
    const age = parseInt(document.getElementById("child-age-input")?.value || "0");

    if (!name) { alert("Enter child name."); return; }
    if (!age || age < 4 || age > 17) { alert("Enter a valid age between 4 and 17."); return; }

    config.child.name = name;
    config.child.age = age;
    config.child.profileSet = true;

    saveParentalConfig(config);
    modal.remove();
    renderParentalDashboard(config);
  });
}

/* =========================================================
   SCREEN TIME EDITOR
========================================================= */

function openScreenTimeEditor() {
  const config = loadParentalConfig();
  const st = config.screenTime;

  const modal = document.createElement("div");
  modal.id = "parental-screen-time";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-st-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Screen Time</div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-weight:900;color:#ffd54a;">SCREEN TIME LIMITS</div>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="st-enabled" ${st.enabled ? "checked" : ""} style="width:18px;height:18px;" />
            <span style="font-weight:900;">${st.enabled ? "ON" : "OFF"}</span>
          </label>
        </div>

        <div style="margin-top:14px;">
          <div style="font-size:13px;opacity:.8;margin-bottom:6px;">Daily limit (minutes)</div>
          <input id="st-daily-limit" type="number" min="15" max="720" value="${st.dailyLimitMinutes || 120}" style="
            width:100%;box-sizing:border-box;min-height:44px;border-radius:12px;
            border:1px solid rgba(255,255,255,.2);background:#0b1220;
            color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
          " />
        </div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">LOCK TIMES</div>

        <div style="margin-bottom:10px;">
          <div style="font-size:13px;opacity:.8;margin-bottom:6px;">Lock app after this hour (24hr)</div>
          <input id="st-lock-after" type="number" min="0" max="23" value="${st.lockAfterHour ?? 21}" style="
            width:100%;box-sizing:border-box;min-height:44px;border-radius:12px;
            border:1px solid rgba(255,255,255,.2);background:#0b1220;
            color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
          " />
        </div>

        <div>
          <div style="font-size:13px;opacity:.8;margin-bottom:6px;">Unlock after this hour (24hr)</div>
          <input id="st-unlock-after" type="number" min="0" max="23" value="${st.unlockAfterHour ?? 7}" style="
            width:100%;box-sizing:border-box;min-height:44px;border-radius:12px;
            border:1px solid rgba(255,255,255,.2);background:#0b1220;
            color:white;padding:0 12px;font-size:16px;font-weight:900;outline:none;
          " />
        </div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:900;color:#ffd54a;">BLOCK SCHOOL HOURS</div>
            <div style="font-size:12px;opacity:.75;margin-top:3px;">Mon–Fri during school time</div>
          </div>
          <input type="checkbox" id="st-school" ${st.blockSchoolHours ? "checked" : ""} style="width:18px;height:18px;" />
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
          <div>
            <div style="font-size:12px;opacity:.8;margin-bottom:4px;">School starts</div>
            <input id="st-school-start" type="number" min="6" max="12" value="${st.schoolStartHour ?? 9}" style="
              width:100%;box-sizing:border-box;min-height:42px;border-radius:12px;
              border:1px solid rgba(255,255,255,.2);background:#0b1220;
              color:white;padding:0 12px;font-size:15px;font-weight:900;outline:none;
            " />
          </div>
          <div>
            <div style="font-size:12px;opacity:.8;margin-bottom:4px;">School ends</div>
            <input id="st-school-end" type="number" min="12" max="18" value="${st.schoolEndHour ?? 15}" style="
              width:100%;box-sizing:border-box;min-height:42px;border-radius:12px;
              border:1px solid rgba(255,255,255,.2);background:#0b1220;
              color:white;padding:0 12px;font-size:15px;font-weight:900;outline:none;
            " />
          </div>
        </div>
      </div>

      <button id="btn-st-save" type="button" style="
        width:100%;min-height:52px;border-radius:16px;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-weight:1000;font-size:15px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">SAVE SCREEN TIME SETTINGS</button>

      <button id="btn-st-cancel" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CANCEL</button>
    </div>
  `;

  document.body.appendChild(modal);

  const back = () => { modal.remove(); renderParentalDashboard(loadParentalConfig()); };

  document.getElementById("btn-st-back")?.addEventListener("click", back);
  document.getElementById("btn-st-cancel")?.addEventListener("click", back);

  document.getElementById("btn-st-save")?.addEventListener("click", () => {
    config.screenTime.enabled = document.getElementById("st-enabled")?.checked || false;
    config.screenTime.dailyLimitMinutes = parseInt(document.getElementById("st-daily-limit")?.value || "120");
    config.screenTime.lockAfterHour = parseInt(document.getElementById("st-lock-after")?.value || "21");
    config.screenTime.unlockAfterHour = parseInt(document.getElementById("st-unlock-after")?.value || "7");
    config.screenTime.blockSchoolHours = document.getElementById("st-school")?.checked || false;
    config.screenTime.schoolStartHour = parseInt(document.getElementById("st-school-start")?.value || "9");
    config.screenTime.schoolEndHour = parseInt(document.getElementById("st-school-end")?.value || "15");

    saveParentalConfig(config);
    modal.remove();
    renderParentalDashboard(config);
  });
}

/* =========================================================
   FEATURE CONTROLS
========================================================= */

function openFeatureControls() {
  const config = loadParentalConfig();
  const f = config.features;

  const features = [
    { key: "mapEnabled", label: "🗺️ Map & GPS" },
    { key: "explorerEnabled", label: "🧭 Explorer Mode" },
    { key: "territoryEnabled", label: "🚩 Territory Mode" },
    { key: "leoidsEnabled", label: "🏃 LEOIDS Mode" },
    { key: "trueCrimeEnabled", label: "🔒 True Crime / Adult Content" },
    { key: "shopEnabled", label: "🛒 Shop" },
    { key: "leaderboardEnabled", label: "🏆 Leaderboard" },
    { key: "messagingEnabled", label: "💬 Messaging" },
  ];

  const modal = document.createElement("div");
  modal.id = "parental-features";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-feat-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Feature Access</div>
      </div>

      <div style="font-size:13px;opacity:.8;margin-bottom:14px;line-height:1.5;">
        Turn features on or off. Locked features are completely hidden from the child.
      </div>

      <div style="display:grid;gap:10px;margin-bottom:16px;">
        ${features.map(feat => `
          <div style="
            display:flex;justify-content:space-between;align-items:center;
            padding:14px 16px;border-radius:16px;
            background:#111827;border:1px solid rgba(255,255,255,.1);
          ">
            <div style="font-weight:900;font-size:15px;">${feat.label}</div>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" data-feature="${feat.key}" ${f[feat.key] ? "checked" : ""} style="width:20px;height:20px;" />
              <span style="font-size:12px;font-weight:900;opacity:.8;">${f[feat.key] ? "ON" : "OFF"}</span>
            </label>
          </div>
        `).join("")}
      </div>

      <button id="btn-feat-save" type="button" style="
        width:100%;min-height:52px;border-radius:16px;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-weight:1000;font-size:15px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">SAVE FEATURE SETTINGS</button>

      <button id="btn-feat-cancel" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CANCEL</button>
    </div>
  `;

  document.body.appendChild(modal);

  const back = () => { modal.remove(); renderParentalDashboard(loadParentalConfig()); };

  document.getElementById("btn-feat-back")?.addEventListener("click", back);
  document.getElementById("btn-feat-cancel")?.addEventListener("click", back);

  document.getElementById("btn-feat-save")?.addEventListener("click", () => {
    document.querySelectorAll("[data-feature]").forEach(checkbox => {
      const key = checkbox.dataset.feature;
      if (key && key in config.features) {
        config.features[key] = checkbox.checked;
      }
    });

    saveParentalConfig(config);
    modal.remove();
    renderParentalDashboard(config);
  });
}

/* =========================================================
   LOBBY CONTROLS
========================================================= */

function openLobbyControls() {
  const config = loadParentalConfig();
  const l = config.lobbies;

  const modal = document.createElement("div");
  modal.id = "parental-lobbies";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-lobby-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Lobby Controls</div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">ALLOWED LOBBY TYPE</div>

        ${["public", "family", "friends"].map(type => `
          <label style="
            display:flex;align-items:center;gap:12px;
            padding:12px;border-radius:14px;margin-bottom:8px;cursor:pointer;
            background:${l.allowedType === type ? "rgba(0,212,255,.14)" : "rgba(255,255,255,.04)"};
            border:1px solid ${l.allowedType === type ? "rgba(0,212,255,.55)" : "rgba(255,255,255,.08)"};
          ">
            <input type="radio" name="lobby-type" value="${type}" ${l.allowedType === type ? "checked" : ""} style="width:18px;height:18px;" />
            <div>
              <div style="font-weight:900;">
                ${type === "public" ? "🌍 PUBLIC" : type === "family" ? "👨‍👩‍👧 FAMILY ONLY" : "👥 FRIENDS ONLY"}
              </div>
              <div style="font-size:12px;opacity:.75;margin-top:2px;">
                ${type === "public" ? "Open to everyone. Anyone can join." : type === "family" ? "Only family members you invite." : "Only approved friends can join."}
              </div>
            </div>
          </label>
        `).join("")}
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">INVITE PERMISSIONS</div>

        ${[
          { key: "canCreatePublic", label: "Can create public lobbies" },
          { key: "canJoinPublic", label: "Can join public lobbies" },
          { key: "canSendInvites", label: "Can send game invites" },
          { key: "canAcceptInvites", label: "Can accept game invites" },
        ].map(perm => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);">
            <div style="font-size:14px;">${perm.label}</div>
            <input type="checkbox" data-lobby="${perm.key}" ${l[perm.key] ? "checked" : ""} style="width:18px;height:18px;" />
          </div>
        `).join("")}
      </div>

      <button id="btn-lobby-save" type="button" style="
        width:100%;min-height:52px;border-radius:16px;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-weight:1000;font-size:15px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">SAVE LOBBY SETTINGS</button>

      <button id="btn-lobby-cancel" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CANCEL</button>
    </div>
  `;

  document.body.appendChild(modal);

  const back = () => { modal.remove(); renderParentalDashboard(loadParentalConfig()); };

  document.getElementById("btn-lobby-back")?.addEventListener("click", back);
  document.getElementById("btn-lobby-cancel")?.addEventListener("click", back);

  document.getElementById("btn-lobby-save")?.addEventListener("click", () => {
    const selectedType = document.querySelector("input[name='lobby-type']:checked")?.value || "family";
    config.lobbies.allowedType = selectedType;

    document.querySelectorAll("[data-lobby]").forEach(checkbox => {
      const key = checkbox.dataset.lobby;
      if (key && key in config.lobbies) {
        config.lobbies[key] = checkbox.checked;
      }
    });

    saveParentalConfig(config);
    modal.remove();
    renderParentalDashboard(config);
  });
}

/* =========================================================
   CONTACTS EDITOR
========================================================= */

function openContactsEditor() {
  const config = loadParentalConfig();
  const contacts = config.parent.approvedContacts || [];

  const modal = document.createElement("div");
  modal.id = "parental-contacts";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  const renderContactsList = () => {
    const list = document.getElementById("contacts-list");
    if (!list) return;

    list.innerHTML = contacts.length
      ? contacts.map((c, i) => `
          <div style="
            display:flex;justify-content:space-between;align-items:center;
            padding:12px 14px;border-radius:14px;margin-bottom:8px;
            background:#111827;border:1px solid rgba(255,255,255,.1);
          ">
            <div>
              <div style="font-weight:900;">${c.name || "Contact"}</div>
              <div style="font-size:12px;opacity:.75;margin-top:2px;">${c.number || ""} ${c.relation ? `• ${c.relation}` : ""}</div>
            </div>
            <button data-remove="${i}" type="button" style="
              min-width:36px;height:36px;border-radius:10px;
              background:#3a1111;color:#ff6b6b;border:1px solid rgba(255,59,59,.35);
              font-weight:900;cursor:pointer;font-size:16px;
            ">✕</button>
          </div>
        `).join("")
      : `<div style="opacity:.7;padding:12px;">No contacts added yet.</div>`;

    list.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.remove);
        contacts.splice(index, 1);
        config.parent.approvedContacts = contacts;
        saveParentalConfig(config);
        renderContactsList();
      });
    });
  };

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-contacts-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Approved Contacts</div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <div style="font-weight:900;color:#ffd54a;margin-bottom:12px;">ADD NEW CONTACT</div>

        <input id="contact-name" type="text" placeholder="Name (e.g. Dad, Nana)" style="
          width:100%;box-sizing:border-box;min-height:44px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:15px;font-weight:900;outline:none;
          margin-bottom:8px;
        " />

        <input id="contact-number" type="tel" placeholder="Phone number" style="
          width:100%;box-sizing:border-box;min-height:44px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:15px;font-weight:900;outline:none;
          margin-bottom:8px;
        " />

        <input id="contact-relation" type="text" placeholder="Relation (e.g. Uncle, Teacher)" style="
          width:100%;box-sizing:border-box;min-height:44px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:15px;font-weight:900;outline:none;
          margin-bottom:12px;
        " />

        <button id="btn-add-contact" type="button" style="
          width:100%;min-height:46px;border-radius:14px;
          background:#22c55e;color:#05070b;font-weight:1000;
          border:none;cursor:pointer;
        ">+ ADD CONTACT</button>
      </div>

      <div id="contacts-list" style="margin-bottom:16px;"></div>

      <button id="btn-contacts-close" type="button" style="
        width:100%;min-height:46px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">DONE</button>
    </div>
  `;

  document.body.appendChild(modal);
  renderContactsList();

  const back = () => { modal.remove(); renderParentalDashboard(loadParentalConfig()); };

  document.getElementById("btn-contacts-back")?.addEventListener("click", back);
  document.getElementById("btn-contacts-close")?.addEventListener("click", back);

  document.getElementById("btn-add-contact")?.addEventListener("click", () => {
    const name = document.getElementById("contact-name")?.value?.trim() || "";
    const number = document.getElementById("contact-number")?.value?.trim() || "";
    const relation = document.getElementById("contact-relation")?.value?.trim() || "";

    if (!name) { alert("Enter contact name."); return; }

    contacts.push({ name, number, relation, addedAt: new Date().toISOString() });
    config.parent.approvedContacts = contacts;
    saveParentalConfig(config);

    document.getElementById("contact-name").value = "";
    document.getElementById("contact-number").value = "";
    document.getElementById("contact-relation").value = "";

    renderContactsList();
  });
}

/* =========================================================
   ALERTS LOG
========================================================= */

function openAlertsLog() {
  const config = loadParentalConfig();
  const alerts = config.alerts || [];

  alerts.forEach(a => { a.read = true; });
  saveParentalConfig(config);

  const modal = document.createElement("div");
  modal.id = "parental-alerts-log";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:560px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-alerts-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Alerts Log</div>
      </div>

      <div style="display:grid;gap:8px;margin-bottom:16px;">
        ${alerts.length
          ? alerts.map(alert => `
              <div style="
                padding:12px 14px;border-radius:14px;
                background:#111827;
                border-left:4px solid ${levelColor(alert.level)};
              ">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                  <div style="font-size:14px;font-weight:900;line-height:1.4;">
                    ${levelIcon(alert.level)} ${alert.message || "Alert"}
                  </div>
                </div>
                <div style="font-size:11px;opacity:.7;margin-top:6px;">
                  ${alert.createdAt ? new Date(alert.createdAt).toLocaleString() : ""}
                </div>
              </div>
            `).join("")
          : `<div style="opacity:.7;padding:12px;">No alerts logged yet.</div>`
        }
      </div>

      <button id="btn-alerts-close" type="button" style="
        width:100%;min-height:46px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CLOSE</button>
    </div>
  `;

  document.body.appendChild(modal);

  const back = () => { modal.remove(); renderParentalDashboard(loadParentalConfig()); };
  document.getElementById("btn-alerts-back")?.addEventListener("click", back);
  document.getElementById("btn-alerts-close")?.addEventListener("click", back);
}

/* =========================================================
   CHANGE PIN
========================================================= */

function openChangePinScreen() {
  const config = loadParentalConfig();

  const modal = document.createElement("div");
  modal.id = "parental-change-pin";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;overflow-y:auto;padding:18px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  modal.innerHTML = `
    <div style="max-width:480px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button id="btn-pin-back" type="button" style="
          width:42px;height:42px;border-radius:50%;
          background:#111827;color:white;border:1px solid rgba(255,255,255,.15);
          font-size:18px;cursor:pointer;
        ">←</button>
        <div style="font-size:20px;font-weight:1000;">Change Parent PIN</div>
      </div>

      <div style="padding:16px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;">
        <input id="pin-current" type="password" inputmode="numeric" maxlength="4" placeholder="Current PIN" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:20px;font-weight:900;
          letter-spacing:.3em;outline:none;margin-bottom:10px;
        " />
        <input id="pin-new-1" type="password" inputmode="numeric" maxlength="4" placeholder="New PIN" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:20px;font-weight:900;
          letter-spacing:.3em;outline:none;margin-bottom:10px;
        " />
        <input id="pin-new-2" type="password" inputmode="numeric" maxlength="4" placeholder="Confirm new PIN" style="
          width:100%;box-sizing:border-box;min-height:46px;border-radius:12px;
          border:1px solid rgba(255,255,255,.2);background:#0b1220;
          color:white;padding:0 12px;font-size:20px;font-weight:900;
          letter-spacing:.3em;outline:none;
        " />
      </div>

      <button id="btn-pin-save" type="button" style="
        width:100%;min-height:52px;border-radius:16px;
        background:linear-gradient(180deg,#ffe27c,#ffd54a 55%,#efb000);
        color:#231600;font-weight:1000;font-size:15px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">CHANGE PIN</button>

      <button id="btn-pin-cancel" type="button" style="
        width:100%;min-height:44px;border-radius:16px;
        background:#111827;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.1);cursor:pointer;
      ">CANCEL</button>
    </div>
  `;

  document.body.appendChild(modal);

  const back = () => { modal.remove(); renderParentalDashboard(loadParentalConfig()); };
  document.getElementById("btn-pin-back")?.addEventListener("click", back);
  document.getElementById("btn-pin-cancel")?.addEventListener("click", back);

  document.getElementById("btn-pin-save")?.addEventListener("click", () => {
    const current = document.getElementById("pin-current")?.value?.trim() || "";
    const newPin1 = document.getElementById("pin-new-1")?.value?.trim() || "";
    const newPin2 = document.getElementById("pin-new-2")?.value?.trim() || "";

    if (!verifyParentPin(config, current)) { alert("Incorrect current PIN."); return; }
    if (!isValidPin(newPin1)) { alert("New PIN must be exactly 4 digits."); return; }
    if (newPin1 !== newPin2) { alert("New PINs do not match."); return; }

    config.parent.pin = newPin1;
    saveParentalConfig(config);
    alert("PIN changed successfully.");
    modal.remove();
    renderParentalDashboard(config);
  });
}

/* =========================================================
   SOS BUTTON — CHILD SIDE
========================================================= */

function renderSOSButton() {
  const old = document.getElementById("sos-button-container");
  if (old) old.remove();

  const config = loadParentalConfig();
  if (!config.parent.pinSet) return;

  const container = document.createElement("div");
  container.id = "sos-button-container";
  container.style.cssText = `
    position:fixed;
    bottom:160px;
    right:16px;
    z-index:50000;
  `;

  container.innerHTML = `
    <button id="sos-btn" type="button" style="
      width:64px;height:64px;border-radius:50%;
      background:radial-gradient(circle at 35% 35%,#ff6b6b,#ff3b3b 55%,#cc1111);
      color:white;font-size:24px;font-weight:1000;
      border:3px solid rgba(255,255,255,.9);
      box-shadow:0 0 18px rgba(255,59,59,.65),0 4px 14px rgba(0,0,0,.5);
      cursor:pointer;
      animation:sosIdlePulse 2.5s infinite ease-in-out;
    ">🆘</button>

    <style>
      @keyframes sosIdlePulse {
        0% { box-shadow:0 0 10px rgba(255,59,59,.45),0 4px 14px rgba(0,0,0,.5); }
        50% { box-shadow:0 0 28px rgba(255,59,59,.75),0 4px 14px rgba(0,0,0,.5); }
        100% { box-shadow:0 0 10px rgba(255,59,59,.45),0 4px 14px rgba(0,0,0,.5); }
      }
    </style>
  `;

  document.body.appendChild(container);

  let holdTimer = null;
  let holdStarted = false;

  const btn = document.getElementById("sos-btn");

  const startHold = () => {
    holdStarted = true;
    btn.style.transform = "scale(.95)";
    btn.style.opacity = ".8";

    holdTimer = setTimeout(() => {
      if (!holdStarted) return;
      activateSOS();
    }, 3000);
  };

  const cancelHold = () => {
    holdStarted = false;
    clearTimeout(holdTimer);
    btn.style.transform = "";
    btn.style.opacity = "";

    showSOSConfirmDialog();
  };

  btn.addEventListener("mousedown", startHold);
  btn.addEventListener("touchstart", (e) => { e.preventDefault(); startHold(); }, { passive: false });
  btn.addEventListener("mouseup", cancelHold);
  btn.addEventListener("touchend", cancelHold);
  btn.addEventListener("mouseleave", () => {
    if (holdStarted) {
      holdStarted = false;
      clearTimeout(holdTimer);
      btn.style.transform = "";
      btn.style.opacity = "";
    }
  });
}

function showSOSConfirmDialog() {
  const old = document.getElementById("sos-confirm-dialog");
  if (old) old.remove();

  const dialog = document.createElement("div");
  dialog.id = "sos-confirm-dialog";
  dialog.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    background:rgba(0,0,0,.88);
    display:flex;align-items:center;justify-content:center;
    padding:20px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  dialog.innerHTML = `
    <div style="
      width:min(92vw,380px);
      border:2px solid #ff3b3b;border-radius:26px;
      background:linear-gradient(180deg,#2a1116,#05070b);
      padding:24px;text-align:center;color:white;
      box-shadow:0 0 38px rgba(255,59,59,.35);
    ">
      <div style="font-size:52px;margin-bottom:12px;">🆘</div>
      <div style="font-size:22px;font-weight:1000;color:#ff3b3b;margin-bottom:10px;">SEND SOS?</div>
      <div style="font-size:14px;opacity:.9;line-height:1.5;margin-bottom:20px;">
        This will send an alert to your parent or guardian straight away.
        Only press YES if you need help.
      </div>
      <button id="sos-confirm-yes" type="button" style="
        width:100%;min-height:54px;border-radius:18px;
        background:#ff3b3b;color:white;font-weight:1000;font-size:18px;
        border:none;cursor:pointer;margin-bottom:10px;
      ">YES — SEND ALERT</button>
      <button id="sos-confirm-no" type="button" style="
        width:100%;min-height:46px;border-radius:16px;
        background:#202a3c;color:white;font-weight:900;
        border:none;cursor:pointer;
      ">NO — CANCEL</button>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById("sos-confirm-no")?.addEventListener("click", () => dialog.remove());
  document.getElementById("sos-confirm-yes")?.addEventListener("click", () => {
    dialog.remove();
    activateSOS();
  });
}

function activateSOS() {
  const config = loadParentalConfig();
  const updated = triggerSOS(config);

  const overlay = document.createElement("div");
  overlay.id = "sos-active-overlay";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999999;
    background:rgba(200,0,0,.18);
    pointer-events:none;
    animation:sosScreenPulse .75s infinite;
    border:4px solid #ff3b3b;
  `;

  document.head.insertAdjacentHTML("beforeend", `
    <style id="sos-active-style">
      @keyframes sosScreenPulse {
        0% { opacity:.3; }
        50% { opacity:1; }
        100% { opacity:.3; }
      }
    </style>
  `);

  document.body.appendChild(overlay);

  const banner = document.createElement("div");
  banner.id = "sos-active-banner";
  banner.style.cssText = `
    position:fixed;top:0;left:0;right:0;
    z-index:9999998;padding:14px;
    background:#ff3b3b;color:white;
    text-align:center;font-weight:1000;font-size:16px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    box-shadow:0 4px 18px rgba(255,59,59,.65);
  `;
  banner.innerText = "🆘 SOS SENT — Help is on the way";
  document.body.appendChild(banner);

  speakSOSConfirmation();

  console.log("SOS TRIGGERED:", {
    childName: updated.child?.name,
    triggeredAt: updated.sos?.lastTriggeredAt,
    contacts: updated.parent?.approvedContacts,
  });
}

function speakSOSConfirmation() {
  try {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("SOS alert sent. Help is on the way. Stay where you are.");
      utterance.rate = 0.9;
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
  } catch {}
}

/* =========================================================
   SCREEN LOCK — CHILD SIDE
========================================================= */

function checkAndApplyScreenLock() {
  const config = loadParentalConfig();

  if (!config.screenTime.enabled) return false;

  const timeLocked = isLockedByTime(config);
  const limitLocked = isLockedByDailyLimit(config);

  if (!timeLocked && !limitLocked) {
    const existing = document.getElementById("screen-lock-overlay");
    if (existing) existing.remove();
    return false;
  }

  const existing = document.getElementById("screen-lock-overlay");
  if (existing) return true;

  const reason = timeLocked ? "Outside allowed hours." : "Daily time limit reached.";

  const overlay = document.createElement("div");
  overlay.id = "screen-lock-overlay";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:999998;
    background:linear-gradient(180deg,#07111f,#03080f);
    color:white;display:flex;align-items:center;justify-content:center;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  overlay.innerHTML = `
    <div style="text-align:center;padding:28px;max-width:380px;">
      <div style="font-size:64px;margin-bottom:16px;">🔒</div>
      <div style="font-size:24px;font-weight:1000;color:#ffd54a;margin-bottom:10px;">APP LOCKED</div>
      <div style="font-size:15px;opacity:.9;line-height:1.5;margin-bottom:24px;">${reason}</div>
      <button id="btn-screen-unlock" type="button" style="
        min-height:48px;padding:0 24px;border-radius:16px;
        background:#202a3c;color:white;font-weight:900;
        border:1px solid rgba(255,255,255,.2);cursor:pointer;font-size:14px;
      ">Parent Unlock</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("btn-screen-unlock")?.addEventListener("click", () => {
    const entered = prompt("Enter parent PIN to unlock");
    if (!entered) return;

    if (!verifyParentPin(config, entered)) {
      alert("Incorrect PIN.");
      return;
    }

    overlay.remove();
    addAlert(loadParentalConfig(), `🔓 Screen lock bypassed by parent at ${new Date().toLocaleString()}`, "amber");
  });

  return true;
}

/* =========================================================
   CHECK-IN BUTTON — CHILD SIDE
========================================================= */

function renderCheckInButton() {
  const old = document.getElementById("checkin-button-container");
  if (old) old.remove();

  const config = loadParentalConfig();
  if (!config.parent.pinSet) return;

  const container = document.createElement("div");
  container.id = "checkin-button-container";
  container.style.cssText = `
    position:fixed;
    bottom:234px;
    right:16px;
    z-index:50000;
  `;

  container.innerHTML = `
    <button id="checkin-btn" type="button" style="
      width:56px;height:56px;border-radius:50%;
      background:radial-gradient(circle at 35% 35%,#66ff99,#22c55e 55%,#15803d);
      color:white;font-size:20px;font-weight:1000;
      border:3px solid rgba(255,255,255,.9);
      box-shadow:0 0 14px rgba(34,197,94,.55),0 4px 14px rgba(0,0,0,.5);
      cursor:pointer;
    " title="Check In — I am safe">✅</button>
  `;

  document.body.appendChild(container);

  document.getElementById("checkin-btn")?.addEventListener("click", () => {
    const config = loadParentalConfig();
    const childName = config.child.name || "Child";
    const now = new Date().toLocaleString();

    addAlert(config, `✅ CHECK-IN: ${childName} is safe at ${now}`, "green");

    const toast = document.createElement("div");
    toast.style.cssText = `
      position:fixed;bottom:310px;right:16px;z-index:999999;
      background:#22c55e;color:#05070b;font-weight:1000;
      padding:10px 16px;border-radius:14px;font-size:14px;
      box-shadow:0 0 18px rgba(34,197,94,.55);
      font-family:system-ui,-apple-system,sans-serif;
    `;
    toast.innerText = "✅ Check-in sent!";
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
  });
}

/* =========================================================
   SCREEN TIME TICKER
========================================================= */

function startScreenTimeTicker() {
  setInterval(() => {
    const config = loadParentalConfig();
    if (!config.screenTime.enabled) return;

    tickScreenTime(config);
    checkAndApplyScreenLock();
  }, 60000);
}

/* =========================================================
   INIT — CALL THIS FROM app.js
========================================================= */

export function initParentalControls() {
  renderSOSButton();
  renderCheckInButton();
  checkAndApplyScreenLock();
  startScreenTimeTicker();

  window.openParentalDashboard = openParentalDashboard;
  window.openParentalSetup = openParentalSetup;
  window.checkAndApplyScreenLock = checkAndApplyScreenLock;
  window.getParentalConfig = loadParentalConfig;
  window.isFeatureEnabled = (key) => {
    const config = loadParentalConfig();
    if (!config.parent.pinSet) return true;
    return config.features[key] !== false;
  };

  console.log("Parental controls initialised.");
}

export {
  loadParentalConfig,
  saveParentalConfig,
  openParentalDashboard,
  openParentalSetup,
  triggerSOS,
  cancelSOS,
  addAlert,
  isLockedByTime,
  isLockedByDailyLimit,
  checkAndApplyScreenLock,
  verifyParentPin,
};
