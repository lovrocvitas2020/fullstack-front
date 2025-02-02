import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate(); // Initialize the navigate function
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers(currentPage, pageSize, searchQuery);
  }, [currentPage, pageSize, searchQuery]);


  const loadWorklog = async () => {
    try {
      const responseWorklog = await axios.get("http://localhost:8080/worklogs");
      console.log("API Response:", responseWorklog.data); // Debugging line
    } catch (error) {
      console.error("Error fetching data for worklog:", error);
      alert("Failed fetching data for worklog");
    }
  };


  const loadUsers = async (page, size, query) => {
    setLoading(true);
    try {
      const params = query
        ? { name: query } // When searching, ignore pagination and fetch all matching users
        : { page, size }; // When no search, apply pagination
  
      const result = await axios.get("http://localhost:8080/users", { params });
  
      console.log("API Response:", result.data); // Debugging line
  
      const usersData = result.data._embedded 
        ? result.data._embedded.users.map(user => {
            const id = user._links.self.href.split("/").pop(); // Extract ID from URL
            return { ...user, id }; 
          }) 
        : [];
  
      const totalPages = result.data.page ? result.data.page.totalPages : 0;
  
      console.log("Fetched User IDs:", usersData.map(user => user.id)); // Debugging line
  
      setUsers(usersData);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
      setLoading(false);
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
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
      loadUsers(currentPage, pageSize, searchQuery); // Reload users after deletion with current page and page size
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user');
    }
  };

  const generatexls = async () => {
    try {
      const response = await axios.get("http://localhost:8080/xls", {
        responseType: "arraybuffer" // Set the response type to arraybuffer for file download
      });
  
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // Get current timestamp
      const timestamp = new Date().toISOString().replace(/[:\-]/g, '').replace(/\..+/, '');
  
      // Create a link element to simulate downloading the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `users_${timestamp}.xlsx`; // Set the filename with timestamp
      document.body.appendChild(link);
      link.click(); // Simulate the click to trigger the download
      document.body.removeChild(link); // Clean up the link element
    } catch (error) {
      console.error("Error fetching data for xls:", error);
      alert("Failed fetching data for xls");
    }
  };

  // Get worklog data

 

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
            Add New User
          </Link>
          <Link className="btn btn-outline-dark" to="/addusernotes">
            Add User Notes
          </Link>
          <Link className="btn btn-outline-dark" to="/viewusernotes">
            View User Notes
          </Link>
          <Link className="btn btn-outline-dark" to="/viewworklog">
            View Work Log
          </Link>
          <button className="btn btn-outline-primary" onClick={generatexls}>
            Generate Report XLS
          </button> {/* Start generate xls button */}
          <button className="btn btn-outline-dark" onClick={logOff}>
            Log Off
          </button>
        </div>

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
                <th scope="col">Primary Key</th>
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

<div className="d-flex justify-content-between align-items-center">
  <button className="btn btn-secondary" onClick={handlePreviousPage} disabled={currentPage === 0}>
    Previous
  </button>

  {/* Page Numbers */}
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
  );
}
