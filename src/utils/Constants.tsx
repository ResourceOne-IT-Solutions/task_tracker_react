import { cookieComp } from "./utils";

const BE_SERVER = "https://task-tracker-server-2njm.onrender.com";
const BE_LOCAL = "http://192.168.10.30:1234";
const BE_LOCAL2 = "http://192.168.29.110:1234";
export const BE_URL = BE_LOCAL;
export const TOKEN = () => cookieComp();
export const GROUP_IMG_URL =
  "https://cdn.vectorstock.com/i/1000x1000/59/50/business-office-group-team-people-vector-31385950.webp";
export const STATUS_TYPES = ["Offline", "Available", "Break", "On Ticket"];
export const USER_STATUSES = "USER_STATUSES";
