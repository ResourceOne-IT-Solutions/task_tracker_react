import React, { useEffect, useRef, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { UserContext, UserModal } from "../../../modals/UserModals";
import httpMethods from "../../../api/Service";
import { getFullName } from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { GroupInterface } from "./Groups";

interface CreateGroupProps {
  onCreateGroup: (group: GroupInterface) => void;
}
interface CreateGroupModel {
  name: string;
  members: { name: string; id: string }[];
  description: string;
  admin: { name: string; id: string };
}

const CreateGroup = ({ onCreateGroup }: CreateGroupProps) => {
  const userContext = useUserContext();
  const { currentUser, setCurrentUser, socket } = userContext as UserContext;
  const [users, setUsers] = useState<UserModal[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  console.log(selectedUsers, "selected users");
  const [groupDetails, setGroupDetails] = useState<CreateGroupModel>({
    name: "",
    members: [],
    description: "",
    admin: {
      name: getFullName(currentUser),
      id: currentUser._id,
    },
  });
  socket.off("groupCreated").on("groupCreated", (group) => {
    onCreateGroup(group);
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupDetails({
      ...groupDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleDropdownSelect = (eventKey: any, event: any) => {
    event.preventDefault();
    if (!selectedUsers.includes(eventKey)) {
      setSelectedUsers([...selectedUsers, eventKey]);
    } else {
      setSelectedUsers(selectedUsers.filter((item) => item !== eventKey));
    }
  };
  useEffect(() => {
    httpMethods.get<UserModal[]>("/users").then((res: any) => {
      setUsers(res);
    });
  }, []);
  const handleCreateClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const groupMembers: { name: string; id: string }[] = [];

    users.forEach((user) => {
      if (selectedUsers.includes(getFullName(user))) {
        groupMembers.push({ name: getFullName(user), id: user._id });
      }
    });
    const groupss = {
      ...groupDetails,
      members: groupMembers,
    };
    setGroupDetails(groupss);
    socket.emit("createGroup", groupss);
  };

  return (
    <>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="text"
              placeholder="Enter Group Name"
              value={groupDetails.name}
              name="name"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Dropdown onSelect={handleDropdownSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Users
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {users !== null &&
                  users.map((user: UserModal) => (
                    <Dropdown.Item
                      key={user._id}
                      eventKey={getFullName(user)}
                      active={selectedUsers.includes(getFullName(user))}
                    >
                      {getFullName(user)}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            {selectedUsers.length > 0 && selectedUsers.join(", ")}
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="text"
              placeholder="description"
              value={groupDetails.description}
              name="description"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Button
              type="button"
              className="btn btn-success"
              onClick={(e) => handleCreateClick(e)}
            >
              Create
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </>
  );
};

export default CreateGroup;
