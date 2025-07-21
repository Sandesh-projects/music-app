import React, { useState } from 'react';
import api from '../../axios';
import { useMusic } from '../../context/MusicContext';

const CreatePlaylist = ({ showMessage }) => {
    const { refreshData } = useMusic();
    const [isLoading, setIsLoading] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDesc, setPlaylistDesc] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/admin/playlist', { name: playlistName, description: playlistDesc });
            showMessage(res.data.message);
            setPlaylistName(''); setPlaylistDesc('');
            refreshData();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error creating playlist.', true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">Create New Playlist</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Playlist Name" value={playlistName} onChange={e => setPlaylistName(e.target.value)} className="w-full p-3 bg-zinc-700 rounded" required />
                <textarea placeholder="Description (optional)" value={playlistDesc} onChange={e => setPlaylistDesc(e.target.value)} className="w-full p-3 bg-zinc-700 rounded" rows="3"></textarea>
                <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-black font-bold py-2 rounded disabled:bg-zinc-500">
                    {isLoading ? 'Creating...' : 'Create Playlist'}
                </button>
            </form>
        </div>
    );
};

export default CreatePlaylist;