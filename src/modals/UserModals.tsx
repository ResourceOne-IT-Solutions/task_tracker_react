import { Socket } from "socket.io-client";

export interface UserContext {
  isLoggedin: boolean;
  currentUser: UserModal;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModal>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
}
export type Status = "Available" | "Busy" | "Offline";
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
  resolvedTickets: number;
  pendingTickets: number;
  progressTickets: number;
  _id: string;
  status: Status;
}

export interface LoginPayload {
  userId: string;
  password: string;
  isAdmin: boolean;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  dob: string;
  joinedDate: string;
  isAdmin: null;
  designation: string;
  profileImageUrl: string | null;
  userId?: string;
  address: string;
}
