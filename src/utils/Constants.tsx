import React from "react";
import { cookieComp } from "./utils";

const BE_SERVER = "https://task-tracker-server-2njm.onrender.com";
const BE_LOCAL = "http://192.168.10.30:1234";
const BE_LOCAL2 = "http://192.168.29.110:1234";
const VERSION1 = "/api/v1";
// change socket url if u want to change server url for API calls
export const SOCKET_URL = BE_LOCAL;
export const BE_URL = SOCKET_URL + VERSION1;
export const TOKEN = () => cookieComp();
export const GROUP_IMG_URL =
  "https://cdn.vectorstock.com/i/1000x1000/59/50/business-office-group-team-people-vector-31385950.webp";
export const OFFLINE = "Offline";
export const AVAILABLE = "Available";
export const BREAK = "Break";
export const ON_TICKET = "On Ticket";
export const SLEEP = "Sleep";
export const STATUS_TYPES = [OFFLINE, AVAILABLE, BREAK, ON_TICKET, SLEEP];
export const USER_STATUSES = "USER_STATUSES";
export const FILTERS = ["last 1 week", "last 1 month", "last 2 months"];
export const NO_TICKET_REQUEST = "No Ticket requests Available.";
export const NO_CHAT_REQUEST = "No Chat Request Avaialble.";
export const NO_MESSAGES_TO_DISPLAY = "No Messages To Display.";
export const NOT_ASSIGNED = "Not Assigned";
export const ASSIGNED = "Assigned";
export const IN_PROGRESS = "In Progress";
export const PENDING = "Pending";
export const IMPROPER_REQUIRMENT = "Improper Requirment";
export const CLOSED = "Closed";
export const TICKET_STATUS_TYPES = {
  ASSIGNED,
  IN_PROGRESS,
  PENDING,
  IMPROPER_REQUIRMENT,
  CLOSED,
  NOT_ASSIGNED,
};
export const GENDERS = ["MALE", "FEMALE", "NOT SPECIFIED"];
export const EMPTY_USER_PAYLOAD = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  dob: "",
  joinedDate: "",
  isAdmin: null,
  designation: "",
  profileImageUrl: null,
  address: "",
  gender: "",
};
export const NAME_PATTERN = /^[A-Za-z]+\s{0,1}[A-Za-z]*$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_PATTERN = /^\+[0-9]{1,2}\s\d{10}$/;
export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
export const STATUS_INDICATOR_STYLES: React.CSSProperties = {
  position: "absolute",
  top: "0",
  right: "-20px",
};
export const CHAT_REQUEST = "Chat Requests";
export const TICKET_REQUEST = "Ticket Requests";
export const ADMIN_MESSAGE = "Admin Messages";
export const TICKETRAISE_MESSAGE = "TicketRaise Messages";
export const NO_DATA_AVAILBALE = () => <span>Data not available</span>;
export const RED_STAR = () => <span className="text-danger">*</span>;
