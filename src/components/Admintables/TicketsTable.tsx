import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TicketModal } from "../../modals/TicketModals";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { getData, getFormattedDate } from "../../utils/utils";
import AssignTicket from "../../utils/modal/AssignTicket";
import ReusableModal from "../../utils/modal/ReusableModal";
import { UserContext, UserModal } from "../../modals/UserModals";
import MailSender from "../../utils/modal/MailSender";
import httpMethods from "../../api/Service";
import { useUserContext } from "../Authcontext/AuthContext";
import { Severity } from "../../utils/modal/notification";

function TicketsTable() {
  const navigate = useNavigate();
  const { alertModal } = useUserContext() as UserContext;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ticketsData, setTicketsData] = useState<TicketModal[]>([]);
  const [modalName, setModalname] = useState<string>("");
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [updateReference, setUpdateReference] = useState<any>({});
  const [usersData, setUsersData] = useState<UserModal[]>([]);

  const handleAddResource = (ticket: any) => {
    setModalname("Assign Ticket");
    setUpdateReference(ticket);
    setModalProps({
      title: "Assign Ticket",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleSendEmail = (ticket: any) => {
    setModalname("Send Mail");
    setUpdateReference(ticket);
    setModalProps({
      title: "Send Mail",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const handleClose = (ticket: TicketModal) => {
    httpMethods
      .put<any, any>("/tickets/update", {
        id: ticket._id,
        data: { isClosed: true },
      })
      .then((res) => {
        setTicketsData((prevTableData) =>
          prevTableData.map((ticket) =>
            ticket._id === res._id ? res : ticket,
          ),
        );
      })
      .catch((err: any) => {
        alertModal({
          severity: Severity.ERROR,
          content: err.message,
          title: "Ticket Update",
        });
      });
  };
  const ticketTableHeaders: TableHeaders<TicketModal>[] = [
    { title: "Client Name", key: "client.name" },
    { title: "User Name", key: "user.name" },
    { title: "Status", key: "status" },
    { title: "Technology", key: "technology" },
    {
      title: "Received Date",
      key: "",
      tdFormat: (ticket) => <>{getFormattedDate(ticket.receivedDate)}</>,
    },
    { title: "Description", key: "description" },
    {
      title: "Helped By",
      key: "",
      tdFormat: (ticket) => (
        <>{ticket.addOnResource.map((val) => val.name).join(", ")}</>
      ),
    },
    {
      title: "Assign Ticket",
      key: "",
      tdFormat: (ticket: any) => (
        <div>
          <button
            className="btn btn-info"
            onClick={() => handleAddResource(ticket)}
            style={{ fontWeight: "700" }}
          >
            {ticket.user.name ? "Assign Resource" : "Assign User"}
          </button>
          <button
            className="btn btn-warning"
            style={{ fontWeight: "700" }}
            onClick={() => handleSendEmail(ticket)}
          >
            Send Email
          </button>
        </div>
      ),
    },
    {
      title: "Close Ticket",
      key: "",
      tdFormat: (ticket) => (
        <Button onClick={() => handleClose(ticket)} disabled={ticket.isClosed}>
          {ticket.isClosed ? "Closed" : "Close Ticket"}
        </Button>
      ),
    },
  ];
  function UpdateTicketsTableData(updatedTicket: TicketModal) {
    setTicketsData((prevTableData) =>
      prevTableData.map((ticket) =>
        ticket.client.id === updatedTicket.client.id ? updatedTicket : ticket,
      ),
    );
  }
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getData<UserModal>("users"),
      getData<any>("tickets/pending-tickets"),
    ])
      .then((results) => {
        setUsersData(results[0]);
        setTicketsData(results[1]);
      })
      .catch((err) => {
        alertModal({
          severity: Severity.ERROR,
          content: err.message,
          title: "API Fetch Users, Pending Tickets",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="text-center">
      <h2>Tickets Table</h2>
      <Button variant="warning" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <TaskTable<TicketModal>
        pagination
        headers={ticketTableHeaders}
        tableData={ticketsData}
        loading={loading}
      />
      {showModal && modalName == "Assign Ticket" && (
        <ReusableModal vals={modalProps}>
          <AssignTicket
            updateref={updateReference}
            usersData={usersData}
            UpdateTicketsTableData={UpdateTicketsTableData}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
      {showModal && modalName == "Send Mail" && (
        <ReusableModal vals={modalProps}>
          <MailSender
            updateReference={updateReference}
            setShowModal={setShowModal}
          />
        </ReusableModal>
      )}
    </div>
  );
}

export default TicketsTable;
