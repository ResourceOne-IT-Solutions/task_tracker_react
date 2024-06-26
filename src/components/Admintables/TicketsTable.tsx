import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TicketModal } from "../../modals/TicketModals";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { Description, getData, getFormattedDate } from "../../utils/utils";
import AssignTicket from "../../utils/modal/AssignTicket";
import ReusableModal from "../../utils/modal/ReusableModal";
import { UserContext, UserModal } from "../../modals/UserModals";
import MailSender from "../../utils/modal/MailSender";
import { useUserContext } from "../Authcontext/AuthContext";
import { Severity } from "../../utils/modal/notification";
import CloseTicketModal from "../../utils/modal/CloseTicketModal";

function TicketsTable() {
  const navigate = useNavigate();
  const { alertModal, currentUser } = useUserContext() as UserContext;
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
  const handleTicketClose = (ticket: TicketModal) => {
    setModalname("Close Ticket");
    setUpdateReference(ticket);
    setModalProps({
      title: "Close Ticket",
      setShowModal: setShowModal,
      show: !showModal,
    });
    setShowModal(true);
  };
  const updateTicketsTable = (res: any) => {
    setTicketsData((prevTableData) =>
      prevTableData.map((ticket) => (ticket._id === res._id ? res : ticket)),
    );
  };
  const handleDescription = (ticket: TicketModal) => {
    navigate(`/tickets/${ticket._id}`, { state: ticket });
  };
  const ticketTableHeaders: TableHeaders<TicketModal>[] = [
    {
      title: "Client Name",
      key: "client.name",
      tdFormat: (tikcet) => (
        <>
          <span>{tikcet.client.name}</span>
          <div className="fw-semibold">
            {tikcet?.client?.location?.area || "N/A"}-
            {tikcet.client.location.zone}
          </div>
        </>
      ),
    },
    { title: "User Name", key: "user.name" },
    { title: "Status", key: "status" },
    { title: "Technology", key: "technology" },
    {
      title: "Received Date",
      key: "",
      tdFormat: (ticket) => <>{getFormattedDate(ticket.receivedDate)}</>,
    },
    {
      title: "Description",
      key: "description",
      tdFormat: (tkt) => (
        <>
          <Description content={tkt.description} />
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Click here to see full description</Tooltip>}
          >
            <p onClick={() => handleDescription(tkt)} className="desc-link">
              Click here
            </p>
          </OverlayTrigger>
        </>
      ),
    },
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
          <div className="my-1">
            <button
              className="btn btn-info m-1 w-100"
              onClick={() => handleAddResource(ticket)}
              style={{ fontWeight: "700" }}
              disabled={ticket.isClosed}
            >
              {ticket.user.name ? "Assign Resource" : "Assign User"}
            </button>
          </div>
          <div className="my-1">
            <button
              className="btn btn-warning m-1 w-100"
              style={{ fontWeight: "700" }}
              onClick={() => handleSendEmail(ticket)}
            >
              Send Email
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Close Ticket",
      key: "",
      tdFormat: (ticket) => (
        <Button onClick={() => handleTicketClose(ticket)}>
          {ticket.isClosed ? "Reopen" : "Close Ticket"}
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
  // Trying to create Server Sent Event
  // const getUpdatedTickets = () => {
  //   getData<any>("tickets/updated-ticket")
  //     .then((res) => {
  //       getUpdatedTickets();
  //     })
  //     .catch((err) => {
  //       console.log("ERR::", err);
  //     });
  // };
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getData<UserModal>("users"),
      getData<any>("tickets/pending-tickets"),
    ])
      .then((results) => {
        setUsersData(results[0]);
        setTicketsData(results[1]);
        //getUpdatedTickets();
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
      <h2 className="py-2">
        <Button
          className="pull-left"
          variant="warning"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        Tickets Table
      </h2>
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
      {showModal && modalName == "Close Ticket" && (
        <ReusableModal vals={modalProps}>
          <CloseTicketModal
            updateReference={updateReference}
            setShowModal={setShowModal}
            updateTicketsTable={updateTicketsTable}
          />
        </ReusableModal>
      )}
    </div>
  );
}

export default TicketsTable;
