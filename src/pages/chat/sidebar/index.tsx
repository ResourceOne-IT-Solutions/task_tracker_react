import React from "react";
import Groups from "./Groups";
import Search from "./Search";
import UserList from "./UsersList";

const ChatSideBar = () => {
  return (
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
  );
};

export default ChatSideBar;
