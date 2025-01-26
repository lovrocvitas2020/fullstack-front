import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditUserNotes() {
    const [userNote, setUserNote] = useState({
        usernote: "",
        user: null
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadUserNote();
    }, []);

    const loadUserNote = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/user_notes/${id}`);
            setUserNote(result.data);
        } catch (error) {
            console.error("Error fetching user note:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserNote({ ...userNote, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/update_user_note/${id}`, userNote);
            navigate("/viewusernotes");
        } catch (error) {
            console.error("Error updating user note:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/delete_user_note/${id}`);
            navigate("/viewusernotes");
        } catch (error) {
            console.error("Error deleting user note:", error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit User Note</h2>
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
                                value={userNote.usernote}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
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
