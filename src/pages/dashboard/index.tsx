import React, { useEffect } from "react";
import {
  useAuth,
  useUserContext,
} from "../../components/Authcontext/AuthContext";
import UserDashboard from "./userDashboard/UserDashboard";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../modals/UserModals";
import { Loader } from "../../utils/utils";

const Dashboard = () => {
  const userContext = useUserContext();
  const { getLogin, isLoading } = useAuth();
  const { currentUser, isLoggedin } = userContext as UserContext;

  useEffect(() => {
    if (!currentUser.firstName) {
      getLogin();
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
