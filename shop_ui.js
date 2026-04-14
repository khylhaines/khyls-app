import { SHOP_ITEMS } from "./shop_items.js";
import {
  getShopItemById,
  isEquippableItem,
  getEquipSlot,
  buyShopItem,
} from "./shop_system.js";

const SHOP_TABS = ["characters", "trails", "themes", "boosts", "owned"];

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
    case "owned":
      return {
        id: "owned",
        icon: "🎒",
        title: "Owned",
        subtitle: "Everything you already have.",
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

function getItemSortScore(item) {
  const equipped = isEquippedItem(item);
  const owned = getInventoryCount(item.id) > 0;

  if (equipped) return 0;
  if (owned) return 1;
  return 2;
}

function getItemsForCurrentTab() {
  if (shopView.tab === "owned") {
    return SHOP_ITEMS.filter((item) => getInventoryCount(item.id) > 0).sort((a, b) => {
      const scoreDiff = getItemSortScore(a) - getItemSortScore(b);
      if (scoreDiff !== 0) return scoreDiff;
      return a.name.localeCompare(b.name);
    });
  }

  return SHOP_ITEMS.filter((item) => item.section === shopView.tab).sort((a, b) => {
    const scoreDiff = getItemSortScore(a) - getItemSortScore(b);
    if (scoreDiff !== 0) return scoreDiff;
    return Number(a.cost || 0) - Number(b.cost || 0);
  });
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
    <div class="shop-topbar">
      <div class="shop-topbar-left">
        <div class="shop-kicker">QUEST STORE</div>
        <div class="shop-topbar-title">Loadout</div>
      </div>

      <div class="shop-topbar-stats">
        <div class="shop-mini-stat">
          <span>PLAYER</span>
          <strong>${active?.name || "Player"}</strong>
        </div>
        <div class="shop-mini-stat">
          <span>COINS</span>
          <strong>🪙 ${coins}</strong>
        </div>
        <div class="shop-mini-stat">
          <span>LEVEL</span>
          <strong>⭐ ${level}</strong>
        </div>
        <div class="shop-mini-stat">
          <span>OWNED</span>
          <strong>${ownedCount}/${totalCount}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderTabs() {
  return `
    <div class="shop-tabs shop-tabs-five">
      ${SHOP_TABS.map((tabId) => {
        const meta = getSectionMeta(tabId);
        const active = shopView.tab === tabId ? "active" : "";
        return `
          <button class="shop-tab ${active}" onclick="setShopTab('${tabId}')">
            <span class="shop-tab-icon">${meta.icon}</span>
            <span class="shop-tab-label">${meta.title}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderSectionContent() {
  const meta = getSectionMeta(shopView.tab);
  const items = getItemsForCurrentTab();

  if (!items.length && shopView.tab === "owned") {
    return `
      <div class="shop-section-head compact">
        <div>
          <div class="shop-section-kicker">${meta.icon} ${meta.title}</div>
          <div class="shop-section-sub">${meta.subtitle}</div>
        </div>
      </div>

      <div class="shop-empty-state">
        <div class="shop-empty-icon">🎒</div>
        <div class="shop-empty-title">Nothing owned yet</div>
        <div class="shop-empty-text">Buy a few items first and they will show up here.</div>
      </div>
    `;
  }

  return `
    <div class="shop-section-head compact">
      <div>
        <div class="shop-section-kicker">${meta.icon} ${meta.title}</div>
        <div class="shop-section-sub">${meta.subtitle}</div>
      </div>
    </div>

    <div class="shop-card-grid compact">
      ${items
        .map((item) => {
          const ownedCount = getInventoryCount(item.id);
          const owned = ownedCount > 0;
          const equipped = isEquippedItem(item);
          const canEquip = isEquippableItem(item);
          const stateLabel = equipped
            ? "EQUIPPED"
            : owned
            ? item.stackable
              ? `OWNED x${ownedCount}`
              : "OWNED"
            : "LOCKED";

          return `
            <div class="shop-product-card compact ${owned ? "owned" : ""} ${equipped ? "equipped" : ""}">
              <div class="shop-product-top compact">
                <div class="shop-product-icon-wrap compact">
                  <div class="shop-product-icon compact">${item.icon || "🎁"}</div>
                </div>

                <div class="shop-product-badges compact">
                  <span class="shop-rarity ${getRarityClass(item)}">${getRarityLabel(item)}</span>
                  ${equipped ? `<span class="shop-featured equipped-badge">LIVE</span>` : ""}
                </div>
              </div>

              <div class="shop-product-name compact">${item.name}</div>
              <div class="shop-product-desc compact">${item.desc || ""}</div>

              <div class="shop-product-row compact">
                <div class="shop-price compact">${shopView.tab === "owned" ? (ownedCount > 1 ? `x${ownedCount}` : "OWNED") : `🪙 ${item.cost}`}</div>
                <div class="shop-state compact">${stateLabel}</div>
              </div>

              ${
                owned
                  ? canEquip
                    ? `<button class="win-btn shop-action-btn compact" onclick="equipShopItem('${item.id}')">
                         ${equipped ? "EQUIPPED" : "EQUIP"}
                       </button>`
                    : `<button class="win-btn shop-action-btn compact disabled-btn" disabled>OWNED</button>`
                  : `<button class="win-btn shop-action-btn compact" onclick="buyShopItem('${item.id}')">
                       BUY
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
  const inventory = document.getElementById("shop-inventory");
  const state = window.state;

  if (!list || !state) return;

  if (typeof window.ensureShopDefaults === "function") {
    window.ensureShopDefaults();
  }

  renderSummary();

  if (inventory) {
    inventory.innerHTML = "";
    inventory.style.display = "none";
  }

  list.innerHTML = `
    <div class="shop-shell compact">
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
