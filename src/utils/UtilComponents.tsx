import React, { Button } from "react-bootstrap";
import { StatusCardProps } from "../modals/UserModals";

export const StatusCard = ({ type, src, count, onClick }: StatusCardProps) => {
  return (
    <div className="user-list mx-2">
      <Button
        className={`btn user-details icon-${
          type === "On Ticket" ? "OnTicket" : type
        } col-8`}
      >
        <div className="d-flex p-2 px-4 col-12">
          <img className="user-icons" src={src} alt={type} />
          <h4>
            <span>{`${count}`}</span>
            {type}
          </h4>
        </div>
        <p className="m-0" onClick={() => onClick(type)}>
          View Details
          <i className="fa fa-arrow-circle-o-right"></i>
        </p>
      </Button>
    </div>
  );
};
