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
import { Loader } from "../../utils/utils";

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
  const [isUserFetching, setIsUserFetching] = useState<boolean>(true);
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
  const [requestMessageCount, setRequestMessageCount] = useState<string[]>([]);
  const alertModal = ({
    content,
    severity,
    title,
    onClose,
  }: AlertModalProps) => {
    setShowAlertModal(true);
    setAlertModalContent({ content, severity, title, onClose });
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
    isUserFetching,
  };
  useEffect(() => {
    setIsUserFetching(true);
    const token = localStorage.getItem("accessToken") ?? "";
    if (token) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          httpMethods
            .get<UserModal>(
              `/get-user?latitude=${latitude}&longitude=${longitude}`,
            )
            .then((data) => {
              setCurrentUser(data);
              setIsLoggedIn(true);
              socket.emit("newUser", { userId: data._id });
            })
            .catch((e: any) => {
              setIsLoggedIn(false);
              setCurrentUser({} as UserModal);
            })
            .finally(() => {
              setIsUserFetching(false);
            });
        },
        () => {
          setIsUserFetching(false);
          setIsLoggedIn(false);
        },
      );
    } else {
      setIsUserFetching(false);
    }
  }, []);
  return (
    <UserContextProvider.Provider value={value}>
      {isUserFetching ? <Loader /> : children}
    </UserContextProvider.Provider>
  );
};
export const useUserContext = () => useContext(UserContextProvider);
export const useAuth = () => {
  const { setCurrentUser, setIsLoggedIn } = useUserContext() as UserContext;
  const [isLoading, setIsLoading] = useState(false);
  const getLogin = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLoading(true);
        httpMethods
          .get<UserModal>(
            `/get-user?latitude=${latitude}&longitude=${longitude}`,
          )
          .then((data) => {
            setCurrentUser(data);
            setIsLoggedIn(true);
            socket.emit("newUser", { userId: data._id });
          })
          .catch(() => {
            setIsLoggedIn(false);
            setCurrentUser({} as UserModal);
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
      () => {
        setIsLoggedIn(false);
        setIsLoading(false);
      },
    );
  };
  return { getLogin, isLoading };
};
export default AuthContext;
