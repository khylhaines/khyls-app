import { SHOP_ITEMS } from "./shop_items.js";

export function getShopItemById(id) {
  return SHOP_ITEMS.find(i => i.id === id);
}

export function getInventoryCount(id) {
  return Number(window.state?.inventory?.[id] || 0);
}

export function addToInventory(id, amount = 1) {
  const s = window.state;
  if (!s.inventory) s.inventory = {};
  s.inventory[id] = getInventoryCount(id) + amount;
}

export function buyShopItem(id) {
  const item = getShopItemById(id);
  const player = window.getActivePlayer?.();
  const state = window.state;

  if (!item || !player) return;

  if (player.coins < item.cost) {
    alert("Not enough coins");
    return;
  }

  player.coins -= item.cost;
  addToInventory(id, 1);

  window.saveState?.();
  window.renderHUD?.();
  window.renderShop?.();
}
