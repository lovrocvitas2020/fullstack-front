import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner, Alert } from "reactstrap";

export default function AddUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    sex: "",
    countryOfBirth: "",
    city: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log("Rendering AddUserDetails component");
  console.log("User ID from URL:", id);
  console.log("Edit mode:", isEditMode);
  console.log("Form data:", formData);
  console.log("Loading state:", loading);
  console.log("Submitting state:", submitting);
  console.log("Error state:", error);
  console.log("Success state:", success);

  useEffect(() => {
    if (id) {
      console.log("Fetching user details for ID:", id);
      setLoading(true); // Set loading to true when starting the fetch
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/userdetails/${id}`);
          console.log("User details fetched successfully:", response.data);
  
          // Populate form data with fetched details
          setFormData({
            ...response.data,
            dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.slice(0, 10) : "",
          });
          setIsEditMode(true); // Set edit mode to true since details exist
          setError(""); // Clear any previous error messages
        } catch (error) {
          console.error("Error fetching user details:", error);
  
          if (error.response?.status === 404) {
            console.log("User details not found for ID:", id);
            setIsEditMode(false); // Set edit mode to false since details don't exist
            setError("No user details found. Please add details.");
  
            // Initialize form data with default values for adding new details
            setFormData({
              phoneNumber: "",
              address: "",
              dateOfBirth: "",
              sex: "",
              countryOfBirth: "",
              // Add other fields as needed
            });
          } else {
            setError("Failed to load user details. Please try again later.");
          }
        } finally {
          setLoading(false); // Set loading to false when the fetch is complete
        }
      };
  
      fetchUserDetails();
    } else {
      // If no ID is provided, reset the form and states
      setFormData({
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        sex: "",
        countryOfBirth: "",
        // Add other fields as needed
      });
      setIsEditMode(false);
      setError("");
      setLoading(false);
    }
  }, [id]); // Re-run the effect when the `id` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Handling change for field:", name, "New value:", value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        sex: formData.sex.toUpperCase(), // Ensure enum values are uppercase
      };

      console.log("Payload for submission:", payload);

      if (isEditMode) {
        console.log("Updating user details for ID:", id);
        await axios.put(`http://localhost:8080/userdetails/${id}`, payload);
        console.log("User details updated successfully");
      } else {
        console.log("Adding new user details for user ID:", id);
        await axios.post(`http://localhost:8080/adduserdetails/${id}`, payload);
        console.log("User details added successfully:");
        
      }
      setSuccess(true);
      setTimeout(() => navigate(isEditMode ? `/viewuser/${id}` : "/"), 2000);
    } catch (error) {
      console.error("Error during form submission:", error);
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      console.log("Form submission process completed");
      setSubmitting(false);
    }
  };

  if (loading) {
    console.log("Loading spinner displayed");
    return (
      <div className="container text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  console.log("Rendering form");

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">
            {isEditMode ? "Edit User Details" : "Add User Details"}
          </h2>

          {error && <Alert color="danger">{error}</Alert>}
          {success && (
            <Alert color="success">
              {isEditMode ? "Details updated successfully!" : "Details added successfully!"}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Sex</label>
              <select
                className="form-select"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Country of Birth</label>
              <input
                type="text"
                className="form-control"
                name="countryOfBirth"
                value={formData.countryOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Zip Code</label>
              <input
                type="text"
                className="form-control"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  "Update Details"
                ) : (
                  "Add Details"
                )}
              </button>

              <Link
                to={isEditMode ? `/viewuser/${id}` : "/"}
                className="btn btn-outline-secondary"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}