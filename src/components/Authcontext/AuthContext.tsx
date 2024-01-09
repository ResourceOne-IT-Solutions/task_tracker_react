import React, { createContext, useContext, useState } from "react";
import { Socket, io } from "socket.io-client";
import { BE_URL } from "../../utils/Constants";

const socket = io(BE_URL);
const UserContext = createContext<UserContext | null>(null);
export interface UserContext {
  isLoggedin: boolean;
  currentUser: UserModal;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModal>>;
  socket: Socket;
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
  const storedDataString = localStorage.getItem("currentUser");
  const storedData = storedDataString ? JSON.parse(storedDataString) : null;
  let user = {} as UserModal;
  if (storedData !== null) {
    user = storedData;
  }
  const [currentUser, setCurrentUser] = useState<UserModal>(user);
  const value: UserContext = {
    isLoggedin: (currentUser as UserModal).lastActive ? true : false,
    currentUser,
    setCurrentUser,
    socket,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export const useUserContext = () => useContext(UserContext);

export default AuthContext;
