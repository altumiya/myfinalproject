const mongoose = require('mongoose');

const companyprofileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  address: { type: String },
  mapUrl: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  instagram: { type: String },
  youtube: { type: String },
  logoUrl: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('companyprofile', companyprofileSchema);