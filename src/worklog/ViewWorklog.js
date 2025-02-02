import React, { useState, useEffect, useCallback  } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewWorklog = () => {
    const [users, setUsers] = useState([]);
    const [worklogs, setWorklogs] = useState([]);
    const [error, setError] = useState(null);
    const [newWorklog, setNewWorklog] = useState({
        user: '',
        workDate: '',
        startHour: '',
        endHour: '',
        workDescription: ''
    });
    const [editWorklog, setEditWorklog] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            fetchWorklogs();
        }
    }, [users]);

    const loadUsers = async () => {
        try {
            let url = "http://localhost:8080/users";
            let allUsers = [];
            
            // Fetch until all pages are loaded
            while (url) {
                const result = await axios.get(url);
                const usersData = result.data._embedded?.users?.map(user => ({
                    ...user,
                    id: user._links?.self?.href?.split("/")?.pop() || "Unknown"
                })) || [];
   
                allUsers = [...allUsers, ...usersData];
                
                // Check for next page link
                url = result.data._links?.next?.href || null;
            }
   
            console.log("Fetched All Users:", allUsers);
            setUsers(allUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users.");
        }
    };

    const fetchWorklogs = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/viewworklog');

            console.log("fetchWorklogs");
    
            const worklogsWithUserData = response.data.map(worklog => {

                
                console.log("worklog.user:", worklog.user);   
              /*  console.log("worklog.user.id:", worklog.user.id); this is error  */
              

            const userId = typeof worklog.user === "object" ? worklog.user.id : worklog.user;

            const matchedUser = users.find(user => String(user.id) === String(userId));
                

                console.log("userId:", userId);
                console.log("matchedUser:", matchedUser);
    
                return {
                    ...worklog,
                    user: matchedUser || { id: userId, username: 'Unknown' }
                };
            });
    
            setWorklogs(worklogsWithUserData);
        } catch (error) {
            console.error('Error fetching worklogs:', error);
            setError('Failed to load worklogs.');
        }
    }, [users]); 
    

    const createWorklog = async (e) => {
        e.preventDefault();
        try {
            const worklogData = { ...newWorklog, user: Number(newWorklog.user) };
            const response = await axios.post("http://localhost:8080/add_worklog", worklogData);

            console.debug("createWorklog response.data.user:"+response.data.user);
            console.debug("createWorklog Number(newWorklog.user):"+Number(newWorklog.user));
    
            // Find the user object based on the response
           const matchedUser = users.find(user => String(user.id) === String(response.data.user)) || { id: response.data.user, username: 'Unknown' };

            console.debug("createWorklog matchedUser:"+matchedUser);
    
            setWorklogs([...worklogs, {
                ...response.data,
                user: matchedUser
            }]);
    
            setNewWorklog({ user: '', workDate: '', startHour: '', endHour: '', workDescription: '' });
        } catch (error) {
            console.error('Error creating worklog:', error);
            setError('Failed to create worklog.');
        }
    };
    

    const updateWorklog = async (e) => {
        e.preventDefault();
        const { id, user, workDate, startHour, endHour, workDescription } = editWorklog;
        try {
            await axios.put(`http://localhost:8080/update_worklog/${id}`, {
                user: user.id,
                workDate,
                startHour,
                endHour,
                workDescription
            });
            setWorklogs(worklogs.map(wl => (wl.id === id ? { ...wl, ...editWorklog } : wl)));
            setEditWorklog(null);
        } catch (error) {
            console.error('Error updating worklog:', error);
            setError('Failed to update worklog.');
        }
    };

    const deleteWorklog = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/delete_worklog/${id}`);
            setWorklogs(worklogs.filter(wl => wl.id !== id));
        } catch (error) {
            console.error('Error deleting worklog:', error);
            setError('Failed to delete worklog.');
        }
    };

    const handleEditClick = (worklog) => {
        setEditWorklog(worklog);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Worklogs</h1>
            <Link className="btn btn-primary mb-3" to="/home">🏠 Back to Home</Link>

            {error && <div className="alert alert-danger">{error}</div>}

           {/* Worklog List */}
            <div className="card shadow p-3 mb-4">
                <h3>Existing Worklogs</h3>
                <ul className="list-group">
                    {worklogs.length > 0 ? (
                        worklogs.map((worklog) => (
                            <li key={worklog.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {worklog.workDate} - {worklog.startHour} to {worklog.endHour} - <strong>{worklog.username || 'Unknown'}</strong>
                                    <br />
                                    {worklog.workDescription}
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-warning mx-2" onClick={() => handleEditClick(worklog)}>✏️ Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => deleteWorklog(worklog.id)}>🗑️ Delete</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center">No worklogs available</li>
                    )}
                </ul>
            </div>

            {/* Create or Update Worklog Form */}
            <div className="card shadow p-4">
                <h3 className="text-center">{editWorklog ? 'Update Worklog' : 'Create New Worklog'}</h3>
                <form onSubmit={editWorklog ? updateWorklog : createWorklog}>
                    <div className="mb-3">
                        <label className="form-label">User</label>
                        <select
                            className="form-select"
                            value={editWorklog ? String(editWorklog.user.id) : String(newWorklog.user)}
                            onChange={(e) => {
                                const userId = e.target.value;
                                const selectedUser = users.find(user => String(user.id) === String(userId));
                                if (editWorklog) {
                                    setEditWorklog({ ...editWorklog, user: selectedUser });
                                } else {
                                    setNewWorklog({ ...newWorklog, user: userId });
                                }
                            }}
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Work Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={editWorklog ? editWorklog.workDate : newWorklog.workDate}
                            onChange={(e) => {
                                const workDate = e.target.value;
                                if (editWorklog) {
                                    setEditWorklog({ ...editWorklog, workDate });
                                } else {
                                    setNewWorklog({ ...newWorklog, workDate });
                                }
                            }}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Start Hour</label>
                            <input
                                type="time"
                                className="form-control"
                                value={editWorklog ? editWorklog.startHour : newWorklog.startHour}
                                onChange={(e) => {
                                    const startHour = e.target.value;
                                    if (editWorklog) {
                                        setEditWorklog({ ...editWorklog, startHour });
                                    } else {
                                        setNewWorklog({ ...newWorklog, startHour });
                                    }
                                }}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">End Hour</label>
                            <input
                                type="time"
                                className="form-control"
                                value={editWorklog ? editWorklog.endHour : newWorklog.endHour}
                                onChange={(e) => {
                                    const endHour = e.target.value;
                                    if (editWorklog) {
                                        setEditWorklog({ ...editWorklog, endHour });
                                    } else {
                                        setNewWorklog({ ...newWorklog, endHour });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Work Description</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Describe the work done"
                            value={editWorklog ? editWorklog.workDescription : newWorklog.workDescription}
                            onChange={(e) => {
                                const workDescription = e.target.value;
                                if (editWorklog) {
                                    setEditWorklog({ ...editWorklog, workDescription });
                                } else {
                                    setNewWorklog({ ...newWorklog, workDescription });
                                }
                            }}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">{editWorklog ? 'Update Worklog' : 'Create Worklog'}</button>
                </form>
            </div>
        </div>
    );
};

export default ViewWorklog;
