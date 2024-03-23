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
    const timeout = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className={`popup-notification ${severity}`}>
      <span className="close-icon fa fa-times" onClick={handleClose}></span>{" "}
      <p className="content">{content}</p>
      <span className={`line ${severity}`}></span>{" "}
    </div>
  );
};

export default Notification;
