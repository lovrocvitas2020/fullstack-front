import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function ViewProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({ projectName: '', description: '', startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); // Number of projects to display per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/viewprojects');
        if (response.status === 200) {
          setProjects(response.data);
        } else {
          setError('Failed to fetch project data.');
        }
      } catch (error) {
        setError('Error fetching project data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/addprojects', newProject);
      if (response.status === 200) {
        setProjects([...projects, response.data]);
        setNewProject({ projectName: '', description: '', startDate: '', endDate: '' });
        setCurrentPage(Math.ceil((projects.length + 1) / projectsPerPage)); // Move to the last page
      } else {
        setError('Failed to add new project.');
      }
    } catch (error) {
      setError('Error adding new project: ' + error.message);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/projects/${id}`);
      if (response.status === 204) {
        setProjects(projects.filter(project => project.id !== id));
        setCurrentPage(1); // Reset to the first page after deletion
      } else {
        setError('Failed to delete project.');
      }
    } catch (error) {
      setError('Error deleting project: ' + error.message);
    }
  };

  // Calculate the index of the last project on the current page
  const indexOfLastProject = currentPage * projectsPerPage;
  // Calculate the index of the first project on the current page
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  // Get the current projects to display
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>View Projects</h2>
      <Link className="btn btn-primary mb-3" to="/parametrizationoverview">
        🏠 Back to Administration Overview
      </Link>

      {/* Form for Adding New Project */}
      <form onSubmit={handleAddProject} className="mb-4">
        <h3>Add New Project</h3>
        <div className="mb-3">
          <label className="form-label">Project Name</label>
          <input
            type="text"
            className="form-control"
            value={newProject.projectName}
            onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={newProject.startDate}
            onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            value={newProject.endDate}
            onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Add New Project</button>
      </form>

      {/* List of Projects */}
      {currentProjects.map((project) => (
        <div className="card mb-3" key={project.id}>
          <div className="card-body text-start">
            <h5 className="card-title"><strong>Project Name:</strong> {project.projectName}</h5>
            <p className="card-text"><strong>Description:</strong> {project.description}</p>
            <p className="card-text"><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
            <p className="card-text"><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
            <button
              className="btn btn-warning me-2"
              onClick={() => navigate(`/editproject/${project.id}`)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteProject(project.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {[...Array(Math.ceil(projects.length / projectsPerPage))].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === Math.ceil(projects.length / projectsPerPage) ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(projects.length / projectsPerPage)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ViewProjects;
