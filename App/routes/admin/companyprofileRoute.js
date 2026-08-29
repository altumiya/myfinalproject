let express = require("express");
const companyprofileController = require("../../controllers/admin/companyprofileController"); 
let companyprofileRoute = express.Router();
const adminAuth = require("../../middleware/adminAuth");
let multer = require("multer");

// Configure Multer storage directly in the route file
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Matches your static path: App.use("/uploads/companyprofile", ...)
        cb(null, "uploads/companyprofile"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// View Company Profile 
// (Assuming public access so the website can fetch it, if admin-only, add adminAuth)
companyprofileRoute.get('/view', companyprofileController.view);

// Update Company Profile (Uploads to 'logo' field)
companyprofileRoute.post("/update", adminAuth, upload.single('logo'), companyprofileController.update);

module.exports = companyprofileRoute;