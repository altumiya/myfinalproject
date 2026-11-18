let express=require("express")
const testimonialController = require("../../controllers/admin/testimonialController")
let testimonialRoute=express.Router()
let multer=require("multer")

let storage =multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"uploads/testimonial")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    }
)

 const upload = multer({ storage }) 



testimonialRoute.post("/create", upload.single('image'),testimonialController.create)
testimonialRoute.get('/view',testimonialController.view)

testimonialRoute.delete("/delete/:id",testimonialController.delete)

testimonialRoute.post('/multiDelete',testimonialController.multiDelete)

testimonialRoute.post('/changeStatus',testimonialController.changeStatus)
testimonialRoute.get("/details/:id", testimonialController.details); 

testimonialRoute.post("/update/:id", upload.single("image"), testimonialController.update); 

module.exports=testimonialRoute 