const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/register', authController.registerUser,); // api/auth/register
router.post('/login', authController.loginUser); // api/auth/login
router.post('/logout', authController.logoutUser); // api/auth/logout

module.exports = router;