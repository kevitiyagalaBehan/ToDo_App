const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/userAuth");

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password should be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  authController.register
);

router.post("/login", authController.login);

router.get("/user", authMiddleware, authController.getUser);

module.exports = router;
