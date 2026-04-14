import { SHOP_ITEMS } from "./shop_items.js";
import {
  getShopItemById,
  getShopSections,
  getItemsForSection,
  isEquippableItem,
  getEquipSlot,
  buyShopItem,
} from "./shop_system.js";

/* =========================
   HELPERS
========================= */

function getInventoryCount(itemId) {
  return Number(window.state?.inventory?.[itemId] || 0);
}

function isEquippedItem(item) {
  const state = window.state;

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

/* =========================
   SHOP RENDER
========================= */

export function renderShop() {
  const summary = document.getElementById("shop-summary");
  const list = document.getElementById("shop-list");
  const inventory = document.getElementById("shop-inventory");
  const active = window.getActivePlayer();

  if (!summary || !list || !inventory) return;

  const state = window.state;

  const coins = active?.coins || 0;
  const xp = Number(state.meta?.xp || 0);
  const level = Math.floor(xp / 100) + 1;

  summary.innerHTML = `
    <div class="shop-status-card">
      <div><strong>${active?.name || "Player"}</strong></div>
      <div>🪙 Coins: ${coins}</div>
      <div>⭐ XP: ${xp} (Level ${level})</div>
      <div>🧍 Character: ${state.settings.character}</div>
      <div>✨ Trail: ${state.settings.equippedTrail}</div>
      <div>🗺️ Theme: ${state.settings.mapTheme}</div>
    </div>
  `;

  const ownedItems = SHOP_ITEMS.filter((item) => getInventoryCount(item.id) > 0);

  inventory.innerHTML = ownedItems.length
    ? `
      <div class="shop-item-grid">
        ${ownedItems
          .map((item) => {
            const emoji = item.icon || "🎁";
            const equipped = isEquippedItem(item);

            return `
              <div class="shop-item-tile small owned">
                <div class="shop-item-icon">${emoji}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-meta">
                  ${equipped ? "✅ Equipped" : "📦 Owned"}
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `
    : `<div class="shop-mini">No items yet.</div>`;

  list.innerHTML = getShopSections()
    .map((section, index) => {
      const items = getItemsForSection(section);
      if (!items.length) return "";

      const sectionId = `shop-section-${index}`;

      return `
        <div class="shop-accordion">
          <button onclick="toggleShopSection('${sectionId}')">
            ${section.title}
          </button>

          <div id="${sectionId}" style="display:${index === 0 ? "grid" : "none"};">
            ${items
              .map((item) => {
                const owned = getInventoryCount(item.id);
                const equipped = isEquippedItem(item);

                return `
                  <div class="shop-item-tile">
                    <div>${item.icon || "🎁"}</div>
                    <div>${item.name}</div>
                    <div>${item.desc}</div>

                    ${
                      owned
                        ? `
                          ${
                            isEquippableItem(item)
                              ? `<button onclick="equipShopItem('${item.id}')">
                                   ${equipped ? "EQUIPPED" : "EQUIP"}
                                 </button>`
                              : ""
                          }
                        `
                        : `<button onclick="buyShopItem('${item.id}')">BUY</button>`
                    }
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

/* =========================
   EQUIP
========================= */

export function equipShopItem(itemId) {
  const item = getShopItemById(itemId);
  if (!item) return;

  const state = window.state;
  const slot = getEquipSlot(item);

  if (slot === "character") {
    state.settings.character = item.id;

    if (item.id === "char_chicken") {
      window.playSound?.("chickenbuy.mp3");
    }
  }

  if (slot === "trail") {
    state.settings.equippedTrail = item.id;
  }

  if (slot === "mapTheme") {
    state.settings.mapTheme = item.id;
  }

  window.saveState?.();
  window.renderHUD?.();
  renderShop();
}

/* =========================
   GLOBAL
========================= */

window.renderShop = renderShop;
window.equipShopItem = equipShopItem;
window.buyShopItem = buyShopItem;

window.toggleShopSection = function (id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.style.display = el.style.display === "grid" ? "none" : "grid";
};
