import React from "react";
import "./styles/userlist.css";
import { UserModal } from "../../../modals/UserModals";
import { Socket } from "socket.io-client";
import { getFullName, statusIndicator } from "../../../utils/utils";

interface UserListProps {
  users: UserModal[];
  socket: Socket;
  currentUser: UserModal;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserModal>>;
  currentRoom: string;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
}
const getRoomId = (id1: string, id2: string) => {
  if (id1 > id2) {
    return id1 + "-" + id2;
  } else {
    return id2 + "-" + id1;
  }
};

const UserList = ({
  users,
  socket,
  currentUser,
  setSelectedUser,
  currentRoom,
  setCurrentRoom,
  searchQuery,
}: UserListProps) => {
  const handleProfileClick = (user: UserModal) => {
    setSelectedUser(user);
    const RoomId = getRoomId(currentUser._id, user._id);
    setCurrentRoom(RoomId);
    socket.emit("joinRoom", { room: RoomId, previousRoom: currentRoom });
  };
  const filteredUsers = users.filter((user) => {
    const fullName = getFullName(user).toLowerCase();
    const designation = user.designation.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      designation.includes(searchQuery.toLowerCase())
    );
  });
  return (
    <div className="user-list-container">
      {filteredUsers.length ? (
        filteredUsers.map((user: UserModal) => (
          <div
            key={user._id}
            className="user-main"
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
                <div className="user-newmsg-count">13</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <div>
            {" "}
            <span>Loading</span>
          </div>
          <div className="spinner-border text-success" role="status">
            <span className="sr-only"></span>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
