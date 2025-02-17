import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditProject() {
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/projects/${id}`);
        if (response.status === 200) {
          const projectData = response.data;
          setProjectName(projectData.projectName);
          setDescription(projectData.description);
          setStartDate(projectData.startDate.split('T')[0]); // Format date to YYYY-MM-DD
          setEndDate(projectData.endDate.split('T')[0]); // Format date to YYYY-MM-DD
        } else {
          setError('Failed to fetch project data.');
        }
      } catch (error) {
        setError('Error fetching project data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleUpdateProject = async (event) => {
    event.preventDefault();
    const updatedProjectData = {
      projectName,
      description,
      startDate,
      endDate,
    };

    try {
      const response = await axios.put(`http://localhost:8080/editproject/${id}`, updatedProjectData);
      if (response.status === 200) {
        navigate('/viewprojects'); // Redirect to the projects list or another page
      } else {
        setError('Failed to update project.');
      }
    } catch (error) {
      setError('Error updating project: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Project</h2>
      <form onSubmit={handleUpdateProject}>
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
        <button type="submit" className="btn btn-primary">Update Project</button>
      </form>
    </div>
  );
}

export default EditProject;
