const jwt = require("jsonwebtoken");

// ১. এই ফাংশনটি শুধু ডাটা রিটার্ন করবে অথবা null রিটার্ন করবে
const _tokenVerify = (req) => {
  // আপনি যদি টোকেন হেডার থেকে পাঠান (Bearer token), তবে নিচের লাইনটি ব্যবহার করুন:
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const authAdmin = (req, res, next) => {
  const decoded = _tokenVerify(req);

  // যদি টোকেন না থাকে বা ইনভ্যালিড হয়
  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized or Invalid Token" });
  }

  // রোল চেক
  if (decoded.role !== "admin") {
    return res
      .status(403)
      .json({
        success: false,
        message: "Only admins can access this resource",
      });
  }

  req.user = decoded;
  next(); // রেসপন্স পাঠানো হয়নি, তাই পরের ফাংশনে যাওয়া নিরাপদ
};

const authUser = (req, res, next) => {
  const decoded = _tokenVerify(req);

  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized or Invalid Token" });
  }

  // এখানে আপনি 'admin' কেউ পারমিশন দিতে পারেন অথবা শুধু 'user'
  if (decoded.role !== "user" && decoded.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Only users can access this resource" });
  }

  req.user = decoded;
  next();
};

module.exports = {
  authAdmin,
  authUser,
};
