import express from 'express';
import { getRandomSongs, getRandomPlaylists, searchSongs } from '../controller/music.controller.js';

const router = express.Router();

router.get('/songs/random', getRandomSongs);
router.get('/playlists/random', getRandomPlaylists);

// NEW: Route for handling song searches
router.get('/search', searchSongs);

export default router;