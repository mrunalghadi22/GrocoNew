const productSection = document.querySelector(".product-details");
document.addEventListener("DOMContentLoaded", () => {
  initProductQuantity();
});

function initProductQuantity() {
  const quantityBox = productSection.querySelector(".quantity");

  console.log(quantityBox);

  if (!quantityBox) return;

  const decrementBtn = quantityBox.querySelector(".decrement");
  const incrementBtn = quantityBox.querySelector(".increment");
  const quantityInput = quantityBox.querySelector(".quantity-input");

  incrementBtn.addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  decrementBtn.addEventListener("click", () => {
    let value = parseInt(quantityInput.value);

    if (value > 1) {
      quantityInput.value = value - 1;
    }
  });

  quantityInput.addEventListener("change", () => {
    if (quantityInput.value === "" || parseInt(quantityInput.value) < 1) {
      quantityInput.value = 1;
    }
  });
}

async function addToCart(event, button) {
  event.stopPropagation();

  const productId = button.dataset.id;
  const quantity = parseInt(
    productSection.querySelector(".quantity-input").value
  );

  console.log("Product ID:", productId);
  console.log("Quantity:", quantity);

  try {
    const response = await fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
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

function buyNow(button, product_id) {
  let quantityInput = button.closest('.product-info').querySelector('.quantity-input');
  let quantity = quantityInput ? quantityInput.value : 1; 
  
  let url = `/checkout?product_id=${product_id}&isCart=false&quantity=${quantity}`;
  
  console.log("Redirecting to:", url); 
  
  window.location.href = url; 
}
