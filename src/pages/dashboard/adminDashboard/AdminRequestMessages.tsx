import React, { useEffect, useState } from "react";
import "./AdminRequestMessages.css";
import { Button, Spinner } from "react-bootstrap";
import {
  ChatRequestInterface,
  AdminMessageInterface,
  TicketRaiseInterface,
  TicketRequestInterface,
  GroupChatRequestInterface,
} from "../../../modals/MessageModals";
import {
  AdminMessageCard,
  AdminRequestCard,
  FilterComponent,
  Loader,
  TicketRaiseCard,
  filterAdminRequests,
  generatePdf,
  getDate,
  getFullName,
  getPath,
  getRoomId,
} from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import {
  RoomMessages,
  UserContext,
  UserModal,
} from "../../../modals/UserModals";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_MESSAGE,
  ALL,
  CHAT_REQUEST,
  GROUP_CHAT_REQUESTS,
  NO_CHAT_REQUEST,
  NO_MESSAGES_TO_DISPLAY,
  NO_TICKET_REQUEST,
  TICKETRAISE_MESSAGE,
  TICKET_REQUEST,
} from "../../../utils/Constants";
import { Severity } from "../../../utils/modal/notification";
import httpMethods from "../../../api/Service";
import { RectangularSkeleton } from "../../../utils/shimmer";

