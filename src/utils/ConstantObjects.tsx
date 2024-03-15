import React from "react";
import { BreakInterface } from "../modals/UserModals";
import { getBreakTimings } from "../pages/dashboard/userDashboard/utils";
import { TableHeaders } from "./table/Table";
import { getFormattedTime } from "./utils";

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
