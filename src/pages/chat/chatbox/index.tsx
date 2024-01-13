import React from "react";
import ChatBody from "./Body";
import ChatFooter from "./Footer";
import ChatHeader from "./Header";

export const ChatBox = () => {
  return (
    <div className="chatbox">
      <div className="chat-header">
        <ChatHeader />
      </div>
      <div className="chat-body">
        <ChatBody />
      </div>
      <div className="chat-footer">
        <ChatFooter />
      </div>
    </div>
  );
};

export default ChatBox;
