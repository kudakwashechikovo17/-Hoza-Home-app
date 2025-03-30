import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

// Create the Auth Context
export const AuthContext = createContext();

// Sample user data for demo purposes
const DEMO_USERS = {
  tenant: {
    id: 't1',
    name: 'John Doe',
    email: 'tenant@example.com',
    role: 'tenant',
    avatar: null,
  },
  landlord: {
    id: 'l1',
    name: 'Sarah Smith',
    email: 'landlord@example.com',
    role: 'landlord',
    avatar: null,
  },
  buyer: {
    id: 'b1',
    name: 'Michael Johnson',
    email: 'buyer@example.com',
    role: 'buyer',
    avatar: null,
  },
  agent: {
    id: 'a1',
    name: 'David Wilson',
    email: 'agent@example.com',
    role: 'agent',
    avatar: null,
  },
  admin: {
    id: 'ad1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: null,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load user data from storage on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Load token from secure storage
        const storedToken = await SecureStore.getItemAsync('userToken');
        
        if (storedToken) {
          setToken(storedToken);
          
          // Load user data from secure storage
          const userData = await SecureStore.getItemAsync('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (e) {
        console.error('Failed to load authentication data:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Sign in function - in a real app, this would make an API call
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if the email matches any demo user
      let foundUser = null;
      
      for (const role in DEMO_USERS) {
        if (DEMO_USERS[role].email === email) {
          foundUser = DEMO_USERS[role];
          break;
        }
      }
      
      if (foundUser && password === 'password') {
        // Generate a fake token
        const demoToken = `demo-token-${Date.now()}`;
        
        // Store token and user data in secure storage
        await SecureStore.setItemAsync('userToken', demoToken);
        await SecureStore.setItemAsync('userData', JSON.stringify(foundUser));
        
        // Update context state
        setToken(demoToken);
        setUser(foundUser);
        
        return { success: true };
      } else {
        return { 
          success: false,
          message: 'Invalid email or password.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during sign in. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function - in a real app, this would make an API call
  const signUp = async (userData) => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email is already in use
      for (const role in DEMO_USERS) {
        if (DEMO_USERS[role].email === userData.email) {
          return { 
            success: false,
            message: 'Email is already in use.' 
          };
        }
      }
      
      // In a real app, this would create a new user in the database
      // For demo, we'll just show success but not actually create a new user
      return { 
        success: true,
        message: 'Account created successfully! You can now login.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during registration. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      // Clear secure storage
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Clear context state
      setToken(null);
      setUser(null);
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign out.');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in context
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      
      // Update in secure storage
      await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false,
        message: 'Failed to update profile.'
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
