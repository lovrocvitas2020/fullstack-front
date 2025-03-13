import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


function BoatManagementOverview() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-start">
      <h1>Boat Management Overview</h1>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link to="/viewboats" className="btn btn-primary mx-2">1. View Boats</Link>
          </li>
          <li className="mb-2">
            <Link to="/addboat" className="btn btn-primary mx-2">2. Add Boat</Link>
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

export default BoatManagementOverview;
