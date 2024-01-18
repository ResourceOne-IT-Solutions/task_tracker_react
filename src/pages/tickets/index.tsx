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
    { title: "Received Date", key: "receivedDate" },
    { title: "Closed Date", key: "closedDate" },
    { title: "Comments", key: "comments" },
    {
      title: "TargetDate",
      key: "targetDate",
      tdFormat: (ticket) => <p>{ticket?.targetDate}</p>,
    },
    {
      title: "Helped By",
      key: "addOnResource",
      tdFormat: (ticket) => (
        <p
          style={{
            textOverflow: "ellipsis",
            height: "20px",
            overflow: "hidden",
          }}
        >
          {ticket.addOnResource.map((val) => val.name).join(", ")}
        </p>
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
