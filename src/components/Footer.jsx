import React, { useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { 
    PlayCircle, PauseCircle, SkipBack, SkipForward, 
    Volume2, Volume1, VolumeX 
} from 'lucide-react';

const Footer = () => {
    const { 
        isPlaying, currentSong, togglePlay, audioRef, 
        volume, isMuted, changeVolume, toggleMute,
        playNext, playPrev // 1. Get playNext and playPrev from the context
    } = usePlayer();
    
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const updateProgress = () => setProgress(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [audioRef]);

    const VolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX onClick={toggleMute} className="w-5 h-5 cursor-pointer" />;
        if (volume < 0.5) return <Volume1 onClick={toggleMute} className="w-5 h-5 cursor-pointer" />;
        return <Volume2 onClick={toggleMute} className="w-5 h-5 cursor-pointer" />;
    };

    if (!currentSong) {
        return <div className="h-24 bg-zinc-900 border-t border-zinc-700"></div>;
    }

    return (
        <footer className="bg-zinc-900 text-white p-4 border-t border-zinc-700 flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center w-1/4">
                <img src={currentSong.coverArt || '/default.jpg'} alt={currentSong.title} className="w-16 h-16 rounded-md" />
                <div className="ml-4">
                    <h3 className="font-bold truncate">{currentSong.title}</h3>
                    <p className="text-sm text-zinc-400 truncate">{currentSong.artist}</p>
                </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center flex-grow">
                <div className="flex items-center space-x-6">
                    {/* 2. Wrap icons in buttons and add onClick handlers */}
                    <button onClick={playPrev} disabled={!currentSong} className="disabled:opacity-50">
                        <SkipBack className="w-6 h-6 text-zinc-400 hover:text-white cursor-pointer" />
                    </button>
                    <button onClick={togglePlay} className="text-white hover:scale-105" disabled={!currentSong}>
                        {isPlaying ? <PauseCircle className="w-12 h-12" /> : <PlayCircle className="w-12 h-12" />}
                    </button>
                    <button onClick={playNext} disabled={!currentSong} className="disabled:opacity-50">
                        <SkipForward className="w-6 h-6 text-zinc-400 hover:text-white cursor-pointer" />
                    </button>
                </div>
                <div className="flex items-center w-full max-w-xl mt-2">
                    <span className="text-xs text-zinc-400">{formatTime(progress)}</span>
                    <input
                        type="range"
                        value={progress}
                        max={duration || 0}
                        onChange={(e) => audioRef.current.currentTime = e.target.value}
                        className="w-full h-1 mx-3 bg-zinc-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-white"
                    />
                    <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
                </div>
            </div>
            
            {/* Volume Controls */}
            <div className="flex items-center justify-end w-1/4 space-x-2">
                 <VolumeIcon />
                 <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-zinc-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-white"
                 />
            </div>
        </footer>
    );
};

export default Footer;