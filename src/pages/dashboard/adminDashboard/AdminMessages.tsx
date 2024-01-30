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
  const { currentUser, setSelectedUser } = userContext as UserContext;
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
                <div className="request-content" key={chat._id}>
                  <p>
                    {chat.sender.name} is Requesting to Chat with{" "}
                    {chat.opponent.name}.{" "}
                  </p>
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
                <div className="request-content" key={ticket._id}>
                  <p>
                    {ticket.sender.name} is Requesting for {ticket.client.name}{" "}
                    tickets.
                  </p>
                  <p>
                    {ticket.isPending ? (
                      <Button variant="danger" disabled>
                        Not Approved
                      </Button>
                    ) : (
                      <Button variant="success">Approved</Button>
                    )}
                  </p>
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
                <div className="request-content" key={message._id}>
                  <p>
                    {message.content} is seen by {message.sender.name} at{" "}
                    {message.time}{" "}
                  </p>
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
