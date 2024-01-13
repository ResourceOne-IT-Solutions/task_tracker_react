import React from "react";
import "./styles/body.css";
const ChatBody = () => {
  const messages = [
    "hi",
    "hello",
    "how you doing",
    "Im Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about YouIm Good What about You",
    "hi",
    "hello",
    "how you doing",
    "Im Good What about You",
    "hi",
    "hello",
    "how you doing",
    "Im Good What about You",
  ];
  return (
    <div className="chat-body-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={index % 2 === 0 ? "message-left" : "message-right"}
        >
          {msg}
        </div>
      ))}
    </div>
  );
};

export default ChatBody;
