import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function
  const { id } = useParams();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/users");
      setUsers(result.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8080/user/${id}`);
    loadUsers();
  };

  const logOff = () => {
    // Clear any authentication tokens or session data
    // For example, remove the token from local storage
    localStorage.removeItem("authToken");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="py-4">
        <div className="d-flex gap-2 mb-3">
          <Link className="btn btn-outline-dark" to="/adduser">
            Add User
          </Link>
          <Link className="btn btn-outline-dark" to="/addusernotes">
            Add User Notes
          </Link>
          <Link className="btn btn-outline-dark" to="/viewusernotes">
            View User Notes
          </Link>
          <button className="btn btn-outline-dark" onClick={logOff}>
            Log Off
          </button>
        </div>

        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">S.N</th>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Link
                    className="btn btn-primary mx-2"
                    to={`/viewuser/${user.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/edituser/${user.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
