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
      {totalMessages.map((daymessages: RoomMessages, index: number) => {
        return (
          <div key={index}>
            <h3>{daymessages._id}</h3>
            {daymessages.messageByDate.map((mymessages: MessageInputFormat) => {
              return (
                <>
                  <div
                    className={
                      currentUser._id !== mymessages.from.id
                        ? "message-left"
                        : "message-right"
                    }
                  >
                    {mymessages.content}
                  </div>
                  <p className="time-display">{mymessages.time}</p>
                </>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBody;
