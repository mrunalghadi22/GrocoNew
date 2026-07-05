const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.get("/wishlist", wishlistController.wishlistPage);

router.post("/wishlist/add", wishlistController.addToWishlist);

router.delete(
  "/wishlist/remove/:id",
  wishlistController.removeWishlist
);

router.delete("/wishlist/clear", wishlistController.clearWishlist);

module.exports = router;