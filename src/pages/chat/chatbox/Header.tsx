import React, { useEffect, useRef, useState } from "react";
import "./styles/header.css";
import { RoomMessages, UserModal } from "../../../modals/UserModals";
import { getFullName, statusIndicator } from "../../../utils/utils";
import { GROUP_IMG_URL } from "../../../utils/Constants";
import { Button } from "react-bootstrap";
import jsPDF from "jspdf";

interface Chatprops {
  selectedUser: UserModal;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserModal>>;
  totalMessages: RoomMessages[];
  currentUser: UserModal;
}

const ChatHeader = ({
  selectedUser,
  setSelectedUser,
  totalMessages,
  currentUser,
}: Chatprops) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);
  const handleBackHeader = () => {
    setSelectedUser({} as UserModal);
  };
  const handleOpenBtn = () => {
    setPopupOpen(!isPopupOpen);
  };
  const handleExportBtn = () => {
    const chatHistory = totalMessages.flatMap((messages) =>
      messages.messageByDate.map((message) => {
        return `${message.from.name}: ${message.content} - ${new Date(
          message.date,
        ).toLocaleDateString()} ${new Date(message.time).toLocaleTimeString()}`;
      }),
    );

    const pdf = new jsPDF();

    chatHistory.forEach((message, index) => {
      const lineHeight = 15; // Increased line height
      const marginLeft = 10; // Adjust the left margin as needed
      const marginTop = 10 + index * lineHeight; // Adjust the top margin as needed

      // Split the message into lines if it's too long
      const lines = pdf.splitTextToSize(
        message,
        pdf.internal.pageSize.getWidth() - 2 * marginLeft,
      );

      // Output each line
      lines.forEach((line: string, lineIndex: number) => {
        pdf.text(line, marginLeft, marginTop + lineIndex * lineHeight);
      });
    });

    pdf.save("chat_export.pdf");
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
            color="white"
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
              <img
                src={selectedUser.profileImageUrl || GROUP_IMG_URL}
                alt="img"
              />
            </div>
            <div className="header-user-name">
              {getFullName(selectedUser)} &nbsp;{" "}
              {statusIndicator(selectedUser?.status)}
              {selectedUser.members && `(${selectedUser?.members?.length})`}
            </div>

            {selectedUser.members && (
              <span style={{ color: "white" }}>
                {" "}
                {selectedUser.members.map((items) =>
                  items.name.concat(","),
                )}{" "}
              </span>
            )}
          </>
        )}
      </div>
      <div className="vertical-dots-header" onClick={handleOpenBtn}>
        <i
          className="bi bi-three-dots-vertical"
          style={{ fontSize: "20px", color: "white" }}
        ></i>
      </div>
      {currentUser.isAdmin && isPopupOpen && (
        <div className="popup-nav" ref={popupRef}>
          <Button variant="success" onClick={handleExportBtn}>
            Export Chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
