import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";


export default function ViewUserNotes() {
    const [user_notes, setUserNotes] = useState({
      usernote: "",
      user_id: "",
    });
  
    const { id } = useParams();

    
  useEffect(() => {
    loadUserNotes();
  }, []);


  const loadUserNotes = async () => {
    const result = await axios.get(`http://localhost:8080/usernotes`);
    setUserNotes(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">User Notes</h2>

          <div className="card">
            <div className="card-header">
              Details of user id : {user.id}
              <ul className="list-group list-group-flush">

                <li className="list-group-item">
                  <b>User Note:</b>
                  {user_notes.usernote}
                </li>

                <li className="list-group-item">
                  <b>User_id:</b>
                  {user_notes.user_id}
                </li>
              
              
              </ul>
            </div>
          </div>
          <Link className="btn btn-primary my-2" to={"/"}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}