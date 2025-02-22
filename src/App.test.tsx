import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import AuthContext from "./components/Authcontext/AuthContext";
import httpMethods from "./api/Service";
import { act } from "react-dom/test-utils";
const userObj = {
  createdBy: {
    name: "Naresh Admin",
    id: "65baf3ac16ca21ad9e7bdbcb",
  },
  _id: "65bb2260ee14c353abeb1b01",
  firstName: "Naresh Baleboina",
  lastName: "User",
  email: "nareshbjava7@gmail.com",
  mobile: "9010586402",
  password: "Naresh@1234",
  dob: "1998-04-17T00:00:00.000Z",
  userId: "nar3bd5a",
  status: "Available",
  empId: "2024013",
  joinedDate: "2022-07-06T00:00:00.000Z",
  isAdmin: false,
  lastActive: "2024-02-01T04:44:21.047Z",
  isActive: true,
  designation: "UI Developer",
  address: "Kodad , Suryapet",
  profileImageUrl: "1707383735219-kungfu-panda.jpg",
  totalTickets: 0,
  helpedTickets: 0,
  resolvedTickets: 0,
  pendingTickets: 0,
  progressTickets: 0,
  assignedTickets: 0,
  groups: ["65bb626c6b8bf2c2df96cb7f", "65bdacb1b77597f8681f7cca"],
  breakTime: [
    {
      startTime: "2024-02-17T04:12:59.431Z",
      startDate: "2024-02-17",
      endTime: "2024-02-17T04:14:53.627Z",
      endDate: "2024-02-17",
      type: "END",
      status: "Breakfast Break",
      duration: 114.196,
    },
    {
      startTime: "2024-02-21T05:43:52.970Z",
      startDate: "2024-02-21",
      endTime: "2024-02-21T07:00:08.624Z",
      endDate: "2024-02-21",
      type: "END",
      status: "Sleep",
      duration: 4575.654,
    },
    {
      startTime: "2024-02-21T07:15:57.232Z",
      startDate: "2024-02-21",
      endTime: "2024-02-21T08:31:20.825Z",
      endDate: "2024-02-21",
      type: "END",
      status: "Sleep",
      duration: 4523.591,
    },
  ],
  gender: "MALE",
  newMessages: {},
  loginTimings: [
    {
      inTime: "2024-02-15T03:44:14.105Z",
      date: "2024-02-15T03:44:14.105Z",
      _id: "65cd888e4e74c950991c7524",
    },
    {
      inTime: "2024-02-16T01:27:48.213Z",
      date: "2024-02-16T01:27:48.213Z",
      _id: "65ceba14014771f9c79f70de",
    },
    {
      inTime: "2024-02-17T01:23:34.608Z",
      outTime: "2024-02-17T10:12:35.728Z",
      date: "2024-02-17T01:23:34.608Z",
      _id: "65d0869398f2a78eb2f0655a",
    },
    {
      inTime: "2024-02-20T04:07:30.118Z",
      outTime: "2024-02-20T10:19:30.046Z",
      date: "2024-02-20T04:07:30.118Z",
      _id: "65d47cb2dd93f793b4c3ef78",
    },
    {
      inTime: "2024-02-21T02:45:53.363Z",
      date: "2024-02-21T02:45:53.363Z",
      _id: "65d563e12020050a82059c4d",
    },
  ],
  sleepTime: [],
};

const Wrapper = () => (
  <AuthContext>
    <App />
  </AuthContext>
);
describe("Landing Page", () => {
  test("should render welcome page", async () => {
    render(<Wrapper />);
    const linkElement = screen.getByText(/RESOURCE ONE IT SOLUTIONS/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("should render Dashboard Page", async () => {
    const userData = {
      firstName: "Naresh",
      lastName: "Baleboina",
      email: "nareshbjava7@gmail.com",
      mobile: "9010586402",
      password: "Naresh@1234",
      dob: "1998-04-17T00:00:00.000Z",
      userId: "nar3bd5a",
      status: "Available",
      empId: "2024013",
      createdBy: {
        name: "Naresh Admin",
        id: "65baf3ac16ca21ad9e7bdbcb",
      },
      _id: "65bb2260ee14c353abeb1b01",
    };
    const getMock = jest.spyOn(httpMethods, "get").mockResolvedValue(userData);
    await act(async () => {
      render(<Wrapper />);
    });
    const linkElement = screen.getByText(/DASHBOARD/i);
    expect(linkElement).toBeInTheDocument();
  });
});
