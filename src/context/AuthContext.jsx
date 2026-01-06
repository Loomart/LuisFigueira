import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { AuthContext } from './AuthContextBase';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch profile
  const getProfile = async (userId) => {
    if (!userId) return null;
    try {
      const rpcRes = await supabase.rpc('get_current_permissions');
      const dataArr = rpcRes.data || [];
      const data = Array.isArray(dataArr) ? dataArr[0] : null;
      const error = rpcRes.error || (!data ? { message: 'No profile' } : null);
      
      if (error) {
        logger.warn('Error fetching profile');
        return { role: 'user', permissions: [] }; 
      }

      const permissions = data.permissions || [];
      
      return {
          ...data,
          permissions
      };
    } catch {
      logger.error('Unexpected error fetching profile');
      return { role: 'user', permissions: [] };
    }
  };

  useEffect(() => {
    // 1. Check active session on startup
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
            const userProfile = await getProfile(currentUser.id);
            setProfile(userProfile);
        } else {
            setProfile(null);
        }

      } catch {
        logger.error('Error checking session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 2. Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
          const userProfile = await getProfile(currentUser.id);
          setProfile(userProfile);
      } else {
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
      {children}
    </AuthContext.Provider>
  );
};
