import React, { useEffect, useState } from "react";
import Groups from "./Groups";
import Search from "./Search";
import UserList from "./UsersList";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext, UserModal } from "../../../modals/UserModals";

const ChatSideBar = () => {
  const userContext = useUserContext();
  const { socket, currentUser, setSelectedUser, currentRoom, setCurrentRoom } =
    userContext as UserContext;
  const [users, setUsers] = useState<UserModal[]>([]);

  socket.off("newUser").on("newUser", (userlist) => {
    setUsers(userlist);
  });
  useEffect(() => {
    socket.emit("newUser");
  }, []);
  return (
    <div className="sidebar">
      <div className="search">
        <Search />
      </div>
      <div className="users-group">
        <Groups />
      </div>
      <div className="users-list">
        <UserList
          users={users}
          currentUser={currentUser}
          setSelectedUser={setSelectedUser}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoom}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default ChatSideBar;
