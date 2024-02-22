import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../utils/modal/ReusableModal";
import AddClient from "../../utils/modal/AddClient";
import AddTicket from "../../utils/modal/AddTicket";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { Status, UserContext, UserModal } from "../../modals/UserModals";
import { Timer, getData, setCookie, statusIndicator } from "../../utils/utils";
import { ClientModal } from "../../modals/ClientModals";
import "./Navbar.css";
import { BREAK, STATUS_TYPES } from "../../utils/Constants";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

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

  // const handleClick = (str: string) => {
  //   setModalname(str);
  //   navigate("/dashboard");
  //   setModalProps({
  //     title: str == "Client" ? "Create Client" : "Create Ticket",
  //     setShowModal: setShowModal,
  //     show: !showModal,
  //   });
  //   setShowModal(true);
  // };
  const handleSelectStatus = (status: string | null) => {
    if (status) {
      socket.emit("changeStatus", { id: currentUser._id, status });
    }
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
              {/* <div>
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
                            {requestMessageCount.length ? (
                              <span className="user-newmsg-count">
                                {requestMessageCount.length}
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
                      <li className="nav-item adduser mx-2">
                        <NavLink to="/dashboard/userfeedback">
                          User Feedbacks
                        </NavLink>
                      </li>
                    </>
                  </ul>
                </form>
              </div> */}
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
                    <DropdownButton
                      id="dropdown-basic-user-status1"
                      title={currentUser.status}
                      drop="down"
                      onSelect={handleSelectStatus}
                      className="mx-2"
                    >
                      {STATUS_TYPES.map((status, idx) => {
                        return (
                          <Dropdown.Item
                            key={idx}
                            eventKey={status === BREAK ? "" : status}
                            className={status === BREAK ? "has-submenu" : ""}
                          >
                            {statusIndicator(status as Status)} {status}
                            {status === BREAK && (
                              <div className="submenu">
                                <Dropdown.Item eventKey="Breakfast Break">
                                  Breakfast Break
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="Lunch Break">
                                  Lunch Break
                                </Dropdown.Item>
                              </div>
                            )}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  )}
                </div>
                {currentUser.status.includes(BREAK) && <Timer />}
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
    </div>
  );
}

export default Navbar;
