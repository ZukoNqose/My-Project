import { useState } from "react";

const API_BASE_URL = "http://localhost:5146/api"; // your backend URL

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        dob: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Registration failed");
                return;
            }

            setMessage("Registration successful!");
            console.log("Registered user:", data);
        } catch (err) {
            console.error(err);
            setMessage(
                "Network or server error. Make sure backend is running and CORS is allowed."
            );
        }
    };

    return (
        <div className="card p-3 shadow-sm">
            <h3 className="card-title mb-3 text-center">Register</h3>
            <form onSubmit={handleSubmit}>
                {["username", "email", "phone", "dob", "password", "confirmPassword"].map((field) => (
                    <div className="mb-3" key={field}>
                        <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type={field.includes("password") ? "password" : "text"}
                            name={field}
                            className="form-control"
                            value={formData[field]}
                            onChange={handleChange}
                            required={field !== "phone" && field !== "dob"}
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary w-100">
                    Register
                </button>
            </form>

            {message && (
                <div
                    className={`mt-3 alert ${message.includes("successful") ? "alert-success" : "alert-danger"
                        }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}
