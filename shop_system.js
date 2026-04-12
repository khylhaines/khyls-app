import { SHOP_ITEMS } from "./shop_items.js";

/* ============================
   INTERNAL HELPERS
============================ */

export function getShopItemById(itemId) {
  return SHOP_ITEMS.find((item) => item.id === itemId) || null;
}

export function getShopSections() {
  const sections = {};

  SHOP_ITEMS.forEach((item) => {
    if (!sections[item.section]) {
      const formatted = formatSectionMeta(item.section);

      sections[item.section] = {
        id: item.section,
        title: formatted.title,
        icon: formatted.icon,
      };
    }
  });

  return Object.values(sections);
}

export function getItemsForSection(section) {
  const id = typeof section === "string" ? section : section.id;
  return SHOP_ITEMS.filter((item) => item.section === id);
}

function formatSectionMeta(section) {
  switch (section) {
    case "characters":
      return { title: "Characters", icon: "🧍" };
    case "trails":
      return { title: "Trails", icon: "✨" };
    case "themes":
      return { title: "Map Themes", icon: "🗺️" };
    case "boosts":
      return { title: "Boosts", icon: "🎁" };
    default:
      return { title: section, icon: "🛒" };
  }
}

/* ============================
   INVENTORY SYSTEM
============================ */

export function ensureDefaultOwnedInventory(inventory = {}, purchasedItems = []) {
  const nextInventory = { ...inventory };
  const nextPurchasedItems = Array.isArray(purchasedItems)
    ? [...purchasedItems]
    : [];

  SHOP_ITEMS.forEach((item) => {
    if (item.ownedByDefault) {
      if (!nextInventory[item.id]) {
        nextInventory[item.id] = 1;
      }

      if (!nextPurchasedItems.includes(item.id)) {
        nextPurchasedItems.push(item.id);
      }
    }
  });

  return {
    inventory: nextInventory,
    purchasedItems: nextPurchasedItems,
  };
}

export function getInventoryCount(itemId) {
  if (!state.inventory) return 0;
  return state.inventory[itemId] || 0;
}

export function addToInventory(itemId, amount = 1) {
  if (!state.inventory) {
    state.inventory = {};
  }

  state.inventory[itemId] = (state.inventory[itemId] || 0) + amount;
}

export function hasItem(itemId) {
  return getInventoryCount(itemId) > 0;
}

/* ============================
   ITEM TYPES
============================ */

export function isStackableItem(item) {
  return item?.stackable === true;
}

export function isEquippableItem(item) {
  return (
    item?.slot === "character" ||
    item?.slot === "trail" ||
    item?.slot === "mapTheme"
  );
}

export function getEquipSlot(item) {
  return item?.slot || null;
}

/* ============================
   PURCHASE SYSTEM
============================ */

export function buyShopItem(itemId) {
  ensureDefaultOwnedInventory();

  const item = getShopItemById(itemId);
  if (!item) return false;

  const player = window.getPlayer ? getPlayer() : null;

  if (!player) {
    console.warn("No player system found");
    return false;
  }

  const alreadyOwned = hasItem(itemId);

  if (alreadyOwned && !isStackableItem(item)) {
    alert("Already owned");
    return false;
  }

  if (player.coins < item.cost) {
    alert("Not enough coins");
    return false;
  }

  player.coins -= item.cost;

  addToInventory(itemId, 1);

  if (window.saveState) saveState();
  if (window.renderHUD) renderHUD();
  if (window.renderShop) renderShop();

  if (window.speakText) {
    speakText(`${item.name} purchased`);
  }

  return true;
}

/* ============================
   AUTO INITIALISATION
============================ */

export function initShopSystem() {
  ensureDefaultOwnedInventory();
}
