import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { UserModal } from "../../modals/UserModals";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { getData, getFullName, statusIndicator } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { ClientModal } from "../../modals/ClientModals";
import httpMethods from "../../api/Service";
import ReusableModal from "../../utils/modal/ReusableModal";
import UpdateUser from "../../utils/modal/UpdateUser";

function UsersTable() {
  const navigate = useNavigate();
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
  const statusIndicatorStyle: React.CSSProperties = {
    position: "absolute",
    top: "0",
    right: "0",
  };
  const handleUserTickets = (user: any) => {
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
        .then((resp: any) => {
          const filtered_data = usersData.filter(
            (item) => item._id !== resp._id,
          );
          setUsersData(filtered_data);
          window.alert(`${getFullName(resp)} account is deleted Successfully`);
        })
        .catch((err: any) => {
          window.alert("An error Occured while deleting");
        });
    }
  };
  const empTableHeaders: TableHeaders<UserModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    {
      title: "User Name",
      key: "firstName",
      tdFormat: (user) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Click here to view User details</Tooltip>}
        >
          <div onClick={() => gotoDashboards(user)}>{getFullName(user)}</div>
        </OverlayTrigger>
      ),
    },
    { title: "Email", key: "email" },
    { title: "Mobile", key: "mobile" },
    { title: "Role", key: "designation" },
    {
      title: "Profile Image",
      key: "",
      tdFormat: (user) => (
        <div
          style={{
            width: "100px",
            height: "100px",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span style={statusIndicatorStyle}>
            {statusIndicator(user.status)}
          </span>
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
    getData<UserModal>("users")
      .then((result) => {
        setUsersData(result);
      })
      .catch((err) => {
        alert(err);
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