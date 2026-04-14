export function createAdultLockSystem({ state, saveState, speakText, $ }) {
  function normaliseAdultLock(lock = {}) {
    return {
      unlocked: !!lock.unlocked,
      pin: typeof lock.pin === "string" ? lock.pin : "",
      sessionApproved: !!lock.sessionApproved,
      hideWhenKidsMode: !!lock.hideWhenKidsMode,
    };
  }

  function getAdultLock() {
    state.adultLock = normaliseAdultLock(state.adultLock || {});
    return state.adultLock;
  }

  function isValidParentPin(value) {
    return /^\d{4}$/.test(String(value || "").trim());
  }

  function setAdultPillState(el, label, isLocked) {
    if (!el) return;
    el.innerText = isLocked ? `🔒 ${label}` : label;
    el.dataset.locked = isLocked ? "true" : "false";
    el.style.opacity = isLocked ? "0.9" : "1";
  }

  function refreshAdultLockUI() {
    const lock = getAdultLock();

    const showAdult =
      !lock.hideWhenKidsMode ||
      state.tierMode !== "kid" ||
      lock.sessionApproved;

    const trueCrime = $("pill-truecrime");
    const conspiracy = $("pill-conspiracy");
    const history = $("pill-history");

    [trueCrime, conspiracy, history].forEach((btn) => {
      if (!btn) return;
      btn.style.display = showAdult ? "" : "none";
    });

    setAdultPillState(trueCrime, "TRUE CRIME", !lock.unlocked);
    setAdultPillState(conspiracy, "CONSPIRACY", !lock.unlocked);
    setAdultPillState(history, "HISTORY", !lock.unlocked);
  }

  function clearAdultSessionApproval() {
    const lock = getAdultLock();
    lock.sessionApproved = false;
    saveState?.();
  }

  function promptToCreateAdultPin() {
    alert(
      "Adult mode is locked.\n\nCreate a 4-digit parent PIN to unlock adult content on this device."
    );

    const pin1 = prompt("Create a 4-digit parent PIN");
    if (pin1 === null) return false;

    if (!isValidParentPin(pin1)) {
      alert("PIN must be exactly 4 digits.");
      return false;
    }

    const pin2 = prompt("Re-enter the 4-digit PIN");
    if (pin2 === null) return false;

    if (String(pin1).trim() !== String(pin2).trim()) {
      alert("PINs did not match.");
      return false;
    }

    const lock = getAdultLock();
    lock.pin = String(pin1).trim();
    lock.unlocked = true;
    lock.sessionApproved = true;

    saveState?.();
    refreshAdultLockUI();
    speakText?.("Adult archive unlocked.");
    return true;
  }

  function promptForAdultPinApproval() {
    const lock = getAdultLock();

    if (!lock.unlocked || !lock.pin) {
      return promptToCreateAdultPin();
    }

    const entered = prompt("Enter parent PIN for adult content");
    if (entered === null) return false;

    if (String(entered).trim() !== lock.pin) {
      alert("Incorrect parent PIN.");
      speakText?.("Incorrect parent PIN.");
      return false;
    }

    lock.sessionApproved = true;
    saveState?.();
    speakText?.("Adult archive approved.");
    return true;
  }

  function ensureAdultAccess() {
    const lock = getAdultLock();
    if (!lock.unlocked) return promptToCreateAdultPin();
    if (lock.sessionApproved) return true;
    return promptForAdultPinApproval();
  }

  return {
    normaliseAdultLock,
    getAdultLock,
    isValidParentPin,
    refreshAdultLockUI,
    clearAdultSessionApproval,
    promptToCreateAdultPin,
    promptForAdultPinApproval,
    ensureAdultAccess,
  };
}
