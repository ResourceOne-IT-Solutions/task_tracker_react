import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ClientModal } from "../../modals/ClientModals";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { useNavigate } from "react-router-dom";
import httpMethods from "../../api/Service";
import { getData, getFullName } from "../../utils/utils";
import ReusableModal from "../../utils/modal/ReusableModal";
import UpdateClient from "../../utils/modal/UpdateClient";

function ClientsTable() {
  const navigate = useNavigate();
  const [clientsData, setClientsData] = useState<ClientModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [updateReference, setUpdateReference] = useState<any>({});
  const gotoDashboards = (client: ClientModal) => {
    navigate(`/client/${client._id}`, { state: client });
  };
  const handleUpdate = <T,>(client: T) => {
    setUpdateReference(client);
    setModalProps({
      title: "Update Client",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleRemove = (client: ClientModal) => {
    const delete_or_not = window.confirm("Are you Sure to delete");
    if (delete_or_not) {
      httpMethods
        .deleteCall<ClientModal>(`/clients/${client._id}`)
        .then((resp: any) => {
          const filtered_data = clientsData.filter(
            (item) => item._id !== resp._id,
          );
          setClientsData(filtered_data);
          window.alert(`${getFullName(resp)} account is deleted Successfully`);
        })
        .catch((err: any) => {
          window.alert("An error Occured while deleting");
        });
    }
  };
  const clientTableHeaders: TableHeaders<ClientModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    {
      title: "Client Name",
      key: "firstName",
      tdFormat: (client) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Click here to view client details</Tooltip>}
        >
          <div className="client-curser" onClick={() => gotoDashboards(client)}>
            {client.firstName}
          </div>
        </OverlayTrigger>
      ),
    },
    { title: "Email", key: "email" },
    { title: "Phone", key: "mobile" },
    { title: "Technology", key: "technology" },
    { title: "Location", key: "location.area" },
    { title: "Location", key: "location.zone" },
    {
      title: "Actions",
      key: "",
      tdFormat: (client: ClientModal) => (
        <>
          <Button
            variant="info"
            onClick={() => handleUpdate(client)}
            style={{ marginRight: "4px" }}
          >
            Update
          </Button>
          <Button variant="danger" onClick={() => handleRemove(client)}>
            Remove
          </Button>
        </>
      ),
    },
  ];
  function updateClientTableData(updatedClient: ClientModal) {
    setClientsData((prevTableData) =>
      prevTableData.map((client) =>
        client._id === updatedClient._id ? updatedClient : client,
      ),
    );
  }
  useEffect(() => {
    getData<ClientModal>("clients")
      .then((result) => {
        setClientsData(result);
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
      <h2>Clients Table</h2>
      <Button variant="warning" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <TaskTable<ClientModal>
        pagination
        headers={clientTableHeaders}
        tableData={clientsData}
        loading={loading}
      />
      {showModal && (
        <ReusableModal vals={modalProps}>
          <UpdateClient
            updateref={updateReference}
            updateClientTableData={updateClientTableData}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
    </div>
  );
}

export default ClientsTable;
