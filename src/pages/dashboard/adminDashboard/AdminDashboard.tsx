import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import httpMethods from "../../../api/Service";
import { useUserContext } from "../../../components/Authcontext/AuthContext";

import TaskTable, { TableHeaders } from "../../../utils/table/Table";
import { Button } from "react-bootstrap";
import { GreenDot, OrangeDot, RedDot } from "../../../utils/Dots/Dots";
import { Link, useNavigate } from "react-router-dom";
import ReusableModal from "../../../utils/modal/ReusableModal";
import AddClient from "../../../utils/modal/AddClient";
import AddTicket from "../../../utils/modal/AddTicket";
import UpdateUser from "../../../utils/modal/UpdateUser";
import UpdateClient from "../../../utils/modal/UpdateClient";
import { getData, setCookie } from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import AssignTicket from "../../../utils/modal/AssignTicket";
import { Dropdown } from "react-bootstrap";
import { TicketModal } from "../../../modals/TicketModals";
import { UserContext, UserModal } from "../../../modals/UserModals";
import { ClientModal } from "../../../modals/ClientModals";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, setIsLoggedIn } =
    userContext as UserContext;
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
    UserModal | any | ClientModal
  >({});
  const [pieChartData, setPieChartData] = useState([
    { name: "NotAssigned Tickets", value: 0 },
    { name: "Assigned Tickets", value: 0 },
    { name: "In Progress Tickets", value: 0 },
    { name: "Pending Tickets", value: 0 },
    { name: "Resolved Tickets", value: 0 },
    { name: "Improper Requirment", value: 0 },
  ]);

  const [statuses, setStatuses] = useState<string[]>([
    "Offline",
    "Available",
    "Busy",
  ]);
  const [colors, setColors] = useState<any>({
    Offline: <RedDot />,
    Available: <GreenDot />,
    Busy: <OrangeDot />,
  });

  const [sendingStatuses, setSendingStatuses] = useState({
    id: "",
    data: { status: "" },
  });

  const statusIndicatorStyle = { position: "absolute", top: "0", right: "0" };
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
  function UpdateTicketsTableData(updatedTicket: any) {
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
      .catch((err) => err)
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
  const goToClientDashboard = (client: ClientModal) => {
    navigate(`/client/:${client._id}`, { state: client });
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
  const clientTableHeaders: TableHeaders<ClientModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    {
      title: "Client Name",
      key: "firstName",
      tdFormat: (client) => (
        <div onClick={() => goToClientDashboard(client)}>
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
          <Button variant="danger">Remove</Button>
        </>
      ),
    },
  ];
  const empTableHeaders: TableHeaders<UserModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    { title: "User Name", key: "firstName" },
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
          {user.isActive ? (
            <GreenDot styles={statusIndicatorStyle} />
          ) : (
            <RedDot styles={statusIndicatorStyle} />
          )}
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
      tdFormat: (user: { _id: string }) => <Button>Click Here</Button>,
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
          <Button variant="danger">Remove</Button>
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
        <button
          className="btn btn-info"
          onClick={() => handleAddResource(ticket)}
          style={{ fontWeight: "700" }}
        >
          Add Resource
        </button>
      ),
    },
  ];

  const handleClick = (str: string) => {
    setModalname(str);
    setModalProps({
      title: str == "Client" ? "Create Client" : "Create Ticket",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleLogoutClick = () => {
    setCookie("", 0);
    setCurrentUser({} as UserModal);
    setIsLoggedIn(false);
    navigate("/");
  };
  const handleChatClick = () => {
    navigate("/chat");
  };
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
  const handleSelectStatus = (status: any) => {
    const x = { ...sendingStatuses, data: { status: status } };
    setSendingStatuses(x);
    httpMethods.put<any, any>("/users/update", x).then((result) => {
      setCurrentUser(result);
    });
  };
  return (
    <div>
      <div className="header-nav">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-around">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <b>DASHBOARD</b>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <div>
                <form className="d-flex">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link className="nav-link" to="/tickets">
                        Tickets
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        onClick={() => navigate("/admindashboard/adduser")}
                      >
                        Create User
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        onClick={() => handleClick("Client")}
                      >
                        Create Client
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        onClick={() => handleClick("Ticket")}
                      >
                        Create Ticket
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" onClick={handleChatClick}>
                        Chat
                      </a>
                    </li>
                  </ul>
                </form>
              </div>
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
                <div className="admin-logout-button">
                  <Dropdown onSelect={handleSelectStatus} className="drop-down">
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {currentUser.status ? (
                        <span>
                          {colors[currentUser.status]} {currentUser.status}
                        </span>
                      ) : (
                        "Select a User"
                      )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      style={{ maxHeight: "180px", overflowY: "auto" }}
                    >
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
                <div className="admin-logout-button">
                  <Button variant="danger" onClick={handleLogoutClick}>
                    Logout
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </div>
      <div className="admin-pie-chart">
        <div className="admin-details">
          <div className="heading-pic">
            <img src={`${currentUser.profileImageUrl}`} alt="img" />
            <h4>
              {currentUser.firstName} {" " + currentUser.lastName + " "}
              <span className="active-not">
                {colors[currentUser.status]}
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
                <li>DOB : {new Date(currentUser.dob).toLocaleString()}</li>
                <li>Address : {currentUser.address}</li>
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
      <div className="admin-btns">
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
      {showModal && modalName == "Client" && (
        <ReusableModal vals={modalProps}>
          <AddClient />
        </ReusableModal>
      )}
      {showModal && modalName == "Ticket" && (
        <ReusableModal vals={modalProps}>
          <AddTicket clientsData={clientsData} />
        </ReusableModal>
      )}
      {showModal && modalName == "update_user" && (
        <ReusableModal vals={modalProps}>
          <UpdateUser
            updateref={updateReference}
            updateUserTableData={updateUserTableData}
          />
        </ReusableModal>
      )}
      {showModal && modalName == "update_client" && (
        <ReusableModal vals={modalProps}>
          <UpdateClient
            updateref={updateReference}
            updateClientTableData={updateClientTableData}
          />
        </ReusableModal>
      )}
      {showModal && modalName == "Assign Ticket" && (
        <ReusableModal vals={modalProps}>
          <AssignTicket
            updateref={updateReference}
            usersData={usersData}
            UpdateTicketsTableData={UpdateTicketsTableData}
          />
        </ReusableModal>
      )}
    </div>
  );
};

export default AdminDashboard;
