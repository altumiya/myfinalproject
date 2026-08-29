let express=require("express")
const  {userRoutes}  = require("./web/authRoute")
const  {homeRoutes}  = require("./web/homeRouter")
const  cartRoutes  = require("./web/cartRoute")
const wishlistRoutes = require("./web/wishlistRoute")
const webProductRoutes = require("./web/webProductRoute");
const { orderRoute } = require("./web/orderRoute")
const faqRoutes = require("./web/faqRoute");

let webRoutes=express.Router()

webRoutes.use('/auth',userRoutes)
webRoutes.use('/home',homeRoutes)
webRoutes.use('/cart',cartRoutes)
webRoutes.use('/wishlist',wishlistRoutes)
webRoutes.use('/product', webProductRoutes);
webRoutes.use('/order',orderRoute)
webRoutes.use('/faq', faqRoutes)
module.exports=webRoutes
