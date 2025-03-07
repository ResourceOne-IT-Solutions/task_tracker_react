import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import {
  ProfileImage,
  getData,
  getFullName,
  statusIndicator,
} from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import { UserContext, UserModal } from "../../../modals/UserModals";
import { TicketModal } from "../../../modals/TicketModals";
import Timezones from "../../../components/features/timezone/Timezones";
import { useNavigate } from "react-router-dom";
import { Severity } from "../../../utils/modal/notification";
import { ErrorMessageInterface } from "../../../modals/interfaces";
import LoginTimings from "./utils/LoginTimings";
import BreakTimings from "./utils/BreakTimings";
import { OFFLINE } from "../../../utils/Constants";

const UserDashboard = ({ user }: { user: UserModal }) => {
  const navigate = useNavigate();
  const { socket, currentUser, alertModal } = useUserContext() as UserContext;
  const [tableData, setTableData] = useState<TicketModal[]>([]);
  const [presentUser, setPresentUser] = useState<UserModal>(user);
  const dateConversion = (date: Date) => new Date(date).toLocaleDateString();
  const [pieChartData, setPieChartData] = useState([
    { name: "In Progress Tickets", value: 0 },
    { name: "Closed Tickets", value: 0 },
    { name: "Helped Tickets", value: presentUser.helpedTickets },
    { name: "Pending Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);
  const [showChatRequestPopup, setShowChatRequestPopup] = useState(false);
  const [userData, setUserData] = useState<UserModal[]>([]);
  const [selected, setSelected] = useState("");
  socket.off("ticketRaiseStatus").on("ticketRaiseStatus", (msg) => {
    alertModal({
      severity: Severity.SUCCESS,
      content: msg,
      title: "Ticket Raise",
    });
  });
  useEffect(() => {
    getData<TicketModal>("tickets/user/pending-tickets/" + user._id)
      .then((result) => {
        setTableData(result);
        const ticketStats: { [key: string]: number } = {
          Pending: 0,
          Closed: 0,
          "In Progress": 0,
          Assigned: 0,
          "Improper Requirment": 0,
        };
        result.forEach((tkt) => {
          ticketStats[tkt.status] = ticketStats[tkt.status] + 1;
        });

        setPieChartData([
          { name: "Pending Tickets", value: ticketStats["Pending"] },
          { name: "Closed Tickets", value: ticketStats["Closed"] },
          { name: "In Progress Tickets", value: ticketStats["In Progress"] },
          { name: "Assigned Tickets", value: ticketStats["Assigned"] },
          {
            name: "Improper Requirment",
            value: ticketStats["Improper Requirment"],
          },
        ]);
        setPresentUser((data) => ({
          ...data,
          pendingTickets: ticketStats["Pending"],
          closedTickets: ticketStats["Closed"],
          progressTickets: ticketStats["In Progress"],
        }));
      })
      .catch((err: ErrorMessageInterface) => {
        alertModal({
          severity: Severity.ERROR,
          content: err.message,
          title: "User Tickets",
        });
      });
    if (user.isAdmin) {
      getData<TicketModal>("tickets/user/" + user._id)
        .then((result) => result)
        .catch((err: ErrorMessageInterface) => {
          alertModal({
            severity: Severity.ERROR,
            content: err.message,
            title: "User Tickets",
          });
        });
    }
    setPresentUser(user);
  }, [user]);

  const handleSelect = (item: string | null) => {
    setSelected(item as string);
  };
  const handleChatRequest = () => {
    getData<UserModal>("users")
      .then((users) => {
        setUserData(users);
      })
      .catch((err: ErrorMessageInterface) => {
        alertModal({
          severity: Severity.ERROR,
          content: err.message,
          title: "Users",
        });
      }),
      setShowChatRequestPopup(true);
  };
  const handleSubmitRequest = () => {
    let exactUserid = "";
    let exactUsername = "";
    userData.forEach((item: UserModal) => {
      if (getFullName(item) == selected) {
        exactUserid = item._id;
        exactUsername = getFullName(item);
      }
    });
    socket.emit("requestChat", {
      user: { name: getFullName(currentUser), id: currentUser._id },
      opponent: { name: exactUsername, id: exactUserid },
    });
    setSelected("");
    setShowChatRequestPopup(false);
  };
  return (
    <>
      <div className="userdashboard">
        <div className="d-flex justify-content-center">
          <div className="username text-center">
            Welcome to <b>{getFullName(presentUser)}</b> Dashboard
          </div>
          {currentUser._id !== presentUser._id && (
            <div className="align-self-center">
              <Button variant="warning" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          )}
        </div>
        <div className="user-header">
          <div className="usernavbar fw-semibold">
            <div className="nav_img_container">
              <ProfileImage filename={presentUser.profileImageUrl} />
            </div>
            <p> {getFullName(presentUser)} </p>
            <span>{statusIndicator(presentUser.status)}</span>
            <p>({presentUser.userId})</p>
          </div>
          {currentUser._id === presentUser._id && (
            <>
              <div className="user-btns">
                <Button onClick={handleChatRequest}>
                  Request Chat With User
                </Button>
                <Button
                  onClick={() =>
                    navigate("/dashboard/tickets/today", {
                      state: "pending-tickets",
                    })
                  }
                  variant="primary"
                >
                  Active Tickets
                </Button>
                <Button
                  onClick={() =>
                    navigate("/dashboard/tickets/helped", {
                      state: "helped-tickets",
                    })
                  }
                  variant="primary"
                >
                  Helped Tickets
                </Button>
              </div>
              <Modal
                show={showChatRequestPopup}
                onHide={() => setShowChatRequestPopup(false)}
              >
                <Modal.Header closeButton className="popup-header">
                  <Modal.Title>Chat Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Row className="mb-3">
                      <Form.Group as={Col} md="12">
                        <Dropdown onSelect={handleSelect}>
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic-chat-request"
                          >
                            {selected ? selected : "Select a User"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            style={{ maxHeight: "180px", overflowY: "auto" }}
                          >
                            {userData !== null
                              ? userData
                                  .filter(
                                    (item: UserModal) =>
                                      !item.isAdmin &&
                                      item._id !== presentUser._id,
                                  )
                                  .map((item: UserModal, index: number) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        eventKey={getFullName(item)}
                                      >
                                        {getFullName(item)}
                                      </Dropdown.Item>
                                    );
                                  })
                              : null}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={handleSubmitRequest}>
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowChatRequestPopup(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>
        <div className="userdetails">
          <div className="user-data">
            <ul>
              <b>Employee Details</b>
              <li>
                <span className="keys d-inline-block fw-semibold">
                  Employee ID{" "}
                </span>{" "}
                : {presentUser.empId}
              </li>
              <li>
                <span className="keys d-inline-block fw-semibold">
                  Employee Name
                </span>{" "}
                : {getFullName(presentUser)}
              </li>
              <li>
                <span className="keys d-inline-block fw-semibold">Email</span> :{" "}
                {presentUser.email}
              </li>
              <li>
                <span className="keys d-inline-block fw-semibold">Gender</span>{" "}
                : {presentUser.gender}
              </li>
              <li>
                <span className="keys d-inline-block fw-semibold">Dob</span> :{" "}
                {dateConversion(presentUser.dob)}
              </li>
              <li>
                <span className="keys d-inline-block fw-semibold">Phone</span> :{" "}
                {presentUser.mobile}
              </li>
              <li>
                <span className="keys d-inline-block fw-semibold">Role</span> :{" "}
                {presentUser.designation}
              </li>
              {presentUser.status === OFFLINE && (
                <li>
                  <span className="keys d-inline-block fw-semibold">
                    Last Active On
                  </span>{" "}
                  : {new Date(presentUser.lastActive).toLocaleString()}
                </li>
              )}
              <li>
                <span className="fw-bold d-block">Login</span>
                <LoginTimings user={presentUser} todayOnly={true} />
              </li>
              <li>
                <span className="fw-bold d-block">Break Timings</span>
                <BreakTimings user={presentUser} todayOnly={true} />
              </li>
            </ul>
          </div>
          {currentUser.isAdmin && (
            <>
              <div className="w-30 login-timings-data">
                <h3 style={{ backgroundColor: "#055e94" }}>Login Timings</h3>
                <LoginTimings user={presentUser} />
              </div>
              <div className="w-30 break-timings-data">
                <h3 style={{ backgroundColor: "#055e94" }}>Break Timings</h3>
                <BreakTimings user={presentUser} />
              </div>
            </>
          )}
        </div>
        {currentUser.isAdmin && (
          <div className="user-ticket-stats">
            <h3>Ticket Stats</h3>
            <div className="d-flex justify-content-around">
              <p>Pending Tickets: 10</p>
              <p>In Progress Tickets: 10</p>
              <p>Closed Tickets: 10</p>
              <p>Helped Tickets: 10</p>
            </div>
          </div>
        )}
        <div className="admin-pie-chart">
          <div className="pie-chart">
            <Timezones />
          </div>
          <div className="admin-btns pie-chart">
            <h3 className="sub-heading">Active Tickets Data</h3>
            <PieChartComponent
              data={pieChartData}
              totalTickets={tableData.length}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
