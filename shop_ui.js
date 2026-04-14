import { SHOP_ITEMS } from "./shop_items.js";
import {
  getShopItemById,
  getShopSections,
  getItemsForSection,
  isEquippableItem,
  getEquipSlot,
  buyShopItem,
} from "./shop_system.js";

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

export function renderShop() {
  const summary = document.getElementById("shop-summary");
  const list = document.getElementById("shop-list");
  const inventory = document.getElementById("shop-inventory");
  const active = window.getActivePlayer?.();
  const state = window.state;

  if (!summary || !list || !inventory || !state) return;

  if (typeof window.ensureShopDefaults === "function") {
    window.ensureShopDefaults();
  }

  const coins = active?.coins || 0;
  const xp = Number(state.meta?.xp || 0);
  const level =
    typeof window.getLevelFromXP === "function"
      ? window.getLevelFromXP(xp)
      : Math.floor(xp / 100) + 1;

  summary.innerHTML = `
    <div class="shop-status-card">
      <div><strong>${active?.name || "Player"}</strong></div>
      <div>🪙 Coins: ${coins}</div>
      <div>⭐ XP: ${xp} (Level ${level})</div>
      <div>🧍 Character: ${state.settings.character || "hero_duo"}</div>
      <div>✨ Trail: ${state.settings.equippedTrail || "trail_none"}</div>
      <div>🗺️ Theme: ${state.settings.mapTheme || "map_classic"}</div>
    </div>
  `;

  const ownedItems = SHOP_ITEMS.filter((item) => getInventoryCount(item.id) > 0);

  if (!ownedItems.length) {
    inventory.innerHTML = `<div class="shop-mini">No items yet.</div>`;
  } else {
    inventory.innerHTML = `
      <div class="shop-item-grid">
        ${ownedItems
          .map((item) => {
            const equipped = isEquippedItem(item);
            const emoji = item.icon || "🎁";

            return `
              <div class="shop-item-tile small owned">
                <div class="shop-item-icon">${emoji}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-meta">${equipped ? "✅ Equipped" : "📦 Owned"}</div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  list.innerHTML = getShopSections()
    .map((section, index) => {
      const items = getItemsForSection(section);
      if (!items.length) return "";

      const sectionId = `shop-section-${index}`;

      return `
        <div class="shop-accordion">
          <button class="shop-accordion-btn" onclick="toggleShopSection('${sectionId}')">
            <span>${section.icon || "🛒"} ${section.title}</span>
            <span id="${sectionId}-arrow">▼</span>
          </button>

          <div class="shop-accordion-body" id="${sectionId}" style="display:${index === 0 ? "grid" : "none"};">
            ${items
              .map((item) => {
                const owned = getInventoryCount(item.id);
                const equipped = isEquippedItem(item);
                const emoji = item.icon || "🎁";

                return `
                  <div class="shop-item-tile ${equipped ? "equipped" : owned ? "owned" : ""}">
                    <div class="shop-item-icon">${emoji}</div>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-desc">${item.desc || ""}</div>
                    <div class="shop-item-price">🪙 ${item.cost}</div>

                    ${
                      owned
                        ? `
                          <div class="shop-item-state">${equipped ? "✅ EQUIPPED" : "📦 OWNED"}</div>
                          ${
                            isEquippableItem(item)
                              ? `<button class="win-btn shop-item-btn" onclick="equipShopItem('${item.id}')">
                                   ${equipped ? "EQUIPPED" : "EQUIP"}
                                 </button>`
                              : ``
                          }
                        `
                        : `
                          <button class="win-btn shop-item-btn" onclick="buyShopItem('${item.id}')">
                            BUY
                          </button>
                        `
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

function toggleShopSection(sectionId) {
  const body = document.getElementById(sectionId);
  const arrow = document.getElementById(`${sectionId}-arrow`);
  if (!body || !arrow) return;

  const isOpen = body.style.display === "grid";
  body.style.display = isOpen ? "none" : "grid";
  arrow.innerText = isOpen ? "▶" : "▼";
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

    if (window.heroMarker && typeof window.createHeroIcon === "function") {
      window.heroMarker.setIcon(window.createHeroIcon());
    }

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

window.renderShop = renderShop;
window.toggleShopSection = toggleShopSection;
window.equipShopItem = equipShopItem;
window.buyShopItem = buyShopItem;
