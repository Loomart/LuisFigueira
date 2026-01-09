import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { AuthContext } from './AuthContextBase';
import { PERMISSIONS } from '../config/rbac';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to create profile if it doesn't exist
  const createProfile = async (userId, email) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId, email: email, role: 'user' }]);
      
      if (error) {
        logger.error('Error creating profile:', error);
        return false;
      }
      return true;
    } catch (error) {
      logger.error('Unexpected error creating profile:', error);
      return false;
    }
  };

  // Función temporal para crear un usuario admin (solo para desarrollo)
  const createAdminUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Actualizar el perfil del usuario actual a admin
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        if (error) {
          logger.error('Error updating user to admin:', error);
          return false;
        }
        logger.info('User updated to admin successfully');
        return true;
      }
    } catch (error) {
      logger.error('Error creating admin user:', error);
      return false;
    }
  };

  // Helper to fetch profile
  const getProfile = async (userId) => {
    if (!userId) return null;
    try {
      // Primero intentar obtener el perfil directamente de la tabla profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      let finalProfileData = profileData;

      if (profileError || !finalProfileData) {
        logger.warn('No profile found for user, attempting to create one:', profileError);
        // Si no hay perfil, intentar crear uno
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          await createProfile(userId, user.email);
          // Intentar obtener el perfil nuevamente
          const { data: newProfileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (newProfileData) {
            finalProfileData = newProfileData;
          } else {
            // Fallback: crear perfil temporal basado en metadata del usuario
            logger.info('Using fallback profile creation');
            return { 
              id: userId, 
              email: user.email, 
              role: 'user', 
              permissions: [] 
            };
          }
        } else {
          return { role: 'user', permissions: [] };
        }
      }

      // Obtener permisos basados en el rol
      const role = finalProfileData.role || 'user';
      let permissions = [];

      // Asignar permisos según el rol
      if (role === 'admin') {
        permissions = Object.values(PERMISSIONS);
      } else if (role === 'support') {
        permissions = [
          PERMISSIONS.ACCESS_ADMIN_PANEL,
          PERMISSIONS.VIEW_MESSAGES,
          PERMISSIONS.REPLY_MESSAGES
        ];
      } else if (role === 'editor') {
        permissions = [
          PERMISSIONS.ACCESS_ADMIN_PANEL,
          PERMISSIONS.EDIT_CONTENT,
          PERMISSIONS.PUBLISH_CONTENT,
          PERMISSIONS.VIEW_ANALYTICS
        ];
      }

      return {
        ...finalProfileData,
        role,
        permissions
      };
    } catch (error) {
      logger.error('Unexpected error fetching profile:', error);
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
    createAdminUser,
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
