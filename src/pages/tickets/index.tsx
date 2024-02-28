import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { TicketModal } from "../../modals/TicketModals";
import { useNavigate } from "react-router-dom";
import { Props } from "./TicketsMain";
import "./index.css";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import XlSheet from "./XlSheet";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import TicketFilters from "./TicketFilters";
import { getFormattedDate } from "../../utils/utils";
import { Severity } from "../../utils/modal/notification";

const Tickets = ({ url = "/tickets" }: Props) => {
  const navigate = useNavigate();
  const { currentUser, alertModal } = useUserContext() as UserContext;
  const [allTickets, setAllTickets] = useState<TicketModal[]>([]);
  const [showingTickets, setShowingTickets] =
    useState<TicketModal[]>(allTickets);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (url) {
      httpMethods
        .get<TicketModal[]>(url)
        .then((tickets) => {
          setAllTickets(tickets);
          setShowingTickets(tickets);
        })
        .catch((err) =>
          alertModal({
            severity: Severity.ERROR,
            content: err.message,
            title: "Tickets",
          }),
        )
        .finally(() => setLoading(false));
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
  const formattedTicketforXL = (tickets: TicketModal[]) => {
    const formatedData = tickets.map((item, idx) => {
      const resources = item.addOnResource.map((item) => item.name).join(",\n");
      const updates = item.updates.map((item, idx) => {
        const up = `UPDATE ${idx + 1}:\nUpdatedBy : ${
          item.updatedBy.name
        }\nDate: ${new Date(item.date).toLocaleString()},\nDescription : ${
          item.description
        },\nComments : ${item.comments},\nStatus : ${item.status} -----\n\n`;
        return up;
      });
      return {
        "Sl. No": idx + 1,
        "Ticket id": item._id,
        Consultant: item.client.name,
        Owner: item.user.name,
        Technology: item.technology,
        Description: item.description,
        Status: item.status,
        Comments: item.comments,
        "Created Date": new Date(item.receivedDate).toLocaleString(),
        "Closed Date": item.closedDate
          ? new Date(item.closedDate).toLocaleString()
          : "Not Closed",
        "Helped Resources": String(resources),
        Updates: String(updates),
      };
    });
    return formatedData;
  };

  return (
    <>
      <h4 className="text-center">
        <Button onClick={() => navigate(-1)} className="mx-2">
          Back
        </Button>{" "}
        Total Tickets
        {currentUser.isAdmin && (
          <XlSheet data={formattedTicketforXL(showingTickets)} />
        )}
      </h4>
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
