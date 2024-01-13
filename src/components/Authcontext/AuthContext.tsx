import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BE_URL } from "../../utils/Constants";
import httpMethods from "../../api/Service";
import { UserContext, UserModal } from "../../modals/UserModals";

const UserContextProvider = createContext<UserContext | null>(null);

const socket = io(BE_URL);

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
    socket,
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
  return (
    <UserContextProvider.Provider value={value}>
      {children}
    </UserContextProvider.Provider>
  );
};
export const useUserContext = () => useContext(UserContextProvider);

export default AuthContext;
