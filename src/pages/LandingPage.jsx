import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';
import api from '../axios';

const PlaylistCard = ({ title, bgColor, image, playlistId }) => (
    <Link to={`/playlist/${playlistId}`}>
        <div className={`relative p-4 rounded-lg overflow-hidden h-48 flex flex-col justify-end ${bgColor} hover:scale-105 transition-transform`}>
            <h3 className="text-2xl font-bold text-white z-10">{title}</h3>
            <img
                // src={image || '/default.jpg'}
                // alt={""}
                // className="absolute -right-5 -bottom-5 w-28 h-28 rotate-12 object-cover"
            />
        </div>
    </Link>
);

const LandingPage = () => {
    const { playSong } = usePlayer();
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            setLoading(true);
            try {
                const [songsRes, playlistsRes] = await Promise.all([
                    api.get('/music/songs/random'),
                    api.get('/music/playlists/random')
                ]);
                setSongs(songsRes.data);
                setPlaylists(playlistsRes.data);
            } catch (error) {
                console.error("Failed to load landing page data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomePageData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-white">Loading Music...</div>;
    }

    return (
        <div className="text-white p-8">
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Popular Songs</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {songs.map((song) => (
                        <SongCard
                            key={song._id}
                            title={song.title}
                            artist={song.artist}
                            coverArt={song.coverArt}
                            onPlay={() => playSong(song, songs)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold mb-6">Featured Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {playlists.map((playlist, index) => (
                        <PlaylistCard
                            key={playlist._id}
                            playlistId={playlist._id}
                            title={playlist.name}
                            bgColor={['bg-indigo-600', 'bg-green-600', 'bg-orange-500', 'bg-purple-600', 'bg-red-600'][index % 5]}
                            image={playlist.coverArt}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;