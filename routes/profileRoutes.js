const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
 const { isLoggedIn } = require('../middleware/authMiddleware');

router.get("/profile", isLoggedIn, profileController.profilePage);

router.get("/profile/personal_info", isLoggedIn, profileController.getPersonalInfo);

router.post('/profile/update',  profileController.updateProfile)


router.get("/profile/manage_address", isLoggedIn, profileController.getAddress);

router.post("/profile/address/add", isLoggedIn, profileController.addAddress);

router.get("/profile/address/get/:id", isLoggedIn, profileController.getSingleAddress);

router.post("/profile/address/update", isLoggedIn, profileController.updateAddress);

// Add this next to your other /profile/api routes
router.delete("/profile/address/delete/:id", isLoggedIn, profileController.deleteAddress);

module.exports = router;