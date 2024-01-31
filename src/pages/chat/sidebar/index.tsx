import React, { useEffect, useState } from "react";
import "./styles/index.css";
import Groups from "./Groups";
import Search from "./Search";
import UserList from "./UsersList";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext, UserModal } from "../../../modals/UserModals";

const ChatSideBar = () => {
  const userContext = useUserContext();
  const {
    socket,
    currentUser,
    selectedUser,
    setSelectedUser,
    currentRoom,
    setCurrentRoom,
    setCurrentUser,
  } = userContext as UserContext;
  const [users, setUsers] = useState<UserModal[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  socket
    .off("newUser")
    .on("newUser", ({ userPayload, userId, opponentPayload, opponentId }) => {
      if (userId == currentUser._id) {
        setUsers(userPayload);
      } else if (opponentId == currentUser._id) {
        setUsers(opponentPayload);
      } else {
        const latestData = users.map((user) => {
          user.status = userPayload.find(
            (val: UserModal) => val._id === user._id,
          ).status;
          return user;
        });
        setUsers(latestData);
      }
    });
  useEffect(() => {
    socket.emit("newUser", { userId: currentUser._id });
  }, []);
  return (
    <div className="sidebar">
      <div className="search">
        <Search onSearch={handleSearch} />
      </div>
      <div className="users-group">
        <Groups
          socket={socket}
          currentUser={currentUser}
          setSelectedUser={setSelectedUser}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoom}
          setCurrentUser={setCurrentUser}
        />
      </div>
      <div className="users-list">
        <UserList
          users={users}
          currentUser={currentUser}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoom}
          socket={socket}
          searchQuery={searchQuery}
          setCurrentUser={setCurrentUser}
        />
      </div>
    </div>
  );
};

export default ChatSideBar;
