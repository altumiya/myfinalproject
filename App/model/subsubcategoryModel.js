let mongoose=require("mongoose")
let subsubcategorySchema=mongoose.Schema(
    {
        name:{  
            type:String,
            required:[true,"Please Fill subCategory Name"],
            minLength:[2,"subsubCategory Name Must Be Atleast 2 Character"],
            maxLength:[100,"subsubCategory Name Must Be Atmost 100 Character"]
        },
        parent:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"category"
        },
        subcategory:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"subcategory"
        },
       image:String, 
       slug:String,
        order:{
            type:Number,
            required:[true,"Please Fill subsubCategory Order"],  
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

let subsubcategoryModel=mongoose.model("subsubcategory",subsubcategorySchema)
module.exports=subsubcategoryModel