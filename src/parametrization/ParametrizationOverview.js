import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ParametrizationOverview() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-start">
      <h1>Parametrization Overview</h1>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link to="/viewprojects" className="btn btn-primary mx-2">View Projects</Link>
          </li>
          <li className="mb-2">
            <Link to="/task" className="btn btn-primary mx-2">Task</Link>
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

export default ParametrizationOverview;
