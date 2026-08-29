let express = require("express");
const homeController = require("../../controllers/web/homeController");
let homeRoutes=express.Router()


homeRoutes.get('/slider',homeController.slider)
homeRoutes.get('/testimonial',homeController.testimonial)
homeRoutes.get('/product',homeController.homeProduct)

module.exports={homeRoutes}