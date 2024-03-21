import React, { useEffect, useState } from "react";
import { getFormattedDate, getFormattedTime } from "../../../../utils/utils";
import { getBreakTimings } from ".";
import {
  BreakInterface,
  BreakInterfaceObject,
  Status,
  UserModal,
} from "../../../../modals/UserModals";
import ReusableModal from "../../../../utils/modal/ReusableModal";
import { Button, Modal } from "react-bootstrap";
import TaskTable, { TableHeaders } from "../../../../utils/table/Table";
import { BREAK_TABLE_HEADERS } from "../../../../utils/ConstantObjects";
import { NO_DATA_AVAILBALE } from "../../../../utils/Constants";

interface BreakTimingProps {
  user: UserModal;
  todayOnly?: boolean;
}
interface DayWiseBreakTimingsProps {
  dayTimings: BreakInterface[];
}
interface BreaksTableModal {
  show: boolean;
  content: {
    date: string;
    dayTimings: BreakInterface[];
  };
}
const EMPTY_BREAK_MODAL = {
  show: false,
  content: {
    date: "",
    dayTimings: [],
  },
};
const BreakTimings = ({ user, todayOnly = false }: BreakTimingProps) => {
  const [breakTimings, setBreakTimings] = useState<BreakInterfaceObject>({});
  const [todayTimings, setTodayTimings] = useState<BreakInterface[]>([]);
  const [showBreakTable, setShowBreakTable] =
    useState<BreaksTableModal>(EMPTY_BREAK_MODAL);

  const handleRowClick = (dayTimings: BreakInterface[], date: string) => {
    setShowBreakTable({
      show: true,
      content: {
        date,
        dayTimings,
      },
    });
  };
  const modalClose = () => {
    setShowBreakTable(EMPTY_BREAK_MODAL);
  };
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
  }, [user.breakTime]);
  return (
    <div style={{ maxHeight: "300px", overflow: "hidden scroll" }}>
      {todayOnly ? (
        <DayWiseBreakTimings dayTimings={todayTimings} />
      ) : (
        <>
          {Object.entries(breakTimings).length ? (
            <table>
              <thead className="timings-table-header">
                <tr>
                  <th>Date</th>
                  <th>Breaks</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(breakTimings).map(([date, timing]) => (
                  <tr key={date} onClick={() => handleRowClick(timing, date)}>
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
          ) : (
            <NO_DATA_AVAILBALE />
          )}
        </>
      )}
      {showBreakTable.show && (
        <Modal show={showBreakTable.show} onHide={modalClose}>
          <Modal.Header closeButton className="popup-header">
            <Modal.Title>
              Break Timings- {showBreakTable.content.date}{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DayWiseBreakTimings
              dayTimings={showBreakTable.content.dayTimings}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={modalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export const DayWiseBreakTimings = ({
  dayTimings,
}: DayWiseBreakTimingsProps) => {
  return (
    <div className="fw-semibold">
      {dayTimings.length ? (
        <>
          Total Break Time: &nbsp;
          {getBreakTimings(
            dayTimings.reduce(
              (acc: number, obj: BreakInterface) => acc + (obj?.duration || 0),
              0,
            ),
          )}
          <div>
            <TaskTable<BreakInterface>
              height="300px"
              headers={BREAK_TABLE_HEADERS}
              tableData={dayTimings}
              loading={false}
            />
          </div>
        </>
      ) : (
        <NO_DATA_AVAILBALE />
      )}
    </div>
  );
};

export default BreakTimings;
