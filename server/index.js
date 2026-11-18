let express = require("express")
const adminRoutes = require("./App/routes/adminRoutes")
let cors = require("cors")
const path = require("path");
const dbConnection = require("./App/config/dbConnection")
require("dotenv").config()
const webRoutes = require("./App/routes/webRoute")
const adminprofileModel = require("./App/model/adminprofileModel");
let App = express()
const cookieParser = require("cookie-parser");
App.use(cookieParser());
App.use(cors({
  origin: true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}))
App.use(express.json())
const bcrypt = require("bcrypt");

const saltRounds = 10;
App.use("/api/admin", adminRoutes);
App.use("/api/web", webRoutes)
App.use("/api/admin/adminprofile", require("./App/routes/admin/adminprofileRoute")); 
App.use('/api/admin/companyprofile',require('./App/routes/admin/companyprofileRoute'));
//http://localhost:8000/api/admin
App.use("/uploads/category", express.static("uploads/category"))
App.use("/uploads/subcategory", express.static("uploads/subcategory"))
App.use("/uploads/subsubcategory", express.static("uploads/subsubcategory"))
App.use("/uploads/product", express.static("uploads/product"))
App.use("/uploads/testimonial", express.static("uploads/testimonial"))
App.use("/uploads/slider", express.static(path.join(__dirname, "uploads/slider")));
App.use("/uploads/adminprofile", express.static("uploads/adminprofile"))
App.use("/uploads/companyprofile", express.static("uploads/companyprofile"))


App.listen(process.env.PORT, async () => {
       await dbConnection();
       let checkData = await adminprofileModel.findOne(); //Top 1
       const hash = bcrypt.hashSync(process.env.ADMINPASSWORD, saltRounds);
       if (!checkData) {
              await adminModel.insertOne({
                     email: process.env.ADMINEMAIL,
                     password: hash,
              });
       }
       console.log(`Server is running on port ${process.env.PORT}`)
})



//http://localhost:8000