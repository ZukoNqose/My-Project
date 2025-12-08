import { useEffect, useState } from "react";
import { fetchProducts } from "../api/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.Id}>{p.Name}</li>
        ))}
      </ul>
    </div>
  );
}
