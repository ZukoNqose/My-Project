import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="hero">
      <h1 className="hero-title">Welcome to DemoDockerApp</h1>
      <p className="hero-sub">A starter .NET + React (Vite) demo</p>
      <div style={{ marginTop: 20 }}>
        <Link to="/home" className="button">Get Started</Link>
      </div>
    </div>
  );
}
