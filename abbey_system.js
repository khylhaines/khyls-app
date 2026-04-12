export const ABBEY_ROUTE_APPROACH_PIN_IDS = [
  "abbey_valley_view",
  "abbey_gate",
  "abbey_church",
  "abbey_boss",
];

export const ABBEY_ROUTE_DEFS = {
  investigate: {
    id: "investigate",
    title: "Investigate the Monk Paths",
    intro:
      "Not all paths to the Abbey were visible. Some were used quietly by those who protected knowledge.",
    steps: [
      {
        title: "The Hidden Path",
        desc: "Why would a hidden path be important here?",
        storyCategory: "place",
        story:
          "Not all paths to the Abbey were visible.\nSome were used only by those who needed to move quietly… and without notice.",
        options: [
          "For private movement and protected knowledge",
          "For horse racing",
          "For public trading",
        ],
        answer: 0,
        fact:
          "You’ve stepped onto the monks’ route. Hidden movement mattered here.",
        clue: { value: "2", importance: "high", saveLabel: "Hidden Path = 2" },
        rebuild: 2,
        reward: { coins: 22, xp: 12 },
      },
      {
        title: "Control and Structure",
        desc: "What would monks value most in a place like this?",
        storyCategory: "purpose",
        story:
          "The Abbey was not chaos.\nEvery movement… every path… had purpose.",
        options: ["Order and routine", "Speed", "Noise"],
        answer: 0,
        fact:
          "The Abbey worked because everything followed structure and routine.",
        rebuild: 2,
        reward: { coins: 24, xp: 14 },
      },
      {
        title: "Work and Life",
        desc: "What would monks likely be doing here each day?",
        storyCategory: "people",
        story:
          "These paths were not just for prayer.\nThey carried workers, supplies… and daily life.",
        options: ["Farming and labour", "Fighting", "Public trading"],
        answer: 0,
        fact:
          "Work and worship were connected here. The Abbey was lived, not just visited.",
        clue: {
          value: "4",
          importance: "low",
          saveLabel: "Work and Worship = 4",
        },
        rebuild: 3,
        reward: { coins: 28, xp: 16 },
      },
      {
        title: "The Purpose",
        desc: "What were these routes truly protecting?",
        storyCategory: "loss",
        story:
          "The hidden paths were not built to hide.\nThey were built to protect what mattered.",
        options: ["Knowledge and structure", "Food", "Money"],
        answer: 0,
        fact: "You are beginning to see the Abbey as it once was.",
        clue: {
          value: "6",
          importance: "high",
          saveLabel: "Protected Knowledge = 6",
        },
        rebuild: 5,
        reward: { coins: 36, xp: 22 },
        routeComplete: true,
      },
    ],
  },

  explore: {
    id: "explore",
    title: "Explore the Outer Grounds",
    intro:
      "Some truths are found by looking, walking, and noticing what others pass by.",
    steps: [
      {
        title: "Outer Ground Marker",
        desc: "What kind of place does this feel like?",
        storyCategory: "place",
        story:
          "The outer grounds gave first impressions.\nWhat you notice here shapes what comes next.",
        options: ["Open historic space", "Busy market", "Modern street"],
        answer: 0,
        fact: "You’ve marked the first outer landmark.",
        rebuild: 1,
        reward: { coins: 18, xp: 10 },
      },
      {
        title: "Walking the Edge",
        desc: "What matters most when exploring a place like this?",
        storyCategory: "people",
        story:
          "The fastest walkers miss things.\nThe best explorers notice what remains.",
        options: ["Looking carefully", "Rushing", "Ignoring details"],
        answer: 0,
        fact: "Exploration reveals what the eye almost misses.",
        clue: {
          value: "3",
          importance: "low",
          saveLabel: "Outer Edge = 3",
        },
        rebuild: 2,
        reward: { coins: 20, xp: 12 },
      },
      {
        title: "A Place Revealed",
        desc: "What gives this place its meaning?",
        storyCategory: "restoration",
        story:
          "The Abbey is more than stone.\nIt is memory, place, and what people carried into it.",
        options: ["Its history and people", "Its speed", "Its noise"],
        answer: 0,
        fact: "You’ve restored part of the Abbey’s outer story.",
        rebuild: 3,
        reward: { coins: 24, xp: 14 },
        routeComplete: true,
      },
    ],
  },

  advance: {
    id: "advance",
    title: "Advance Toward the Core",
    intro:
      "You’ve followed the outer paths. Now you step closer to the heart of the Abbey.",
    steps: [
      {
        title: "Path Forward",
        desc: "To move forward… you need to prove you understand the Abbey.",
        storyCategory: "purpose",
        story:
          "You’ve followed the outer paths.\nNow you step closer to the heart of the Abbey.",
        options: [
          "Military defence",
          "Worship, work, and community",
          "Trade hub",
        ],
        answer: 1,
        fact: "Path forward unlocked.",
        rebuild: 2,
        reward: { coins: 24, xp: 14 },
      },
      {
        title: "Closer to the Core",
        desc: "What kept the Abbey running every day?",
        storyCategory: "people",
        story:
          "You’re close now.\nThis is where the Abbey’s structure became most important.",
        options: ["Random activity", "Strict routine and order", "External trade"],
        answer: 1,
        fact: "You understand how the Abbey functioned.",
        rebuild: 2,
        reward: { coins: 28, xp: 16 },
      },
      {
        title: "Pre-Core Pressure",
        desc: "Answer quickly. What was the Abbey built to protect?",
        storyCategory: "loss",
        story:
          "You’re almost there.\nThis is where mistakes mattered.",
        options: ["Wealth", "Knowledge and belief", "Soldiers"],
        answer: 1,
        followUp: {
          desc: "And what kept it stable?",
          options: ["Strict order", "Freedom", "Trade"],
          answer: 0,
        },
        fact: "The Abbey core is now within reach.",
        clue: {
          value: "8",
          importance: "high",
          saveLabel: "Core Pressure = 8",
        },
        rebuild: 4,
        reward: { coins: 34, xp: 20 },
        routeComplete: true,
      },
    ],
  },

  core: {
    id: "core",
    title: "The Lost Order Core",
    intro:
      "You’ve reached it. The heart of the Abbey. Everything you’ve followed led you here.",
    steps: [
      {
        title: "The Heart of the Abbey",
        desc: "What was the true purpose of the Abbey?",
        storyCategory: "restoration",
        story:
          "You’ve reached it…\nThe heart of the Abbey.\nEverything you’ve followed… every path… every clue… led you here.",
        options: ["Power", "Wealth", "Faith, structure, and way of life"],
        answer: 2,
        fact:
          "You understand. The Abbey was held together by faith, order, labour, and shared purpose.",
        rebuild: 10,
        reward: { coins: 150, xp: 100 },
        clue: {
          value: "CORE",
          importance: "high",
          saveLabel: "Heart of the Abbey = CORE",
        },
        routeComplete: true,
        coreComplete: true,
      },
    ],
  },
};

