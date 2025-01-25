import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/loginuser", { username, password });
      if (response.status === 200) {
        console.log("Login successful");
        setSuccessMessage('Login successful!'); // Set success message
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setSuccessMessage('Login failed. Please try again.');
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Navigate to register page
  };

  return (
    <div>
      <h2>Login</h2>
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
          <button type="submit">Login</button>
          <button type="button" onClick={handleRegister} style={{ marginLeft: '10px' }}>Register</button> {/* Add button to navigate to register page */}
        </div>
      </form>
      {successMessage && <p>{successMessage}</p>} {/* Display success message */}
    </div>
  );
};

export default Login;
