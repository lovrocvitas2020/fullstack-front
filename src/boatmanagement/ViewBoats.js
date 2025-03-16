import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 

const ViewBoats = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const boatsPerPage = 5; // Number of boats per page

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const response = await fetch("http://localhost:8080/viewboats");
        if (!response.ok) throw new Error("Failed to fetch boats!");
        const data = await response.json();
        setBoats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, []);

  if (loading) return <p>Loading boats...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDeleteBoat = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/deleteboat/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete boat!");
      setBoats((prevBoats) => prevBoats.filter((boat) => boat.id !== id));
    } catch (error) {
      console.error("Error deleting boat:", error);
    }
  };

  const handleEditBoat = (id) => {
    navigate(`/editboat/${id}`);
  };

  // **Pagination Logic**
  const indexOfLastBoat = currentPage * boatsPerPage;
  const indexOfFirstBoat = indexOfLastBoat - boatsPerPage;
  const currentBoats = boats.slice(indexOfFirstBoat, indexOfLastBoat);

  const totalPages = Math.ceil(boats.length / boatsPerPage);

  return (
    <div style={styles.container}>
      <h1>View Boats</h1>
      <div style={styles.actions}>
        <Link className="btn btn-primary my-2" to="/boatmanagementoverview">
          Back to Boat Management
        </Link>
      </div>
      {boats.length === 0 ? (
        <p>No boats available.</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Seats</th>
                <th>Material</th>
                <th>Year</th>
                <th>Condition</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBoats.map((boat) => (
                <tr key={boat.id}>
                  <td>{boat.id}</td>
                  <td>{boat.name}</td>
                  <td>{boat.type}</td>
                  <td>{boat.seats}</td>
                  <td>{boat.material}</td>
                  <td>{boat.year}</td>
                  <td>{boat.conditionOfBoat}</td>
                  <td>{boat.available ? "Yes" : "No"}</td>
                  <td>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEditBoat(boat.id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteBoat(boat.id)}
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={styles.pageButton}
            >
              ⬅ Previous
            </button>
            <span> Page {currentPage} of {totalPages} </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={styles.pageButton}
            >
              Next ➡
            </button>
          </div>
        </>
      )}

      {/* Add Boat Button */}
      <Link to="/addboat" style={styles.addButton}>
        ➕ Add Boat
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  actions: {
    marginBottom: "20px",
  },
  addButton: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
    marginTop: "20px",
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
  },
  pageButton: {
    padding: "5px 10px",
    backgroundColor: "#008CBA",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

export default ViewBoats;
