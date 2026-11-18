// models/adminModel.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String, 
    password: String,
    logo: String,   
    companyName: String,
    officalEmail: String,
    addRess: String,
    mapUrl: String
});

const adminprofileModel = mongoose.model("admin", adminSchema);
module.exports = adminprofileModel;