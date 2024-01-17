import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import httpMethods from "../../../api/Service";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import {
  calculateWorkingFrom,
  getData,
  statusIndicator,
} from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import UpdateTicket from "../../../utils/modal/UpdateUserModal";
import { setCookie } from "../../../utils/utils";
import { useNavigate } from "react-router";
import { GreenDot, OrangeDot, RedDot } from "../../../utils/Dots/Dots";
import { Status, UserContext, UserModal } from "../../../modals/UserModals";
import { TicketModal } from "../../../modals/TicketModals";

const UserDashboard = ({ user }: { user: UserModal }) => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { setCurrentUser, setIsLoggedIn, socket, currentUser } =
    userContext as UserContext;
  const [tableData, setTableData] = useState<TicketModal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentUser, setPresentUser] = useState<UserModal>(user);
  const joinDate = presentUser.joinedDate;
  const workingDuration = calculateWorkingFrom(joinDate);
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
          (ticket) => ticket.status === "Resolved",
        ).length;
        const progressTickets = result.filter(
          (ticket) => ticket.status === "In Progress",
        ).length;
        const assigned = result.filter(
          (ticket) => ticket.status === "Assigned",
        ).length;

        setPieChartData([
          { name: "Pending Tickets", value: pendingTickets },
          { name: "Resolved Tickets", value: resolvedTickets },
          { name: "In Progress Tickets", value: progressTickets },
          { name: "Helped Tickets", value: presentUser.helpedTickets },
          { name: "Assigned Tickets", value: assigned },
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
  const [showUpdateModal, setShowUpdateModal] = useState<{
    show: boolean;
    ticketData: TicketModal;
  }>({
    show: false,
    ticketData: {} as TicketModal,
  });
  const updateTableData = (updatedTicket: TicketModal) => {
    setTableData((prevTableData) =>
      prevTableData.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket,
      ),
    );
  };
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
  const handleRequest = (items: TicketModal) => {
    navigate("/tickets");
    socket.emit("requestTickets", {
      client: { id: items.client.id, name: items.client.name },
      sender: { id: currentUser._id, name: currentUser.firstName },
    });
  };
  const handleChatRequest = () => {
    setShowChatRequestPopup(true);
  };
  const handleSubmitRequest = () => {
    let exactUserid = "";
    let exactUsername = "";
    userData.forEach((item: UserModal) => {
      if (item.firstName == selected) {
        exactUserid = item._id;
        exactUsername = item.firstName;
      }
    });
    socket.emit("requestChat", {
      user: { name: currentUser.firstName, id: currentUser._id },
      opponent: { name: exactUsername, id: exactUserid },
    });
  };
  return (
    <>
      <div className="userdashboard">
        {/* <div className="user-nav-header">
          <div>
            <Dropdown onSelect={handleSelectStatus}>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                {presentUser.status ? (
                  <span>
                    {presentUser.status} {colors[presentUser.status]}
                  </span>
                ) : (
                  "Select a User"
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {statuses.map((stat, idx) => {
                  return (
                    <Dropdown.Item key={idx} eventKey={stat}>
                      <b>
                        {colors[stat]} {stat}
                      </b>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Button variant="danger" onClick={handleLogoutClick}>
              Logout
            </Button>
          </div>
        </div> */}
        <p className="username">
          Welcome to {presentUser.firstName} Dashboard (
          {statusIndicator(presentUser.status)})
        </p>
        <div className="usernavbar">
          <div className="nav_img_container">
            <img src={`${presentUser.profileImageUrl}`} />
          </div>
          <p> {`${presentUser.firstName} ${presentUser.lastName}`} </p>
          <span>{statusIndicator(presentUser.status)}</span>
          <p>({presentUser.userId})</p>
        </div>
        <div className="userdetails">
          <div className="userleft">
            <p>Profile Image</p>
            <img src={`${presentUser.profileImageUrl}`} />
            <div className="employee-details">
              <ul>
                <li>Employee Details</li>
                <li>Emp ID: {presentUser.empId}</li>
                <li>First Name : {presentUser.firstName}</li>
                <li>Last Name : {presentUser.lastName}</li>
                <li>Email : {presentUser.email}</li>
                <li>Dob : {dateConversion(presentUser.dob)}</li>
                <li>Phone : {presentUser.mobile}</li>
                <li>Role : {presentUser.designation}</li>
              </ul>
            </div>
          </div>
          <div className="usercenter">
            <div className="emprole">
              <p>Role</p>
              <p>{presentUser.designation}</p>
              <p>TEAM</p>
              <p>React Community</p>
            </div>
            <div className="stats">
              <ul>
                <li>Stats</li>
                <li>Today Tickets: {presentUser.totalTickets}</li>
                <li>Progress Tickets: {presentUser.progressTickets}</li>
                <li>Pending: {presentUser.pendingTickets}</li>
                <li>Resolved: {presentUser.helpedTickets}</li>
                <li>Helped Tickets: {presentUser.helpedTickets}</li>
                <li>Total Tickets : {presentUser.totalTickets}</li>
              </ul>
            </div>
          </div>
          <div className="userright">
            <div className="joiningdate">
              <div>
                <p>Joined On</p>
                <p>{dateConversion(presentUser.joinedDate)}</p>
                <p>Working from</p>
                <p>
                  {workingDuration.years} years {workingDuration.months} Months{" "}
                </p>
                <p>{workingDuration.days} Days</p>
              </div>
              <div>
                <PieChartComponent
                  data={pieChartData}
                  totalTickets={tableData.length}
                />
              </div>
            </div>
            <div className="lastlogindata">
              <ul>
                <li>Last LoggedIn Data</li>
                <li>Browser : Google Chrome</li>
                <li>IP Address: 192.168.10.29</li>
                <li>Login Time: 1/5/2024, 10:08:50 AM</li>
                <li>Location: {presentUser.address}</li>
                <li>
                  Map: <a href="_blank">Click here </a>(Approximate location)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {selected ? selected : "Select a User"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      style={{ maxHeight: "180px", overflowY: "auto" }}
                    >
                      {userData !== null
                        ? userData.map((item: any, index: any) => {
                            return (
                              <Dropdown.Item
                                key={index}
                                eventKey={item.firstName}
                              >
                                {item.firstName}
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
      <table>
        <thead>
          <tr>
            <th>Consultant</th>
            <th>User</th>
            <th>Technology</th>
            <th>Received Date</th>
            <th>Assigned Date</th>
            <th>Description</th>
            <th>Comments</th>
            <th>Closed Date</th>
            <th>Status</th>
            <th>
              <Button variant="danger">Ticket Raise</Button>
            </th>
            <th>Request Tickets</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={11}>
                <h1>Data Loading...</h1>
              </td>
            </tr>
          ) : (
            <>
              {tableData.length ? (
                <>
                  {tableData.map((items: TicketModal, index: any) => {
                    return (
                      <tr key={index}>
                        <td>{items.client.name}</td>
                        <td>{items.user.name}</td>
                        <td>{items.technology}</td>
                        <td>{dateConversion(items.receivedDate)}</td>
                        <td>
                          {items.assignedDate
                            ? dateConversion(items.assignedDate)
                            : "Not assigned"}
                        </td>
                        <td>{items.description}</td>
                        <td>{items.comments}</td>
                        <td>{dateConversion(items.closedDate)}</td>
                        <td>{items.status}</td>
                        <td>
                          <Button
                            variant="success"
                            onClick={() =>
                              setShowUpdateModal({
                                show: true,
                                ticketData: items,
                              })
                            }
                          >
                            Update Ticket
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant={"dark"}
                            onClick={() => handleRequest(items)}
                          >
                            Request Ticket
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <tr>
                  <td colSpan={11}>
                    <h1>NO Data</h1>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
      <UpdateTicket
        show={showUpdateModal.show}
        onHide={() =>
          setShowUpdateModal({ show: false, ticketData: {} as TicketModal })
        }
        ticketData={showUpdateModal.ticketData}
        updateTableData={updateTableData}
      />
    </>
  );
};

export default UserDashboard;
