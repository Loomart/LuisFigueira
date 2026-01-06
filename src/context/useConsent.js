import { useContext } from 'react';
import { ConsentContext } from './ConsentContextBase'; 

export const useConsent = () => useContext(ConsentContext);
