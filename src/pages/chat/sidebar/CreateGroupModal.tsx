import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { UserContext, UserModal } from "../../../modals/UserModals";
import httpMethods from "../../../api/Service";
import { getFullName } from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { GroupInterface } from "./Groups";
import { Severity } from "../../../utils/modal/notification";

interface CreateGroupProps {
  onCreateGroup: (group: GroupInterface) => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
interface NameIdInterface {
  name: string;
  id: string;
}
interface CreateGroupModel {
  name: string;
  members: NameIdInterface[];
  description: string;
  admin: NameIdInterface;
}

const CreateGroup = ({ onCreateGroup, setShowModal }: CreateGroupProps) => {
  const { currentUser, socket, popupNotification } =
    useUserContext() as UserContext;
  const [users, setUsers] = useState<UserModal[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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
    setShowModal(false);
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
  const handleCreateClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const groupMembers: { name: string; id: string }[] = [];

    users.forEach((user) => {
      if (selectedUsers.includes(getFullName(user))) {
        groupMembers.push({ name: getFullName(user), id: user._id });
      }
    });
    if (currentUser.isAdmin) {
      try {
        const groups = {
          ...groupDetails,
          members: groupMembers,
        };
        const response = await httpMethods.post<
          any,
          { data: GroupInterface; message: string }
        >("/message/createGroup", groups);
        setShowModal(false);
        onCreateGroup(response.data);
        popupNotification({
          content: response.message,
          severity: Severity.SUCCESS,
        });
      } catch (error) {
        popupNotification({
          content: "Error While Creating A Group",
          severity: Severity.ERROR,
        });
      }
    } else {
      try {
        const payload = {
          name: groupDetails.name,
          members: groupMembers,
          description: groupDetails.description,
          requestdBy: {
            name: getFullName(currentUser),
            id: currentUser._id,
          },
        };
        const response = await httpMethods.post<any, { message: string }>(
          "/message/createGroupByUser",
          payload,
        );
        setShowModal(false);
        popupNotification({
          content: response.message,
          severity: Severity.SUCCESS,
        });
      } catch (error) {
        popupNotification({
          content: "Error While Creating A Group",
          severity: Severity.ERROR,
        });
      }
    }
  };
  console.log("USER::::", currentUser);
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
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic-create-group"
              >
                Select Users
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {users !== null &&
                  users
                    .filter((item: any) => item._id !== currentUser._id)
                    .map((user: UserModal) => (
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
