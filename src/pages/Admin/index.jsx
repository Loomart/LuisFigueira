import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/useAuth';
import { useRBAC } from '../../hooks/useRBAC';
import { supabase } from '../../lib/supabase';
import { ROLES, PERMISSIONS, ROLE_DEFINITIONS } from '../../config/rbac';
import './Admin.css';
import './AdminUsers.css';

const Admin = () => {
    const { user, signIn, signUp, signOut } = useAuth();
    const { role, can } = useRBAC();
    
    // Auth Form State
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);

    // Data State
    const [messages, setMessages] = useState([]);
    const [usersList, setUsersList] = useState([]); // New: List of users
    const [dataError, setDataError] = useState('');

    // --- Demo/Simulation State ---
    // Allows admins to "view as" other roles
    const [simulatedRole, setSimulatedRole] = useState(null);
    const activeRole = simulatedRole || role;
    
    // We need a helper to check permissions against the ACTIVE (simulated) role
    // because useRBAC checks against the real profile.role
    const checkSimulatedPermission = useCallback((permission) => {
        // If we are simulating, we need to check the definition manually
        // Note: With DB roles, simulation is harder without fetching DB roles list.
        // For now, we will fallback to local config ONLY for simulation purposes.
        if (simulatedRole) {
            const simPerms = ROLE_DEFINITIONS[simulatedRole] || [];
            if (simulatedRole === 'admin') return true;
            return simPerms.includes(permission);
        }
        return can(permission);
    }, [simulatedRole, can]);

    // Fetch messages when user is logged in AND has permission
    useEffect(() => {
        if (user && checkSimulatedPermission(PERMISSIONS.VIEW_MESSAGES)) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [user, simulatedRole, role, checkSimulatedPermission]); // Re-fetch if role changes

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error('Error fetching messages from Supabase:', err);
            setDataError('No se pudieron cargar los mensajes desde Supabase. Revisa las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, app_roles(label)') // Fetch the nice label
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setUsersList(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        if (user && checkSimulatedPermission(PERMISSIONS.MANAGE_USERS)) {
            fetchUsers();
        } else {
            setUsersList([]);
        }
    }, [user, simulatedRole, role, checkSimulatedPermission]);

    const updateUserRole = async (userId, newRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);
            if (error) throw error;
            await fetchUsers();
        } catch (err) {
            console.error('Error updating user role:', err);
            setDataError('No se pudo actualizar el rol del usuario.');
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAuthError('');

        try {
            if (isLogin) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
            } else {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                alert('¡Registro exitoso! Ya puedes iniciar sesión.');
                setIsLogin(true); // Switch to login after signup
            }
        } catch (err) {
            setAuthError(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    // 1. Not Logged In
    if (!user) {
        return (
            <div className="admin-login-container page">
                <div className="admin-card">
                    <h2>{isLogin ? '🔒 Iniciar Sesión' : '📝 Registrarse'}</h2>
                    
                    <form onSubmit={handleAuth}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            className="admin-input"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="admin-input"
                            required
                            minLength={6}
                        />
                        <button type="submit" className="admin-button" disabled={loading}>
                            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Registrarme')}
                        </button>
                    </form>

                    {authError && <p className="admin-error">{authError}</p>}

                    <div className="auth-toggle">
                        <button 
                            className="toggle-btn" 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin 
                                ? '¿No tienes cuenta? Regístrate aquí' 
                                : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Access Check (Basic Dashboard Access)
    // Even if you are just a "User", you can see the dashboard, but maybe with limited content.
    // Let's use the PERMISSION system.
    const hasAccess = checkSimulatedPermission(PERMISSIONS.ACCESS_ADMIN_PANEL);

    // If real user is Admin, show the Role Simulator
    const showSimulator = role === ROLES.ADMIN;

    // IMPORTANT: If simulated role is User, hasAccess will be false.
    // We should probably allow showing the dashboard but with limited content if we want to show "Acceso Limitado" nicely inside the dash,
    // OR we show the "Acceso Limitado" card as we do now.
    // The user reported "when admin nothing appears, black screen".
    
    // Debugging:
    console.log('Rendering Admin:', { user: user.email, role, activeRole, hasAccess, messages: messages.length });

    return (
        <div className="admin-dashboard page">
            <div className="admin-header">
                <div>
                    <h2>⚙️ Panel de Control</h2>
                    <p className="user-email">
                        Usuario: {user.email} <br/>
                        Rol: <span className={`role-badge ${activeRole}`}>{activeRole.toUpperCase()}</span>
                    </p>
                </div>
                
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    {showSimulator && (
                        <div className="role-simulator">
                            <span style={{fontSize: '0.8rem', marginRight: '5px'}}>👁️ Ver como:</span>
                            <select 
                                value={simulatedRole || ''} 
                                onChange={(e) => setSimulatedRole(e.target.value || null)}
                                className="simulator-select"
                            >
                                <option value="">Admin (Real)</option>
                                <option value="support">Soporte</option>
                                <option value="editor">Editor</option>
                                <option value="user">Usuario</option>
                            </select>
                        </div>
                    )}
                    <button onClick={signOut} className="admin-logout">Cerrar Sesión</button>
                </div>
            </div>

            {!hasAccess ? (
                 <div className="admin-card access-denied">
                    <h2>⛔ Acceso Limitado</h2>
                    <p>Tu rol actual ({activeRole}) no tiene permisos para ver el panel de administración.</p>
                </div>
            ) : (
                <div className="dashboard-grid">
                    
                    {/* SECTION: MESSAGES */}
                    {checkSimulatedPermission(PERMISSIONS.VIEW_MESSAGES) && (
                        <div className="dashboard-section">
                            <h3>📨 Mensajes Recibidos ({messages.length})</h3>
                            {dataError && <p className="admin-error">{dataError}</p>}
                            
                            <div className="messages-list">
                                {messages.length === 0 ? (
                                    <p>No hay mensajes todavía.</p>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="message-card">
                                            <div className="message-header">
                                                <span className="message-name">{msg.name}</span>
                                                <span className="message-date">
                                                    {new Date(msg.date || msg.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="message-email">
                                                <a href={`mailto:${msg.email}`}>{msg.email}</a>
                                            </div>
                                            <div className="message-body">
                                                {msg.message}
                                            </div>
                                            
                                            {/* Action Buttons based on permissions */}
                                            <div className="message-actions">
                                                {checkSimulatedPermission(PERMISSIONS.REPLY_MESSAGES) && (
                                                    <button className="action-btn reply">Responder</button>
                                                )}
                                                {checkSimulatedPermission(PERMISSIONS.DELETE_MESSAGES) && (
                                                    <button className="action-btn delete">Eliminar</button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* SECTION: ANALYTICS (Editor/Admin) */}
                    {checkSimulatedPermission(PERMISSIONS.VIEW_ANALYTICS) && (
                        <div className="dashboard-section analytics-section">
                            <h3>📊 Estadísticas del Sitio</h3>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h4>Visitas Hoy</h4>
                                    <p className="stat-number">1,240</p>
                                </div>
                                <div className="stat-card">
                                    <h4>Proyectos Vistos</h4>
                                    <p className="stat-number">85</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION: SYSTEM (Admin Only) */}
                    {checkSimulatedPermission(PERMISSIONS.MANAGE_USERS) && (
                        <div className="dashboard-section system-section">
                            <h3>🛡️ Gestión de Usuarios</h3>
                            <p style={{marginBottom: '1rem'}}>Administra los roles y permisos de los usuarios registrados.</p>
                            
                            <div className="users-table-container">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Rol Actual</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(usersList) && usersList.map(u => (
                                            <tr key={u.id}>
                                                <td title={u.id}>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                                                </td>
                                                <td>
                                                    <select 
                                                        value={u.role} 
                                                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                                                        className="role-select"
                                                        disabled={u.id === user.id} // Prevent locking yourself out
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="support">Support</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default Admin;
