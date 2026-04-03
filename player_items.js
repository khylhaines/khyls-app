export const DEFAULT_PLAYER = {
  coins: 100,
  xp: 0,
  tokens: 0,

  ownedItems: [],

  equipped: {
    character: "hero_duo",
    trail: null,
    map: "map_classic",
  },
};

export function createDefaultPlayer() {
  return structuredClone(DEFAULT_PLAYER);
}

export function normalisePlayerData(raw = {}) {
  const safe = raw && typeof raw === "object" ? raw : {};

  return {
    coins: Number.isFinite(Number(safe.coins)) ? Number(safe.coins) : DEFAULT_PLAYER.coins,
    xp: Number.isFinite(Number(safe.xp)) ? Number(safe.xp) : DEFAULT_PLAYER.xp,
    tokens: Number.isFinite(Number(safe.tokens)) ? Number(safe.tokens) : DEFAULT_PLAYER.tokens,

    ownedItems: Array.isArray(safe.ownedItems)
      ? [...new Set(safe.ownedItems.map(String))]
      : [...DEFAULT_PLAYER.ownedItems],

    equipped: {
      character:
        typeof safe?.equipped?.character === "string" && safe.equipped.character.trim()
          ? safe.equipped.character
          : DEFAULT_PLAYER.equipped.character,

      trail:
        typeof safe?.equipped?.trail === "string" && safe.equipped.trail.trim()
          ? safe.equipped.trail
          : DEFAULT_PLAYER.equipped.trail,

      map:
        typeof safe?.equipped?.map === "string" && safe.equipped.map.trim()
          ? safe.equipped.map
          : DEFAULT_PLAYER.equipped.map,
    },
  };
}
