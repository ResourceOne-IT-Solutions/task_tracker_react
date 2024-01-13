import React from "react";
import "./App.css";
import Routespage from "./Routes/Routespage";
import { useUserContext } from "./components/Authcontext/AuthContext";
import { UserContext } from "./modals/UserModals";

function App() {
  const userContext = useUserContext();
  const { socket, currentUser, setCurrentUser } = userContext as UserContext;
  socket.off("notifications").on("notifications", (id, sender) => {
    if (currentUser._id == id) {
      // currentUser.newMessages[room] = (currentUser.newMessages[""]) + 1
      // let totalMessage = Object.values(currentUser?.newMessages).length && Object.values(currentUser?.newMessages)?.reduce((a, b) => a + b)
      // const roomsCount = Object.keys(currentUser.newMessages).length
      // setNotificationRooms(roomsCount)
      // setTotalMessages(totalMessage)
      setCurrentUser(currentUser);
      // alert('You got a message from ' + sender.fName)
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("Message", {
          body: `You got a message from ${sender}`,
          icon: "",
          // Other options like icon, badge, etc.
        });
      }
      alert(`You got a message from ${sender}`);
    }
  });
  socket.off("ticketAssigned").on("ticketAssigned", (id, sender) => {
    alert(`${sender.name} Assigned you A ticket`);
  });
  socket.off("ticketsRequest").on("ticketsRequest", (all) => {
    alert(`${all.sender.name} is Requesting for ${all.client.name} Tickets`);
  });
  socket.off("chatRequest").on("chatRequest", (all) => {
    alert(`${all.user.name} is Requesting to Chat  with ${all.opponent.name}`);
  });
  return (
    <div className="App">
      <Routespage />
    </div>
  );
}

export default App;
