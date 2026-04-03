import { SHOP_ITEMS } from "./shop_items.js";

export function getShopItemById(itemId) {
  return SHOP_ITEMS.find((item) => item.id === itemId) || null;
}

export function getShopItemsByType(type) {
  return SHOP_ITEMS.filter((item) => item.type === type);
}

export function getShopSections() {
  return [
    {
      key: "characters",
      title: "CHARACTERS",
      types: ["character"],
    },
    {
      key: "trails",
      title: "TRAILS",
      types: ["trail"],
    },
    {
      key: "map",
      title: "MAP THEMES",
      types: ["map_theme"],
    },
    {
      key: "boosts",
      title: "BOOSTS & ITEMS",
      types: ["consumable", "effect"],
    },
    {
      key: "badges",
      title: "COLLECTIBLES",
      types: ["badge"],
    },
  ];
}

export function getItemsForSection(section) {
  if (!section || !Array.isArray(section.types) || !section.types.length) {
    return [];
  }

  return SHOP_ITEMS.filter((item) => section.types.includes(item.type));
}

export function isStackableItem(item) {
  return !!item?.stackable;
}

export function getEquipSlot(item) {
  return item?.slot || null;
}

export function isEquippableItem(item) {
  return !!getEquipSlot(item);
}

export function getDefaultOwnedItemIds() {
  return SHOP_ITEMS.filter((item) => item.defaultOwned).map((item) => item.id);
}

export function ensureDefaultOwnedInventory(inventory = {}, purchasedItems = []) {
  const safeInventory =
    inventory && typeof inventory === "object" ? { ...inventory } : {};

  const safePurchased = Array.isArray(purchasedItems) ? [...purchasedItems] : [];

  getDefaultOwnedItemIds().forEach((itemId) => {
    if (!Number.isFinite(Number(safeInventory[itemId])) || Number(safeInventory[itemId]) < 1) {
      safeInventory[itemId] = 1;
    }

    if (!safePurchased.includes(itemId)) {
      safePurchased.push(itemId);
    }
  });

  return {
    inventory: safeInventory,
    purchasedItems: safePurchased,
  };
}
