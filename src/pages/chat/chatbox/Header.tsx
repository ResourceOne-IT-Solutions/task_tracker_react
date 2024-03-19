import React, { useEffect, useRef, useState } from "react";
import "./styles/header.css";
import { RoomMessages, UserModal } from "../../../modals/UserModals";
import {
  ProfileImage,
  getFullName,
  statusIndicator,
} from "../../../utils/utils";
import { GROUP_IMG_URL } from "../../../utils/Constants";
import { Button } from "react-bootstrap";
import jsPDF from "jspdf";

interface Chatprops {
  selectedUser: UserModal;
  totalMessages: RoomMessages[];
  currentUser: UserModal;
  handleBack: () => void;
}

const ChatHeader = ({
  selectedUser,
  totalMessages,
  currentUser,
  handleBack,
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
    const pageSize = pdf.internal.pageSize;
    const pageHeight = pageSize.height;
    const lineHeight = 5; // Adjust as needed
    const marginLeft = 10; // Adjust the left margin as needed
    let cursorY = 10;
    chatHistory.forEach((message) => {
      if (cursorY + lineHeight > pageHeight) {
        pdf.addPage(); // Add a new page
        cursorY = 10; // Reset Y position
      }
      // Split the message into lines if it's too long
      const lines = pdf.splitTextToSize(
        message,
        pdf.internal.pageSize.getWidth() - 2 * marginLeft,
      );

      // Output each line
      lines.forEach((line: string, lineIndex: number) => {
        if (lineIndex === 0) {
          pdf.text(line, marginLeft, cursorY);
        } else {
          pdf.text(line, marginLeft + 5, cursorY);
        }
        cursorY += lineHeight;
      });
      cursorY += lineHeight;
    });
    const pdfName = `${getFullName(currentUser)}-${getFullName(
      selectedUser,
    )}-Chat.pdf`;
    pdf.save(pdfName);
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
            onClick={handleBack}
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
              {selectedUser.profileImageUrl ? (
                <ProfileImage filename={selectedUser.profileImageUrl} />
              ) : (
                <img src={GROUP_IMG_URL} />
              )}
            </div>
            <div className="header-user-name">
              <span>
                {getFullName(selectedUser)} &nbsp;{" "}
                {statusIndicator(selectedUser?.status)}
                {selectedUser.members && `(${selectedUser?.members?.length})`}
              </span>

              {selectedUser.members && (
                <p
                  style={{ color: "white" }}
                  title={`${selectedUser.members.map((items) =>
                    items.name.concat(","),
                  )}`}
                >
                  {" "}
                  {selectedUser.members.map((items) =>
                    items.name.concat(","),
                  )}{" "}
                </p>
              )}
            </div>
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
        <div className="popup-nav m-2" ref={popupRef}>
          <ul>
            <li className="mb-1">
              <Button variant="success" onClick={handleExportBtn}>
                Export Chat
              </Button>
            </li>
            <li>
              <Button>Show Users</Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
