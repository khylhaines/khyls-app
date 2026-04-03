import { SHOP_ITEMS } from "./shop_items.js";

export function renderShopUI(state) {
  const listEl = document.getElementById("shop-list");
  const invEl = document.getElementById("shop-inventory");
  const sumEl = document.getElementById("shop-summary");

  if (!listEl || !invEl || !sumEl) return;

  listEl.innerHTML = "";
  invEl.innerHTML = "";

  // SUMMARY
  sumEl.innerHTML = `
    Coins: ${state.coins || 0}<br>
    XP: ${state.xp || 0}
  `;

  // SHOP LIST
  SHOP_ITEMS.forEach((item) => {
    const owned = (state.inventory || []).includes(item.id);

    const div = document.createElement("div");
    div.className = "shop-item";

    div.innerHTML = `
      <div class="shop-item-top">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.desc}</small>
        </div>
        <div class="shop-cost">${item.price}</div>
      </div>
      ${
        owned
          ? `<div class="owned-tag">OWNED</div>`
          : `<button class="win-btn buy-btn" data-id="${item.id}">BUY</button>`
      }
    `;

    listEl.appendChild(div);
  });

  // INVENTORY
  (state.inventory || []).forEach((id) => {
    const item = SHOP_ITEMS.find((i) => i.id === id);
    if (!item) return;

    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `<strong>${item.name}</strong>`;

    invEl.appendChild(div);
  });

  // BUY HANDLER
  document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      buyItem(state, id);
    };
  });
}

export function buyItem(state, itemId) {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return;

  if (state.coins < item.price) {
    alert("Not enough coins");
    return;
  }

  state.coins -= item.price;
  state.inventory = state.inventory || [];
  state.inventory.push(itemId);

  renderShopUI(state);
}
