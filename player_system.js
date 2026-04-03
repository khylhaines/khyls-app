import { SHOP_ITEMS } from "./shop_items.js";
import {
  getPlayer,
  spendCoins,
  addItem,
  ownItem,
  equipItem
} from "./player_system.js";

export function renderShop(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = SHOP_ITEMS.map((item) => {
    const owned = ownItem(item.id);

    return `
      <div class="shop-item">
        <div class="shop-item-top">
          <strong>${item.name}</strong>
          <span class="shop-cost">${item.price}</span>
        </div>

        ${
          owned
            ? `<button onclick="equip('${item.type}','${item.id}')">EQUIP</button>
               <div class="owned-tag">OWNED</div>`
            : `<button onclick="buy('${item.id}')">BUY</button>`
        }
      </div>
    `;
  }).join("");
}

export function buy(id) {
  const item = SHOP_ITEMS.find((i) => i.id === id);
  if (!item) return;

  if (!spendCoins(item.price)) {
    alert("Not enough coins");
    return;
  }

  addItem(item.id);
  renderShop("shop-list");
}

export function equip(type, id) {
  equipItem(type, id);
  renderShop("shop-list");
}
