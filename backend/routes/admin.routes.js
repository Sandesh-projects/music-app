import express from 'express';
import { addSong, createPlaylist, addSongToPlaylist, getPlaylistById, deletePlaylist, deleteSong, removeSongFromPlaylist } from '../controller/admin.controller.js';
import { verifyToken, isAdmin } from '../middleware/user.middleware.js';
import { Song } from '../model/song.model.js';
import { Playlist } from '../model/playlist.model.js';

const router = express.Router();
router.get('/playlist/:id', getPlaylistById);




// GET all songs for the admin dashboard
router.get('/songs/all', async (req, res) => {
    try {
        const songs = await Song.find({}); // Use find() to get ALL songs
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching songs" });
    }
});

// GET all playlists for the admin dashboard
router.get('/playlists/all', async (req, res) => {
    try {
        const playlists = await Playlist.find({}); // Use find() to get ALL playlists
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching playlists" });
    }
});

// Apply middleware to ALL routes in this file
router.use(verifyToken, isAdmin);

// --- All other routes (POST, PATCH, DELETE) remain the same ---
router.post('/song', addSong);
router.post('/playlist', createPlaylist);
router.patch('/playlist/add-song', addSongToPlaylist);
router.delete('/playlist/:id', deletePlaylist);
router.delete('/song/:id', deleteSong);
router.patch('/playlist/remove-song', removeSongFromPlaylist);

export default router;
