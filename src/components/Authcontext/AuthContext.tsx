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
import { ACCESS_TOKEN, SOCKET_URL } from "../../utils/Constants";
import { Severity } from "../../utils/modal/notification";
import { Loader, checkIsMobileView } from "../../utils/utils";

const UserContextProvider = createContext<UserContext | null>(null);
const socket = io(SOCKET_URL);
interface AuthContextProps {
  children: React.ReactNode;
}
const LOCATION: { [key: string]: string } = {};

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
  const [isMobileView, setIsMobileView] = useState(false);
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
    isMobileView,
  };
  const handleResize = () => {
    setIsMobileView(checkIsMobileView());
  };
  function success(position: { coords: { latitude: any; longitude: any } }) {
    const { latitude, longitude } = position.coords;
    LOCATION["Latitude"] = latitude;
    LOCATION["Longitude"] = longitude;
  }
  function error() {
    console.error("Unable to retrieve your location");
    alertModal({
      severity: Severity.ERROR,
      content: "Location Needed to access the page",
      title: "Login Error",
    });
  }
  const handleOnLoad = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Geolocation is not supported by your browser");
    }

    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Wel-Come", {
            body: `Welcome to ResourceOne ChatBox`,
            icon: "#",
            tag: "Welcome Message",
          });
        }
      });
    }
  };
  useEffect(() => {
    handleResize();
    document.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("resize", handleResize);
    };
  }, [window.innerHeight, window.innerWidth]);
  useEffect(() => {
    setIsUserFetching(true);
    window.addEventListener("load", handleOnLoad);
    if (ACCESS_TOKEN()) {
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
    return () => {
      window.removeEventListener("load", handleOnLoad);
    };
  }, []);
  return (
    <UserContextProvider.Provider value={value}>
      {isUserFetching ? <Loader /> : children}
    </UserContextProvider.Provider>
  );
};
export const useUserContext = () => useContext(UserContextProvider);
export const useAuth = () => {
  const { setCurrentUser, setIsLoggedIn, alertModal } =
    useUserContext() as UserContext;
  const [isLoading, setIsLoading] = useState(true);
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
        alertModal({
          severity: Severity.ERROR,
          content: "Location Needed to access the page",
          title: "Login Error",
        });
      },
    );
  };
  return { getLogin, isLoading, setIsLoading };
};
export default AuthContext;
