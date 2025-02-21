import React from "react";
import { FileModel } from "../modals/MessageModals";

const BE_SERVER = "https://task-tracker-server-2njm.onrender.com";
const BE_LOCAL = "http://192.168.10.29:1234";
const BE_LOCAL2 = "http://192.168.29.110:1234";
const VERSION1 = "/api/v1";
// change socket url if u want to cha nge server url for API calls
export const SOCKET_URL = BE_SERVER;
export const BE_URL = SOCKET_URL + VERSION1;
export const GROUP_IMG_URL =
  "https://cdn.vectorstock.com/i/1000x1000/59/50/business-office-group-team-people-vector-31385950.webp";
export const OFFLINE = "Offline";
export const AVAILABLE = "Available";
export const BREAK = "Break";
export const LUNCH_BREAK = "Lunch Break";
export const BREAKFAST_BREAK = "Breakfast Break";
export const ON_TICKET = "On Ticket";
export const SLEEP = "Sleep";
export const STATUS_TYPES = [OFFLINE, AVAILABLE, BREAK, ON_TICKET, SLEEP];
export const USER_STATUSES = "USER_STATUSES";
export const FILTERS = ["last 1 week", "last 1 month", "last 2 months"];
export const NO_TICKET_REQUEST = "No Ticket requests Available.";
export const NO_CHAT_REQUEST = "No Chat Request Avaialble.";
export const NO_GROUP_CHAT_REQUEST = "No Group Chat Requests Avaialble.";
export const NO_MESSAGES_TO_DISPLAY = "No Messages To Display.";
export const NOT_ASSIGNED = "Not Assigned";
export const ASSIGNED = "Assigned";
export const IN_PROGRESS = "In Progress";
export const PENDING = "Pending";
export const IMPROPER_REQUIRMENT = "Improper Requirment";
export const CLOSED = "Closed";
export const Reopen = "Reopen";
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
  empId: "",
};
export const EMPTY_TICKET_FILTER_OBJ = {
  duration: "",
  clientName: "",
  status: "",
  date: "",
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
export const GROUP_CHAT_REQUESTS = "Group Chat Requests";
export const REQUEST_TABS = [ADMIN_MESSAGE, GROUP_CHAT_REQUESTS];
export const ADMIN_BTNS = [
  ADMIN_MESSAGE,
  CHAT_REQUEST,
  TICKET_REQUEST,
  TICKETRAISE_MESSAGE,
  GROUP_CHAT_REQUESTS,
];
export const NO_DATA_AVAILBALE = () => <span>Data not available</span>;
export const RED_STAR = () => <span className="text-danger">*</span>;
export const ACCESS_TOKEN = () => localStorage.getItem("accessToken") || "";
export const REFRESH_TOKEN = () => localStorage.getItem("refreshToken") || "";
export const COMPANY_NAME = "ResourceOne IT Solutions";
export const CHAT_CACHE_FILES: { [key: string]: FileModel } = {};
export const CURRENT_ORIGIN = window.location.origin;
export const ALL = "All";
export const RESOLVED = "Resolved";
export const GIVE_ACCESS = "Give Acccess";
export const APPROVED = "Approved";
export const NOT_APPROVED = "Not Approved";
export const TASKS = [
  {
    id: 1,
    title: "Todo List",
    description:
      "Create a simple todo list application where users can add, edit, and delete tasks.",
  },
  {
    id: 2,
    title: "Weather App",
    description:
      "Develop a weather application that fetches weather data from an API and displays it to the user.",
  },
  {
    id: 3,
    title: "Pagination Component",
    description:
      " Design a pagination component that handles navigation between pages of data.",
  },
  {
    id: 4,
    title: "Login Form",
    description:
      "Build a login form with validation for email and password fields.",
  },
  {
    id: 5,
    title: "Countdown Timer",
    description:
      "Develop a countdown timer component that starts from a specified time and decrements until it reaches zero.",
  },
  {
    id: 6,
    title: "Modal Component",
    description:
      "Design a modal component that can be toggled open and closed.",
  },
  {
    id: 7,
    title: "Drag and Drop",
    description:
      "Develop a feature that allows users to drag and drop items within a list.",
  },
  {
    id: 8,
    title: "Chat Application",
    description:
      " Develop a real-time chat application using WebSockets or a library like Socket.io.",
  },
  {
    id: 9,
    title: "Dropdown Component",
    description:
      "Design a dropdown component with options that can be selected by the user.",
  },
  {
    id: 10,
    title: "Form Validation",
    description:
      "Develop a form with validation for various fields such as email, password, and phone number.",
  },
  {
    id: 11,
    title: "Carousel Component",
    description:
      "Design a carousel component that displays a slideshow of images or content.",
  },
  {
    id: 12,
    title: "Responsive Layout",
    description:
      "Develop a responsive layout that adjusts based on the screen size and orientation.",
  },
  {
    id: 13,
    title: "Redux Store",
    description:
      "Set up a Redux store and integrate it with a React application to manage state.",
  },
  {
    id: 14,
    title: "Infinite Scroll Component",
    description:
      "Develop a component that loads more data as the user scrolls down the page.",
  },
  {
    id: 15,
    title: "Quiz Application",
    description:
      " Develop a quiz application where users can answer multiple-choice questions and see their score at the end.",
  },
  {
    id: 16,
    title: "Calculator",
    description: "Able to to mathematic operations",
  },
  {
    id: 17,
    title: "E-Commerce",
    description: "Recomendations, type of items, add to cart",
  },
];
