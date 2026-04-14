export function getDefaultAdaptiveProfile(mode = "kid") {
  return {
    mode,
    difficulty: "normal",
    correctStreak: 0,
    wrongStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    lastUpdated: Date.now(),
  };
}

export function normaliseAdaptiveProfile(profile = {}, mode = "kid") {
  return {
    mode,
    difficulty: profile.difficulty || "normal",
    correctStreak: Number(profile.correctStreak || 0),
    wrongStreak: Number(profile.wrongStreak || 0),
    totalAnswered: Number(profile.totalAnswered || 0),
    totalCorrect: Number(profile.totalCorrect || 0),
    lastUpdated: profile.lastUpdated || Date.now(),
  };
}
