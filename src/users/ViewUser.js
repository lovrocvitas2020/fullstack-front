import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewUser() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  console.log("Extracted ID:", id); // Debugging line

  useEffect(() => {
    if (id) {
      loadUser();
    } else {
      setError("Invalid user ID");
      setLoading(false);
    }
  }, [id]);

  console.log("ViewUser id: " + id);

  const loadUser = async () => {
    try {
      console.log("Debug: Sending GET request to http://localhost:8080/user/" + id);
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      console.log("Debug: Received response", result.data);
      setUser(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Error fetching user data");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">User Details</h2>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="card">
              <div className="card-header">
                Details of user id: {user.id}
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <b>Name:</b> {user.name}
                  </li>
                  <li className="list-group-item">
                    <b>Username:</b> {user.username}
                  </li>
                  <li className="list-group-item">
                    <b>Email:</b> {user.email}
                  </li>
                </ul>
              </div>
            </div>
          )}
          <Link className="btn btn-primary my-2" to="/home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
