import { createDefaultPlayer, normalisePlayerData } from "./player_items.js";

let player = createDefaultPlayer();

export function loadPlayer(savedPlayer) {
  player = normalisePlayerData(savedPlayer || {});
  return player;
}

export function resetPlayer() {
  player = createDefaultPlayer();
  return player;
}

export function getPlayer() {
  return player;
}

export function getPlayerCoins() {
  return Number(player.coins || 0);
}

export function getPlayerXp() {
  return Number(player.xp || 0);
}

export function getPlayerTokens() {
  return Number(player.tokens || 0);
}

export function addCoins(amount = 0) {
  player.coins = Math.max(0, Number(player.coins || 0) + Number(amount || 0));
  return player.coins;
}

export function spendCoins(amount = 0) {
  const cost = Math.max(0, Number(amount || 0));
  if (Number(player.coins || 0) < cost) return false;
  player.coins = Number(player.coins || 0) - cost;
  return true;
}

export function addXp(amount = 0) {
  player.xp = Math.max(0, Number(player.xp || 0) + Number(amount || 0));
  return player.xp;
}

export function addTokens(amount = 0) {
  player.tokens = Math.max(0, Number(player.tokens || 0) + Number(amount || 0));
  return player.tokens;
}

export function spendTokens(amount = 0) {
  const cost = Math.max(0, Number(amount || 0));
  if (Number(player.tokens || 0) < cost) return false;
  player.tokens = Number(player.tokens || 0) - cost;
  return true;
}

export function ownItem(itemId) {
  const id = String(itemId || "");
  return player.ownedItems.includes(id);
}

export function addItem(itemId) {
  const id = String(itemId || "").trim();
  if (!id) return false;
  if (!ownItem(id)) {
    player.ownedItems.push(id);
    return true;
  }
  return false;
}

export function removeItem(itemId) {
  const id = String(itemId || "").trim();
  const before = player.ownedItems.length;
  player.ownedItems = player.ownedItems.filter((ownedId) => ownedId !== id);

  if (player.equipped.character === id) player.equipped.character = "hero_duo";
  if (player.equipped.trail === id) player.equipped.trail = null;
  if (player.equipped.map === id) player.equipped.map = "map_classic";

  return player.ownedItems.length !== before;
}

export function equipItem(type, itemId) {
  const safeType = String(type || "").trim();
  const id = String(itemId || "").trim();

  if (!safeType || !id) return false;
  if (!ownItem(id) && id !== "hero_duo" && id !== "map_classic") return false;

  if (safeType === "character") {
    player.equipped.character = id;
    return true;
  }

  if (safeType === "trail") {
    player.equipped.trail = id;
    return true;
  }

  if (safeType === "map") {
    player.equipped.map = id;
    return true;
  }

  return false;
}

export function unequipItem(type) {
  const safeType = String(type || "").trim();

  if (safeType === "character") {
    player.equipped.character = "hero_duo";
    return true;
  }

  if (safeType === "trail") {
    player.equipped.trail = null;
    return true;
  }

  if (safeType === "map") {
    player.equipped.map = "map_classic";
    return true;
  }

  return false;
}

export function getEquipped() {
  return {
    ...player.equipped,
  };
}

export function exportPlayerData() {
  return normalisePlayerData(player);
}
