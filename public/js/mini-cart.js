

document.addEventListener("DOMContentLoaded", () => {
  initMiniCart();
});

function initMiniCart() {
  const cartBtn = document.querySelector(".cart-link");
  const cartPopup = document.querySelector(".mini-cart-popup");
  const closeBtn = document.querySelector(".close-mini-cart");
  const overlay = document.querySelector(".overlay");

  if (!cartBtn || !cartPopup || !closeBtn || !overlay) return;

  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    openCart(cartPopup, overlay);
  });

  closeBtn.addEventListener("click", () => {
    closeCart(cartPopup, overlay);
  });

  window.addEventListener("click", (e) => {
    if (
      !cartPopup.contains(e.target) &&
      !cartBtn.contains(e.target)
    ) {
      closeCart(cartPopup, overlay);
    }
  });
}

function openCart(cartPopup, overlay) {
  cartPopup.classList.add("visible");
  overlay.classList.add("active");

  initMiniCartQuantity();
}

function closeCart(cartPopup, overlay) {
  cartPopup.classList.remove("visible");
  overlay.classList.remove("active");
}

function initOpenPage(url) {
  window.location.href = url;
}

function initMiniCartQuantity() {
  document
    .querySelectorAll(".mini-cart-popup .cart-item")
    .forEach((item) => {
      const decrementBtn = item.querySelector(".decrement");
      const incrementBtn = item.querySelector(".increment");
      const quantityInput = item.querySelector(".quantity-input");
      const priceElement = item.querySelector(".price");
      const removeBtn = item.querySelector(".remove-from-cart");

      if (
        !decrementBtn ||
        !incrementBtn ||
        !quantityInput ||
        !priceElement ||
        !removeBtn
      ) {
        return;
      }

      const unitPrice = parseFloat(priceElement.dataset.price);

      function updateQuantity(change) {
        let quantity = parseInt(quantityInput.value);

        quantity += change;

        if (quantity <= 0) {
          removeMiniCartItem(item);
          return;
        }

        quantityInput.value = quantity;

        const totalPrice = unitPrice * quantity;

        priceElement.innerHTML = `₹ ${totalPrice.toFixed(2)}`;

        updateMiniCartTotals();

        updateCart(quantityInput);
      }

      incrementBtn.onclick = () => updateQuantity(1);

      decrementBtn.onclick = () => updateQuantity(-1);

      removeBtn.onclick = () => removeMiniCartItem(item);
    });
}

async function updateCart(input) {
  const cartId = input.dataset.id;
  const quantity = input.value;

  try {
    const response = await fetch("/cart/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
        quantity,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      showPopup("Error", data.message, "error");
    } else{
      showPopup("Success", "Cart Updated", "success");
      location.reload();

    }
  } catch (err) {
    console.error(err);
  }
}

async function removeMiniCartItem(item) {
  const cartId = item.querySelector(".quantity-input").dataset.id;

  try {
    const response = await fetch(`/cart/remove/${cartId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      item.remove();

      updateMiniCartTotals();

      showPopup("Success", data.message, "success");

      if (!document.querySelector(".mini-cart-popup .cart-item")) {
        location.reload();
      }
    } else {
      showPopup("Error", data.message, "error");
    }
  } catch (err) {
    console.log(err);
  }
}

function updateMiniCartTotals() {
  let total = 0;

  document
    .querySelectorAll(".mini-cart-popup .cart-item")
    .forEach((item) => {
      const price = parseFloat(
        item.querySelector(".price").textContent.replace("₹", "")
      );

      total += price;
    });

  const subtotal = document.querySelector(
    ".mini-cart-popup .sub-total"
  );

  const totalElement = document.querySelector(
    ".mini-cart-popup .total"
  );

  if (subtotal) {
    subtotal.innerHTML = `<i class="uil uil-rupee-sign"></i>${total.toFixed(
      2
    )}`;
  }

  if (totalElement) {
    totalElement.innerHTML = `<i class="uil uil-rupee-sign"></i>${total.toFixed(
      2
    )}`;
  }
}

async function clearMiniCart() {
  try {
    const response = await fetch("/cart/clear", {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      showPopup("Success", data.message, "success");
      location.reload();
    } else {
      showPopup("Error", data.message, "error");
    }
  } catch (err) {
    console.log(err);
  }
}

function checkoutCart() {
  window.location.href = "/checkout";
}

