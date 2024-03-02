import React, { useEffect, useState } from "react";
import {
  AdminMessageCard,
  UserRequestCard,
  getData,
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
  NO_CHAT_REQUEST,
  NO_MESSAGES_TO_DISPLAY,
  NO_TICKET_REQUEST,
} from "../../../utils/Constants";
import { Severity } from "../../../utils/modal/notification";

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

  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [ticketLoading, setTicketLoading] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);

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
  useEffect(() => {
    setChatLoading(true);
    setTicketLoading(true);
    setMessageLoading(true);
    Promise.all([
      getData<ChatRequestInterface>(
        `message/user-chat-request/${currentUser._id}`,
      ),
      getData<TicketRequestInterface>(
        `message/user-ticket-request/${currentUser._id}`,
      ),
      getData<AdminMessageInterface>(`message/admin-messages`),
    ])
      .then((results) => {
        setChatRequests(results[0]);
        setTicketRequests(results[1]);
        setMessageRequests(results[2]);
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
      });
  }, []);
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
  return (
    <div className="text-center">
      <h1>Messages From Admin</h1>
      <Button variant="danger" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <div className="request-msgs">
        <div className="request-sub-msg">
          <h3>User Requested Chat</h3>
          {chatLoading ? (
            <Spinner variant="success" />
          ) : chatRequests.length > 0 ? (
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
        </div>
        <div className="request-sub-msg">
          <h3>User Requested Tickets</h3>
          {ticketLoading ? (
            <Spinner variant="success" />
          ) : ticketRequests.length > 0 ? (
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
        </div>
        <div className="request-sub-msg">
          <h3>All Admin Messages</h3>
          {messageLoading ? (
            <Spinner variant="success" />
          ) : messageRequests.length > 0 ? (
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
        </div>
      </div>
    </div>
  );
}

export default AdminMessages;
