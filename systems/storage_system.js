export function createStorageSystem({
  getDefaultAdaptiveProfile,
  normaliseAdaptiveProfile,
}) {
  const SAVE_VERSION = 4;
  const SAVE_KEY = "bq_world_v20_phase4_boss";
  const BACKUP_KEY = "bq_world_v20_phase4_boss_backup";
  const EXPORT_FILENAME = "barrow-quest-save.json";

  let autosaveTimer = null;
  let lastSaveHash = "";

  function stableStringify(value) {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  function computeStorageHealth() {
    return {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      app: "Barrow Quest",
      saveKey: SAVE_KEY,
    };
  }

  function getDefaultState() {
    return {
      storage: {
        version: SAVE_VERSION,
        savedAt: null,
        app: "Barrow Quest",
        saveKey: SAVE_KEY,
        migratedFrom: null,
        migratedAt: null,
      },

      players: [
        { id: "p1", name: "Player 1", coins: 0, enabled: true },
        { id: "p2", name: "Player 2", coins: 0, enabled: false },
        { id: "p3", name: "Player 3", coins: 0, enabled: false },
        { id: "p4", name: "Player 4", coins: 0, enabled: false },
      ],

      activePlayerId: "p1",
      mapMode: "core",
      activePack: "classic",
      activeAdultCategory: null,
      tierMode: "kid",

      unlockedMysteries: [],
      completedQuestionIds: [],
      recentQuestionTags: [],

      quizProfiles: {
        kid: getDefaultAdaptiveProfile("kid"),
        teen: getDefaultAdaptiveProfile("teen"),
        adult: getDefaultAdaptiveProfile("adult"),
      },

      purchasedItems: [],
      inventory: {},
      captainNotes: [],

      completedPins: {},
      pinStats: {
        totalCompleted: 0,
        totalFirstCompletions: 0,
        totalRepeatCompletions: 0,
      },

      meta: {
        xp: 0,
        tokens: 0,
        badges: [],
      },

      settings: {
        radius: 35,
        voicePitch: 1,
        voiceRate: 1,
        voiceName: "",
        sfxVol: 80,
        zoomUI: false,
        character: "hero_duo",
        equippedTrail: "trail_none",
        mapTheme: "map_classic",
      },

      adultLock: {
        unlocked: false,
        pin: "",
        sessionApproved: false,
        hideWhenKidsMode: false,
      },

      route: null,

      rebuild: {
        abbey: {
          points: 0,
          stage: 0,
          completedRoutes: [],
          unlockedCore: false,
          completedCore: false,
          finished: false,
        },
      },

      bossProgress: {},
    };
  }

  function normaliseAdultLock(lock = {}) {
    return {
      unlocked: !!lock.unlocked,
      pin: typeof lock.pin === "string" ? lock.pin : "",
      sessionApproved: !!lock.sessionApproved,
      hideWhenKidsMode: !!lock.hideWhenKidsMode,
    };
  }

  function normaliseRoute(route = null) {
    if (!route || typeof route !== "object") return null;
    return {
      type: typeof route.type === "string" ? route.type : "abbey",
      path: typeof route.path === "string" ? route.path : null,
      startedAt: route.startedAt || null,
      step: Number.isFinite(route.step) ? route.step : 0,
      clues: Array.isArray(route.clues) ? route.clues : [],
      completedNodes: Number.isFinite(route.completedNodes)
        ? route.completedNodes
        : 0,
      rebuildPoints: Number.isFinite(route.rebuildPoints)
        ? route.rebuildPoints
        : 0,
      awaitFollowUp: route.awaitFollowUp || null,
      lastCompletedPath:
        typeof route.lastCompletedPath === "string"
          ? route.lastCompletedPath
          : null,
      coreUnlocked: !!route.coreUnlocked,
      coreCompleted: !!route.coreCompleted,
    };
  }

  function normaliseRebuild(rebuild = {}) {
    const abbey = rebuild.abbey || {};
    return {
      abbey: {
        points: Number.isFinite(abbey.points) ? abbey.points : 0,
        stage: Number.isFinite(abbey.stage) ? abbey.stage : 0,
        completedRoutes: Array.isArray(abbey.completedRoutes)
          ? abbey.completedRoutes
          : [],
        unlockedCore: !!abbey.unlockedCore,
        completedCore: !!abbey.completedCore,
        finished: !!abbey.finished,
      },
    };
  }

  function normaliseBossProgress(progress = {}) {
    const out = {};
    Object.entries(progress || {}).forEach(([key, value]) => {
      const safe = value && typeof value === "object" ? value : {};
      out[key] = {
        startedAt: safe.startedAt || null,
        completedAt: safe.completedAt || null,
        currentStep: Number.isFinite(safe.currentStep) ? safe.currentStep : 0,
        failedAttempts: Number.isFinite(safe.failedAttempts)
          ? safe.failedAttempts
          : 0,
        wrongAnswers: Number.isFinite(safe.wrongAnswers)
          ? safe.wrongAnswers
          : 0,
        solved: !!safe.solved,
        unlocked: !!safe.unlocked,
        notes: Array.isArray(safe.notes) ? safe.notes : [],
        enteredOrder: Array.isArray(safe.enteredOrder) ? safe.enteredOrder : [],
        finalAnswer:
          safe.finalAnswer === null || safe.finalAnswer === undefined
            ? ""
            : String(safe.finalAnswer),
      };
    });
    return out;
  }

  function normaliseStorage(storage = {}) {
    return {
      ...computeStorageHealth(),
      ...storage,
      version: SAVE_VERSION,
    };
  }

  function migrateSave(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const version = Number(source?.storage?.version || source?.saveVersion || 0);

    if (version >= SAVE_VERSION) return source;

    const migrated = {
      ...source,
    };

    if (!migrated.storage || typeof migrated.storage !== "object") {
      migrated.storage = {};
    }

    if (!migrated.captainNotes) migrated.captainNotes = [];
    if (!migrated.route) migrated.route = null;

    if (!migrated.rebuild) {
      migrated.rebuild = {
        abbey: {
          points: 0,
          stage: 0,
          completedRoutes: [],
          unlockedCore: false,
          completedCore: false,
          finished: false,
        },
      };
    }

    if (!migrated.bossProgress || typeof migrated.bossProgress !== "object") {
      migrated.bossProgress = {};
    }

    migrated.storage.version = SAVE_VERSION;
    migrated.storage.migratedFrom = version;
    migrated.storage.migratedAt = new Date().toISOString();

    return migrated;
  }

  function normaliseLoadedState(parsed) {
    const safe = parsed && typeof parsed === "object" ? parsed : {};
    const DEFAULT_STATE = getDefaultState();

    return {
      ...structuredClone(DEFAULT_STATE),
      ...safe,

      storage: normaliseStorage(safe.storage || {}),

      settings: {
        ...structuredClone(DEFAULT_STATE.settings),
        ...(safe.settings || {}),
      },

      players:
        Array.isArray(safe.players) && safe.players.length
          ? safe.players
          : structuredClone(DEFAULT_STATE.players),

      unlockedMysteries: Array.isArray(safe.unlockedMysteries)
        ? safe.unlockedMysteries
        : [],

      completedQuestionIds: Array.isArray(safe.completedQuestionIds)
        ? safe.completedQuestionIds
        : [],

      recentQuestionTags: Array.isArray(safe.recentQuestionTags)
        ? safe.recentQuestionTags
        : [],

      quizProfiles:
        safe.quizProfiles && typeof safe.quizProfiles === "object"
          ? {
              kid: normaliseAdaptiveProfile(safe.quizProfiles.kid || {}, "kid"),
              teen: normaliseAdaptiveProfile(
                safe.quizProfiles.teen || {},
                "teen"
              ),
              adult: normaliseAdaptiveProfile(
                safe.quizProfiles.adult || {},
                "adult"
              ),
            }
          : {
              kid: getDefaultAdaptiveProfile("kid"),
              teen: getDefaultAdaptiveProfile("teen"),
              adult: getDefaultAdaptiveProfile("adult"),
            },

      purchasedItems: Array.isArray(safe.purchasedItems)
        ? safe.purchasedItems
        : [],

      inventory:
        safe.inventory && typeof safe.inventory === "object"
          ? safe.inventory
          : {},

      captainNotes: Array.isArray(safe.captainNotes)
        ? safe.captainNotes
        : [],

      completedPins:
        safe.completedPins && typeof safe.completedPins === "object"
          ? safe.completedPins
          : {},

      pinStats: {
        ...structuredClone(DEFAULT_STATE.pinStats),
        ...(safe.pinStats || {}),
      },

      meta: {
        ...structuredClone(DEFAULT_STATE.meta),
        ...(safe.meta || {}),
        badges: Array.isArray(safe?.meta?.badges) ? safe.meta.badges : [],
      },

      adultLock: normaliseAdultLock(safe.adultLock || {}),
      route: normaliseRoute(safe.route || null),
      rebuild: normaliseRebuild(safe.rebuild || {}),
      bossProgress: normaliseBossProgress(safe.bossProgress || {}),
    };
  }

  function buildSavePayload(state) {
    return {
      ...state,
      storage: {
        ...computeStorageHealth(),
        ...(state.storage || {}),
        version: SAVE_VERSION,
        savedAt: new Date().toISOString(),
      },
      saveVersion: SAVE_VERSION,
    };
  }

  function buildSavePayloadFromState(sourceState) {
    return {
      ...sourceState,
      storage: {
        ...computeStorageHealth(),
        ...(sourceState.storage || {}),
        version: SAVE_VERSION,
      },
      saveVersion: SAVE_VERSION,
    };
  }

  function createBackupSnapshot(payload) {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Backup snapshot failed:", err);
    }
  }

  function saveStateNow(state, force = false) {
    try {
      const payload = buildSavePayload(state);
      const raw = stableStringify(payload);
      if (!raw) return false;

      if (!force && raw === lastSaveHash) return true;

      localStorage.setItem(SAVE_KEY, raw);
      createBackupSnapshot(payload);
      lastSaveHash = raw;
      return true;
    } catch (err) {
      console.error("SAVE ERROR:", err);
      return false;
    }
  }

  function queueSaveState(state, delay = 160) {
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      saveStateNow(state);
    }, delay);
  }

  function loadState() {
    const DEFAULT_STATE = getDefaultState();

    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);

      const parsed = JSON.parse(raw);
      const migrated = migrateSave(parsed);
      const loaded = normaliseLoadedState(migrated);
      lastSaveHash = stableStringify(buildSavePayloadFromState(loaded));
      return loaded;
    } catch (err) {
      console.warn("Primary save failed, trying backup:", err);
      try {
        const backup = localStorage.getItem(BACKUP_KEY);
        if (!backup) return structuredClone(DEFAULT_STATE);

        const parsedBackup = JSON.parse(backup);
        const migratedBackup = migrateSave(parsedBackup);
        const loadedBackup = normaliseLoadedState(migratedBackup);
        lastSaveHash = stableStringify(buildSavePayloadFromState(loadedBackup));
        return loadedBackup;
      } catch (backupErr) {
        console.error("Backup load failed:", backupErr);
        return structuredClone(DEFAULT_STATE);
      }
    }
  }

  function exportSaveFile(state) {
    try {
      const payload = buildSavePayload(state);
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = EXPORT_FILENAME;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error("EXPORT SAVE FAILED:", err);
      return false;
    }
  }

  return {
    SAVE_VERSION,
    SAVE_KEY,
    BACKUP_KEY,
    EXPORT_FILENAME,
    getDefaultState,
    loadState,
    saveStateNow,
    queueSaveState,
    exportSaveFile,
    migrateSave,
    normaliseLoadedState,
    buildSavePayload,
    buildSavePayloadFromState,
    computeStorageHealth,
  };
}
