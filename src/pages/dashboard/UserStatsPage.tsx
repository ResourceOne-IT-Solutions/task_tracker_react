import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import UserDashboard from "./userDashboard/UserDashboard";
import { useLocation } from "react-router";
import httpMethods from "../../api/Service";
import { UserModal } from "../../modals/UserModals";
import { Loader } from "../../utils/utils";

function UserStatsPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const [user, setUser] = useState<UserModal>(state);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!user?.mobile) {
      setIsloading(true);
      const userId = user?._id ? user._id : id;
      httpMethods
        .get<UserModal>("/users/" + userId)
        .then((user) => setUser(user))
        .catch((err) => setError(true))
        .finally(() => setIsloading(false));
    } else {
      setIsloading(false);
    }
  }, []);

  if (error) {
    return <Navigate to="/" />;
  }
  return <>{isLoading ? <Loader /> : <UserDashboard user={user} />}</>;
}

export default UserStatsPage;
