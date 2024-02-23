import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../components/Authcontext/AuthContext";

import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../../utils/modal/ReusableModal";
import {
  ProfileImage,
  getFullName,
  statusIndicator,
} from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import { Status, UserContext, UserModal } from "../../../modals/UserModals";
import MessageAllUsersModal from "../../../utils/modal/MessageAllUsersModal";
import {
  AVAILABLE,
  BREAK,
  OFFLINE,
  ON_TICKET,
  SLEEP,
  STATUS_INDICATOR_STYLES,
  STATUS_TYPES,
  TICKET_STATUS_TYPES,
  USER_STATUSES,
} from "../../../utils/Constants";
import Timezones from "../../../components/features/timezone/Timezones";
import { TicketStatsInterface } from "../../../modals/TicketModals";
import TaskTable, { TableHeaders } from "../../../utils/table/Table";

import "./AdminDashboard.css";
// icons
import avalable from "../../../assets/images/Available.png";
import Offline from "../../../assets/images/ofline.png";
import Brack from "../../../assets/images/break.png";
import OnTrack from "../../../assets/images/OnWork.png";
import sleep from "../../../assets/images/sleep.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser, socket } = userContext as UserContext;
  const [selectedRangeStatus, setSelectedRangeStatus] = useState<Status>("");
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
    sleepUsers: 0,
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
    .on("dashboardStats", ({ ticketStats, pendingTickets }) => {
      const ticketData = (status: string) => {
        return (
          ticketStats.find((v: TicketStatsInterface) => v.status === status)
            ?.count || 0
        );
      };
      const totalTickets = ticketStats.reduce(
        (a: number, c: TicketStatsInterface) => a + c.count,
        0,
      );
      const pendingTicketsData = (status: string) => {
        return (
          pendingTickets.find((v: TicketStatsInterface) => v.status === status)
            ?.count || 0
        );
      };
      const totalPending = pendingTickets.reduce(
        (a: number, c: TicketStatsInterface) => a + c.count,
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
    const sleep = usersData.filter((user) => user.status == "Sleep").length;
    setUsersStatuses({
      totalUsers,
      availableUsers,
      breakUsers,
      offlineUsers,
      onTicketUsers: onTicket,
      sleepUsers: sleep,
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
  const handleRangeClick = (status: Status) => {
    setModalname("USERS");
    setSelectedRangeStatus(status);
    setModalProps({
      title: `${status} Users`,
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const gotoDashboards = (user: UserModal) => {
    navigate(`/user/${user._id}`, { state: user });
  };
  const rangeUserHeaders: TableHeaders<UserModal>[] = [
    {
      title: "Name",
      key: "firstName",
      tdFormat: (user) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Click here to view User details</Tooltip>}
        >
          <div onClick={() => gotoDashboards(user)}>{getFullName(user)}</div>
        </OverlayTrigger>
      ),
    },
    { title: "Role", key: "designation" },
    {
      title: "Profile Image",
      key: "",
      tdFormat: (user) => (
        <div
          style={{
            width: "100px",
            height: "30px",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span style={STATUS_INDICATOR_STYLES}>
            {statusIndicator(user.status)}
          </span>
          <ProfileImage
            className="w-100 h-100"
            filename={user.profileImageUrl}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="d-flex">
        <div className="dashboard-content">
          <h1>DASHBOARD</h1>
          <div className="sub-ranges">
            <h3 className="text-primary">Users Data: </h3>
            <div className="main-container text-center">
              <div className="show-range row">
                <div className="col-12 col-md-4 mb-4">
                  <Button className="btn user-details icon-avaliable col-8">
                    <div className="d-flex p-2 px-4">
                      <img className="user-icons" src={avalable} />

                      <h4>
                        <span>{`${usersStatuses.availableUsers}/${usersStatuses.totalUsers}`}</span>
                        Available
                      </h4>
                    </div>
                    <p
                      className="m-0"
                      onClick={() => handleRangeClick(AVAILABLE)}
                    >
                      View Details
                      <i className="fa fa-arrow-circle-o-right"></i>
                    </p>
                  </Button>
                </div>
                <div className="col-12 col-md-4 mb-4">
                  <Button className="btn user-details icon-offline col-8">
                    <div className="d-flex p-2 px-4">
                      <img className="user-icons" src={Offline} />

                      <h4>
                        <span>
                          {" "}
                          {`${usersStatuses.offlineUsers}/${usersStatuses.totalUsers}`}
                        </span>
                        Offline
                      </h4>
                    </div>
                    <p
                      className="m-0"
                      onClick={() => handleRangeClick(OFFLINE)}
                    >
                      View Details
                      <i className="fa fa-arrow-circle-o-right"></i>
                    </p>
                  </Button>
                </div>
                <div className="col-12 col-md-4 mb-4">
                  <Button className="btn user-details icon-break col-8 ">
                    <div className="d-flex p-2 px-4">
                      <img className="user-icons" src={Brack} />
                      <h4>
                        <span>
                          {" "}
                          {`${usersStatuses.breakUsers}/${usersStatuses.totalUsers}`}
                        </span>
                        Break
                      </h4>
                    </div>
                    <p className="m-0" onClick={() => handleRangeClick(BREAK)}>
                      View Details
                      <i className="fa fa-arrow-circle-o-right"></i>
                    </p>
                  </Button>
                </div>
                <div className="col-12 col-md-4 mb-4">
                  <Button className="btn user-details icon-onTrack col-8">
                    <div className="d-flex p-2 px-4">
                      <img className="user-icons" src={OnTrack} />

                      <h4>
                        <span>
                          {" "}
                          {`${usersStatuses.onTicketUsers}/${usersStatuses.totalUsers}`}
                        </span>
                        On Ticket
                      </h4>
                    </div>
                    <p
                      className="m-0"
                      onClick={() => handleRangeClick(ON_TICKET)}
                    >
                      View Details
                      <i className="fa fa-arrow-circle-o-right"></i>
                    </p>
                  </Button>
                </div>
                <div className="col-12 col-md-4 mb-4">
                  <Button className="btn user-details icon-sleep col-8">
                    <div className="d-flex p-2 px-4">
                      <img className="user-icons" src={sleep} />

                      <h4>
                        <span>
                          {" "}
                          {`${usersStatuses.sleepUsers}/${usersStatuses.totalUsers}`}
                        </span>
                        Sleep
                      </h4>
                    </div>
                    <p className="m-0" onClick={() => handleRangeClick(SLEEP)}>
                      View Details
                      <i className="fa fa-arrow-circle-o-right"></i>
                    </p>
                  </Button>
                </div>
              </div>

              {/* <PieChartComponent
                data={usersPieChartData}
                totalTickets={usersData.length}
                name={USER_STATUSES}
              /> */}
            </div>
          </div>
          <div className="admin-pie-chart">
            <div className="pie-chart">
              <div>
                <h4 style={{ textAlign: "center" }}>Timezones : </h4>
                <Timezones />
              </div>
            </div>
            <div className="admin-btns pie-chart">
              <h3 className="text-primary">Today Tickets Data: </h3>
              <PieChartComponent
                data={pendingticketPieChartData}
                totalTickets={totalpendingTickets}
                name="pending tickets"
              />
            </div>
          </div>
          <div className="ranges"></div>
        </div>
        <div className="admin-details">
          <div className="heading-pic">
            <ProfileImage
              className="rounded-circle"
              filename={currentUser.profileImageUrl}
            />
            <h4>
              <b>{getFullName(currentUser)}</b>
              <span className="active-not">
                {" "}
                {statusIndicator(currentUser.status)}
              </span>{" "}
              <span>{`(${currentUser.userId})`}</span>
            </h4>
          </div>
          <div className="all-details">
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
        </div>
      </div>
      <div className="d-flex flex-direction-row gap-5 m-3">
        <Button variant="danger" onClick={handleAdminBroadCastMessage}>
          Send Message to All
        </Button>
        <Button onClick={() => displayTable("users")} variant="info">
          Show Users
        </Button>
        <Button onClick={() => displayTable("clients")} variant="success">
          Show Clients
        </Button>
        <Button variant="secondary" onClick={() => displayTable("tickets")}>
          Today Tickets
        </Button>
      </div>
      {showModal && modalName == "messageModal" && (
        <ReusableModal vals={modalProps}>
          <MessageAllUsersModal setShowModal={setShowModal} />
        </ReusableModal>
      )}
      {showModal && modalName === "USERS" && (
        <ReusableModal vals={modalProps}>
          <TaskTable<UserModal>
            pagination
            headers={rangeUserHeaders}
            tableData={usersData.filter(
              (tkt) => tkt.status === selectedRangeStatus,
            )}
            loading={false}
          />
        </ReusableModal>
      )}
    </div>
  );
};

export default AdminDashboard;
