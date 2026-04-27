// territory_system.js

export function createTerritorySystem({
  getState,
  saveState,
  updateCoins,
  renderHUD,
  renderHomeLog,
  refreshAllPinMarkers,
  speakText,
}) {
  const LEVEL_DEFENCE = {
    1: 40,
    2: 65,
    3: 90,
  };

  const LEVEL_INCOME = {
    1: 2,
    2: 4,
    3: 7,
  };

  const WEAPONS = {
    wooden_arrow: {
      name: "Bee Arrow",
      damage: 10,
    },
    bone_arrow: {
      name: "Stinger Arrow",
      damage: 20,
    },
    hand_cannon: {
      name: "Bee Sub Cannon",
      damage: 30,
    },
  };

  const DEFENCES = {
    shield: {
      name: "Basic Shield",
      cost: 25,
      defenceBoost: 15,
      damageReduction: 0.25,
    },
    core: {
      name: "Reinforced Core",
      cost: 35,
      defenceBoost: 25,
      damageReduction: 0.1,
    },
    bee_nest: {
      name: "Bee Guard Nest",
      cost: 50,
      defenceBoost: 35,
      damageReduction: 0.35,
    },
  };

  const CAPTURE_BONUS = 20;
  const RAID_CAPTURE_BONUS = 30;
  const MAX_STORED_COINS = 250;
  const ATTACK_COOLDOWN_MS = 15000;
  const WEAPON_COOLDOWN_MS = 10000;

  function ensureTerritoryState() {
    const state = getState();

    if (!state.territory || typeof state.territory !== "object") {
      state.territory = { nodes: {} };
    }

    if (!state.territory.nodes || typeof state.territory.nodes !== "object") {
      state.territory.nodes = {};
    }

    return state.territory;
  }

  function getNodeKey(pin) {
    return pin?.id ? `territory__${pin.id}` : null;
  }

  function getBaseDefenceForLevel(level = 1) {
    return LEVEL_DEFENCE[level] || LEVEL_DEFENCE[1];
  }

  function getIncomeRateForLevel(level = 1) {
    return LEVEL_INCOME[level] || LEVEL_INCOME[1];
  }

  function normaliseNode(pin, node) {
    const safeLevel = Math.max(1, Math.min(3, Number(node?.level || 1)));

    return {
      pinId: pin.id,
      ownerId: node?.ownerId || null,
      ownerName: node?.ownerName || "",
      level: safeLevel,
      defencePercent: Math.max(
        0,
        Math.min(
          100,
          Number(node?.defencePercent ?? getBaseDefenceForLevel(safeLevel))
        )
      ),
      defenceType: node?.defenceType || "",
      defenceName: node?.defenceName || "",
      damageReduction: Math.max(0, Math.min(0.75, Number(node?.damageReduction || 0))),
      storedCoins: Math.max(0, Number(node?.storedCoins || 0)),
      lastIncomeAt: Number(node?.lastIncomeAt || Date.now()),
      capturedAt: node?.capturedAt || null,
      updatedAt: node?.updatedAt || null,
      lastAttackAt: node?.lastAttackAt || {},
      lastWeaponAt: node?.lastWeaponAt || {},
    };
  }

  function createDefaultNode(pin) {
    return normaliseNode(pin, {
      ownerId: null,
      ownerName: "",
      level: 1,
      defencePercent: getBaseDefenceForLevel(1),
      storedCoins: 0,
      lastIncomeAt: Date.now(),
      capturedAt: null,
      updatedAt: null,
      lastAttackAt: {},
      lastWeaponAt: {},
    });
  }

  function syncStoredCoins(node) {
    const now = Date.now();

    if (!node.ownerId) {
      node.lastIncomeAt = now;
      node.storedCoins = 0;
      return node;
    }

    const last = Number(node.lastIncomeAt || now);
    const elapsedMs = Math.max(0, now - last);
    const elapsedMinutes = elapsedMs / 60000;

    if (elapsedMinutes <= 0) {
      node.lastIncomeAt = now;
      return node;
    }

    const rate = getIncomeRateForLevel(node.level || 1);
    const earned = elapsedMinutes * rate;

    node.storedCoins = Math.min(
      MAX_STORED_COINS,
      Number(node.storedCoins || 0) + earned
    );

    node.lastIncomeAt = now;
    return node;
  }

  function getNode(pin) {
    const territory = ensureTerritoryState();
    const key = getNodeKey(pin);
    if (!key) return null;

    if (!territory.nodes[key]) {
      territory.nodes[key] = createDefaultNode(pin);
    } else {
      territory.nodes[key] = normaliseNode(pin, territory.nodes[key]);
    }

    const node = territory.nodes[key];
    syncStoredCoins(node);
    return node;
  }

  function saveNode(pin, node) {
    const territory = ensureTerritoryState();
    const key = getNodeKey(pin);
    if (!key) return;

    territory.nodes[key] = normaliseNode(pin, node);
    saveState();
  }

  function refreshUI() {
    renderHUD?.();
    renderHomeLog?.();
    refreshAllPinMarkers?.();
  }

  function getNodeLabel(pin, activePlayerId = "") {
    const node = getNode(pin);
    if (!node) return "TERRITORY NODE";

    if (!node.ownerId) {
      return `${pin.n} • NEUTRAL • L${node.level} • ${Math.round(
        node.defencePercent
      )}%`;
    }

    const mine = node.ownerId === activePlayerId;
    const stored = Math.floor(Number(node.storedCoins || 0));

    return `${pin.n} • ${mine ? "YOURS" : node.ownerName || "OWNED"} • L${
      node.level
    } • ${Math.round(node.defencePercent)}% • ${stored} coins`;
  }

  function captureNode(pin, player) {
    if (!pin || !player) return false;

    const node = getNode(pin);
    if (!node) return false;

    if (node.ownerId === player.id) {
      speakText(`${pin.n} is already yours.`);
      return false;
    }

    if (node.ownerId && node.ownerId !== player.id && node.defencePercent > 0) {
      speakText(`${pin.n} is defended. Break the defence before capture.`);
      return false;
    }

    node.ownerId = player.id;
    node.ownerName = player.name || "Player";
    node.level = 1;
    node.defencePercent = getBaseDefenceForLevel(1);
    node.defenceType = "";
    node.defenceName = "";
    node.damageReduction = 0;
    node.storedCoins = 0;
    node.capturedAt = new Date().toISOString();
    node.updatedAt = new Date().toISOString();
    node.lastIncomeAt = Date.now();
    node.lastAttackAt = {};
    node.lastWeaponAt = {};

    saveNode(pin, node);
    updateCoins(player.id, CAPTURE_BONUS);
    refreshUI();

    speakText(`${pin.n} captured. ${CAPTURE_BONUS} coins awarded.`);
    return true;
  }

  function collectNodeCoins(pin, player) {
    if (!pin || !player) return 0;

    const node = getNode(pin);
    if (!node || node.ownerId !== player.id) {
      speakText("You can only collect from your own territory.");
      return 0;
    }

    syncStoredCoins(node);

    const amount = Math.floor(Number(node.storedCoins || 0));
    if (amount <= 0) {
      node.updatedAt = new Date().toISOString();
      saveNode(pin, node);
      refreshUI();
      speakText(`${pin.n}. No stored coins ready yet.`);
      return 0;
    }

    node.storedCoins = 0;
    node.updatedAt = new Date().toISOString();

    saveNode(pin, node);
    updateCoins(player.id, amount);
    refreshUI();

    speakText(`${amount} coins collected from ${pin.n}.`);
    return amount;
  }

  function upgradeNode(pin, player) {
    const node = getNode(pin);
    if (!node || !player) return false;

    if (node.ownerId !== player.id) {
      speakText("You can only upgrade your own territory.");
      return false;
    }

    if (node.level >= 3) {
      speakText(`${pin.n} is already max level.`);
      return false;
    }

    const cost = node.level === 1 ? 10 : 20;

    if (Number(player.coins || 0) < cost) {
      speakText("Not enough coins to upgrade.");
      return false;
    }

    updateCoins(player.id, -cost);

    node.level += 1;
    node.defencePercent = getBaseDefenceForLevel(node.level);
    node.storedCoins = Math.floor(Number(node.storedCoins || 0) + 10);
    node.updatedAt = new Date().toISOString();

    saveNode(pin, node);
    refreshUI();

    speakText(`${pin.n} upgraded to level ${node.level}.`);
    return true;
  }

  function installDefence(pin, player, defenceId) {
    const node = getNode(pin);
    const defence = DEFENCES[defenceId];

    if (!node || !player || !defence) return false;

    if (node.ownerId !== player.id) {
      speakText("You can only install defence on your own territory.");
      return false;
    }

    if (Number(player.coins || 0) < defence.cost) {
      speakText(`Not enough coins for ${defence.name}.`);
      return false;
    }

    updateCoins(player.id, -defence.cost);

    node.defenceType = defenceId;
    node.defenceName = defence.name;
    node.damageReduction = defence.damageReduction;
    node.defencePercent = Math.min(
      100,
      Number(node.defencePercent || 0) + defence.defenceBoost
    );
    node.updatedAt = new Date().toISOString();

    saveNode(pin, node);
    refreshUI();

    speakText(`${defence.name} installed at ${pin.n}.`);
    return true;
  }

  function checkCooldown(node, player, kind, cooldownMs) {
    const now = Date.now();
    const bucketKey = kind === "weapon" ? "lastWeaponAt" : "lastAttackAt";

    if (!node[bucketKey] || typeof node[bucketKey] !== "object") {
      node[bucketKey] = {};
    }

    const last = Number(node[bucketKey][player.id] || 0);

    if (now - last < cooldownMs) {
      const secondsLeft = Math.ceil((cooldownMs - (now - last)) / 1000);
      speakText(
        kind === "weapon"
          ? `Weapon recharging. Wait ${secondsLeft} seconds.`
          : `Attack recharging. Wait ${secondsLeft} seconds.`
      );
      return false;
    }

    node[bucketKey][player.id] = now;
    return true;
  }

  function weakenOrCapture(pin, player, node, damage, sourceName = "Attack") {
    node.defencePercent = Math.max(
      0,
      Number(node.defencePercent || 0) - Number(damage || 0)
    );

    node.updatedAt = new Date().toISOString();

    if (node.defencePercent <= 0) {
      const oldOwner = node.ownerName || "another player";

      node.ownerId = player.id;
      node.ownerName = player.name || "Player";
      node.level = 1;
      node.defencePercent = getBaseDefenceForLevel(1);
      node.defenceType = "";
      node.defenceName = "";
      node.damageReduction = 0;
      node.storedCoins = 0;
      node.capturedAt = new Date().toISOString();
      node.lastIncomeAt = Date.now();
      node.lastAttackAt = {};
      node.lastWeaponAt = {};

      saveNode(pin, node);
      updateCoins(player.id, RAID_CAPTURE_BONUS);
      refreshUI();

      speakText(
        `${sourceName} broke the defence. ${pin.n} captured from ${oldOwner}. ${RAID_CAPTURE_BONUS} coins awarded.`
      );
      return true;
    }

    saveNode(pin, node);
    refreshUI();

    speakText(
      `${sourceName} hit ${pin.n}. Defence reduced by ${damage}. Defence now ${Math.round(
        node.defencePercent
      )} percent.`
    );

    return true;
  }

  function attackNode(pin, player) {
    const node = getNode(pin);
    if (!node || !player) return false;

    if (!node.ownerId) {
      speakText("This node is neutral. Capture it instead.");
      return false;
    }

    if (node.ownerId === player.id) {
      speakText("You cannot attack your own territory.");
      return false;
    }

    if (!checkCooldown(node, player, "attack", ATTACK_COOLDOWN_MS)) {
      saveNode(pin, node);
      return false;
    }

    const level = Math.max(1, Math.min(3, Number(node.level || 1)));

    const damageByLevel = {
      1: 40,
      2: 30,
      3: 20,
    };

    const baseDamage = damageByLevel[level] || 30;
    const reduction = Math.max(0, Math.min(0.75, Number(node.damageReduction || 0)));
    const finalDamage = Math.max(1, Math.round(baseDamage * (1 - reduction)));

    return weakenOrCapture(pin, player, node, finalDamage, "Attack");
  }

  function useWeaponOnNode(pin, player, weaponId) {
    const state = getState();
    const node = getNode(pin);

    if (!pin || !player || !node) return false;

    if (!node.ownerId) {
      speakText("This node is neutral. Capture it instead.");
      return false;
    }

    if (node.ownerId === player.id) {
      speakText("You cannot attack your own territory.");
      return false;
    }

    const weapon = WEAPONS[weaponId];
    if (!weapon) {
      speakText("Weapon not found.");
      return false;
    }

    state.inventory = state.inventory || {};
    const count = Number(state.inventory[weaponId] || 0);

    if (count <= 0) {
      speakText(`You do not have a ${weapon.name}.`);
      return false;
    }

    if (!checkCooldown(node, player, "weapon", WEAPON_COOLDOWN_MS)) {
      saveNode(pin, node);
      return false;
    }

    state.inventory[weaponId] = Math.max(0, count - 1);

    const reduction = Math.max(0, Math.min(0.75, Number(node.damageReduction || 0)));
    const finalDamage = Math.max(
      1,
      Math.round(Number(weapon.damage || 0) * (1 - reduction))
    );

    return weakenOrCapture(pin, player, node, finalDamage, weapon.name);
  }

  function repairNode(pin, player, amount = 20) {
    const node = getNode(pin);
    if (!node || !player) return false;

    if (node.ownerId !== player.id) {
      speakText("You can only repair your own territory.");
      return false;
    }

    const maxDefence = Math.max(100, getBaseDefenceForLevel(node.level || 1));
    node.defencePercent = Math.min(
      maxDefence,
      Number(node.defencePercent || 0) + Number(amount || 0)
    );
    node.updatedAt = new Date().toISOString();

    saveNode(pin, node);
    refreshUI();

    speakText(`${pin.n} repaired to ${Math.round(node.defencePercent)} percent.`);
    return true;
  }

  function handleAction(pin, player) {
    if (!pin || !player) return false;

    const node = getNode(pin);
    if (!node) return false;

    if (!node.ownerId) {
      return captureNode(pin, player);
    }

    if (node.ownerId !== player.id) {
      return attackNode(pin, player);
    }

    if (node.level < 3) {
      return upgradeNode(pin, player);
    }

    return collectNodeCoins(pin, player);
  }

  return {
    ensureTerritoryState,
    getNode,
    getNodeLabel,
    getBaseDefenceForLevel,
    getIncomeRateForLevel,
    handleAction,
    captureNode,
    collectNodeCoins,
    upgradeNode,
    installDefence,
    repairNode,
    attackNode,
    useWeaponOnNode,
  };
}

