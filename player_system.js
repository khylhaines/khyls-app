import { DEFAULT_PLAYER } from "./player_items.js";

let player = structuredClone(DEFAULT_PLAYER);

export function loadPlayer(saved) {
  if (saved) player = { ...player, ...saved };
}

export function getPlayer() {
  return player;
}

export function addCoins(amount) {
  player.coins += amount;
}

export function spendCoins(amount) {
  if (player.coins < amount) return false;
  player.coins -= amount;
  return true;
}

export function ownItem(id) {
  return player.ownedItems.includes(id);
}

export function addItem(id) {
  if (!ownItem(id)) player.ownedItems.push(id);
}

export function equipItem(type, id) {
  player.equipped[type] = id;
}
