import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Admin/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import Admin from './pages/Admin/Admin';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/admin" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
