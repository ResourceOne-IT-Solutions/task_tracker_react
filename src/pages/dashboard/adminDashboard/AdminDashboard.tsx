import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import httpMethods from "../../../api/Service";
import { useUserContext } from "../../../components/Authcontext/AuthContext";

import TaskTable, { TableHeaders } from "../../../utils/table/Table";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../../utils/modal/ReusableModal";
import UpdateUser from "../../../utils/modal/UpdateUser";
import UpdateClient from "../../../utils/modal/UpdateClient";
import { getData, getFullName, statusIndicator } from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import AssignTicket from "../../../utils/modal/AssignTicket";
import { TicketModal } from "../../../modals/TicketModals";
import { UserContext, UserModal } from "../../../modals/UserModals";
import { ClientModal } from "../../../modals/ClientModals";
import TicketsMain from "../../tickets/TicketsMain";
import MessageAllUsersModal from "../../../utils/modal/MessageAllUsersModal";
import MailSender from "../../../utils/modal/MailSender";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, socket } = userContext as UserContext;
  const [usersData, setUsersData] = useState<UserModal[]>([]);
  const [clientsData, setClientsData] = useState<ClientModal[]>([]);
  const [ticketsData, setTicketsData] = useState<TicketModal[]>([]);
  const [tableName, setTableName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [updateReference, setUpdateReference] = useState<
    UserModal | any | ClientModal | TicketModal
  >({});
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

  const statusIndicatorStyle: React.CSSProperties = {
    position: "absolute",
    top: "0",
    right: "0",
  };
  function updateUserTableData(updatedUser: UserModal) {
    setUsersData((prevTableData) =>
      prevTableData.map((user) =>
        user._id === updatedUser._id ? updatedUser : user,
      ),
    );
  }
  function updateClientTableData(updatedClient: ClientModal) {
    setClientsData((prevTableData) =>
      prevTableData.map((client) =>
        client._id === updatedClient._id ? updatedClient : client,
      ),
    );
  }
  function UpdateTicketsTableData(updatedTicket: TicketModal) {
    setTicketsData((prevTableData) =>
      prevTableData.map((ticket) =>
        ticket.client.id === updatedTicket.client.id ? updatedTicket : ticket,
      ),
    );
  }
  const getAllData = () => {
    setLoading(true);
    Promise.all([
      getData<UserModal>("users"),
      getData<ClientModal>("clients"),
      getData<any>("tickets"),
    ])
      .then((results) => {
        setUsersData(results[0]);
        setClientsData(results[1]);
        setTicketsData(results[2]);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const displayTable = (name: string) => {
    setTableName(name);
  };
  useEffect(() => {
    setTableName("users");
    // getData("users");
    // getData("clients");
    getAllData();
  }, []);

  useEffect(() => {
    setSendingStatuses({ ...sendingStatuses, id: currentUser._id });
  }, []);
  useEffect(() => {
    const total = usersData.length;
    const availableUsers = usersData.filter(
      (user) => user.status == "Available",
    ).length;
    const offlineeUsers = usersData.filter(
      (user) => user.status == "Offline",
    ).length;
    const breakUsers = usersData.filter(
      (user) => user.status == "Break",
    ).length;
    const onTicketUsers = usersData.filter(
      (user) => user.status == "On Ticket",
    ).length;

    setUsersStatuses({
      totalUsers: total,
      availableUsers: availableUsers,
      breakUsers: breakUsers,
      offlineUsers: offlineeUsers,
      onTicketUsers: onTicketUsers,
    });
    setPieChartStatuses([
      { name: "Available", value: availableUsers },
      { name: "Offline", value: offlineeUsers },
      { name: "Break", value: breakUsers },
      { name: "On Ticket", value: onTicketUsers },
    ]);
  }, [usersData]);
  const handleUpdate = <T,>(user: T, type: string) => {
    if (type === "CLIENT") {
      setModalname("update_client");
      setUpdateReference(user);
      setModalProps({
        title: "Update Client",
        setShowModal: setShowModal,
        show: !showModal,
      });
      setShowModal(true);
    } else {
      setModalname("update_user");
      setUpdateReference(user);
      setModalProps({
        title: "Update User",
        setShowModal: setShowModal,
        show: !showModal,
      });
      setShowModal(true);
    }
  };
  const handleRemove = (user: UserModal | ClientModal, type: string) => {
    const delete_or_not = window.confirm("Are you Sure to delete");
    if (delete_or_not) {
      if (type == "USER") {
        httpMethods
          .deleteCall<UserModal>(`/users/${user._id}`)
          .then((resp: any) => {
            const filtered_data = usersData.filter(
              (item) => item._id !== resp._id,
            );
            setUsersData(filtered_data);
            window.alert(
              `${getFullName(resp)} account is deleted Successfully`,
            );
          })
          .catch((err: any) => {
            window.alert("An error Occured while deleting");
          });
      } else if (type == "CLIENT") {
        httpMethods
          .deleteCall<ClientModal>(`/clients/${user._id}`)
          .then((resp: any) => {
            const filtered_data = clientsData.filter(
              (item) => item._id !== resp._id,
            );
            setClientsData(filtered_data);
            window.alert(
              `${getFullName(resp)} account is deleted Successfully`,
            );
          })
          .catch((err: any) => {
            window.alert("An error Occured while deleting");
          });
      }
    }
  };
  const gotoDashboards = (client: ClientModal | UserModal, type: string) => {
    if (type == "CLIENT") {
      navigate(`/client/${client._id}`, { state: client });
    } else {
      navigate(`/user/${client._id}`, { state: client });
    }
  };
  const handleAddResource = (ticket: any) => {
    setModalname("Assign Ticket");
    setUpdateReference(ticket);
    setModalProps({
      title: "Assign Ticket",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleSendEmail = (ticket: any) => {
    setModalname("Send Mail");
    setUpdateReference(ticket);
    setModalProps({
      title: "Send Mail",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleUserTickets = (user: any) => {
    navigate(`/userTickets/${user._id}`);
  };
  const clientTableHeaders: TableHeaders<ClientModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    {
      title: "Client Name",
      key: "firstName",
      tdFormat: (client) => (
        <div onClick={() => gotoDashboards(client, "CLIENT")}>
          {client.firstName}
        </div>
      ),
    },
    { title: "Email", key: "email" },
    { title: "Phone", key: "mobile" },
    { title: "Technology", key: "technology" },
    { title: "Location", key: "location.area" },
    { title: "Location", key: "location.zone" },
    {
      title: "Actions",
      key: "",
      tdFormat: (user: ClientModal) => (
        <>
          <Button
            variant="info"
            onClick={() => handleUpdate(user, "CLIENT")}
            style={{ marginRight: "4px" }}
          >
            Update
          </Button>
          <Button variant="danger" onClick={() => handleRemove(user, "CLIENT")}>
            Remove
          </Button>
        </>
      ),
    },
  ];
  const empTableHeaders: TableHeaders<UserModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    {
      title: "User Name",
      key: "firstName",
      tdFormat: (user) => (
        <div onClick={() => gotoDashboards(user, "USER")}>
          {getFullName(user)}
        </div>
      ),
    },
    { title: "Email", key: "email" },
    { title: "Mobile", key: "mobile" },
    { title: "Role", key: "designation" },
    {
      title: "Profile Image",
      key: "",
      tdFormat: (user) => (
        <div
          style={{
            width: "100px",
            height: "100px",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span style={statusIndicatorStyle}>
            {statusIndicator(user.status)}
          </span>
          <img
            src={user.profileImageUrl}
            alt="image"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      title: "Active User",
      key: "isActive",
      tdFormat: (user: { isActive: boolean; isAdmin: boolean }) => (
        <span>
          {user.isActive ? "Yes" : "No"}
          {user.isAdmin && " (Admin)"}{" "}
        </span>
      ),
    },
    {
      title: "Uploaded Issues",
      key: "",
      tdFormat: (user: { _id: string }) => (
        <Button onClick={() => handleUserTickets(user)}>Click Here</Button>
      ),
    },
    {
      title: "Actions",
      key: "",
      tdFormat: (user: UserModal) => (
        <>
          <Button
            variant="info"
            onClick={() => handleUpdate(user, "USER")}
            style={{ marginBottom: "4px" }}
          >
            Update
          </Button>
          <Button variant="danger" onClick={() => handleRemove(user, "USER")}>
            Remove
          </Button>
        </>
      ),
    },
  ];
  const ticketTableHeaders: TableHeaders<TicketModal>[] = [
    { title: "Client Name", key: "client.name" },
    { title: "User Name", key: "user.name" },
    { title: "Status", key: "status" },
    { title: "Technology", key: "technology" },
    { title: "Received Date", key: "receivedDate" },
    { title: "Description", key: "description" },
    {
      title: "Helped By",
      key: "",
      tdFormat: (ticket) => (
        <>{ticket.addOnResource.map((val) => val.name).join(", ")}</>
      ),
    },
    {
      title: "Assign Ticket",
      key: "",
      tdFormat: (ticket: any) => (
        <div>
          <button
            className="btn btn-info"
            onClick={() => handleAddResource(ticket)}
            style={{ fontWeight: "700" }}
          >
            {ticket.user.name ? "Assign Resource" : "Assign User"}
          </button>
          <button
            className="btn btn-warning"
            style={{ fontWeight: "700" }}
            onClick={() => handleSendEmail(ticket)}
          >
            Send Email
          </button>
        </div>
      ),
    },
  ];
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
              name="users_statuses"
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
          <Button variant="danger" onClick={handleAdminBroadCastMessage}>
            Send Message to All
          </Button>
          <Button
            variant="info"
            onClick={() =>
              displayTable(tableName == "users" ? "clients" : "users")
            }
          >
            Show {tableName == "users" ? "clients" : "users"}
          </Button>
          <Button variant="secondary" onClick={() => displayTable("tickets")}>
            Show Tickets
          </Button>
        </div>
      </div>
      {tableName == "tickets" && (
        <TaskTable<TicketModal>
          pagination
          headers={ticketTableHeaders}
          tableData={ticketsData}
          loading={loading}
        />
      )}
      {tableName === "clients" && (
        <TaskTable<ClientModal>
          pagination
          headers={clientTableHeaders}
          tableData={clientsData}
          loading={loading}
        />
      )}
      {tableName === "users" && (
        <TaskTable<UserModal>
          pagination
          headers={empTableHeaders}
          tableData={usersData}
          loading={loading}
        />
      )}

      {showModal && modalName == "update_user" && (
        <ReusableModal vals={modalProps}>
          <UpdateUser
            updateref={updateReference}
            updateUserTableData={updateUserTableData}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
      {showModal && modalName == "update_client" && (
        <ReusableModal vals={modalProps}>
          <UpdateClient
            updateref={updateReference}
            updateClientTableData={updateClientTableData}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
      {showModal && modalName == "Assign Ticket" && (
        <ReusableModal vals={modalProps}>
          <AssignTicket
            updateref={updateReference}
            usersData={usersData}
            UpdateTicketsTableData={UpdateTicketsTableData}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
      {showModal && modalName == "messageModal" && (
        <ReusableModal vals={modalProps}>
          <MessageAllUsersModal setShowModal={setShowModal} />
        </ReusableModal>
      )}
      {showModal && modalName == "Send Mail" && (
        <ReusableModal vals={modalProps}>
          <MailSender
            updateReference={updateReference}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
    </div>
  );
};

export default AdminDashboard;
