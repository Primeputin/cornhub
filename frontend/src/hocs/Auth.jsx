import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

// A component wrapper for telling the page if it's logged in or not
export const AuthProvider = ({ children }) => {
    
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isInitialVisit, setIsInitialVisit] = useState(false);

    const login = (id) => {
        setIsLoggedIn(true);
        setUserId(id);
    };

    const logout = async() => {
        try {
            await axios.get('http://localhost:3000/api/users/session/logout');
            setIsLoggedIn(false);
            setUserId(null);
            sessionStorage.setItem('visited', 'false');
        } catch (error) {
            console.log("Error logging out: ", error)
        }
        
        
    };

    useEffect(() => {
        const checkSession = async () => {
          try {
            const response = await axios.get('http://localhost:3000/api/users/check_session/check');
            login(response.data.user)
            console.log("logged in")
          } catch (error) {
            logout();
            console.log("logged out")
          }
        };
        checkSession();
      }, []);

    useEffect(() => {
      const isFirstVisit = !sessionStorage.getItem('visited');
  
      const updateSession = async () => {
        try {
          const response = await axios.patch('http://localhost:3000/api/users//session/update');
        } catch (error) {
          console.log("Error updating session")
        }
      };    

      if (isFirstVisit && isLoggedIn) {
        updateSession();
        setIsInitialVisit(true);
        sessionStorage.setItem('visited', 'true');
      }
  
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>
            {children}
        </AuthContext.Provider>
    );
};
