import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Log form submission
    try {
      const response = await axios.post("http://localhost:8080/register", { username, password });
      if (response.status === 200) {
        console.log("Registration successful");
        setSuccessMessage('Registration successful!'); // Set success message
        navigate('/home'); // Redirect to home page
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setSuccessMessage('Registration failed. Please try again.');
    }
  };

  const handleLogin = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Register</button>
          <button type="button" onClick={handleLogin} style={{ marginLeft: '10px' }}>Login</button> {/* Add button to navigate to login page */}
        </div>
      </form>
      {successMessage && <p>{successMessage}</p>} {/* Display success message */}
    </div>
  );
};

export default Register;
