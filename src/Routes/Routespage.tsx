import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import { useUserContext } from "../components/Authcontext/AuthContext";

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
  const { isLoggedin } = userContext;
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isLoggedin ? <AdminDashboard /> : <Home />}
          />
          <Route path="/login/:name" element={<Login />} />
          <Route
            path="/admindashboard"
            element={<ProtectedRoute element={<AdminDashboard />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routespage;
