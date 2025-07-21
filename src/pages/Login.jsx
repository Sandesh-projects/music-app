import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Music } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full px-10 text-center text-white bg-zinc-800">
            <div className="flex items-center mb-6">
                <Music className="w-8 h-8 text-green-400" />
                <h1 className="text-3xl font-bold ml-2">Sign In</h1>
            </div>
            <p className="text-zinc-400 mb-6 text-sm">Use your email account to login</p>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-3 bg-zinc-700 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 bg-zinc-700 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="w-full py-3 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors uppercase tracking-wider">
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;