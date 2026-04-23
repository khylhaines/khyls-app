export function createExplorerMode(api) {
  const {
    getCurrentPin,
    setCurrentPin,
    openMissionMenu,
  } = api;

  function openPin(pin) {
    const targetPin = pin || getCurrentPin();
    if (!targetPin) return;

    setCurrentPin(targetPin);
    openMissionMenu();
  }

  return {
    id: "explorer",
    openPin,
  };
}
