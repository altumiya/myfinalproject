let express = require("express");
const { adminorderController } = require("../../controllers/admin/adminorderController");
let orderRoute = express.Router();

// Fetch all orders
orderRoute.get('/view', adminorderController.viewOrders);

// Update single order status (dropdown)
orderRoute.post('/update-status', adminorderController.updateStatus);

// Bulk delete orders (checkboxes)
orderRoute.post('/multiDelete', adminorderController.multiDelete);

module.exports = orderRoute;