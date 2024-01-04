import React, { useState, useEffect } from "react";
import "./Timezones.css";
const Timezones = () => {
  const [timeByZones, setTimeByZones] = useState({
    EST: new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
    PST: new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
    CST: new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
    IST: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const EST = d.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const CST = d.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const PST = d.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const IST = d.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      setTimeByZones({ EST, CST, PST, IST });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="timezone-btns">
        <div className="bg-light rounded">
          <b>PST :</b> {timeByZones.PST}
        </div>
        <div className="bg-light rounded">
          <b>CST :</b> {timeByZones.CST}
        </div>
        <div className="bg-light rounded">
          <b>EST :</b> {timeByZones.EST}
        </div>
      </div>
      <div className="timezone-ist-btn">
        <div className="bg-info rounded">
          <b>IST :</b> {timeByZones.IST}
        </div>
      </div>
    </div>
  );
};
export default Timezones;