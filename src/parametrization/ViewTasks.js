import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    dueDate: '',
    status: 'PENDING', // Default status
    project_id: '' // New project_id field
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Number of tasks per page

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get('http://localhost:8080/viewtasks');
        setTasks(response.data);

        const projectsResponse = await axios.get('http://localhost:8080/viewprojects');
        console.log('Projects fetched:', projectsResponse.data); // Debugging statement
        setProjects(projectsResponse.data);

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
      [name]: name === "project_id" ? parseInt(value, 10) : value, // Ensure project_id is an integer
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    console.log('New task payload:', newTask); // Debugging statement to check payload
    try {
      const response = await axios.post('http://localhost:8080/addtask', newTask);
      console.log('Response from server:', response.data); // Debugging statement to check server response
      setTasks([...tasks, response.data]);
      setNewTask({ taskName: '', description: '', dueDate: '', status: 'PENDING', project_id: '' });
      setCurrentPage(Math.ceil((tasks.length + 1) / tasksPerPage)); // Move to the last page
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.message);
    }
  };

  // Calculate the number of pages
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Get the tasks for the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
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
      <Link className="btn btn-primary mb-3" to="/parametrizationoverview">
        🏠 Back to Parametrization Overview
      </Link>
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
        <div className="form-group">
          <label htmlFor="project_id">Project</label>
          <select
            className="form-control"
            id="project_id"
            name="project_id"
            value={newTask.project_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.projectName}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>

      <ul>
  {currentTasks.map(task => {
    console.log('Current task:', task); // Debugging statement to log each task

    return (
      <li key={task.id}>
        <div style={{ textAlign: 'left' }}>
          <strong>Task Name:</strong> {task.taskName}<br />
          <strong>Description:</strong> {task.description}<br />
          <strong>Status:</strong> {task.status}<br />
          <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}<br />
          <strong>Project Name:</strong> {task.projectName ? task.projectName : 'No project assigned'}<br />
          <strong>Assigned Users:</strong>
          {task.userTasks && task.userTasks.length > 0 ? (
            <ul>
              {task.userTasks.map(userTask => {
                console.log('User task:', userTask); // Debugging statement to log each user task
                return (
                  <li key={userTask.id}>{userTask.user.username}</li>
                );
              })}
            </ul>
          ) : (
            <p>No users assigned</p>
          )}
        </div>
        <hr />
      </li>
    );
  })}
</ul>

      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ViewTasks;
