let mongoose=require("mongoose")
let cartSchema=mongoose.Schema(
    {
       userID:{
                  type:mongoose.Schema.Types.ObjectId, //6a47d875d2f3d1743d081cd6
                  ref:"user"
       },
       productId:String,
       productName:String,
       productPrice:Number,
       productImage:String,
       qty:Number,
       productCategory:String
    }
)

let cartModel=mongoose.model("cart",cartSchema)
module.exports=cartModel