export function wireApp({
  playerSystem,
  modalSystem,
  shopBridge,
  progressionSystem,
  mapSystem,
  notesSystem,
}) {
  // PLAYER
  window.getActivePlayer = playerSystem.getActivePlayer;
  window.renderHUD = playerSystem.renderHUD;

  // MODALS
  window.showModal = modalSystem.showModal;

  // SHOP
  window.ensureShopDefaults = shopBridge.ensureShopDefaults;

  // PROGRESSION
  window.getLevelFromXP = progressionSystem.getLevelFromXP;

  // MAP
  window.applyMapTheme = mapSystem.applyMapTheme;
  window.createHeroIcon = mapSystem.createHeroIcon;
  window.refreshHeroMarker = mapSystem.refreshHeroMarker;

  // NOTES
  window.renderHomeLog = notesSystem.renderHomeLog;
}
