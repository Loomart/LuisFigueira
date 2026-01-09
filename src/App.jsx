import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';

import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Curriculum from './pages/Curriculum';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { useAuth } from './context/useAuth';
import ConsentBanner from './components/ConsentBanner';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { loading } = useAuth();
    
    // Mostrar un loader mientras se verifica la autenticación
    if (loading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>;
    }
    
    // NOTA: Hemos eliminado la redirección automática aquí porque el componente Admin
    // maneja internamente dos estados importantes que queremos mostrar:
    // 1. Si no hay usuario -> Muestra formulario de Login
    // 2. Si hay usuario sin permisos -> Muestra pantalla de "Acceso Limitado" con botón para hacerse admin
    
    return children;
  };

  return (
    <Router>
      {/* <LanguageSelector /> */}
      <Header />

      <main style={{ paddingTop: '100px' }}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/cv" element={<Curriculum />} />
          <Route path="/certificaciones" element={<Certifications />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/panel-privado-8743" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
      <ConsentBanner />
    </Router>
  );
}

export default App;
