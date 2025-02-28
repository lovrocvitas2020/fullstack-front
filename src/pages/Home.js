import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import './Home.css';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log('User:', user); // Log user to verify it's being set correctly
    if (user) {
      console.log('Username:', user.username);
      console.log('Email:', user.email);
    }

    loadUsers(currentPage, pageSize, searchQuery);
  }, [currentPage, pageSize, searchQuery, user]);

  const loadUsers = async (page, size, query) => {
    setLoading(true);
    try {
      const params = query ? { name: query } : { page, size };
      const result = await axios.get("http://localhost:8080/users", { params });
      const usersData = result.data._embedded && result.data._embedded.userList
        ? result.data._embedded.userList.map(user => {
            const id = user._links.self.href.split("/").pop();
            return { ...user, id };
          })
        : [];
      const totalPages = result.data.page ? result.data.page.totalPages : 0;
      setUsers(usersData);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
      setLoading(false);
      setUsers([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
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

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/user/${id}`);
      loadUsers(currentPage, pageSize, searchQuery);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user');
    }
  };

  const generatexls = async () => {
    try {
      const response = await axios.get("http://localhost:8080/xls", {
        responseType: "arraybuffer"
      });
      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const timestamp = new Date().toISOString().replace(/[:\-]/g, '').replace(/\..+/, '');
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `users_${timestamp}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching data for xls:", error);
      alert("Failed fetching data for xls");
    }
  };

  const logOff = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="user-info-left">
        {user && (
          <div>
            <span>Welcome, {user.username}!</span>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
      <div className="py-4">
        <div className="row">
          <div className="col-md-3">
            <div className="d-flex flex-column gap-2 mb-3">
              <Link className="btn custom-btn" to="/adduser">
                Add New User
              </Link>
              <Link className="btn custom-btn" to="/addusernotes">
                Add User Notes
              </Link>
              <Link className="btn custom-btn" to="/viewusernotes">
                View User Notes
              </Link>
              <Link className="btn custom-btn" to="/viewworklog">
                View Work Log
              </Link>
              <Link className="btn custom-btn" to="/parametrizationoverview">
                Parametrization Overview
              </Link>
              <button className="btn custom-btn" onClick={generatexls}>
                Generate Report XLS
              </button>
              <button className="btn custom-btn" onClick={logOff}>
                Log Off
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="table border shadow">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <th scope="row">{index + 1 + currentPage * pageSize}</th>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <Link className="btn btn-primary mx-2" to={`/viewuser/${user.id}`}>
                          View
                        </Link>
                        <Link className="btn btn-outline-primary mx-2" to={`/edituser/${user.id}`}>
                          Edit
                        </Link>
                        <button className="btn btn-danger mx-2" onClick={() => deleteUser(user.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="pagination">
              <button className="btn btn-secondary" onClick={handlePreviousPage} disabled={currentPage === 0}>
                Previous
              </button>
              <div>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page}
                    className={`btn mx-1 ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
              <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
