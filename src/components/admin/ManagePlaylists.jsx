import React, { useState } from 'react';
import api from '../../axios';
import { useMusic } from '../../context/MusicContext';
import { Trash2, X, Search } from 'lucide-react';

const ManagePlaylists = ({ showMessage }) => {
    const { playlists: allPlaylists, refreshData } = useMusic();
    const [isLoading, setIsLoading] = useState(false);
    const [viewingPlaylist, setViewingPlaylist] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleViewPlaylist = async (playlistId) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/admin/playlist/${playlistId}`);
            setViewingPlaylist(res.data);
        } catch (error) {
            showMessage('Could not fetch playlist details.', true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveSong = async (playlistId, songId) => {
        setIsLoading(true);
        try {
            const res = await api.patch('/admin/playlist/remove-song', { playlistId, songId });
            showMessage(res.data.message);
            handleViewPlaylist(playlistId);
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error removing song.', true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePlaylist = async (playlistId, playlistName) => {
        if (window.confirm(`Are you sure you want to delete "${playlistName}"?`)) {
            setIsLoading(true);
            try {
                const res = await api.delete(`/admin/playlist/${playlistId}`);
                showMessage(res.data.message);
                setViewingPlaylist(null);
                refreshData();
            } catch (error) {
                showMessage(error.response?.data?.message || 'Error deleting playlist.', true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filteredPlaylists = allPlaylists.filter(pl => 
        pl.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold mb-2">Select a Playlist</h3>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20}/>
                        <input
                            type="text"
                            placeholder="Search playlists..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-700 p-3 pl-10 rounded-md"
                        />
                    </div>
                    <ul className="space-y-2 bg-zinc-900/50 p-2 rounded-lg max-h-96 overflow-y-auto">
                        {filteredPlaylists.map(pl => (
                            <li key={pl._id} onClick={() => handleViewPlaylist(pl._id)} className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-700 cursor-pointer">
                                <p className="font-semibold">{pl.name}</p>
                                <button onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(pl._id, pl.name); }} disabled={isLoading} className="text-red-500 hover:text-red-400 p-1 rounded-full"><Trash2 size={16} /></button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {isLoading && !viewingPlaylist ? <p>Loading...</p> : viewingPlaylist ? (
                        <div>
                            <h3 className="text-lg font-bold mb-2">Songs in "{viewingPlaylist.name}"</h3>
                            <ul className="space-y-2 bg-zinc-900/50 p-2 rounded-lg max-h-96 overflow-y-auto">
                                {viewingPlaylist.songs.length > 0 ? viewingPlaylist.songs.map(song => (
                                    <li key={song._id} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-700">
                                        <div>
                                            <p className="font-semibold">{song.title}</p>
                                            <p className="text-sm text-zinc-400">{song.artist}</p>
                                        </div>
                                        <button onClick={() => handleRemoveSong(viewingPlaylist._id, song._id)} disabled={isLoading} className="text-orange-500 hover:text-orange-400 p-1 rounded-full"><X size={16} /></button>
                                    </li>
                                )) : <p className="text-zinc-400 p-2">This playlist is empty.</p>}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-zinc-400">Select a playlist to see its songs.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagePlaylists;
