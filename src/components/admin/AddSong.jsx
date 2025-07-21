import React, { useState } from 'react';
import api from '../../axios';
import { useMusic } from '../../context/MusicContext';

const AddSong = ({ showMessage }) => {
    const { refreshData } = useMusic();
    const [isLoading, setIsLoading] = useState(false);
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/admin/song', { title: songTitle, artist: songArtist, youtubeUrl });
            showMessage(res.data.message);
            setSongTitle(''); setSongArtist(''); setYoutubeUrl('');
            refreshData();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error adding song.', true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
             <h2 className="text-2xl font-semibold mb-4 text-center">Add Song from YouTube</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Song Title" value={songTitle} onChange={e => setSongTitle(e.target.value)} className="w-full p-3 bg-zinc-700 rounded" required />
                <input type="text" placeholder="Artist" value={songArtist} onChange={e => setSongArtist(e.target.value)} className="w-full p-3 bg-zinc-700 rounded" required />
                <input type="url" placeholder="YouTube URL" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full p-3 bg-zinc-700 rounded" required />
                <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-black font-bold py-2 rounded disabled:bg-zinc-500">
                    {isLoading ? 'Downloading...' : 'Add Song'}
                </button>
            </form>
        </div>
    );
};

export default AddSong;