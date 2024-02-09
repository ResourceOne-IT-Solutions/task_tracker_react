import React, { useEffect, useState } from "react";
import { TicketModal } from "../../../modals/TicketModals";
import TaskTable, { TableHeaders } from "../../../utils/table/Table";
import { ClientModal } from "../../../modals/ClientModals";
import httpMethods from "../../../api/Service";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext, UserModal } from "../../../modals/UserModals";
import { Button } from "react-bootstrap";
import { getData, getFullName } from "../../../utils/utils";
import ReusableModal from "../../../utils/modal/ReusableModal";
import TicketRaiseModal from "../../../utils/modal/TicketRaiseModal";
import UpdateTicket from "../../../utils/modal/UpdateUserModal";

function UserDashboardTickets() {
  const userContext = useUserContext();
  const { currentUser, socket } = userContext as UserContext;
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TicketModal[]>([]);
  const [userData, setUserData] = useState([]);
  const [admins, setAdmins] = useState<UserModal[]>([]);
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
      const onlyAdmins = userData.filter((user: UserModal) => user.isAdmin);
      setAdmins(onlyAdmins);
      setModalname("Ticket Raise");
      setModalProps({
        title: "Ticket Raise",
        setShowModal,
        show: !showModal,
      });
      setShowModal(true);
    }
  };
  socket.off("ticketRaiseStatus").on("ticketRaiseStatus", (msg) => {
    alert(msg);
  });
  const handleRequest = (items: TicketModal) => {
    socket.emit("requestTickets", {
      client: { id: items.client.id, name: items.client.name },
      sender: { id: currentUser._id, name: getFullName(currentUser) },
    });
  };
  const userDashbHeaders: TableHeaders<TicketModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Consultant", key: "client.name" },
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
    { title: "Description", key: "description" },
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
          <Button variant={"dark"} onClick={() => handleRequest(ticket)}>
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
      .get<TicketModal[]>("/users/tickets/" + currentUser._id)
      .then((result) => {
        setTableData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    getData<UserModal>("users")
      .then((res: any) => {
        setUserData(res);
      })
      .catch((err) => err);
  }, []);
  return (
    <div className="text-center">
      <h1>My Tickets</h1>
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
          <TicketRaiseModal adminsData={admins} setShowModal={setShowModal} />
        </ReusableModal>
      )}
    </div>
  );
}

export default UserDashboardTickets;