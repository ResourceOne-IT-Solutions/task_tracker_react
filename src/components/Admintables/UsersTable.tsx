import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { UserModal, UserContext } from "../../modals/UserModals";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import {
  ProfileImage,
  getData,
  getFullName,
  statusIndicator,
} from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import httpMethods from "../../api/Service";
import ReusableModal from "../../utils/modal/ReusableModal";
import UpdateUser from "../../utils/modal/UpdateUser";
import { useUserContext } from "../Authcontext/AuthContext";
import { Severity } from "../../utils/modal/notification";
import { ErrorMessageInterface } from "../../modals/interfaces";
import { STATUS_INDICATOR_STYLES } from "../../utils/Constants";

function UsersTable() {
  const navigate = useNavigate();
  const { alertModal, popupNotification } = useUserContext() as UserContext;
  const [usersData, setUsersData] = useState<UserModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [updateReference, setUpdateReference] = useState<any>({});
  const gotoDashboards = (user: UserModal) => {
    navigate(`/user/${user._id}`, { state: user });
  };

  const handleUserTickets = (user: { _id: string }) => {
    navigate(`/userTickets/${user._id}`);
  };
  const handleUpdate = <T,>(user: T) => {
    setUpdateReference(user);
    setModalProps({
      title: "Update User",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleRemove = (user: UserModal) => {
    const delete_or_not = window.confirm("Are you Sure to delete");
    if (delete_or_not) {
      httpMethods
        .deleteCall<UserModal>(`/users/${user._id}`)
        .then((resp: UserModal) => {
          const filtered_data = usersData.filter(
            (item) => item._id !== resp._id,
          );
          setUsersData(filtered_data);
          popupNotification({
            severity: Severity.SUCCESS,
            content: `${getFullName(user)} account is deleted Successfully`,
          });
        })
        .catch((err: ErrorMessageInterface) => {
          alertModal({
            severity: Severity.ERROR,
            content: err.message,
            title: "User Delete",
          });
        });
    }
  };
  const empTableHeaders: TableHeaders<UserModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    {
      title: "User Name",
      key: "firstName",
      tdFormat: (user) => (
        <>
          <div className="d-flex gap-1">
            <div
              style={{
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              <ProfileImage
                className="w-100 h-100"
                filename={user.profileImageUrl}
              />
            </div>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Click here to view User details</Tooltip>}
            >
              <div style={{ position: "relative" }}>
                <div onClick={() => gotoDashboards(user)}>
                  {getFullName(user)}
                </div>
                <span style={STATUS_INDICATOR_STYLES}>
                  {statusIndicator(user.status)}
                </span>
              </div>
            </OverlayTrigger>
          </div>
        </>
      ),
    },
    { title: "Email", key: "email" },
    { title: "Mobile", key: "mobile" },
    { title: "Role", key: "designation" },
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
      tdFormat: (user: { _id: string }) => (
        <Button onClick={() => handleUserTickets(user)}>Click Here</Button>
      ),
    },
    {
      title: "Actions",
      key: "",
      tdFormat: (user: UserModal) => (
        <>
          <Button
            variant="info"
            onClick={() => handleUpdate(user)}
            style={{ marginBottom: "4px" }}
          >
            Update
          </Button>
          <Button variant="danger" onClick={() => handleRemove(user)}>
            Remove
          </Button>
        </>
      ),
    },
  ];
  function updateUserTableData(updatedUser: UserModal) {
    setUsersData((prevTableData) =>
      prevTableData.map((user) =>
        user._id === updatedUser._id ? updatedUser : user,
      ),
    );
  }
  useEffect(() => {
    setLoading(true);
    getData<UserModal>("users")
      .then((result) => {
        setUsersData(result);
      })
      .catch((err) => {
        popupNotification({
          severity: Severity.ERROR,
          content: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="text-center">
      <h2>Users Table</h2>
      <Button variant="warning" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <TaskTable<UserModal>
        pagination
        headers={empTableHeaders}
        tableData={usersData}
        loading={loading}
      />
      {showModal && (
        <ReusableModal vals={modalProps}>
          <UpdateUser
            updateref={updateReference}
            updateUserTableData={updateUserTableData}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
    </div>
  );
}

export default UsersTable;
