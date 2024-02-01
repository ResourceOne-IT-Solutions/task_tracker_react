import React from "react";
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/homepage/Home";
import { useUserContext } from "../components/Authcontext/AuthContext";
import AddUserpage from "../pages/dashboard/adduser/AddUserpage";
import Dashboard from "../pages/dashboard";
import Login from "../pages/loginpage/Login";
import Chat from "../pages/chat";
import Tickets from "../pages/tickets";
import TicketDescription from "../pages/tickets/TicketDescription";
import ClientDashboard from "../pages/dashboard/clientDashboard";
import UserStatsPage from "../pages/dashboard/UserStatsPage";
import AdminRequestMessages from "../pages/dashboard/adminDashboard/AdminRequestMessages";
import Navbar from "../pages/dashboard/navbar/Navbar";
import UserTickets from "../pages/tickets/UserTickets";
import AdminMessages from "../pages/dashboard/userDashboard/AdminMessages";
import ApprovedTickets from "../pages/tickets/ApprovedTickets";
import UsersTable from "../components/Admintables/UsersTable";
import ClientsTable from "../components/Admintables/ClientsTable";
import TicketsTable from "../components/Admintables/TicketsTable";

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const userContext = useUserContext();
  if (userContext == null) {
    return <Navigate to="/" />;
  }
  const { isLoggedin } = userContext;
  return isLoggedin ? element : <Navigate to="/" />;
};
const Routespage = () => {
  const userContext = useUserContext();
  if (userContext === null) {
    return <Navigate to="/" />;
  }
  const { isLoggedin, currentUser } = userContext;
  const isAdmin = currentUser.isAdmin;
  return (
    <div>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {isLoggedin && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={isLoggedin ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/login"
            element={isLoggedin ? <Dashboard /> : <Login />}
          />
          <Route
            path="/admindashboard/adduser"
            element={
              isLoggedin && isAdmin ? <AddUserpage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/chat"
            element={isLoggedin ? <Chat /> : <Navigate to="/" />}
          />
          <Route
            path="/tickets"
            element={isLoggedin ? <Tickets /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard/usersTable"
            element={
              isLoggedin && isAdmin ? <UsersTable /> : <Navigate to="/" />
            }
          />
          <Route
            path="/dashboard/clientsTable"
            element={
              isLoggedin && isAdmin ? <ClientsTable /> : <Navigate to="/" />
            }
          />
          <Route
            path="/dashboard/ticketsTable"
            element={
              isLoggedin && isAdmin ? <TicketsTable /> : <Navigate to="/" />
            }
          />
          <Route
            path="approved/tickets"
            element={isLoggedin ? <ApprovedTickets /> : <Navigate to="/" />}
          />
          <Route
            path="/tickets/:id"
            element={isLoggedin ? <TicketDescription /> : <Navigate to="/" />}
          />
          <Route
            path="/client/:id"
            element={
              isLoggedin && isAdmin ? <ClientDashboard /> : <Navigate to="/" />
            }
          />
          <Route
            path="/user/:id"
            element={
              isLoggedin && isAdmin ? <UserStatsPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/dashboard/adminRequestmessages"
            element={
              isLoggedin && isAdmin ? (
                <AdminRequestMessages />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/userTickets/:id"
            element={isLoggedin && <UserTickets />}
          />
          <Route
            path="/dashboard/adminmessages"
            element={
              isLoggedin && !isAdmin ? <AdminMessages /> : <Navigate to="/" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routespage;
