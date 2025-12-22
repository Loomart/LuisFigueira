import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import './Admin.css';

const Admin = () => {
    const { user, signIn, signUp, signOut } = useAuth();
    
    // Auth Form State
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);

    // Data State
    const [messages, setMessages] = useState([]);
    const [dataError, setDataError] = useState('');

    // Fetch messages when user is logged in
    useEffect(() => {
        if (user) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [user]);

    const fetchMessages = async () => {
        try {
            // Direct query to Supabase (Protected by RLS)
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setDataError('No se pudieron cargar los mensajes. Verifica tus permisos.');
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

    return (
        <div className="admin-dashboard page">
            <div className="admin-header">
                <div>
                    <h2>📨 Mensajes Recibidos ({messages.length})</h2>
                    <p className="user-email">Logueado como: {user.email}</p>
                </div>
                <button onClick={signOut} className="admin-logout">Cerrar Sesión</button>
            </div>

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
                                    {new Date(msg.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="message-email">
                                <a href={`mailto:${msg.email}`}>{msg.email}</a>
                            </div>
                            <div className="message-body">
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Admin;
