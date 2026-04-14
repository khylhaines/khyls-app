export function createUISystem({
  renderShop,
  renderHomeLog,
}) {
  function renderAllUI() {
    renderShop?.();
    renderHomeLog?.();
  }

  return {
    renderAllUI,
  };
}
