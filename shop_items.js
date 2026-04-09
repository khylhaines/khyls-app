// shop_items.js

// =========================
// SHOP DATA
// =========================

const SHOP_ITEMS = [
  // =========================
  // CHARACTERS
  // =========================
  {
    id: "hero_duo",
    name: "Hero Duo",
    desc: "The classic explorers of Barrow Quest.",
    cost: 0,
    section: "characters",
    slot: "character",
    equippable: true,
  },
  {
    id: "ninja",
    name: "Ninja Scout",
    desc: "Fast. Silent. Always watching.",
    cost: 120,
    section: "characters",
    slot: "character",
    equippable: true,
  },
  {
    id: "wizard",
    name: "Wizard Guide",
    desc: "Ancient knowledge flows through you.",
    cost: 180,
    section: "characters",
    slot: "character",
    equippable: true,
  },
  {
    id: "robot",
    name: "Robo Ranger",
    desc: "Precision tracking unit activated.",
    cost: 220,
    section: "characters",
    slot: "character",
    equippable: true,
  },
  {
    id: "pirate",
    name: "Pirate Captain",
    desc: "Treasure hunter of the docks.",
    cost: 200,
    section: "characters",
    slot: "character",
    equippable: true,
  },
  {
    id: "khylan",
    name: "Khylan",
    desc: "Frog-powered legend.",
    cost: 250,
    section: "characters",
    slot: "character",
    equippable: true,
  },
  {
    id: "piper",
    name: "Piper",
    desc: "Superhero of the quest.",
    cost: 250,
    section: "characters",
    slot: "character",
    equippable: true,
  },

  // =========================
  // TRAILS
  // =========================
  {
    id: "trail_none",
    name: "No Trail",
    desc: "Move silently with no trace.",
    cost: 0,
    section: "trails",
    slot: "trail",
    equippable: true,
  },
  {
    id: "trail_poo",
    name: "Poo Trail",
    desc: "Leave chaos behind you 💩",
    cost: 100,
    section: "trails",
    slot: "trail",
    equippable: true,
  },
  {
    id: "trail_rainbow",
    name: "Rainbow Trail",
    desc: "Spread colour across the map 🌈",
    cost: 160,
    section: "trails",
    slot: "trail",
    equippable: true,
  },
  {
    id: "trail_fire",
    name: "Fire Trail",
    desc: "Burn your path into legend 🔥",
    cost: 220,
    section: "trails",
    slot: "trail",
    equippable: true,
  },
  {
    id: "trail_stars",
    name: "Star Trail",
    desc: "Leave cosmic energy behind ✨",
    cost: 200,
    section: "trails",
    slot: "trail",
    equippable: true,
  },
  {
    id: "trail_slime",
    name: "Slime Trail",
    desc: "Sticky… weird… perfect.",
    cost: 140,
    section: "trails",
    slot: "trail",
    equippable: true,
  },

  // =========================
  // MAP THEMES
  // =========================
  {
    id: "map_default",
    name: "Standard Map",
    desc: "Classic explorer view.",
    cost: 0,
    section: "map",
    slot: "mapTheme",
    equippable: true,
  },
  {
    id: "map_gold",
    name: "Golden Map",
    desc: "Everything shines with treasure.",
    cost: 200,
    section: "map",
    slot: "mapTheme",
    equippable: true,
  },
  {
    id: "map_dark",
    name: "Night Ops Map",
    desc: "Stealth mode activated.",
    cost: 180,
    section: "map",
    slot: "mapTheme",
    equippable: true,
  },
  {
    id: "map_arcade",
    name: "Arcade Map",
    desc: "Bright. Loud. Retro energy.",
    cost: 220,
    section: "map",
    slot: "mapTheme",
    equippable: true,
  },

  // =========================
  // BOOSTS (NON-EQUIP)
  // =========================
  {
    id: "boost_xp",
    name: "XP Boost",
    desc: "Earn extra XP for a short time.",
    cost: 80,
    section: "boosts",
    equippable: false,
  },
  {
    id: "boost_coins",
    name: "Coin Boost",
    desc: "Increase coin rewards temporarily.",
    cost: 80,
    section: "boosts",
    equippable: false,
  },
  {
    id: "hint_token",
    name: "Hint Token",
    desc: "Reveal a clue when stuck.",
    cost: 60,
    section: "boosts",
    equippable: false,
  },
];

// =========================
// SECTIONS
// =========================
export function getShopSections() {
  return [
    { id: "characters", title: "CHARACTERS" },
    { id: "trails", title: "TRAIL EFFECTS" },
    { id: "map", title: "MAP STYLES" },
    { id: "boosts", title: "BOOSTS" },
  ];
}

// =========================
// GET ITEMS BY SECTION
// =========================
export function getItemsForSection(section) {
  return SHOP_ITEMS.filter((i) => i.section === section.id);
}

// =========================
// GET SINGLE ITEM
// =========================
export function getShopItemById(id) {
  return SHOP_ITEMS.find((i) => i.id === id);
}

// =========================
// EQUIP HELPERS
// =========================
export function isEquippableItem(item) {
  return !!item.equippable;
}

export function getEquipSlot(item) {
  return item.slot || null;
    }
