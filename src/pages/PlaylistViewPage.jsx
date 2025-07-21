import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import api from '../axios';

const SongRow = ({ song, index, onPlay }) => (
    <div 
        onClick={onPlay} 
        className="grid grid-cols-[60px_1fr_200px_80px] items-center gap-4 px-6 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors duration-200 group cursor-pointer"
    >
        <div className="relative flex items-center justify-center">
            <span className="text-zinc-400 font-medium group-hover:opacity-0 transition-opacity">
                {index + 1}
            </span>
            <Play className="w-5 h-5 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
        </div>
        
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-zinc-700 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                {song.coverArt ? (
                    <img 
                        src={song.coverArt} 
                        alt={song.title} 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <Music className="w-6 h-6 text-zinc-400" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white truncate text-sm">
                    {song.title || 'Unknown Title'}
                </h4>
                <p className="text-sm text-zinc-400 truncate">
                    {song.artist || 'Unknown Artist'}
                </p>
            </div>
        </div>
        
        <div className="text-zinc-400 truncate text-sm">
            {song.album || 'Single'}
        </div>
        
        <div className="text-zinc-400 text-sm text-right">
            {song.duration || '--:--'}
        </div>
    </div>
);

const PlaylistViewPage = () => {
    const { playlistId } = useParams();
    const { playSong, playPlaylist } = usePlayer();
    
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlaylist = async () => {
            if (!playlistId) return;
            setLoading(true);
            setError('');
            try {
                const res = await api.get(`/admin/playlist/${playlistId}`);
                setPlaylist(res.data);
            } catch (err) {
                setError('Failed to load playlist.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylist();
    }, [playlistId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-white text-lg">Loading playlist...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-red-400 text-lg">{error}</div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-white text-lg">Playlist not found.</div>
            </div>
        );
    }

    const songCount = playlist.songs?.length || 0;

    return (
        <div className="min-h-screen bg-zinc-900">
            {/* Header Section */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 p-8">
                <div className="flex items-end gap-6">
                    <div className="w-48 h-48 bg-zinc-700 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
                        {playlist.coverArt ? (
                            <img
                                src={playlist.coverArt}
                                alt="Playlist Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Music className="w-20 h-20 text-zinc-500" />
                        )}
                    </div>
                    <div className="flex-1">
                        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wide">
                            Playlist
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mt-2 mb-4">
                            {playlist.name || 'Untitled Playlist'}
                        </h1>
                        {playlist.description && (
                            <p className="text-zinc-300 text-lg mb-4">{playlist.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <span>{songCount} song{songCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-zinc-900 p-8 border-b border-zinc-800">
                <button 
                    onClick={() => playPlaylist(playlist.songs)} 
                    className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-400 hover:scale-105 transition-all duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    aria-label="Play Playlist"
                    disabled={!playlist.songs || playlist.songs.length === 0}
                >
                    <Play className="w-6 h-6 text-black fill-black ml-1" />
                </button>
            </div>

            {/* Songs List */}
            <div className="bg-zinc-900">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_1fr_200px_80px] items-center gap-4 px-6 py-4 border-b border-zinc-800 bg-zinc-900 sticky top-0">
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wide text-center">
                        #
                    </div>
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wide">
                        Title
                    </div>
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wide">
                        Album
                    </div>
                    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wide text-right">
                        <Clock className="w-4 h-4 ml-auto" />
                    </div>
                </div>

                {/* Songs */}
                <div className="bg-zinc-900">
                    {playlist.songs && playlist.songs.length > 0 ? (
                        playlist.songs.map((song, index) => (
                            <SongRow
                                key={song._id || index}
                                song={song}
                                index={index}
                                onPlay={() => playSong(song, playlist.songs)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <Music className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 text-lg mb-2">This playlist is empty</p>
                            <p className="text-zinc-500 text-sm">Add some songs to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistViewPage;