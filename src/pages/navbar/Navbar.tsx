import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../utils/modal/ReusableModal";
import AddClient from "../../utils/modal/AddClient";
import AddTicket from "../../utils/modal/AddTicket";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { Status, UserContext, UserModal } from "../../modals/UserModals";
import {
  ProfileImage,
  Timer,
  getData,
  setCookie,
  statusIndicator,
} from "../../utils/utils";
import { ClientModal } from "../../modals/ClientModals";
import "./Navbar.css";
import { BREAK, STATUS_TYPES } from "../../utils/Constants";
import { NavLink } from "react-router-dom";
import useOutsideClick from "../../utils/hooks/useOutsideClick";

function Navbar() {
  const navigate = useNavigate();
  const profilRef = useRef<HTMLDivElement>(null);
  const { currentUser, setCurrentUser, setIsLoggedIn, socket } =
    useUserContext() as UserContext;
  const [sendingStatuses, setSendingStatuses] = useState({
    id: "",
    data: { status: "" },
  });
  const [openProfileModal, setOpenProfileModal] = useState(false);
  useOutsideClick(profilRef, () => setOpenProfileModal(false));
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
  const handleProfileModal = () => setOpenProfileModal(!openProfileModal);
  useEffect(() => {
    setSendingStatuses({ ...sendingStatuses, id: currentUser._id });
  }, []);

  return (
    <div className="main-nav">
      <div className="header-nav">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-around">
          <div className="container-fluid">
            <a className="navbar-brand" onClick={() => navigate("/dashboard")}>
              <b>ResourceOne IT Solutions</b>
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
                      {currentUser.isAdmin && (
                        <li className="nav-item adduser mx-2">
                          <NavLink to="/dashboard/userfeedback">
                            User Feedbacks
                          </NavLink>
                        </li>
                      )}
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
                <div
                  className="position-relative profile-button mx-1"
                  ref={profilRef}
                >
                  <Button onClick={handleProfileModal}>
                    <span className="nav-profile-img">
                      <ProfileImage
                        filename={currentUser.profileImageUrl}
                        className="rounded-circle"
                        imgPopup={false}
                      />
                    </span>
                    Profile
                  </Button>
                  {openProfileModal && (
                    <div className="bg-success position-absolute profile-modal top-100 rounded-2">
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
                  )}
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
