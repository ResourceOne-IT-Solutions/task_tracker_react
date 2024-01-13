import React from "react";
import "./styles/header.css";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext } from "../../../modals/UserModals";
import { GreenDot, RedDot } from "../../../utils/Dots/Dots";
const ChatHeader = () => {
  const userContext = useUserContext();
  const { selectedUser, setSelectedUser } = userContext as UserContext;
  const handleBackHeader = () => {
    setSelectedUser({ ...selectedUser, _id: "" });
  };
  return (
    <div className="header-container">
      <div className="header-navbar">
        <div className="header-backbtn-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-arrow-left-circle"
            viewBox="0 0 16 16"
            onClick={handleBackHeader}
          >
            <path
              fillRule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
            />
          </svg>
        </div>
        {selectedUser._id && (
          <>
            <div className="profile-img">
              <img src={selectedUser.profileImageUrl} alt="img" />
            </div>
            <div className="header-user-name">
              {selectedUser.firstName} {selectedUser.lastName}
            </div>
            <div className="user-status">
              {" "}
              {selectedUser.status == "Offline" ? <RedDot /> : <GreenDot />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
