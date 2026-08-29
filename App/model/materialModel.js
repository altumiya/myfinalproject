let mongoose = require("mongoose")
let materialSchema = mongoose.Schema(
    { 
        name:{
            type:String,
            required:[true, "Please fill the material name"] ,
            minLength:[2, "Material Name must be of atleast two character"],
            maxLength:[50, "Material Name must be less than of 50 characters"]
        },
       
        order:{
            type:Number,
            required:[true, "Please fill the material order"] ,
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
let materialModel= mongoose.model('material', materialSchema)

module.exports= materialModel