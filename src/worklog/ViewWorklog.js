import React, { useState, useEffect, useCallback  } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewWorklog = () => {
    const [users, setUsers] = useState([]);
    const [worklogs, setWorklogs] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newWorklog, setNewWorklog] = useState({
        user: '',
        workDate: '',
        startHour: '',
        endHour: '',
        hourSum: '',
        workDescription: ''
    });
    const [editWorklog, setEditWorklog] = useState(null);

    // change A
    const [filteredWorklogs, setFilteredWorklogs] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const worklogsPerPage = 5; // Set the number of worklogs per page


    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        loadUsers().then(() => {
            console.log("Users loaded, now fetching worklogs...");
            fetchWorklogs();
        });
    }, []);

    // change A - filtering 
    useEffect(() => {
        console.debug("Filtering Worklogs...");
        console.debug("Selected User ID:", selectedUserId);
        console.debug("All Worklogs before filtering:", worklogs);
    
        if (selectedUserId) {
            const filtered = worklogs.filter(worklog => {
                console.debug(`Checking Worklog ID: ${worklog.id}, User ID: ${worklog.user.id}, Username: ${worklog.user.username}`);
                return String(worklog.user.id) === String(selectedUserId);
            });
    
            console.debug("Filtered Worklogs:", filtered);
            setFilteredWorklogs(filtered);
        } else {
            setFilteredWorklogs(worklogs);
        }
    }, [selectedUserId, worklogs]);


        // Enhanced duration calculation
    const calculateDuration = (start, end) => {
        const startTime = new Date(`1970-01-01T${start}`);
        const endTime = new Date(`1970-01-01T${end}`);
        return Math.round((endTime - startTime) / 1000); // Return seconds
    };



    const loadUsers = async () => {
        try {
            let url = "http://localhost:8080/users";
            let allUsers = [];
            
            while (url) {
                console.log("Fetching from URL:", url);
                const result = await axios.get(url);
                console.log("Raw Response Data:", result.data);
    
                // Check if `_embedded` contains `userList` instead of `users`
                const usersData = result.data._embedded?.userList?.map(user => ({
                    ...user,
                    id: user._links?.self?.href?.split("/").pop() || "Unknown"
                })) || [];
    
                allUsers = [...allUsers, ...usersData];
    
                url = result.data._links?.next?.href || null;
            }
    
            console.log("Fetched All Users:", allUsers);
            setUsers(allUsers); // Update state with fetched users
            return allUsers;  // Return data to ensure fetchWorklogs runs correctly
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users.");
        }
    };

    const fetchWorklogs = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/viewworklog');
    
            console.log("fetchWorklogs response:", response.data);
    
            const worklogsWithUserData = response.data.map(worklog => ({
                ...worklog,
                user: {
                    id: worklog.userId, 
                    username: worklog.username
                }
            }));
    
            console.log("Processed Worklogs:", worklogsWithUserData);
    
            setWorklogs(worklogsWithUserData);
        } catch (error) {
            console.error('Error fetching worklogs:', error);
            setError('Failed to load worklogs.');
        }
    }, []);
    
    

    const createWorklog = async (e) => {
        e.preventDefault();
        try {
            const worklogData = { ...newWorklog, user: Number(newWorklog.user) };
            const response = await axios.post("http://localhost:8080/add_worklog", worklogData);
    
            console.debug("createWorklog response:", response.data);
    
            // Ensure correct user mapping
            const matchedUser = users.find(user => String(user.id) === String(response.data.user)) || { id: response.data.user, username: 'Unknown' };
    
            console.debug("createWorklog matchedUser:", matchedUser);
    
            setWorklogs([...worklogs, {
                ...response.data,
                user: matchedUser
            }]);

            // Fetch the updated worklogs
            await fetchWorklogs();
    
            setNewWorklog({ user: '', workDate: '', startHour: '', endHour: '', hourSum: '', workDescription: '' });
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


    // Pagination Logic
    const indexOfLastWorklog = currentPage * worklogsPerPage;
    const indexOfFirstWorklog = indexOfLastWorklog - worklogsPerPage;
    const currentWorklogs = worklogs.slice(indexOfFirstWorklog, indexOfLastWorklog);

    const nextPage = () => {
        if (currentPage < Math.ceil(worklogs.length / worklogsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

     // New: Format duration display
     const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };


    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Worklogs</h1>
            <Link className="btn btn-primary mb-3" to="/home">🏠 Back to Home</Link>

            {error && <div className="alert alert-danger">{error}</div>}

        

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

            <h3>Search Worklogs</h3>

            <div className="mb-3">
                        <label className="form-label">Worklog User</label>

                        <select
                            className="form-select"
                            value={selectedUserId}
                            onChange={(e) => {
                                const newUserId = e.target.value;
                                console.debug("Selected User ID:", newUserId);
                                setSelectedUserId(newUserId);
                            }}
                        >
                            <option value="">All Users</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>

                    </div>

               {/* Worklog List */}
               <div className="card shadow p-3 mb-4">
                <h3>Existing Worklogs</h3>
                <ul className="list-group">

                        {filteredWorklogs.length > 0 ? (
                                filteredWorklogs.slice(indexOfFirstWorklog, indexOfLastWorklog).map((worklog) => {
                                    console.debug("Rendering Worklog:", worklog);

                                    return (
                                        <li key={worklog.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                 Username: {worklog.user?.username || "Unknown"}
                                                <br />
                                                {worklog.workDate} - {worklog.startHour} to {worklog.endHour} - <strong>{worklog.user?.username || 'Unknown'}</strong>
                                                <br />
                                                Total Hours Worked: {formatDuration(worklog.durationSeconds)}
                                                <br />
                                                Work Description:{worklog.workDescription}
                                            </div>
                                            <div>
                                                <button className="btn btn-sm btn-warning mx-2" onClick={() => handleEditClick(worklog)}>✏️ Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteWorklog(worklog.id)}>🗑️ Delete</button>
                                            </div>
                                        </li>
                                    );
                                })
                    ) : (
                        <li className="list-group-item text-center">No worklogs available</li>
                    )}


                    </ul>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>
                        ◀ Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(worklogs.length / worklogsPerPage)}</span>
                    <button className="btn btn-secondary" onClick={nextPage} disabled={currentPage >= Math.ceil(worklogs.length / worklogsPerPage)}>
                        Next ▶
                    </button>
                </div>     

            </div>                

        </div>
    );
};

export default ViewWorklog;
