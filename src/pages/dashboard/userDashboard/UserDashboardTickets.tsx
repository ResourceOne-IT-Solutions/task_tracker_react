import React, { useEffect, useState } from "react";
import { TicketModal } from "../../../modals/TicketModals";
import TaskTable, { TableHeaders } from "../../../utils/table/Table";
import httpMethods from "../../../api/Service";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext } from "../../../modals/UserModals";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Description, getFullName } from "../../../utils/utils";
import ReusableModal from "../../../utils/modal/ReusableModal";
import TicketRaiseModal from "../../../utils/modal/TicketRaiseModal";
import UpdateTicket from "../../../utils/modal/UpdateUserModal";
import { useNavigate } from "react-router-dom";

function UserDashboardTickets() {
  const userContext = useUserContext();
  const { currentUser, socket } = userContext as UserContext;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TicketModal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalName, setModalname] = useState<string>("");
  const [modalProps, setModalProps] = useState({
    title: "",
    setShowModal,
    show: showModal,
  });
  const [showUpdateModal, setShowUpdateModal] = useState<{
    show: boolean;
    ticketData: TicketModal;
  }>({
    show: false,
    ticketData: {} as TicketModal,
  });
  const dateConversion = (date: Date) => new Date(date).toLocaleDateString();

  const handleTicketRaise = () => {
    if (!currentUser.isAdmin) {
      setModalname("Ticket Raise");
      setModalProps({
        title: "Ticket Raise",
        setShowModal,
        show: !showModal,
      });
      setShowModal(true);
    }
  };
  const handleRequest = (items: TicketModal) => {
    socket.emit("requestTickets", {
      client: { id: items.client.id, name: items.client.name },
      sender: { id: currentUser._id, name: getFullName(currentUser) },
    });
  };
  const handleDescription = (ticket: TicketModal) => {
    navigate(`/tickets/${ticket._id}`, { state: ticket });
  };
  const userDashbHeaders: TableHeaders<TicketModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    {
      title: "Consultant",
      key: "client.name",
      tdFormat: (tikcet) => (
        <>
          <span>{tikcet.client.name}</span>
          <span className="fw-semibold">
            {tikcet.client.location.area}-{tikcet.client.location.zone}
          </span>
        </>
      ),
    },
    { title: "User", key: "user.name" },
    { title: "Technology", key: "technology" },
    {
      title: "Received Date",
      key: "",
      tdFormat: (ticket: TicketModal) => (
        <>{dateConversion(ticket.receivedDate)}</>
      ),
    },
    {
      title: "Assigned Date",
      key: "",
      tdFormat: (ticket: TicketModal) => (
        <>
          {ticket.assignedDate
            ? dateConversion(ticket.assignedDate)
            : "Not assigned"}
        </>
      ),
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
    { title: "Comments", key: "comments" },
    {
      title: "Target Date",
      key: "",
      tdFormat: (ticket: TicketModal) => (
        <>{dateConversion(ticket.targetDate)}</>
      ),
    },
    {
      title: "Closed Date",
      key: "",
      tdFormat: (ticket: TicketModal) => (
        <>{dateConversion(ticket.closedDate)}</>
      ),
    },
    { title: "Status", key: "status" },
    {
      title: (
        <Button variant="danger" onClick={() => handleTicketRaise()}>
          Ticket Raise
        </Button>
      ),
      key: "",
      tdFormat: (ticket: TicketModal) => (
        <>
          <Button
            variant="success"
            onClick={() =>
              setShowUpdateModal({
                show: true,
                ticketData: ticket,
              })
            }
            disabled={ticket.isClosed}
          >
            Update Ticket
          </Button>
        </>
      ),
    },
    {
      title: "Request Tickets",
      key: "",
      tdFormat: (ticket: TicketModal) => (
        <>
          <Button
            variant={"dark"}
            onClick={() => handleRequest(ticket)}
            disabled={ticket.isClosed}
          >
            Request Ticket
          </Button>
        </>
      ),
    },
  ];
  const updateTableData = (updatedTicket: TicketModal) => {
    setTableData((prevTableData) =>
      prevTableData.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket,
      ),
    );
  };
  useEffect(() => {
    setLoading(true);
    httpMethods
      .get<TicketModal[]>("/tickets/user/pending-tickets/" + currentUser._id)
      .then((result) => {
        setTableData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  return (
    <div className="text-center">
      <h1>
        My Tickets{" "}
        <Button variant="danger" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </h1>
      <TaskTable<TicketModal>
        pagination
        headers={userDashbHeaders}
        tableData={tableData}
        loading={loading}
      />
      <UpdateTicket
        show={showUpdateModal.show}
        onHide={() =>
          setShowUpdateModal({ show: false, ticketData: {} as TicketModal })
        }
        ticketData={showUpdateModal.ticketData}
        updateTableData={updateTableData}
      />
      {showModal && modalName == "Ticket Raise" && (
        <ReusableModal vals={modalProps}>
          <TicketRaiseModal setShowModal={setShowModal} />
        </ReusableModal>
      )}
    </div>
  );
}

export default UserDashboardTickets;
