import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import UserDashboard from "./userDashboard/UserDashboard";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import { Navigate } from "react-router-dom";
import { UserContext, UserModal } from "../../modals/UserModals";
import Navbar from "../navbar/Navbar";
import { Spinner } from "react-bootstrap";

const Dashboard = () => {
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, isLoggedin, setIsLoggedIn } =
    userContext as UserContext;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser.firstName) {
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
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isLoading && !isLoggedin) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isLoggedin && currentUser.isAdmin && <AdminDashboard />}
          {isLoggedin && currentUser.isAdmin === false && (
            <UserDashboard user={currentUser} />
          )}
        </>
      )}
    </div>
  );
};
export default Dashboard;
