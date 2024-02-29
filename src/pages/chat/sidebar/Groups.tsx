import React, { useEffect, useState } from "react";
import "./styles/group.css";
import httpMethods from "../../../api/Service";
import { NameIdInterface, UserModal } from "../../../modals/UserModals";
import ReusableModal from "../../../utils/modal/ReusableModal";
import CreateGroup from "./CreateGroupModal";
import { Socket } from "socket.io-client";
import { getFormattedTime } from "../../../utils/utils";
import { ChatLoader } from "./utils/utils";

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
  selectedUser: UserModal;
  setTotalGroups: React.Dispatch<React.SetStateAction<GroupInterface[]>>;
  totalGroups: GroupInterface[];
  isLoading: boolean;
}

const Groups = ({
  socket,
  currentUser,
  setSelectedUser,
  currentRoom,
  setCurrentRoom,
  selectedUser,
  totalGroups,
  setTotalGroups,
  isLoading,
}: GroupChatProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");

  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
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
          <p className="m-0">
            <b>Add New Group</b>
          </p>{" "}
          <p className="m-0">
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
        {isLoading ? (
          <ChatLoader />
        ) : (
          <>
            {totalGroups.length ? (
              <>
                {" "}
                {totalGroups.map((group) => (
                  <div
                    key={group._id}
                    className={`group ${
                      selectedUser._id === group._id ? "selected-user" : ""
                    }`}
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
              <div>No Groups Availble</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Groups;
