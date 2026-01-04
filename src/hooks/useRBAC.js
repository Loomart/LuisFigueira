import { useAuth } from '../context/useAuth';
import { useCallback, useMemo } from 'react';
import { ROLES } from '../config/rbac';

/**
 * Custom Hook for Role-Based Access Control
 * NOW: Fetches permissions dynamically from the User Profile (Database)
 */
export const useRBAC = () => {
    const { profile } = useAuth();

    // Default to USER role if no profile found
    const currentRole = useMemo(() => profile?.role || ROLES.USER, [profile]);
    
    // permissions are now coming directly from the DB profile object
    const permissions = useMemo(() => profile?.permissions || [], [profile]);

    /**
     * Check if user has a specific permission
     * @param {string} permission 
     */
    const can = useCallback((permission) => {
        if (currentRole === ROLES.ADMIN) return true;
        return permissions.includes(permission);
    }, [currentRole, permissions]);

    const hasAll = useCallback((permissionsList) => {
        if (currentRole === ROLES.ADMIN) return true;
        return permissionsList.every(p => permissions.includes(p));
    }, [currentRole, permissions]);

    const hasAny = useCallback((permissionsList) => {
        if (currentRole === ROLES.ADMIN) return true;
        return permissionsList.some(p => permissions.includes(p));
    }, [currentRole, permissions]);

    return {
        role: currentRole,
        permissions,
        can,
        hasAll,
        hasAny
    };
};
