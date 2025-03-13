import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


function MembersManagemenzOverview() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-start">
      <h1>Members Management Overview</h1>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link to="/userlist" className="btn btn-primary mx-2">1. View Users</Link>
          </li>
          <li className="mb-2">
            <Link to="/adduser" className="btn btn-primary mx-2">2. Add User</Link>
          </li>
        
      
        
          
      
          {/* Add more links as needed */}
          <li className="mb-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default MembersManagemenzOverview;
