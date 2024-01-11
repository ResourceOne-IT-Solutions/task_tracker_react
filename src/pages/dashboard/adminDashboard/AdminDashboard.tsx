import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import httpMethods from "../../../api/Service";
import {
  UserContext,
  UserModal,
  useUserContext,
} from "../../../components/Authcontext/AuthContext";
import TaskTable from "../../../utils/table/Table";
import { Button } from "react-bootstrap";
import { GreenDot, RedDot } from "../../../utils/Dots/Dots";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../../utils/modal/ReusableModal";
import AddClient, { ClientInterface } from "../../../utils/modal/AddClient";
import AddTicket from "../../../utils/modal/AddTicket";
import UpdateUser from "../../../utils/modal/UpdateUser";
import UpdateClient from "../../../utils/modal/UpdateClient";
import { getData, setCookie } from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import { TicketsModal } from "../userDashboard/UserDashboard";

export interface ClientModal {
  firstName: string;
  location: {
    area: string;
    zone: string;
  };
  mobile: string;
  technology: string;
  email: string;
  _id: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, setIsLoggedIn } =
    userContext as UserContext;
  const [usersData, setUsersData] = useState<UserModal[]>([]);
  const [clientsData, setClientsData] = useState<ClientModal[]>([]);
  const [ticketsData, setTicketsData] = useState<any>([]);
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
  ]);

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

  const handleUpdate = (user: UserModal) => {
    if (!user.empId) {
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
  const clientTableHeaders = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Consultant Name", key: "firstName" },
    { title: "Email", key: "email" },
    { title: "Phone", key: "mobile" },
    { title: "Technology", key: "technology" },
    { title: "Location", key: "location.area" },
    { title: "Location", key: "location.zone" },
    {
      title: "Actions",
      key: "",
      tdFormat: (user: UserModal) => (
        <>
          <Button
            variant="info"
            onClick={() => handleUpdate(user)}
            style={{ marginRight: "4px" }}
          >
            Update
          </Button>
          <Button variant="danger">Remove</Button>
        </>
      ),
    },
  ];
  const empTableHeaders = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Consultant Name", key: "firstName" },
    { title: "Email", key: "email" },
    { title: "Mobile", key: "mobile" },
    { title: "Role", key: "designation" },
    {
      title: "Profile Image",
      key: "",
      tdFormat: (user: { isActive: boolean; profileImageUrl: string }) => (
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
            onClick={() => handleUpdate(user)}
            style={{ marginBottom: "4px" }}
          >
            Update
          </Button>
          <Button variant="danger">Remove</Button>
        </>
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
  useEffect(() => {
    httpMethods.get<TicketsModal[]>("/tickets").then((result) => {
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
      const totalTickets = result.length;

      setPieChartData([
        { name: "NotAssigned Tickets", value: notAssignedTickets },
        { name: "Assigned Tickets", value: assignedTickets },
        { name: "In Progress Tickets", value: progressTickets },
        { name: "Pending Tickets", value: pendingTickets },
        { name: "Resolved Tickets", value: resolvedTickets },
      ]);
      setCurrentUser((data) => ({
        ...data,
        pendingTickets,
        resolvedTickets,
        progressTickets,
      }));
    });
  }, []);
  return (
    <div>
      <div className="header-nav">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-around">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Navbar
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
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link disabled"
                    href="#"
                    aria-disabled="true"
                  >
                    Disabled
                  </a>
                </li>
              </ul>
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
              <span
                className="active-not"
                style={{
                  backgroundColor: currentUser.isActive ? "#15a757" : "red",
                }}
              ></span>{" "}
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
        <button
          className="btn btn-dark"
          onClick={() => navigate("/admindashboard/adduser")}
        >
          Create User
        </button>
        <button
          className="btn btn-success"
          onClick={() => handleClick("Client")}
        >
          Create Client
        </button>
        <button
          className="btn btn-warning"
          onClick={() => handleClick("Ticket")}
        >
          Create Ticket
        </button>
      </div>
      <div className="admin-btns">
        <button
          className="btn btn-info"
          onClick={() =>
            displayTable(tableName == "users" ? "clients" : "users")
          }
        >
          Show {tableName == "users" ? "clients" : "users"}
        </button>
      </div>
      <TaskTable
        pagination
        headers={tableName === "clients" ? clientTableHeaders : empTableHeaders}
        tableData={tableName === "clients" ? clientsData : usersData}
        loading={loading}
      />
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
    </div>
  );
};

export default AdminDashboard;
