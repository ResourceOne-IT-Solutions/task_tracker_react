import React, { useEffect, useState } from "react";
import { getData } from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext, UserModal } from "../../../modals/UserModals";
import {
  ChatRequestInterface,
  MessageRequestInterface,
  TicketRequestInterface,
} from "../../../modals/MessageModals";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminMessages() {
  const userContext = useUserContext();
  const { currentUser, setSelectedUser, socket } = userContext as UserContext;
  const navigate = useNavigate();
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [ticketRequests, setTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [messageRequests, setMessageRequests] = useState<
    MessageRequestInterface[]
  >([]); 

  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [ticketLoading, setTicketLoading] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);

  const handleApproved = (chat: ChatRequestInterface) => {
    getData<UserModal>(`users/${chat.opponent.id}`).then((res: any) => {
      setSelectedUser(res);
      navigate("/chat");
    });
  };
  const handleAdminMessageSeen = (message: MessageRequestInterface) => {
    const payload = {
      userId: currentUser._id,
      messageId: message._id,
      status: "SEEN",
    };
    socket.emit("updateAdminMessageStatus", payload);
  };
  socket
    .off("adminMessageStatusUpdated")
    .on("adminMessageStatusUpdated", (updatedmesage) => {
      const UpdatedMessageRequest = messageRequests.map((messages) => {
        if (messages._id == updatedmesage._id) {
          return updatedmesage;
        }
        return messages;
      });
      setMessageRequests(UpdatedMessageRequest);
    });
  useEffect(() => {
    setChatLoading(true);
    setTicketLoading(true);
    setMessageLoading(true);
    Promise.all([
      getData<any>(`message/user-chat-request/${currentUser._id}`),
      getData<any>(`message/user-ticket-request/${currentUser._id}`),
      getData<any>(`message/admin-messages`),
    ])
      .then((results) => {
        setChatRequests(results[0]);
        setTicketRequests(results[1]);
        setMessageRequests(results[2]);
      })
      .catch((err) => alert(err))
      .finally(() => {
        setChatLoading(false);
        setTicketLoading(false);
        setMessageLoading(false);
      });
  }, []);
  return (
    <div>
      <h1>Admin Messages</h1>
      <div className="request-msgs">
        <div className="request-sub-msg">
          <h3>User Requested Chat</h3>
          {chatLoading ? (
            <p>Loading............</p>
          ) : (
            chatRequests?.map((chat) => {
              return (
                <div className="request-content-wrapper" key={chat.time}>
                  <div className="chatrequest-message">
                    <div>
                      {chat.sender.name} is Requesting to Chat with{" "}
                      {chat.opponent.name}.{" "}
                    </div>
                    <div>
                      Time: {chat.date} {chat.time}
                    </div>
                  </div>
                  <p>
                    {chat.isPending ? (
                      <Button variant="danger" disabled>
                        Not Approved
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => handleApproved(chat)}
                      >
                        Approved
                      </Button>
                    )}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <div className="request-sub-msg">
          <h3>User Requested Tickets</h3>
          {ticketLoading ? (
            <p>Loading............</p>
          ) : (
            ticketRequests?.map((ticket) => {
              return (
                <div className="request-content-wrapper" key={ticket.time}>
                  <div className="message-request-content">
                    <div>
                      {ticket.sender.name} is Requesting for{" "}
                      {ticket.client.name} tickets.
                    </div>
                    <div>
                      Time: {ticket.date} {ticket.time}
                    </div>
                  </div>
                  <div>
                    {ticket.isPending ? (
                      <Button variant="danger" disabled>
                        Not Approved
                      </Button>
                    ) : (
                      <Button variant="success">Approved</Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="request-sub-msg">
          <h3>All Admin Messages</h3>
          {messageLoading ? (
            <p>Loading............</p>
          ) : (
            messageRequests?.map((message) => {
              return (
                <div className="request-content-wrapper" key={message.time}>
                  <div className="message-request-content">
                    <div className="my-2">Message: {message.content}</div>
                    <div className="my-2">
                      Time: {message.date} {message.time}
                    </div>
                    <div className="my-2">Sent by: {message.sender.name}</div>
                  </div>
                  <div className="message-seen-btn">
                    {message.viewedBy.includes(currentUser._id) ? (
                      <Button variant="success">seen</Button>
                    ) : (
                      <Button
                        variant="danger"
                        onClick={() => handleAdminMessageSeen(message)}
                      >
                        Not Seen
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMessages;
