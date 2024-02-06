import React from "react";
import { Socket } from "socket.io-client";
import { UserContext, UserModal } from "../modals/UserModals";
import { useUserContext } from "../components/Authcontext/AuthContext";

const SocketEvents = () => {
  const userContext = useUserContext();
  const {
    socket,
    currentUser,
    setCurrentUser,
    setNotificationRooms,
    setTotalMessages,
  } = userContext as UserContext;
  socket
    .off("notifications")
    .on("notifications", ({ id, from, type, room }) => {
      if (currentUser._id == id) {
        currentUser.newMessages[room] =
          (currentUser.newMessages[room] || 0) + 1;
        const totalMessage =
          Object.values(currentUser?.newMessages).length &&
          Object.values(currentUser?.newMessages)?.reduce((a, b) => a + b);
        const roomsCount = Object.keys(currentUser?.newMessages)?.length
          ? Object.keys(currentUser?.newMessages).length
          : 0;
        setNotificationRooms(roomsCount);
        setTotalMessages(totalMessage);
        setCurrentUser(currentUser);
        // alert('You got a message from ' + sender.fName)
        if ("Notification" in window && Notification.permission === "granted") {
          const notification = new Notification("Message", {
            body: `You got a message from ${from.name}`,
            icon: "",
            // Other options like icon, badge, etc.
          });
        }
        alert(`You got a ${type} from ${from.name}`);
      }
    });
  socket.off("statusUpdate").on("statusUpdate", (user) => {
    setCurrentUser(user);
    const roomsCount = Object.keys(user?.newMessages)?.length
      ? Object.keys(user?.newMessages).length
      : 0;
    setNotificationRooms(roomsCount);
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
    .on("adminMessageToAll", ({ sender, content, _id }) => {
      if (!currentUser.isAdmin) {
        const message = `${content}   \n --- from ${sender.name}`;
        alert(message);
        socket.emit("updateAdminMessageStatus", {
          userId: currentUser._id,
          messageId: _id,
          status: "DELIVERY",
        });
      }
    });
  socket.off("error").on("error", (error) => {
    alert(JSON.stringify(error));
  });
  return <></>;
};

export default SocketEvents;
