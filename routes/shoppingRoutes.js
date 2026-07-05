const express = require("express");
const router = express.Router();
const shoppingController = require("../controllers/shoppingController");

router.get("/shopping", shoppingController.shoppingPage);

module.exports = router;