import React, { useEffect, useState } from "react";
import { getFormattedDate, getFormattedTime } from "../../../../utils/utils";
import { getBreakTimings } from ".";
import {
  BreakInterface,
  BreakInterfaceObject,
  UserModal,
} from "../../../../modals/UserModals";

interface BreakTimingProps {
  user: UserModal;
  todayOnly?: boolean;
}

const BreakTimings = ({ user, todayOnly = false }: BreakTimingProps) => {
  const [breakTimings, setBreakTimings] = useState<BreakInterfaceObject>({});
  const [todayTimings, setTodayTimings] = useState<BreakInterface[]>([]);
  useEffect(() => {
    const groupedByStartDate = user.breakTime.reduce(
      (acc: { [key: string]: BreakInterface[] }, obj) => {
        const startDate = obj.startDate;
        if (!acc[startDate]) {
          acc[startDate] = [];
        }
        acc[startDate].push(obj);
        return acc;
      },
      {},
    );
    const todayTiming = groupedByStartDate[getFormattedDate(new Date())] ?? [];
    setTodayTimings(todayTiming);
    setBreakTimings(groupedByStartDate);
  }, []);
  return (
    <>
      {todayOnly ? (
        <>
          <div className="fw-semibold">
            {todayTimings.length ? (
              <>
                Break Time ={">"}
                {getBreakTimings(
                  todayTimings.reduce(
                    (acc: number, obj: BreakInterface) =>
                      acc + (obj?.duration || 0),
                    0,
                  ),
                )}
              </>
            ) : (
              <span>Data not available</span>
            )}
          </div>
          <div>
            {todayTimings.map((brtime: BreakInterface, i: number) => {
              return (
                <span className="d-block" key={i}>
                  <span>{brtime.status} : </span>{" "}
                  {getFormattedTime(brtime.startTime)} ---{" "}
                  {brtime.endTime ? (
                    <>{getFormattedTime(brtime.endTime)}</>
                  ) : (
                    `Still In ${user.status}`
                  )}
                  {brtime.duration ? (
                    <>- Duration: {getBreakTimings(brtime.duration)}</>
                  ) : (
                    ""
                  )}
                </span>
              );
            })}
          </div>
        </>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Breaks</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(breakTimings).map(([date, timing]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{timing.length}</td>
                <td>
                  {getBreakTimings(
                    timing.reduce(
                      (acc: number, obj: BreakInterface) =>
                        acc + (obj?.duration || 0),
                      0,
                    ),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default BreakTimings;
