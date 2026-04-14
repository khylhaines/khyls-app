export function ProgressionSystem({ getState, saveState }) {
  function getLevelFromXP(xp = 0) {
    return Math.floor(xp / 100) + 1;
  }

  function addXP(amount) {
    const state = getState();
    state.meta.xp = Number(state.meta.xp || 0) + Number(amount || 0);
    saveState?.();
  }

  function addTokens(amount) {
    const state = getState();
    state.meta.tokens = Number(state.meta.tokens || 0) + Number(amount || 0);
    saveState?.();
  }

  function showScriptedRewardImage(title, caption, image) {
    const modal = document.getElementById("reward-modal");
    const img = document.getElementById("reward-image");
    const text = document.getElementById("reward-image-caption");

    if (!modal || !img || !text) return;

    img.src = image;
    text.innerText = `${title}\n\n${caption}`;
    modal.style.display = "block";
  }

  return {
    getLevelFromXP,
    addXP,
    addTokens,
    showScriptedRewardImage,
  };
}
