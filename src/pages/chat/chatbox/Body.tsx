import React, { useEffect, useRef, useState } from "react";
import "./styles/body.css";
import { RoomMessages, UserModal } from "../../../modals/UserModals";
import { Socket } from "socket.io-client";
import { MessageModel } from "../../../modals/MessageModals";
import { FileComponent } from "./Util";
import { getFormattedTime } from "../../../utils/utils";
interface ChatBodyProps {
  currentUser: UserModal;
  socket: Socket;
  setTotalMessages: (val: RoomMessages[]) => void;
  totalMessages: RoomMessages[];
}
const ChatBody = ({
  socket,
  currentUser,
  setTotalMessages,
  totalMessages,
}: ChatBodyProps) => {
  const ScrollRef = useRef<HTMLDivElement>(null);
  const height = window.innerHeight;
  useEffect(() => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight;
    }
  }, [totalMessages]);

  socket.off("roomMessages").on("roomMessages", (messages: RoomMessages[]) => {
    setTotalMessages(messages);
  });
  const handleDeleteMessage = async (msz: MessageModel) => {
    socket.emit("deleteMessage", msz._id);
  };

  return (
    <div
      className="chat-body-container"
      ref={ScrollRef}
      style={{ height: height - 205 }}
    >
      {totalMessages.map((daymessages: RoomMessages) => (
        <div key={daymessages._id}>
          <h3 className="text-center">{daymessages._id}</h3>
          {daymessages.messageByDate.map((message: MessageModel) => (
            <MessageCard
              key={message._id}
              message={message}
              currentUser={currentUser}
              handleDeleteMessage={handleDeleteMessage}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
export interface MessageCardProps {
  message: MessageModel;
  currentUser: UserModal;
  handleDeleteMessage: (msz: MessageModel) => void;
}

const MessageCard = ({
  message,
  currentUser,
  handleDeleteMessage,
}: MessageCardProps) => {
  const mszAuthor = (msz: MessageModel) => {
    if (currentUser._id === msz.from.id) {
      return "You";
    }
    return msz.from.name;
  };

  const messageRender = (msz: MessageModel) => {
    const className =
      msz.from.id === currentUser._id ? "message-right" : "message-left";

    if (msz.type === "message") {
      return (
        <div
          className={className}
          key={msz._id}
          onDoubleClick={() => handleDeleteMessage(msz)}
        >
          <span className="content">{msz.content}</span>
          <p className="time-display">{getFormattedTime(msz.time)}</p>
        </div>
      );
    } else if (msz.type === "contact") {
      const contactrender = JSON.parse(msz.fileLink);
      return (
        <div className={className}>
          <div className="message-sender fw-semibold">{mszAuthor(msz)} : </div>
          <div className="contact-render-info">
            <p>{contactrender.name}</p>
            <p>{contactrender.mobile}</p>
            <p className="time-display">
              {getFormattedTime(contactrender.time)}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div onDoubleClick={() => handleDeleteMessage(msz)}>
          <FileComponent
            file={msz}
            className={className}
            author={mszAuthor(msz)}
          />
        </div>
      );
    }
  };
  return (
    <div
      className={
        currentUser._id !== message.from.id
          ? "main-left-container"
          : "main-right-container"
      }
    >
      {message.type === "message" ? (
        <div
          className={
            currentUser._id !== message.from.id
              ? "message-left"
              : "message-right"
          }
        >
          <div className="message-sender fw-semibold">
            {mszAuthor(message)} :{" "}
          </div>
          <div className="message-display">{message.content}</div>
          <p className="time-display">{getFormattedTime(message.time)}</p>
        </div>
      ) : (
        <div> {messageRender(message)}</div>
      )}
    </div>
  );
};

export default ChatBody;
