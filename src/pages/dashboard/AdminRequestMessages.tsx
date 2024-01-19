import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import "./AdminRequestMessages.css";
import { Button } from "react-bootstrap";
import {
  ChatRequestInterface,
  TicketRequestInterface,
} from "../../modals/MessageModals";

function AdminRequestMessages() {
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [ticketRequests, setTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [ticketLoading, setTicketLoading] = useState<boolean>(false);
  useEffect(() => {
    setChatLoading(true);
    setTicketLoading(true);
    httpMethods
      .get<any>("/message/user-chat-request")
      .then((res: ChatRequestInterface[]) => {
        setChatRequests(res);
        setChatLoading(false);
      })
      .catch((errr: string) => {
        alert(errr);
        setChatLoading(false);
      });
    httpMethods
      .get<any>("/message/user-ticket-request")
      .then((res: any) => {
        setTicketRequests(res);
        setTicketLoading(false);
      })
      .catch((errr) => {
        alert(errr);
        setTicketLoading(false);
      });
  }, []);
  return (
    <div>
      <h1>Admin Request Messages</h1>
      <div className="request-msgs">
        <div className="request-sub-msg">
          <h3>Chat Requests</h3>
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
                      <Button variant="success">Give Access</Button>
                    ) : (
                      "Resolved"
                    )}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <div className="request-sub-msg">
          <h3>Ticket Requests</h3>
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
                      <Button variant="success">Give Access</Button>
                    ) : (
                      "Resolved"
                    )}
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

export default AdminRequestMessages;
