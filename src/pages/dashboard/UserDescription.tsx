import React from "react";
import UserDashboard from "./userDashboard/UserDashboard";
import { useLocation } from "react-router";

function UserDescription() {
  const { state } = useLocation();

  return (
    <div>
      <UserDashboard user={state} />
    </div>
  );
}

export default UserDescription;
