function openLogin() {
  window.location.href = "/login";
}

// function initMiniCart() {
//   const cartBtn = document.querySelector(".cart-link");
//   const cartPopUp = document.querySelector(".mini-cart-popup");
//   const closeCartBtn = document.querySelector(".close-mini-cart");
//   const overlay = document.querySelector(".overlay");

//   cartBtn.addEventListener("click", (e) => {
//     e.stopPropagation(); // Prevents the click from propagating to the window
//     openCart(cartPopUp, overlay);
//   });

//   closeCartBtn.addEventListener("click", (e) => {
//     closeCart(cartPopUp, overlay);
//   });

//   // Close when clicking outside the mini-cart
//   window.addEventListener("click", (e) => {
//     if (!cartPopUp.contains(e.target) && !cartBtn.contains(e.target)) {
//       closeCart(cartPopUp, overlay);
//     }
//   });
// }

// function openCart(cartPopUp, overlay) {
//   cartPopUp.classList.add("visible");
//   overlay.classList.add("active");
// }

// function closeCart(cartPopUp, overlay) {
//   cartPopUp.classList.remove("visible");
//   overlay.classList.remove("active");
// }

// initMiniCart();

// function initOpenPage(url) {
//   window.location.href = url;
// }

function showPopup(title, message, type = "success") {
  const popup = document.getElementById("customPopup");
  const titleElement = document.getElementById("text-1");
  const messageElement = document.getElementById("text-2");
  const iconElement = document.querySelector("#customPopup i"); // Select the icon
  const popupCloseBtn = document.getElementById("popupCloseBtn");
  const progress = document.getElementById("progress");

  titleElement.textContent = title;
  messageElement.textContent = message;

  // Change popup appearance based on type
  if (type === "success") {
    popup.classList.add("success");
    popup.classList.remove("error");
    iconElement.className = "fa-solid fa-check"; // ⚠️ Error icon
    popup.style.borderLeft = "6px solid #27ae60";
    popup.style.backgroundColor = "#d4edda";
    popup.style.color = "#155724";
  } else {
    popup.classList.add("error");
    popup.classList.remove("success");
    iconElement.className = "fa-solid fa-exclamation-circle"; // ⚠️ Error icon
    popup.style.borderLeft = "6px solid #e74c3c";
    popup.style.backgroundColor = "#f8d7da";
    popup.style.color = "#721c24";
  }

  // background-color: #f8d7da;
  // color: #721c24;
  // border-color: #e74c3c;

  popup.classList.add("active");
  // progress.classList.add("active");

  // Close popup when clicking close button
  popupCloseBtn.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  // Close popup when clicking outside it
  window.addEventListener("click", (event) => {
    if (event.target === popup) {
      popup.classList.remove("active");
    }
  });

  // Auto-close after 3 seconds
  setTimeout(() => {
    popup.classList.remove("active");
  }, 5000);
}

function setupCategoryDropdown(buttonId) {
  const btn = document.querySelector(`#${buttonId}`);
  const dropdown = btn
    ?.closest(".category")
    ?.querySelector(".dropdown-category-list");

  if (dropdown) {
    dropdown.style.display = "none";
  }

  if (btn && dropdown) {
    btn.addEventListener("click", (e) => {
      if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
      } else {
        dropdown.style.display = "none";
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupCategoryDropdown("dropDownMenuButton1");
  setupCategoryDropdown("dropDownMenuButton2");
});

const searchBtn = document.querySelector(".search-icon");
const searchBarDiv = document.querySelector(".search-box-div");
if (searchBtn && searchBarDiv) {
  searchBtn.addEventListener("click", () => {
    // console.log(searchBtn);
    searchBarDiv.classList.toggle("showSearchBar");
    searchBarDiv.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!searchBarDiv.contains(e.target) && !searchBtn.contains(e.target)) {
      searchBarDiv.classList.remove("showSearchBar");
    }
  });
}

document.querySelectorAll(".search-box").forEach((form) => {
  const label = form.querySelector(".cat-label");
  const hiddenCategory = form.querySelector("input[name = 'category']");
  const items = form.querySelectorAll(".dropdown-category-list li");
  console.log(hiddenCategory);

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const selectText = item.textContent.trim();
      label.textContent = selectText;

      if (selectText === "All Categories") {
        hiddenCategory.value = ""; // reset hidden field
      } else {
        hiddenCategory.value = item.getAttribute("data-slug");
      }

      form.querySelector(".dropdown-category-list").style.display = "none";
    });
  });
});

