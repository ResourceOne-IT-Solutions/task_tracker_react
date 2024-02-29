import { Socket } from "socket.io-client";
import { MessageModel } from "./MessageModals";
import { Severity } from "../utils/modal/notification";

export interface AlertModalProps {
  content: string;
  severity: Severity;
  title?: string;
  onClose?: (val: boolean) => void;
}

export interface PopupNotification {
  content: string;
  severity: Severity;
}
export interface ShowNotificationPopup extends PopupNotification {
  show: boolean;
}

export interface UserContext {
  isLoggedin: boolean;
  currentUser: UserModal;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModal>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
  selectedUser: UserModal;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserModal>>;
  currentRoom: string;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  totalMessages: number;
  setTotalMessages: React.Dispatch<React.SetStateAction<number>>;
  notificationRooms: number;
  setNotificationRooms: React.Dispatch<React.SetStateAction<number>>;
  alertModal: (data: AlertModalProps) => void;
  alertModalContent: AlertModalProps;
  setAlertModalContent: React.Dispatch<React.SetStateAction<AlertModalProps>>;
  showAlertModal: boolean;
  setShowAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
  popupNotification: (data: PopupNotification) => void;
  showNotification: ShowNotificationPopup;
  setShowNotification: React.Dispatch<
    React.SetStateAction<ShowNotificationPopup>
  >;
  setRequestMessageCount: React.Dispatch<React.SetStateAction<string[]>>;
  requestMessageCount: string[];
  isUserFetching: boolean;
}
export type Status =
  | "Available"
  | "Break"
  | "Offline"
  | "On Ticket"
  | "Sleep"
  | "Breakfast Break"
  | "Lunch Break"
  | "";

export interface NameIdInterface {
  name: string;
  id: string;
}
export interface LoginInterface {
  inTime: Date;
  outTime: Date;
  date: Date;
  _id: string;
}
export interface BreakInterface {
  startDate: string;
  startTime: Date;
  endDate: string;
  endTime: Date;
  type: string;
  status: string;
  duration: number;
}
export interface BreakInterfaceObject {
  [key: string]: BreakInterface[];
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
  resolvedTickets: number;
  pendingTickets: number;
  progressTickets: number;
  _id: string;
  status: Status;
  newMessages: { [key: string]: number };
  members: NameIdInterface[];
  gender: string;
  loginTimings: LoginInterface[];
  breakTime: BreakInterface[];
}
export type Type = "message" | "application/pdf" | "image/jpeg" | "contact";

export interface RoomMessages {
  messageByDate: MessageModel[];
  _id: string;
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
  profileImageUrl: File | null;
  userId?: string;
  address: string;
  gender: string;
  createdBy?: NameIdInterface;
}
export interface OtpInterface {
  message: string;
  userId?: string;
  email?: string;
}
