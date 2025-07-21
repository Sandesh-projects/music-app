import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: String,
        required: true,
        trim: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    coverArt: {
        type: String,
        required: false, // You can add a URL to a cover image
    },
    duration: {
        type: String,
        required: false,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export const Song = mongoose.model('Song', songSchema);