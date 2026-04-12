export function getBossDef(pinId) {
  return BOSS_DEFS[pinId] || null;
}

function ensureBossProgressStore() {
  if (!state.bossProgress || typeof state.bossProgress !== "object") {
    state.bossProgress = {};
  }
  return state.bossProgress;
}

function getBossProgress(pinId) {
  const store = ensureBossProgressStore();
  if (!store[pinId]) {
    store[pinId] = {
      startedAt: null,
      completedAt: null,
      currentStep: 0,
      failedAttempts: 0,
      wrongAnswers: 0,
      solved: false,
      unlocked: false,
      notes: [],
      enteredOrder: [],
      finalAnswer: "",
    };
  }
  return store[pinId];
}

function resetBossProgress(pinId) {
  const store = ensureBossProgressStore();
  store[pinId] = {
    startedAt: new Date().toISOString(),
    completedAt: null,
    currentStep: 0,
    failedAttempts: 0,
    wrongAnswers: 0,
    solved: false,
    unlocked: true,
    notes: [],
    enteredOrder: [],
    finalAnswer: "",
  };
  return store[pinId];
}

function getBossTierKey() {
  const tier = getEffectiveTier();
  if (tier === "kid") return "kids";
  if (tier === "teen") return "teen";
  return "adult";
}

function getBossTierSteps(pinId) {
  const def = getBossDef(pinId);
  if (!def) return [];
  const tierKey = getBossTierKey();
  return Array.isArray(def?.[tierKey]?.steps) ? def[tierKey].steps : [];
}

function getBossPenalty(def) {
  return def?.penalty || { coins: 10, xp: 5 };
}

function isBossPin(pin) {
  return !!pin?.id && BOSS_MODE_PIN_IDS.includes(pin.id);
}

function getBossUnlockSummary(pinId) {
  const progress = getBossProgress(pinId);
  return [
    `Boss Step: ${Number(progress.currentStep || 0) + 1}`,
    `Wrong Answers: ${Number(progress.wrongAnswers || 0)}`,
    `Failed Attempts: ${Number(progress.failedAttempts || 0)}`,
    progress.solved ? "Solved: YES" : "Solved: NO",
  ].join("\n");
}

function showBossProgressBox(pinId) {
  const el = $("boss-progress");
  if (!el) return;
  el.style.display = "block";
  el.innerText = getBossUnlockSummary(pinId);
}

function hideBossProgressBox() {
  const el = $("boss-progress");
  if (!el) return;
  el.style.display = "none";
  el.innerText = "";
}

function setBossSummaryBlock(text = "") {
  const block = $("task-block-boss");
  const body = $("task-boss-summary");
  if (!block || !body) return;

  if (text) {
    block.classList.remove("hidden");
    body.innerText = text;
  } else {
    block.classList.add("hidden");
    body.innerText = "";
  }
}

function awardBossBadge(def) {
  if (!def?.badgeName || hasBadge(def.badgeName)) return false;

  state.meta.badges.push({
    name: def.badgeName,
    icon: def.badgeIcon || "👑",
    captures: 0,
    awardedAt: new Date().toISOString(),
  });

  showBadgePopup({
    name: def.badgeName,
    icon: def.badgeIcon || "👑",
    captures: 0,
  });

  return true;
}

function applyBossPenalty(def) {
  const penalty = getBossPenalty(def);
  const active = getActivePlayer();

  if (active && penalty.coins) {
    updateCoins(active.id, -Math.abs(Number(penalty.coins || 0)));
  }

  state.meta.xp = Math.max(
    0,
    Number(state.meta.xp || 0) - Math.abs(Number(penalty.xp || 0))
  );
}

function completeBossStepReward(step) {
  const active = getActivePlayer();
  const reward = step?.reward || { coins: 0, xp: 0 };

  if (active && reward.coins) {
    updateCoins(active.id, Number(reward.coins || 0));
  }

  state.meta.xp = Number(state.meta.xp || 0) + Number(reward.xp || 0);
}

function openBossMission(pin) {
  const def = getBossDef(pin?.id);
  if (!def) {
    alert("No boss file found for this pin yet.");
    return;
  }

  const progress = resetBossProgress(pin.id);
  const tierKey = getBossTierKey();
  const tierDef = def[tierKey];
  const steps = Array.isArray(tierDef?.steps) ? tierDef.steps : [];

  currentTask = {
    mode: "boss",
    pin,
    question: null,
    boss: {
      pinId: pin.id,
      tier: tierKey,
      stepIndex: Number(progress.currentStep || 0),
      steps,
      def,
    },
  };

  if ($("task-title")) $("task-title").innerText = def.title;
  if ($("task-desc")) {
    $("task-desc").innerText =
      tierKey === "kids"
        ? "Final Abbey trial. Listen, learn, then solve the last order puzzle."
        : tierKey === "teen"
        ? "Final Abbey trial. Follow the history, then solve the chronology and sum."
        : "Final Abbey trial. Recover the full sequence, then solve the ordered sum.";
  }

  clearTaskBlocks();
  setBossSummaryBlock(
    `BOSS ACTIVE\n${pin.n}\n${tierKey.toUpperCase()} TIER\n\nPenalty on wrong answer: -${def.penalty.coins} coins, -${def.penalty.xp} XP`
  );
  showBossProgressBox(pin.id);

  const feedback = $("task-feedback");
  if (feedback) {
    feedback.style.display = "none";
    feedback.innerText = "";
  }

  runBossStep();
  showModal("task-modal");
}

