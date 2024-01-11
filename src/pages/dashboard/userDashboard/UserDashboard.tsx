import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import httpMethods from "../../../api/Service";
import { Button } from "react-bootstrap";
import {
  UserContext,
  UserModal,
  useUserContext,
} from "../../../components/Authcontext/AuthContext";
import { calculateWorkingFrom } from "../../../utils/utils";
import PieChartComponent from "../../../components/pieChart/PieChart";
import UpdateTicket from "../../../utils/modal/UpdateUserModal";
import { setCookie } from "../../../utils/utils";
import { useNavigate } from "react-router";

export interface TicketsModal {
  user: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  description: string;
  assignedDate: Date;
  closedDate: Date;
  receivedDate: Date;
  status: string;
  technology: string;
  comments: string;
  _id: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, setIsLoggedIn } =
    userContext as UserContext;
  const [tableData, setTableData] = useState<TicketsModal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const joinDate = currentUser.joinedDate;
  const workingDuration = calculateWorkingFrom(joinDate);
  const dateConversion = (date: Date) => new Date(date).toLocaleDateString();

  const [pieChartData, setPieChartData] = useState([
    { name: "In Progress Tickets", value: 0 },
    { name: "ResolvedTickets", value: 0 },
    { name: "Helped Tickets", value: currentUser.helpedTickets },
    { name: "Pending Tickets", value: 0 },
  ]);
  useEffect(() => {
    setIsLoading(true);
    httpMethods
      .get<TicketsModal[]>("/users/tickets/" + currentUser._id)
      .then((result) => {
        setTableData(result);

        const pendingTickets = result.filter(
          (ticket) => ticket.status === "Pending",
        ).length;
        const resolvedTickets = result.filter(
          (ticket) => ticket.status === "Resolved",
        ).length;
        const progressTickets = result.filter(
          (ticket) => ticket.status === "In Progress",
        ).length;
        const totalTickets = result.length;

        setPieChartData([
          { name: "Pending Tickets", value: pendingTickets },
          { name: "Resolved Tickets", value: resolvedTickets },
          { name: "In Progress Tickets", value: progressTickets },
          { name: "Helped Tickets", value: currentUser.helpedTickets },
        ]);
        setCurrentUser((data) => ({
          ...data,
          pendingTickets,
          resolvedTickets,
          progressTickets,
        }));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);
  useEffect(() => {
    setIsLoading(true);
    httpMethods
      .get<TicketsModal[]>("/users/tickets/" + currentUser._id)
      .then((result) => {
        setTableData(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);
  const [showUpdateModal, setShowUpdateModal] = useState<{
    show: boolean;
    ticketData: TicketsModal;
  }>({
    show: false,
    ticketData: {} as TicketsModal,
  });
  const updateTableData = (updatedTicket: TicketsModal) => {
    setTableData((prevTableData) =>
      prevTableData.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket,
      ),
    );
  };
  const handleLogoutClick = () => {
    setCookie("", 0);
    setCurrentUser({} as UserModal);
    setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <>
      <div className="userdashboard">
        <div className="user-logout-button">
          <Button variant="danger" onClick={handleLogoutClick}>
            Logout
          </Button>
        </div>
        <p className="username">Welcome back, {currentUser.firstName}</p>
        <div className="usernavbar">
          <div className="nav_img_container">
            <img src={`${currentUser.profileImageUrl}`} />
          </div>
          <p> {`${currentUser.firstName} ${currentUser.lastName}`} </p>
          <span
            className="active_inactive_circle"
            style={{ backgroundColor: currentUser.isActive ? "green" : "red" }}
          ></span>
          <p>({currentUser.userId})</p>
        </div>
        <div className="userdetails">
          <div className="userleft">
            <p>Profile Image</p>
            <img src={`${currentUser.profileImageUrl}`} />
            <div className="employee-details">
              <ul>
                <li>Employee Details</li>
                <li>Emp ID: {currentUser.empId}</li>
                <li>First Name : {currentUser.firstName}</li>
                <li>Last Name : {currentUser.lastName}</li>
                <li>Email : {currentUser.email}</li>
                <li>Dob : {dateConversion(currentUser.dob)}</li>
                <li>Phone : {currentUser.mobile}</li>
                <li>Role : {currentUser.designation}</li>
              </ul>
            </div>
          </div>
          <div className="usercenter">
            <div className="emprole">
              <p>Role</p>
              <p>{currentUser.designation}</p>
              <p>TEAM</p>
              <p>React Community</p>
            </div>
            <div className="stats">
              <ul>
                <li>Stats</li>
                <li>Today Tickets: {currentUser.totalTickets}</li>
                <li>Progress Tickets: {currentUser.progressTickets}</li>
                <li>Pending: {currentUser.pendingTickets}</li>
                <li>Resolved: {currentUser.helpedTickets}</li>
                <li>Helped Tickets: {currentUser.helpedTickets}</li>
                <li>Total Tickets : {currentUser.totalTickets}</li>
              </ul>
            </div>
          </div>
          <div className="userright">
            <div className="joiningdate">
              <div>
                <p>Joined On</p>
                <p>{dateConversion(currentUser.joinedDate)}</p>
                <p>Working from</p>
                <p>
                  {workingDuration.years} years {workingDuration.months} Months{" "}
                </p>
                <p>{workingDuration.days} Days</p>
              </div>
              <div>
                <PieChartComponent
                  data={pieChartData}
                  totalTickets={tableData.length}
                />
              </div>
            </div>
            <div className="lastlogindata">
              <ul>
                <li>Last LoggedIn Data</li>
                <li>Browser : Google Chrome</li>
                <li>IP Address: 192.168.10.29</li>
                <li>Login Time: 1/5/2024, 10:08:50 AM</li>
                <li>Location: {currentUser.address}</li>
                <li>
                  Map: <a href="_blank">Click here </a>(Approximate location)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Consultant</th>
            <th>User</th>
            <th>Technology</th>
            <th>Received Date</th>
            <th>Assigned Date</th>
            <th>Description</th>
            <th>Comments</th>
            <th>Closed Date</th>
            <th>Status</th>
            <th>
              <Button variant="danger">Ticket Raise</Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={11}>
                <h1>Data Loading...</h1>
              </td>
            </tr>
          ) : (
            <>
              {tableData.length ? (
                <>
                  {tableData.map((items: TicketsModal, index: any) => {
                    return (
                      <tr key={index}>
                        <td>{items.client.name}</td>
                        <td>{items.user.name}</td>
                        <td>{items.technology}</td>
                        <td>{dateConversion(items.receivedDate)}</td>
                        <td>
                          {items.assignedDate
                            ? dateConversion(items.assignedDate)
                            : "Not assigned"}
                        </td>
                        <td>{items.description}</td>
                        <td>{items.comments}</td>
                        <td>{dateConversion(items.closedDate)}</td>
                        <td>{items.status}</td>
                        <td>
                          <Button
                            variant="success"
                            onClick={() =>
                              setShowUpdateModal({
                                show: true,
                                ticketData: items,
                              })
                            }
                          >
                            Update Ticket
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <tr>
                  <td colSpan={11}>
                    <h1>NO Data</h1>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
      <UpdateTicket
        show={showUpdateModal.show}
        onHide={() =>
          setShowUpdateModal({ show: false, ticketData: {} as TicketsModal })
        }
        ticketData={showUpdateModal.ticketData}
        updateTableData={updateTableData}
      />
    </>
  );
};

export default UserDashboard;
