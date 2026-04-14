import { SHOP_ITEMS } from "./shop_items.js";
import {
  getShopItemById,
  isEquippableItem,
  getEquipSlot,
  buyShopItem,
} from "./shop_system.js";

const SHOP_TABS = ["characters", "trails", "themes", "boosts"];

const shopView = {
  tab: "characters",
};

function getInventoryCount(itemId) {
  return Number(window.state?.inventory?.[itemId] || 0);
}

function isEquippedItem(item) {
  const state = window.state;
  if (!item || !state?.settings) return false;

  if (item.slot === "character") {
    return state.settings.character === item.id;
  }

  if (item.slot === "trail") {
    return (state.settings.equippedTrail || "trail_none") === item.id;
  }

  if (item.slot === "mapTheme") {
    return (state.settings.mapTheme || "map_classic") === item.id;
  }

  return false;
}

function getSectionMeta(sectionId) {
  switch (sectionId) {
    case "characters":
      return {
        id: "characters",
        icon: "🧍",
        title: "Characters",
        subtitle: "Pick who leads the quest.",
      };
    case "trails":
      return {
        id: "trails",
        icon: "✨",
        title: "Trails",
        subtitle: "Style your movement on the map.",
      };
    case "themes":
      return {
        id: "themes",
        icon: "🗺️",
        title: "Themes",
        subtitle: "Change the feel of the world.",
      };
    case "boosts":
      return {
        id: "boosts",
        icon: "⚡",
        title: "Boosts",
        subtitle: "Extra utility for tougher missions.",
      };
    default:
      return {
        id: sectionId,
        icon: "🛒",
        title: sectionId,
        subtitle: "",
      };
  }
}

function getRarityLabel(item) {
  switch (item.rarity) {
    case "legendary":
      return "LEGENDARY";
    case "epic":
      return "EPIC";
    case "rare":
      return "RARE";
    case "uncommon":
      return "UNCOMMON";
    default:
      return "COMMON";
  }
}

function getRarityClass(item) {
  switch (item.rarity) {
    case "legendary":
      return "rarity-legendary";
    case "epic":
      return "rarity-epic";
    case "rare":
      return "rarity-rare";
    case "uncommon":
      return "rarity-uncommon";
    default:
      return "rarity-common";
  }
}

