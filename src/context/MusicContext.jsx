import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../axios';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // These endpoints should return ALL songs and playlists for the admin panel
            const [songsRes, playlistsRes] = await Promise.all([
                api.get('/admin/songs/all'),
                api.get('/admin/playlists/all')
            ]);
            setSongs(songsRes.data);
            setPlaylists(playlistsRes.data);
        } catch (error) {
            console.error("Failed to fetch music data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const value = { songs, playlists, loading, refreshData: fetchData };

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
};