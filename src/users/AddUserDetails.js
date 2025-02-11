import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner, Alert } from "reactstrap";

const initialFormData = {
  phoneNumber: "",
  address: "",
  dateOfBirth: "",
  sex: "",
  countryOfBirth: "",
  city: "",
  zipCode: "",
  userImage: null
};

export default function AddUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/userdetails/${id}`);
          setFormData({
            ...response.data,
            dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.slice(0, 10) : "",
            userImage: null // Reset userImage to null since we don't fetch images as Base64
          });
          setIsEditMode(true);
          setError("");
        } catch (error) {
          if (error.response?.status === 404) {
            setIsEditMode(false);
            setError("No user details found. Please add details.");
            setFormData(initialFormData);
          } else {
            setError("Failed to load user details. Please try again later.");
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserDetails();
    } else {
      setFormData(initialFormData);
      setIsEditMode(false);
      setError("");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "userImage") {
      setFormData((prev) => ({
        ...prev,
        userImage: files[0], // Handle file input
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/userdetails/${id}`, formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`http://localhost:8080/adduserdetails/${id}`, formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setSuccess(true);
      setTimeout(() => navigate(isEditMode ? `/viewuser/${id}` : "/"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

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

            <div className="mb-3">
              <label className="form-label">User Image</label>
              <input
                type="file"
                className="form-control"
                name="userImage"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? <Spinner size="sm" /> : isEditMode ? "Update Details" : "Add Details"}
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
