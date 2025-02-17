import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const projectData = {
      projectName,
      description,
      startDate,
      endDate,
    };

    try {
      const response = await axios.post('http://localhost:8080/projects', projectData);

      if (response.status === 201 && response.data.id) {
        setFeedbackMessage('Project created successfully!');
        setProjectName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setTimeout(() => {
          navigate('/parametrizationoverview');
        }, 2000); // Redirects after 2 seconds
      } else {
        setFeedbackMessage(`Failed to create project: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      setFeedbackMessage(`Error creating project: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Project Name</label>
          <input
            type="text"
            className="form-control"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Project</button>
        <Link className="btn btn-outline-danger mx-2" to="/parametrizationoverview">Cancel</Link>
      </form>
      {feedbackMessage && <div className="alert alert-info mt-3">{feedbackMessage}</div>}
    </div>
  );
}

export default AddProject;
