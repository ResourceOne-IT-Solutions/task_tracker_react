import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import httpMethods from "../../../api/Service";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { getData, getFullName, statusIndicator } from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import { UserContext, UserModal } from "../../../modals/UserModals";
import { TicketModal } from "../../../modals/TicketModals";
import Timezones from "../../../components/features/timezone/Timezones";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({ user }: { user: UserModal }) => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { setCurrentUser, socket, currentUser } = userContext as UserContext;
  const [tableData, setTableData] = useState<TicketModal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentUser, setPresentUser] = useState<UserModal>(user);
  const dateConversion = (date: Date) => new Date(date).toLocaleDateString();

  const [pieChartData, setPieChartData] = useState([
    { name: "In Progress Tickets", value: 0 },
    { name: "ResolvedTickets", value: 0 },
    { name: "Helped Tickets", value: presentUser.helpedTickets },
    { name: "Pending Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);

  const [sendingStatuses, setSendingStatuses] = useState({
    id: "",
    data: { status: "" },
  });
  const [showChatRequestPopup, setShowChatRequestPopup] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    setIsLoading(true);
    httpMethods
      .get<TicketModal[]>("/users/tickets/" + presentUser._id)
      .then((result) => {
        setTableData(result);

        const pendingTickets = result.filter(
          (ticket) => ticket.status === "Pending",
        ).length;
        const resolvedTickets = result.filter(
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
          { name: "Resolved Tickets", value: resolvedTickets },
          { name: "In Progress Tickets", value: progressTickets },
          { name: "Helped Tickets", value: presentUser.helpedTickets },
          { name: "Assigned Tickets", value: assigned },
          { name: "Improper Requirment", value: improperTickets },
        ]);
        setCurrentUser((data) => ({
          ...data,
          pendingTickets,
          resolvedTickets,
          progressTickets,
        }));
        setPresentUser((data) => ({
          ...data,
          pendingTickets,
          resolvedTickets,
          progressTickets,
        }));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);
  useEffect(() => {
    setIsLoading(true);
    httpMethods
      .get<TicketModal[]>("/users/tickets/" + presentUser._id)
      .then((result) => {
        setTableData(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);
  useEffect(() => {
    setSendingStatuses({ ...sendingStatuses, id: presentUser._id });
  }, []);
  useEffect(() => {
    getData<UserModal>("users")
      .then((res: any) => {
        setUserData(res);
      })
      .catch((err) => err);
  }, []);
  useEffect(() => {
    setPresentUser(user);
  }, [user]);
  const handleSelect = (item: any) => {
    setSelected(item);
  };
  const handleChatRequest = () => {
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
    alert("Chat Request sent");
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
        <p className="username">
          Welcome to <b>{getFullName(presentUser)}</b> Dashboard
        </p>
        <div className="usernavbar">
          <div className="nav_img_container">
            <img src={`${presentUser.profileImageUrl}`} />
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
                return (
                  <li key={logtime._id}>
                    <span className="fw-semibold">
                      {new Date(logtime.date).toLocaleDateString()}
                    </span>{" "}
                    Login - {new Date(logtime.inTime).toLocaleTimeString()}{" "}
                    Logout - {new Date(logtime.outTime).toLocaleTimeString()}{" "}
                  </li>
                );
              })}
              <span className="fw-bold d-block">Break Timings</span>
              {Object.entries(groupedByStartDate).map((key, i) => {
                const arr: any = key[1];
                return (
                  <React.Fragment key={i}>
                    <li className="fw-semibold">{key[0]}</li>
                    <li>
                      {arr.map((brtime: any, i: number) => {
                        return (
                          <span className="d-block" key={i}>
                            startTime {brtime.startTime} endTime{" "}
                            {brtime.endTime}
                          </span>
                        );
                      })}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
          <div className="userright w-50">
            <PieChartComponent
              data={pieChartData}
              totalTickets={tableData.length}
            />
            <Timezones />
            <Button
              onClick={() => navigate("/dashboard/userdashboardtickets")}
              variant="primary"
              className="mt-3"
            >
              My Tickets
            </Button>
          </div>
        </div>
      </div>
      {currentUser._id === presentUser._id && (
        <div className="chat-link">
          <Button onClick={() => handleChatRequest()}>
            Request User to Chat
          </Button>
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
                              .map((item: any, index: any) => {
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
