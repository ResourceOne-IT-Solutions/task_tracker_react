import React from "react";
import { UserContext } from "../modals/UserModals";
import { useUserContext } from "../components/Authcontext/AuthContext";
import { Severity } from "./modal/notification";

const SocketEvents = () => {
  const {
    socket,
    currentUser,
    setCurrentUser,
    setNotificationRooms,
    setTotalMessages,
    alertModal,
    popupNotification,
    setRequestMessageCount,
  } = useUserContext() as UserContext;
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
        const content = `You got a ${type} from ${from.name}`;
        if ("Notification" in window && Notification.permission === "granted") {
          const notification = new Notification("Message", {
            body: content,
            // You can add an icon if needed
            // icon: "path/to/icon.png",
            tag: type,
          });
        }
        alertModal({ severity: Severity.WARNING, content });
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
      const content = `${sender.name} Assigned you A ticket`;
      alertModal({ severity: Severity.WARNING, content });
    }
  });
  socket
    .off("ticketsRequest")
    .on("ticketsRequest", ({ sender, client, _id }) => {
      if (currentUser.isAdmin) {
        const content = `${sender.name} is Requesting for ${client.name} Tickets`;
        alertModal({ severity: Severity.WARNING, content });
        setRequestMessageCount((c) => [...c, _id]);
      }
    });
  socket.off("chatRequest").on("chatRequest", ({ sender, opponent, _id }) => {
    if (currentUser.isAdmin) {
      const content = `${sender.name} is Requesting to Chat  with ${opponent.name}`;
      alertModal({ severity: Severity.WARNING, content });
      setRequestMessageCount((c) => [...c, _id]);
    }
  });
  socket.off("ticketRaiseStatus").on("ticketRaiseStatus", (content) => {
    popupNotification({ severity: Severity.SUCCESS, content });
  });
  socket
    .off("userRaisedTicket")
    .on("userRaisedTicket", ({ sender, content, _id }) => {
      const content1 = `${sender.name} is saying ${content}`;
      popupNotification({ severity: Severity.SUCCESS, content: content1 });
      setRequestMessageCount((c) => [...c, _id]);
    });
  socket
    .off("resourceAssigned")
    .on("resourceAssigned", ({ ticket, sender, resource, user }) => {
      if (currentUser._id === user.id) {
        const content = `${sender.name} assigned ${resource.name} as a resource for your ${ticket.name} ticket`;
        alertModal({ severity: Severity.WARNING, content });
      }
      if (currentUser._id === resource.id) {
        const content = `${user.name} is needs ur help for the ${ticket.name} ticket, ${sender.name} assigned you as a resource`;
        alertModal({ severity: Severity.WARNING, content });
      }
    });
  socket
    .off("adminMessageToAll")
    .on("adminMessageToAll", ({ sender, content, _id }) => {
      if (!currentUser.isAdmin) {
        const msg = `${content}   \n --- from ${sender.name}`;
        alertModal({ severity: Severity.WARNING, content: msg });
        socket.emit("updateAdminMessageStatus", {
          userId: currentUser._id,
          messageId: _id,
          status: "DELIVERY",
        });
      }
    });
  socket.off("error").on("error", (content: string) => {
    alertModal({ severity: Severity.ERROR, content, title: "Socket Error" });
  });
  return <></>;
};

export default SocketEvents;
