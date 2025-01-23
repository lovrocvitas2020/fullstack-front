import React, { useState, useEffect } from 'react'; // Added useEffect import
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function AddUserNotes() {
    const [userNote, setUserNote] = useState({
      usernote: "",
      user: {
        id: ""
      }
    });

  const [users, setUsers] = useState([]);

  const { usernote, user_id } = userNote;



  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:8080/users");
    setUsers(result.data);
  }; // Closed the loadUsers function

  const onInputChange = e => {
    if (e.target.name === "usernote") {
      setUserNote({ ...userNote, usernote: e.target.value });
    } else if (e.target.name === "user_id") {
      setUserNote({ ...userNote, user: { ...userNote.user, id: e.target.value } });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    await axios.post("http://localhost:8080/add_user_notes", userNote); // Ensure this URL matches your backend endpoint
    navigate("/");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Add User Note</h2>

          <form onSubmit={e => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="UserNote" className="form-label">User Note</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter user note"
                name="usernote"
                value={usernote}
                onChange={e => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="UserID" className="form-label">User ID</label>
              <select
                className="form-control"
                name="user_id"
                value={user_id}
                onChange={e => onInputChange(e)}
              >
                <option value="">Select a User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} (ID: {user.id})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <Link className="btn btn-secondary my-2" to="/">Cancel</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
