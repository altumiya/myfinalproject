const adminprofileModel = require("../../model/adminprofileModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let adminprofileController = {
  view: async (req, res) => {
    try {
      let data = await adminprofileModel.findOne().select("-password");
      if (!data) return res.status(404).json({ status: false, message: "No admin found" });

      res.send({
        status: true,
        path: process.env.ADMINSTATICPATH || "http://localhost:8000/uploads/adminprofile/", 
        data,
        message: "Admin Profile Found",
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  update: async (req, res) => {
    let updateObj = { ...req.body };
    if (req.file && req.file.filename) {
      updateObj.logo = req.file.filename;
    }

    try {
      let admin = await adminprofileModel.findOne(); 
      if (!admin) return res.status(404).json({ status: false, message: "Admin not found" });

      let updateRes = await adminprofileModel.updateOne(
        { _id: admin._id },
        { $set: updateObj }
      );

      res.status(200).json({ status: true, message: "Profile Updated Successfully", updateRes });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  updatePassword: async (req, res) => {
    let { current, newPassword } = req.body;

    try {
      let adminData = await adminprofileModel.findOne(); 
      if (!adminData) return res.status(404).json({ status: false, message: "Admin not found" });

      let isMatch = await bcrypt.compare(current, adminData.password);
      if (!isMatch && adminData.password === current) isMatch = true; // plain-text fallback

      if (!isMatch) return res.status(400).json({ status: false, message: "Incorrect current password" });

      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(newPassword, salt);

      await adminprofileModel.updateOne(
        { _id: adminData._id },
        { $set: { password: hashedPassword } }
      );

      res.status(200).json({ status: true, message: "Password Updated Successfully" });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
  
  login: async (req, res) => {
    let { email, password } = req.body;
    
    try {
      let admin = await adminprofileModel.findOne({ email });
      
      if (!admin) {
        return res.status(401).json({ status: false, message: "Invalid credentials (Email not found)" });
      }

      let isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch && admin.password === password) isMatch = true;

      if (!isMatch) {
        return res.status(401).json({ status: false, message: "Invalid credentials (Wrong password)" });
      }

      const token = jwt.sign(
        { adminId: admin._id }, 
        process.env.JWT_SECRET || "TOKENKEY", 
        { expiresIn: "1d" }
      );

      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: false, // Must be false for HTTP
        sameSite: "lax", // Allows ports 5173 and 8000 to share cookies
        maxAge: 24 * 60 * 60 * 1000 // 1 Day
      });

      return res.status(200).json({ status: true, message: "Login successful" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  logout: async (req, res) => {
    res.clearCookie("admin_token");
    res.status(200).json({ status: true, message: "Logged out successfully" });
  }
};

module.exports = adminprofileController;