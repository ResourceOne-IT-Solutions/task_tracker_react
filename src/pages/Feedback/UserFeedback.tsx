import React, { useEffect, useState } from "react";
import httpMethods from "../../api/Service";
import TaskTable, { TableHeaders } from "../../utils/table/Table";
import { getFormattedDate, getFormattedTime } from "../../utils/utils";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { Severity } from "../../utils/modal/notification";
import { UserContext } from "../../modals/UserModals";

const UserFeedback = () => {
  const { alertModal } = useUserContext() as UserContext;
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [showFeedbackTable, setshowFeedbackTable] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    httpMethods
      .get("/users/feedback")
      .then((res: any) => {
        setUserFeedbacks(res);
      })
      .catch((err: any) => {
        alertModal({
          severity: Severity.ERROR,
          content: err.message,
          title: "Feedback Alert",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const handleDetailClick = (feedback: any) => {
    setSelectedFeedback(feedback);
    setshowFeedbackTable(false);
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
        <span
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {feedback.content.slice(0, 50)}
        </span>
      ),
    },
    {
      title: "File Image",
      key: "files",
      tdFormat: (feedback) =>
        feedback.files && feedback.files.length > 0 ? (
          <>
            <div className="count">
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  cursor: "pointer",
                  position: "relative",
                }}
                src={`data:${feedback.files[0].mimetype};base64,${feedback.files[0].buffer}`}
                alt="Feedback Image"
              />
              <p>
                {feedback.files.length > 1 && (
                  <b>{feedback.files.length - 1}</b>
                )}
              </p>
            </div>
          </>
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
      {showFeedbackTable && (
        <>
          <h1 className="text-center">User Feedbacks</h1>
          <TaskTable<any>
            pagination
            headers={ticketTableHeaders}
            tableData={userFeedbacks}
            loading={loading}
          />
        </>
      )}
      {selectedFeedback && showFeedbackTable == false && (
        <div className="selected-feedback-details mx-auto w-75">
          <Button
            className="my-4"
            variant="success"
            onClick={() => setshowFeedbackTable(true)}
          >
            Go To Feedbacks
          </Button>{" "}
          <h2 className="text-center">Feedback Description</h2>
          <p>
            <b>Name:</b> {selectedFeedback.sender.name}
          </p>
          <p>
            <b>Time:</b> {getFormattedDate(selectedFeedback.time)}{" "}
            {getFormattedTime(selectedFeedback.time)}
          </p>
          <p>
            <b>Feedback:</b> {selectedFeedback.content}
          </p>
          {selectedFeedback.files && selectedFeedback.files.length > 0 ? (
            <>
              <p>
                <b>Images: </b>
              </p>
              {selectedFeedback.files.map((feed: any, index: any) => {
                return (
                  <div key={index} className="my-3">
                    <img
                      className="mx-3"
                      style={{
                        width: "80%",
                        height: "600px",
                        position: "relative",
                      }}
                      src={`data:${feed.mimetype};base64,${feed.buffer}`}
                      alt="Selected Feedback Image"
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <p>
                <b>Images: </b>
              </p>
              <span>No image</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
