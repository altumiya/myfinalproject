const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxLength: [100, 'Name cannot exceed 100 characters']
        },
        designation: {
            type: String,
            required: [true, 'Designation/Role is required'],
            trim: true,
            maxLength: [100, 'Designation cannot exceed 100 characters']
        },
        message: {
            type: String,
            required: [true, 'Testimonial message is required'],
            trim: true,
            maxLength: [1000, 'Message cannot exceed 1000 characters']
        },
        rating: {
            type: Number,
            required: true,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot be more than 5'],
        },
        order: {
            type: Number,
            required: [true, "Please Fill slider Order"],
        },
        image: String,
        slug: String,
        status: {
            type: Boolean,
            default: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },

);

const testimonialModel = mongoose.model('testimonial', testimonialSchema);

module.exports = testimonialModel;