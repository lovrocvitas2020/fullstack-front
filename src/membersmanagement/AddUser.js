import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddUser() {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "ROLE_MEMBER", // Default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { name, username, email, password, role } = user;

  const roles = ["ROLE_ADMIN", "ROLE_MEMBER", "ROLE_COACH", "ROLE_GUEST"];

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Fetch existing users to check for duplicate usernames
      const result = await axios.get("http://localhost:8080/users");
      const existingUsers = result.data._embedded?.users || [];

      // Check if username (case-insensitive) already exists
      const usernameExists = existingUsers.some(
        (existingUser) =>
          existingUser.username.toLowerCase() === username.toLowerCase()
      );

      if (usernameExists) {
        setError("Username already exists. Please choose a different username.");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:8080/user", user);
      navigate("/home");
    } catch (error) {
      setError("Failed to register user.");
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Register User</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="Name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                name="name"
                value={name}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                name="username"
                value={username}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your e-mail address"
                name="email"
                value={email}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Role" className="form-label">User Role</label>
              <select
                className="form-control"
                name="role"
                value={role}
                onChange={onInputChange}
                required
              >
                {roles.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption.replace("ROLE_", "")}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-outline-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/home">Cancel</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
