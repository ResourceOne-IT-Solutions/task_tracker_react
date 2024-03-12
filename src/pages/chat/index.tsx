import React from "react";
import "./index.css";
import ChatBox from "./chatbox";
import ChatSideBar from "./sidebar";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
const Chat = () => {
  const { selectedUser, isMobileView } = useUserContext() as UserContext;

  return (
    <>
      {isMobileView ? (
        <>{selectedUser._id ? <ChatBox /> : <ChatSideBar />}</>
      ) : (
        <div className="chat-app">
          <ChatSideBar />
          <ChatBox />
        </div>
      )}
    </>
  );
};
export default Chat;
