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
          <Route exact path="viewusernotes" element={<ViewUserNotes/>} />
          <Route exact path="/addusernotes" element={<AddUserNotes />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/home" element={<Home />} />
        </Routes>
    
    </Router>
  
    </div>  
  );
}

export default App;
