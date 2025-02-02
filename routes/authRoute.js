const express = require("express");
const router = express.Router();

const {
    login,
    signUp,
    sendOTP,
  } = require("../controllers/auth");


// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP);

module.exports = router;

