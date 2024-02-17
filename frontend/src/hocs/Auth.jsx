import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// A component wrapper for telling the page if it's logged in or not
export const AuthProvider = ({ children }) => {

    // for setting persisting login state 
    const setLoginState = (isLoggedIn, id) => {
        localStorage.setItem('loginData', JSON.stringify({ isLoggedIn, id }));
    };
    
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Get the isLoggedIn value from localStorage or default to false
        return JSON.parse(localStorage.getItem('loginData'))?.isLoggedIn || false;
    });

    const [userId, setUserId] = useState(() => {
        // Get the userId value from localStorage or default to null
        return JSON.parse(localStorage.getItem('loginData'))?.id || null;
    });

    const login = (id) => {
        setIsLoggedIn(true);
        setUserId(id);
        setLoginState(true, id);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setLoginState(false, null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>
            {children}
        </AuthContext.Provider>
    );
};
