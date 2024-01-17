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
import AdminRequestMessages from "../pages/dashboard/AdminRequestMessages";
import Navbar from "../pages/dashboard/navbar/Navbar";
import UserTickets from "../pages/tickets/UserTickets";

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
          <Route path="/chat" element={<Chat />} />
          <Route
            path="/tickets"
            element={isLoggedin ? <Tickets /> : <Navigate to="/" />}
          />
          <Route
            path="/tickets/:id"
            element={
              isLoggedin && isAdmin ? (
                <TicketDescription />
              ) : (
                <Navigate to="/" />
              )
            }
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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routespage;
