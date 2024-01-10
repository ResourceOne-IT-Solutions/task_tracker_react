import React, { useState } from "react";
import { UserModal } from "../../components/Authcontext/AuthContext";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import httpMethods from "../../api/Service";
interface Prop {
  updateref: UserModal;
}
function UpdateUser({ updateref }: Prop) {
  const [updatedData, setUpdatedData] = useState({
    id: updateref._id,
    data: {
      firstName: updateref.firstName,
      lastName: updateref.lastName,
      email: updateref.email,
      mobile: updateref.mobile,
    },
  });
  const {
    data: { firstName, lastName, email, mobile },
  } = updatedData;

  const [updateError, setUpdateError] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdupdate, setCreatedUpdate] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedData({
      ...updatedData,
      data: { ...updatedData.data, [e.target.name]: e.target.value },
    });
  };
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    httpMethods
      .put<any, any>("/users/update", updatedData)
      .then((result) => {
        setCreatedUpdate(result);
        setUpdateError("");
        setTimeout(() => {
          setLoading(false);
          setUpdateSuccess(true);
          setUpdatedData({
            id: "",
            data: {
              firstName: "",
              lastName: "",
              email: "",
              mobile: "",
            },
          });
        }, 2000);
      })
      .catch((e: any) => {
        setUpdateSuccess(false);
        setLoading(false);
        setUpdateError(e.message);
      });
  };
  return (
    <div>
      <Form onSubmit={(e) => handleUpdate(e)}>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="Enter FirstName"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="Enter LastName"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="tel"
              name="mobile"
              value={mobile}
              onChange={handleChange}
              placeholder="Enter Mobile"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button variant="primary" type="submit">
              {loading ? "Creating" : "Update"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {updateSuccess ? (
          <div className="scc-msg">User Updated Successfully</div>
        ) : null}
        {updateError && <div className="err-msg">{updateError}</div>}
      </Form>
    </div>
  );
}

export default UpdateUser;
