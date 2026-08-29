let mongoose = require("mongoose")
let sliderSchema = mongoose.Schema(
    {
        name: {
            type: String,

            required: [true, "Please Fill slider Name"],
            minLength: [2, "slider Name Must Be Atleast 2 Character"],
            maxLength: [100, "slider Name Must Be Atmost 100 Character"]
        },
        image: String,
        slug: String,

        order: {
            type: Number,
            required: [true, "Please Fill slider Order"],
        },
        status: {
            type: Boolean,
            default: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
)

let sliderModel = mongoose.model("slider", sliderSchema)
module.exports = sliderModel