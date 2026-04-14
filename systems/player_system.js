export function createPlayerSystem({ state, saveState, renderShop, getLevelFromXP }) {
  function getEnabledPlayers() {
    return state.players.filter((p) => p.enabled);
  }

  function getActivePlayer() {
    return (
      state.players.find((p) => p.id === state.activePlayerId && p.enabled) ||
      getEnabledPlayers()[0] ||
      state.players[0]
    );
  }

  function setActivePlayer(id) {
    const player = state.players.find((p) => p.id === id && p.enabled);
    if (!player) return;

    state.activePlayerId = id;
    saveState?.();
    renderHUD();
    renderShop?.();
  }

  function setPlayerCount(count) {
    state.players.forEach((p, i) => {
      p.enabled = i < count;
    });

    const active = getActivePlayer();
    if (active) {
      state.activePlayerId = active.id;
    }

    saveState?.();
    renderHUD();
    renderShop?.();
  }

  function updateCoins(playerId, amount) {
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    player.coins = Math.max(0, Number(player.coins || 0) + Number(amount || 0));
    saveState?.();
    renderHUD();
    renderShop?.();
  }

  function renderHUD() {
    const active = getActivePlayer();
    const coins = active?.coins || 0;
    const xp = Number(state.meta?.xp || 0);
    const level =
      typeof getLevelFromXP === "function"
        ? getLevelFromXP(xp)
        : Math.floor(xp / 100) + 1;

    const topCoins = document.getElementById("top-coins");
    const topXp = document.getElementById("top-xp");
    const topTokens = document.getElementById("top-tokens");
    const title = document.querySelector(".top-pill");

    if (topCoins) topCoins.innerText = String(coins);
    if (topXp) topXp.innerText = `L${level} • ${xp}`;

    if (topTokens && topTokens.parentElement) {
      topTokens.parentElement.classList.add("hidden");
    }

    if (title) {
      title.innerText = "BARROW QUEST";
    }
  }

  return {
    getEnabledPlayers,
    getActivePlayer,
    setActivePlayer,
    setPlayerCount,
    updateCoins,
    renderHUD,
  };
}
