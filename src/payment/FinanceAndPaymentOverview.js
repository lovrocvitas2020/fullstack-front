import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


function FinanceAndPaymentOverview() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-start">
      <h1>Finance and Payment Overview</h1>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link to="/viewgeneratedpaymentslips" className="btn btn-primary mx-2">1. Generated Payment Slips</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewpaymentslips" className="btn btn-primary mx-2">2. Payment Slip Form</Link>
          </li>
          <li className="mb-2">
             <Link to="/viewdocumenttemplates" className="btn btn-primary mx-2">3. Document Templates</Link>
          </li>
          <li className="mb-2">
             <Link to="/batchstartscreen" className="btn btn-primary mx-2">4. Batch Jobs</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewgeneratedpaymentslips" className="btn btn-primary mx-2">5. Generated Payment Slips List</Link>
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

export default FinanceAndPaymentOverview;
