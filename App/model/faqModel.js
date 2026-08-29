let mongoose = require("mongoose")
let faqSchema = mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Please fill the faq question"],
            minLength: [2, "faq Name must be of atleast two character"],
            maxLength: [1500, "faq Name must be less than of 50 characters"]
        },
        answer: {
            type:String,
            required: [true, "Please fill the faq answer"],
            minLength: [2, "faq Name must be of atleast two character"],
            maxLength: [10000, "faq Name must be less than of 50 characters"]
        },
        order: {
            type:Number,
            required: [true, "Please fill the faq order"]
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
let faqModel = mongoose.model('faq', faqSchema)
module.exports = faqModel