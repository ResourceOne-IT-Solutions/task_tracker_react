import React, { useEffect, useState } from "react";
import httpMethods from "../../../api/Service";

const UserFeedback = () => {
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  useEffect(() => {
    httpMethods.get("/users/feedback").then((res: any) => {
      setUserFeedbacks(res);
    });
  }, []);
  return (
    <div className="user-feedback">
      <h1>User Feedbacks</h1>
      {userFeedbacks.map((data: any, index: any) => {
        return (
          <ul key={index}>
            <li>{data.content}</li>
          </ul>
        );
      })}
    </div>
  );
};

export default UserFeedback;