function runBossStep() {
  if (!currentTask?.boss) return;

  const { pinId, steps, stepIndex } = currentTask.boss;
  const step = steps[stepIndex];

  if (!step) {
    finishBossMission();
    return;
  }

  const progress = getBossProgress(pinId);
  progress.currentStep = stepIndex;

  if ($("task-title")) $("task-title").innerText = step.title || "Boss Step";
  if ($("task-desc")) $("task-desc").innerText = step.text || "";

  clearTaskBlocks();
  setBossSummaryBlock(
    `BOSS FILE\n${getBossDef(pinId)?.title || "Boss Trial"}\n\nStep ${stepIndex + 1} of ${steps.length}`
  );

  if (step.kind === "story") {
    setTaskBlock("task-block-story", "task-story", step.text || "");
  }

  showBossProgressBox(pinId);
  renderBossStepOptions(step);
  speakText(step.text || step.title || "Boss step.");
  saveState();
}

function renderBossStepOptions(step) {
  const wrap = $("task-options");
  const readBtn = $("btn-read-answers");
  if (!wrap) return;

  wrap.innerHTML = "";
  wrap.style.display = "grid";

  if (readBtn) {
    if (Array.isArray(step?.options) && step.options.length) {
      readBtn.classList.remove("hidden");
    } else {
      readBtn.classList.add("hidden");
    }
  }

  if (step.kind === "story") {
    const btn = document.createElement("button");
    btn.className = "mcq-btn";
    btn.innerText = "CONTINUE";
    btn.addEventListener("click", () => {
      handleBossStoryAdvance(step);
    });
    wrap.appendChild(btn);
    return;
  }

  if (step.autoSolve === "sum_found_destroyed") {
    const btn = document.createElement("button");
    btn.className = "mcq-btn";
    btn.innerText = "AUTO SOLVE FOR KIDS";
    btn.addEventListener("click", () => {
      handleBossAutoSolve(step);
    });
    wrap.appendChild(btn);
  }

  if (Array.isArray(step?.options) && step.options.length) {
    step.options.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.className = "mcq-btn";
      btn.innerText = option;
      btn.addEventListener("click", () => {
        answerBossOption(index);
      });
      wrap.appendChild(btn);
    });
    return;
  }

  if (step.inputMode === "ordered_sum") {
    wrap.innerHTML = `
      <input
        id="boss-order-input"
        type="text"
        placeholder="Enter years in order, e.g. 1127,1537"
        style="
          width:100%;
          background:#111827;
          color:#fff;
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;
          padding:12px;
          font-size:16px;
        "
      />
      <input
        id="boss-total-input"
        type="number"
        placeholder="Enter total"
        style="
          width:100%;
          background:#111827;
          color:#fff;
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;
          padding:12px;
          font-size:16px;
        "
      />
      <button class="mcq-btn" id="boss-submit-btn">SUBMIT ANSWER</button>
    `;

    $("boss-submit-btn")?.addEventListener("click", () => {
      answerBossOrderedSum();
    });
    return;
  }

  const fallbackBtn = document.createElement("button");
  fallbackBtn.className = "mcq-btn";
  fallbackBtn.innerText = "CONTINUE";
  fallbackBtn.addEventListener("click", () => {
    handleBossStoryAdvance(step);
  });
  wrap.appendChild(fallbackBtn);
}

function handleBossStoryAdvance(step) {
  if (!currentTask?.boss) return;

  completeBossStepReward(step);
  currentTask.boss.stepIndex += 1;
  saveState();
  renderHUD();
  runBossStep();
}

function handleBossAutoSolve(step) {
  if (!currentTask?.boss) return;

  const feedback = $("task-feedback");
  if (feedback) {
    feedback.style.display = "block";
    feedback.style.color = "var(--neon)";
    feedback.innerText = step.successText || "Solved.";
  }

  completeBossStepReward(step);
  currentTask.boss.stepIndex += 1;
  saveState();
  renderHUD();
  setTimeout(() => runBossStep(), 500);
}

