let mongoose=require("mongoose")
let categorySchema=mongoose.Schema(
    {
        name:{
            type:String,
            
            required:[true,"Please Fill category Name"],
            minLength:[2,"category Name Must Be Atleast 2 Character"],
            maxLength:[100,"category Name Must Be Atmost 100 Character"]
        },
       image:String, 
       slug:String,
        order:{
            type:Number,
            required:[true,"Please Fill category Order"],  
        },
        status:{
            type:Boolean,
            default:true
        },
        date:{
            type:Date,
            default:Date.now
        }
    }
)

let categoryModel=mongoose.model("category",categorySchema)
module.exports=categoryModel