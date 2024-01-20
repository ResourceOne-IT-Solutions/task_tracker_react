import React, { useEffect, useRef, useState } from "react";
import "./styles/body.css";
import { RoomMessages, UserModal } from "../../../modals/UserModals";
import { Socket } from "socket.io-client";
import { MessageModel } from "../../../modals/MessageModals";
import { FileComponent } from "./Util";
interface ChatBodyProps {
  currentUser: UserModal;
  socket: Socket;
}
const ChatBody = ({ socket, currentUser }: ChatBodyProps) => {
  const [totalMessages, setTotalMessages] = useState<RoomMessages[]>([]);
  const ScrollRef = useRef<HTMLDivElement>(null);

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
          <p className="time-display">{msz.time}</p>
        </div>
      );
    } else {
      return (
        <div onDoubleClick={() => handleDeleteMessage(msz)}>
          <FileComponent file={msz} className={className} />
        </div>
      );
    }
  };

  return (
    <div className="chat-body-container" ref={ScrollRef}>
      {totalMessages.map((daymessages: RoomMessages) => (
        <div key={daymessages._id}>
          <h3>{daymessages._id}</h3>
          {daymessages.messageByDate.map((message: MessageModel) => (
            <div key={message._id}>
              {message.type === "message" ? (
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
              ) : (
                <div> {messageRender(message)}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatBody;
