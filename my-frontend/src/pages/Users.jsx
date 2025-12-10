import React from "react";

/* sample users — replace with API call */
const sampleUsers = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

export default function Users() {
  return (
    <div>
      <h2>Users</h2>
      <div className="table">
        <div className="table-row table-head">
          <div>Name</div>
          <div>Email</div>
          <div>Actions</div>
        </div>

        {sampleUsers.map(u => (
          <div className="table-row" key={u.id}>
            <div>{u.name}</div>
            <div>{u.email}</div>
            <div>
              <button className="button small">Edit</button>{" "}
              <button className="button small ghost">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
