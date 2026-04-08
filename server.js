require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.route");
const productRoutes = require("./src/routes/product.route");

connectDB();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});