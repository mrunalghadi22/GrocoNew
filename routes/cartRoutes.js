const express=require("express");
const router=express.Router();

const cartController=require("../controllers/cartController");

router.get("/cart", cartController.cartPage);

router.post("/cart/add", cartController.addToCart);

router.patch("/cart/update", cartController.updateCart);

router.delete("/cart/remove/:id", cartController.removeCart);

router.delete("/cart/clear", cartController.clearCart);

router.get("/cart/mini", cartController.getMiniCart);

module.exports=router;