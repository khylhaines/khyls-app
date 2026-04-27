mport { SHOP_ITEMS } from "./shop_items.js";
import { getShopItemById, buyShopItem } from "./shop_system.js";

const SHOP_TABS = ["characters", "trails", "themes", "boosts", "weapons", "owned"];

const shopView = { tab: "characters" };

function getInventoryCount(id) {
  return Number(window.state?.inventory?.[id] || 0);
}

function getItems() {
  if (shopView.tab === "owned") {
    return SHOP_ITEMS.filter(i => getInventoryCount(i.id) > 0);
  }
  return SHOP_ITEMS.filter(i => i.section === shopView.tab);
}

export function renderShop() {
  const list = document.getElementById("shop-list");
  if (!list) return;

  list.innerHTML = `
    <div class="shop-shell compact">
      <div class="shop-tabs">
        ${SHOP_TABS.map(t => `
          <button class="shop-tab ${shopView.tab===t?"active":""}" onclick="setShopTab('${t}')">
            ${t.toUpperCase()}
          </button>
        `).join("")}
      </div>

      <div class="shop-card-grid compact">
        ${getItems().map(item => {
          const owned = getInventoryCount(item.id);
          return `
            <div class="shop-product-card compact">
              <div>${item.icon}</div>
              <div>${item.name}</div>
              <div>${owned ? "Owned x"+owned : "🪙 "+item.cost}</div>
              ${
                owned
                  ? `<button disabled>OWNED</button>`
                  : `<button onclick="buyShopItem('${item.id}')">BUY</button>`
              }
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

window.setShopTab = (tab) => {
  shopView.tab = tab;
  renderShop();
};

window.renderShop = renderShop;
window.buyShopItem = buyShopItem;

