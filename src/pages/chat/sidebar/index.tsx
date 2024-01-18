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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  socket
    .off("newUser")
    .on("newUser", (userPayload, userId, opponentPayload, opponentId) => {
      if (userId == currentUser._id) {
        setUsers(userPayload);
      } else if (opponentId == currentUser._id) {
        setUsers(opponentPayload);
      }
    });
  useEffect(() => {
    socket.emit("newUser", currentUser._id);
  }, []);
  return (
    <div className="sidebar">
      <div className="search">
        <Search onSearch={handleSearch} />
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
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default ChatSideBar;
