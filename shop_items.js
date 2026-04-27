export const SHOP_ITEMS = [
  // DEFAULTS
  {
    id: "hero_duo",
    name: "Hero Duo",
    cost: 0,
    slot: "character",
    type: "character",
    section: "characters",
    desc: "Default Barrow Quest explorer.",
    ownedByDefault: true,
    defaultEquip: true,
    icon: "🧭",
    rarity: "common",
    featured: true,
  },
  {
    id: "trail_none",
    name: "No Trail",
    cost: 0,
    slot: "trail",
    type: "trail",
    section: "trails",
    desc: "No trail effect.",
    ownedByDefault: true,
    defaultEquip: true,
    icon: "➖",
    rarity: "common",
  },
  {
    id: "map_classic",
    name: "Classic Map",
    cost: 0,
    slot: "mapTheme",
    type: "mapTheme",
    section: "themes",
    desc: "Standard map theme.",
    ownedByDefault: true,
    defaultEquip: true,
    icon: "🗺️",
    rarity: "common",
  },

  // CHARACTERS (unchanged)
  { id: "ninja", name: "Ninja", cost: 120, slot: "character", type: "character", section: "characters", desc: "Silent and sharp.", icon: "🥷", rarity: "rare" },
  { id: "wizard", name: "Wizard", cost: 140, slot: "character", type: "character", section: "characters", desc: "Mystic explorer.", icon: "🧙", rarity: "rare" },
  { id: "robot", name: "Robot", cost: 160, slot: "character", type: "character", section: "characters", desc: "Metal machine.", icon: "🤖", rarity: "epic" },
  { id: "pirate", name: "Pirate", cost: 180, slot: "character", type: "character", section: "characters", desc: "Treasure hunter.", icon: "🏴‍☠️", rarity: "epic" },
  { id: "monk", name: "Monk", cost: 220, slot: "character", type: "character", section: "characters", desc: "Abbey spirit.", icon: "⛪", rarity: "legendary" },
  { id: "char_chicken", name: "Chicken", cost: 90, slot: "character", type: "character", section: "characters", desc: "Chaotic chicken.", icon: "🐔", rarity: "uncommon" },
  { id: "char_frog", name: "Frog", cost: 90, slot: "character", type: "character", section: "characters", desc: "Jump into missions.", icon: "🐸", rarity: "uncommon" },
  { id: "char_ghost", name: "Ghost", cost: 110, slot: "character", type: "character", section: "characters", desc: "Float through Barrow.", icon: "👻", rarity: "rare" },

  // TRAILS
  { id: "trail_poo", name: "Poo Trail", cost: 80, slot: "trail", type: "trail", section: "trails", icon: "💩", rarity: "uncommon" },
  { id: "trail_rainbow", name: "Rainbow Trail", cost: 120, slot: "trail", type: "trail", section: "trails", icon: "🌈", rarity: "rare" },

  // THEMES
  { id: "map_dark", name: "Dark Map", cost: 100, slot: "mapTheme", type: "mapTheme", section: "themes", icon: "🌙", rarity: "uncommon" },
  { id: "map_neon", name: "Neon Map", cost: 140, slot: "mapTheme", type: "mapTheme", section: "themes", icon: "💜", rarity: "epic" },

  // BOOSTS
  { id: "hint_basic", name: "Hint Token", cost: 50, type: "consumable", section: "boosts", stackable: true, icon: "💡", rarity: "common" },

  // 🔥 NEW WEAPONS
  {
    id: "wooden_arrow",
    name: "Bee Arrow",
    cost: 20,
    section: "weapons",
    stackable: true,
    icon: "🐝🏹",
    rarity: "common",
  },
  {
    id: "bone_arrow",
    name: "Stinger Arrow",
    cost: 40,
    section: "weapons",
    stackable: true,
    icon: "🐝🦴",
    rarity: "uncommon",
  },
  {
    id: "hand_cannon",
    name: "Bee Sub Cannon",
    cost: 100,
    section: "weapons",
    stackable: true,
    icon: "🐝🚢",
    rarity: "rare",
  }
];
