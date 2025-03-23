const mongoose = require('mongoose');

// Define the schema for User
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        // Not required because OAuth users won't have a password
    },
    oauth: {
        googleId: {
            type: String,
            sparse: true // Allows null values but maintains uniqueness for non-null values
        }
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
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

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = { User };