import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../utils/modal/ReusableModal";
import AddClient from "../../utils/modal/AddClient";
import AddTicket from "../../utils/modal/AddTicket";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { Status, UserContext, UserModal } from "../../modals/UserModals";
import { getData, setCookie, statusIndicator } from "../../utils/utils";
import { ClientModal } from "../../modals/ClientModals";
import "./Navbar.css";
import { STATUS_TYPES } from "../../utils/Constants";
import { NavLink } from "react-router-dom";

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
  const {
    currentUser,
    setCurrentUser,
    setIsLoggedIn,
    socket,
    isLoggedin,
    notificationRooms,
    requestMessageCount,
  } = useUserContext() as UserContext;
  const [sendingStatuses, setSendingStatuses] = useState({
    id: "",
    data: { status: "" },
  });

  const handleClick = (str: string) => {
    setModalname(str);
    navigate("/dashboard");
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
    socket.emit("changeStatus", { id: currentUser._id, status });
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
    if (modalName == "Ticket") {
      getData("clients").then((res: any) => {
        setClientsData(res);
      });
    }
  }, [modalName]);
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
                        <li className="nav-item adduser">
                          <NavLink to={"/admindashboard/adduser"}>
                            Create User
                          </NavLink>
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
                        <li className="nav-item adduser mx-2">
                          <NavLink to="/dashboard/adminRequestmessages">
                            View Requests{" "}
                            {requestMessageCount ? (
                              <span className="user-newmsg-count">
                                {requestMessageCount}
                              </span>
                            ) : (
                              ""
                            )}
                          </NavLink>
                        </li>
                      </>
                    )}
                    <>
                      <li className="nav-item adduser">
                        <NavLink to={"/chat"}>
                          Chat{" "}
                          {notificationRooms ? (
                            <span className="user-newmsg-count">
                              {notificationRooms}
                            </span>
                          ) : (
                            ""
                          )}
                        </NavLink>
                      </li>
                      <li className="nav-item adduser mx-2">
                        <NavLink to={"/tickets"}>Tickets</NavLink>
                      </li>
                      {isLoggedin && !currentUser.isAdmin && (
                        <li className="nav-item adduser mx-2">
                          <NavLink to={"/dashboard/adminmessages"}>
                            Admin Messages
                          </NavLink>
                        </li>
                      )}
                      <li className="nav-item adduser mx-2">
                        <NavLink to="/dashboard/feedback">Feedback</NavLink>
                      </li>
                    </>
                  </ul>
                </form>
              </div>
              <form className="d-flex">
                <div
                  className={
                    currentUser.isAdmin
                      ? "admin-logout-button disabledDiv"
                      : "admin-logout-button"
                  }
                >
                  {currentUser.isAdmin ? (
                    <Button variant="success" className="admin-status">
                      <span>
                        {statusIndicator(currentUser.status)}{" "}
                        {currentUser.status}
                      </span>
                    </Button>
                  ) : (
                    <Dropdown
                      onSelect={handleSelectStatus}
                      className="drop-down"
                    >
                      <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic-user-status"
                      >
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
                        {STATUS_TYPES.map((stat, idx) => {
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
                  )}
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
          <AddClient setShowModal={setShowModal} />
        </ReusableModal>
      )}
      {showModal && modalName == "Ticket" && (
        <ReusableModal vals={modalProps}>
          <AddTicket clientsData={clientsData} setShowModal={setShowModal} />
        </ReusableModal>
      )}
    </div>
  );
}

export default Navbar;
