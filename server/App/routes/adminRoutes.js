let express=require("express")
const colorRoute = require("./admin/colorRoute")
const materialRoute = require("./admin/materialRoute")
const countryRoute = require("./admin/countryRoute")
const faqRoute = require("./admin/faqRoute")
const categoryRoute = require("./admin/categoryRoute") 
const subcategoryRoute = require("./admin/subcategoryRoute") 
const sliderRoute = require("./admin/sliderRoute")
const subsubcategoryRoute = require("./admin/subsubcategoryRoute")
const productRoute = require("./admin/productRoute")
const testimonialRoute = require("./admin/testimonialRoute")
const adminprofileRoute = require("./admin/adminprofileRoute")
const companyprofileRoute = require("./admin/companyprofileRoute")
const adminorderRoutes = require("./admin/adminorderRoutes")
const contactenquiryRoute = require("./admin/contactenquiryRoute")
let adminRoutes=express.Router()

adminRoutes.use("/color",colorRoute)

//http://localhost:8000/api/admin/color


adminRoutes.use("/material",materialRoute)

adminRoutes.use("/country",countryRoute)

adminRoutes.use("/faq",faqRoute)

adminRoutes.use("/category",categoryRoute)

adminRoutes.use("/subcategory",subcategoryRoute)

adminRoutes.use("/subsubcategory",subsubcategoryRoute)

adminRoutes.use("/product",productRoute)

adminRoutes.use("/slider",sliderRoute)

adminRoutes.use("/testimonial",testimonialRoute)

adminRoutes.use("/adminprofile",adminprofileRoute); 

adminRoutes.use("/companyprofile",companyprofileRoute);

adminRoutes.use("/order",adminorderRoutes);

adminRoutes.use("/contactenquiry",contactenquiryRoute);
module.exports=adminRoutes