import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import {
  UserContext,
  UserModal,
  useUserContext,
} from "../../components/Authcontext/AuthContext";
import UserDashboard from "./userDashboard/UserDashboard";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, isLoggedin, setIsLoggedIn } =
    userContext as UserContext;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    httpMethods
      .get<UserModal>("/get-user")
      .then((response) => {
        setCurrentUser(response);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!isLoading && !isLoggedin) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <>
          {isLoggedin && currentUser.isAdmin && <AdminDashboard />}
          {isLoggedin && <UserDashboard />}
        </>
      )}
    </div>
  );
};
export default Dashboard;
