import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../axios';
import api from '../axios';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (currentSong && currentSong.filePath) {
            const fullAudioUrl = `${API_BASE_URL}${currentSong.filePath}`;
            audioRef.current.src = fullAudioUrl;
            audioRef.current.play().catch(e => {
                console.error("Error playing audio:", e);
                handlePlaybackError();
            });
        }
    }, [currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    const playSong = (song, playlist) => {
        setCurrentSong(song);
        setCurrentPlaylist(playlist);
    };

    const playPlaylist = (playlist) => {
        if (playlist && playlist.length > 0) {
            setCurrentPlaylist(playlist);
            setCurrentSong(playlist[0]);
        }
    };

    const fetchAndPlayRandom = async () => {
        console.log("Fetching new random songs for endless radio...");
        try {
            const res = await api.get('/music/songs/random');
            if (res.data && res.data.length > 0) {
                playPlaylist(res.data);
            }
        } catch (error) {
            console.error("Could not fetch new songs for autoplay.", error);
        }
    };

    // UPDATED: This function is now smarter about when to start the radio feature
    const handleSongEnd = () => {
        const currentIndex = currentPlaylist.findIndex(song => song._id === currentSong._id);
        
        // If the playlist is short (like from search) and the last song finishes, start radio mode.
        // We use a threshold (e.g., 20 songs) to distinguish short queues from large user playlists.
        if (currentIndex === currentPlaylist.length - 1 && currentPlaylist.length < 20) {
            fetchAndPlayRandom();
        } else {
            // Otherwise (for large playlists), just loop to the next song.
            playNext();
        }
    };

    const togglePlay = () => {
        if (!currentSong) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
    };

    const playNext = () => {
        if (currentPlaylist.length === 0 || !currentSong) return;
        const currentIndex = currentPlaylist.findIndex(song => song._id === currentSong._id);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        setCurrentSong(currentPlaylist[nextIndex]);
    };

    const playPrev = () => {
        if (currentPlaylist.length === 0 || !currentSong) return;
        const currentIndex = currentPlaylist.findIndex(song => song._id === currentSong._id);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        setCurrentSong(currentPlaylist[prevIndex]);
    };

    const changeVolume = (newVolume) => {
        setVolume(newVolume);
        if (newVolume > 0) setIsMuted(false);
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    const handlePlaybackError = () => {
        console.warn(`Failed to load song. Playing fallback.`);
        audioRef.current.src = '/Like Me Better.mp3';
        audioRef.current.play();
    };

    const value = {
        isPlaying, currentSong, currentPlaylist, volume, isMuted,
        togglePlay, playSong, playPlaylist, changeVolume, toggleMute,
        playNext, playPrev, audioRef,
    };

    return (
        <PlayerContext.Provider value={value}>
            <audio
                ref={audioRef}
                onError={handlePlaybackError}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleSongEnd} // Use the new, smarter end handler
            />
            {children}
        </PlayerContext.Provider>
    );
};
