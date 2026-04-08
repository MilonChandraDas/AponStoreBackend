const productModel = require("../models/product.model");
const uploadImage = require("../services/storage.service");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");


// Add Product
const addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const file = req.file;

  if (!name || !description || !price || !stock || !file) {
    return res.status(400).json({
      success: false,
      message:
        "All fields are required: name, description, price, stock, category, image",
    });
  }

  try {
    const fileBase64 = file.buffer.toString("base64");
    const result = await uploadImage(fileBase64);

    const product = await productModel.create({
      ...req.body,
      image: result.url,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
      },
    });
  } catch (error) {
    console.error("addProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add product",
      error: error.message,
    });
  }
};


// Add to Cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: userId, productId, quantity",
    });
  }

  try {
    let cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await cartModel.create({
        user: userId,
        products: [
          {
            product: productId,
            quantity: quantity,
          },
        ],
      });
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity,
      });
    }
    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: cart,
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
      error: error.message,
    });
  }
};


// Order Placement
const placeOrder = async (req, res) => {
  const { userId, cartId } = req.body;

  if (!userId || !cartId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: userId, cartId",
    });
  }

  try {
    const order = await orderModel.create({
      user: userId,
      cartId: cartId,
    });
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: order,
    });
  } catch (error) {
    console.error("placeOrder error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to place order",
      error: error.message,
    });
  }
};



const allProducts = async (req, res) => {
  try {
    // ডাটাবেস থেকে সব প্রোডাক্ট খুঁজে বের করা
    // .sort({ createdAt: -1 }) দেওয়া হয়েছে যাতে নতুন প্রোডাক্টগুলো আগে দেখায়
    const products = await productModel.find({}).sort({ createdAt: -1 });

    // যদি কোনো প্রোডাক্ট না থাকে
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    // সফলভাবে ডাটা পাঠানো
    res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  } catch (error) {
    console.error("Error in allProducts controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



module.exports = {
  addProduct,
  addToCart,
  placeOrder,
  allProducts,
};
