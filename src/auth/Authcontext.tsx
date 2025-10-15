import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import  {API_URL} from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [verifiedToken, setVerifiedToken] = useState(null);

  // --- 1. Initial Load Check ---
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token = null;
      try {
        token = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.error('Failed to restore token:', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);
  
  // --- 2. Authentication Functions ---
  const authContext = useMemo(() => ({
    // Shared API call logic for Login/Signup
    handleAuthSuccess: async (token) => {
      await SecureStore.setItemAsync('userToken', token);
      setUserToken(token);
    },

    hanldleVerifySucces: async (token) => {
      await SecureStore.setItemAsync('verifiedToken', token);
      setVerifiedToken(token);
    },

    // Sign Up Logic
    signUp: async (email, password, username) => {
      try {
       await axios.post(`${API_URL}/auth/register`, { username, email, password });
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response.data.message || 'Signup failed' };
      }
    },

    // Login Logic
    signIn: async (email, password) => {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        await authContext.handleAuthSuccess(response.data.token);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response.data.message || 'Login failed' };
      }
    },

    verifyOTP: async (otp) => {
      try {
        const response = await axios.post(`${API_URL}/verify-otp`, { otp }, {
          headers: { Authorization: `Bearer ${userToken}`, 
          'Content-Type': 'application/json'  },
        });
        await authContext.hanldleVerifySucces(response.data.token);
        return {success: true}
        
      } catch (error) {
        return { success: false, message: error.response.data.message || '2FA Verification failed'
      
      } 
    }
  },

  forgotPassword: async(email) => {
    try{
      const response = await axios.post(`${API_URL}/forgot-password`,{email});
      if(response.status == 202){
        return {success: false}
      } else {
        await authContext.handleAuthSuccess(response.data.token);
          return { success: true }

      }
    } catch(error) {
      console.error(error)
      return { success: false, message: error.response.data.message || 'Password change request failed'
      }
    }

  },

  resetPassword: async (email, otp, newPassword) => {
    try{
      const response = await axios.post(`${API_URL}/reset-password`,
        {email, otp, newPassword}, 
        {headers: { Authorization: `Bearer ${userToken}`, 
        'Content-Type': 'application/json'  }});
        return {success: true}
    }catch(error) {
      return { success: false, message: error.response.data.message || 'Failed to change password'
      } 
    }
  },

    // Logout Logic
    signOut: async () => {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('verifiedToken');
      setUserToken(null);
      setVerifiedToken(null);
    },
    
    userToken, verifiedToken
  }), [userToken, isLoading, verifiedToken]);

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

