import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";

import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:5146/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check login state on app load
  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 200) setIsLoggedIn(true);
      })
      .catch((err) => console.error("Auth check failed:", err))
      .finally(() => setCheckingAuth(false));
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (checkingAuth) return <div className="text-center mt-5">Checking authentication...</div>;

  return (
    <Router>
      <div className="container mt-3">
        {/* Navigation */}
        {isLoggedIn && (
          <nav className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Link to="/home" className="me-3">Home</Link>
              <Link to="/profile">Profile</Link>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        )}

        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
