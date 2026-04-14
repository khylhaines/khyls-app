export function PlayerSystem(BQ) {
  function getEnabledPlayers() {
    return BQ.state.players.filter((p) => p.enabled);
  }

  function getActivePlayer() {
    return (
      BQ.state.players.find((p) => p.id === BQ.state.activePlayerId && p.enabled) ||
      getEnabledPlayers()[0] ||
      BQ.state.players[0]
    );
  }

  function setActivePlayer(id) {
    const player = BQ.state.players.find((p) => p.id === id && p.enabled);
    if (!player) return;

    BQ.state.activePlayerId = id;
    BQ.saveState?.();
    renderHUD();
    window.renderShop?.();
  }

  function setPlayerCount(count) {
    BQ.state.players.forEach((p, i) => {
      p.enabled = i < count;
    });

    const active = getActivePlayer();
    BQ.state.activePlayerId = active.id;
    BQ.saveState?.();
    renderHUD();
    window.renderShop?.();
  }

  function updateCoins(playerId, amount) {
    const player = BQ.state.players.find((p) => p.id === playerId);
    if (!player) return;

    player.coins = Math.max(0, Number(player.coins || 0) + Number(amount || 0));
    BQ.saveState?.();
    renderHUD();
    window.renderShop?.();
  }

  function renderHUD() {
    const active = getActivePlayer();
    const coins = active?.coins || 0;
    const xp = Number(BQ.state.meta?.xp || 0);
    const level = BQ.getLevelFromXP(xp);

    if (BQ.$("top-coins")) BQ.$("top-coins").innerText = String(coins);
    if (BQ.$("top-xp")) BQ.$("top-xp").innerText = `L${level} • ${xp}`;

    const legacyTokens = BQ.$("top-tokens");
    if (legacyTokens) legacyTokens.parentElement?.classList.add("hidden");

    const title = document.querySelector(".top-pill");
    if (title && BQ.state.activePack === "classic" && BQ.state.mapMode === "abbey") {
      const abbey = BQ.getAbbeyRebuild?.() || { stage: 0, points: 0 };
      title.innerText = abbey.stage > 0 ? `LOST ORDER • R${abbey.points}` : "BARROW QUEST";
    } else if (title) {
      title.innerText = "BARROW QUEST";
    }
  }

  BQ.getEnabledPlayers = getEnabledPlayers;
  BQ.getActivePlayer = getActivePlayer;
  BQ.setActivePlayer = setActivePlayer;
  BQ.setPlayerCount = setPlayerCount;
  BQ.updateCoins = updateCoins;
  BQ.renderHUD = renderHUD;

  window.getActivePlayer = getActivePlayer;
  window.renderHUD = renderHUD;
}
