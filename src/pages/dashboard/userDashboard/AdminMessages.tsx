import React, { useEffect, useState } from "react";
import {
  AdminMessageCard,
  UserRequestCard,
  getData,
  getPath,
} from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext, UserModal } from "../../../modals/UserModals";
import {
  ChatRequestInterface,
  AdminMessageInterface,
  TicketRequestInterface,
} from "../../../modals/MessageModals";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_MESSAGE,
  CHAT_REQUEST,
  NO_CHAT_REQUEST,
  NO_MESSAGES_TO_DISPLAY,
  NO_TICKET_REQUEST,
  TICKET_REQUEST,
} from "../../../utils/Constants";
import { Severity } from "../../../utils/modal/notification";
import httpMethods from "../../../api/Service";

function AdminMessages() {
  const navigate = useNavigate();
  const { currentUser, setSelectedUser, socket, alertModal } =
    useUserContext() as UserContext;
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [ticketRequests, setTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [messageRequests, setMessageRequests] = useState<
    AdminMessageInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showingTable, setShowingTable] = useState(ADMIN_MESSAGE);

  const handleApprovedChat = (id: string) => {
    getData<UserModal>(`users/${id}`).then((res: any) => {
      setSelectedUser(res);
      navigate("/chat");
    });
  };
  const handleAdminMessageSeen = (message: AdminMessageInterface) => {
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
  const handleApprovedTicket = (ticket: TicketRequestInterface) => {
    navigate("/approved/tickets", { state: ticket });
  };
  socket
    .off("userRequestApproved")
    .on("userRequestApproved", ({ result, type }) => {
      if (result.sender.id === currentUser._id) {
        const msg = `Your ${
          type == "CHAT" ? result.opponent.name : result.client.name
        } ${type} Request Approved By ${result.approvedBy.name}`;
        alertModal({
          severity: Severity.ERROR,
          content: msg,
          title: `${type} Request`,
        });
        if (type == "CHAT") {
          const latestChatData = chatRequests.map((msz) => {
            if (msz._id === result._id) {
              return result;
            }
            return msz;
          });
          setChatRequests(latestChatData);
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
      }
    });
  const checkIsFirstTime = (type: string) => {
    if (type === ADMIN_MESSAGE) {
      return messageRequests.length == 0;
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
    <div className="text-center">
      <div className="table-heading">
        <Button className="go-back" onClick={() => navigate(-1)}>
          <i className="fa fa-angle-left"></i>
          Go Back
        </Button>
        <h1>Messages from Admin</h1>
      </div>
      <div className="d-flex justify-content-center gap-5 mb-2">
        {[ADMIN_MESSAGE, CHAT_REQUEST, TICKET_REQUEST].map((btn, idx) => (
          <Button
            className={`chat-request-toggle-btns ${
              showingTable === btn && "active"
            }`}
            onClick={() => handleButtonClick(btn)}
            key={idx}
          >
            {btn}
          </Button>
        ))}
      </div>
      <div className="request-msgs">
        <div className="request-sub-msg">
          <h3>{showingTable}</h3>
          {isLoading ? (
            <Spinner variant="success" />
          ) : (
            <>
              {showingTable === CHAT_REQUEST && (
                <>
                  {chatRequests.length > 0 ? (
                    chatRequests.map((chat) => (
                      <UserRequestCard
                        key={chat._id}
                        type="CHAT"
                        sender={chat.sender.name}
                        receiver={chat.opponent.name}
                        time={chat.time}
                        isPending={chat.isPending}
                        onApprove={() => handleApprovedChat(chat.opponent.id)}
                      />
                    ))
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
                        <UserRequestCard
                          key={ticket._id}
                          type="TICKET"
                          sender={ticket.sender.name}
                          receiver={ticket.client.name}
                          time={ticket.time}
                          isPending={ticket.isPending}
                          onApprove={() => handleApprovedTicket(ticket)}
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
                          isAdmin={false}
                          onConfirm={handleAdminMessageSeen}
                        />
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

export default AdminMessages;
