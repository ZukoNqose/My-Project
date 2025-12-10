import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: call your API. For now we just log.
    console.log("login:", { email, password });
    alert("Login attempt logged to console (hook up your API).");
  }

  return (
    <div className="form-wrap">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button type="submit" className="button">Sign in</button>
      </form>
    </div>
  );
}
