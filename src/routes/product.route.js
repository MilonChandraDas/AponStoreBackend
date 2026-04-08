const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/add-product",
  authMiddleware.authAdmin,
  upload.single("image"),
  productController.addProduct,
);

router.post('/add-to-cart', authMiddleware.authUser, productController.addToCart);

router.post('/place-order', authMiddleware.authUser, productController.placeOrder);

router.get("/all-products", productController.allProducts);

module.exports = router;
