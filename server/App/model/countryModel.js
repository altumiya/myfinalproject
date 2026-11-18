let mongoose = require("mongoose")
let countrySchema = mongoose.Schema(
    { 
        name:{
            type:String,
            required:[true, "Please fill the country name"] ,
            minLength:[2, "country Name must be of atleast two character"],
            maxLength:[50, "country Name must be less than of 50 characters"]
        },
         order:{
            type:Number,
            required:[true, "Please fill the country order"] ,
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
let countryModel= mongoose.model('country', countrySchema)

module.exports= countryModel