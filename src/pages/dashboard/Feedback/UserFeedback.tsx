import React, { useEffect, useState } from "react";
import httpMethods from "../../../api/Service";
import TaskTable, { TableHeaders } from "../../../utils/table/Table";
import {
  getFormattedDate,
  getFormattedTime,
  getFullName,
} from "../../../utils/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const UserFeedback = () => {
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  useEffect(() => {
    httpMethods.get("/users/feedback").then((res: any) => {
      setUserFeedbacks(res);
    });
  }, []);
  const handleDetailClick = (feedback: any) => {
    setSelectedFeedback(feedback);
  };
  const ticketTableHeaders: TableHeaders<any>[] = [
    { title: "Sl. No", key: "serialNo" },
    { title: "Sender Name", key: "sender.name" },
    {
      title: "Time",
      key: "",
      tdFormat: (feedback) => (
        <>
          {getFormattedDate(feedback.time)} {getFormattedTime(feedback.time)}
        </>
      ),
    },
    { title: "Type", key: "type" },
    {
      title: "Description",
      key: "",
      tdFormat: (feedback) => (
        <p
          style={{
            textOverflow: "ellipsis",
            height: "20px",
            overflow: "hidden",
            width: "20%",
          }}
        >
          {feedback.content.slice(0, 20)}
        </p>
      ),
    },
    {
      title: "File Image",
      key: "files",
      tdFormat: (feedback) =>
        feedback.files && feedback.files.length > 0 ? (
          <img
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              position: "relative",
            }}
            src={`data:${feedback.files[0].mimetype};base64,${feedback.files[0].buffer}`}
            alt="Feedback Image"
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: "Details",
      key: "",
      tdFormat: (feedback) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Click here to view in detail</Tooltip>}
        >
          <div onClick={() => handleDetailClick(feedback)}>
            {" "}
            <a
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "blue",
              }}
            >
              click here
            </a>
          </div>
        </OverlayTrigger>
      ),
    },
  ];
  return (
    <div className="user-feedback">
      <h1 className="text-center">User Feedbacks</h1>
      <TaskTable<any>
        pagination
        headers={ticketTableHeaders}
        tableData={userFeedbacks}
        loading={loading}
      />
      {selectedFeedback && (
        <div className="selected-feedback-details mx-auto w-75">
          <h2 className="text-center">Selected Feedback Details</h2>
          <p>{selectedFeedback.sender.name}</p>
          <p>{selectedFeedback.content}</p>
          {selectedFeedback.files && selectedFeedback.files.length > 0 && (
            <img
              style={{
                width: "500px",
                height: "500px",
                position: "relative",
              }}
              src={`data:${selectedFeedback.files[0].mimetype};base64,${selectedFeedback.files[0].buffer}`}
              alt="Selected Feedback Image"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
