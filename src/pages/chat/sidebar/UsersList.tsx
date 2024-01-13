import React, { useEffect, useState } from "react";
import "./styles/userlist.css";
import httpMethods from "../../../api/Service";
import { UserContext, UserModal } from "../../../modals/UserModals";
import { useUserContext } from "../../../components/Authcontext/AuthContext";

const UserList = () => {
  const [users, setUsers] = useState<UserModal[]>([]);

  const userContext = useUserContext();
  const { setSelectedUser } = userContext as UserContext;
  useEffect(() => {
    httpMethods.get<UserModal>("/users/").then((result: any) => {
      setUsers(result);
    });
  }, []);
  const handleProfileClick = (user: UserModal) => {
    setSelectedUser(user);
  };
  return (
    <div className="user-list-container">
      {users?.map((user: UserModal) => {
        return (
          <div
            key={user._id}
            className="user-main"
            onClick={() => handleProfileClick(user)}
          >
            <div className="user">
              <div className="user-img">
                <img src={user?.profileImageUrl} alt="alt" />
              </div>
              <div className="user-name">
                <p>{user.firstName}</p>
                <p>{user.designation}</p>
              </div>
              <div className="user-time-stamp">12:46 PM</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
