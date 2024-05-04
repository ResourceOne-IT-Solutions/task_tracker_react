import React, { ReactElement } from "react";
import {
  Navigate,
  Route,
  BrowserRouter,
  Routes,
  Outlet,
} from "react-router-dom";
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

interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

const ProtectedRoute = ({ isAuthenticated }: ProtectedRouteProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

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
              <Route
                path="/login"
                element={isLoggedin ? <Navigate to="/dashboard" /> : <Login />}
              />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute isAuthenticated={isLoggedin} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/stats" element={<UsersStats />} />
                <Route path="/tasklist" element={<TaskList />} />
                <Route
                  path="/dashboard/tickets/:path"
                  element={<UserDashboardTickets />}
                />
                <Route path="approved/tickets" element={<ApprovedTickets />} />
                <Route path="/tickets/:id" element={<TicketDescription />} />
                <Route path="/dashboard/feedback" element={<Feedback />} />
                <Route
                  path="/dashboard/userfeedback"
                  element={<UserFeedback />}
                />
                <Route path="/userTickets/:id" element={<UserTickets />} />
                <Route
                  path="/dashboard/helpedtickets"
                  element={isLoggedin && <HelpedTickets />}
                />
              </Route>
              {/* Admin Routes */}
              <Route
                element={
                  <ProtectedRoute isAuthenticated={isLoggedin && isAdmin} />
                }
              >
                <Route path="/dashboard/usersTable" element={<UsersTable />} />
                <Route path="/dashboard/clients" element={<ClientsTable />} />

                <Route path="/clients/:id" element={<ClientDashboard />} />
                <Route path="/user/:id" element={<UserStatsPage />} />
                <Route
                  path="/dashboard/adminRequestmessages"
                  element={<AdminRequestMessages />}
                />
                <Route
                  path="/dashboard/ticketsTable"
                  element={<TicketsTable />}
                />
                <Route path="/admindashboard/adduser" element={<AddUser2 />} />
              </Route>

              {/* User Routes */}
              <Route
                element={
                  <ProtectedRoute isAuthenticated={isLoggedin && !isAdmin} />
                }
              >
                <Route
                  path="/dashboard/adminmessages"
                  element={<AdminMessages />}
                />
              </Route>
              <Route path="/forgotpassword" element={<ForgotPassword />} />
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
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default Routespage;
