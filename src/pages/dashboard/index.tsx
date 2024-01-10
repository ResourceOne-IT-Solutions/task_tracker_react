import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import {
  UserContext,
  UserModal,
  useUserContext,
} from "../../components/Authcontext/AuthContext";
import UserDashboard from "./userDashboard/UserDashboard";
import AdminDashboard from "./adminDashboard/AdminDashboard";

const Dashboard = () => {
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, isLoggedin } =
    userContext as UserContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    function getCookie(userInfo: string) {
      const name = `${userInfo}=`;
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(";");

      for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      return null;
    }

    const userCookie = getCookie("userCookie");

    if (userCookie) {
      setIsLoading(true);
      const token = JSON.parse(userCookie);

      httpMethods
        .get("/get-user")
        .then((response: any) => {
          const userData = response;
          setCurrentUser(userData);
        })
        .catch((error) => {
          error;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);
  if (!currentUser.firstName) {
    return <h3>Component Loading.....</h3>;
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading....</div>
      ) : currentUser.isAdmin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
};
export default Dashboard;
