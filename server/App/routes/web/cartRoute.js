let express = require("express");
const cartController = require("../../controllers/web/cartController");
let cartRoutes=express.Router()


cartRoutes.post('/add-to-cart',cartController.addToCart)
cartRoutes.get('/view-cart',cartController.viewCart)
cartRoutes.delete('/delete-cart/:cartId',cartController.deleteCart)
cartRoutes.put('/update-qty/:cartId', cartController.updateQty);

module.exports=cartRoutes