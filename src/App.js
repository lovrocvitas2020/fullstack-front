import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import ViewUserNotes from './users/ViewUserNotes';
import AddUserNotes from './users/AddUserNotes';
import Login from './pages/Login';
import Register from './pages/Register';
import EditUserNotes from './users/EditUserNotes';
import UserList from './users/UserList';
import ViewWorklog from './worklog/ViewWorklog';
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthProvider
import ViewUserDetails from './users/ViewUserDetails';
import AddUserDetails from './users/AddUserDetails'; // Ensure this import is correct
import ResetPassword from './users/ResetPassword';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App">
      <AuthProvider> {/* Wrap with AuthProvider */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adduser"
              element={
                <ProtectedRoute>
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edituser/:id"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewuser/:id"
              element={
                <ProtectedRoute>
                  <ViewUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userdetails/:id"
              element={
                <ProtectedRoute>
                  <ViewUserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adduserdetails/:id"
              element={
                <ProtectedRoute>
                  <AddUserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewusernotes"
              element={
                <ProtectedRoute>
                  <ViewUserNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addusernotes"
              element={
                <ProtectedRoute>
                  <AddUserNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editusernotes/:id"
              element={
                <ProtectedRoute>
                  <EditUserNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userlist"
              element={
                <ProtectedRoute>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewworklog"
              element={
                <ProtectedRoute>
                  <ViewWorklog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password/:id"
              element={
                <ProtectedRoute>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
