import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AddBoat = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    seats: "",
    material: "",
    year: "",
    conditionOfBoat: "",
    available: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/addboat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add boat!");
      }

      navigate("/viewboats");
    } catch (error) {
      console.error("Error adding boat:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Add Boat</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Boat Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={formData.seats}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="material"
          placeholder="Material"
          value={formData.material}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="conditionOfBoat"
          placeholder="Condition of Boat"
          value={formData.conditionOfBoat}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            style={styles.checkbox}
          />
          Available
        </label>
        <button type="submit" style={styles.submitButton}>
          Submit
        </button>

        {/* Back to Boat Management Button */}
        <Link className="btn btn-primary my-2" to="/boatmanagementoverview">
          Back to Boat Management
        </Link>
      </form>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  checkbox: {
    transform: "scale(1.5)",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#00008B",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default AddBoat;
