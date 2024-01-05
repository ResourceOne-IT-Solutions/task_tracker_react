import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import { useLocation } from "react-router-dom";
import httpMethods from "../../api/Service";
import { Button } from "react-bootstrap";

function calculateWorkingFrom(joinDate: any) {
  const currentDate = new Date();
  const joinDateObj = new Date(joinDate);

  if (isNaN(joinDateObj.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
    };
  }
  const timeDiff = currentDate.getTime() - joinDateObj.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor(timeDiff / oneDay);
  const years = Math.floor(daysDiff / 365);
  const remainingDays = daysDiff % 365;
  const months = Math.floor(remainingDays / 30);
  const remainingDaysAfterMonths = remainingDays % 30;
  return {
    years,
    months,
    days: remainingDaysAfterMonths,
  };
}
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
  assignedDate: string;
  closedDate: string;
  receivedDate: string;
  status: string;
  technology: string;
  comments: string;
}

const UserDashboard = () => {
  useEffect(() => {
    httpMethods
      .get<TicketsModal[]>("/tickets")
      .then((result) => setTableData(result))
      .catch((err: any) => err);
  }, []);
  const [tableData, setTableData] = useState<null | any>(null);
  const userdata = useLocation().state;
  const joinDate = userdata.joinedDate;
  const workingDuration = calculateWorkingFrom(joinDate);

  const convertedJoiningDate = new Date(userdata.joinedDate);
  const joiningDate =
    convertedJoiningDate.toLocaleDateString() +
    "," +
    convertedJoiningDate.toLocaleTimeString();
  const dateConversion = (date: string) => {
    const datechanger = new Date(date);
    const actual_date = datechanger.toLocaleDateString();
    return actual_date;
  };
  return (
    <>
      <div className="userdashboard">
        <p className="username">Welcome back, {userdata.firstName}</p>
        <div className="usernavbar">
          <div className="nav_img_container">
            <img src={`${userdata.profileImageUrl}`} />
          </div>
          <p>
            {userdata.firstName}
            {userdata.lastName}
          </p>
          <span
            className="active_inactive_circle"
            style={{ backgroundColor: userdata.isActive ? "green" : "red" }}
          ></span>
          <p>({userdata.userId})</p>
        </div>
        <div className="userdetails">
          <div className="userleft">
            <p>Profile Image</p>
            <img src={`${userdata.profileImageUrl}`} />
            <div className="employee-details">
              <ul>
                <li>Employee Details</li>
                <li>Emp ID: {userdata.empId}</li>
                <li>First Name : {userdata.firstName}</li>
                <li>Last Name : {userdata.lastName}</li>
                <li>Email : {userdata.email}</li>
                <li>Phone : {userdata.mobile}</li>
                <li>Role : {userdata.designation}</li>
              </ul>
            </div>
          </div>
          <div className="usercenter">
            <div className="emprole">
              <p>Role</p>
              <p>{userdata.designation}</p>
              <p>TEAM</p>
              <p>React Community</p>
            </div>
            <div className="stats">
              <ul>
                <li>stats</li>
                <li>Total Tickets : 0</li>
                <li>Resolved: 0</li>
                <li>Pending: 0</li>
                <li>Fixed: 0</li>
                <li>Today Tickets: 0</li>
                <li>Solved with another Dev: 0</li>
                <li>Helped Tickets: 0</li>
              </ul>
            </div>
          </div>
          <div className="userright">
            <div className="joiningdate">
              <p>Joined On</p>
              <p>{joiningDate}</p>
              <p>Working from</p>
              <p>
                {workingDuration.years} years {workingDuration.months} Months{" "}
                {workingDuration.days} Days
              </p>
            </div>
            <div className="lastlogindata">
              <ul>
                <li>Last LoggedIn Data</li>
                <li>Browser : Google Chrome</li>
                <li>IP Address: 192.168.10.29</li>
                <li>Login Time: 1/5/2024, 10:08:50 AM</li>
                <li>Location: {userdata.address}</li>
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
            <th>User</th>
            <th>Consultant</th>
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
          {tableData &&
            tableData?.map((items: TicketsModal, index: any) => {
              return (
                <tr key={index}>
                  <td>{items.user.name}</td>
                  <td>{items.client.name}</td>
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
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default UserDashboard;
