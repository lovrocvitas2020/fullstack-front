import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the authentication context

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await axios.post("http://localhost:8080/loginuser", { 
        username, 
        password 
      });

      console.log("Response from backend:", response); // Log the entire response

      if (response.status === 200) {
        // Assuming your backend returns a token and user data in the response
        const { token, user } = response.data;
        
        console.log("Received token:", token);
        console.log("Received user data:", user);

        // Store token and update authentication state
        login(token, user);
        
        setSuccessMessage('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setSuccessMessage('Invalid credentials. Please try again.');
            break;
          case 403:
            setSuccessMessage('Account disabled. Contact administrator.');
            break;
          default:
            setSuccessMessage('Login failed. Please try again.');
        }
      } else {
        setSuccessMessage('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same...
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
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Keep the existing form structure */}
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
            ...(successMessage.toLowerCase().includes('success') 
              ? styles.successMessage 
              : styles.errorMessage),
          }}
        >
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default Login;
