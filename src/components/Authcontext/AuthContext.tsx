import React, { createContext, useContext, useEffect, useState } from "react";
import httpMethods from "../../api/Service";

const UserContext = createContext<UserContext | null>(null);
export interface UserContext {
  isLoggedin: boolean;
  currentUser: UserModal;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModal>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface UserModal {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  dob: Date;
  userId: string;
  empId: string;
  joinedDate: Date;
  isAdmin: boolean;
  lastActive: string;
  isActive: boolean;
  designation: string;
  address: string;
  profileImageUrl: string;
  totalTickets: number;
  helpedTickets: number;
  _id: string;
}
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
