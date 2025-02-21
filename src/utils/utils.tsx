import React, { CSSProperties, useEffect, useState } from "react";
import { Button, Dropdown, Spinner, Form, InputGroup } from "react-bootstrap";
import httpMethods from "../api/Service";
import {
  NameIdInterface,
  RoomMessages,
  Status,
  UserContext,
  UserModal,
} from "../modals/UserModals";
import { Dot, DotColors } from "./Dots/Dots";
import {
  ACCESS_TOKEN,
  ADMIN_MESSAGE,
  ALL,
  APPROVED,
  AVAILABLE,
  BE_URL,
  BREAK,
  CHAT_REQUEST,
  EMAIL_PATTERN,
  GIVE_ACCESS,
  GROUP_CHAT_REQUESTS,
  MOBILE_PATTERN,
  NAME_PATTERN,
  NOT_APPROVED,
  OFFLINE,
  ON_TICKET,
  PASSWORD_PATTERN,
  RESOLVED,
  SLEEP,
  TICKETRAISE_MESSAGE,
  TICKET_REQUEST,
} from "./Constants";
import { useUserContext } from "../components/Authcontext/AuthContext";
import { Severity } from "./modal/notification";
import { Modal } from "react-bootstrap";
import {
  AdminMessageCardProps,
  AdminRequestCardProps,
  GroupChatRequestInterface,
  TicketRaiseCardProps,
  UserRequestCardProps,
} from "../modals/MessageModals";
import { fileDownload } from "../pages/chat/chatbox/Util";
import { TicketModal } from "../modals/TicketModals";
import jsPDF from "jspdf";

export const setCookie = (cvalue: string, hours: number) => {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60000);
  const expires = "expires=" + d.toUTCString();
  document.cookie =
    "presentTaskUser" + "=" + cvalue + ";" + expires + ";path=/";
};

export const cookieComp = (): string => {
  const getCookie = (cname: string) => {
    const totalCookie = document.cookie.split(";");
    const ca = totalCookie.find((val) => val.includes(cname)) as string;
    if (ca) {
      const cv = ca.split("=");
      return cv[1];
    }
    return null;
  };
  const checkCookie = () => {
    const user = getCookie("presentTaskUser");
    if (user) {
      return user;
    } else {
      setCookie("", 8);
      return "";
    }
  };
  return checkCookie();
};

export function getData<T>(url: string): Promise<T[]> {
  return httpMethods.get(`/${url}`);
}

export const statusIndicator = (
  status: Status = "",
  styles: CSSProperties = {},
) => {
  if (status === AVAILABLE) {
    return <Dot title={status} color={DotColors.GREEN} styles={styles} />;
  } else if (status.includes(BREAK)) {
    return <Dot title={status} color={DotColors.ORANGE} styles={styles} />;
  } else if (status === ON_TICKET) {
    return <Dot title={status} color={DotColors.BLUE} styles={styles} />;
  } else if (status === OFFLINE) {
    return <Dot title={status} color={DotColors.RED} styles={styles} />;
  } else if (status === SLEEP) {
    return <Dot title={status} color={DotColors.GREY} styles={styles} />;
  }
};
export interface FullNameType {
  firstName?: string;
  lastName?: string;
  name?: string;
}
export type DateFormat = "dd-mm-yyyy" | "mm-dd-yyyy" | "";
export type DateType = "date" | "time";

export const getFullName = (user: FullNameType) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.name) {
    return user.name;
  }
  return "Invalid name";
};

export const getFormattedTime = (dt = new Date()) => {
  const d = new Date(dt).toLocaleString().split(" ");
  const t = d[1].slice(0, -3);
  const time = t + " " + d[2];
  return time;
};

export const getDate = (date: Date = new Date()): Date => {
  if (date) {
    return new Date(date);
  }
  return new Date();
};

export const getNameId = (user: UserModal): NameIdInterface => {
  if (!user._id) {
    return {} as NameIdInterface;
  }
  return { name: getFullName(user), id: user._id };
};

