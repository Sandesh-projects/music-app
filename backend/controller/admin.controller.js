import { Song } from '../model/song.model.js';
import { Playlist } from '../model/playlist.model.js';
import { downloadFromYoutube } from '../utils/ytDownloader.js';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Recreate __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Add a new song from a YouTube URL
export const addSong = async (req, res) => {
    const { youtubeUrl, title, artist, coverArt } = req.body;
    if (!youtubeUrl || !title || !artist) {
        return res.status(400).json({ message: 'Missing required fields: youtubeUrl, title, artist.' });
    }

    try {
        const uniqueFilename = `${title.replace(/\s+/g, '-')}-${uuidv4()}`;
        const filePath = await downloadFromYoutube(youtubeUrl, uniqueFilename);

        const newSong = new Song({
            title,
            artist,
            filePath,
            coverArt: coverArt || '',
            addedBy: req.userId,
        });

        await newSong.save();
        res.status(201).json({ message: 'Song added successfully', song: newSong });
    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({ message: 'Server error while adding song.' });
    }
};

// Create a new playlist
export const createPlaylist = async (req, res) => {
    const { name, description, coverArt } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Playlist name is required.' });
    }

    try {
        const playlist = new Playlist({
            name,
            description: description || '',
            coverArt: coverArt || '',
            createdBy: req.userId,
        });

        await playlist.save();
        res.status(201).json({ message: 'Playlist created successfully', playlist });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: 'Server error while creating playlist.' });
    }
};

// Add a song to an existing playlist
export const addSongToPlaylist = async (req, res) => {
    const { playlistId, songId } = req.body;
    if (!playlistId || !songId) {
        return res.status(400).json({ message: 'Playlist ID and Song ID are required.' });
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        const song = await Song.findById(songId);
        if (!playlist || !song) {
            return res.status(404).json({ message: 'Playlist or Song not found.' });
        }
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: 'Song already in this playlist.' });
        }

        playlist.songs.push(songId);
        await playlist.save();
        res.status(200).json({ message: 'Song added to playlist', playlist });
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).json({ message: 'Server error while adding song to playlist.' });
    }
};

// Get a playlist by ID (with populated songs)
export const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json(playlist);
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({ message: 'Server error while fetching playlist.' });
    }
};

// Delete a playlist by ID
export const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }
        await playlist.deleteOne();
        res.status(200).json({ message: 'Playlist deleted successfully.' });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ message: 'Server error while deleting playlist.' });
    }
};

// Delete a song (from filesystem, playlists, and DB)
export const deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found.' });
        }

        // 1. Delete the actual file
        if (song.filePath) {
            const fullFilePath = join(__dirname, '..', song.filePath);
            if (fs.existsSync(fullFilePath)) {
                fs.unlinkSync(fullFilePath);
            }
        }

        // 2. Remove from all playlists
        await Playlist.updateMany(
            { songs: song._id },
            { $pull: { songs: song._id } }
        );

        // 3. Delete the DB record
        await song.deleteOne();
        res.status(200).json({ message: 'Song deleted successfully from all locations.' });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ message: 'Server error while deleting song.' });
    }
};

// Remove a song from a specific playlist
export const removeSongFromPlaylist = async (req, res) => {
    const { playlistId, songId } = req.body;
    if (!playlistId || !songId) {
        return res.status(400).json({ message: 'Playlist ID and Song ID are required.' });
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        await playlist.updateOne({ $pull: { songs: songId } });
        res.status(200).json({ message: 'Song removed from playlist successfully.' });
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ message: 'Server error while removing song from playlist.' });
    }
};
