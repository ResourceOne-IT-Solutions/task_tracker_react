import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import {
  ProfileImage,
  getData,
  getFormattedTime,
  getFullName,
  statusIndicator,
} from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import {
  BreakInterface,
  UserContext,
  UserModal,
} from "../../../modals/UserModals";
import { TicketModal } from "../../../modals/TicketModals";
import Timezones from "../../../components/features/timezone/Timezones";
import { useNavigate } from "react-router-dom";
import { Severity } from "../../../utils/modal/notification";
import { getBreakTimings } from "./utils";

const UserDashboard = ({ user }: { user: UserModal }) => {
  const navigate = useNavigate();
  const { setCurrentUser, socket, currentUser, alertModal } =
    useUserContext() as UserContext;
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

  const [sendingStatuses, setSendingStatuses] = useState({
    id: "",
    data: { status: "" },
  });
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
    setSendingStatuses({ ...sendingStatuses, id: presentUser._id });
    getData<TicketModal>("tickets/user/" + presentUser._id)
      .then((result) => {
        setTableData(result);
        const pendingTickets = result.filter(
          (ticket) => ticket.status === "Pending",
        ).length;
        const closedTickets = result.filter(
          (ticket) => ticket.status === "Closed",
        ).length;
        const progressTickets = result.filter(
          (ticket) => ticket.status === "In Progress",
        ).length;
        const assigned = result.filter(
          (ticket) => ticket.status === "Assigned",
        ).length;
        const improperTickets = result.filter(
          (ticket) => ticket.status === "Improper Requirment",
        ).length;

        setPieChartData([
          { name: "Pending Tickets", value: pendingTickets },
          { name: "Closed Tickets", value: closedTickets },
          { name: "In Progress Tickets", value: progressTickets },
          { name: "Helped Tickets", value: presentUser.helpedTickets },
          { name: "Assigned Tickets", value: assigned },
          { name: "Improper Requirment", value: improperTickets },
        ]);
        setCurrentUser((data) => ({
          ...data,
          pendingTickets,
          closedTickets,
          progressTickets,
        }));
        setPresentUser((data) => ({
          ...data,
          pendingTickets,
          closedTickets,
          progressTickets,
        }));
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
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
      .catch((err: any) => {
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
  const groupedByStartDate = presentUser.breakTime.reduce((acc: any, obj) => {
    const startDate = obj.startDate;
    if (!acc[startDate]) {
      acc[startDate] = [];
    }
    acc[startDate].push(obj);
    return acc;
  }, {});
  return (
    <>
      <div className="userdashboard">
        <p className="username text-center">
          Welcome to <b>{getFullName(presentUser)}</b> Dashboard
        </p>
        <div className="usernavbar">
          <div className="nav_img_container">
            <ProfileImage filename={presentUser.profileImageUrl} />
          </div>
          <p> {getFullName(presentUser)} </p>
          <span>{statusIndicator(presentUser.status)}</span>
          <p>({presentUser.userId})</p>
        </div>
        <div className="userdetails">
          <div className="userleft">
            <ul>
              <b>Employee Details</b>
              <li>Employee ID: {presentUser.empId}</li>
              <li>Employee Name: {getFullName(presentUser)}</li>
              <li>Email : {presentUser.email}</li>
              <li>Gender: {presentUser.gender}</li>
              <li>Dob : {dateConversion(presentUser.dob)}</li>
              <li>Phone : {presentUser.mobile}</li>
              <li>Role : {presentUser.designation}</li>
              <span className="fw-bold d-block">Login Timings</span>
              {presentUser.loginTimings.map((logtime) => {
                if (
                  new Date(logtime.inTime).toLocaleDateString() ==
                  new Date().toLocaleDateString()
                ) {
                  return (
                    <li key={logtime._id}>
                      <span className="fw-semibold">
                        {new Date(logtime.date).toLocaleDateString()}
                      </span>{" "}
                      Login - {getFormattedTime(logtime.inTime)} - Logout -{" "}
                      {logtime.outTime
                        ? getFormattedTime(logtime.outTime)
                        : "---"}{" "}
                    </li>
                  );
                }
              })}
              <span className="fw-bold d-block">Break Timings</span>
              {Object.entries(groupedByStartDate).map((key, i) => {
                const arr: any = key[1];
                if (
                  new Date(key[0]).toLocaleDateString() ==
                  new Date().toLocaleDateString()
                ) {
                  return (
                    <React.Fragment key={i}>
                      <li className="fw-semibold">
                        {key[0]} : Total={">"}
                        {getBreakTimings(
                          arr.reduce(
                            (acc: any, obj: any) => acc + obj.duration,
                            0,
                          ),
                        )}
                      </li>
                      <li>
                        {arr.map((brtime: BreakInterface, i: number) => {
                          return (
                            <span className="d-block" key={i}>
                              <span>{brtime.status} : </span>{" "}
                              {getFormattedTime(brtime.startTime)} ---{" "}
                              {getFormattedTime(brtime.endTime)}
                              {brtime.duration ? (
                                <>
                                  - Duration: {getBreakTimings(brtime.duration)}
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                          );
                        })}
                      </li>
                    </React.Fragment>
                  );
                }
              })}
            </ul>
          </div>
          <div className="userright w-50">
            <PieChartComponent
              data={pieChartData}
              totalTickets={tableData.length}
            />
            <Timezones />
          </div>
        </div>
      </div>
      {currentUser._id === presentUser._id && (
        <div className="chat-link">
          <div className="user-btns">
            <Button onClick={handleChatRequest}>Request User to Chat</Button>
            <Button
              onClick={() => navigate("/dashboard/userdashboardtickets")}
              variant="primary"
            >
              My Tickets
            </Button>
            <Button
              onClick={() => navigate("/dashboard/helpedtickets")}
              variant="primary"
            >
              Helped Tickets
            </Button>
          </div>
          <Modal
            show={showChatRequestPopup}
            onHide={() => setShowChatRequestPopup(false)}
          >
            <Modal.Header closeButton>
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
                                  !item.isAdmin && item._id !== presentUser._id,
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
        </div>
      )}
    </>
  );
};

export default UserDashboard;
