let express=require("express")
const productController = require("../../controllers/admin/productController")
const multer = require("multer")
let productRoute=express.Router()

let storage =multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"uploads/product")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    }
)

 const upload = multer({ storage }) 

 productRoute.post(
    '/create',  
    upload.fields(
        [
            {
                name: 'image',
                maxCount: 1
            },
            {
                name: 'backImage',
                maxCount: 1
            },
            {
                name: 'gallery',
                maxCount: 20
            }
        ]
    )
    
    
    , 
    productController.create)
    productRoute.post(
    '/update/:id',  
    upload.fields(
        [
            { name: 'image', maxCount: 1 },
            { name: 'backImage', maxCount: 1 },
            { name: 'gallery', maxCount: 20 }
        ]
    ), 
    productController.update
)


 productRoute.get('/view',productController.view)
 productRoute.get('/details/:id',productController.details)

 productRoute.get('/parent',productController.parent)
 productRoute.get('/subcategory/:parentId',productController.subCategory)
 productRoute.get('/subsubcategory/:parentId',productController.subsubCategory)
 productRoute.get('/color', productController.color)
 productRoute.get('/material', productController.material)
 productRoute.delete("/delete/:id",productController.delete)
productRoute.post('/multidelete',productController.multiDelete)

productRoute.post('/changestatus',productController.changeStatus)
 module.exports=productRoute