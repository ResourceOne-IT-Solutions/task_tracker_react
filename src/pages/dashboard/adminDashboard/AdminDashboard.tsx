import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import httpMethods from "../../../api/Service";
import { useUserContext } from "../../../components/Authcontext/AuthContext";

import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../../utils/modal/ReusableModal";
import {
  ProfileImage,
  getFullName,
  statusIndicator,
} from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import { TicketModal } from "../../../modals/TicketModals";
import { UserContext, UserModal } from "../../../modals/UserModals";
import MessageAllUsersModal from "../../../utils/modal/MessageAllUsersModal";
import { TICKET_STATUS_TYPES, USER_STATUSES } from "../../../utils/Constants";
import Timezones from "../../../components/features/timezone/Timezones";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser, socket } = userContext as UserContext;
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [totalpendingTickets, setTotalPendingTickets] = useState<number>(0);
  const [usersData, setUsersData] = useState<UserModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [ticketPieChartData, setTicketPieChartData] = useState([
    { name: "NotAssigned Tickets", value: 0 },
    { name: "Assigned Tickets", value: 0 },
    { name: "In Progress Tickets", value: 0 },
    { name: "Pending Tickets", value: 0 },
    { name: "Closed Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);
  const [pendingticketPieChartData, setPendingTicketPieChartData] = useState([
    { name: "NotAssigned Tickets", value: 0 },
    { name: "Assigned Tickets", value: 0 },
    { name: "In Progress Tickets", value: 0 },
    { name: "Pending Tickets", value: 0 },
    { name: "Closed Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);
  const [usersPieChartData, setUsersPieChartData] = useState([
    { name: "Available", value: 0 },
    { name: "Offline", value: 0 },
    { name: "Break", value: 0 },
    { name: "On Ticket", value: 0 },
  ]);

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
  socket
    .off("dashboardStats")
    .on("dashboardStats", ({ ticketStats, userStats, pendingTickets }) => {
      const ticketData = (status: string) => {
        return ticketStats.find((v: any) => v.status === status)?.count || 0;
      };
      const totalTickets = ticketStats.reduce(
        (a: number, c: any) => a + c.count,
        0,
      );
      const pendingTicketsData = (status: string) => {
        return pendingTickets.find((v: any) => v.status === status)?.count || 0;
      };
      const totalPending = pendingTickets.reduce(
        (a: number, c: any) => a + c.count,
        0,
      );
      setTotalTickets(totalTickets);
      setTotalPendingTickets(totalPending);
      setTicketPieChartData([
        {
          name: "NotAssigned Tickets",
          value: ticketData(TICKET_STATUS_TYPES.NOT_ASSIGNED),
        },
        {
          name: "Assigned Tickets",
          value: ticketData(TICKET_STATUS_TYPES.ASSIGNED),
        },
        {
          name: "In Progress Tickets",
          value: ticketData(TICKET_STATUS_TYPES.IN_PROGRESS),
        },
        {
          name: "Pending Tickets",
          value: ticketData(TICKET_STATUS_TYPES.PENDING),
        },
        {
          name: "Closed Tickets",
          value: ticketData(TICKET_STATUS_TYPES.CLOSED),
        },
        {
          name: "Improper Requirment",
          value: ticketData(TICKET_STATUS_TYPES.IMPROPER_REQUIRMENT),
        },
      ]);
      setPendingTicketPieChartData([
        {
          name: "NotAssigned Tickets",
          value: pendingTicketsData(TICKET_STATUS_TYPES.NOT_ASSIGNED),
        },
        {
          name: "Assigned Tickets",
          value: pendingTicketsData(TICKET_STATUS_TYPES.ASSIGNED),
        },
        {
          name: "In Progress Tickets",
          value: pendingTicketsData(TICKET_STATUS_TYPES.IN_PROGRESS),
        },
        {
          name: "Pending Tickets",
          value: pendingTicketsData(TICKET_STATUS_TYPES.PENDING),
        },
        {
          name: "Closed Tickets",
          value: pendingTicketsData(TICKET_STATUS_TYPES.CLOSED),
        },
        {
          name: "Improper Requirment",
          value: pendingTicketsData(TICKET_STATUS_TYPES.IMPROPER_REQUIRMENT),
        },
      ]);
    });
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
    setUsersPieChartData([
      { name: "Available", value: availableUsers },
      { name: "Offline", value: offlineUsers },
      { name: "Break", value: breakUsers },
      { name: "On Ticket", value: onTicket },
    ]);
  }, [usersData]);
  useEffect(() => {
    socket.emit("newUser", { userId: currentUser._id });
    socket.emit("dashboardStats");
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
            <ProfileImage
              className="rounded-circle"
              filename={currentUser.profileImageUrl}
            />
            <h4>
              {getFullName(currentUser)}
              <span className="active-not">
                {" "}
                {statusIndicator(currentUser.status)}
              </span>{" "}
              <span>{`(${currentUser.userId})`}</span>
            </h4>
          </div>
          <div className="all-details">
            <div className="pf">
              <h6>Profile Image</h6>
              <ProfileImage filename={currentUser.profileImageUrl} />
            </div>
            <div>
              <h6>Admin Details</h6>
              <ul>
                <li>EmpId : {currentUser.empId}</li>
                <li>FirstName : {currentUser.firstName}</li>
                <li>LastName : {currentUser.lastName}</li>
                <li>Email : {currentUser.email}</li>
                <li>Mobile : {currentUser.mobile}</li>
                <li>Designation : {currentUser.designation}</li>
              </ul>
            </div>
          </div>
          <Timezones />
        </div>
        <div className="pie-chart">
          <h3 className="text-primary">Pending Tickets Data: </h3>
          <PieChartComponent
            data={pendingticketPieChartData}
            totalTickets={totalpendingTickets}
          />
        </div>
      </div>
      <div className="ranges">
        <div className="sub-ranges">
          <h3 className="text-primary">Users Data: </h3>
          <div className="main-container text-center">
            <PieChartComponent
              data={usersPieChartData}
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
                  readOnly
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
                  readOnly
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
                  readOnly
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
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div className="admin-btns text-center">
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
              Today Tickets
            </Button>
          </div>
        </div>
      </div>
      <div className="pending-tickets-chart">
        <h3 className="text-primary">Total Tickets Data: </h3>
        <PieChartComponent
          data={ticketPieChartData}
          totalTickets={totalTickets}
        />
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
