import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent'

function ParametrizationOverview() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-start">
      <h1>Administration Overview</h1>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link to="/viewprojects" className="btn btn-primary mx-2">1. View Projects</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewtasks" className="btn btn-primary mx-2">2. Task</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewpaymentslips" className="btn btn-primary mx-2">3. Payment Slips</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewdocumenttemplates" className="btn btn-primary mx-2">4. Document Templates</Link>
          </li>
          <li className="mb-2">
            <Link to="/batchstartscreen" className="btn btn-primary mx-2">5. Batch Jobs</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewgeneratedpaymentslips" className="btn btn-primary mx-2">6. Generated Payment Slips List</Link>
          </li>
          <li className="mb-2">
            <Link to="/userlist" className="btn btn-primary mx-2">7. User List</Link>
          </li>
        
           {/*  <li className="mb-2">           <MapComponent /></li>  */}
      
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

export default ParametrizationOverview;
