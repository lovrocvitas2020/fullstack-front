import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from 'reactstrap'; // You can use any spinner library

export default function ViewUserDetails() {
  const [userDetails, setUserDetails] = useState({
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    sex: "",
    countryOfBirth: "",
    city: "",
    zipCode: "",
    userImage: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadUserDetails();
    } else {
      setError("Invalid user ID");
      setLoading(false);
    }
  }, [id]);

  const loadUserDetails = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/userdetails/${id}`);
      setUserDetails(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details data:", error);
      setError("Error fetching user details data");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">User Details</h2>

          {loading ? (
            <div className="text-center">
              <Spinner type="grow" color="primary" /> {/* Loading Spinner */}
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="card">
              <div className="card-header">
                Details of user id: {userDetails.id}
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <b>Phone Number:</b> {userDetails.phoneNumber}
                  </li>
                  <li className="list-group-item">
                    <b>Address:</b> {userDetails.address}
                  </li>
                  <li className="list-group-item">
                    <b>Date of Birth:</b> {userDetails.dateOfBirth}
                  </li>
                  <li className="list-group-item">
                    <b>Sex:</b> {userDetails.sex}
                  </li>
                  <li className="list-group-item">
                    <b>Country of Birth:</b> {userDetails.countryOfBirth}
                  </li>
                  <li className="list-group-item">
                    <b>City:</b> {userDetails.city}
                  </li>
                  <li className="list-group-item">
                    <b>Zip Code:</b> {userDetails.zipCode}
                  </li>
                  <li className="list-group-item">
                    <b>User Image:</b>
                    {userDetails.userImage ? (
                      <img
                        src={`data:image/jpeg;base64,${userDetails.userImage}`}
                        alt="User"
                        className="img-fluid"
                      />
                    ) : (
                      <div>No image available</div>
                    )}
                  </li>
                  {/* Add any other details you want to display */}
                </ul>
              </div>
            </div>
          )}
           <Link className="btn btn-success my-2" to={`/viewuser/${id}`}>
            Back to View User
          </Link>
        </div>
      </div>
    </div>
  );
}
