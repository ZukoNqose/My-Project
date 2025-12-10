import React from "react";

export default function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome back — here’s a quick summary of the app.</p>
      <section className="card-row">
        <div className="card">
          <h3>Products</h3>
          <p>Browse available products and details.</p>
        </div>
        <div className="card">
          <h3>Users</h3>
          <p>Manage user profiles and permissions.</p>
        </div>
      </section>
    </div>
  );
}
