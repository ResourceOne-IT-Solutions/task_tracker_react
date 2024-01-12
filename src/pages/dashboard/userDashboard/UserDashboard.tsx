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

const UserDashboard = ({ user }: { user: UserModal }) => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { setCurrentUser, setIsLoggedIn } = userContext as UserContext;
  const [tableData, setTableData] = useState<TicketsModal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentUser, setPresentUser] = useState<UserModal>(user);
  const joinDate = presentUser.joinedDate;
  const workingDuration = calculateWorkingFrom(joinDate);
  const dateConversion = (date: Date) => new Date(date).toLocaleDateString();

  const [pieChartData, setPieChartData] = useState([
    { name: "In Progress Tickets", value: 0 },
    { name: "ResolvedTickets", value: 0 },
    { name: "Helped Tickets", value: presentUser.helpedTickets },
    { name: "Pending Tickets", value: 0 },
  ]);
  useEffect(() => {
    setIsLoading(true);
    httpMethods
      .get<TicketsModal[]>("/users/tickets/" + presentUser._id)
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
        const assigned = result.filter(
          (ticket) => ticket.status === "Assigned",
        ).length;

        setPieChartData([
          { name: "Pending Tickets", value: pendingTickets },
          { name: "Resolved Tickets", value: resolvedTickets },
          { name: "In Progress Tickets", value: progressTickets },
          { name: "Helped Tickets", value: presentUser.helpedTickets },
          { name: "Assigned Tickets", value: assigned },
        ]);
        setCurrentUser((data) => ({
          ...data,
          pendingTickets,
          resolvedTickets,
          progressTickets,
        }));
        setPresentUser((data) => ({
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
      .get<TicketsModal[]>("/users/tickets/" + presentUser._id)
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
        <p className="username">Welcome to {presentUser.firstName} Dashboard</p>
        <div className="usernavbar">
          <div className="nav_img_container">
            <img src={`${presentUser.profileImageUrl}`} />
          </div>
          <p> {`${presentUser.firstName} ${presentUser.lastName}`} </p>
          <span
            className="active_inactive_circle"
            style={{ backgroundColor: presentUser.isActive ? "green" : "red" }}
          ></span>
          <p>({presentUser.userId})</p>
        </div>
        <div className="userdetails">
          <div className="userleft">
            <p>Profile Image</p>
            <img src={`${presentUser.profileImageUrl}`} />
            <div className="employee-details">
              <ul>
                <li>Employee Details</li>
                <li>Emp ID: {presentUser.empId}</li>
                <li>First Name : {presentUser.firstName}</li>
                <li>Last Name : {presentUser.lastName}</li>
                <li>Email : {presentUser.email}</li>
                <li>Dob : {dateConversion(presentUser.dob)}</li>
                <li>Phone : {presentUser.mobile}</li>
                <li>Role : {presentUser.designation}</li>
              </ul>
            </div>
          </div>
          <div className="usercenter">
            <div className="emprole">
              <p>Role</p>
              <p>{presentUser.designation}</p>
              <p>TEAM</p>
              <p>React Community</p>
            </div>
            <div className="stats">
              <ul>
                <li>Stats</li>
                <li>Today Tickets: {presentUser.totalTickets}</li>
                <li>Progress Tickets: {presentUser.progressTickets}</li>
                <li>Pending: {presentUser.pendingTickets}</li>
                <li>Resolved: {presentUser.helpedTickets}</li>
                <li>Helped Tickets: {presentUser.helpedTickets}</li>
                <li>Total Tickets : {presentUser.totalTickets}</li>
              </ul>
            </div>
          </div>
          <div className="userright">
            <div className="joiningdate">
              <div>
                <p>Joined On</p>
                <p>{dateConversion(presentUser.joinedDate)}</p>
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
                <li>Location: {presentUser.address}</li>
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
