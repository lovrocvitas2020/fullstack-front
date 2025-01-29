import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditUserNotes() {
    const [userNote, setUserNote] = useState({
        usernote: "",
        user: null
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUserNote();
        loadUser();
    }, [id]);

    const loadUserNote = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/user_notes/${id}`);
            console.log("Debug: Fetched user entity model:", result.data);
            const extracteduser = result.data.content; // Adjust this line if necessary based on actual structure
            console.log("Debug: Extracted user:", extracteduser);

            setUser(user);
        } catch (error) {
            console.error("Error fetching user note:", error);
            setError("Failed to load user note.");
        } finally {
            setLoading(false);
        }
    };

    

    

    const loadUser = async () => {
        try {
          
            const userId = userNote.user ? userNote.user.id : null; // Use user ID from userNote if available
            if (!userId) {
                throw new Error("User ID not found in userNote");
            }


            console.log("Debug: Fetching user with ID:", userId);
            const result = await axios.get(`http://localhost:8080/user/${userId}`);
            console.log("Debug: Fetched user:", result.data);

            setUser(result.data);
           
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserNote({ ...userNote, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem("authToken"); // Get the auth token from localStorage
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        try {

            console.log("Debug: Received response userNote.user:", userNote.user);
            // Ensure user field is not null
            if (!userNote.user) {
                userNote.user = user; // Set User so that the right user_note is updated
            }
            await axios.put(`http://localhost:8080/update_user_note/${id}`, userNote,config);
            navigate("/viewusernotes");
        } catch (error) {
            console.error("Error updating user note:", error);
            setError("Failed to update user note.");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/delete_user_note/${id}`);
            navigate("/viewusernotes");
        } catch (error) {
            console.error("Error deleting user note:", error);
            setError("Failed to delete user note.");
        }
    };

    if (loading) {
        return <div className="container text-center mt-4"><h4>Loading user note...</h4></div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit User Note</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleUpdate}>
                        <div className="mb-3">
                            <label htmlFor="UserNote" className="form-label">
                                User Note
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter user note"
                                name="usernote"
                                value={userNote.usernote || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-outline-primary" disabled={!userNote.usernote}>
                            Update
                        </button>
                        <button type="button" className="btn btn-outline-danger mx-2" onClick={handleDelete}>
                            Delete
                        </button>
                        <button type="button" className="btn btn-outline-secondary mx-2" onClick={() => navigate("/viewusernotes")}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
