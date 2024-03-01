import React, { useEffect, useState } from "react";
import { LoginTimingInterface, UserModal } from "../../../../modals/UserModals";
import {
  getFormattedDate,
  getFormattedTime,
  isEmptyObject,
} from "../../../../utils/utils";

interface LoginTimingsProps {
  user: UserModal;
  todayOnly?: boolean;
}

const LoginTimings = ({ user, todayOnly = false }: LoginTimingsProps) => {
  const [todayLogin, setTodayLogin] = useState<LoginTimingInterface>(
    {} as LoginTimingInterface,
  );

  useEffect(() => {
    const today = getFormattedDate(new Date());
    const todayLogin =
      user.loginTimings.find(
        (time) => getFormattedDate(time.inTime) === today,
      ) || {};
    setTodayLogin(todayLogin as LoginTimingInterface);
  }, []);
  return (
    <>
      {todayOnly ? (
        <>
          {isEmptyObject(todayLogin) ? (
            <span>Data not available</span>
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
        <table>
          <thead>
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
                  {timing.outTime ? getFormattedTime(timing.outTime) : "---"}
                </td>
                <td>2 hrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default LoginTimings;
