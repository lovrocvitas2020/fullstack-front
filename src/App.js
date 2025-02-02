import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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


import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};




function App() {
  return (
    <div className="App">
    <Router>
    <Navbar/>

    <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/adduser" element={<AddUser />} />
          <Route exact path="/edituser/:id" element={<EditUser />} />
          <Route exact path="/viewuser/:id" element={<ViewUser />} />
          <Route exact path="/viewusernotes" element={<ViewUserNotes/>} />
          <Route exact path="/addusernotes" element={<AddUserNotes />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/editusernotes/:id" element={<EditUserNotes />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/viewworklog" element={<ViewWorklog />} />
          <Route path="/add_worklog" element={<ViewWorklog />} />
          <Route path="/update_worklog/:id" element={<ViewWorklog />} />
          <Route path="/delete_worklog/:id" element={<ViewWorklog />} />
        </Routes>
    
    </Router>
  
    </div>  
  );
}

export default App;
