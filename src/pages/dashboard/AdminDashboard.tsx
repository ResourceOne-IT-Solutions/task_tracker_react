import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./AdminDashboard.css";
import httpMethods from "../../api/Service";
import { UserModal } from "../../components/Authcontext/AuthContext";
import AddUserModal from "../../utils/modal/AddUserModal";

interface ClientModal {
  firstName: string;
  location: {
    area: string;
    zone: string;
  };
  mobile: string;
  technology: string;
  email: string;
}

const AdminDashboard = () => {
  const adminData = useLocation().state;
  let dob: string | Date = new Date(adminData.dob);
  dob = dob.toLocaleDateString();
  const [tableData, setTableData] = useState<null | any>(null);
  const [tableName, setTableName] = useState<string>("");

  const settingData = (url: string) => {
    httpMethods
      .get<UserModal>(url)
      .then((result) => setTableData(result))
      .catch((err: any) => {
        // console.log(err);
      });
  };
  const displayTable = (name: string) => {
    setTableData(null);
    setTableName(name);
    settingData(name);
  };

  useEffect(() => {
    setTableName("/users");
    settingData("/users");
  }, []);
  // console.log(tableData, tableName, "TableDta");
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
              </form>
            </div>
          </div>
        </nav>
      </div>
      <div className="admin-details">
        <div className="heading-pic">
          <img src={`${adminData.profileImageUrl}`} alt="img" />
          <h4>
            {adminData.firstName} {" " + adminData.lastName + " "}
            <span
              className="active-not"
              style={{
                backgroundColor: adminData.isActive ? "#15a757" : "red",
              }}
            ></span>{" "}
            <span>{`(${adminData.userId})`}</span>
          </h4>
        </div>
        <div className="all-details">
          <div className="pf">
            <h6>Profile Image</h6>
            <img src={`${adminData.profileImageUrl}`} alt="image" />
          </div>
          <div>
            <h6>Admin Details</h6>
            <ul>
              <li>EmpId : {adminData.empId}</li>
              <li>FirstName : {adminData.firstName}</li>
              <li>LastName : {adminData.lastName}</li>
              <li>Email : {adminData.email}</li>
              <li>Mobile : {adminData.mobile}</li>
              <li>Email : {adminData.email}</li>
              <li>Designation : {adminData.designation}</li>
              <li>DOB : {dob}</li>
              <li>Address : {adminData.address}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="admin-btns">
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add User
        </button>
        <button className="btn btn-success">Add Client</button>
        <button className="btn btn-warning">Create Ticket</button>
      </div>
      <div className="admin-btns">
        <button className="btn btn-info" onClick={() => displayTable("/users")}>
          Show Users
        </button>
        <button
          className="btn btn-dark"
          onClick={() => displayTable("/clients")}
        >
          Show Clients
        </button>
      </div>
      {tableName === "/users" ? (
        <table>
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Technology</th>
            <th className="column-to-reduce">Profile Image</th>
            <th>Active User</th>
            <th>Uploaded Issues</th>
            <th>Actions</th>
          </thead>
          <tbody>
            {tableData ? (
              tableData.map((user: UserModal) => {
                return (
                  <tr key={user.empId}>
                    <td>{user.firstName + " " + user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.designation}</td>
                    <td>
                      <img src={`${user.profileImageUrl}`} />
                    </td>
                    <td>{user.isActive ? "Yes" : "No"}</td>
                    <td>
                      <button className="btn btn-primary">Click Here</button>
                    </td>
                    <td>
                      <button className="btn btn-info">Update</button>
                      <button className="btn btn-danger">Remove</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <div style={{ textAlign: "center" }}>
                Data is Loading.....................
              </div>
            )}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Technology</th>
            <th>Location</th>
            <th>Zone</th>
          </thead>
          <tbody>
            {tableData ? (
              tableData.map((user: ClientModal) => {
                return (
                  <tr key={user.firstName}>
                    <td>{user.firstName}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.technology}</td>
                    <td>{user.location.area}</td>
                    <td>{user.location.zone}</td>
                  </tr>
                );
              })
            ) : (
              <div style={{ textAlign: "center" }}>
                Data is Loading.....................
              </div>
            )}
          </tbody>
        </table>
      )}
      <AddUserModal />
    </div>
  );
};

export default AdminDashboard;
