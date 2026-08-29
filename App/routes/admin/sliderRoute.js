let express=require("express")
const sliderController = require("../../controllers/admin/sliderController")
let sliderRoute=express.Router()
let multer=require("multer")

let storage =multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"uploads/slider")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    }
)

 const upload = multer({ storage }) 



sliderRoute.post("/create", upload.single('image'),sliderController.create)
sliderRoute.get('/view',sliderController.view)

sliderRoute.delete("/delete/:id",sliderController.delete)

sliderRoute.post('/multidelete',sliderController.multiDelete)

sliderRoute.post('/changestatus',sliderController.changeStatus)
sliderRoute.get("/details/:id", sliderController.details); 

sliderRoute.post("/update/:id", upload.single("image"), sliderController.update); 

module.exports=sliderRoute 