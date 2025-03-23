const mongoose = require('mongoose');

// Define the schema for Car
const carSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    transmission: {
        type: String,
        required: true,
        enum: ['Automatic', 'Manual', 'CVT', 'Dual-Clutch', 'Other']
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String,
        trim: true
    },
    // OpenVerse API specific fields
    openVerseId: {
        type: String
    },
    features: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create the Car model
const Car = mongoose.model('Car', carSchema);

module.exports = { Car };