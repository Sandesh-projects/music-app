import React, { useState, useEffect } from 'react';
import api from '../../axios';
import { useMusic } from '../../context/MusicContext';
import { Trash2, Search } from 'lucide-react';

const ManageSongs = ({ showMessage }) => {
    const { songs: allSongs, refreshData } = useMusic();
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                api.get(`/music/search?q=${searchQuery}`).then(res => {
                    // THE FIX: We need to use the 'songs' array from the response object.
                    setSearchResults(res.data.songs || []); 
                });
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDeleteSong = async (songId, songTitle) => {
        if (window.confirm(`Are you sure you want to delete "${songTitle}"?`)) {
            setIsLoading(true);
            try {
                const res = await api.delete(`/admin/song/${songId}`);
                showMessage(res.data.message);
                refreshData();
            } catch (error) {
                showMessage(error.response?.data?.message || 'Error deleting song.', true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const songsToList = searchQuery ? searchResults : allSongs;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Songs</h2>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20}/>
                <input
                    type="text"
                    placeholder="Search for a song to manage..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-700 p-3 pl-10 rounded-md"
                />
            </div>
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                {/* This will now work correctly because songsToList is always an array */}
                {songsToList.map(song => (
                    <li key={song._id} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-700">
                        <div>
                            <p className="font-semibold">{song.title}</p>
                            <p className="text-sm text-zinc-400">{song.artist}</p>
                        </div>
                        <button onClick={() => handleDeleteSong(song._id, song.title)} disabled={isLoading} className="text-red-500 hover:text-red-400 p-2 rounded-full">
                            <Trash2 size={18} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageSongs;
