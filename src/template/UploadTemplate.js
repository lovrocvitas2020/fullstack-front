import React, { useState } from 'react';
import axios from 'axios';

const UploadTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!templateName || !file) {
      setMessage({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    const formData = new FormData();
    formData.append('templateName', templateName);
    formData.append('file', file);

    try {
       
      const response = await axios.post('http://localhost:8080/documenttemplateupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Template uploaded successfully!' });
        setTemplateName('');
        setFile(null);
      } else {
        setMessage({ type: 'error', text: 'Error uploading template.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading template. Please try again later.' });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Document Template</h2>
      {message && <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="templateName" className="form-label">Template Name</label>
          <input
            type="text"
            id="templateName"
            name="templateName"
            className="form-control"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="file" className="form-label">Choose Template Image (PNG)</label>
          <input
            type="file"
            id="file"
            name="file"
            className="form-control"
            accept="image/png"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Upload Template</button>
      </form>
    </div>
  );
};

export default UploadTemplate;
