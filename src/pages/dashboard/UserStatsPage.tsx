import React, { useEffect, useState } from "react";
import UserDashboard from "./userDashboard/UserDashboard";
import { useLocation } from "react-router";
import httpMethods from "../../api/Service";
import { UserModal } from "../../modals/UserModals";
import { Loader } from "../../utils/utils";

function UserStatsPage() {
  const { state } = useLocation();
  const [user, setUser] = useState<UserModal>(state);
  const [isLoading, setIsloading] = useState(true);
  useEffect(() => {
    if (!user.mobile) {
      setIsloading(true);
      httpMethods
        .get<UserModal>("/users/" + state._id)
        .then((user) => setUser(user))
        .catch((err) => err)
        .finally(() => setIsloading(false));
    } else {
      setIsloading(false);
    }
  }, []);

  return <>{isLoading ? <Loader /> : <UserDashboard user={user} />}</>;
}

export default UserStatsPage;
