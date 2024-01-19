import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../../utils/modal/ReusableModal";
import AddClient from "../../../utils/modal/AddClient";
import AddTicket from "../../../utils/modal/AddTicket";
import httpMethods from "../../../api/Service";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { Status, UserContext, UserModal } from "../../../modals/UserModals";
import { getData, setCookie, statusIndicator } from "../../../utils/utils";
import { ClientModal } from "../../../modals/ClientModals";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [clientsData, setClientsData] = useState<ClientModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, setIsLoggedIn, socket, isLoggedin } =
    userContext as UserContext;
  const [sendingStatuses, setSendingStatuses] = useState({
    id: "",
    data: { status: "" },
  });

  const [statuses, setStatuses] = useState<string[]>([
    "Offline",
    "Available",
    "Busy",
  ]);
  const handleClick = (str: string) => {
    setModalname(str);
    setModalProps({
      title: str == "Client" ? "Create Client" : "Create Ticket",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleChatClick = () => {
    navigate("/chat");
  };
  const handleSelectStatus = (status: any) => {
    const x = { ...sendingStatuses, data: { status: status } };
    setSendingStatuses(x);
    httpMethods.put<any, any>("/users/update", x).then((result) => {
      setCurrentUser(result);
    });
  };
  const handleLogoutClick = () => {
    setCookie("", 0);
    setCurrentUser({} as UserModal);
    setIsLoggedIn(false);
    socket.emit("logout", currentUser._id);
    navigate("/");
  };
  useEffect(() => {
    setSendingStatuses({ ...sendingStatuses, id: currentUser._id });
  }, []);
  useEffect(() => {
    getData("clients").then((res: any) => {
      setClientsData(res);
    });
  }, []);
  return (
    <div className="main-nav">
      <div className="header-nav">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-around">
          <div className="container-fluid">
            <a className="navbar-brand" onClick={() => navigate("/dashboard")}>
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
                    {isLoggedin && currentUser.isAdmin && (
                      <>
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
                          <Link
                            className="nav-link"
                            to="/dashboard/adminRequestmessages"
                          >
                            View Requests
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="nav-item">
                      <a className="nav-link" onClick={handleChatClick}>
                        Chat
                      </a>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/tickets">
                        Tickets
                      </Link>
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
                          {statusIndicator(currentUser.status)}{" "}
                          {currentUser.status}
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
                              {statusIndicator(stat as Status)} {stat}
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
    </div>
  );
}

export default Navbar;