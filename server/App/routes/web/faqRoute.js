// routes/website/faqRoute.js
const express = require("express");
const websiteFaqController = require("../../controllers/web/faqcontroller");
const faqRoute = express.Router();

// http://localhost:8000/api/website/faq/view
faqRoute.get("/view", websiteFaqController.viewActive);

module.exports = faqRoute;
