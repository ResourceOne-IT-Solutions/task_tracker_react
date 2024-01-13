import React from "react";
import ChatBody from "./Body";
import ChatFooter from "./Footer";
import ChatHeader from "./Header";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext } from "../../../modals/UserModals";

export const ChatBox = () => {
  const userContext = useUserContext();
  const { selectedUser } = userContext as UserContext;
  return (
    <div className="chatbox">
      {selectedUser._id ? (
        <>
          <div className="chat-header">
            <ChatHeader />
          </div>
          <div className="chat-body">
            <ChatBody />
          </div>
          <div className="chat-footer">
            <ChatFooter />
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
