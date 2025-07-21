// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // Set token for API calls
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                } catch (error) {
                    console.error("Session expired or token is invalid.", error);
                    logout(); // Clear invalid token
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [token]);

    const login = async (credentials) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
            // You can add state to show an error message to the user
            throw error;
        }
    };
    
    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            navigate('/');
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const updateUser = (newUserData) => {
        setUser(prevUser => ({...prevUser, ...newUserData}));
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};