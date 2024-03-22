import React, { useEffect, useState } from "react";
import { LoginTimingInterface, UserModal } from "../../../../modals/UserModals";
import {
  getFormattedDate,
  getFormattedTime,
  isEmptyObject,
} from "../../../../utils/utils";
import { calculateLoginHours } from ".";
import { NO_DATA_AVAILBALE } from "../../../../utils/Constants";

interface LoginTimingsProps {
  user: UserModal;
  todayOnly?: boolean;
}

const LoginTimings = ({ user, todayOnly = false }: LoginTimingsProps) => {
  const [todayLogin, setTodayLogin] = useState<LoginTimingInterface>(
    {} as LoginTimingInterface,
  );

  useEffect(() => {
    if (todayOnly) {
      const today = getFormattedDate(new Date());
      const todayLogin =
        user.loginTimings.find(
          (time) => getFormattedDate(time.inTime) === today,
        ) || {};
      setTodayLogin(todayLogin as LoginTimingInterface);
    }
  }, [user.loginTimings]);
  return (
    <div
      style={{ maxHeight: "300px", overflow: "hidden scroll" }}
      className="fw-semibold"
    >
      {todayOnly ? (
        <>
          {isEmptyObject(todayLogin) ? (
            <NO_DATA_AVAILBALE />
          ) : (
            <>
              <span className="fw-semibold">
                {getFormattedDate(todayLogin.date, "dd-mm-yyyy")}
              </span>{" "}
              Login - {getFormattedTime(todayLogin.inTime)} - Logout -{" "}
              {todayLogin.outTime
                ? getFormattedTime(todayLogin.outTime)
                : "---"}{" "}
            </>
          )}
        </>
      ) : (
        <>
          {user.loginTimings.length ? (
            <table>
              <thead className="timings-table-header">
                <tr>
                  <th>Date</th>
                  <th>Login</th>
                  <th>Logout</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {user.loginTimings.map((timing) => (
                  <tr key={timing._id}>
                    <td>{getFormattedDate(timing.date, "dd-mm-yyyy")}</td>
                    <td>{getFormattedTime(timing.inTime)}</td>
                    <td>
                      {timing.outTime
                        ? getFormattedTime(timing.outTime)
                        : "---"}
                    </td>
                    <td>
                      {calculateLoginHours(timing.inTime, timing.outTime)}
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
    </div>
  );
};

export default LoginTimings;