async function sendProductDetails(event, button) {
  event.stopPropagation(); // Prevents the parent <a> click
  console.log("Button clicked");

  const productId = button.dataset.id;

  try {
    const response = await fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showPopup("Success", data.message, "success");

      const cartCount = document.querySelector(".cart-count");

      if (cartCount) {
        cartCount.textContent = data.cartCount;
      }
      location.reload();
    } else {
      showPopup("Error", data.message, "error");
    }
  } catch (err) {
    console.log(err);

    showPopup("Error", "Something went wrong", "error");
  }
}

async function addToWishlist(event, button) {
  console.log("NEW WISHLIST FUNCTION");
  event.stopPropagation();
  // const productId = button.dataset.data-id;
  const productId = button.getAttribute("data-id");

  try {
    const response = await fetch("/wishlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showPopup("Success", data.message, "success");
    } else {
      showPopup("Error", data.message, "error");
    }
  } catch (err) {
    console.error("Wishlist Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

function redirectToProduct(id) {
  window.location.href = `/product/${id}`;
}

const cartBtn = document.querySelector(".cart-link"); // The button you just showed me
const miniCartPopup = document.querySelector(".mini-cart-popup"); // The cart panel
const closeCartBtn = document.querySelector(".close-mini-cart"); // The 'X' button
const overlay = document.querySelector(".overlay"); // The dark background

// 2. Open the Cart
if (cartBtn && miniCartPopup) {
  cartBtn.addEventListener("click", () => {
    miniCartPopup.classList.add("visible");
    if (overlay) overlay.classList.add("active");
  });
}

// 3. Close the Cart (Clicking the 'X')
if (closeCartBtn && miniCartPopup) {
  closeCartBtn.addEventListener("click", () => {
    miniCartPopup.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
  });
}

// 4. Close the Cart (Clicking the dark overlay outside the cart)
if (overlay && miniCartPopup) {
  overlay.addEventListener("click", () => {
    miniCartPopup.classList.remove("active");
    overlay.classList.remove("active");
  });
}

// function initQuantity() {
//   document.querySelectorAll(".cart-item").forEach((item) => {
//     const decrementBtn = item.querySelector(".decrement");
//     const incrementBtn = item.querySelector(".increment");
//     const quantityInput = item.querySelector(".quantity-input");

//     const priceElement = item.querySelector(".price");          // Price column
//     const totalElement = item.querySelector(".prod-total-ammount .total"); // Total column

//     const removeBtn = item.querySelector(".remove-from-cart");

//     const unitPrice = parseFloat(priceElement.dataset.price);

//     function updateQuantity(change) {
//       let currentQuantity = parseInt(quantityInput.value) + change;

//       if (currentQuantity <= 0) {
//         removeFromCart(item);
//         return;
//       }

//       quantityInput.value = currentQuantity;

//       // Update ONLY the Total column
//       totalElement.textContent = (unitPrice * currentQuantity).toFixed(2);

//       // Update cart summary
//       updateCartTotals();

//       // Save to DB
//       updateCart(quantityInput);
//     }

//     incrementBtn.onclick = () => updateQuantity(1);
//     decrementBtn.onclick = () => updateQuantity(-1);
//     removeBtn.onclick = () => removeFromCart(item);
//   });
// }

// async function updateCart(input) {
//   const cartId = input.dataset.id;
//   const quantity = input.value;

//   try {
//     const response = await fetch("/cart/update", {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         cartId,
//         quantity,
//       }),
//     });

//     const data = await response.json();

//     if (!data.success) {
//       showPopup("Error", data.message, "error");
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function removeFromCart(item) {
//   const cartId = item.querySelector(".quantity-input").dataset.id;

//   try {
//     const response = await fetch(`/cart/remove/${cartId}`, {
//       method: "DELETE",
//     });

//     const data = await response.json();

//     if (data.success) {
//       item.remove();

//       showPopup("Success", data.message, "success");

//       updateCartTotals();

//       if (!document.querySelector(".cart-item")) {
//         location.reload();
//       }
//     } else {
//       showPopup("Error", data.message, "error");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// function updateCartTotals() {
//   let total = 0;

//   document.querySelectorAll(".cart-item").forEach((item) => {
//     const price = parseFloat(
//       item.querySelector(".price").textContent.replace("₹", "")
//     );

//     total += price;
//   });

//   document.querySelector(
//     ".sub-total"
//   ).innerHTML = `<i class="uil uil-rupee-sign"></i>${total.toFixed(2)}`;

//   document.querySelector(
//     ".total"
//   ).innerHTML = `<i class="uil uil-rupee-sign"></i>${total.toFixed(2)}`;
// }

// document.addEventListener("DOMContentLoaded", function () {
//   // initMiniCart();
//   // initQuantity();
// });

// function initMiniCart() {
//   const cartBtn = document.querySelector(".cart-link");
//   const cartPopUp = document.querySelector(".mini-cart-popup");
//   const closeCartBtn = document.querySelector(".close-mini-cart");
//   const overlay = document.querySelector(".overlay");

//   cartBtn.addEventListener("click", (e) => {
//     e.stopPropagation(); // Prevents the click from propagating to the window
//     openCart(cartPopUp, overlay);
//     console.log("cart butn");
//   });

//   closeCartBtn.addEventListener("click", (e) => {
//     closeCart(cartPopUp, overlay);
//   });

//   // Close when clicking outside the mini-cart
//   window.addEventListener("click", (e) => {
//     if (!cartPopUp.contains(e.target) && !cartBtn.contains(e.target)) {
//       closeCart(cartPopUp, overlay);
//     }
//   });
// }

function openCart(cartPopUp, overlay) {
  cartPopUp.classList.add("visible");
  overlay.classList.add("active");
  console.log("cart is open");
  initQuantity();
}
function closeCart(cartPopUp, overlay) {
  cartPopUp.classList.remove("visible");
  overlay.classList.remove("active");
  // console.log("cart is close")
}

async function cancelOrder(orderId) {

  const confirmCancel = confirm("Are you sure you want to cancel this order?");

  if (!confirmCancel) return;

  try {
    const response = await fetch(`/orders/cancel/${orderId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
    
      document.getElementById("text-1").innerText = "Success";
      document.getElementById("text-2").innerText =
        "Order cancelled successfully!";
      document.getElementById("customPopup").style.display = "flex";

   
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      alert(data.message || "Failed to cancel the order.");
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    alert("Something went wrong.");
  }
}

let menuBar = document.querySelector("#menu-bar");
let navbar = document.querySelector(".menu");
let header = document.querySelector(".header-2");

menuBar.addEventListener("click", () => {
  menuBar.classList.toggle("fa-times");
  navbar.classList.toggle("active");
});

document.querySelectorAll(".nav-item").forEach((n) =>
  n.addEventListener("click", () => {
    menuBar.classList.remove("fa-times");
    navbar.classList.remove("active");
    n.classList.remove("active-1");
  })
);

async function sendFeedback(event) {
  event.preventDefault(); 

  const messageInput = document.getElementById('feedback-message');
  const message = messageInput.value;

  try {
      const response = await fetch('/feedback', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
         
          body: JSON.stringify({ message: message }) 
      });

      const data = await response.json();

      if (data.success) {
          alert(data.message);
          messageInput.value = ''; 
      } else {
          alert(data.message); 
      }

  } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong submitting your feedback.");
  }
}