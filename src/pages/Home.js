import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);
  

  const loadUsers = async (page, size) => {
    setLoading(true);
    try {
      const result = await axios.get("http://localhost:8080/users",
        {
          params:{
            page:page,
            size:size
          },
        }
      );

    console.log("API Response:", result.data); // Debugging line

    const usersData = result.data._embedded.users.map(user => {
      const id = user._links.self.href.split("/").pop(); // Extract the ID from the URL
      return { ...user, id }; // Add the ID to the user object
    });
   
      console.log("t1 result.data: "+result.data);
      console.log("t1 result.data.totalPages: "+result.data.totalPages);
     
      const totalPages = result.data.page.totalPages;

      console.log("Fetched User IDs:", usersData.map(user => user.id)); // Debugging line

     

      setUsers(usersData); // result.data
      setTotalPages(totalPages); //  result.data.totalPages
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
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


  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/user/${id}`);
      // Reload users after deletion with current page and page size
      loadUsers(currentPage, pageSize);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user');
    }
  };

  console.log("Home.js id: "+id);

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
                <th scope="row">{index + 1 + currentPage * pageSize}</th>
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
  );
}
