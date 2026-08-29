const mongoose = require('mongoose');

const contactenquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active', // Can be 'Active' or 'Inactive'
        enum: ['Active', 'Inactive']
    }
}, { timestamps: true });

module.exports = mongoose.model('Contactenquiry', contactenquirySchema);