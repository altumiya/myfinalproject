
let express=require("express")
const materialController = require("../../controllers/admin/materialController")
let materialRoute=express.Router()

//http://localhost:8000/api/admin/material/create
materialRoute.post("/create",materialController.create)

//http://localhost:8000/api/admin/material/view

materialRoute.get("/view",materialController.view)
//http://localhost:8000/api/admin/material/delete
materialRoute.delete("/delete/:id",materialController.delete)

materialRoute.post('/multidelete',materialController.multiDelete)

materialRoute.post('/changestatus',materialController.changeStatus)

//http://localhost:8000/api/admin/material/update

materialRoute.get('/details/:id',materialController.details)


materialRoute.put("/update/:id",materialController.update)

module.exports=materialRoute