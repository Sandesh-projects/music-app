import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }],
    coverArt: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export const Playlist = mongoose.model('Playlist', playlistSchema);