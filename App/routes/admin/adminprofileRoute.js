let express = require("express");
const adminprofileController = require("../../controllers/admin/adminprofileController"); // Adjust path if needed
let adminprofileRoute = express.Router();
const adminAuth = require("../../middleware/adminAuth");
let multer = require("multer");

let storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, "uploads/adminprofile");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        }
    }
);

const upload = multer({ storage }); 

adminprofileRoute.get('/view', adminprofileController.view);

// Used POST instead of PUT to match your category update style
adminprofileRoute.post("/update", adminAuth, upload.single('logo'), adminprofileController.update);

adminprofileRoute.post('/update-password', adminAuth, adminprofileController.updatePassword);

adminprofileRoute.post("/login", adminprofileController.login);
adminprofileRoute.post("/logout", adminprofileController.logout);

module.exports = adminprofileRoute;