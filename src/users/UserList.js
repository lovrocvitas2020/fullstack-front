import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page) => {
    try {
      const result = await axios.get(`http://localhost:8080/users`, {
        params: {
          page: page,
          size: pageSize,
        },
      });
      setUsers(result.data.content);
      setTotalPages(result.data.totalPages);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">User List</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link className="btn btn-primary" to={`/viewuser/${user.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
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
