let express = require("express");
const { orderController } = require("../../controllers/web/orderConroller");
let orderRoute=express.Router()


orderRoute.post('/save-order',orderController.save)

orderRoute.post('/verify-order',orderController.orderVerfiy)

orderRoute.get('/user-orders', orderController.viewOrders)

module.exports={orderRoute}
