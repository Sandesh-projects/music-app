// backend/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
    }],
    likedSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song', // Reference to the Song model
    }],
    profilePicture: {
        type: String, // URL to the profile picture
        required: false,
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Mongoose middleware to hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare candidate password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


export const User = mongoose.model('User', userSchema);