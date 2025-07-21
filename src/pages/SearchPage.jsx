import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Play, X, ListMusic } from 'lucide-react';
import api from '../axios';
import { usePlayer } from '../context/PlayerContext';

const SongRow = ({ song, onPlay }) => (
    <div onClick={onPlay} className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-700/50 group cursor-pointer">
        <img src={song.coverArt || '/default.jpg'} alt={song.title} className="w-12 h-12 rounded-md object-cover" />
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{song.title}</h4>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
        </div>
        <Play className="w-6 h-6 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
);

const PlaylistRow = ({ playlist }) => (
    <Link to={`/playlist/${playlist._id}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-700/50 group cursor-pointer">
        <div className="w-12 h-12 rounded-md bg-zinc-700 flex items-center justify-center">
            <ListMusic className="w-6 h-6 text-zinc-400"/>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{playlist.name}</h4>
            <p className="text-sm text-zinc-400">Playlist</p>
        </div>
    </Link>
);


const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const { playSong } = usePlayer();

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (query) {
                setLoading(true);
                api.get(`/music/search?q=${query}`)
                    .then(res => {
                        setSongs(res.data.songs || []);
                        setPlaylists(res.data.playlists || []);
                    })
                    .catch(err => console.error("Search failed", err))
                    .finally(() => setLoading(false));
            } else {
                setSongs([]);
                setPlaylists([]);
            }
        }, 300);

        return () => clearTimeout(timerId);
    }, [query]);

    const hasResults = songs.length > 0 || playlists.length > 0;

    return (
        <div className="text-white p-8">
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search for songs or playlists..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-zinc-700 text-lg p-4 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {query && <X onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer" />}
            </div>

            <div>
                {loading && <p className="text-zinc-400">Searching...</p>}
                
                {!loading && query && !hasResults && (
                    <p className="text-zinc-400">No results found for "{query}".</p>
                )}
                
                {hasResults && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {songs.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Songs</h2>
                                <div className="space-y-2">
                                    {songs.map(song => (
                                        <SongRow key={song._id} song={song} onPlay={() => playSong(song, songs)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {playlists.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Playlists</h2>
                                <div className="space-y-2">
                                    {playlists.map(playlist => (
                                        <PlaylistRow key={playlist._id} playlist={playlist} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;