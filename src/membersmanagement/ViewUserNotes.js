import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export default function ViewUserNotes() {
    const [userNotes, setUserNotes] = useState([]);

    useEffect(() => {
        loadUserNotes();
    }, []);

    console.log("Debug ViewUserNotes");

    const loadUserNotes = async () => {
        try {
            console.log("Debug: Sending GET request to http://localhost:8080/user_notes");
            const result = await axios.get(`http://localhost:8080/user_notes`);
            console.log("Debug: Received response result.data->", result.data);
            if (result.data.length === 0) {
                console.warn("Warning: No data returned from the server");
            }
            setUserNotes(result.data);
        } catch (error) {
            console.error("Error fetching user notes:", error);
            console.log("Debug: Error details", error.response);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">User Notes View</h2>

                    <div className="card">
                        <div className="card-header">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">User Note</th>
                                        <th scope="col">User Note ID</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userNotes.map((note, index) => (
                                        <tr key={index}>
                                            <td>{note.usernote}</td>
                                            <td>{note.id}</td>
                                            <td>
                                                <Link
                                                    className="btn btn-outline-primary mx-2"
                                                    to={`/editusernotes/${note.id}`}
                                                >
                                                    Edit User Note
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Link className="btn btn-primary my-2" to={"/home"}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
