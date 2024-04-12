import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import {
  EMPTY_TICKET_FILTER_OBJ,
  FILTERS,
  TICKET_STATUS_TYPES,
} from "../../utils/Constants";
import { TICKET_FILTERTYPE, TicketModal } from "../../modals/TicketModals";
import { useNavigate } from "react-router-dom";
import XlSheet from "./XlSheet";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
import {
  checkClientName,
  checkDateWise,
  checkDuration,
  checkStatus,
} from "../../utils/utils";

interface TicketFilterProps {
  allTickets: TicketModal[];
  setShowingTickets: React.Dispatch<React.SetStateAction<TicketModal[]>>;
}

const TicketFilters = ({
  allTickets,
  setShowingTickets,
}: TicketFilterProps) => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext() as UserContext;
  const [filteredData, setFilteredData] = useState<TicketModal[]>(allTickets);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [clients, setClients] = useState<string[]>([]);
  const [filters, setFilters] = useState(EMPTY_TICKET_FILTER_OBJ);

  const handleFilters = (name: TICKET_FILTERTYPE, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    const selectedDate = newFilters.date.split(":");
    const from = new Date(selectedDate[0]);
    const to = new Date(selectedDate[1]);
    const filteredData = allTickets.filter((ticket) => {
      if (
        checkDuration(ticket, newFilters.duration) &&
        checkClientName(ticket, newFilters.clientName) &&
        checkStatus(ticket, newFilters.status) &&
        checkDateWise(ticket, from, to)
      ) {
        return true;
      }
      return false;
    });
    setShowingTickets(filteredData);
    setFilteredData(filteredData);
  };
  const handleDateRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };
  const handleDateRangeSubmit = () => {
    const newRange = dateRange.from + ":" + dateRange.to;
    handleFilters(TICKET_FILTERTYPE.DATE, newRange);
  };
  const handleResetFilter = () => {
    setShowingTickets(allTickets);
    setDateRange({ from: "", to: "" });
    setFilters(EMPTY_TICKET_FILTER_OBJ);
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
  useEffect(() => {
    setShowingTickets(filteredData);
  }, [filteredData]);
  useEffect(() => {
    const clients = [...new Set(allTickets.map((tkt) => tkt.client.name))];
    setClients(clients);
  }, [allTickets]);

  return (
    <div className="container">
      <div className="filters">
        <div className="d-flex">
          <div className="d-flex my-1 flex-wrap">
            <Button className="back-btn" onClick={() => navigate(-1)}>
              <i className="fa fa-angle-left"></i>
              Back
            </Button>{" "}
            <Dropdown
              onSelect={(item: any) =>
                handleFilters(TICKET_FILTERTYPE.DURATION, item)
              }
              className="mx-2"
            >
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-ticket-date-filter"
              >
                {filters.duration ? filters.duration : "Select duration"}
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
            <Dropdown
              onSelect={(status: any) =>
                handleFilters(TICKET_FILTERTYPE.STATUS, status)
              }
              className="mx-2"
            >
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-ticket-status-filter"
              >
                {filters.status ? filters.status : "Select Status"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {Object.values(TICKET_STATUS_TYPES).map((filterType, idx) => {
                  return (
                    <Dropdown.Item key={idx} eventKey={filterType}>
                      <b>{filterType}</b>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              onSelect={(client: any) =>
                handleFilters(TICKET_FILTERTYPE.CLIENT_NAME, client)
              }
              className="mx-2"
            >
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-ticket-client-filter"
              >
                {filters.clientName ? filters.clientName : "Select Client"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {clients.map((client, idx) => {
                  return (
                    <Dropdown.Item key={idx} eventKey={client}>
                      <b>{client}</b>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="d-flex">
          <button
            className="btn btn-info m-1"
            onClick={() => handleDateRangeSubmit()}
            disabled={!dateRange.from || !dateRange.to ? true : false}
          >
            GetTickets
          </button>
          <Button onClick={handleResetFilter} className="mx-2 m-1">
            Reset Filters
          </Button>
          {currentUser.isAdmin && (
            <XlSheet data={formattedTicketforXL(filteredData)} />
          )}
        </div>
      </div>
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
      </div>
    </div>
  );
};

export default TicketFilters;
