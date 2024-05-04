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
  BREAKFAST_BREAK,
  LUNCH_BREAK,
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
import Avalable from "../../../assets/images/Available.png";
import Offline from "../../../assets/images/ofline.png";
import Break from "../../../assets/images/break.png";
import OnTicket from "../../../assets/images/OnWork.png";
import Sleep from "../../../assets/images/sleep.png";
import { StatusCard } from "../../../utils/UtilComponents";

export const statusCardTypes: { src: string; type: Status; id: number }[] = [
  { src: Avalable, type: AVAILABLE, id: 1 },
  { src: Offline, type: OFFLINE, id: 2 },
  { src: Break, type: BREAK, id: 3 },
  { src: OnTicket, type: ON_TICKET, id: 4 },
  { src: Sleep, type: SLEEP, id: 5 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, socket } = useUserContext() as UserContext;
  const [selectedRangeStatus, setSelectedRangeStatus] = useState<Status>("");
  const [totalpendingTickets, setTotalPendingTickets] = useState<number>(0);
  const [usersData, setUsersData] = useState<UserModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [pendingticketPieChartData, setPendingTicketPieChartData] = useState([
    { name: "NotAssigned Tickets", value: 0 },
    { name: "Assigned Tickets", value: 0 },
    { name: "In Progress Tickets", value: 0 },
    { name: "Pending Tickets", value: 0 },
    { name: "Closed Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);

  const [usersStatuses, setUsersStatuses] = useState<{ [key: string]: number }>(
    {
      totalUsers: 0,
      availableUsers: 0,
      breakUsers: 0,
      offlineUsers: 0,
      onTicketUsers: 0,
      sleepUsers: 0,
    },
  );
  socket.off("newUser").on("newUser", ({ userPayload }) => {
    setUsersData(userPayload.filter((user: UserModal) => !user.isAdmin));
  });
  const displayTable = (name: string) => {
    if (name == "users") {
      navigate("/dashboard/usersTable");
    } else if (name == "clients") {
      navigate("/dashboard/clients");
    } else if (name == "tickets") {
      navigate("/dashboard/ticketsTable");
    }
  };
  socket.off("dashboardStats").on("dashboardStats", ({ pendingTickets }) => {
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
    setTotalPendingTickets(totalPending);
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
    const userStats: { [key: string]: number } = {
      Available: 0,
      Break: 0,
      Offline: 0,
      [ON_TICKET]: 0,
      [LUNCH_BREAK]: 0,
      [BREAKFAST_BREAK]: 0,
      Sleep: 0,
    };
    usersData.forEach((user) => {
      userStats[user.status] = (userStats[user.status] || 0) + 1;
    });
    setUsersStatuses({
      totalUsers: usersData.length,
      [AVAILABLE]: userStats[AVAILABLE],
      [BREAK]:
        userStats[BREAK] + userStats[LUNCH_BREAK] + userStats[BREAKFAST_BREAK],
      [OFFLINE]: userStats[OFFLINE],
      [ON_TICKET]: userStats[ON_TICKET],
      [SLEEP]: userStats[SLEEP],
    });
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
      {/* <div className="d-flex"> */}
      <div className="dashboard-content">
        <div className="d-flex justify-content-between flex-wrap">
          <h1>DASHBOARD</h1>
          <div className="d-flex flex-direction-row gap-1 m-2 dashboard-actions">
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
        </div>
        <div className="sub-ranges">
          <h3 className="text-primary">Users Data: </h3>
          <div className="main-container text-center">
            <div className="show-range">
              {statusCardTypes.map(({ id, type, src }) => (
                <StatusCard
                  key={id}
                  type={type}
                  src={src}
                  count={`${usersStatuses[type]}/${usersStatuses.totalUsers}`}
                  onClick={handleRangeClick}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="admin-pie-chart">
          <div className="pie-chart">
            <Timezones />
          </div>
          <div className="admin-btns pie-chart">
            <h3 className="sub-heading">Today Tickets Data</h3>
            <PieChartComponent
              data={pendingticketPieChartData}
              totalTickets={totalpendingTickets}
              name="pending tickets"
            />
          </div>
        </div>
        <div className="ranges"></div>
      </div>
      {showModal && modalName == "messageModal" && (
        <ReusableModal vals={modalProps}>
          <MessageAllUsersModal setShowModal={setShowModal} />
        </ReusableModal>
      )}
      {showModal && modalName === "USERS" && (
        <ReusableModal vals={modalProps}>
          <TaskTable<UserModal>
            height="300px"
            headers={rangeUserHeaders}
            tableData={usersData.filter((user) =>
              user.status.includes(selectedRangeStatus),
            )}
            loading={false}
          />
        </ReusableModal>
      )}
    </div>
  );
};

export default AdminDashboard;
