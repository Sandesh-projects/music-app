import React from 'react';
import { Play } from 'lucide-react';

const SongCard = ({ title, artist, coverArt, onPlay }) => {
    return (
        // The onClick handler is added to the main container div
        <div 
            onClick={onPlay} 
            className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-all duration-300 group cursor-pointer"
        >
            <div className="relative mb-4">
                <img
                    src={coverArt || '/default.jpg'}
                    alt={`${title} cover art`}
                    className="w-full h-auto rounded-md aspect-square object-cover"
                />
                {/* This play button is purely visual; the click is handled by the parent div */}
                <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2
                                transition-all duration-300 shadow-lg">
                    <Play className="w-6 h-6 text-black fill-black" />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-white truncate">{title}</h3>
                <p className="text-sm text-zinc-400 truncate">{artist}</p>
            </div>
        </div>
    );
};

export default SongCard;