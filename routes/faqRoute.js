const express = require("express");
const router = express.Router();

const { getFAQs, createFAQ } = require("../controllers/faq.controller");

// middleware for authentication so that only admin can create FAQ
const {auth} = require("../middlewares/auth");

router.get("/faqs", getFAQs);
router.post("/faqs",auth, createFAQ);

module.exports = router;