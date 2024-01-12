import React, { createContext, useContext, useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import { UserContext, UserModal } from "../../modals/UserModals";

const UserContext = createContext<UserContext | null>(null);

interface AuthContextProps {
  children: React.ReactNode;
}
const AuthContext = ({ children }: AuthContextProps) => {
  const [currentUser, setCurrentUser] = useState<UserModal>({} as UserModal);
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);
  const value: UserContext = {
    isLoggedin,
    currentUser,
    setCurrentUser,
    setIsLoggedIn,
  };
  useEffect(() => {
    httpMethods
      .get<UserModal>("/get-user")
      .then((data) => {
        setCurrentUser(data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setCurrentUser({} as UserModal);
      });
  }, []);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export const useUserContext = () => useContext(UserContext);

export default AuthContext;
