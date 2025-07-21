import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, User, LogOut, Music, Shield } from 'lucide-react';

const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center px-4 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-white'
            }`
        }
    >
        <Icon className="w-6 h-6 mr-4" />
        {children}
    </NavLink>
);

const Header = () => {
    const { logout, user } = useAuth();

    return (
        <aside className="w-64 bg-black p-6 flex flex-col text-white">
            <div className="flex items-center mb-10">
                <Music className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold ml-2">Tunify</span>
            </div>
            
            <nav className="flex-grow space-y-2">
                <NavItem to="/" icon={Home}>Overview</NavItem>
                <NavItem to="/search" icon={Search}>Search</NavItem>
                <NavItem to="/profile" icon={User}>Profile</NavItem>
                {user?.role === 'admin' && (
                    <NavItem to="/admin" icon={Shield}>
                        Admin
                    </NavItem>
                )}
                <button onClick={logout} className="flex items-center w-full px-4 py-3 text-lg font-semibold text-zinc-400 rounded-lg hover:bg-zinc-700/50 hover:text-white transition-colors duration-200">
                    <LogOut className="w-6 h-6 mr-4" />
                    Log out
                </button>

                
            </nav>

            <div className="mt-auto">
                 
            </div>
        </aside>
    );
};

export default Header;