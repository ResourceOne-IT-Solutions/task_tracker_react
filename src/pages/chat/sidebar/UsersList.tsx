import React, { useEffect, useState } from "react";
import "./styles/userlist.css";
import { UserModal } from "../../../modals/UserModals";
import { Socket } from "socket.io-client";
import { getFullName, getRoomId, statusIndicator } from "../../../utils/utils";

interface UserListProps {
  users: UserModal[];
  socket: Socket;
  currentUser: UserModal;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserModal>>;
  currentRoom: string;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModal>>;
  selectedUser: UserModal;
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
  setCurrentUser,
}: UserListProps) => {
  const handleProfileClick = (user: UserModal) => {
    setSelectedUser(user);
    delete currentUser.newMessages[getRoomId(currentUser._id, user._id)];
    const RoomId = getRoomId(currentUser._id, user._id);
    setCurrentRoom(RoomId);
    socket.emit("joinRoom", { room: RoomId, previousRoom: currentRoom });
    socket.emit("updateUser", currentUser);
  };
  let filteredUsers = users.filter((user) => {
    const fullName = getFullName(user).toLowerCase();
    const designation = user.designation.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      designation.includes(searchQuery.toLowerCase())
    );
  });
  filteredUsers = currentUser.isAdmin
    ? filteredUsers
    : filteredUsers.filter((user) => user.isAdmin);
  return (
    <div className="user-list-container">
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
                <img src={user.profileImageUrl} alt="alt" />{" "}
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
        <div className="loader">
          <div>
            {" "}
            <span>Loading</span>
          </div>
          <div className="spinner-border text-success" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
