import React from "react";
import "./styles/userlist.css";
import { UserModal } from "../../../modals/UserModals";
import { GreenDot, RedDot } from "../../../utils/Dots/Dots";
import { Socket } from "socket.io-client";
import { getFullName, statusIndicator } from "../../../utils/utils";

interface UserListProps {
  users: UserModal[];
  socket: Socket;
  currentUser: UserModal;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserModal>>;
  currentRoom: string;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
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
}: UserListProps) => {
  const handleProfileClick = (user: UserModal) => {
    setSelectedUser(user);
    const RoomId = getRoomId(currentUser._id, user._id);
    setCurrentRoom(RoomId);
    socket.emit("joinRoom", { room: RoomId, previousRoom: currentRoom });
  };
  return (
    <div className="user-list-container">
      {users.map((user: UserModal) => {
        return (
          <div
            key={user._id}
            className="user-main"
            onClick={() => handleProfileClick(user)}
          >
            <div className="user">
              <div className="user-img">
                <img src={user?.profileImageUrl} alt="alt" />{" "}
                {statusIndicator(user.status)}
              </div>
              <div className="user-name">
                <p>{getFullName(user)}</p>
                <p>{user.designation}</p>
              </div>
              <div className="user-time-stamp">1</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