function AdminRequestMessages() {
  const navigate = useNavigate();
  const {
    socket,
    currentUser,
    alertModal,
    requestMessageCount,
    setRequestMessageCount,
    selectedUser,
    setSelectedUser,
    popupNotification,
  } = useUserContext() as UserContext;
  const [chatRequests, setChatRequests] = useState<ChatRequestInterface[]>([]);
  const [groupChatRequests, setGroupChatRequests] = useState<
    GroupChatRequestInterface[]
  >([]);
  const [showingTable, setShowingTable] = useState(ADMIN_MESSAGE);
  const [newRequests, setNewRequests] = useState<string[]>(requestMessageCount);
  const [ticketRequests, setTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [selected, setSelected] = useState(ALL);
  const [searchedVal, setSearchedVal] = useState("");
  const [showingChatRequests, setShowingChatRequests] = useState<
    ChatRequestInterface[]
  >([]);
  const [showingTicketRequests, setShowingTicketRequests] = useState<
    TicketRequestInterface[]
  >([]);
  const [giveAccessIds, setGiveAccessIds] = useState<string[]>([]);
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
          const updatedMessage = result.find(
            (item: any) => item._id === msz._id,
          );
          return updatedMessage ? updatedMessage : msz;
        });
        setChatRequests(latestData);
      }
      if (type === "TICKET") {
        const latestTicketData = ticketRequests.map((msz) => {
          const updatedTicket = result.find(
            (item: any) => item._id === msz._id,
          );
          return updatedTicket ? updatedTicket : msz;
        });
        setTicketRequests(latestTicketData);
      }
    });
  socket
    .off("chatRequest")
    .on("chatRequest", ({ sender, opponent, time, isPending, date, _id }) => {
      setNewRequests([...newRequests, _id]);
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
      setNewRequests([...newRequests, _id]);
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
        setNewRequests([...newRequests, _id]);
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
  const handleRequestClick = async (
    id: string | string[],
    type: string,
    isRejected?: boolean,
  ) => {
    if (showingTable === GROUP_CHAT_REQUESTS) {
      const chatRequest = groupChatRequests?.find((req) => req._id === id);
      const payload = {
        id: chatRequest?._id,
        name: chatRequest?.name,
        members: chatRequest?.members,
        description: chatRequest?.description,
        admin: {
          name: getFullName(currentUser),
          id: currentUser._id,
        },
        ...(isRejected && { status: "Rejected" }),
      };
      try {
        const resp: any = await httpMethods.post(
          "/message/createGroup",
          payload,
        );
        if (resp.success) {
          const updatedReqs = [...groupChatRequests].map((req) => {
            if (req._id === id) {
              return {
                ...req,
                status: resp.message.includes("Approved")
                  ? "Approved"
                  : "Rejected",
              };
            }
            return req;
          });
          setGroupChatRequests(updatedReqs);
          popupNotification({
            content: resp.message,
            severity: Severity.SUCCESS,
          });
        }
      } catch (error) {
        console.log("ERROR:::", error);
      }
    } else {
      const payload = {
        user: {
          name: getFullName(currentUser),
          id: currentUser._id,
          time: getDate(),
          date: getDate(),
        },
        requestId: typeof id === "string" ? [id] : id,
        type,
        status: false,
      };
      socket.emit("approveUserRequest", payload);
      if (typeof id !== "string") {
        setGiveAccessIds([]);
      } else if (giveAccessIds.includes(id)) {
        setGiveAccessIds((prev) => prev.filter((i) => i !== id));
      }
    }
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
      .then((dt: { data: any[] }) => {
        switch (tableName) {
          case CHAT_REQUEST:
            setChatRequests(dt.data);
            break;
          case TICKET_REQUEST:
            setTicketRequests(dt.data);
            break;
          case ADMIN_MESSAGE:
            setMessageRequests(dt.data);
            break;
          case TICKETRAISE_MESSAGE:
            setTicketRaiseMsgs(dt.data);
            break;
          case GROUP_CHAT_REQUESTS:
            setGroupChatRequests(dt.data);
            break;
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
  const filterLogic = () => {
    if (showingTable === CHAT_REQUEST) {
      const filteredRequests = filterAdminRequests(
        chatRequests,
        selected,
        searchedVal,
      );
      setShowingChatRequests(filteredRequests);
    } else if (showingTable === TICKET_REQUEST) {
      const filteredRequests = filterAdminRequests(
        ticketRequests,
        selected,
        searchedVal,
      );
      setShowingTicketRequests(filteredRequests);
    }
  };
  const handleUserSearch = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    filterLogic();
  };
  const handleCheckBoxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    setGiveAccessIds((prevIds) => {
      if (e.target.checked) {
        return [...prevIds, id];
      } else {
        return prevIds.filter((prevId) => prevId !== id);
      }
    });
  };
  const handleGrantAccess = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const type = showingTable === CHAT_REQUEST ? "CHAT" : "TICKET";
    handleRequestClick(giveAccessIds, type);
  };
  const handleChatExport = async (id: string) => {
    const matchedRequest = showingChatRequests.find((req) => req._id === id);
    const roomId = getRoomId(
      matchedRequest?.sender.id as string,
      matchedRequest?.opponent.id as string,
    );
    try {
      const response = (await httpMethods.get(
        `/message/usersChatHistory/${roomId}`,
      )) as { data: RoomMessages[] };
      generatePdf(response.data, currentUser, {
        name: matchedRequest?.opponent.name as string,
      });
    } catch (error) {
      popupNotification({
        content: "Error While Fetching the Chat",
        severity: Severity.ERROR,
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    getTableData(ADMIN_MESSAGE);
    setRequestMessageCount([]);
  }, []);
  useEffect(() => {
    filterLogic();
  }, [selected, ticketRequests, chatRequests]);
  useEffect(() => {
    setSelected(ALL);
    setSearchedVal("");
    setGiveAccessIds([]);
  }, [showingTable]);
  return (
    <div className="text-center view-request-msgs container">
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
        {[
          ADMIN_MESSAGE,
          CHAT_REQUEST,
          TICKET_REQUEST,
          TICKETRAISE_MESSAGE,
          GROUP_CHAT_REQUESTS,
        ].map((btn, idx) => (
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
      <>
        {[CHAT_REQUEST, TICKET_REQUEST].includes(showingTable) && (
          <FilterComponent
            selected={selected}
            setSelected={setSelected}
            searchedVal={searchedVal}
            setSearchedVal={setSearchedVal}
            handleUserSearch={handleUserSearch}
            isAdmin={true}
            handleGrantAccess={handleGrantAccess}
            AccessIdsLength={giveAccessIds?.length}
          />
        )}
      </>
      <div className="request-msgs container">
        <div className="request-sub-msg">
          {isLoading ? (
            <RectangularSkeleton styles={{ height: "50px" }} count={5} />
          ) : (
            <>
              {showingTable === CHAT_REQUEST && (
                <>
                  {showingChatRequests.length > 0 ? (
                    showingChatRequests?.map((chat) => {
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
                          isNew={newRequests.includes(chat._id)}
                          handleCheckBoxChange={handleCheckBoxChange}
                          accessIds={giveAccessIds}
                          handleChatExport={handleChatExport}
                        />
                      );
                    })
                  ) : (
                    <p className="fw-bold">{NO_CHAT_REQUEST}</p>
                  )}
                </>
              )}
              {showingTable === GROUP_CHAT_REQUESTS && (
                <>
                  {groupChatRequests.length > 0 ? (
                    groupChatRequests?.map((chat) => {
                      return (
                        <AdminRequestCard
                          type="GROUP_CHAT"
                          key={chat._id}
                          id={chat._id}
                          time={chat.time}
                          sender={chat.requestdBy.name}
                          members={chat.members}
                          isPending={chat?.status}
                          onApprove={handleRequestClick}
                          isNew={newRequests.includes(chat._id)}
                          handleCheckBoxChange={handleCheckBoxChange}
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
                  {showingTicketRequests.length > 0 ? (
                    showingTicketRequests?.map((ticket) => {
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
                          isNew={newRequests.includes(ticket._id)}
                          handleCheckBoxChange={handleCheckBoxChange}
                          accessIds={giveAccessIds}
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
                          isNew={newRequests.includes(message._id)}
                          currentUserId={currentUser._id}
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
                        <TicketRaiseCard
                          key={message._id}
                          message={message}
                          isNew={newRequests.includes(message._id)}
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

export default AdminRequestMessages;
