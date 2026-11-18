let express=require("express")
const countryController = require("../../controllers/admin/countryController")
let countryRoute=express.Router()

//http://localhost:8000/api/admin/country/create
countryRoute.post("/create",countryController.create)

//http://localhost:8000/api/admin/country/view

countryRoute.get("/view",countryController.view)
//http://localhost:8000/api/admin/country/delete
countryRoute.delete("/delete/:id",countryController.delete)

countryRoute.post('/multidelete',countryController.multiDelete)

countryRoute.post('/changestatus',countryController.changeStatus)

countryRoute.get('/details/:id',countryController.details)


//http://localhost:8000/api/admin/country/update

countryRoute.put("/update/:id",countryController.update)

module.exports=countryRoute 