function answerBossOption(index) {
  if (!currentTask?.boss) return;

  const { pinId, steps, stepIndex, def } = currentTask.boss;
  const step = steps[stepIndex];
  const feedback = $("task-feedback");
  const progress = getBossProgress(pinId);

  if (!step || !feedback) return;

  const correct = Number(index) === Number(step.answer);

  if (!correct) {
    progress.wrongAnswers = Number(progress.wrongAnswers || 0) + 1;
    progress.failedAttempts = Number(progress.failedAttempts || 0) + 1;
    applyBossPenalty(def);
    saveState();
    renderHUD();
    showBossProgressBox(pinId);

    feedback.style.display = "block";
    feedback.style.color = "#ff6b6b";
    feedback.innerText = `Wrong answer.\nPenalty: -${def.penalty.coins} coins, -${def.penalty.xp} XP`;
    speakText("Wrong answer. Penalty applied.");
    return;
  }

  completeBossStepReward(step);
  feedback.style.display = "block";
  feedback.style.color = "var(--neon)";
  feedback.innerText = step.successText || "Correct.";
  speakText(step.successText || "Correct.");

  currentTask.boss.stepIndex += 1;
  saveState();
  renderHUD();
  showBossProgressBox(pinId);

  setTimeout(() => runBossStep(), 650);
}

function answerBossOrderedSum() {
  if (!currentTask?.boss) return;

  const { pinId, steps, stepIndex, def } = currentTask.boss;
  const step = steps[stepIndex];
  const feedback = $("task-feedback");
  const progress = getBossProgress(pinId);

  if (!step || !feedback) return;

  const rawOrder = String($("boss-order-input")?.value || "").trim();
  const rawTotal = String($("boss-total-input")?.value || "").trim();

  const normalisedOrder = rawOrder
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const expectedOrder = Array.isArray(step.expectedOrder)
    ? step.expectedOrder
    : [];
  const correctOrder =
    normalisedOrder.length === expectedOrder.length &&
    normalisedOrder.every((value, index) => value === expectedOrder[index]);

  const correctTotal = String(step.expectedValue) === rawTotal;

  progress.enteredOrder = normalisedOrder;
  progress.finalAnswer = rawTotal;

  if (!correctOrder || !correctTotal) {
    progress.wrongAnswers = Number(progress.wrongAnswers || 0) + 1;
    progress.failedAttempts = Number(progress.failedAttempts || 0) + 1;
    applyBossPenalty(def);
    saveState();
    renderHUD();
    showBossProgressBox(pinId);

    feedback.style.display = "block";
    feedback.style.color = "#ff6b6b";
    feedback.innerText =
      `Wrong final sequence.\nPenalty: -${def.penalty.coins} coins, -${def.penalty.xp} XP`;
    speakText("Wrong final sequence. Penalty applied.");
    return;
  }

  completeBossStepReward(step);
  feedback.style.display = "block";
  feedback.style.color = "var(--neon)";
  feedback.innerText = step.successText || "Boss puzzle solved.";
  speakText(step.successText || "Boss puzzle solved.");

  currentTask.boss.stepIndex += 1;
  saveState();
  renderHUD();
  showBossProgressBox(pinId);

  setTimeout(() => runBossStep(), 700);
}

function finishBossMission() {
  if (!currentTask?.boss) return;

  const { pinId, def } = currentTask.boss;
  const progress = getBossProgress(pinId);
  progress.solved = true;
  progress.completedAt = new Date().toISOString();

  const pin = currentTask.pin;
  const active = getActivePlayer();
  const bonus = { coins: 60, xp: 40, tokens: 1 };

  if (active) {
    updateCoins(active.id, bonus.coins);
  }

  state.meta.xp = Number(state.meta.xp || 0) + bonus.xp;
  state.meta.tokens = Number(state.meta.tokens || 0) + bonus.tokens;

  recordMissionCompletion(
    pin,
    "boss",
    bonus,
    `${pinId}_boss_complete`
  );

  awardBossBadge(def);
  checkBadgeUnlocksByCaptures();
  saveCaptainNote(
    `${def.title}\nSolved at ${new Date().toLocaleString()}\nFinal answer: ${progress.finalAnswer || "completed"}`,
    "boss",
    def.title
  );

  saveState();
  renderHUD();
  renderHomeLog();
  renderShop();
  refreshPinMarker(pin);
  showBossProgressBox(pinId);

  const feedback = $("task-feedback");
  if (feedback) {
    feedback.style.display = "block";
    feedback.style.color = "var(--neon)";
    feedback.innerText =
      `BOSS COMPLETE\n+${bonus.coins} coins\n+${bonus.xp} XP\n+${bonus.tokens} token\n\n${def.badgeName} unlocked`;
  }

  showScriptedRewardImage(
    def.title,
    def.rewardCaption,
    def.rewardImage || "./monk.jpg"
  );
}

