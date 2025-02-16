import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isRequestSent, setIsRequestSent] = useState(false);

  const handleSendResetRequest = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      // Simulate sending a password reset request
      await axios.post(`http://localhost:8080/send-reset-request/${id}`, {
        userId: id,
        email: email,
      });
      setMessage("Password reset request sent successfully.");
      setError("");
      setIsRequestSent(true);
    } catch (err) {
      setError("Failed to send password reset request. Please try again.");
      setMessage("");
      console.error("Error sending password reset request:", err);
    }
  };

  const handleConfirmPasswordChange = async (e) => {
    e.preventDefault();

    if (!token || !newPassword) {
      setError("Token and new password are required.");
      return;
    }

    try {
      // Simulate confirming the password change
      await axios.post(`http://localhost:8080/confirm-reset-password/${id}`, {
        userId: id,
        token: token,
        newPassword: newPassword,
      });
      setMessage("Password reset successfully.");
      setError("");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setMessage("");
      console.error("Error resetting password:", err);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Reset Password</h2>
          {!isRequestSent ? (
            <form onSubmit={handleSendResetRequest}>
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
          ) : (
            <form onSubmit={handleConfirmPasswordChange}>
              <div className="mb-3">
                <label htmlFor="token" className="form-label">
                  Token
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="token"
                  placeholder="Enter the token from your email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              <button type="submit" className="btn btn-outline-primary">
                Confirm Password Change
              </button>
            </form>
          )}
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
