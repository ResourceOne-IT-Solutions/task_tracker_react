import React, { useState } from "react";
import "./styles/footer.css";
import { UserModal } from "../../../modals/UserModals";
import {
  getFormattedDate,
  getFormattedTime,
  getFullName,
} from "../../../utils/utils";
import { Socket } from "socket.io-client";

interface ChatFooterProps {
  currentUser: UserModal;
  currentRoom: string;
  selectedUser: UserModal;
  socket: Socket;
}
const ChatFooter = ({
  currentUser,
  currentRoom,
  selectedUser,
  socket,
}: ChatFooterProps) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [message, setMessage] = useState("");

  const sendMessage = (message: string) => {
    const msgdata = {
      from: {
        name: getFullName(currentUser),
        id: currentUser._id,
      },
      to: currentRoom,
      content: message,
      type: "message",
      opponentId: selectedUser._id,
      time: getFormattedTime("time"),
      date: getFormattedDate(new Date()),
    };
    socket.emit("sendMessage", msgdata);
    setMessage("");
  };

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
  return (
    <div className="chat-footer-conatiner">
      <div className="add-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-plus-circle"
          viewBox="0 0 16 16"
          onClick={togglePopup}
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
        {isPopupOpen && (
          <div className="popup">
            <p>
              Files{" "}
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#027c68"
                  className="bi bi-file-text-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1" />
                </svg>
              </span>
            </p>
            <p>
              Contacts{" "}
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#027c68"
                  className="bi bi-person-lines-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                </svg>
              </span>
            </p>
          </div>
        )}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
      <div className="send-btn" onClick={() => sendMessage(message)}>
        <div className="circle-icon">
          <i className="bi bi-send-fill"></i>
        </div>
      </div>
    </div>
  );
};
export default ChatFooter;
