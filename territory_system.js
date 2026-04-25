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
    2: 3,
    3: 5,
  };

  const CAPTURE_BONUS = 20;
  const MAX_STORED_COINS = 100;

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
    return LEVEL_DEFENCE[level] || 40;
  }

  function getIncomeRateForLevel(level = 1) {
    return LEVEL_INCOME[level] || 2;
  }

  function syncStoredCoins(node) {
    const now = Date.now();
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

  function createDefaultNode(pin) {
    return {
      pinId: pin.id,
      ownerId: null,
      ownerName: "",
      level: 1,
      defencePercent: getBaseDefenceForLevel(1),
      storedCoins: 0,
      lastIncomeAt: Date.now(),
      capturedAt: null,
      updatedAt: null,
    };
  }

  function getNode(pin) {
    const territory = ensureTerritoryState();
    const key = getNodeKey(pin);
    if (!key) return null;

    if (!territory.nodes[key]) {
      territory.nodes[key] = createDefaultNode(pin);
    }

    const node = territory.nodes[key];
    syncStoredCoins(node);
    return node;
  }

  function saveNode(pin, node) {
    const territory = ensureTerritoryState();
    const key = getNodeKey(pin);
    if (!key) return;
    territory.nodes[key] = node;
    saveState();
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
    return `${pin.n} • ${mine ? "YOURS" : node.ownerName || "OWNED"} • L${
      node.level
    } • ${Math.round(node.defencePercent)}%`;
  }

  function captureNode(pin, player) {
    if (!pin || !player) return false;

    const node = getNode(pin);
    if (!node) return false;

    node.ownerId = player.id;
    node.ownerName = player.name || "Player";
    node.level = Math.max(1, Math.min(3, Number(node.level || 1)));
    node.defencePercent = getBaseDefenceForLevel(node.level);
    node.capturedAt = new Date().toISOString();
    node.updatedAt = new Date().toISOString();
    node.lastIncomeAt = Date.now();

    saveNode(pin, node);
    updateCoins(player.id, CAPTURE_BONUS);
    renderHUD();
    renderHomeLog();
    refreshAllPinMarkers();
    speakText(`${pin.n} captured. ${CAPTURE_BONUS} coins awarded.`);
    return true;
  }

  function collectNodeCoins(pin, player) {
    if (!pin || !player) return 0;

    const node = getNode(pin);
    if (!node || node.ownerId !== player.id) return 0;

    syncStoredCoins(node);

    const amount = Math.floor(Number(node.storedCoins || 0));
    if (amount <= 0) {
      node.updatedAt = new Date().toISOString();
      saveNode(pin, node);
      renderHUD();
      renderHomeLog();
      refreshAllPinMarkers();
      speakText(`${pin.n}. No stored coins ready yet.`);
      return 0;
    }

    node.storedCoins = 0;
    node.updatedAt = new Date().toISOString();

    saveNode(pin, node);
    updateCoins(player.id, amount);
    renderHUD();
    renderHomeLog();
    refreshAllPinMarkers();
    speakText(`${amount} coins collected from ${pin.n}.`);
    return amount;
  }

function upgradeNode(pin, player) {
  const node = getNode(pin);
  if (!node || node.ownerId !== player.id) return false;

  if (node.level >= 3) {
    speakText(`${pin.n} is already max level.`);
    return false;
  }

  const cost = node.level === 1 ? 40 : 80;

  if ((player.coins || 0) < cost) {
    speakText(`Not enough coins to upgrade.`);
    return false;
  }

  updateCoins(player.id, -cost);

  node.level += 1;
  node.defencePercent = getBaseDefenceForLevel(node.level);
  node.updatedAt = new Date().toISOString();

  saveNode(pin, node);

  renderHUD();
  renderHomeLog();
  refreshAllPinMarkers();

  speakText(`${pin.n} upgraded to level ${node.level}.`);

  return true;
}

function attackNode(pin, player) {
  const node = getNode(pin);
  if (!node || !player) return false;

  if (!node.ownerId || node.ownerId === player.id) return false;

  const level = Math.max(1, Math.min(3, Number(node.level || 1)));

  const damageByLevel = {
    1: 40,
    2: 30,
    3: 20,
  };

  const damage = damageByLevel[level] || 30;

  node.defencePercent = Math.max(
    0,
    Number(node.defencePercent || getBaseDefenceForLevel(level)) - damage
  );

  node.updatedAt = new Date().toISOString();

  if (node.defencePercent <= 0) {
    const oldOwner = node.ownerName || "another player";

    node.ownerId = player.id;
    node.ownerName = player.name || "Player";
    node.level = 1;
    node.defencePercent = getBaseDefenceForLevel(1);
    node.storedCoins = 0;
    node.capturedAt = new Date().toISOString();
    node.lastIncomeAt = Date.now();

    saveNode(pin, node);
    updateCoins(player.id, 30);
    renderHUD();
    renderHomeLog();
    refreshAllPinMarkers();

    speakText(`${pin.n} captured from ${oldOwner}. 30 coins awarded.`);
    return true;
  }

  saveNode(pin, node);
  renderHUD();
  renderHomeLog();
  refreshAllPinMarkers();

  speakText(
    `${pin.n} attacked. Defence reduced by ${damage}. Defence now ${Math.round(
      node.defencePercent
    )} percent.`
  );

  return true;
}

  
  
  function handleAction(pin, player) {
    if (!pin || !player) return;

    const node = getNode(pin);
    if (!node) return;

if (!node.ownerId) {
  captureNode(pin, player);
  return;
}

if (node.ownerId !== player.id) {
  attackNode(pin, player);
  return;
}

if (node.level < 3) {
  upgradeNode(pin, player);
  return;
}

collectNodeCoins(pin, player);
  }

  return {
    ensureTerritoryState,
    getNode,
    getNodeLabel,
    handleAction,
    captureNode,
    collectNodeCoins,
    upgradeNode,
    attackNode,
  };
}
