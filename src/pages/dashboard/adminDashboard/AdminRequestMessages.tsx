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
  getDate,
  getFullName,
  getPath,
} from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext } from "../../../modals/UserModals";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_MESSAGE,
  CHAT_REQUEST,
  NO_CHAT_REQUEST,
  NO_MESSAGES_TO_DISPLAY,
  NO_TICKET_REQUEST,
  TICKETRAISE_MESSAGE,
  TICKET_REQUEST,
} from "../../../utils/Constants";
import { Severity } from "../../../utils/modal/notification";
import httpMethods from "../../../api/Service";

function AdminRequestMessages() {
  const navigate = useNavigate();
  const { socket, currentUser, alertModal } = useUserContext() as UserContext;
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [showingTable, setShowingTable] = useState(ADMIN_MESSAGE);
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
  const checkIsFirstTime = (type: string) => {
    if (type === ADMIN_MESSAGE) {
      return messageRequests.length == 0;
    }
    if (type === TICKETRAISE_MESSAGE) {
      return ticketRaiseMsgs.length == 0;
    }
    if (type === CHAT_REQUEST) {
      return chatRequests.length == 0;
    }
    if (type === TICKET_REQUEST) {
      return ticketRequests.length == 0;
    }
    return true;
  };
  const getTableData = (tableName: string) => {
    httpMethods
      .get<any>(`/message/${getPath(tableName)}`)
      .then((data: any[]) => {
        if (tableName === CHAT_REQUEST) {
          setChatRequests(data);
        }
        if (tableName === TICKET_REQUEST) {
          setTicketRequests(data);
        }
        if (tableName === ADMIN_MESSAGE) {
          setMessageRequests(data);
        }
        if (tableName === TICKETRAISE_MESSAGE) {
          setTicketRaiseMsgs(data);
        }
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
  };
  const handleButtonClick = (tableName: string) => {
    setShowingTable(tableName);
    if (checkIsFirstTime(tableName)) {
      setIsLoading(true);
    }
    getTableData(tableName);
  };
  useEffect(() => {
    setIsLoading(true);
    getTableData(ADMIN_MESSAGE);
  }, []);
  return (
    <div className="text-center view-request-msgs ">
      <div className="table-heading">
        <h1>
          <Button className="go-back" onClick={() => navigate(-1)}>
            <i className="fa fa-angle-left"></i>
            Go Back
          </Button>
          Total Requests From Users
        </h1>
      </div>
      <div className="d-flex justify-content-center gap-2 chat-request mb-2">
        {[ADMIN_MESSAGE, CHAT_REQUEST, TICKET_REQUEST, TICKETRAISE_MESSAGE].map(
          (btn, idx) => (
            <Button
              className={`chat-request-toggle-btns ${
                showingTable === btn && "active"
              }`}
              onClick={() => handleButtonClick(btn)}
              key={idx}
            >
              {btn}
            </Button>
          ),
        )}
      </div>
      <div className="request-msgs">
        <div className="request-sub-msg">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {showingTable === CHAT_REQUEST && (
                <>
                  {chatRequests.length > 0 ? (
                    chatRequests?.map((chat) => {
                      return (
                        <AdminRequestCard
                          type="CHAT"
                          key={chat._id}
                          id={chat._id}
                          time={chat.time}
                          sender={chat.sender.name}
                          receiver={chat.opponent.name}
                          isPending={chat.isPending}
                          onApprove={handleRequestClick}
                        />
                      );
                    })
                  ) : (
                    <p className="fw-bold">{NO_CHAT_REQUEST}</p>
                  )}
                </>
              )}
              {showingTable === TICKET_REQUEST && (
                <>
                  {ticketRequests.length > 0 ? (
                    ticketRequests?.map((ticket) => {
                      return (
                        <AdminRequestCard
                          type="TICKET"
                          key={ticket._id}
                          id={ticket._id}
                          time={ticket.time}
                          sender={ticket.sender.name}
                          receiver={ticket.client.name}
                          isPending={ticket.isPending}
                          onApprove={handleRequestClick}
                        />
                      );
                    })
                  ) : (
                    <p className="fw-bold">{NO_TICKET_REQUEST}</p>
                  )}
                </>
              )}
              {showingTable === ADMIN_MESSAGE && (
                <>
                  {messageRequests.length > 0 ? (
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
                </>
              )}
              {showingTable === TICKETRAISE_MESSAGE && (
                <>
                  {ticketRaiseMsgs.length > 0 ? (
                    ticketRaiseMsgs?.map((message) => {
                      return (
                        <TicketRaiseCard key={message._id} message={message} />
                      );
                    })
                  ) : (
                    <p className="fw-bold">{NO_MESSAGES_TO_DISPLAY}</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRequestMessages;
