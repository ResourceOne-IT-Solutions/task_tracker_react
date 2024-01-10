import React from "react";
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/homepage/Home";
import Login from "../pages/loginpage/Login";
import AdminDashboard from "../pages/dashboard/adminDashboard/AdminDashboard";
import { useUserContext } from "../components/Authcontext/AuthContext";

import AddUserpage from "../pages/dashboard/adduser/AddUserpage";
import UserDashboard from "../pages/dashboard/userDashboard/UserDashboard";

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
        <Routes>
          <Route
            path="/"
            element={
              isLoggedin ? (
                isAdmin ? (
                  <Navigate to="/admindashboard" />
                ) : (
                  <Navigate to="/userdashboard" />
                )
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/login/:name"
            element={
              isLoggedin ? (
                isAdmin ? (
                  <Navigate to="/admindashboard" />
                ) : (
                  <Navigate to="/userdashboard" />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/admindashboard"
            element={<ProtectedRoute element={<AdminDashboard />} />}
          />
          <Route
            path="/userdashboard"
            element={<ProtectedRoute element={<UserDashboard />} />}
          />
          <Route
            path="/admindashboard/adduser"
            element={
              isLoggedin ? (
                isAdmin ? (
                  <AddUserpage />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routespage;
