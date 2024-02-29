import React, { useEffect, useState } from "react";
import "./styles/userlist.css";
import { UserModal } from "../../../modals/UserModals";
import { Socket } from "socket.io-client";
import {
  ProfileImage,
  getFullName,
  getRoomId,
  statusIndicator,
} from "../../../utils/utils";
import { ChatLoader } from "./utils/util";

interface UserListProps {
  users: UserModal[];
  socket: Socket;
  currentUser: UserModal;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserModal>>;
  currentRoom: string;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  selectedUser: UserModal;
  isLoading: boolean;
}

const UserList = ({
  users,
  socket,
  currentUser,
  selectedUser,
  setSelectedUser,
  currentRoom,
  setCurrentRoom,
  searchQuery,
  isLoading,
}: UserListProps) => {
  const handleProfileClick = (user: UserModal) => {
    setSelectedUser(user);
    delete currentUser.newMessages[getRoomId(currentUser._id, user._id)];
    const RoomId = getRoomId(currentUser._id, user._id);
    setCurrentRoom(RoomId);
    socket.emit("joinRoom", { room: RoomId, previousRoom: currentRoom });
    socket.emit("updateUser", currentUser);
  };
  const [filteredUsers, setFilteredUsers] = useState<UserModal[]>(users);

  useEffect(() => {
    let filteredData = users.filter((user) => {
      const fullName = getFullName(user).toLowerCase();
      const designation = user.designation.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        designation.includes(searchQuery.toLowerCase())
      );
    });
    filteredData = currentUser.isAdmin
      ? filteredData
      : filteredData.filter((user) => user.isAdmin);
    setFilteredUsers(filteredData);
  }, [users, searchQuery]);
  return (
    <div className="user-list-container">
      {isLoading ? (
        <ChatLoader />
      ) : (
        <>
          {filteredUsers.length ? (
            filteredUsers.map((user: UserModal) => (
              <div
                key={user._id}
                className={`user-main ${
                  selectedUser._id === user._id ? "selected-user" : ""
                }`}
                onClick={() => handleProfileClick(user)}
              >
                <div className="user">
                  <div className="user-img">
                    <ProfileImage filename={user.profileImageUrl} />
                    {statusIndicator(user.status)}
                  </div>
                  <div className="user-name">
                    <p>{getFullName(user)}</p>
                    <p>{user.designation}</p>
                  </div>
                  <div className="user-time-stamp">
                    {currentUser.newMessages[
                      getRoomId(currentUser._id, user._id)
                    ] && (
                      <div className="newmsg-count">
                        {
                          currentUser.newMessages[
                            getRoomId(currentUser._id, user._id)
                          ]
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No Users Available</div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
