import React, { useEffect, useState } from "react";
import httpMethods from "../../../api/Service";
import "./AdminRequestMessages.css";
import { Button } from "react-bootstrap";
import {
  ChatRequestInterface,
  TicketRequestInterface,
} from "../../../modals/MessageModals";
import {
  getData,
  getFormattedDate,
  getFormattedTime,
  getFullName,
} from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext } from "../../../modals/UserModals";

function AdminRequestMessages() {
  const userContext = useUserContext();
  const { socket, currentUser } = userContext as UserContext;
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [ticketRequests, setTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [ticketLoading, setTicketLoading] = useState<boolean>(false);
  useEffect(() => {
    setChatLoading(true);
    setTicketLoading(true);
    Promise.all([
      getData<any>("message/user-chat-request"),
      getData<any>("message/user-ticket-request"),
    ])
      .then((results) => {
        setChatRequests(results[0]);
        setTicketRequests(results[1]);
      })
      .catch((err) => alert(err))
      .finally(() => {
        setChatLoading(false);
        setTicketLoading(false);
      });
  }, []);
  socket
    .off("userRequestApproved")
    .on("userRequestApproved", ({ result, type }) => {
      if (type === "CHAT") {
        const latestData = chatRequests.map((msz) => {
          if (msz._id === result._id) {
            return result;
          }
          return msz;
        });
        setChatRequests(latestData);
      }
      if (type === "TICKET") {
        const LatestTicketData = ticketRequests.map((msz) => {
          if (msz._id === result._id) {
            return result;
          }
          return msz;
        });
        setTicketRequests(LatestTicketData);
      }
    });
  const handleRequestClick = (data: any, type: any) => {
    const payload = {
      user: {
        name: getFullName(currentUser),
        id: currentUser._id,
        time: getFormattedTime(),
        date: getFormattedDate(new Date()),
      },
      requestId: data._id,
      type,
      status: false,
    };
    socket.emit("approveUserRequest", payload);
  };
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
                      <Button
                        variant="success"
                        onClick={() => handleRequestClick(chat, "CHAT")}
                      >
                        Give Access
                      </Button>
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
                      <Button
                        variant="success"
                        onClick={() => handleRequestClick(ticket, "TICKET")}
                      >
                        Give Access
                      </Button>
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
