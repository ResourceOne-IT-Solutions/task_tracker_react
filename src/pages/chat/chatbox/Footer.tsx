import React, { useEffect, useRef, useState } from "react";
import "./styles/footer.css";
import { UserModal } from "../../../modals/UserModals";
import { getFullName } from "../../../utils/utils";
import { Socket } from "socket.io-client";
import httpMethods from "../../../api/Service";
import { FileModel } from "../../../modals/MessageModals";
import { ClientModal } from "../../../modals/ClientModals";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = (message: string, type = "message", fileLink = "") => {
    if (!message) return;
    let isGroup = false;
    if (!selectedUser.firstName) {
      isGroup = true;
    }

    const msgdata = {
      from: {
        name: getFullName(currentUser),
        id: currentUser._id,
      },
      to: currentRoom,
      content: message,
      type,
      opponentId: selectedUser._id,
      fileLink,
      isGroup,
    };
    socket.emit("sendMessage", msgdata);
    setMessage("");
    socket.emit("newUser", {
      userId: currentUser._id,
      opponentId: selectedUser._id,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(message);
    }
  };

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (selectedFile) {
      setMessage(selectedFile.name);
      const formData = new FormData();
      formData.append("file", selectedFile);
      httpMethods
        .post<FormData, FileModel>("/file", formData, true)
        .then((res) => {
          setMessage(res.fileName);
          sendMessage(res.fileName, res.type, res._id);
        })
        .catch((err) => err);
    }
  };

  const handleContactClick = () => {
    toggleSidebar();
  };

  const handleContactListClick = (client: ClientModal) => {
    sendMessage(
      client.firstName,
      "contact",
      JSON.stringify({ name: client.firstName, mobile: client.mobile }),
    );
    setSidebarOpen(false);
  };
  useEffect(() => {
    httpMethods.get<ClientModal[]>("/clients").then((response: any) => {
      setClients(response);
    });
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPopupOpen &&
        fileInputRef.current &&
        !fileInputRef.current.contains(event.target as Node) &&
        !document.querySelector(".popup")?.contains(event.target as Node)
      ) {
        setPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);
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
        {isSidebarOpen && (
          <div className="sidebar-contacts">
            <span className="close-icon" onClick={toggleSidebar}>
              &times;
            </span>
            {clients.map((client: ClientModal, index) => {
              return (
                <div
                  key={index}
                  className="contact-list"
                  onClick={() => handleContactListClick(client)}
                >
                  <p>{client.firstName}</p>
                  <p>{client.mobile}</p>
                </div>
              );
            })}
          </div>
        )}
        {isPopupOpen && (
          <div className="popup">
            <p onClick={handleFileClick}>
              Files{" "}
              <span>
                <input
                  type="file"
                  accept=".pdf, .jpg"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
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
            <p onClick={handleContactClick}>
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
          placeholder="Enter your message here"
          className="form-control"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          value={message}
        />
      </div>
      <div className="send-btn mx-4" onClick={() => sendMessage(message)}>
        <div className="circle-icon">
          <i className="bi bi-send-fill"></i>
        </div>
      </div>
    </div>
  );
};
export default ChatFooter;
