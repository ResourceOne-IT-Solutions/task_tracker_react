import React, { useEffect } from "react";

export enum Severity {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
  NULL = "",
}
export interface NotificationProps {
  content: string;
  severity: Severity;
  onClose: (val: boolean) => void;
}

const Notification = ({ content, severity, onClose }: NotificationProps) => {
  const handleClose = () => {
    onClose(false);
  };
  useEffect(() => {
    setTimeout(() => {
      handleClose();
    }, 5000);
  }, []);
  return (
    <div className={`notification ${severity}`}>
      <span className="content">{content}</span>
      <span className={`line ${severity}`}></span>{" "}
      <span className="icon">
        {" "}
        &#9432;{" "}
        <span className="close-icon" onClick={handleClose}>
          {" "}
          X{" "}
        </span>{" "}
      </span>{" "}
    </div>
  );
};

export default Notification;
