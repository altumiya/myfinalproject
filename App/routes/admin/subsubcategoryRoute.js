let express=require("express")
const subsubcategoryController = require("../../controllers/admin/subsubcategoryController")
let subsubcategoryRoute=express.Router()
let multer=require("multer")

let storage =multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"uploads/subsubcategory")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    }
)

 const upload = multer({ storage }) 



subsubcategoryRoute.post("/create", upload.single('image'),subsubcategoryController.create)
subsubcategoryRoute.get('/view',subsubcategoryController.view)

subsubcategoryRoute.delete("/delete/:id",subsubcategoryController.delete)

subsubcategoryRoute.post('/multidelete',subsubcategoryController.multiDelete)

subsubcategoryRoute.post('/changestatus',subsubcategoryController.changeStatus)
subsubcategoryRoute.get("/details/:id", subsubcategoryController.details); 

subsubcategoryRoute.put("/update/:id", upload.single("image"), subsubcategoryController.update); 
subsubcategoryRoute.get('/parent',subsubcategoryController.parent)
subsubcategoryRoute.get('/subcategory/:parentID',subsubcategoryController.subcategory)

module.exports=subsubcategoryRoute 