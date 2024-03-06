import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import {
  useAuth,
  useUserContext,
} from "../../components/Authcontext/AuthContext";
import UserDashboard from "./userDashboard/UserDashboard";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import { Navigate } from "react-router-dom";
import { UserContext, UserModal } from "../../modals/UserModals";
import { Loader } from "../../utils/utils";

const Dashboard = () => {
  const userContext = useUserContext();
  const { getLogin } = useAuth();
  const { currentUser, setCurrentUser, isLoggedin, setIsLoggedIn } =
    userContext as UserContext;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser.firstName) {
      getLogin();
    } else {
      setIsLoading(false);
    }
  }, [currentUser.firstName]);

  if (!isLoading && !isLoggedin) {
    return <Navigate to="/" />;
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isLoggedin && currentUser.isAdmin && <AdminDashboard />}
          {isLoggedin && currentUser.isAdmin === false && (
            <UserDashboard user={currentUser} />
          )}
        </>
      )}
    </>
  );
};
export default Dashboard;
