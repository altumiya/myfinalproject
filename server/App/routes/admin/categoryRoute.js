let express=require("express")
const categoryController = require("../../controllers/admin/categoryController")
let categoryRoute=express.Router()
let multer=require("multer")

let storage =multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"uploads/category")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    }
)

 const upload = multer({ storage }) 



categoryRoute.post("/create", upload.single('image'),categoryController.create)
categoryRoute.get('/view',categoryController.view)

categoryRoute.delete("/delete/:id",categoryController.delete)

categoryRoute.post('/multidelete',categoryController.multiDelete)

categoryRoute.post('/changestatus',categoryController.changeStatus)
categoryRoute.get("/details/:id", categoryController.details); 

categoryRoute.post("/update/:id", upload.single("image"), categoryController.update); 

module.exports=categoryRoute 