export function createAbbeySystem(deps) {
  const {
    getState,
    setCurrentTask,
    getCurrentPin,
    getCurrentMode,
    getDefaultRebuild,
    getTaskEls,
    showModal,
    closeModal,
    clearTaskBlocks,
    setTaskBlock,
    hideBossProgressBox,
    setBossSummaryBlock,
    speakText,
    saveState,
    renderHUD,
    renderHomeLog,
    renderShop,
    refreshPinMarker,
    showScriptedRewardImage,
    saveCaptainNote,
    saveClueToCaptainNotes,
    saveRouteStoryToNotes,
    getActivePlayer,
    updateCoins,
    hasBadge,
    showBadgePopup,
    getEffectiveTier,
  } = deps;

  function state() {
    return getState();
  }

  function getAbbeyRebuild() {
    const s = state();
    if (!s.rebuild || typeof s.rebuild !== "object") {
      s.rebuild = getDefaultRebuild();
    }
    if (!s.rebuild.abbey) {
      s.rebuild.abbey = getDefaultRebuild().abbey;
    }
    return s.rebuild.abbey;
  }

  function getAbbeyStageFromPoints(points) {
    const p = Number(points || 0);
    if (p >= 20) return 4;
    if (p >= 12) return 3;
    if (p >= 6) return 2;
    if (p >= 1) return 1;
    return 0;
  }

  function addAbbeyRebuildPoints(amount) {
    const abbey = getAbbeyRebuild();
    abbey.points = Number(abbey.points || 0) + Number(amount || 0);
    abbey.stage = getAbbeyStageFromPoints(abbey.points);
  }

  function markAbbeyRouteComplete(pathId) {
    const abbey = getAbbeyRebuild();
    if (!abbey.completedRoutes.includes(pathId)) {
      abbey.completedRoutes.push(pathId);
    }
    if (
      abbey.completedRoutes.includes("investigate") &&
      abbey.completedRoutes.includes("advance")
    ) {
      abbey.unlockedCore = true;
    }
  }

  function clearActiveRoute() {
    state().route = null;
    saveState();
  }

  function startAbbeyRouteChoice() {
    state().route = {
      type: "abbey",
      path: null,
      startedAt: new Date().toISOString(),
      step: 0,
      clues: [],
      completedNodes: 0,
      rebuildPoints: 0,
      awaitFollowUp: null,
      lastCompletedPath: null,
      coreUnlocked: getAbbeyRebuild().unlockedCore,
      coreCompleted: getAbbeyRebuild().completedCore,
    };
    saveState();
    renderAbbeyRouteChoice();
  }

  function isAbbeyRouteApproachPin(pin) {
    const s = state();
    return (
      s.activePack === "classic" &&
      s.mapMode === "abbey" &&
      !!pin &&
      ABBEY_ROUTE_APPROACH_PIN_IDS.includes(pin.id)
    );
  }

  function getAbbeyRouteStatusText() {
    const s = state();
    const route = s.route;
    const abbey = getAbbeyRebuild();

    if (!route || route.type !== "abbey") {
      return `REBUILD ${abbey.points} • STAGE ${abbey.stage}`;
    }

    const clueText = route.clues.length
      ? route.clues.map((c) => c.value).join(" • ")
      : "NO CLUES";

    return `${String(route.path || "route").toUpperCase()} • STEP ${
      Number(route.step || 0) + 1
    } • CLUES ${clueText}`;
  }

  function maybeAddScriptedClue(clue, title) {
    const s = state();
    if (!clue || !s.route) return;

    const alreadyExists = s.route.clues.some(
      (x) => x.value === clue.value && x.saveLabel === clue.saveLabel
    );

    if (!alreadyExists) {
      s.route.clues.push({
        value: clue.value,
        importance: clue.importance || "low",
        saveLabel: clue.saveLabel || String(clue.value),
        title: title || "Clue",
        savedAt: new Date().toISOString(),
      });
    }
  }

  function getRewardPresentationMode() {
    const s = state();
    if (s.activePack === "adult") return "adult";
    const tier = getEffectiveTier();
    if (tier === "kid") return "kid";
    if (tier === "teen") return "teen";
    return "adult";
  }

  function getClueAnnouncementText(clue) {
    const mode = getRewardPresentationMode();

    if (!clue) return "";
    if (mode === "kid") return `CLUE FOUND: ${clue.value}`;
    if (mode === "teen") {
      return clue.importance === "high"
        ? `KEY CLUE FOUND: ${clue.value}`
        : "A clue has been added.";
    }
    return clue.importance === "high"
      ? "A key clue has been marked."
      : "Clue added.";
  }

  function renderAbbeyRouteChoice() {
    const s = state();
    if (!s.route || s.route.type !== "abbey") {
      startAbbeyRouteChoice();
      return;
    }

    const abbey = getAbbeyRebuild();
    const { taskTitle, taskDesc, taskOptions, taskFeedback } = getTaskEls();

    setCurrentTask({
      mode: "abbey_route_choice",
      pin: getCurrentPin(),
      question: null,
    });

    if (taskTitle) taskTitle.innerText = "Furness Abbey: The Lost Order";
    if (taskDesc) {
      taskDesc.innerText =
        "You’ve made it. Most never get this far.\nAhead lies the Abbey… but it won’t reveal itself easily.\n\nChoose your next move.";
    }

    clearTaskBlocks();
    setBossSummaryBlock("");
    hideBossProgressBox();

    setTaskBlock(
      "task-block-story",
      "task-story",
      "You are standing before Furness Abbey.\nThe ruins remain… but the Order was lost.\nComplete routes, recover clues, and rebuild what was forgotten."
    );

    if (!taskOptions) return;

    const coreLocked = !abbey.unlockedCore;
    taskOptions.style.display = "grid";
    taskOptions.innerHTML = `
      <button class="mcq-btn" id="route-investigate-btn">🧩 Investigate the Monk Paths</button>
      <button class="mcq-btn" id="route-explore-btn">🔍 Explore the Outer Grounds</button>
      <button class="mcq-btn" id="route-advance-btn">⚔️ Advance Toward the Core</button>
      ${
        coreLocked
          ? `<button class="mcq-btn" disabled style="opacity:.55;">👑 Core Route Locked (complete Investigate + Advance)</button>`
          : `<button class="mcq-btn" id="route-core-btn">👑 Enter the Abbey Core</button>`
      }
    `;

    if (taskFeedback) {
      taskFeedback.style.display = "block";
      taskFeedback.style.color = "var(--gold)";
      taskFeedback.innerText =
        `REBUILD ${abbey.points} • STAGE ${abbey.stage}\n` +
        `ROUTES COMPLETE: ${
          abbey.completedRoutes.length
            ? abbey.completedRoutes.join(", ")
            : "none yet"
        }`;
    }

    document.getElementById("route-investigate-btn")?.addEventListener("click", () => {
      chooseAbbeyRoute("investigate");
    });
    document.getElementById("route-explore-btn")?.addEventListener("click", () => {
      chooseAbbeyRoute("explore");
    });
    document.getElementById("route-advance-btn")?.addEventListener("click", () => {
      chooseAbbeyRoute("advance");
    });
    document.getElementById("route-core-btn")?.addEventListener("click", () => {
      chooseAbbeyRoute("core");
    });

    showModal("task-modal");
    speakText("You’ve made it. Most never get this far. Choose your next move.");
  }

  function chooseAbbeyRoute(pathId) {
    const s = state();
    const def = ABBEY_ROUTE_DEFS[pathId];
    if (!def) return;

    if (!s.route || s.route.type !== "abbey") {
      s.route = {
        type: "abbey",
        path: pathId,
        step: 0,
        clues: [],
        completedNodes: 0,
        rebuildPoints: 0,
        awaitFollowUp: null,
        lastCompletedPath: null,
        coreUnlocked: false,
        coreCompleted: false,
      };
    }

    s.route.path = pathId;
    s.route.step = 0;
    s.route.awaitFollowUp = null;
    s.route.startedAt = new Date().toISOString();

    saveState();
    openAbbeyRouteIntro(pathId);
  }

  function openAbbeyRouteIntro(pathId) {
    const def = ABBEY_ROUTE_DEFS[pathId];
    if (!def) return;

    const { taskTitle, taskDesc, taskOptions, taskFeedback } = getTaskEls();

    setCurrentTask({
      mode: "abbey_route_intro",
      pin: getCurrentPin(),
      question: null,
    });

    if (taskTitle) taskTitle.innerText = def.title;
    if (taskDesc) {
      taskDesc.innerText =
        pathId === "core"
          ? "Everything you’ve followed led you here."
          : "Start this route and recover what was lost.";
    }

    clearTaskBlocks();
    setBossSummaryBlock("");
    hideBossProgressBox();
    setTaskBlock("task-block-story", "task-story", def.intro || "");

    if (!taskOptions) return;

    taskOptions.style.display = "grid";
    taskOptions.innerHTML = `
      <button class="mcq-btn" id="route-begin-btn">START ROUTE</button>
      <button class="mcq-btn" id="route-save-intro-btn">SAVE STORY TO NOTES</button>
      <button class="mcq-btn" id="route-back-btn">BACK TO ROUTE CHOICE</button>
    `;

    document.getElementById("route-begin-btn")?.addEventListener("click", () => {
      state().route.step = 0;
      saveState();
      runAbbeyRouteStep();
    });

    document.getElementById("route-save-intro-btn")?.addEventListener("click", () => {
      saveRouteStoryToNotes(def.title, def.intro, "route_intro");
      speakText("Route intro saved to notes.");
      alert("Route intro saved to notes.");
    });

    document.getElementById("route-back-btn")?.addEventListener("click", () => {
      renderAbbeyRouteChoice();
    });

    if (taskFeedback) {
      taskFeedback.style.display = "none";
      taskFeedback.innerText = "";
    }

    showModal("task-modal");
    speakText(def.intro || def.title);
  }

  function runAbbeyRouteStep() {
    const s = state();
    if (!s.route || s.route.type !== "abbey" || !s.route.path) {
      renderAbbeyRouteChoice();
      return;
    }

    const def = ABBEY_ROUTE_DEFS[s.route.path];
    if (!def) {
      renderAbbeyRouteChoice();
      return;
    }

    const stepIndex = Number(s.route.step || 0);
    const step = def.steps[stepIndex];

    if (!step) {
      finishAbbeyRoute();
      return;
    }

    const { taskTitle, taskDesc, taskOptions, taskFeedback } = getTaskEls();

    setCurrentTask({
      mode: "abbey_scripted_step",
      pin: getCurrentPin(),
      question: step,
    });

    if (taskTitle) taskTitle.innerText = step.title || def.title;
    if (taskDesc) taskDesc.innerText = step.desc || "";

    clearTaskBlocks();
    setBossSummaryBlock("");
    hideBossProgressBox();
    setTaskBlock("task-block-story", "task-story", step.story || "");
    setTaskBlock("task-block-evidence", "task-evidence", "");
    setTaskBlock("task-block-clue", "task-clue", "");

    if (!taskOptions) return;

    taskOptions.style.display = "grid";
    taskOptions.innerHTML = (step.options || [])
      .map(
        (opt, index) => `
        <button class="mcq-btn abbey-step-option" data-step-index="${index}">
          ${opt}
        </button>
      `
      )
      .join("");

    document.querySelectorAll(".abbey-step-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        answerAbbeyRouteStep(Number(btn.dataset.stepIndex || -1));
      });
    });

    if (taskFeedback) {
      taskFeedback.style.display = "block";
      taskFeedback.style.color = "var(--gold)";
      taskFeedback.innerText = getAbbeyRouteStatusText();
    }

    showModal("task-modal");
    speakText(step.story || step.desc || step.title);
  }

  function answerAbbeyRouteStep(index) {
    const s = state();
    if (!s.route || s.route.type !== "abbey") return;

    const def = ABBEY_ROUTE_DEFS[s.route.path];
    const step = def?.steps?.[s.route.step];
    const { taskDesc, taskOptions, taskFeedback } = getTaskEls();

    if (!def || !step || !taskFeedback) return;

    if (s.route.awaitFollowUp) {
      const follow = s.route.awaitFollowUp;
      const isCorrect = index === Number(follow.answer);

      if (!isCorrect) {
        taskFeedback.style.display = "block";
        taskFeedback.style.color = "#ff6b6b";
        taskFeedback.innerText = "Not quite. Try again.";
        speakText("Not quite. Try again.");
        return;
      }

      s.route.awaitFollowUp = null;
      resolveAbbeyRouteStep(step);
      return;
    }

    const isCorrect = index === Number(step.answer);
    if (!isCorrect) {
      taskFeedback.style.display = "block";
      taskFeedback.style.color = "#ff6b6b";
      taskFeedback.innerText = "Not quite. Try again.";
      speakText("Not quite. Try again.");
      return;
    }

    if (step.followUp) {
      s.route.awaitFollowUp = step.followUp;

      if (taskDesc) taskDesc.innerText = step.followUp.desc || "";
      if (taskOptions) {
        taskOptions.innerHTML = (step.followUp.options || [])
          .map(
            (opt, followIndex) => `
            <button class="mcq-btn abbey-follow-option" data-follow-index="${followIndex}">
              ${opt}
            </button>
          `
          )
          .join("");

        document.querySelectorAll(".abbey-follow-option").forEach((btn) => {
          btn.addEventListener("click", () => {
            answerAbbeyRouteStep(Number(btn.dataset.followIndex || -1));
          });
        });
      }

      taskFeedback.style.display = "block";
      taskFeedback.style.color = "var(--gold)";
      taskFeedback.innerText = "Good. One more.";
      speakText(step.followUp.desc || "One more.");
      saveState();
      return;
    }

    resolveAbbeyRouteStep(step);
  }

  function resolveAbbeyRouteStep(step) {
    const s = state();
    if (!s.route || !step) return;

    const { taskOptions, taskFeedback } = getTaskEls();
    const active = getActivePlayer();
    const reward = step.reward || { coins: 20, xp: 10 };

    if (active && reward.coins) {
      updateCoins(active.id, Number(reward.coins || 0));
    }

    s.meta.xp = Number(s.meta.xp || 0) + Number(reward.xp || 0);
    s.route.completedNodes = Number(s.route.completedNodes || 0) + 1;
    s.route.rebuildPoints =
      Number(s.route.rebuildPoints || 0) + Number(step.rebuild || 0);

    addAbbeyRebuildPoints(step.rebuild || 0);

    if (step.clue) {
      maybeAddScriptedClue(step.clue, step.title);
    }

    const clueAnnouncement = getClueAnnouncementText(step.clue);
    const lines = [];

    lines.push(step.fact || "Progress made.");
    lines.push(`+${Number(reward.coins || 0)} coins`);
    lines.push(`+${Number(reward.xp || 0)} XP`);

    if (step.clue) {
      lines.push("");
      lines.push(clueAnnouncement);
    }

    lines.push("");
    lines.push(`REBUILD +${Number(step.rebuild || 0)}`);

    if (taskFeedback) {
      taskFeedback.style.display = "block";
      taskFeedback.style.color = "var(--neon)";
      taskFeedback.innerText = lines.join("\n");
    }

    const narrationParts = [step.fact || "Progress made."];
    if (step.clue) narrationParts.push(clueAnnouncement);
    narrationParts.push(
      `${Number(reward.coins || 0)} coins earned and ${Number(reward.xp || 0)} XP.`
    );
    speakText(narrationParts.join(" "));

    if (taskOptions) {
      const clueButtons = step.clue
        ? `<button class="mcq-btn" id="save-route-clue-btn">SAVE CLUE TO NOTES</button>`
        : "";

      taskOptions.innerHTML = `
        <button class="mcq-btn" id="save-route-story-btn">SAVE STORY TO NOTES</button>
        ${clueButtons}
        <button class="mcq-btn" id="continue-route-btn">CONTINUE</button>
        <button class="mcq-btn" id="back-route-choice-btn">BACK TO ROUTE CHOICE</button>
      `;
    }

    document.getElementById("save-route-story-btn")?.addEventListener("click", () => {
      saveRouteStoryToNotes(
        step.title || "Story",
        step.story || step.desc || "",
        step.storyCategory || "story"
      );
      speakText("Story saved to notes.");
      alert("Story saved to notes.");
    });

    document.getElementById("save-route-clue-btn")?.addEventListener("click", () => {
      saveClueToCaptainNotes(step.clue, step.title || "Clue");
      speakText("Clue saved to notes.");
      alert("Clue saved to notes.");
    });

    document.getElementById("continue-route-btn")?.addEventListener("click", () => {
      s.route.step = Number(s.route.step || 0) + 1;
      s.route.awaitFollowUp = null;

      if (step.routeComplete) {
        finishAbbeyRoute();
        return;
      }

      saveState();
      runAbbeyRouteStep();
    });

    document.getElementById("back-route-choice-btn")?.addEventListener("click", () => {
      renderAbbeyRouteChoice();
    });

    if (step.coreComplete) {
      completeAbbeyCoreReward();
    }

    saveState();
    renderHUD();
    renderHomeLog();
  }

  function finishAbbeyRoute() {
    const s = state();
    if (!s.route || s.route.type !== "abbey") {
      renderAbbeyRouteChoice();
      return;
    }

    const { taskTitle, taskDesc, taskOptions, taskFeedback } = getTaskEls();

    const pathId = s.route.path;
    const def = ABBEY_ROUTE_DEFS[pathId];
    const abbey = getAbbeyRebuild();

    if (pathId && pathId !== "core") {
      markAbbeyRouteComplete(pathId);
    }

    s.route.lastCompletedPath = pathId || null;
    s.route.coreUnlocked = !!abbey.unlockedCore;
    s.route.coreCompleted = !!abbey.completedCore;

    setCurrentTask({
      mode: "abbey_route_complete",
      pin: getCurrentPin(),
      question: null,
    });

    if (taskTitle) {
      taskTitle.innerText =
        pathId === "core"
          ? "Abbey Core Complete"
          : `${def?.title || "Route"} Complete`;
    }

    const clueText = s.route.clues.length
      ? s.route.clues.map((c) => c.value).join(" • ")
      : "No clues stored";

    if (taskDesc) {
      taskDesc.innerText =
        pathId === "core"
          ? "The core of the Lost Order has been restored."
          : `You completed the ${def?.title || "route"}.\nClues collected: ${clueText}`;
    }

    clearTaskBlocks();
    setBossSummaryBlock("");
    hideBossProgressBox();
    setTaskBlock(
      "task-block-story",
      "task-story",
      pathId === "core"
        ? "You’ve reached the heart of the Abbey.\nEverything you followed led here."
        : "You completed part of the Lost Order.\nMore of the Abbey still waits."
    );

    if (taskOptions) {
      taskOptions.style.display = "grid";
      taskOptions.innerHTML = `
        <button class="mcq-btn" id="abbey-route-save-summary-btn">SAVE ROUTE SUMMARY TO NOTES</button>
        <button class="mcq-btn" id="abbey-route-choice-btn">RETURN TO ROUTE CHOICE</button>
        <button class="mcq-btn" id="abbey-route-close-btn">CLOSE</button>
      `;
    }

    document.getElementById("abbey-route-save-summary-btn")?.addEventListener("click", () => {
      const summaryText =
        pathId === "core"
          ? "Abbey Core Complete: The Lost Order Restored"
          : `${def?.title || "Route"} Complete\nClues: ${clueText}`;
      saveCaptainNote(summaryText, "route_summary", def?.title || "Abbey Route");
      speakText("Route summary saved.");
      alert("Route summary saved.");
    });

    document.getElementById("abbey-route-choice-btn")?.addEventListener("click", () => {
      renderAbbeyRouteChoice();
    });

    document.getElementById("abbey-route-close-btn")?.addEventListener("click", () => {
      closeModal("task-modal");
    });

    if (taskFeedback) {
      taskFeedback.style.display = "block";
      taskFeedback.style.color = "var(--gold)";
      taskFeedback.innerText =
        `REBUILD ${abbey.points} • STAGE ${abbey.stage}\n` +
        `ROUTES COMPLETE: ${
          abbey.completedRoutes.length
            ? abbey.completedRoutes.join(", ")
            : "none yet"
        }` +
        `${abbey.unlockedCore ? "\nCORE ROUTE UNLOCKED" : ""}`;
    }

    saveState();
    renderHomeLog();

    if (pathId !== "core") {
      speakText(
        abbey.unlockedCore
          ? "Route complete. The Abbey core is now unlocked."
          : "Route complete. More of the Abbey awaits."
      );
    }

    showModal("task-modal");
  }

  function completeAbbeyCoreReward() {
    const s = state();
    const abbey = getAbbeyRebuild();

    if (!abbey.completedCore) {
      abbey.completedCore = true;
      abbey.finished = true;
      abbey.unlockedCore = true;
    }

    if (!hasBadge("Abbey Conqueror")) {
      s.meta.badges.push({
        name: "Abbey Conqueror",
        icon: "🏛️",
        captures: 0,
        awardedAt: new Date().toISOString(),
      });

      showBadgePopup({
        name: "Abbey Conqueror",
        icon: "🏛️",
        captures: 0,
      });
    }

    showScriptedRewardImage(
      "The Lost Order Restored",
      "The Abbey restored… through your path.\nNew routes and visual rewards await.",
      "./monk.jpg"
    );

    saveCaptainNote(
      "Abbey Core Complete: The Lost Order Restored",
      "route_summary",
      "Abbey Core"
    );
    saveState();
  }

  return {
    ABBEY_ROUTE_APPROACH_PIN_IDS,
    ABBEY_ROUTE_DEFS,
    getAbbeyRebuild,
    getAbbeyStageFromPoints,
    addAbbeyRebuildPoints,
    markAbbeyRouteComplete,
    clearActiveRoute,
    startAbbeyRouteChoice,
    isAbbeyRouteApproachPin,
    getAbbeyRouteStatusText,
    maybeAddScriptedClue,
    getRewardPresentationMode,
    getClueAnnouncementText,
    renderAbbeyRouteChoice,
    chooseAbbeyRoute,
    openAbbeyRouteIntro,
    runAbbeyRouteStep,
    answerAbbeyRouteStep,
    resolveAbbeyRouteStep,
    finishAbbeyRoute,
    completeAbbeyCoreReward,
  };
}
