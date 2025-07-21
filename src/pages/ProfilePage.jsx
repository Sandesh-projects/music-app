import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../axios';
import { User, Mail, Shield, Edit, KeyRound } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [editMode, setEditMode] = useState(null);
    const [username, setUsername] = useState(user?.username || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', error: false });

    const showMessage = (msg, isError = false) => {
        setMessage({ text: msg, error: isError });
        setTimeout(() => setMessage({ text: '', error: false }), 4000);
    };

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.patch('/auth/update-username', { newUsername: username });
            updateUser(res.data.user);
            showMessage(res.data.message);
            setEditMode(null);
        } catch (error) {
            showMessage(error.response?.data?.message || 'Update failed', true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.patch('/auth/update-password', { currentPassword, newPassword });
            showMessage(res.data.message);
            setEditMode(null);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            showMessage(error.response?.data?.message || 'Update failed', true);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!user) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="text-white p-8">
            <div className="max-w-2xl mx-auto bg-zinc-800 rounded-2xl shadow-lg p-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold">Your Profile</h1>
                </div>
                
                {message.text && (
                    <div className={`${message.error ? 'bg-red-500' : 'bg-green-500'} text-white p-3 rounded-md mb-6`}>
                        {message.text}
                    </div>
                )}

                <ul className="space-y-4">
                    {/* Username Field/Form */}
                    <li className="bg-zinc-700/50 p-4 rounded-lg">
                        {editMode === 'username' ? (
                            <form onSubmit={handleUpdateUsername}>
                                <label className="text-sm text-zinc-400">New Username</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-zinc-600 p-2 rounded" autoFocus/>
                                    <button type="submit" disabled={isLoading} className="bg-green-500 px-3 py-2 rounded">Save</button>
                                    <button type="button" onClick={() => setEditMode(null)} className="bg-zinc-500 px-3 py-2 rounded">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <User className="w-5 h-5 text-green-400 mr-4" />
                                    <div>
                                        <span className="text-sm text-zinc-400">Username</span>
                                        <p className="font-medium capitalize">{user.username}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setEditMode('username'); setUsername(user.username); }} className="text-zinc-400 hover:text-white p-2"><Edit size={18}/></button>
                            </div>
                        )}
                    </li>
                    
                    {/* Email Field (read-only) */}
                    <li className="bg-zinc-700/50 p-4 rounded-lg flex items-center">
                        <Mail className="w-5 h-5 text-green-400 mr-4" />
                        <div>
                            <span className="text-sm text-zinc-400">Email</span>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </li>

                    {/* Password Field/Form */}
                    <li className="bg-zinc-700/50 p-4 rounded-lg">
                        {editMode === 'password' ? (
                             <form onSubmit={handleUpdatePassword} className="space-y-2">
                                <label className="text-sm text-zinc-400">Change Password</label>
                                <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-zinc-600 p-2 rounded" required />
                                <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-zinc-600 p-2 rounded" required />
                                <div className="flex items-center gap-2 pt-2">
                                    <button type="submit" disabled={isLoading} className="bg-green-500 px-3 py-2 rounded">Save Changes</button>
                                    <button type="button" onClick={() => setEditMode(null)} className="bg-zinc-500 px-3 py-2 rounded">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-between">
                                 <div className="flex items-center">
                                    <KeyRound className="w-5 h-5 text-green-400 mr-4" />
                                    <div>
                                        <span className="text-sm text-zinc-400">Password</span>
                                        <p className="font-medium">••••••••</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditMode('password')} className="text-zinc-400 hover:text-white p-2"><Edit size={18}/></button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ProfilePage;