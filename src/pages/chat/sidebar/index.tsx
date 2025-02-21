import React, { useEffect, useState } from "react";
import "./styles/index.css";
import Groups, { GroupInterface } from "./Groups";
import Search from "./Search";
import UserList from "./UsersList";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext, UserModal } from "../../../modals/UserModals";
import httpMethods from "../../../api/Service";

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
  const [totalGroups, setTotalGroups] = useState<GroupInterface[]>([]);
  const [isGroupLoading, setIsGroupLoading] = useState<boolean>(false);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const [isGroupSelected, setIsGroupSelected] = useState(false);
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
      setIsUsersLoading(false);
    });
  useEffect(() => {
    setIsGroupLoading(true);
    setIsUsersLoading(true);
    socket.emit("newUser", { userId: currentUser._id });
    httpMethods
      .get<{ data: GroupInterface[] }>(
        `/message/groups/${!currentUser.isAdmin ? currentUser._id : ""}`,
      )
      .then((groups) => {
        setTotalGroups(groups.data);
      })
      .catch((error) => error)
      .finally(() => {
        setIsGroupLoading(false);
      });
  }, []);
  const handleSelectTab = (isGroups: boolean) => {
    setIsGroupSelected(isGroups);
  };
  return (
    <div className="sidebar">
      <div className="search">
        <Search onSearch={handleSearch} />
      </div>
      <div className="users-list">
        <div className="chat-tabs">
          <span
            className={!isGroupSelected ? "active" : ""}
            onClick={() => handleSelectTab(false)}
          >
            Users
          </span>
          <span
            className={isGroupSelected ? "active" : ""}
            onClick={() => handleSelectTab(true)}
          >
            Groups
          </span>
        </div>
        {isGroupSelected ? (
          <Groups
            socket={socket}
            currentUser={currentUser}
            setSelectedUser={setSelectedUser}
            currentRoom={currentRoom}
            setCurrentRoom={setCurrentRoom}
            setCurrentUser={setCurrentUser}
            selectedUser={selectedUser}
            totalGroups={totalGroups}
            setTotalGroups={setTotalGroups}
            isLoading={isGroupLoading}
          />
        ) : (
          <UserList
            users={users}
            currentUser={currentUser}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            currentRoom={currentRoom}
            setCurrentRoom={setCurrentRoom}
            socket={socket}
            searchQuery={searchQuery}
            isLoading={isUsersLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;
