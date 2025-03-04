import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);  // State for storing the image to preview

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:8080/viewdocumenttemplates');
        setTemplates(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Error fetching templates. Please try again later.' });
      }
    };

    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`http://localhost:8080/deletedocumenttemplate/${id}`);
        setTemplates(templates.filter((template) => template.id !== id));
        setMessage({ type: 'success', text: 'Template deleted successfully.' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Error deleting template. Please try again later.' });
      }
    }
  };

  const handlePreview = async (templateId) => {
    try {
      // Fetch the image data for the template
      const response = await axios.get(`http://localhost:8080/documenttemplate/${templateId}/image`, {
        responseType: 'arraybuffer',  // Receive the image as an array buffer
      });

      // Convert the array buffer to base64 string
      const base64Image = arrayBufferToBase64(response.data);
      setPreviewImage(base64Image); // Set the base64 string to previewImage state
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching image. Please try again later.' });
    }
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));
    return `data:image/png;base64,${btoa(binary)}`;
  };

  return (
    <div className="container mt-4">
      <h2>Uploaded Document Templates</h2>

      {/* Link to UploadTemplate */}
      <div className="mb-3">
        <Link to="/uploadtemplate" className="btn btn-primary">
          Upload New Template
        </Link>
      </div>

      {message && <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>{message.text}</div>}

      {templates.length === 0 ? (
        <p>No templates uploaded yet.</p>
      ) : (
        <div className="list-group">
          {templates.map((template) => (
            <div key={template.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{template.templateName}</strong>
                <p className="mb-0">ID: {template.id}</p>
              </div>
              <div>
                {/* Document Preview Button */}
                <button
                  className="btn btn-info me-2"
                  onClick={() => handlePreview(template.id)}  // Pass only template.id here
                >
                  Preview
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(template.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal or Preview Section */}
      {previewImage && (
        <div className="modal" style={{ display: 'block', zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '80%', margin: 'auto' }}>
            <span className="close" onClick={() => setPreviewImage(null)}>&times;</span>
            <img src={previewImage} alt="Document Preview" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      <div className="button-container">
        <Link to="/parametrizationoverview">
          <button className="btn btn-primary">Back To Administration</button>
        </Link>
      </div>
    </div>
  );
};

export default TemplateList;
