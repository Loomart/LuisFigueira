import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Attempt to fetch messages with the provided password
            const response = await fetch('/api/messages', {
                headers: {
                    'Authorization': `Bearer ${password}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
                setIsAuthenticated(true);
            } else {
                setError('Contraseña incorrecta');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
        setMessages([]);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container page">
                <div className="admin-card">
                    <h2>🔒 Acceso Admin</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduce la contraseña..."
                            className="admin-input"
                        />
                        <button type="submit" className="admin-button" disabled={loading}>
                            {loading ? 'Verificando...' : 'Entrar'}
                        </button>
                    </form>
                    {error && <p className="admin-error">{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard page">
            <div className="admin-header">
                <h2>📨 Mensajes Recibidos ({messages.length})</h2>
                <button onClick={handleLogout} className="admin-logout">Salir</button>
            </div>

            <div className="messages-list">
                {messages.length === 0 ? (
                    <p>No hay mensajes todavía.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="message-card">
                            <div className="message-header">
                                <span className="message-name">{msg.name}</span>
                                <span className="message-date">
                                    {new Date(msg.date).toLocaleString()}
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
