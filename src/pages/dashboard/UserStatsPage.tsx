import React from "react";
import UserDashboard from "./userDashboard/UserDashboard";
import { useLocation } from "react-router";
import Navbar from "./navbar/Navbar";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";

function UserStatsPage() {
  const { state } = useLocation();
  const userContext = useUserContext();
  const { isLoggedin } = userContext as UserContext;

  return (
    <div>
      <UserDashboard user={state} />
    </div>
  );
}

export default UserStatsPage;
