const express = require("express");
const productController = require("../../controllers/admin/productController"); 

const webProductRoutes = express.Router();

webProductRoutes.get("/details/:id", productController.details);

module.exports = webProductRoutes;