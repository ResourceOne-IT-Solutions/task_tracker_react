import React, { useEffect, useState } from "react";
import "./AdminRequestMessages.css";
import { Button } from "react-bootstrap";
import {
  ChatRequestInterface,
  MessageRequestInterface,
  TicketRequestInterface,
} from "../../../modals/MessageModals";
import {
  getData,
  getDate,
  getFormattedDate,
  getFormattedTime,
  getFullName,
} from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext } from "../../../modals/UserModals";
import { useNavigate } from "react-router-dom";
import {
  NO_CHAT_REQUEST,
  NO_MESSAGES_TO_DISPLAY,
  NO_TICKET_REQUEST,
} from "../../../utils/Constants";
import { Severity } from "../../../utils/modal/notification";

function AdminRequestMessages() {
  const navigate = useNavigate();
  const { socket, currentUser, alertModal, setRequestMessageCount } =
    useUserContext() as UserContext;
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [ticketRequests, setTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [messageRequests, setMessageRequests] = useState<
    MessageRequestInterface[]
  >([]);
  const [ticketRaiseMsgs, setTicketRaiseMsgs] = useState<
    TicketRequestInterface[]
  >([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [ticketLoading, setTicketLoading] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [raiseTicketLoading, setRaiseTicketoading] = useState<boolean>(false);
  useEffect(() => {
    setRequestMessageCount(0);
    setChatLoading(true);
    setTicketLoading(true);
    setMessageLoading(true);
    setRaiseTicketoading(true);
    Promise.all([
      getData<any>("message/user-chat-request"),
      getData<any>("message/user-ticket-request"),
      getData<MessageRequestInterface>(`message/admin-messages`),
      getData<TicketRequestInterface>(`message/ticket-raise-messages`),
    ])
      .then((results) => {
        setChatRequests(results[0]);
        setTicketRequests(results[1]);
        setMessageRequests(results[2]);
        setTicketRaiseMsgs(results[3]);
      })
      .catch((err) =>
        alertModal({
          severity: Severity.ERROR,
          content: err.message,
          title: "Admin Messages",
        }),
      )
      .finally(() => {
        setChatLoading(false);
        setTicketLoading(false);
        setMessageLoading(false);
        setRaiseTicketoading(false);
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
        time: getDate(),
        date: getDate(),
      },
      requestId: data._id,
      type,
      status: false,
    };
    socket.emit("approveUserRequest", payload);
  };
  return (
    <div className="text-center">
      <h1>Message Request From Users</h1>
      <Button variant="danger" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <div className="request-msgs">
        <div className="request-sub-msg">
          <h3>Chat Requests</h3>
          {chatLoading ? (
            <p>Loading............</p>
          ) : messageRequests && messageRequests.length > 0 ? (
            chatRequests?.map((chat) => {
              return (
                <div className="request-content-wrapper" key={chat._id}>
                  <div>
                    {chat.sender.name} is Requesting to Chat with{" "}
                    {chat.opponent.name}.{" "}
                  </div>
                  <div>
                    {chat.isPending ? (
                      <Button
                        variant="success"
                        onClick={() => handleRequestClick(chat, "CHAT")}
                      >
                        Give Access
                      </Button>
                    ) : (
                      <Button variant="success" disabled>
                        Resolved
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="fw-bold">{NO_CHAT_REQUEST}</p>
          )}
        </div>
        <div className="request-sub-msg">
          <h3>Ticket Requests</h3>
          {ticketLoading ? (
            <p>Loading............</p>
          ) : ticketRequests && ticketRequests.length > 0 ? (
            ticketRequests?.map((ticket) => {
              return (
                <div className="request-content-wrapper" key={ticket._id}>
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
                      <Button variant="success" disabled>
                        Resolved
                      </Button>
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="fw-bold">{NO_TICKET_REQUEST}</p>
          )}
        </div>
        <div className="request-sub-msg">
          <h3>All Admin Messages</h3>
          {messageLoading ? (
            <p>Loading............</p>
          ) : messageRequests && messageRequests.length > 0 ? (
            messageRequests?.map((message) => {
              return (
                <div className="request-content-wrapper" key={message._id}>
                  <div className="message-request-content">
                    <div className="my-2">Message: {message.content}</div>
                    <div className="my-2">
                      Time: {getFormattedDate(message.date)}{" "}
                      {getFormattedTime(message.time)}
                    </div>
                    <div className="my-2">Sent by: {message.sender.name}</div>
                  </div>
                  <div className="d-flex flex-column delivery-status">
                    <span>
                      Delivered to{" "}
                      <span className="fw-bold">
                        {message.deliveredTo.length}
                      </span>
                    </span>
                    <span>
                      Seen :{" "}
                      <span className="fw-bold">
                        {message.viewedBy.length}{" "}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="fw-bold">{NO_MESSAGES_TO_DISPLAY}</p>
          )}
        </div>
        <div className="request-sub-msg">
          <h3>TicketRaise Messages</h3>
          {raiseTicketLoading ? (
            <p>Loading............</p>
          ) : ticketRaiseMsgs && ticketRaiseMsgs.length > 0 ? (
            ticketRaiseMsgs?.map((message: any) => {
              return (
                <div className="request-content-wrapper" key={message._id}>
                  <div className="message-request-content">
                    <div>Message: {message.content}</div>
                    <div>Sent by: {message.sender.name}</div>
                    <div>
                      Time: {getFormattedDate(message.date)}{" "}
                      {getFormattedTime(message.time)}
                    </div>
                  </div>
                  <div>
                    {message.isPending ? (
                      <Button variant="success">Approve</Button>
                    ) : (
                      <Button variant="success" disabled>
                        Approved
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="fw-bold">{NO_MESSAGES_TO_DISPLAY}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRequestMessages;
