import React, { useEffect, useState } from "react";
import "./App.css";
import Routespage from "./Routes/Routespage";
import { useUserContext } from "./components/Authcontext/AuthContext";
import { UserContext } from "./modals/UserModals";
import SocketEvents from "./utils/SocketEvents";
import { AVAILABLE, SLEEP } from "./utils/Constants";
import Alert from "./utils/modal/alert";
import Notifications from "./utils/modal/notification";

let isInSleep = false;
function App() {
  const userContext = useUserContext();
  const {
    socket,
    currentUser,
    setNotificationRooms,
    isLoggedin,
    showAlertModal,
    setShowAlertModal,
    alertModalContent,
    showNotification,
    setShowNotification,
  } = userContext as UserContext;
  //  when there is no clicks for 15 minutes status will be changed to Break
  let inactivityTimer: NodeJS.Timeout | undefined;
  function resetInactivityTimer() {
    if (isInSleep) {
      isInSleep = false;
      socket.emit("changeStatus", { id: currentUser._id, status: AVAILABLE });
    }
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(
      () => {
        changeStatus();
      },
      15 * 60 * 1000,
    );
  }
  function changeStatus() {
    if (!currentUser.isAdmin && currentUser._id) {
      isInSleep = true;
      socket.emit("changeStatus", { id: currentUser._id, status: SLEEP });
    }
  }

  useEffect(() => {
    if (currentUser._id) {
      const roomsCount = Object.keys(currentUser.newMessages).length;
      setNotificationRooms(roomsCount);
    }
  }, [currentUser.newMessages]);
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Permission granted, you can now show notifications
          const notification = new Notification("Wel-Come", {
            body: `Welcome to ResourceOne ChatBox`,
            icon: "#",
            tag: "Welcome Message",
            // Other options like icon, badge, etc.
          });
        }
      });
    }
  }, []);
  useEffect(() => {
    if (!currentUser.isAdmin && isLoggedin) {
      document.addEventListener("click", resetInactivityTimer);
      resetInactivityTimer();
    }
    return () => {
      if (!currentUser.isAdmin && isLoggedin) {
        document.removeEventListener("click", resetInactivityTimer);
      }
    };
  }, [isLoggedin]);
  return (
    <div className="App">
      <Routespage />
      <SocketEvents />
      {showAlertModal && (
        <Alert
          content={alertModalContent.content}
          severity={alertModalContent.severity}
          onClose={(val) => setShowAlertModal(val)}
          title={alertModalContent.title}
          show={showAlertModal}
        />
      )}
      {showNotification.show && (
        <Notifications
          content={showNotification.content}
          severity={showNotification.severity}
          onClose={(show) => setShowNotification({ ...showNotification, show })}
        />
      )}
    </div>
  );
}

export default App;
