import React, { useState } from 'react';
import { Music, ListMusic, PlusCircle, ListPlus, SlidersHorizontal } from 'lucide-react';
import ManageSongs from '../components/admin/ManageSongs';
import ManagePlaylists from '../components/admin/ManagePlaylists';
import AddToPlaylist from '../components/admin/AddToPlaylist';
import AddSong from '../components/admin/AddSong';
import CreatePlaylist from '../components/admin/CreatePlaylist';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('manageSongs');
    const [message, setMessage] = useState({ text: '', error: false });

    const showMessage = (msg, isError = false) => {
        setMessage({ text: msg, error: isError });
        setTimeout(() => setMessage({ text: '', error: false }), 4000);
    };

    const TabButton = ({ tabName, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center justify-center px-4 py-2 font-semibold text-xs uppercase tracking-wider transition-all duration-300 border-b-2 ${
                activeTab === tabName
                    ? 'bg-zinc-700 text-green-400 border-green-400'
                    : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-700/50 hover:text-white'
            }`}
        >
            <Icon className="mr-2" size={16}/>
            {label}
        </button>
    );

    return (
        <div className="text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
            
            {message.text && (
                <div className={`${message.error ? 'bg-red-500' : 'bg-green-500'} text-white font-semibold p-3 rounded-md mb-6`}>
                    {message.text}
                </div>
            )}

            <div className="flex border-b border-zinc-700 mb-6">
                <TabButton tabName="manageSongs" label="Manage Songs" icon={Music} />
                <TabButton tabName="managePlaylists" label="Manage Playlists" icon={ListMusic} />
                <TabButton tabName="addToPlaylist" label="Add to Playlist" icon={ListPlus} />
                <TabButton tabName="addSong" label="Add Song" icon={PlusCircle} />
                <TabButton tabName="createPlaylist" label="Create Playlist" icon={ListMusic} />
            </div>

            <div className="bg-zinc-800 p-6 rounded-lg">
                {activeTab === 'manageSongs' && <ManageSongs showMessage={showMessage} />}
                {activeTab === 'managePlaylists' && <ManagePlaylists showMessage={showMessage} />}
                {activeTab === 'addToPlaylist' && <AddToPlaylist showMessage={showMessage} />}
                {activeTab === 'addSong' && <AddSong showMessage={showMessage} />}
                {activeTab === 'createPlaylist' && <CreatePlaylist showMessage={showMessage} />}
            </div>
        </div>
    );
};

export default AdminDashboard;