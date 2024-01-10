import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import httpMethods from "../../../api/Service";
import {
  UserContext,
  UserModal,
  useUserContext,
} from "../../../components/Authcontext/AuthContext";
import AddUserModal from "../../../utils/modal/AddUserModal";
import TaskTable from "../../../utils/table/Table";
import { Button } from "react-bootstrap";
import { GreenDot, RedDot } from "../../../utils/Dots/Dots";
import { useNavigate } from "react-router-dom";

interface ClientModal {
  firstName: string;
  location: {
    area: string;
    zone: string;
  };
  mobile: string;
  technology: string;
  email: string;
  _id: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { currentUser } = userContext as UserContext;
  const [tableData, setTableData] = useState<UserModal | ClientModal | any>([]);
  const [tableName, setTableName] = useState<string>("");
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const [modalProps, setModalProps] = useState({
  //   title: "",
  //   show_or_not: handleShowModal,
  //   show: showModal,
  // });

  const statusIndicatorStyle = { position: "absolute", top: "0", right: "0" };

  const settingData = (url: string) => {
    httpMethods
      .get<UserModal>(url)
      .then((result) => setTableData(result))
      .catch((err) => err);
  };
  const displayTable = (name: string) => {
    setTableData([]);
    setTableName(name);
    settingData(name);
  };

  useEffect(() => {
    setTableName("/users");
    settingData("/users");
  }, []);

  const clientTableHeaders = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Consultant Name", key: "firstName" },
    { title: "Email", key: "email" },
    { title: "Phone", key: "phone" },
    { title: "Technology", key: "technology" },
    { title: "Location", key: "location.area" },
    { title: "Location", key: "location.zone" },
  ];
  const empTableHeaders = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Consultant Name", key: "firstName" },
    { title: "Email", key: "email" },
    { title: "Mobile", key: "mobile" },
    { title: "Role", key: "designation" },
    {
      title: "Profile Image",
      key: "",
      tdFormat: (user: { isActive: boolean; profileImageUrl: string }) => (
        <div
          style={{
            width: "100px",
            height: "100px",
            cursor: "pointer",
            position: "relative",
          }}
        >
          {user.isActive ? (
            <GreenDot styles={statusIndicatorStyle} />
          ) : (
            <RedDot styles={statusIndicatorStyle} />
          )}
          <img
            src={user.profileImageUrl}
            alt="image"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      title: "Active User",
      key: "isActive",
      tdFormat: (user: { isActive: boolean; isAdmin: boolean }) => (
        <span>
          {user.isActive ? "Yes" : "No"}
          {user.isAdmin && " (Admin)"}{" "}
        </span>
      ),
    },
    {
      title: "Uploaded Issues",
      key: "",
      tdFormat: (user: { _id: string }) => <Button>Click Here</Button>,
    },
    {
      title: "Actions",
      key: "",
      tdFormat: (user: { _id: string; mobile: string }) => (
        <>
          <Button variant="info">Update</Button>
          <Button variant="danger">Remove</Button>
        </>
      ),
    },
  ];
  // const handleNavigate = (value: string) => {
  //   setShowModal(true);
  //   if (value == "user") {
  //     const propsToPass = {
  //       title: "Add User",
  //       show_or_not: handleShowModal,
  //       show: true,
  //     };
  //     setModalProps(propsToPass);
  //   }
  // };
  // function handleShowModal() {
  //   setShowModal(false);
  // }
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
          <img src={`${currentUser.profileImageUrl}`} alt="img" />
          <h4>
            {currentUser.firstName} {" " + currentUser.lastName + " "}
            <span
              className="active-not"
              style={{
                backgroundColor: currentUser.isActive ? "#15a757" : "red",
              }}
            ></span>{" "}
            <span>{`(${currentUser.userId})`}</span>
          </h4>
        </div>
        <div className="all-details">
          <div className="pf">
            <h6>Profile Image</h6>
            <img src={`${currentUser.profileImageUrl}`} alt="image" />
          </div>
          <div>
            <h6>Admin Details</h6>
            <ul>
              <li>EmpId : {currentUser.empId}</li>
              <li>FirstName : {currentUser.firstName}</li>
              <li>LastName : {currentUser.lastName}</li>
              <li>Email : {currentUser.email}</li>
              <li>Mobile : {currentUser.mobile}</li>
              <li>Email : {currentUser.email}</li>
              <li>Designation : {currentUser.designation}</li>
              <li>DOB : {new Date(currentUser.dob).toLocaleString()}</li>
              <li>Address : {currentUser.address}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="admin-btns">
        <button
          className="btn btn-dark"
          onClick={() => navigate("/admindashboard/adduser")}
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
      <TaskTable
        pagination
        headers={
          tableName === "/clients" ? clientTableHeaders : empTableHeaders
        }
        tableData={tableData}
      />
      {/* <AddUserModal /> */}
      {/* <ModalPopup allvals={modalProps}>
        <AddUserModal />
      </ModalPopup> */}
    </div>
  );
};

export default AdminDashboard;
