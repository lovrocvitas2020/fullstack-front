import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBoat = () => {
  const { id } = useParams(); // Get the boat ID from the URL
  const navigate = useNavigate();
  const [boat, setBoat] = useState({
    name: "",
    type: "",
    seats: 0,
    material: "",
    year: "",
    conditionOfBoat: "",
    available: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoat = async () => {
      try {
        const response = await fetch(`http://localhost:8080/viewboat/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch boat details!");
        }
        const data = await response.json();
        setBoat(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBoat();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoat({ ...boat, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setBoat({ ...boat, available: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/editboat/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boat),
      });
      if (!response.ok) {
        throw new Error("Failed to update boat!");
      }
      navigate("/viewboats"); // Redirect to the boats list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading boat details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1>Edit Boat</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={boat.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={boat.type}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Seats</label>
          <input
            type="number"
            name="seats"
            value={boat.seats}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Material</label>
          <input
            type="text"
            name="material"
            value={boat.material}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={boat.year}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Condition</label>
          <input
            type="text"
            name="condition"
            value={boat.conditionOfBoat}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={boat.available}
              onChange={handleCheckboxChange}
            />{" "}
            Available
          </label>
        </div>
        <button type="submit" style={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  form: {
    maxWidth: "400px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EditBoat;
