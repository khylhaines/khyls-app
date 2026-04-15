export function createShopBridge({ state, saveState }) {
  function ensureShopDefaults() {
    if (!state.settings) state.settings = {};
    if (!state.inventory) state.inventory = {};
    if (!state.purchasedItems) state.purchasedItems = [];

    // Default equipment
    if (!state.settings.character) state.settings.character = "hero_duo";
    if (!state.settings.equippedTrail) state.settings.equippedTrail = "trail_none";
    if (!state.settings.mapTheme) state.settings.mapTheme = "map_classic";
  }

  function buyItem(item) {
    const player = window.getActivePlayer?.();
    if (!player) return false;

    if (player.coins < item.cost) return false;

    player.coins -= item.cost;

    state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;

    if (!state.purchasedItems.includes(item.id)) {
      state.purchasedItems.push(item.id);
    }

    saveState?.();
    window.renderHUD?.();
    window.renderShop?.();

    return true;
  }

  return {
    ensureShopDefaults,
    buyItem,
  };
}
