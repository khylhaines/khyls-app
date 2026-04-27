import { SHOP_ITEMS } from "./shop_items.js";

/* ============================
   INTERNAL HELPERS
============================ */

export function getShopItemById(itemId) {
  return SHOP_ITEMS.find((item) => item.id === itemId) || null;
}

function formatSectionTitle(section) {
  switch (section) {
    case "characters": return "Characters";
    case "trails": return "Trails";
    case "themes": return "Map Themes";
    case "boosts": return "Boosts";
    case "weapons": return "Weapons";
    default: return section;
  }
}

function getSectionIcon(section) {
  switch (section) {
    case "characters": return "🧍";
    case "trails": return "✨";
    case "themes": return "🗺️";
    case "boosts": return "⚡";
    case "weapons": return "🐝";
    default: return "🛒";
  }
}

function playShopSound(fileName) {
  try {
    if (typeof window.playSound === "function") {
      window.playSound(fileName);
      return;
    }

    if (!window.__audioUnlocked) return;

    const audio = new Audio(`./sounds/${fileName}`);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  } catch (err) {
    console.warn("Shop sound failed:", err);
  }
}

/* ============================
   SECTIONS
============================ */

export function getShopSections() {
  const sections = {};

  SHOP_ITEMS.forEach((item) => {
    if (!sections[item.section]) {
      sections[item.section] = {
        id: item.section,
        title: formatSectionTitle(item.section),
        icon: getSectionIcon(item.section),
      };
    }
  });

  return Object.values(sections);
}

export function getItemsForSection(section) {
  const id = typeof section === "string" ? section : section.id;
  return SHOP_ITEMS.filter((item) => item.section === id);
}

/* ============================
   INVENTORY SYSTEM
============================ */

export function ensureDefaultOwnedInventory(inventory = {}, purchasedItems = []) {
  const nextInventory =
    inventory && typeof inventory === "object" ? { ...inventory } : {};

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
  const state = window.state;
  if (!state?.inventory || typeof state.inventory !== "object") return 0;
  return Number(state.inventory[itemId] || 0);
}

export function addToInventory(itemId, amount = 1) {
  const state = window.state;
  if (!state) return;

  if (!state.inventory || typeof state.inventory !== "object") {
    state.inventory = {};
  }

  state.inventory[itemId] =
    Number(state.inventory[itemId] || 0) + Number(amount || 0);
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
  const state = window.state;
  if (!state) {
    console.warn("Global state not found");
    return false;
  }

  const normalised = ensureDefaultOwnedInventory(
    state.inventory || {},
    state.purchasedItems || []
  );

  state.inventory = normalised.inventory;
  state.purchasedItems = normalised.purchasedItems;

  const item = getShopItemById(itemId);
  if (!item) return false;

  const player =
    typeof window.getActivePlayer === "function"
      ? window.getActivePlayer()
      : typeof window.getPlayer === "function"
      ? window.getPlayer()
      : null;

  if (!player) {
    console.warn("No player system found");
    return false;
  }

  const alreadyOwned = hasItem(itemId);

  if (alreadyOwned && !isStackableItem(item)) {
    alert("Already owned");
    return false;
  }

  if (Number(player.coins || 0) < Number(item.cost || 0)) {
    alert("Not enough coins");
    return false;
  }

  player.coins = Number(player.coins || 0) - Number(item.cost || 0);

  addToInventory(itemId, 1);

  if (!state.purchasedItems.includes(item.id)) {
    state.purchasedItems.push(item.id);
  }

  if (typeof window.saveState === "function") window.saveState();
  if (typeof window.renderHUD === "function") window.renderHUD();
  if (typeof window.renderShop === "function") window.renderShop();

  if (typeof window.speakText === "function") {
    window.speakText(`${item.name} purchased`);
  }

  if (item.id === "char_chicken") playShopSound("chickenbuy.mp3");
  if (item.id === "char_ghost") playShopSound("ghost.mp3");
  if (item.id === "char_frog") playShopSound("frog.mp3");

  return true;
}

/* ============================
   AUTO INITIALISATION
============================ */

export function initShopSystem() {
  const state = window.state;
  if (!state) return;

  const normalised = ensureDefaultOwnedInventory(
    state.inventory || {},
    state.purchasedItems || []
  );

  state.inventory = normalised.inventory;
  state.purchasedItems = normalised.purchasedItems;
}
