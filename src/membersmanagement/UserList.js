import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]); // ✅ Default to an empty array
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page) => {
    try {
      const result = await axios.get(`http://localhost:8080/users`, {
        params: { page: page, size: pageSize },
      });
  
      console.log("API Response:", result.data); // Debugging response
  
      if (result.data && result.data._embedded && result.data._embedded.userList) {
        setUsers(result.data._embedded.userList); // ✅ Corrected key for users
        setTotalPages(result.data.page.totalPages || 1); // ✅ Extract total pages correctly
      } else {
        setUsers([]);
        setError("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      setUsers([]);
      setError("Failed to load users");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">User List</h2>
          <Link className="btn btn-primary mb-3" to="/membersmanagementoverview">
                  🏠 Back to Member Management Overview
                </Link>
          
          {error && <div className="alert alert-danger">{error}</div>} {/* ✅ Display error messages */}

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role || "N/A"}</td> {/* ✅ Handle undefined role */}
                    <td>
                      <Link className="btn btn-primary mx-2" to={`/viewuser/${user.id}`}>
                        View
                      </Link>
                      <Link className="btn btn-warning mx-2" to={`/edituser/${user.id}`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={handlePreviousPage} disabled={currentPage === 0}>
              Previous
            </button>
            <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
