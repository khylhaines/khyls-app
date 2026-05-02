// leoids_system.js

export function createLeoidsSystem({
  getState,
  saveState,
  getMap,
  showModal,
  closeModal,
  showActionButton,
  refreshAllPinMarkers,
  speakText,
  $,
}) {
  const DEFAULT_ROUND_SECONDS = 1200; // 20 minutes
  const DEFAULT_HUNTER_DELAY_SECONDS = 120; // 2 minutes

  const leoidsState = {
    active: false,
    role: "runner",
    status: "free",
    roundTime: DEFAULT_ROUND_SECONDS,
    timeLeft: DEFAULT_ROUND_SECONDS,
    hunterDelay: DEFAULT_HUNTER_DELAY_SECONDS,
    hunterDelayLeft: DEFAULT_HUNTER_DELAY_SECONDS,
    huntersReleased: false,
    score: 0,
    coins: 0,
    startedAt: null,
    endedAt: null,
    intervalId: null,
  };

  function formatTime(seconds = 0) {
    const safe = Math.max(0, Number(seconds || 0));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function enterBattleMap() {
    showActionButton?.(false);

    if ($("map")) {
      $("map").classList.add("leoids-battle-map");
    }

    refreshAllPinMarkers?.();
  }

  function exitBattleMap() {
    if ($("map")) {
      $("map").classList.remove("leoids-battle-map");
    }

    refreshAllPinMarkers?.();
  }

  function openSetupPanel() {
    enterBattleMap();

    if ($("leoids-round-length")) {
      $("leoids-round-length").value = String(leoidsState.roundTime);
    }

    if ($("leoids-hunter-delay")) {
      $("leoids-hunter-delay").value = String(leoidsState.hunterDelay);
    }

    updatePanel();

    showModal?.("leoids-modal");
    speakText?.("LEOIDs battle map opened.");
  }

  function closeSetupPanel() {
    closeModal?.("leoids-modal");
  }

  function setRole(role = "runner") {
    leoidsState.role = role === "hunter" ? "hunter" : "runner";

    $("btn-leoids-runner")?.classList.toggle(
      "active",
      leoidsState.role === "runner"
    );

    $("btn-leoids-hunter")?.classList.toggle(
      "active",
      leoidsState.role === "hunter"
    );

    updatePanel();

    speakText?.(
      leoidsState.role === "hunter"
        ? "Hunter selected."
        : "Runner selected."
    );
  }

  function setRoundLength(seconds = DEFAULT_ROUND_SECONDS) {
    leoidsState.roundTime = Number(seconds || DEFAULT_ROUND_SECONDS);
    leoidsState.timeLeft = leoidsState.roundTime;
    updatePanel();
  }

  function setHunterDelay(seconds = DEFAULT_HUNTER_DELAY_SECONDS) {
    leoidsState.hunterDelay = Number(seconds || DEFAULT_HUNTER_DELAY_SECONDS);
    leoidsState.hunterDelayLeft = leoidsState.hunterDelay;
    updatePanel();
  }

  function startRound() {
    stopTimer();

    leoidsState.active = true;
    leoidsState.status = "free";
    leoidsState.score = 0;
    leoidsState.coins = 0;
    leoidsState.timeLeft = leoidsState.roundTime;
    leoidsState.hunterDelayLeft = leoidsState.hunterDelay;
    leoidsState.huntersReleased = leoidsState.role !== "hunter";
    leoidsState.startedAt = new Date().toISOString();
    leoidsState.endedAt = null;

    updatePanel();

    speakText?.(
      leoidsState.role === "hunter"
        ? `Hunter round started. Release in ${Math.round(
            leoidsState.hunterDelay / 60
          )} minutes.`
        : `Runner round started. Survive for ${Math.round(
            leoidsState.roundTime / 60
          )} minutes.`
    );

    leoidsState.intervalId = setInterval(tickRound, 1000);
    saveState?.();
  }

  function tickRound() {
    if (!leoidsState.active) return;

    leoidsState.timeLeft = Math.max(0, leoidsState.timeLeft - 1);

    if (leoidsState.role === "hunter" && !leoidsState.huntersReleased) {
      leoidsState.hunterDelayLeft = Math.max(
        0,
        leoidsState.hunterDelayLeft - 1
      );

      if (leoidsState.hunterDelayLeft <= 0) {
        leoidsState.huntersReleased = true;
        speakText?.("Hunters released.");
      }
    }

    if (leoidsState.timeLeft <= 0) {
      endRound("timer");
      return;
    }

    updatePanel();
  }

  function endRound(reason = "manual") {
    stopTimer();

    leoidsState.active = false;
    leoidsState.endedAt = new Date().toISOString();

    if (reason === "timer" && leoidsState.role === "runner") {
      leoidsState.score += 200;
      leoidsState.coins += 30;
      speakText?.("Runners survive. Round complete.");
    } else {
      speakText?.("LEOIDs round ended.");
    }

    updatePanel();
    saveState?.();
  }

  function stopTimer() {
    if (leoidsState.intervalId) {
      clearInterval(leoidsState.intervalId);
      leoidsState.intervalId = null;
    }
  }

  function updatePanel() {
    if (!$("leoids-status")) return;

    const roleText = leoidsState.role === "hunter" ? "Hunter" : "Runner";
    const statusText = leoidsState.active ? "ACTIVE" : "READY";
    const releaseText =
      leoidsState.role === "hunter"
        ? leoidsState.huntersReleased
          ? "Hunters released"
          : `Hunter release: ${formatTime(leoidsState.hunterDelayLeft)}`
        : `Hunter delay: ${formatTime(leoidsState.hunterDelay)}`;

    $("leoids-status").innerText =
      `Mode: ${statusText}\n` +
      `Role: ${roleText}\n` +
      `Round Time: ${formatTime(leoidsState.timeLeft)}\n` +
      `${releaseText}\n` +
      `Status: ${leoidsState.status.toUpperCase()}\n` +
      `Score: ${leoidsState.score}\n` +
      `Coins earned: ${leoidsState.coins}`;
  }

  function wirePanelButtons() {
    $("btn-leoids-close")?.addEventListener("click", closeSetupPanel);
    $("btn-leoids-close-x")?.addEventListener("click", closeSetupPanel);

    $("btn-leoids-runner")?.addEventListener("click", () => setRole("runner"));
    $("btn-leoids-hunter")?.addEventListener("click", () => setRole("hunter"));

    $("leoids-round-length")?.addEventListener("change", (e) => {
      setRoundLength(Number(e.target.value || DEFAULT_ROUND_SECONDS));
    });

    $("leoids-hunter-delay")?.addEventListener("change", (e) => {
      setHunterDelay(Number(e.target.value || DEFAULT_HUNTER_DELAY_SECONDS));
    });

    $("btn-leoids-start")?.addEventListener("click", startRound);
  }

  return {
    state: leoidsState,
    enterBattleMap,
    exitBattleMap,
    openSetupPanel,
    closeSetupPanel,
    setRole,
    setRoundLength,
    setHunterDelay,
    startRound,
    endRound,
    updatePanel,
    wirePanelButtons,
  };
}
