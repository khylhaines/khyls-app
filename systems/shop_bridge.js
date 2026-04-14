import { ensureDefaultOwnedInventory } from "../shop_system.js";

export function createShopBridge({ getState, saveState }) {
  function ensureShopDefaults() {
    const state = getState();

    const result = ensureDefaultOwnedInventory(
      state.inventory,
      state.purchasedItems
    );

    state.inventory = result.inventory;
    state.purchasedItems = result.purchasedItems;

    saveState?.();
  }

  function getInventoryCount(itemId) {
    const state = getState();
    return Number(state?.inventory?.[itemId] || 0);
  }

  return {
    ensureShopDefaults,
    getInventoryCount,
  };
}
