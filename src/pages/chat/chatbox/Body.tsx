import React, { useEffect, useState } from "react";
import "./styles/body.css";
import {
  MessageInputFormat,
  RoomMessages,
  UserModal,
} from "../../../modals/UserModals";
import { Socket } from "socket.io-client";
interface ChatBodyProps {
  currentUser: UserModal;
  socket: Socket;
}
const ChatBody = ({ socket, currentUser }: ChatBodyProps) => {
  const [totalMessages, setTotalMessages] = useState<RoomMessages[]>([]);

  socket.off("roomMessages").on("roomMessages", (messages: RoomMessages[]) => {
    setTotalMessages(messages);
  });

  return (
    <div className="chat-body-container">
      {totalMessages.map((daymessages: RoomMessages, index: number) => (
        <div key={daymessages._id}>
          <h3>{daymessages._id}</h3>
          {daymessages.messageByDate.map((message: MessageInputFormat) => (
            <div key={message._id}>
              <div
                className={
                  currentUser._id !== message.from.id
                    ? "message-left"
                    : "message-right"
                }
              >
                {message.content}
                <p className="time-display">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatBody;
