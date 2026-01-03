import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/rbac';

/**
 * Custom Hook for Role-Based Access Control
 * NOW: Fetches permissions dynamically from the User Profile (Database)
 */
export const useRBAC = () => {
    const { profile } = useAuth();

    // Default to USER role if no profile found
    const currentRole = profile?.role || ROLES.USER;
    
    // permissions are now coming directly from the DB profile object
    const permissions = profile?.permissions || [];

    /**
     * Check if user has a specific permission
     * @param {string} permission 
     */
    const can = (permission) => {
        if (currentRole === ROLES.ADMIN) return true;
        return permissions.includes(permission);
    };

    const hasAll = (permissionsList) => {
        if (currentRole === ROLES.ADMIN) return true;
        return permissionsList.every(p => permissions.includes(p));
    };

    const hasAny = (permissionsList) => {
        if (currentRole === ROLES.ADMIN) return true;
        return permissionsList.some(p => permissions.includes(p));
    };

    return {
        role: currentRole,
        permissions,
        can,
        hasAll,
        hasAny
    };
};
