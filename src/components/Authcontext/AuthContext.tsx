import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import httpMethods from "../../api/Service";
import {
  AlertModalProps,
  PopupNotification,
  ShowNotificationPopup,
  UserContext,
  UserModal,
} from "../../modals/UserModals";
import { BE_URL } from "../../utils/Constants";
import { Severity } from "../../utils/modal/notification";

const UserContextProvider = createContext<UserContext | null>(null);
const socket = io(BE_URL);
interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext = ({ children }: AuthContextProps) => {
  const [currentUser, setCurrentUser] = useState<UserModal>({} as UserModal);
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserModal>({} as UserModal);
  const [currentRoom, setCurrentRoom] = useState("");
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [notificationRooms, setNotificationRooms] = useState<number>(0);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertModalContent, setAlertModalContent] = useState<AlertModalProps>({
    content: "",
    severity: Severity.NULL,
    title: "",
  });
  const [showNotification, setShowNotification] =
    useState<ShowNotificationPopup>({
      show: false,
      severity: Severity.NULL,
      content: "",
    });
  const [requestMessageCount, setRequestMessageCount] = useState<number>(0);
  const alertModal = ({ content, severity, title }: AlertModalProps) => {
    setShowAlertModal(true);
    setAlertModalContent({ content, severity, title });
  };
  const popupNotification = ({ content, severity }: PopupNotification) => {
    setShowNotification({ show: true, severity, content });
  };
  const value: UserContext = {
    isLoggedin,
    currentUser,
    setCurrentUser,
    setIsLoggedIn,
    socket,
    selectedUser,
    setSelectedUser,
    currentRoom,
    setCurrentRoom,
    totalMessages,
    setTotalMessages,
    notificationRooms,
    setNotificationRooms,
    alertModal,
    showAlertModal,
    setShowAlertModal,
    alertModalContent,
    setAlertModalContent,
    showNotification,
    setShowNotification,
    popupNotification,
    requestMessageCount,
    setRequestMessageCount,
  };
  useEffect(() => {
    httpMethods
      .get<UserModal>("/get-user")
      .then((data) => {
        setCurrentUser(data);
        setIsLoggedIn(true);
        socket.emit("newUser", { userId: data._id });
      })
      .catch((e: any) => {
        setIsLoggedIn(false);
        setCurrentUser({} as UserModal);
        alertModal({
          severity: Severity.ERROR,
          content: e.message,
          title: "Login Error",
        });
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
