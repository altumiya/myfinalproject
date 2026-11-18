
let express=require("express")
const colorController = require("../../controllers/admin/colorController")
let colorRoute=express.Router()

//http://localhost:8000/api/admin/color/create
colorRoute.post("/create",colorController.create)

//http://localhost:8000/api/admin/color/view

colorRoute.get("/view",colorController.view)
//http://localhost:8000/api/admin/color/delete
colorRoute.delete("/delete/:id",colorController.delete)

colorRoute.post('/multidelete',colorController.multiDelete)

colorRoute.post('/changestatus',colorController.changeStatus)

colorRoute.get('/details/:id',colorController.details)

//http://localhost:8000/api/admin/color/update

colorRoute.put("/update/:id",colorController.update)

module.exports=colorRoute 