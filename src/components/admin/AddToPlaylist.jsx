import React, { useState } from 'react';
import api from '../../axios';
import { useMusic } from '../../context/MusicContext';
import SearchableSelect from '../SearchableSelect';

const AddToPlaylist = ({ showMessage }) => {
    const { songs: allSongs, playlists: allPlaylists } = useMusic();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState('');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSongId || !selectedPlaylistId) {
            showMessage("Please select both a song and a playlist.", true);
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.patch('/admin/playlist/add-song', { playlistId: selectedPlaylistId, songId: selectedSongId });
            showMessage(res.data.message);
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error adding song to playlist.', true);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">Add Song to Playlist</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <SearchableSelect items={allSongs} placeholder="Search and select a song..." onSelect={setSelectedSongId} displayKey="title" />
                <SearchableSelect items={allPlaylists} placeholder="Search and select a playlist..." onSelect={setSelectedPlaylistId} displayKey="name" />
                <button type="submit" disabled={isLoading || !selectedSongId || !selectedPlaylistId} className="w-full bg-green-500 text-black font-bold py-3 rounded-md disabled:bg-zinc-500">
                    {isLoading ? 'Adding...' : 'Add to Playlist'}
                </button>
            </form>
        </div>
    );
};

export default AddToPlaylist;