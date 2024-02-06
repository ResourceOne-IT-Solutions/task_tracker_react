import React, { useEffect, useState } from "react";
import "./App.css";
import Routespage from "./Routes/Routespage";
import { useUserContext } from "./components/Authcontext/AuthContext";
import { UserContext } from "./modals/UserModals";
import SocketEvents from "./utils/SocketEvents";
import { AVAILABLE, BREAK } from "./utils/Constants";
let isInBreak = false;
function App() {
  const userContext = useUserContext();
  const { socket, currentUser, setNotificationRooms, isLoggedin } =
    userContext as UserContext;
  //  when there is no clicks for 15 minutes status will be changed to Break
  let inactivityTimer: NodeJS.Timeout | undefined;
  function resetInactivityTimer() {
    if (isInBreak) {
      isInBreak = false;
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
      isInBreak = true;
      socket.emit("changeStatus", { id: currentUser._id, status: BREAK });
    }
  }

  useEffect(() => {
    if (currentUser._id) {
      const roomsCount = Object.keys(currentUser.newMessages).length;
      setNotificationRooms(roomsCount);
    }
  }, [currentUser.newMessages]);

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
      {isLoggedin && <SocketEvents />}
    </div>
  );
}

export default App;
