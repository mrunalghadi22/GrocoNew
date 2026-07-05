const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const feedbackController = require('../controllers/feedbackController');

router.get("/", homeController.homePage);

router.post('/feedback', feedbackController.submitFeedback);

module.exports = router;