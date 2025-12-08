import { useEffect, useState } from "react";
import Profile from "./Profile";

const API_BASE_URL = "http://localhost:5146/api";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // ? Make sure no newline or extra spaces in the URL
        fetch(`${API_BASE_URL}/products`, {
            credentials: "include", // send cookies if needed
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Failed to fetch products");
                }
                return res.json();
            })
            .then((data) => setProducts(data))
            .catch((err) => {
                console.error("Fetch products error:", err);
                setError("Failed to load products");
            })
            .finally(() => setLoadingProducts(false));
    }, []);

    return (
        <div className="container my-5">
            {/* Profile */}
            <Profile />

            {/* Products */}
            <h2 className="mt-5 mb-4 text-center">Products</h2>

            {loadingProducts ? (
                <div>Loading products...</div>
            ) : error ? (
                <div className="text-danger">{error}</div>
            ) : products.length === 0 ? (
                <div>No products found.</div>
            ) : (
                <div className="row">
                    {products.map((p) => (
                        <div key={p.id} className="col-sm-6 col-md-4 col-lg-3 mb-3">
                            <div className="card h-100 text-center">
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">${p.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
