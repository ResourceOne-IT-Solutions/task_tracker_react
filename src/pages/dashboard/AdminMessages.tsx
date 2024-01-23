import React, { useEffect, useState } from "react";
import { getData } from "../../utils/utils";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import {
  ChatRequestInterface,
  MessageRequestInterface,
  TicketRequestInterface,
} from "../../modals/MessageModals";
import { Button } from "react-bootstrap";

function AdminMessages() {
  const userContext = useUserContext();
  const { currentUser } = userContext as UserContext;
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
                <div className="request-content" key={chat.time}>
                  <p>
                    {chat.sender.name} is Requesting to Chat with{" "}
                    {chat.opponent.name}.{" "}
                  </p>
                  <p>
                    {chat.isPending ? (
                      <Button variant="danger">Not Approved</Button>
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
          <h3>User Requested Tickets</h3>
          {ticketLoading ? (
            <p>Loading............</p>
          ) : (
            ticketRequests?.map((ticket) => {
              return (
                <div className="request-content" key={ticket.time}>
                  <p>
                    {ticket.sender.name} is Requesting for {ticket.client.name}{" "}
                    tickets.
                  </p>
                  <p>
                    {ticket.isPending ? (
                      <Button variant="danger">Not Approved</Button>
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
            messageRequests?.map((ticket) => {
              return (
                <div className="request-content" key={ticket.time}>
                  <p>
                    {ticket.content} is seen by {ticket.sender.name} at{" "}
                    {ticket.time}{" "}
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
