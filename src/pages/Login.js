import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
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
      const response = await axios.post("http://localhost:8080/loginuser", { username, password });
      if (response.status === 200) {
        setSuccessMessage('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setSuccessMessage('Invalid credentials. Please try again.');
      } else {
        setSuccessMessage('Login failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
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
    loginButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    registerButton: {
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
      <h2 style={styles.title}>Login</h2>
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
              ...styles.loginButton,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={handleRegister}
            style={{ ...styles.button, ...styles.registerButton }}
          >
            Register
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

export default Login;
