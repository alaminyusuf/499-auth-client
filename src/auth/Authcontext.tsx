import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import  {API_URL} from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null)

  // --- 1. Initial Load Check ---
  useEffect(() => {
    let role
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

    hanldleAdminSucces: async (token) => {
      await SecureStore.setItemAsync('adminToken', token);
      setAdminToken(token);
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
        if(response.data.role == 'admin') {
          await authContext.hanldleAdminSucces(response.data.token)
        }else {
          await authContext.hanldleVerifySucces(response.data.token);
        }
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
      await SecureStore.deleteItemAsync('adminToken');
      setUserToken(null);
      setVerifiedToken(null);
      setAdminToken(null)
    },

    addEmployee: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/admin/add-employee`, data, 
        {
          headers: { Authorization: `Bearer ${adminToken}`, 
          'Content-Type': 'application/json'  },
        })
         return { success: true };
       } catch (error) {
         return { success: false, message: error.response.data.message || 'Signup failed' };
       }
    },
    
    userToken, verifiedToken, adminToken
  }), [userToken, isLoading, verifiedToken, adminToken]);

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

