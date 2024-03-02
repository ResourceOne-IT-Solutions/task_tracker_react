import React, { useEffect, useState } from "react";
import "./AdminRequestMessages.css";
import { Button, Spinner } from "react-bootstrap";
import {
  ChatRequestInterface,
  AdminMessageInterface,
  TicketRaiseInterface,
  TicketRequestInterface,
} from "../../../modals/MessageModals";
import {
  AdminMessageCard,
  AdminRequestCard,
  TicketRaiseCard,
  getData,
  getDate,
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
    AdminMessageInterface[]
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
      getData<AdminMessageInterface>(`message/admin-messages`),
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
  const handleRequestClick = (id: string, type: string) => {
    const payload = {
      user: {
        name: getFullName(currentUser),
        id: currentUser._id,
        time: getDate(),
        date: getDate(),
      },
      requestId: id,
      type,
      status: false,
    };
    socket.emit("approveUserRequest", payload);
  };
  return (
    <div className="text-center">
      <h1 className="table-heading">
        <Button className="go-back" onClick={() => navigate(-1)}>
          <i className="fa fa-angle-left"></i>
          Go Back
        </Button>
        Total Requests From Users
      </h1>

      <div className="request-msgs">
        <div className="request-sub-msg">
          <h3>Chat Requests</h3>
          {isLoading ? (
            <Spinner />
          ) : messageRequests.length > 0 ? (
            chatRequests?.map((chat) => {
              return (
                <AdminRequestCard
                  key={chat._id}
                  id={chat._id}
                  time={chat.time}
                  sender={chat.sender.name}
                  receiver={chat.opponent.name}
                  isPending={chat.isPending}
                  onApprove={handleRequestClick}
                  type="CHAT"
                />
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
          ) : ticketRequests.length > 0 ? (
            ticketRequests?.map((ticket) => {
              return (
                <AdminRequestCard
                  key={ticket._id}
                  id={ticket._id}
                  time={ticket.time}
                  sender={ticket.sender.name}
                  receiver={ticket.client.name}
                  isPending={ticket.isPending}
                  onApprove={handleRequestClick}
                  type="TICKET"
                />
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
          ) : messageRequests.length > 0 ? (
            messageRequests?.map((message) => {
              return (
                <AdminMessageCard
                  key={message._id}
                  message={message}
                  isAdmin={true}
                />
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
          ) : ticketRaiseMsgs.length > 0 ? (
            ticketRaiseMsgs?.map((message) => {
              return <TicketRaiseCard key={message._id} message={message} />;
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
