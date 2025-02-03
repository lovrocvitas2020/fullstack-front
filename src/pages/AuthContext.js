import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [loggedUser, setLoggedUser] = useState(null); // Define setLoggedUser
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logged-in user's details
    const fetchLoggedUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/authme");
        setLoggedUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
        setIsAuthenticated(false);
      }
    };

    if (isAuthenticated) {
      fetchLoggedUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Persist login state
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
    navigate("/home"); // Redirect to home after login
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    setLoggedUser(null); // Clear loggedUser on logout
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loggedUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
