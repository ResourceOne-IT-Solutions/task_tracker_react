import React from "react";
import "./index.css";
import ChatBox from "./chatbox";
import ChatSideBar from "./sidebar";
const Chat = () => {
  return (
    <div className="chat-app">
      <ChatSideBar />
      <ChatBox />
    </div>
  );
};
export default Chat;
