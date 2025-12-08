import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5146/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/auth/me`, {
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        setMessage("You are not logged in");
                    } else {
                        const text = await res.text();
                        setMessage(text || "Failed to load profile");
                    }
                    setLoading(false);
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data) setUser(data);
            })
            .catch((err) => {
                console.error("Profile fetch error:", err);
                setMessage("Failed to load profile");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading profile...</div>;
    if (!user) return <div>{message}</div>;

    return (
        <div className="card p-3 shadow-sm">
            <h3 className="card-title mb-3 text-center">Profile</h3>
            <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Username:</strong> {user.userName}</li>
                <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                {user.phoneNumber && <li className="list-group-item"><strong>Phone:</strong> {user.phoneNumber}</li>}
                {user.dob && <li className="list-group-item"><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</li>}
            </ul>
        </div>
    );
}
