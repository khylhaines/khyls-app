export function Adult_Lock_System({ getState, saveState }) {
  function isAdultUnlocked() {
    return !!getState()?.adultUnlocked;
  }

  function unlockAdultMode(pin) {
    if (pin === "1986") {
      const state = getState();
      state.adultUnlocked = true;
      saveState?.();
      return true;
    }
    return false;
  }

  function lockAdultMode() {
    const state = getState();
    state.adultUnlocked = false;
    saveState?.();
  }

  return {
    isAdultUnlocked,
    unlockAdultMode,
    lockAdultMode,
  };
}