export const getFormattedDate = (dt: Date, format?: DateFormat) => {
  const date = new Date(dt);
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  switch (format) {
    case "dd-mm-yyyy": {
      return `${day}-${month}-${year}`;
    }
    case "mm-dd-yyyy": {
      return `${month}-${day}-${year}`;
    }
    default: {
      return `${year}-${month}-${day}`;
    }
  }
};
export const getCurrentDate = (num?: number) => {
  const currentDate = new Date();
  if (num) {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
  }
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getRoomId = (id1: string, id2: string) => {
  if (id1 > id2) {
    return id1 + "-" + id2;
  } else {
    return id2 + "-" + id1;
  }
};

export const getImage = async (path: string) => {
  try {
    const response = await fetch(`${BE_URL}${path}`, {
      headers: {
        Authorization: ACCESS_TOKEN(),
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Get the image blob and create a URL for it
    const blob = await response.blob();
    return blob;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
const blobToBase64 = (blob: Blob): Promise<string | ArrayBuffer> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read the Blob object"));
    };
    reader.readAsDataURL(blob);
  });
};
const getProfileImage = async (id: string) => {
  return await fileDownload("profile-image/" + id);
};

let base64Cache: { [key: string]: string } = {};

const addCache = (name: string, data: string) => {
  base64Cache = { ...base64Cache, [name]: data };
};
function bufferToBase64(buffer: Buffer) {
  const binary = Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join("");

  const base64String = btoa(binary);
  return base64String;
}
const isValidBase64 = (base64String: string) => {
  const base64Regex = /^data:[\w/]+;base64,[a-zA-Z0-9+/]+={0,2}$/;
  return base64Regex.test(base64String);
};
export const ProfileImage = ({
  filename,
  className,
  imgPopup = true,
}: {
  filename: string;
  className?: string;
  imgPopup?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showImage, setShowImage] = useState<boolean>(false);
  const { popupNotification } = useUserContext() as UserContext;
  useEffect(() => {
    if (!filename) return;
    const img = base64Cache[`img-${filename}`];
    if (img) {
      setImageUrl(img);
    } else {
      getImage(`/profile-images/${filename}`)
        .then((blob) => {
          blobToBase64(blob)
            .then((res) => {
              const url = `data:image/jpeg;base64,${res}`;
              if (isValidBase64(url)) {
                addCache(`img-${filename}`, url as string);
                setImageUrl(url as string);
              }
            })
            .catch((err) => {
              addCache(`img-${filename}`, "");
              console.error("blob_err:::", err);
            });
        })
        .catch((err) => {
          addCache(`img-${filename}`, "");
          console.error("blob_err:::", err);
          popupNotification({
            severity: Severity.ERROR,
            content: err.message,
          });
        });
      // getProfileImage("65fd1dd867bfcf98af519b90").then((file) => {
      //   if (file) {
      //     const str = bufferToBase64(file.data.data);
      //     const base64 = `data:image/jpeg;base64,${str}`;
      //     addCache(`img-65fd1dd867bfcf98af519b90`, base64 as string);
      //     setImageUrl(base64 as string);
      //   }
      // });
    }
  }, [filename]);
  const handleImageClick = () => {
    if (imgPopup) {
      setShowImage(!showImage);
    }
  };
  return (
    <>
      <img
        src={imageUrl}
        className={className}
        onClick={handleImageClick}
        alt={filename?.slice(0, 5) || "user-img"}
      />
      {showImage && (
        <ImageShowModal
          show={showImage}
          onHide={() => setShowImage(false)}
          imageUrl={imageUrl}
        />
      )}
    </>
  );
};
interface ImageSHowModal {
  show: boolean;
  onHide: () => void;
  imageUrl?: string;
  children?: JSX.Element;
}
export const ImageShowModal = ({
  show,
  onHide,
  imageUrl = "",
  children,
}: ImageSHowModal) => {
  return (
    <Modal className="profileimg-zoom" show={show} onHide={onHide}>
      <Modal.Body className="d-flex justify-content-center">
        {!children && (
          <div style={{ width: "300px", height: "300px" }}>
            <img src={imageUrl} width="100%" height="100%" alt="user-profile" />
          </div>
        )}
        {children}
      </Modal.Body>
    </Modal>
  );
};

export const handleValidate = (name: string, value: string): boolean => {
  let isValidField = true;
  if (name === "firstName" || name === "lastName" || name === "designation") {
    isValidField = NAME_PATTERN.test(value) && value.length >= 3;
  } else if (name === "email") {
    isValidField = EMAIL_PATTERN.test(value);
  } else if (name === "mobile") {
    isValidField = MOBILE_PATTERN.test(value);
  } else if (name === "password") {
    isValidField = PASSWORD_PATTERN.test(value);
  }
  return isValidField;
};
//for Timer in userDashboard navbar
export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const timerMinutes = Number(formatTime(seconds).substring(0, 2));
  return (
    <div
      className={
        timerMinutes < 15
          ? "Break-timer mx-2 less-15"
          : timerMinutes < 20
            ? "Break-timer mx-2 less-20"
            : "Break-timer mx-2 more-20"
      }
    >
      {formatTime(seconds)}
    </div>
  );
};

interface LoaderProps {
  fullScreen?: boolean;
}
export const Loader = ({ fullScreen = true }: LoaderProps) => {
  return (
    <div
      className={`align-items-center d-flex justify-content-center ${
        fullScreen ? "vh-100" : ""
      }`}
    >
      <Spinner variant="succss" />
    </div>
  );
};

export const isEmptyObject = (object: object) => {
  if (Object.keys(object).length) {
    return false;
  }
  return true;
};

export const getContent = (
  type: string,
  sender: string,
  receiver: string,
  members?: NameIdInterface[],
) => {
  switch (type) {
    case "CHAT": {
      return `${sender} is Requesting to Chat with ${receiver}`;
    }
    case "TICKET": {
      return `${sender} is Requesting for ${receiver} tickets.`;
    }
    case "GROUP_CHAT": {
      const names = [] as string[];
      members?.forEach((member) => {
        names.push(member.name);
      });
      return `${sender} is Requesting to Create Group With ${names}.`;
    }
  }
};

export const AdminRequestCard = ({
  id,
  sender,
  receiver,
  members,
  isPending,
  onApprove,
  type,
  time,
  isNew,
  accessIds,
  handleCheckBoxChange,
  handleChatExport,
}: AdminRequestCardProps) => {
  return (
    <div className={`request-content-wrapper ${isNew && "bg-warning"} `}>
      <div
        className={
          ["CHAT", "TICKET"].includes(type) ? "d-flex align-items-center" : ""
        }
      >
        {["CHAT", "TICKET"].includes(type) && (
          <Form.Check
            type="checkbox"
            label=""
            disabled={!isPending}
            checked={accessIds?.includes(id)}
            onChange={(e) => handleCheckBoxChange?.(e, id)}
          />
        )}
        <div>
          {type === "GROUP_CHAT"
            ? getContent(type, sender, "", members as NameIdInterface[])
            : getContent(type, sender, receiver as string)}
          <div>Time: {new Date(time).toLocaleString()}</div>
        </div>
      </div>

      <div>
        {(type === "GROUP_CHAT" ? isPending === "Pending" : isPending) ? (
          <Button
            variant="success"
            onClick={() => onApprove(id, type)}
            className="me-3"
          >
            Give Access
          </Button>
        ) : (
          <>
            {isPending === "Rejected" ? (
              <Button variant="warning" disabled className="me-3">
                Rejected
              </Button>
            ) : (
              <Button variant="success" disabled className="me-3">
                Resolved
              </Button>
            )}
            {type === "CHAT" && (
              <Button variant="primary" onClick={() => handleChatExport?.(id)}>
                Export Chat
              </Button>
            )}
          </>
        )}
        {type === "GROUP_CHAT" && isPending === "Pending" && (
          <Button variant="warning" onClick={() => onApprove(id, type, true)}>
            Reject
          </Button>
        )}
      </div>
    </div>
  );
};

export const getAdminMessageFormat = (
  content: string,
  sender: string,
  time: Date,
) => {
  return (
    <>
      <div className="my-2">Message: {content}</div>
      <div className="my-2">Sent by: {sender}</div>
      <div className="my-2">Time: {new Date(time).toLocaleString()}</div>
    </>
  );
};
const adminOptions = [ALL, RESOLVED, GIVE_ACCESS];
const userOptions = [ALL, APPROVED, NOT_APPROVED];
export const FilterComponent = ({
  selected,
  setSelected,
  searchedVal,
  setSearchedVal,
  handleUserSearch,
  handleGrantAccess,
  isAdmin,
  AccessIdsLength,
}: {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  searchedVal: string;
  setSearchedVal: React.Dispatch<React.SetStateAction<string>>;
  handleUserSearch: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  handleGrantAccess?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  isAdmin: boolean;
  AccessIdsLength?: number;
}) => {
  const handleSelect = (item: string | null) => {
    setSelected(item as string);
  };
  const options = isAdmin ? adminOptions : userOptions;
  return (
    <div className="d-flex justify-content-center gap-3 mb-2">
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle variant="success" id="dropdown-basic-chat-request">
          {selected ? selected : "Select an Option"}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
          {options.map((item: string, index: number) => {
            return (
              <Dropdown.Item key={index} eventKey={item}>
                {item}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <InputGroup className="w-25">
        <Form.Control
          type="text"
          placeholder="Search For Users Or Clients"
          value={searchedVal}
          onChange={(e) => setSearchedVal(e.target.value)}
        />
      </InputGroup>
      <Button className="btn btn-primary" onClick={handleUserSearch}>
        Search
      </Button>
      <Button
        className="btn btn-secondary"
        onClick={handleGrantAccess}
        disabled={AccessIdsLength === 0}
      >
        Grant Access
      </Button>
    </div>
  );
};

export const filterAdminRequests = (
  requests: any,
  selected: string,
  searchedVal: string,
) => {
  let reqs = requests.filter((item: any) => {
    return (
      selected === ALL ||
      (selected === RESOLVED && !item.isPending) ||
      (selected === GIVE_ACCESS && item.isPending)
    );
  });
  if (searchedVal.length) {
    reqs = filterByName(reqs, searchedVal);
  }
  return reqs;
};

export const filterUserRequests = (
  requests: any,
  selected: string,
  searchedVal: string,
) => {
  let reqs = requests.filter((item: any) => {
    return (
      selected === ALL ||
      (selected === APPROVED && !item.isPending) ||
      (selected === NOT_APPROVED && item.isPending)
    );
  });
  if (searchedVal.length) {
    reqs = filterByName(reqs, searchedVal);
  }
  return reqs;
};

export function filterByName<
  T extends {
    sender: { name: string };
    opponent?: { name: string };
    client?: { name: string };
  },
>(requests: T[], searchedVal: string) {
  const searchedText = searchedVal.toLowerCase().trim();
  const reqs = requests.filter(
    (req: T) =>
      req.sender.name.toLowerCase().includes(searchedText) ||
      (req?.opponent &&
        req.opponent?.name.toLowerCase().includes(searchedText)) ||
      (req?.client && req.client?.name.toLowerCase().includes(searchedText)),
  );
  return reqs;
}

export const AdminMessageCard = ({
  message,
  isAdmin,
  onConfirm,
  isNew,
  currentUserId,
}: AdminMessageCardProps) => {
  return (
    <div
      className={`request-content-wrapper ${isNew && "bg-warning"} `}
      key={message._id}
    >
      <div className="message-request-content">
        {getAdminMessageFormat(
          message.content,
          message.sender.name,
          message.time,
        )}
      </div>
      <div className="d-flex flex-column delivery-status">
        {isAdmin ? (
          <>
            <span>
              Delivered to{" "}
              <span className="fw-bold">{message.deliveredTo.length}</span>
            </span>
            <span>
              Seen : <span className="fw-bold">{message.viewedBy.length} </span>
            </span>
          </>
        ) : (
          <div className="message-seen-btn">
            {message.viewedBy.includes(currentUserId) ? (
              <Button variant="success">Seen</Button>
            ) : (
              <Button
                variant="danger"
                onClick={() => onConfirm && onConfirm(message)}
              >
                Confirm Seen
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const UserRequestCard = ({
  sender,
  receiver,
  type,
  time,
  isPending,
  onApprove,
}: UserRequestCardProps) => {
  return (
    <div className="request-content-wrapper">
      <div className="chatrequest-message">
        <div>{getContent(type, sender, receiver)}</div>
        <div>Time: {new Date(time).toLocaleString()}</div>
      </div>
      <p>
        {isPending ? (
          <Button variant="danger" disabled>
            Not Approved
          </Button>
        ) : (
          <Button variant="success" onClick={onApprove}>
            Approved
          </Button>
        )}
      </p>
    </div>
  );
};

export const UserGroupRequestCard = ({
  message,
}: {
  message: GroupChatRequestInterface;
}) => {
  const { requestdBy, members, time, status } = message;
  return (
    <div className="request-content-wrapper">
      <div className="chatrequest-message">
        <div>{getContent("GROUP_CHAT", requestdBy.name, "", members)}</div>
        <div>Time: {new Date(time).toLocaleString()}</div>
      </div>
      <p>
        {status !== "Approved" ? (
          <Button variant="danger" disabled>
            {status === "Pending" ? "Not Approved" : "Rejected"}
          </Button>
        ) : (
          <Button variant="success" disabled>
            Approved
          </Button>
        )}
      </p>
    </div>
  );
};

export const TicketRaiseCard = ({ message, isNew }: TicketRaiseCardProps) => {
  return (
    <div
      className={`request-content-wrapper ${isNew && "bg-warning"} `}
      key={message._id}
    >
      <div className="message-request-content">
        {getAdminMessageFormat(
          message.content,
          message.sender.name,
          message.time,
        )}
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
};

export const getPath = (type: string) => {
  switch (type) {
    case CHAT_REQUEST:
      return "user-chat-request";
    case TICKET_REQUEST:
      return "user-ticket-request";
    case ADMIN_MESSAGE:
      return "admin-messages";
    case TICKETRAISE_MESSAGE:
      return "ticket-raise-messages";
    case GROUP_CHAT_REQUESTS:
      return "getGroupRequests";
  }
};

export const checkIsMobileView = () => {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const mobileThreshold = 768;
  return screenWidth < mobileThreshold;
};

export const Description = ({ content }: { content: string }) => {
  return (
    <>
      {content.length >= 30 ? <>{content.slice(0, 30)}...</> : <>{content} </>}
    </>
  );
};

export const checkDuration = (
  ticket: TicketModal,
  duration: string,
): boolean => {
  const date = new Date();
  if (!duration) return true;
  if (duration == "last 1 week") {
    date.setDate(date.getDate() - 7);
    return new Date(ticket.receivedDate) >= date;
  } else if (duration == "last 1 month" || duration == "last 2 months") {
    const month = duration == "last 1 month" ? 1 : 2;
    date.setMonth(date.getMonth() - month);
    return new Date(ticket.receivedDate) >= date;
  }
  return false;
};

export const checkClientName = (ticket: TicketModal, name: string): boolean => {
  if (!name) return true;
  if (ticket.client.name === name) {
    return true;
  }
  return false;
};
export const checkStatus = (ticket: TicketModal, status: string): boolean => {
  if (!status) return true;
  if (ticket.status === status) {
    return true;
  }
  return false;
};
export const checkDateWise = (
  ticket: TicketModal,
  from: Date,
  to: Date,
): boolean => {
  if (!from.getTime() || !to.getTime()) return true;
  const receivedDate = new Date(ticket.receivedDate);
  return receivedDate >= new Date(from) && receivedDate <= new Date(to);
};

export const generatePdf = (
  msgs: RoomMessages[],
  currentUser: UserModal,
  selectedUser: UserModal | { name: string },
) => {
  const chatHistory = msgs.flatMap((messages) =>
    messages.messageByDate.map((message) => {
      return `${message.from.name}: ${message.content} - ${new Date(
        message.date,
      ).toLocaleDateString()} ${new Date(message.time).toLocaleTimeString()}`;
    }),
  );
  const pdf = new jsPDF();
  const pageSize = pdf.internal.pageSize;
  const pageHeight = pageSize.height;
  const lineHeight = 5; // Adjust as needed
  const marginLeft = 10; // Adjust the left margin as needed
  let cursorY = 10;
  chatHistory.forEach((message) => {
    if (cursorY + lineHeight > pageHeight) {
      pdf.addPage(); // Add a new page
      cursorY = 10; // Reset Y position
    }
    // Split the message into lines if it's too long
    const lines = pdf.splitTextToSize(
      message,
      pdf.internal.pageSize.getWidth() - 2 * marginLeft,
    );

    // Output each line
    lines.forEach((line: string, lineIndex: number) => {
      if (lineIndex === 0) {
        pdf.text(line, marginLeft, cursorY);
      } else {
        pdf.text(line, marginLeft + 5, cursorY);
      }
      cursorY += lineHeight;
    });
    cursorY += lineHeight;
  });
  const pdfName = `${getFullName(currentUser)}-${getFullName(
    selectedUser,
  )}-Chat.pdf`;
  pdf.save(pdfName);
};
