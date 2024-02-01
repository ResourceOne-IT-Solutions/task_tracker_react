import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import httpMethods from "../../../api/Service";
import { useUserContext } from "../../../components/Authcontext/AuthContext";

import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../../utils/modal/ReusableModal";
import { getFullName, statusIndicator } from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import { TicketModal } from "../../../modals/TicketModals";
import { UserContext, UserModal } from "../../../modals/UserModals";
import MessageAllUsersModal from "../../../utils/modal/MessageAllUsersModal";
import { USER_STATUSES } from "../../../utils/Constants";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, socket } = userContext as UserContext;
  const [usersData, setUsersData] = useState<UserModal[]>([]);
  const [ticketsData, setTicketsData] = useState<TicketModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [pieChartData, setPieChartData] = useState([
    { name: "NotAssigned Tickets", value: 0 },
    { name: "Assigned Tickets", value: 0 },
    { name: "In Progress Tickets", value: 0 },
    { name: "Pending Tickets", value: 0 },
    { name: "Resolved Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);
  const [pieChartStatuses, setPieChartStatuses] = useState([
    { name: "Available", value: 0 },
    { name: "Offline", value: 0 },
    { name: "Break", value: 0 },
    { name: "On Ticket", value: 0 },
  ]);

  const [sendingStatuses, setSendingStatuses] = useState({
    id: "",
    data: { status: "" },
  });

  const [usersStatuses, setUsersStatuses] = useState({
    totalUsers: 0,
    availableUsers: 0,
    breakUsers: 0,
    offlineUsers: 0,
    onTicketUsers: 0,
  });
  socket.off("newUser").on("newUser", ({ userPayload }) => {
    setUsersData(userPayload);
  });
  const displayTable = (name: string) => {
    if (name == "users") {
      navigate("/dashboard/usersTable");
    } else if (name == "clients") {
      navigate("/dashboard/clientsTable");
    } else if (name == "tickets") {
      navigate("/dashboard/ticketsTable");
    }
  };
  useEffect(() => {
    setSendingStatuses({ ...sendingStatuses, id: currentUser._id });
  }, []);
  useEffect(() => {
    httpMethods
      .get<UserModal[]>("/users")
      .then((result) => {
        setUsersData(result);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);
  useEffect(() => {
    const totalUsers = usersData.length;
    const availableUsers = usersData.filter(
      (user) => user.status == "Available",
    ).length;
    const offlineUsers = usersData.filter(
      (user) => user.status == "Offline",
    ).length;
    const breakUsers = usersData.filter(
      (user) => user.status == "Break",
    ).length;
    const onTicket = usersData.filter(
      (user) => user.status == "On Ticket",
    ).length;
    setUsersStatuses({
      totalUsers,
      availableUsers,
      breakUsers,
      offlineUsers,
      onTicketUsers: onTicket,
    });
    setPieChartStatuses([
      { name: "Available", value: availableUsers },
      { name: "Offline", value: offlineUsers },
      { name: "Break", value: breakUsers },
      { name: "On Ticket", value: onTicket },
    ]);
  }, [usersData]);
  useEffect(() => {
    httpMethods.get<TicketModal[]>("/tickets").then((result) => {
      setTicketsData(result);
      const notAssignedTickets = result.filter(
        (ticket) => ticket.status === "Not Assigned",
      ).length;
      const assignedTickets = result.filter(
        (ticket) => ticket.status === "Assigned",
      ).length;
      const progressTickets = result.filter(
        (ticket) => ticket.status === "In Progress",
      ).length;
      const pendingTickets = result.filter(
        (ticket) => ticket.status === "Pending",
      ).length;
      const resolvedTickets = result.filter(
        (ticket) => ticket.status === "Resolved",
      ).length;
      const improperTickets = result.filter(
        (ticket) => ticket.status === "Improper Requirment",
      ).length;

      setPieChartData([
        { name: "NotAssigned Tickets", value: notAssignedTickets },
        { name: "Assigned Tickets", value: assignedTickets },
        { name: "In Progress Tickets", value: progressTickets },
        { name: "Pending Tickets", value: pendingTickets },
        { name: "Resolved Tickets", value: resolvedTickets },
        { name: "Improper Requirment", value: improperTickets },
      ]);
      setCurrentUser((data) => ({
        ...data,
        pendingTickets,
        resolvedTickets,
        progressTickets,
      }));
    });
  }, []);
  const handleAdminBroadCastMessage = () => {
    setModalname("messageModal");
    setModalProps({
      title: "Send Message To All Users",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  return (
    <div>
      <div className="admin-pie-chart">
        <div className="admin-details">
          <div className="heading-pic">
            <img src={`${currentUser.profileImageUrl}`} alt="img" />
            <h4>
              {getFullName(currentUser)}
              <span className="active-not">
                {statusIndicator(currentUser.status)}
              </span>{" "}
              <span>{`(${currentUser.userId})`}</span>
            </h4>
          </div>
          <div className="all-details">
            <div className="pf">
              <h6>Profile Image</h6>
              <img src={`${currentUser.profileImageUrl}`} alt="image" />
            </div>
            <div>
              <h6>Admin Details</h6>
              <ul>
                <li>EmpId : {currentUser.empId}</li>
                <li>FirstName : {currentUser.firstName}</li>
                <li>LastName : {currentUser.lastName}</li>
                <li>Email : {currentUser.email}</li>
                <li>Mobile : {currentUser.mobile}</li>
                <li>Email : {currentUser.email}</li>
                <li>Designation : {currentUser.designation}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pie-chart">
          <PieChartComponent
            data={pieChartData}
            totalTickets={ticketsData.length}
          />
        </div>
      </div>
      <div className="ranges">
        <div className="sub-ranges">
          <div className="main-container">
            <PieChartComponent
              data={pieChartStatuses}
              totalTickets={usersData.length}
              name={USER_STATUSES}
            />
            <div className="show-range">
              <div>
                <label htmlFor="available" className="fw-bold">
                  Available{"----"}
                  <span>
                    {`${usersStatuses.availableUsers}/${usersStatuses.totalUsers}`}
                  </span>
                </label>
                <input
                  type="range"
                  name="available"
                  id="available"
                  max={usersStatuses.totalUsers}
                  value={usersStatuses.availableUsers}
                />
              </div>
              <div>
                <label htmlFor="offline" className="fw-bold">
                  Offline{"----"}
                  <span>
                    {`${usersStatuses.offlineUsers}/${usersStatuses.totalUsers}`}
                  </span>
                </label>
                <input
                  type="range"
                  name="offline"
                  id="offline"
                  max={usersStatuses.totalUsers}
                  value={usersStatuses.offlineUsers}
                />
              </div>
              <div>
                <label htmlFor="break" className="fw-bold">
                  Break{"----"}
                  <span>
                    {`${usersStatuses.breakUsers}/${usersStatuses.totalUsers}`}
                  </span>
                </label>
                <input
                  type="range"
                  name="break"
                  id="break"
                  max={usersStatuses.totalUsers}
                  value={usersStatuses.breakUsers}
                />
              </div>
              <div>
                <label htmlFor="break" className="fw-bold">
                  On Ticket{"----"}
                  <span>
                    {`${usersStatuses.onTicketUsers}/${usersStatuses.totalUsers}`}
                  </span>
                </label>
                <input
                  type="range"
                  name="onticket"
                  id="onticket"
                  max={usersStatuses.totalUsers}
                  value={usersStatuses.onTicketUsers}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="admin-btns">
          <div>
            <Button variant="danger" onClick={handleAdminBroadCastMessage}>
              Send Message to All
            </Button>
            <Button onClick={() => displayTable("users")} variant="info">
              Show Users
            </Button>
          </div>
          <div>
            <Button onClick={() => displayTable("clients")} variant="success">
              Show Clients
            </Button>
            <Button variant="secondary" onClick={() => displayTable("tickets")}>
              Show Tickets
            </Button>
          </div>
        </div>
      </div>
      {showModal && modalName == "messageModal" && (
        <ReusableModal vals={modalProps}>
          <MessageAllUsersModal setShowModal={setShowModal} />
        </ReusableModal>
      )}
    </div>
  );
};

export default AdminDashboard;
