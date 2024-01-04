import React, { createContext, useContext, useState } from "react";

const UserContext = createContext<UserContext | null>(null);
export interface UserContext {
  isLoggedin: boolean;
  currentUser: object;
  setCurrentUser: React.Dispatch<React.SetStateAction<object>>;
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
}
interface AuthContextProps {
  children: React.ReactNode;
}
const AuthContext = ({ children }: AuthContextProps) => {
  const storedDataString = localStorage.getItem("currentUser");
  const storedData = storedDataString ? JSON.parse(storedDataString) : null;
  let user = {};
  if (storedData !== null) {
    user = storedData;
  }
  const [currentUser, setCurrentUser] = useState<UserModal | object>(user);
  const value: UserContext = {
    isLoggedin: (currentUser as UserModal).lastActive ? true : false,
    currentUser,
    setCurrentUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export const useUserContext = () => useContext(UserContext);

export default AuthContext;
