import { Song } from '../model/song.model.js';
import { Playlist } from '../model/playlist.model.js';

export const getRandomSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([{ $sample: { size: 10 } }]);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching songs.' });
    }
};

export const getRandomPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.aggregate([{ $sample: { size: 10 } }]);
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching playlists.' });
    }
};

// NEW: Function to search for songs by title or artist
export const searchSongs = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json({ songs: [], playlists: [] });
    }

    try {
        const searchQuery = new RegExp(q, 'i');

        // Perform searches for both collections in parallel
        const [songs, playlists] = await Promise.all([
            Song.find({
                $or: [{ title: searchQuery }, { artist: searchQuery }]
            }).limit(10),
            Playlist.find({ name: searchQuery }).limit(5)
        ]);

        res.json({ songs, playlists });
    } catch (error) {
        res.status(500).json({ message: 'Server error during search.' });
    }
};