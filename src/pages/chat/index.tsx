import React from "react";
import "./index.css";
import Search from "./sidebar/Search";
import Groups from "./sidebar/Groups";
import UserList from "./sidebar/UsersList";
import ChatHeader from "./chatbox/Header";
import ChatBody from "./chatbox/Body";
import ChatFooter from "./chatbox/Footer";
const Chat = () => {
  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="search">
          <Search />
        </div>
        <div className="users-group">
          <Groups />
        </div>
        <div className="users-list">
          <UserList />
        </div>
      </div>
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
    </div>
  );
};
export default Chat;
