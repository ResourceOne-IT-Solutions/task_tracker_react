import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import httpMethods from "../api/Service";
import {
  NameIdInterface,
  Status,
  UserContext,
  UserModal,
} from "../modals/UserModals";
import { BlueDot, GreenDot, GreyDot, OrangeDot, RedDot } from "./Dots/Dots";
import {
  ACCESS_TOKEN,
  ADMIN_MESSAGE,
  AVAILABLE,
  BE_URL,
  BREAK,
  CHAT_REQUEST,
  EMAIL_PATTERN,
  MOBILE_PATTERN,
  NAME_PATTERN,
  OFFLINE,
  ON_TICKET,
  PASSWORD_PATTERN,
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
  TicketRaiseCardProps,
  UserRequestCardProps,
} from "../modals/MessageModals";

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

export const statusIndicator = (status: Status = "") => {
  if (status === AVAILABLE) {
    return <GreenDot title={status} />;
  } else if (status.includes(BREAK)) {
    return <OrangeDot title={status} />;
  } else if (status === ON_TICKET) {
    return <BlueDot title={status} />;
  } else if (status === OFFLINE) {
    return <RedDot title={status} />;
  } else if (status === SLEEP) {
    return <GreyDot title={status} />;
  }
};
export interface FullNameType {
  firstName: string;
  lastName: string;
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

let base64Cache: { [key: string]: string } = {};

const addCache = (name: string, data: string) => {
  base64Cache = { ...base64Cache, [name]: data };
};
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
  const { alertModal, popupNotification } = useUserContext() as UserContext;
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
              console.error("blob_err:::", err);
            });
        })
        .catch((err) => {
          popupNotification({
            severity: Severity.ERROR,
            content: err.message,
          });
        });
    }
  }, [filename]);
  const handleImageClick = () => {
    if (imgPopup) {
      setShowImage(!showImage);
    }
  };
  return (
    <>
      <img src={imageUrl} className={className} onClick={handleImageClick} />
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
      <Modal.Body>
        {!children && (
          <div style={{ width: "300px", height: "300px" }}>
            <img src={imageUrl} width="100%" height="100%" />
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

export const getContent = (type: string, sender: string, receiver: string) => {
  switch (type) {
    case "CHAT": {
      return `${sender} is Requesting to Chat with ${receiver}`;
    }
    case "TICKET": {
      return `${sender} is Requesting for ${receiver} tickets.`;
    }
  }
};

export const AdminRequestCard = ({
  id,
  sender,
  receiver,
  isPending,
  onApprove,
  type,
  time,
  isNew,
}: AdminRequestCardProps) => {
  return (
    <div className={`request-content-wrapper ${isNew && "bg-warning"} `}>
      <div>
        {getContent(type, sender, receiver)}
        <div>Time: {new Date(time).toLocaleString()}</div>
      </div>

      <div>
        {isPending ? (
          <Button variant="success" onClick={() => onApprove(id, type)}>
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
