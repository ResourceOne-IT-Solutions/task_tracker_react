import React, { useEffect, useState } from "react";
import "./styles/group.css";
import httpMethods from "../../../api/Service";
import { NameIdInterface, UserModal } from "../../../modals/UserModals";
import ReusableModal from "../../../utils/modal/ReusableModal";
import CreateGroup from "./CreateGroupModal";
import { Socket } from "socket.io-client";
import { getFormattedTime } from "../../../utils/utils";

export interface GroupInterface {
  name: string;
  members: NameIdInterface[];
  description: string;
  time: Date;
  date: string;
  _id: string;
  admin: NameIdInterface;
}

interface GroupChatProps {
  socket: Socket;
  currentUser: UserModal;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserModal>>;
  currentRoom: string;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserModal>>;
}

const Groups = ({
  socket,
  currentUser,
  setSelectedUser,
  currentRoom,
  setCurrentRoom,
  setCurrentUser,
}: GroupChatProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState<UserModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");
  const [totalGroups, setTotalGroups] = useState<GroupInterface[]>([]);
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    httpMethods.get<UserModal[]>("/users").then((res: any) => {
      setUsers(res);
    });
    httpMethods
      .get<GroupInterface[]>(
        `/message/groups/${!currentUser.isAdmin ? currentUser._id : ""}`,
      )
      .then((groups) => {
        setTotalGroups(groups);
      })
      .catch((error) => error);
  }, []);
  const handleModalClick = () => {
    setModalname("Create Group");
    setModalProps({
      title: "Create Group",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };

  const handleGroupClick = (group: any) => {
    setSelectedUser(group);
    setCurrentRoom(group._id);
    delete currentUser.newMessages[group._id];
    socket.emit("joinRoom", { room: group._id, previousRoom: currentRoom });
    socket.emit("updateUser", currentUser);
  };
  return (
    <div className="group-list-container">
      {currentUser.isAdmin && (
        <div className="create-group" onClick={handleModalClick}>
          <p>
            <b>Groups</b>
          </p>{" "}
          <p>
            <i
              className="bi bi-plus-circle-fill"
              style={{ fontSize: "20px" }}
            ></i>
          </p>
        </div>
      )}
      {showModal && modalName == "Create Group" && (
        <ReusableModal vals={modalProps}>
          <CreateGroup
            onCreateGroup={(group) => setTotalGroups([...totalGroups, group])}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
      <div className="group-main">
        {totalGroups.length ? (
          <>
            {" "}
            {totalGroups.map((group) => (
              <div
                key={group._id}
                className="group"
                onClick={() => handleGroupClick(group)}
              >
                <div className="group-img">
                  <img
                    src="https://cdn.vectorstock.com/i/1000x1000/59/50/business-office-group-team-people-vector-31385950.webp"
                    alt="alt"
                  />
                </div>
                <div className="group-name">
                  <p>{group.name}</p>
                  <p>{group.description}</p>
                </div>
                <div className="time-stamp">
                  {getFormattedTime(group.time)}{" "}
                  {currentUser.newMessages[group._id] && (
                    <span className="newmsg-count">
                      {currentUser.newMessages[group._id]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>NO GROUPS</div>
        )}
      </div>
    </div>
  );
};

export default Groups;
