import React, { useEffect, useState } from "react";
import "./styles/group.css";
import httpMethods from "../../../api/Service";
import { UserModal } from "../../../modals/UserModals";
import { getFullName } from "../../../utils/utils";
import { Button } from "react-bootstrap";
import ReusableModal from "../../../utils/modal/ReusableModal";
import CreateGroup from "./CreateGroupModal";

export interface GroupInterface {
  name: string;
  members: { name: string; id: string }[];
  description: string;
  time: string;
  date: string;
  _id: string;
}

const Groups = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState<UserModal[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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
    httpMethods.get<GroupInterface[]>("/message/groups").then((groups) => {
      setTotalGroups(groups);
    });
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
  return (
    <div className="group-list-container">
      <div className="create-group" onClick={handleModalClick}>
        Create Group &#43;
      </div>
      {showModal && modalName == "Create Group" && (
        <ReusableModal vals={modalProps}>
          <CreateGroup
            onCreateGroup={(group) => setTotalGroups([...totalGroups, group])}
          />
        </ReusableModal>
      )}
      <div className="group-main">
        {totalGroups.length ? (
          <>
            {" "}
            {totalGroups.map((group) => (
              <div key={group._id} className="group">
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
                <div className="time-stamp">{group.time}</div>
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
