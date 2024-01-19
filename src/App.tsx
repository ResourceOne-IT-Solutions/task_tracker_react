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
    if (currentUser._id === id) {
      alert(`${sender.name} Assigned you A ticket`);
    }
  });
  socket.off("ticketsRequest").on("ticketsRequest", ({ sender, client }) => {
    if (currentUser.isAdmin) {
      alert(`${sender.name} is Requesting for ${client.name} Tickets`);
    }
  });
  socket.off("chatRequest").on("chatRequest", ({ sender, opponent }) => {
    if (currentUser.isAdmin) {
      alert(`${sender.name} is Requesting to Chat  with ${opponent.name}`);
    }
  });
  socket
    .off("resourceAssigned")
    .on("resourceAssigned", ({ ticket, sender, resource, user }) => {
      if (currentUser._id === user.id) {
        alert(
          `${sender.name} assigned ${resource.name} as a resource for your ${ticket.name} ticket`,
        );
      }
      if (currentUser._id === resource.id) {
        alert(
          `${user.name} is needs ur help for the ${ticket.name} ticket, ${sender.name} assigned you as a resource`,
        );
      }
    });
  socket
    .off("adminMessageToAll")
    .on("adminMessageToAll", ({ sender, content }) => {
      if (!currentUser.isAdmin) {
        const message = `${content}   \n --- from ${sender.name}`;
        alert(message);
      }
    });
  socket.off("error").on("error", (error) => {
    alert(JSON.stringify(error));
  });
  return (
    <div className="App">
      <Routespage />
    </div>
  );
}

export default App;
