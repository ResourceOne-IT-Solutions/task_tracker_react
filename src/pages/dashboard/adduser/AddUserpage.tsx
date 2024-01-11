import React, { useRef, useState } from "react";
import { UserModal } from "../../../components/Authcontext/AuthContext";
import httpMethods from "../../../api/Service";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./AddUserpage.css";
import { Button, InputGroup } from "react-bootstrap";

interface UserDataInterface {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  dob: string;
  joinedDate: string;
  isAdmin: null;
  designation: string;
  profileImageUrl: string | null;
  userId?: string;
  address: string;
}

function AddUserpage() {
  const [userData, setUserData] = useState<UserDataInterface>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    joinedDate: "",
    isAdmin: null,
    designation: "",
    profileImageUrl: null,
    address: "",
  });
  const {
    firstName,
    lastName,
    email,
    mobile,
    password,
    dob,
    joinedDate,
    isAdmin,
    designation,
    profileImageUrl,
    address,
  } = userData;

  const [createdData, setCreatedData] = useState<UserModal | null>(null);
  const [userError, setUserError] = useState<string>("");
  const [userSuccess, setUserSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (event.target.type == "radio") {
      const val = event.target.value === "true" ? true : false;
      setUserData((prevData) => {
        return { ...prevData, [event.target.name]: val };
      });
    } else if (event.target.type == "file") {
      const fileInput = event.target as HTMLInputElement;

      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUserData((prevData) => {
            return { ...prevData, profileImageUrl: reader.result as string };
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUserData((prevData) => {
        return { ...prevData, [event.target.name]: event.target.value };
      });
    }
  };
  const submitUserData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    httpMethods
      .post<UserDataInterface, UserModal>("/users/create", userData)
      .then((result) => {
        setCreatedData(result);
        setUserError("");
        setTimeout(() => {
          setLoading(false);
          setUserData({
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            password: "",
            dob: "",
            joinedDate: "",
            isAdmin: null,
            designation: "",
            profileImageUrl: null,
            address: "",
          });
          //image field is not getting empty we are reseting the form
          formRef.current.reset();
          setUserSuccess(true);
        }, 2000);
      })
      .catch((e: any) => {
        setUserSuccess(false);
        setLoading(false);
        setUserError(e.message);
      });
  };
  return (
    <div>
      <Form
        ref={formRef}
        onSubmit={(e) => submitUserData(e)}
        className="add-user"
      >
        <h2>Add User</h2>
        <Row className="mb-3">
          <Form.Group
            as={Col}
            md="6"
            controlId="validationFormik101"
            className="position-relative"
          >
            <Form.Control
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="Enter FirstName"
            />
            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            as={Col}
            md="6"
            controlId="validationFormik102"
            className="position-relative"
          >
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
          <Form.Group
            as={Col}
            md="6"
            controlId="validationFormik102"
            className="position-relative"
          >
            <Form.Control
              type="email"
              placeholder="Enter Email"
              aria-describedby="inputGroupPrepend"
              name="email"
              onChange={handleChange}
              value={email}
            />
          </Form.Group>
          <Form.Group
            as={Col}
            md="6"
            controlId="validationFormik102"
            className="position-relative"
          >
            <Form.Control
              id="mobile"
              type="tel"
              name="mobile"
              placeholder="Enter Mobile Number"
              onChange={handleChange}
              value={mobile}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              id="password"
              onChange={handleChange}
              value={password}
            />
          </Form.Group>
          <Form.Group as={Col} md="1">
            IsAdmin
          </Form.Group>

          <Form.Group as={Col} md="1">
            <Form.Check
              type="radio"
              label="Yes"
              name="isAdmin"
              value={"true"}
              checked={isAdmin == true}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="1">
            <Form.Check
              type="radio"
              label="No"
              name="isAdmin"
              value={"false"}
              checked={isAdmin == false}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="1">
            <b>DOB</b>
          </Form.Group>
          <Form.Group as={Col} md="5">
            <Form.Control
              type="date"
              name="dob"
              id="dob"
              placeholder="Enter Dob"
              onChange={handleChange}
              value={dob}
            />
          </Form.Group>
          <Form.Group as={Col} md="2">
            <b>JoinedDate</b>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Control
              type="date"
              name="joinedDate"
              id="joinedDate"
              placeholder="Enter JoinedDate"
              onChange={handleChange}
              value={joinedDate}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Control
              type="file"
              name="profileImageUrl"
              id="profileImageUrl"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Control
              type="text"
              name="designation"
              id="designation"
              placeholder="Enter Designation"
              onChange={handleChange}
              value={designation}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Control
              as={"textarea"}
              placeholder="Enter Address"
              name="address"
              rows={2}
              onChange={handleChange}
              value={address}
            />
          </Form.Group>
        </Row>

        <Button type="submit">{loading ? "Creating" : "Add User"}</Button>
        {userSuccess ? (
          <div className="scc-msg">
            User is Created<span>EmpId : {createdData?.empId}</span>
            <span>UserId : {createdData?.userId}</span>
          </div>
        ) : null}
        {userError && <div className="err-msg">{userError}</div>}
      </Form>
    </div>
  );
}

export default AddUserpage;
