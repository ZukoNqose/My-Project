import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">DemoDockerApp</Link>
      </div>
      <div className="nav-right">
        <Link to="/home">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/users">Users</Link>
        <Link to="/login" className="login-link">Login</Link>
      </div>
    </nav>
  );
}
