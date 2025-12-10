import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Users from "./pages/Users";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Layout>
    </Router>
  );
}
