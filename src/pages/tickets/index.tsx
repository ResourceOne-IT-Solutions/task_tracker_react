import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { TicketModal } from "../../modals/TicketModals";
import { useNavigate } from "react-router-dom";
import { Props } from "./TicketsMain";
import "./index.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import TicketFilters from "./TicketFilters";
import { getFormattedDate } from "../../utils/utils";

const Tickets = ({ url = "/tickets" }: Props) => {
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState<TicketModal[]>([]);
  const [showingTickets, setShowingTickets] =
    useState<TicketModal[]>(allTickets);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (url) {
      httpMethods.get<TicketModal[]>(url).then((tickets) => {
        setAllTickets(tickets);
        setShowingTickets(tickets);
        setLoading(false);
      });
    }
  }, [url]);
  const handleDescription = (ticket: TicketModal) => {
    navigate(`/tickets/${ticket._id}`, { state: ticket });
  };
  const ticketHeaders: TableHeaders<TicketModal>[] = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Consultant Name", key: "client.name" },
    { title: "Status", key: "status" },
    { title: "User", key: "user.name" },
    { title: "Technology", key: "technology" },
    {
      title: "Received Date",
      key: "receivedDate",
      tdFormat: (tkt) => <span>{getFormattedDate(tkt.receivedDate)}</span>,
    },
    {
      title: "Closed Date",
      key: "closedDate",
      tdFormat: (tkt) => (
        <span>
          {tkt.closedDate == null ? "--" : getFormattedDate(tkt.closedDate)}
        </span>
      ),
    },
    { title: "Comments", key: "comments" },
    {
      title: "TargetDate",
      key: "targetDate",
      tdFormat: (tkt) => <span>{getFormattedDate(tkt.targetDate)}</span>,
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
  ];

  return (
    <>
      <h4 className="text-center">Total Tickets</h4>
      <TicketFilters
        allTickets={allTickets}
        setShowingTickets={setShowingTickets}
      />
      <TaskTable
        headers={ticketHeaders}
        tableData={showingTickets}
        loading={loading}
        pagination
      />
    </>
  );
};
export default Tickets;
