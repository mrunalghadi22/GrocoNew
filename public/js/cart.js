document.addEventListener("DOMContentLoaded", () => {
    initCartPageQuantity();
  });
  
  function initCartPageQuantity() {
    document.querySelectorAll(".groco-cart .cart-item").forEach((item) => {
      const decrementBtn = item.querySelector(".decrement");
      const incrementBtn = item.querySelector(".increment");
      const quantityInput = item.querySelector(".quantity-input");
      const priceElement = item.querySelector(".price");
      const totalElement = item.querySelector(".prod-total-ammount .total");
      const removeBtn = item.querySelector(".pro-rem-btn");
  
      const unitPrice = parseFloat(priceElement.dataset.price);
  
      function updateQuantity(change) {
        let quantity = parseInt(quantityInput.value);
  
        quantity += change;
  
        if (quantity <= 0) {
          removeCartItem(removeBtn);
          return;
        }
  
        quantityInput.value = quantity;
  
        const itemTotal = unitPrice * quantity;
  
      
        totalElement.textContent = itemTotal.toFixed(2);
  
        updateCartSummary();
  
        updateCart(quantityInput);
      }
  
      incrementBtn.onclick = () => updateQuantity(1);
      decrementBtn.onclick = () => updateQuantity(-1);
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
      console.log(err);
    }
  }
  
  async function removeCartItem(button) {
    const row = button.closest(".cart-item");
    const cartId = row.querySelector(".quantity-input").dataset.id;
  
    try {
      const response = await fetch(`/cart/remove/${cartId}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (data.success) {
        row.remove();
  
        updateCartSummary();
  
        showPopup("Success", data.message, "success");
  
        if (!document.querySelector(".groco-cart .cart-item")) {
          location.reload();
        }
      } else {
        showPopup("Error", data.message, "error");
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  function updateCartSummary() {
    let subtotal = 0;
    let items = 0;
  
    document.querySelectorAll(".groco-cart .cart-item").forEach((item) => {
      subtotal += parseFloat(
        item.querySelector(".prod-total-ammount .total").textContent
      );
  
      items++;
    });
  
    document.querySelector(".items .value").textContent = items;
  
    document.querySelector(".subTotal .value").innerHTML =
      `<i class="uil uil-rupee-sign"></i>${subtotal.toFixed(2)}`;
  
    document.querySelector(".total .value").innerHTML =
      `<i class="uil uil-rupee-sign"></i>${subtotal.toFixed(2)}`;
  }