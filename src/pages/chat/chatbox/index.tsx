import React, { useEffect, useState } from "react";
import ChatBody from "./Body";
import ChatFooter from "./Footer";
import ChatHeader from "./Header";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import {
  RoomMessages,
  UserContext,
  UserModal,
} from "../../../modals/UserModals";

export const ChatBox = () => {
  const userContext = useUserContext();
  const [totalMessages, setTotalMessages] = useState<RoomMessages[]>([]);
  const { selectedUser, setSelectedUser, socket, currentUser, currentRoom } =
    userContext as UserContext;
  useEffect(() => {
    return () => {
      setSelectedUser({} as UserModal);
    };
  }, []);
  return (
    <div className="chatbox">
      {selectedUser._id ? (
        <>
          <div className="chat-header">
            <ChatHeader
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              totalMessages={totalMessages}
              currentUser={currentUser}
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
        <div>
          <h3 style={{ fontFamily: "sans-serif", color: "#4caf50" }}>
            Welcome To ResourceOne Chat
          </h3>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
