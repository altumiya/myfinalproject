let express = require("express");
const authController = require("../../controllers/web/authController");
const multer = require("multer");
let userRoutes = express.Router();

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/user");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });
userRoutes.post("/register", authController.register);
userRoutes.post("/login", authController.login);
userRoutes.post("/forgot-password", authController.forgotPassword);
///After Login
userRoutes.post("/reset-password/:token", authController.resetPassword);
userRoutes.post("/change-password", authController.changePassword);
userRoutes.get("/view", authController.viewUsers);
userRoutes.post(
  "/update-profile",
  upload.single("image"),
  authController.updateProfile,
);

module.exports = { userRoutes };