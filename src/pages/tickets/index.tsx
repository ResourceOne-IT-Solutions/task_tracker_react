import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { TicketModal } from "../../modals/TicketModals";
import { useNavigate } from "react-router-dom";
import { Props } from "./TicketsMain";
import "./index.css";
import { Button, Dropdown } from "react-bootstrap";
import XlSheet from "./XlSheet";
import { FILTERS } from "../../utils/Constants";

const Tickets = ({ url }: Props) => {
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState<TicketModal[]>([]);
  const [showingTickets, setShowingTickets] =
    useState<TicketModal[]>(allTickets);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  useEffect(() => {
    setLoading(true);
    if (url) {
      httpMethods.get<TicketModal[]>(url).then((tickets) => {
        setAllTickets(tickets);
        setShowingTickets(tickets);
        setLoading(false);
      });
    } else {
      httpMethods.get<TicketModal[]>("/tickets").then((tickets) => {
        setAllTickets(tickets);
        setShowingTickets(tickets);
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
      tdFormat: (ticket) => <p>{ticket?.targetDate?.toLocaleString()}</p>,
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
  const handleSelectStatus = (item: any) => {
    const date = new Date();
    setSelected(item);
    if (item == "last 1 week") {
      date.setDate(date.getDate() - 7);
      const lastWeekArray = allTickets.filter(
        (item) => new Date(item.receivedDate) >= date,
      );
      setShowingTickets(lastWeekArray);
    } else if (item == "last 1 month" || item == "last 2 months") {
      const month = item == "last 1 month" ? 1 : 2;
      date.setMonth(date.getMonth() - month);
      const lastMonthArray = allTickets.filter(
        (item) => new Date(item.receivedDate) >= date,
      );
      setShowingTickets(lastMonthArray);
    }
    setDateRange({ from: "", to: "" });
  };
  const handleDateRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };
  const handleDateRangeSubmit = () => {
    const filtered_data = allTickets.filter((item) => {
      const receivedDate = new Date(item.receivedDate);
      return (
        receivedDate >= new Date(dateRange.from) &&
        receivedDate <= new Date(dateRange.to)
      );
    });
    setShowingTickets(filtered_data);
    setSelected("");
  };
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
        Total Tickets : <Button onClick={() => navigate(-1)}>Back</Button>{" "}
        <XlSheet data={formattedTicketforXL(showingTickets)} />
      </h4>
      <div className="filters">
        <Dropdown onSelect={handleSelectStatus} className="drop-down">
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic-ticket-filter"
          >
            {selected ? selected : "Select a filter"}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
            {FILTERS.map((filterType, idx) => {
              return (
                <Dropdown.Item key={idx} eventKey={filterType}>
                  <b>{filterType}</b>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <div className="from-to">
          <label htmlFor="from">From</label>
          <input
            type="date"
            name="from"
            id="from"
            onChange={handleDateRange}
            value={dateRange.from}
            className="form-control"
          />
          <label htmlFor="to">To</label>
          <input
            type="date"
            name="to"
            id="to"
            onChange={handleDateRange}
            value={dateRange.to}
            className="form-control"
          />
          <button
            className="btn btn-info"
            onClick={() => handleDateRangeSubmit()}
            disabled={!dateRange.from || !dateRange.to ? true : false}
          >
            GetTickets
          </button>
        </div>
      </div>
      <TaskTable
        headers={ticketHeaders}
        tableData={showingTickets}
        loading={loading}
      />
    </>
  );
};
export default Tickets;
