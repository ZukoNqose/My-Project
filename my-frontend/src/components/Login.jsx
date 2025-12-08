import { useState } from "react";

// Automatically choose API URL based on protocol
const API_BASE_URL =
    window.location.protocol === "https:"
        ? "https://localhost:5001/api"
        : "http://localhost:5146/api"; // use your actual backend port

export default function Login({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // important for cookie-based auth
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            setMessage("Login successful!");
            setIsLoggedIn(true); // mark user as logged
