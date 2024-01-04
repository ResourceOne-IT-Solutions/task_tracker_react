import React, { useState, useEffect } from "react";
import "./Timezones.css";

const time = (timeZone: string, date: Date = new Date()) => {
  return date.toLocaleString("en-US", {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const Timezones = () => {
  const [timeByZones, setTimeByZones] = useState({
    EST: time("America/New_York"),
    PST: time("America/Los_Angeles"),
    CST: time("America/Chicago"),
    IST: time("Asia/Kolkata"),
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const EST = time("America/New_York", d);
      const CST = time("America/Chicago", d);
      const PST = time("America/Los_Angeles", d);
      const IST = time("Asia/Kolkata", d);
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
