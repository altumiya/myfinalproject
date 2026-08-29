const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    // Looks specifically for the admin_token cookie
    console.log("Incoming Cookies:", req.cookies);
    const token = req.cookies.admin_token;

    if (!token) {
      return res.status(401).json({ status: false, message: "Unauthorized: No token provided" });
    }

    // FIX: Added quotes around "TOKENKEY"
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "TOKENKEY");
    req.adminId = decoded.adminId;

    next(); 
  } catch (error) {
    console.log("❌ JWT Error:", error.message);
    return res.status(401).json({ status: false, message: "Unauthorized: Invalid token" });
  }
};

module.exports = adminAuth;