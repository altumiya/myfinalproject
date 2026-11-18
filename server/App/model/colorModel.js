let mongoose = require("mongoose")
let colorSchema = mongoose.Schema(
    { 
        name:{
            type:String,
            required:[true, "Please fill the color name"] ,
            minLength:[2, "Color Name must be of atleast two character"],
            maxLength:[50, "Color Name must be less than of 50 characters"]
        },
        code:{
            type:String,
            required:[true, "Please fill the color code"] ,
            minLength:[2, "Color Name must be of atleast two character"],
            maxLength:[50, "Color Name must be less than of 50 characters"]
        },
        order:{
            type:Number,
            required:[true, "Please fill the color order"] ,
            unique:[true, "Color order must be unique"],
            min:[1, "Color order must be greater than 0"],
            max:[100, "Color order must be less than 100"]
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
let colorModel= mongoose.model('color', colorSchema)

module.exports= colorModel