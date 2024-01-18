import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { TicketModal } from "../../modals/TicketModals";
import { useNavigate } from "react-router-dom";
import { Props } from "./TicketsMain";
import "./index.css";

const Tickets = ({ url }: Props) => {
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState<TicketModal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (url) {
      httpMethods.get<TicketModal[]>(url).then((tickets) => {
        setAllTickets(tickets);
        setLoading(false);
      });
    } else {
      httpMethods.get<TicketModal[]>("/tickets").then((tickets) => {
        setAllTickets(tickets);
        setLoading(false);
      });
    }
  }, []);
  const handleDescription = (ticket: TicketModal) => {
    navigate(`/tickets/${ticket._id}`, { state: ticket });
  };
  const ticketHeaders: TableHeaders<TicketModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Consultant Name", key: "client.name" },
    { title: "Status", key: "status" },
    { title: "User", key: "user.name" },
    { title: "Technology", key: "technology" },
    { title: "Receive Date", key: "receivedDate" },
    {
      title: "Helped",
      key: "addOnResource",
      tdFormat: (ticket) => (
        <>{ticket.addOnResource.map((val) => val.name).join(", ")}</>
      ),
    },
    {
      title: "Description",
      key: "description",
      tdFormat: (tkt) => (
        <>
          {tkt.description}
          <p onClick={() => handleDescription(tkt)} className="desc-link">
            Click here to see full description
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <h4>
        Total Tickets : <button onClick={() => navigate(-1)}>Back</button>
      </h4>
      <TaskTable
        headers={ticketHeaders}
        tableData={allTickets}
        loading={loading}
      />
    </>
  );
};
export default Tickets;
