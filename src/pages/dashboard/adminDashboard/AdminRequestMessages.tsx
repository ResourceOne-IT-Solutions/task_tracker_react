import React, { useEffect, useState } from "react";
import "./AdminRequestMessages.css";
import { Button, Spinner } from "react-bootstrap";
import {
  ChatRequestInterface,
  MessageRequestInterface,
  TicketRaiseInterface,
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
  const {
    socket,
    currentUser,
    alertModal,
    setRequestMessageCount,
    requestMessageCount,
  } = useUserContext() as UserContext;
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [ticketRequests, setTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [requestIds, setRequestIds] = useState<string[]>(requestMessageCount);
  const [messageRequests, setMessageRequests] = useState<
    MessageRequestInterface[]
  >([]);
  const [ticketRaiseMsgs, setTicketRaiseMsgs] = useState<
    TicketRaiseInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setRequestMessageCount([]);
    setIsLoading(true);
    Promise.all([
      getData<ChatRequestInterface>("message/user-chat-request"),
      getData<TicketRequestInterface>("message/user-ticket-request"),
      getData<MessageRequestInterface>(`message/admin-messages`),
      getData<TicketRaiseInterface>(`message/ticket-raise-messages`),
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
        setIsLoading(false);
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
  socket
    .off("chatRequest")
    .on("chatRequest", ({ sender, opponent, time, isPending, date, _id }) => {
      if (currentUser.isAdmin) {
        const payloadData = {
          date,
          isPending,
          opponent,
          sender,
          time,
          _id,
        };
        setChatRequests([payloadData, ...chatRequests]);
      }
    });
  socket
    .off("ticketsRequest")
    .on("ticketsRequest", ({ client, date, isPending, sender, time, _id }) => {
      if (currentUser.isAdmin) {
        const payloadData = {
          client,
          date,
          isPending,
          sender,
          time,
          _id,
        };
        setTicketRequests([payloadData, ...ticketRequests]);
      }
    });
  socket
    .off("userRaisedTicket")
    .on(
      "userRaisedTicket",
      ({ sender, content, date, time, isPending, _id }) => {
        const payloadData = {
          sender,
          content,
          date,
          time,
          isPending,
          _id,
        };
        setTicketRaiseMsgs([payloadData, ...ticketRaiseMsgs]);
      },
    );
  const handleRequestClick = (
    data: TicketRequestInterface | ChatRequestInterface,
    type: string,
  ) => {
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
      <h1 className="table-heading">
        <Button
          className="go-back"
          variant="danger"
          onClick={() => navigate(-1)}
        >
          <i className="fa fa-angle-left"></i>
          Go Back
        </Button>
        Total Request&apos;s From Users
      </h1>

      <div className="request-msgs">
        <div className="request-sub-msg">
          <h3>Chat Requests</h3>
          {isLoading ? (
            <Spinner />
          ) : messageRequests && messageRequests.length > 0 ? (
            chatRequests?.map((chat) => {
              return (
                <div
                  className={`request-content-wrapper ${
                    requestIds.includes(chat._id) && "bg-warning"
                  } `}
                  key={chat._id}
                >
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
          {isLoading ? (
            <Spinner />
          ) : ticketRequests && ticketRequests.length > 0 ? (
            ticketRequests?.map((ticket) => {
              return (
                <div
                  className={`request-content-wrapper ${
                    requestIds.includes(ticket._id) && "bg-warning"
                  } `}
                  key={ticket._id}
                >
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
          {isLoading ? (
            <Spinner />
          ) : messageRequests && messageRequests.length > 0 ? (
            messageRequests?.map((message) => {
              return (
                <div
                  className={`request-content-wrapper ${
                    requestIds.includes(message._id) && "bg-warning"
                  } `}
                  key={message._id}
                >
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
          {isLoading ? (
            <Spinner />
          ) : ticketRaiseMsgs && ticketRaiseMsgs.length > 0 ? (
            ticketRaiseMsgs?.map((message: TicketRaiseInterface) => {
              return (
                <div
                  className={`request-content-wrapper ${
                    requestIds.includes(message._id) && "bg-warning"
                  } `}
                  key={message._id}
                >
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
