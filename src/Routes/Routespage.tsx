import React from "react";
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/homepage/Home";
import { useUserContext } from "../components/Authcontext/AuthContext";
import AddUserpage from "../pages/dashboard/adduser/AddUserpage";
import Dashboard from "../pages/dashboard";
import Login from "../pages/loginpage/Login";

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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routespage;