function renderOwnedInventory() {
  const inventory = document.getElementById("shop-inventory");
  if (!inventory) return;

  const ownedItems = SHOP_ITEMS.filter((item) => getInventoryCount(item.id) > 0);

  if (!ownedItems.length) {
    inventory.innerHTML = `<div class="shop-mini">No items yet.</div>`;
    return;
  }

  inventory.innerHTML = `
    <div class="shop-owned-strip">
      ${ownedItems
        .map((item) => {
          const equipped = isEquippedItem(item);
          return `
            <div class="shop-owned-chip ${equipped ? "active" : ""}">
              <span class="shop-owned-chip-icon">${item.icon || "🎁"}</span>
              <span class="shop-owned-chip-name">${item.name}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSummary() {
  const summary = document.getElementById("shop-summary");
  const state = window.state;
  const active = window.getActivePlayer?.();

  if (!summary || !state) return;

  const coins = active?.coins || 0;
  const xp = Number(state.meta?.xp || 0);
  const level =
    typeof window.getLevelFromXP === "function"
      ? window.getLevelFromXP(xp)
      : Math.floor(xp / 100) + 1;

  const ownedCount = SHOP_ITEMS.filter((item) => getInventoryCount(item.id) > 0).length;
  const totalCount = SHOP_ITEMS.length;

  summary.innerHTML = `
    <div class="shop-hero-card">
      <div class="shop-hero-copy">
        <div class="shop-kicker">QUEST STORE</div>
        <h3>Loadout Bay</h3>
        <p>Buy gear, switch skins, set trails, and style the map before the next run.</p>
      </div>

      <div class="shop-stat-grid">
        <div class="shop-stat">
          <span>PLAYER</span>
          <strong>${active?.name || "Player"}</strong>
        </div>
        <div class="shop-stat">
          <span>COINS</span>
          <strong>🪙 ${coins}</strong>
        </div>
        <div class="shop-stat">
          <span>LEVEL</span>
          <strong>⭐ ${level}</strong>
        </div>
        <div class="shop-stat">
          <span>OWNED</span>
          <strong>${ownedCount}/${totalCount}</strong>
        </div>
      </div>

      <div class="shop-loadout">
        <div class="shop-loadout-pill">
          <span>🧍</span>
          <strong>${state.settings.character || "hero_duo"}</strong>
        </div>
        <div class="shop-loadout-pill">
          <span>✨</span>
          <strong>${state.settings.equippedTrail || "trail_none"}</strong>
        </div>
        <div class="shop-loadout-pill">
          <span>🗺️</span>
          <strong>${state.settings.mapTheme || "map_classic"}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderTabs() {
  return `
    <div class="shop-tabs">
      ${SHOP_TABS.map((tabId) => {
        const meta = getSectionMeta(tabId);
        const active = shopView.tab === tabId ? "active" : "";
        return `
          <button class="shop-tab ${active}" onclick="setShopTab('${tabId}')">
            <span>${meta.icon}</span>
            <span>${meta.title}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderSectionContent() {
  const meta = getSectionMeta(shopView.tab);
  const items = SHOP_ITEMS.filter((item) => item.section === shopView.tab);

  return `
    <div class="shop-section-head">
      <div>
        <div class="shop-section-kicker">${meta.icon} ${meta.title}</div>
        <div class="shop-section-sub">${meta.subtitle}</div>
      </div>
    </div>

    <div class="shop-card-grid">
      ${items
        .map((item) => {
          const owned = getInventoryCount(item.id);
          const equipped = isEquippedItem(item);
          const canEquip = isEquippableItem(item);
          const stateLabel = equipped ? "EQUIPPED" : owned ? "OWNED" : "LOCKED";

          return `
            <div class="shop-product-card ${owned ? "owned" : ""} ${equipped ? "equipped" : ""}">
              <div class="shop-product-top">
                <div class="shop-product-icon-wrap">
                  <div class="shop-product-icon">${item.icon || "🎁"}</div>
                </div>
                <div class="shop-product-badges">
                  <span class="shop-rarity ${getRarityClass(item)}">${getRarityLabel(item)}</span>
                  ${item.featured ? `<span class="shop-featured">FEATURED</span>` : ""}
                </div>
              </div>

              <div class="shop-product-name">${item.name}</div>
              <div class="shop-product-desc">${item.desc || ""}</div>

              <div class="shop-product-row">
                <div class="shop-price">🪙 ${item.cost}</div>
                <div class="shop-state">${stateLabel}</div>
              </div>

              ${
                owned
                  ? canEquip
                    ? `<button class="win-btn shop-action-btn" onclick="equipShopItem('${item.id}')">
                         ${equipped ? "EQUIPPED" : "EQUIP"}
                       </button>`
                    : `<button class="win-btn shop-action-btn disabled-btn" disabled>OWNED</button>`
                  : `<button class="win-btn shop-action-btn" onclick="buyShopItem('${item.id}')">
                       BUY NOW
                     </button>`
              }
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

export function renderShop() {
  const list = document.getElementById("shop-list");
  const state = window.state;
  if (!list || !state) return;

  if (typeof window.ensureShopDefaults === "function") {
    window.ensureShopDefaults();
  }

  renderSummary();
  renderOwnedInventory();

  list.innerHTML = `
    <div class="shop-shell">
      ${renderTabs()}
      ${renderSectionContent()}
    </div>
  `;
}

export function equipShopItem(itemId) {
  const item = getShopItemById(itemId);
  if (!item) return false;

  const state = window.state;
  if (!state?.settings) return false;

  const slot = getEquipSlot(item);
  if (!slot) return false;

  if (slot === "character") {
    state.settings.character = item.id;
    window.saveState?.();
    window.applySettingsToUI?.();
    window.renderHUD?.();
    window.refreshHeroMarker?.();
    window.renderShop?.();
    window.speakText?.(`${item.name} equipped.`);

    if (item.id === "char_chicken") {
      window.playSound?.("chickenbuy.mp3");
    }
    return true;
  }

  if (slot === "trail") {
    state.settings.equippedTrail = item.id;
    window.saveState?.();
    window.renderShop?.();
    window.clearTrailLayers?.();
    window.speakText?.(`${item.name} equipped.`);
    return true;
  }

  if (slot === "mapTheme") {
    state.settings.mapTheme = item.id;
    window.saveState?.();
    window.renderShop?.();
    window.applyMapTheme?.();
    window.speakText?.(`${item.name} equipped.`);
    return true;
  }

  return false;
}

window.setShopTab = function setShopTab(tabId) {
  if (!SHOP_TABS.includes(tabId)) return;
  shopView.tab = tabId;
  renderShop();
};

window.renderShop = renderShop;
window.equipShopItem = equipShopItem;
window.buyShopItem = buyShopItem;
