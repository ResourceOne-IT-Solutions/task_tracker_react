import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { Status, UserContext, UserModal } from "../../modals/UserModals";
import {
  ProfileImage,
  Timer,
  checkIsMobileView,
  setCookie,
  statusIndicator,
} from "../../utils/utils";
import "./Navbar.css";
import { BREAK, COMPANY_NAME, STATUS_TYPES } from "../../utils/Constants";
import useOutsideClick from "../../utils/hooks/useOutsideClick";

function Navbar() {
  const navigate = useNavigate();
  const profilRef = useRef<HTMLDivElement>(null);
  const { currentUser, setCurrentUser, setIsLoggedIn, socket, isMobileView } =
    useUserContext() as UserContext;
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };
  const handleProfileModal = () => setOpenProfileModal(!openProfileModal);
  useEffect(() => {
    const toggleBtn = document.getElementById(
      "navbarToggleBtn",
    ) as HTMLButtonElement;
    if (toggleBtn) {
      const icon = toggleBtn?.querySelector(".navbar-toggler-i");
      toggleBtn.addEventListener("click", function () {
        if (icon) {
          if (toggleBtn.getAttribute("aria-expanded") === "true") {
            icon.classList.remove("bi-list"); // Replace 'bi-list' with your preferred open icon class
            icon.classList.add("bi-x"); // Replace 'bi-x' with the Bootstrap cross icon class
          } else {
            icon.classList.remove("bi-x"); // Replace 'bi-x' with the Bootstrap cross icon class
            icon.classList.add("bi-list"); // Replace 'bi-list' with your preferred open icon class
          }
        }
      });
    }

    return () => {
      if (toggleBtn) {
        toggleBtn.removeEventListener("click", () => "");
      }
    };
  }, [isMobileView]);

  return (
    <nav className="header-nav navbar navbar-expand-lg navbar-dark bg-dark justify-content-around main-nav">
      <div className="container-fluid">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Go to dashboard</Tooltip>}
        >
          <a className="navbar-brand" onClick={() => navigate("/dashboard")}>
            <b>{COMPANY_NAME}</b>
          </a>
        </OverlayTrigger>
        <button
          id="navbarToggleBtn"
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarContent, #navbarSupportedContent"
          aria-controls="sidebarContent navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-i nav-btn bi-list"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
                    {statusIndicator(currentUser.status)} {currentUser.status}
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
                <div className="profile position-absolute profile-modal top-100 rounded-2 shadow-lg">
                  <h6>{currentUser.isAdmin ? "Admin" : "User"} Details</h6>
                  <ul>
                    <li>
                      <span>Employee Id :</span> {currentUser.empId}
                    </li>
                    <li>
                      <span>FirstName :</span> {currentUser.firstName}
                    </li>
                    <li>
                      <span>LastName :</span> {currentUser.lastName}
                    </li>
                    <li>
                      <span>Email :</span> {currentUser.email}
                    </li>
                    <li>
                      <span>Mobile:</span> {currentUser.mobile}
                    </li>
                    <li>
                      <span>Designation :</span> {currentUser.designation}
                    </li>
                  </ul>
                  <div className="admin-logout-button">
                    <Button variant="danger" onClick={handleLogoutClick}>
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
