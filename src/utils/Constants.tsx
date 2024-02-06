import { cookieComp } from "./utils";

const BE_SERVER = "https://task-tracker-server-2njm.onrender.com";
const BE_LOCAL = "http://192.168.10.30:1234";
const BE_LOCAL2 = "http://192.168.29.110:1234";
export const BE_URL = BE_SERVER;
export const TOKEN = () => cookieComp();
export const GROUP_IMG_URL =
  "https://cdn.vectorstock.com/i/1000x1000/59/50/business-office-group-team-people-vector-31385950.webp";
export const OFFLINE = "Offline";
export const AVAILABLE = "Available";
export const BREAK = "Break";
export const ON_TICKET = "On Ticket";
export const STATUS_TYPES = [OFFLINE, AVAILABLE, BREAK, ON_TICKET];
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
