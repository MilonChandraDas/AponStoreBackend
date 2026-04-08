const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors(),
);

// একটি টেস্ট রুট (Vercel-এ চেক করার জন্য)
app.get("/", (req, res) => {
  res.send("Server is running on Vercel!");
});

// আপনার রাউটগুলো এখানে হবে...
// app.use("/api/product", productRoutes);

module.exports = app; // Vercel-এ ডিপ্লয় করলে server.listen এর চেয়ে এটি বেশি গুরুত্বপূর্ণ
