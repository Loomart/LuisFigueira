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
import { useRBAC } from './hooks/useRBAC';
import { PERMISSIONS } from './config/rbac';
import { useAuth } from './context/useAuth';
import { Navigate } from 'react-router-dom';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const { can } = useRBAC();
    const allowed = user && can(PERMISSIONS.ACCESS_ADMIN_PANEL);
    if (!allowed) return <Navigate to="/" replace />;
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
    </Router>
  );
}

export default App;
