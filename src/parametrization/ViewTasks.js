import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    dueDate: '',
    status: 'PENDING', // Default status
  });

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get('http://localhost:8080/viewtasks');
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/addtask', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ taskName: '', description: '', dueDate: '', status: 'PENDING' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  
  return (
    <div className="container mt-5">
      <h1>All Tasks</h1>
      <form onSubmit={handleAddTask} className="mb-4">
        <h2>Add New Task</h2>
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            className="form-control"
            id="taskName"
            name="taskName"
            value={newTask.taskName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            className="form-control"
            id="dueDate"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            className="form-control"
            id="status"
            name="status"
            value={newTask.status}
            onChange={handleInputChange}
            required
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>Task Name:</strong> {task.taskName}<br />
            <strong>Description:</strong> {task.description}<br />
            <strong>Status:</strong> {task.status}<br />
            <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}<br />
            <strong>Project:</strong> {task.project ? task.project.name : 'No project assigned'}<br />
            <strong>Assigned Users:</strong>
            {task.userTasks && task.userTasks.length > 0 ? (
              <ul>
                {task.userTasks.map(userTask => (
                  <li key={userTask.id}>{userTask.user.username}</li>
                ))}
              </ul>
            ) : (
              <p>No users assigned</p>
            )}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewTasks;
