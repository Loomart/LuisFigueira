import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContextBase';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch profile with timeout
  const getProfile = async (userId) => {
    if (!userId) return null;
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      // Now fetching from the JOINED query (profiles + roles)
      // We do this manually since Supabase select syntax allows joining
      const fetchPromise = supabase
        .from('profiles')
        .select(`
            *,
            app_roles (
                permissions
            )
        `)
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (error) {
        console.warn('Error fetching profile:', error.message);
        return { role: 'user', permissions: [] }; 
      }

      // Flatten the structure for easier use
      // Handle case where app_roles might be an array (one-to-many) or object (many-to-one)
      const roleData = Array.isArray(data.app_roles) ? data.app_roles[0] : data.app_roles;
      // Default to empty array if permissions is null/undefined
      const permissions = roleData?.permissions || [];
      
      return {
          ...data,
          permissions
      };
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return { role: 'user', permissions: [] };
    }
  };

  useEffect(() => {
    // 1. Check active session on startup
    const checkSession = async () => {
      console.log('Starting session check...');
      
      // Safety timeout for the entire check
      const safetyTimer = setTimeout(() => {
          console.warn('Session check took too long, forcing load completion.');
          setLoading(false);
      }, 7000);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session retrieved:', session ? 'Active' : 'None');
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
            console.log('User logged in, fetching profile...');
            const userProfile = await getProfile(currentUser.id);
            console.log('Profile fetched:', userProfile);
            setProfile(userProfile);
        } else {
            console.log('No user session found.');
            setProfile(null);
        }

      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        clearTimeout(safetyTimer);
        setLoading(false);
        console.log('Loading set to false');
      }
    };

    checkSession();

    // 2. Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
          console.log('Auth changed: User logged in');
          const userProfile = await getProfile(currentUser.id);
          setProfile(userProfile);
      } else {
          console.log('Auth changed: User logged out');
          setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
    profile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontSize: '1.2rem',
            color: '#333'
        }}>
            Cargando sesión...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
