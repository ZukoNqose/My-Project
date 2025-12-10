import React from "react";

/* sample data — replace with API call */
const sampleProducts = [
  { id: 1, name: "Widget A", price: 19.99 },
  { id: 2, name: "Widget B", price: 29.99 },
  { id: 3, name: "Widget C", price: 39.99 },
];

export default function Products() {
  return (
    <div>
      <h2>Products</h2>
      <div className="product-grid">
        {sampleProducts.map(p => (
          <div key={p.id} className="product-card">
            <h4>{p.name}</h4>
            <p>Price: ${p.price.toFixed(2)}</p>
            <button className="button small">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
