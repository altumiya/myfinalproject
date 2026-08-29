let express = require("express");
const wishlistController = require("../../controllers/web/wishlistController");
let wishlistRoutes = express.Router();

wishlistRoutes.post('/toggle', wishlistController.toggleWishlist);
wishlistRoutes.get('/view', wishlistController.viewWishlist);

module.exports = wishlistRoutes;