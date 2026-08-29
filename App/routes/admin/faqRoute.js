
let express=require("express")
const faqController = require("../../controllers/admin/faqController")
let faqRoute=express.Router()

//http://localhost:8000/api/admin/faq/create
faqRoute.post("/create",faqController.create)

//http://localhost:8000/api/admin/faq/view

faqRoute.get("/view",faqController.view)
//http://localhost:8000/api/admin/faq/delete
faqRoute.delete("/delete/:id",faqController.delete)

faqRoute.post('/multidelete',faqController.multiDelete)

faqRoute.post('/changestatus',faqController.changeStatus)

faqRoute.get('/details/:id',faqController.details)


//http://localhost:8000/api/admin/faq/update

faqRoute.put("/update/:id",faqController.update)

module.exports=faqRoute 