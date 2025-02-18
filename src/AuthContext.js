import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for token on app load and validate it
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validate token with backend (example)
      fetch("http://localhost:8080/validate-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            // Fetch user information if token is valid
            return fetch("http://localhost:8080/user-info", {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            logout();
            return null;
          }
        })
        .then((res) => res.json())
        .then((userData) => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(() => logout());
    }
  }, []);

  const login = (token, user) => {
    console.log("Logging in with user data:", user); 
    localStorage.setItem("token", token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  console.log("Current user object:", user); // Debug log

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
