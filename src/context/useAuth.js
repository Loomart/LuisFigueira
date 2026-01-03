import { useContext } from 'react';
import { AuthContext } from './AuthContextBase';

export const useAuth = () => {
  return useContext(AuthContext);
};
