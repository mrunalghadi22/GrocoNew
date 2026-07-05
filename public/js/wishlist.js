function initWishlistActions() {
  const clearWishlistBtn = document.querySelector(".clear-wishlist");

  clearWishlistBtn.addEventListener("click", () => {
    clearWishlist();
  });

  
}

async function clearWishlist() {
  try {
    const response = await fetch("/wishlist/clear", {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      showPopup("Success", data.message, "success");

      // Refresh page or remove all wishlist items from the DOM
      location.reload();
    } else {
      showPopup("Error", data.message, "error");
    }
  } catch (err) {
    console.log(err);
  }
}


async function removeFromWishlist(item) {
  const productId = item
    .closest("tr")
    .querySelector(".prod-name span")
    .getAttribute("data-id");

  // console.log(productId);

  try {
    const response = await fetch(`/wishlist/remove/${productId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {

      item.closest("tr").remove();

      showPopup("Success", "Product removed from wishlist", "success");

      // if (document.querySelectorAll(".wishlist-table tbody tr").length === 0) {
      //   location.reload();
      // }
    } else {
      showPopup("Error", "Unable to remove product", "error");
    }
  } catch (err) {
    console.error(err);
    showPopup("Error", "Something went wrong", "error");
  }
}



initWishlistActions();


