import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      // Simulacija slanja zahtjeva za reset lozinke
      await axios.post(`http://localhost:8080/reset-password/${id}`, {
        userId: id,
        email: email,
      });
      setMessage("Password reset request sent successfully.");
      setError("");
    } catch (err) {
      setError("Failed to send password reset request. Please try again.");
      setMessage("");
      console.error("Error sending password reset request:", err);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <button type="submit" className="btn btn-outline-primary">
              Send Reset Request
            </button>
          </form>
          <button
            className="btn btn-outline-secondary mt-2"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
