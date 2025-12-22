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

function App() {
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
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
