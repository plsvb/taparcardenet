import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PingPongPage from './pages/PingPongPage';
import DominoGamePage from './pages/DominoGamePage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Navbar and Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/domino" element={<DominoGamePage />} />
        </Route>
        
        {/* Fullscreen game route without Navbar/Footer */}
        <Route path="/pingpong" element={<PingPongPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;