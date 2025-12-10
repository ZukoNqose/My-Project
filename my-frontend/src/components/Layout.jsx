import React from "react";
import NavBar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="app-root">
      <NavBar />
      <main className="content">{children}</main>
      <footer className="footer">© {new Date().getFullYear()} DemoDockerApp</footer>
    </div>
  );
}
