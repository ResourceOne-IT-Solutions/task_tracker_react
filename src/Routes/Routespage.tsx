import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";

const Routespage = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/:name" element={<Login />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Routespage;
