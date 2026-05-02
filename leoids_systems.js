export let leoidsState = {
  active: false,
  role: "runner", // "hunter" or "runner"
  status: "free", // "free" or "jailed"
  roundTime: 600, // 10 minutes
  timeLeft: 600,
  huntersReleased: false,
  score: 0,
  coins: 0
};

export function startLeoidsGame(role = "runner") {
  leoidsState.active = true;
  leoidsState.role = role;
  leoidsState.status = "free";
  leoidsState.timeLeft = 600;
  leoidsState.huntersReleased = false;

  // Hunters delay
  if (role === "hunter") {
    setTimeout(() => {
      leoidsState.huntersReleased = true;
    }, 30000);
  }

  console.log("LEOIDs started:", role);
}

export function endLeoidsGame() {
  leoidsState.active = false;
  console.log("LEOIDs ended");
}
