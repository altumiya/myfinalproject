let express=require("express")
const subcategoryController = require("../../controllers/admin/subcategoryController")
let subcategoryRoute=express.Router()
let multer=require("multer")

let storage =multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"uploads/subcategory")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    }
)

 const upload = multer({ storage }) 



subcategoryRoute.post("/create", upload.single('image'),subcategoryController.create)
subcategoryRoute.get('/view',subcategoryController.view)

subcategoryRoute.delete("/delete/:id",subcategoryController.delete)

subcategoryRoute.post('/multidelete',subcategoryController.multiDelete)

subcategoryRoute.post('/changestatus',subcategoryController.changeStatus)
subcategoryRoute.get("/details/:id", subcategoryController.details); 

subcategoryRoute.post("/update/:id", upload.single("image"), subcategoryController.update); 
subcategoryRoute.get('/parent',subcategoryController.parent)
module.exports=subcategoryRoute 