import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      // Fetch existing users to check for duplicate usernames
      const result = await axios.get("http://localhost:8080/users");
      const existingUsers = result.data._embedded?.users || [];
      
      const usernameExists = existingUsers.some(existingUser => existingUser.username === username);
      if (usernameExists) {
        setSuccessMessage('Username already exists. Please choose a different username.');
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:8080/register", { username, password });
      if (response.status === 200) {
        setSuccessMessage('Registration successful!');
        navigate('/home'); // Redirect to home page
      }
    } catch (error) {
      setSuccessMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    title: {
      marginBottom: '20px',
      fontSize: '24px',
      color: '#333',
    },
    formGroup: {
      marginBottom: '15px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    },
    buttonContainer: {
      marginTop: '15px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
    },
    registerButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    loginButton: {
      backgroundColor: '#007BFF',
      color: 'white',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    message: {
      marginTop: '20px',
      fontSize: '14px',
    },
    errorMessage: {
      color: 'red',
    },
    successMessage: {
      color: 'green',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...styles.registerButton,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button
            type="button"
            onClick={handleLogin}
            style={{ ...styles.button, ...styles.loginButton }}
          >
            Login
          </button>
        </div>
      </form>
      {successMessage && (
        <p
          style={{
            ...styles.message,
            ...(successMessage.includes('failed') ? styles.errorMessage : styles.successMessage),
          }}
        >
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default Register;
