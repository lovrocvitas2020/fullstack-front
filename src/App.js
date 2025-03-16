import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./membersmanagement/AddUser";
import EditUser from "./membersmanagement/EditUser";
import ViewUser from "./membersmanagement/ViewUser";
import ViewUserNotes from './membersmanagement/ViewUserNotes';
import AddUserNotes from './membersmanagement/AddUserNotes';
import Login from './pages/Login';
import Register from './pages/Register';
import EditUserNotes from './membersmanagement/EditUserNotes';
import UserList from './membersmanagement/UserList';
import ViewWorklog from './worklog/ViewWorklog';
import { AuthProvider, useAuth } from './AuthContext'; 
import ViewUserDetails from './membersmanagement/ViewUserDetails';
import AddUserDetails from './membersmanagement/AddUserDetails';
import ResetPassword from './membersmanagement/ResetPassword';
import ParametrizationOverview from './parametrization/ParametrizationOverview';
import AddProject from './parametrization/AddProject';
import ViewProject from './parametrization/ViewProject';
import EditProject from './parametrization/EditProject';
import MapComponent from './parametrization/MapComponent';
import ViewTasks from './parametrization/ViewTasks';
import PaymentSlipsList from './payment/PaymentSlipsList';
import PaymentSlipForm from './payment/PaymentSlipForm';
import PaymentSlipDetails from './payment/PaymentsSlipDetails';
import TemplateList from './template/TemplateList';
import UploadTemplate from './template/UploadTemplate';
import BatchStartScreen from './batch/BatchStartScreen';
import GeneratedPaymentSlipsList from './payment/GeneratedPaymentSlipsList';
import MembersManagemenzOverview from './membersmanagement/MembersManagementOverview';
import BoatManagementOverview from './boatmanagement/BoatManagementOverview';
import ViewBoats from './boatmanagement/ViewBoats';
import AddBoat from './boatmanagement/AddBoat';
import EditBoat from './boatmanagement/EditBoat';
import FinanceAndPaymentOverview from './payment/FinanceAndPaymentOverview';


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
              path="/send-reset-request/:id"
              element={
                <ProtectedRoute>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirm-reset-password/:id"
              element={
                <ProtectedRoute>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parametrizationoverview"
              element={
                <ProtectedRoute>
                  <ParametrizationOverview />
                </ProtectedRoute>
              }
            />
             <Route
              path="/addprojects"
              element={
                <ProtectedRoute>
                  <AddProject />
                </ProtectedRoute>
              }
            />
              <Route
              path="/viewprojects"
              element={
                <ProtectedRoute>
                  <ViewProject />
                </ProtectedRoute>
              }
            />
              <Route
              path="/editproject/:id"
              element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              }
            />
             <Route
              path="/viewtasks"
              element={
                <ProtectedRoute>
                  <ViewTasks />
                </ProtectedRoute>
              }
            />
              <Route
              path="/addtask"
              element={
                <ProtectedRoute>
                  <ViewTasks />
                </ProtectedRoute>
              }
            />
             <Route
              path="/viewpaymentslips"
              element={
                <ProtectedRoute>
                  <PaymentSlipsList />
                </ProtectedRoute>
              }
            />
             <Route
              path="/addpaymentslips"
              element={
                <ProtectedRoute>
                  <PaymentSlipForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paymentslips/:id"
              element={
                <ProtectedRoute>
                  <PaymentSlipDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deletepaymentslip/:id"
              element={
                <ProtectedRoute>
                  <PaymentSlipDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editpaymentslip/:id"
              element={
                <ProtectedRoute>
                  <PaymentSlipForm />
                </ProtectedRoute>
              }
            />
             <Route
              path="/generatepdf/:id"
              element={
                <ProtectedRoute>
                  <PaymentSlipForm />
                </ProtectedRoute>
              }
            />
             <Route
              path="/viewdocumenttemplates"
              element={
                <ProtectedRoute>
                  <TemplateList />
                </ProtectedRoute>
              }
            />
              <Route
              path="/deletedocumenttemplate/:id"
              element={
                <ProtectedRoute>
                  <TemplateList />
                </ProtectedRoute>
              }
            />
              <Route
              path="/documenttemplate/:id"
              element={
                <ProtectedRoute>
                  <TemplateList />
                </ProtectedRoute>
              }
            />
              <Route
              path="/uploadtemplate"
              element={
                <ProtectedRoute>
                  <UploadTemplate />
                </ProtectedRoute>
              }
            />
              <Route
              path="/batch/startbatch1"
              element={
                <ProtectedRoute>
                  <BatchStartScreen />
                </ProtectedRoute>
              }
            />
               <Route
              path="/batch/startbatch2"
              element={
                <ProtectedRoute>
                  <BatchStartScreen />
                </ProtectedRoute>
              }
            />
             <Route
              path="/batchstartscreen"
              element={
                <ProtectedRoute>
                  <BatchStartScreen />
                </ProtectedRoute>
              }
            />
             <Route
              path="/viewgeneratedpaymentslips"
              element={
                <ProtectedRoute>
                  <GeneratedPaymentSlipsList />
                </ProtectedRoute>
              }
            />
              <Route
              path="/deletegeneratedpaymentslip/:id"
              element={
                <ProtectedRoute>
                  <GeneratedPaymentSlipsList />
                </ProtectedRoute>
              }
            />
             <Route
              path="/generatedpaymentslips/pdf/:id"
              element={
                <ProtectedRoute>
                  <GeneratedPaymentSlipsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membersmanagementoverview"
              element={
                <ProtectedRoute>
                  <MembersManagemenzOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/boatmanagementoverview"
              element={
                <ProtectedRoute>
                  <BoatManagementOverview />
                </ProtectedRoute>
              }
            />
             <Route
              path="/viewboats"
              element={
                <ProtectedRoute>
                  <ViewBoats />
                </ProtectedRoute>
              }
            />
             <Route
              path="/addboat"
              element={
                <ProtectedRoute>
                  <AddBoat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editboat/:id"
              element={
                <ProtectedRoute>
                  <EditBoat />
                </ProtectedRoute>
              }
            />
             <Route
              path="/financeandpaymentoverview"
              element={
                <ProtectedRoute>
                  <FinanceAndPaymentOverview />
                </ProtectedRoute>
              }
            />
             <Route
              path="/generatedpaymentslipslist"
              element={
                <ProtectedRoute>
                  <FinanceAndPaymentOverview />
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
