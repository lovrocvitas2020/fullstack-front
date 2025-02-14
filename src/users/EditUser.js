import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    active: false, // Use 'active' instead of 'isActive'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const { name, username, email, active } = user;

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "email" && !validateEmail(value)) {
      setValidationError("Please enter a valid email.");
    } else {
      setValidationError(null);
    }
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email.");
      return;
    }

    if (!name || !username || !email) {
      setValidationError("All fields are required!");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/user/${id}`, user);
      navigate("/home");
    } catch (error) {
      setError("Failed to update user. Please try again later.");
      console.error("Failed to update user:", error);
    }
  };

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      setUser(result.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching user data.");
      setLoading(false);
    }
  };

  const resetPassword = () => {
    // Logika za reset lozinke
    // Na primjer, preusmjeravanje na stranicu za reset lozinke
    navigate(`/reset-password/${id}`);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit User</h2>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <form onSubmit={(e) => onSubmit(e)}>
              <div className="mb-3">
                <label htmlFor="Name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  name="username"
                  value={username}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your e-mail address"
                  name="email"
                  value={email}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
              {validationError && (
                <div className="alert alert-danger">{validationError}</div>
              )}
              <div className="mb-3">
                <label htmlFor="active" className="form-label">
                  Active
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="active"
                  checked={active}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <button type="submit" className="btn btn-outline-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-warning mx-2"
                onClick={resetPassword}
              >
                Reset Password
              </button>
              <Link className="btn btn-outline-danger mx-2" to="/home">
                Cancel
              </Link>
            </form>
          )}
          <Link className="btn btn-primary my-2" to="/home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
