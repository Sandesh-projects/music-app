import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- All your page and component imports remain the same ---
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import PlaylistViewPage from './pages/PlaylistViewPage';
import AdminDashboard from './pages/AdminDashboard';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

// This component now represents the entire authenticated part of your app
const AppLayout = () => (
    <div className="flex h-screen bg-zinc-800">
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pb-24">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/playlist/:playlistId" element={<PlaylistViewPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Admin-only route is nested inside */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </main>
    </div>
);

// A simple component to protect admin routes
const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="h-screen bg-black flex flex-col">
            <div className="flex-1 overflow-hidden">
                <Routes>
                    {isAuthenticated ? (
                        <Route path="/*" element={<AppLayout />} />
                    ) : (
                        // If not authenticated, only the /auth path is available
                        <Route path="/auth" element={<AuthPage />} />
                    )}
                    
                    <Route
                        path="*"
                        element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />}
                    />
                </Routes>
            </div>
            {isAuthenticated && <Footer />}
        </div>
    );
};

export default App;