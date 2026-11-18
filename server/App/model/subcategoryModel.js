let mongoose=require("mongoose")
let subcategorySchema=mongoose.Schema(
    {
        name:{
            type:String,
            
            required:[true,"Please Fill subcategory Name"],
            minLength:[2,"subcategory Name Must Be Atleast 2 Character"],
            maxLength:[100,"subcategory Name Must Be Atmost 100 Character"]
        },
        parent:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"category"
        },
       image:String, 
       slug:String,
        order:{
            type:Number,
            required:[true,"Please Fill subcategory Order"],  
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

let subcategoryModel=mongoose.model("subcategory",subcategorySchema)
module.exports=subcategoryModel