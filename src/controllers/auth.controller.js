const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const userAlreadyExists = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ message: "User with this email or name already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token, // এই টোকেনটি ফ্রন্টএন্ডে অটো-লগইন করতে সাহায্য করবে
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    if ((!email && !password) || (!name && !password)) {
      return res
        .status(400)
        .json({ message: "Email or name and password are required" });
    }

    const user = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      token: token, // এটিই ফ্রন্টএন্ড পাবে
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // রোলও পাঠানো হচ্ছে যাতে ফ্রন্টএন্ডে ইউজার বা অ্যাডমিন চেক করা যায়
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout user
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
