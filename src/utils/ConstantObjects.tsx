import React from "react";
import { BreakInterface } from "../modals/UserModals";
import { getBreakTimings } from "../pages/dashboard/userDashboard/utils";
import { TableHeaders } from "./table/Table";
import { getFormattedDate, getFormattedTime } from "./utils";
import { ClientLocationModal } from "../modals/ClientModals";

export const NEW_TICKET_EMPTY_OBJ = {
  client: {
    name: "",
    id: "",
    mobile: "",
    email: "",
    location: {} as ClientLocationModal,
  },
  user: { name: "", id: "" },
  technology: "",
  description: "",
  targetDate: getFormattedDate(new Date()),
};

export const BREAK_TABLE_HEADERS: TableHeaders<BreakInterface>[] = [
  { title: "Sl. No", key: "serialNo" },
  { title: "Break Type", key: "status" },
  {
    title: "Start",
    key: "startTime",
    tdFormat: (brtime) => <>{getFormattedTime(brtime.startTime)}</>,
  },
  {
    title: "End",
    key: "endTime",
    tdFormat: (brtime) => (
      <>
        {brtime.endTime ? (
          <>{getFormattedTime(brtime.endTime)}</>
        ) : (
          `Still In ${brtime.status}`
        )}
      </>
    ),
  },
  {
    title: "Duration",
    key: "duration",
    tdFormat: (brtime) => (
      <>{brtime.duration ? <>{getBreakTimings(brtime.duration)}</> : "--"}</>
    ),
  },
];
