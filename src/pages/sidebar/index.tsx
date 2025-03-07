import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import ReusableModal from "../../utils/modal/ReusableModal";
import AddClient from "../../utils/modal/AddClient";
import AddTicket from "../../utils/modal/AddTicket";
import { ClientModal } from "../../modals/ClientModals";
import { getData } from "../../utils/utils";
import "./sidebar.css";

const Sidebar = () => {
  const { isLoggedin, currentUser, requestMessageCount, notificationRooms } =
    useUserContext() as UserContext;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [clientsData, setClientsData] = useState<ClientModal[]>([]);
  const [modalName, setModalname] = useState<string>("");

  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
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
  useEffect(() => {
    if (modalName == "Ticket") {
      getData<ClientModal>("clients").then((res: ClientModal[]) => {
        setClientsData(res);
      });
    }
  }, [modalName]);
  return (
    <div className="side-bar collapse navbar-collapse" id="sidebarContent">
      <ul className={`me-auto mb-2 mb-lg-0 flex-column p-0`}>
        {isLoggedin && currentUser.isAdmin && (
          <>
            <li className="nav-item adduser">
              <NavLink className="nav-link" to={"/admindashboard/adduser"}>
                Create User
              </NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => handleClick("Client")}>
                Create Client
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => handleClick("Ticket")}>
                Create Ticket
              </a>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={"/stats"}>
                User Stats
              </NavLink>
            </li>
            <li className="nav-item adduser">
              <NavLink
                className="nav-link"
                to="/dashboard/adminRequestmessages"
              >
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
            <NavLink className="nav-link" to={"/chat"}>
              Chat{" "}
              {notificationRooms ? (
                <span className="user-newmsg-count">{notificationRooms}</span>
              ) : (
                ""
              )}
            </NavLink>
          </li>
          <li className="nav-item adduser">
            <NavLink className="nav-link" to={"/tickets"}>
              Closed Tickets
            </NavLink>
          </li>
          {isLoggedin && !currentUser.isAdmin && (
            <li className="nav-item adduser">
              <NavLink className="nav-link" to={"/dashboard/adminmessages"}>
                Admin Messages
              </NavLink>
            </li>
          )}
          <li className="nav-item adduser">
            <NavLink className="nav-link" to="/dashboard/feedback">
              Feedback
            </NavLink>
          </li>
          {currentUser.isAdmin && (
            <li className="nav-item adduser">
              <NavLink className="nav-link" to="/dashboard/userfeedback">
                User Feedbacks
              </NavLink>
            </li>
          )}
          <li className="nav-item adduser">
            <NavLink className="nav-link" to="/tasklist">
              Tasks
            </NavLink>
          </li>
        </>
      </ul>
      {showModal && modalName === "Client" && (
        <ReusableModal vals={modalProps}>
          <AddClient setShowModal={setShowModal} />
        </ReusableModal>
      )}
      {showModal && modalName === "Ticket" && (
        <ReusableModal vals={modalProps}>
          <AddTicket clientsData={clientsData} setShowModal={setShowModal} />
        </ReusableModal>
      )}
    </div>
  );
};

export default Sidebar;
