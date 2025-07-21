import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css'; 

const AuthPage = () => {
    const [isSignUpActive, setIsSignUpActive] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
            <div 
                id="container"
                className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
            >
                <div className="form-container sign-up-container">
                    <Register />
                </div>

                <div className="form-container sign-in-container">
                    <Login />
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
                            <p className="text-sm mt-4 text-white/90">To keep connected with us please login with your personal info</p>
                            <button 
                                onClick={() => setIsSignUpActive(false)} 
                                className="ghost mt-6"
                                id="signIn"
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className="text-3xl font-bold text-white">Hello, Friend!</h1>
                            <p className="text-sm mt-4 text-white/90">Enter your personal details and start your journey with us</p>
                            <button 
                                onClick={() => setIsSignUpActive(true)} 
                                className="ghost mt-6"
                                id="signUp"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;