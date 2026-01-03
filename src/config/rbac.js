/**
 * Role-Based Access Control (RBAC) Configuration
 * Defines the roles and the specific permissions associated with each role.
 */

export const ROLES = {
    ADMIN: 'admin',
    SUPPORT: 'support', // Can view messages but not sensitive admin actions
    EDITOR: 'editor',   // Can edit content but not see messages
    USER: 'user'        // Standard authenticated user
};

export const PERMISSIONS = {
    // Dashboard Access
    ACCESS_ADMIN_PANEL: 'access_admin_panel',
    
    // Messages
    VIEW_MESSAGES: 'view_messages',
    DELETE_MESSAGES: 'delete_messages',
    REPLY_MESSAGES: 'reply_messages',
    
    // Content Management (Future proofing)
    EDIT_CONTENT: 'edit_content',
    PUBLISH_CONTENT: 'publish_content',
    
    // System
    MANAGE_USERS: 'manage_users',
    VIEW_ANALYTICS: 'view_analytics',
    SYSTEM_SETTINGS: 'system_settings'
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const ROLE_DEFINITIONS = {
    [ROLES.ADMIN]: ALL_PERMISSIONS, // Admin has everything
    
    [ROLES.SUPPORT]: [
        PERMISSIONS.ACCESS_ADMIN_PANEL,
        PERMISSIONS.VIEW_MESSAGES,
        PERMISSIONS.REPLY_MESSAGES
    ],
    
    [ROLES.EDITOR]: [
        PERMISSIONS.ACCESS_ADMIN_PANEL,
        PERMISSIONS.EDIT_CONTENT,
        PERMISSIONS.PUBLISH_CONTENT,
        PERMISSIONS.VIEW_ANALYTICS
    ],
    
    [ROLES.USER]: [] // Basic users have no special permissions
};
