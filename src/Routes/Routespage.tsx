import React from "react";
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/homepage/Home";
import { useUserContext } from "../components/Authcontext/AuthContext";
import Dashboard from "../pages/dashboard";
import Login from "../pages/loginpage/Login";
import Chat from "../pages/chat";
import Tickets from "../pages/tickets";
import TicketDescription from "../pages/tickets/TicketDescription";
import ClientDashboard from "../pages/dashboard/clientDashboard";
import UserStatsPage from "../pages/dashboard/UserStatsPage";
import AdminRequestMessages from "../pages/dashboard/adminDashboard/AdminRequestMessages";
import Navbar from "../pages/navbar/Navbar";
import UserTickets from "../pages/tickets/UserTickets";
import AdminMessages from "../pages/dashboard/userDashboard/AdminMessages";
import ApprovedTickets from "../pages/tickets/ApprovedTickets";
import UsersTable from "../components/Admintables/UsersTable";
import ClientsTable from "../components/Admintables/ClientsTable";
import TicketsTable from "../components/Admintables/TicketsTable";
import TicketsMain from "../pages/tickets/TicketsMain";
import UserDashboardTickets from "../pages/dashboard/userDashboard/UserDashboardTickets";
import HelpedTickets from "../pages/tickets/HelpedTickets";
import Feedback from "../pages/Feedback/Feedback";
import UserFeedback from "../pages/Feedback/UserFeedback";
import AddUser2 from "../pages/adduser/AddUser2";
import ForgotPassword from "../pages/forgotpassword/ForgotPassword";
import Sidebar from "../pages/sidebar";
import UsersStats from "../pages/users-stats/UserStats";
import TaskList from "../pages/taskpage";

const Routespage = () => {
  const userContext = useUserContext();
  if (userContext === null) {
    return <Navigate to="/" />;
  }
  const { isLoggedin, currentUser } = userContext;
  const isAdmin = currentUser.isAdmin;
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {isLoggedin && <Navbar />}
        <div className="ful-content">
          {isLoggedin && <Sidebar />}
          <div className={`${isLoggedin ? "router-outlet" : "w-100"}`}>
            <Routes>
              <Route
                path="/"
                element={isLoggedin ? <Navigate to="/dashboard" /> : <Home />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/login"
                element={isLoggedin ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route
                path="/admindashboard/adduser"
                element={
                  isLoggedin && isAdmin ? <AddUser2 /> : <Navigate to="/" />
                }
              />
              <Route
                path="/chat"
                element={isLoggedin ? <Chat /> : <Navigate to="/" />}
              />
              <Route
                path="/stats"
                element={isLoggedin ? <UsersStats /> : <Navigate to="/" />}
              />
              <Route
                path="/tasklist"
                element={isLoggedin ? <TaskList /> : <Navigate to="/" />}
              />
              <Route
                path="/tickets"
                element={
                  isLoggedin ? (
                    isAdmin ? (
                      <Tickets />
                    ) : (
                      <TicketsMain url={`/tickets/user/${currentUser._id}`} />
                    )
                  ) : (
                    <Navigate to="/" />
                  )
                }
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
                path="/dashboard/tickets/:path"
                element={
                  isLoggedin ? <UserDashboardTickets /> : <Navigate to="/" />
                }
              />
              <Route
                path="approved/tickets"
                element={isLoggedin ? <ApprovedTickets /> : <Navigate to="/" />}
              />
              <Route
                path="/tickets/:id"
                element={
                  isLoggedin ? <TicketDescription /> : <Navigate to="/" />
                }
              />
              <Route
                path="/dashboard/feedback"
                element={isLoggedin ? <Feedback /> : <Navigate to="/" />}
              />
              <Route
                path="/dashboard/userfeedback"
                element={isLoggedin ? <UserFeedback /> : <Navigate to="/" />}
              />
              <Route
                path="/client/:id"
                element={
                  isLoggedin && isAdmin ? (
                    <ClientDashboard />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/user/:id"
                element={
                  isLoggedin && isAdmin ? (
                    <UserStatsPage />
                  ) : (
                    <Navigate to="/" />
                  )
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
                path="/dashboard/helpedtickets"
                element={isLoggedin && <HelpedTickets />}
              />
              <Route
                path="/dashboard/adminmessages"
                element={
                  isLoggedin && !isAdmin ? (
                    <AdminMessages />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default Routespage;
