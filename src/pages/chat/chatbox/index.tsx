import React, { useEffect, useState } from "react";
import ChatBody from "./Body";
import ChatFooter from "./Footer";
import ChatHeader from "./Header";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import logo from "../../../assets/images/Logo.png";
import {
  RoomMessages,
  UserContext,
  UserModal,
} from "../../../modals/UserModals";

export const ChatBox = () => {
  const { selectedUser, setSelectedUser, socket, currentUser, currentRoom } =
    useUserContext() as UserContext;
  const [totalMessages, setTotalMessages] = useState<RoomMessages[]>([]);
  useEffect(() => {
    return () => {
      setSelectedUser({} as UserModal);
    };
  }, []);
  const handleBack = () => {
    setSelectedUser({} as UserModal);
    socket.emit("leaveRoom", currentRoom);
  };
  return (
    <div className="chatbox">
      {selectedUser._id ? (
        <>
          <div className="chat-header">
            <ChatHeader
              selectedUser={selectedUser}
              totalMessages={totalMessages}
              currentUser={currentUser}
              handleBack={handleBack}
            />
          </div>
          <div className="chat-body">
            <ChatBody
              socket={socket}
              currentUser={currentUser}
              setTotalMessages={(messages: RoomMessages[]) =>
                setTotalMessages(messages)
              }
              totalMessages={totalMessages}
            />
          </div>
          <div className="chat-footer">
            <ChatFooter
              currentUser={currentUser}
              currentRoom={currentRoom}
              selectedUser={selectedUser}
              socket={socket}
            />
          </div>
        </>
      ) : (
        <div className="resource-logo">
          {/* <h3
            style={{ fontFamily: "sans-serif", color: "#4caf50" }}
            className="text-center"
          > */}
          {/* <h4> Welcome To </h4>
            <h4> ResourceOne Chat</h4> */}
          <img src={logo} alt="company-logo" />
          {/* </h3> */}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
