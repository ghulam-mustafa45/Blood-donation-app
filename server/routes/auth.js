const express = require("express");
const router = express.Router();
const {home,register}=require("../controllers/authController")


router.get("/", home);

router.get("/register", register);

  module.exports = router;