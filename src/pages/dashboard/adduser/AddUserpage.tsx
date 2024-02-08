import React, { useRef, useState } from "react";
import httpMethods from "../../../api/Service";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./AddUserpage.css";
import { Button, Dropdown } from "react-bootstrap";
import {
  CreateUserPayload,
  UserContext,
  UserModal,
} from "../../../modals/UserModals";
import { useNavigate } from "react-router-dom";
import { FileModel } from "../../../modals/MessageModals";
import { getCurrentDate, getFullName, getNameId } from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";

function AddUserpage() {
  const userContext = useUserContext();
  const { currentUser } = userContext as UserContext;
  const [userData, setUserData] = useState<CreateUserPayload>({
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
    gender: "",
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
    gender,
  } = userData;

  const [createdData, setCreatedData] = useState<UserModal | null>(null);
  const [userError, setUserError] = useState<string>("");
  const [userSuccess, setUserSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const navigate = useNavigate();
  const [genders, setGenders] = useState(["MALE", "FEMALE", "NOT SPECIFIED"]);
  const [isValid, setIsValid] = useState({
    firstName: false,
    lastName: false,
    email: false,
    mobile: false,
    password: false,
    designation: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const validData_or_not =
    !isValid.firstName &&
    !isValid.lastName &&
    !isValid.email &&
    !isValid.mobile &&
    !isValid.password &&
    !isValid.designation;
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    let isValidField = true;
    if (name === "firstName" || name === "lastName" || name === "designation") {
      isValidField =
        /^[A-Za-z]+\s{0,1}[A-Za-z]*$/.test(value) && value.length >= 3;
    } else if (name === "email") {
      isValidField = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (name === "mobile") {
      isValidField = /^\+[0-9]{1,2}\s\d{10}$/.test(value);
    } else if (name === "password") {
      isValidField = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/.test(value);
    }
    setIsValid((prevState) => ({
      ...prevState,
      [name]: !isValidField,
    }));

    if (event.target.type == "radio") {
      const val = event.target.value === "true" ? true : false;
      setUserData((prevData) => {
        return { ...prevData, [event.target.name]: val };
      });
    } else if (event.target.type == "file") {
      const fileInput = event.target as HTMLInputElement;

      const file = fileInput.files?.[0];
      if (file) {
        setUserData({
          ...userData,
          profileImageUrl: file as unknown as string,
        });
      }
    } else {
      setUserData((prevData) => {
        return { ...prevData, [name]: value };
      });
    }
  };
  const submitUserData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (profileImageUrl) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", profileImageUrl);
      const inres = await httpMethods
        .post<FormData, FileModel>("/file/profile-image", formData, true)
        .then((res) => res)
        .catch((err: any) => {
          setUserSuccess(false);
          setLoading(false);
          setUserError(err.message);
          return null;
        });
      if (!inres) {
        return;
      }
      const payloadData = {
        ...userData,
        profileImageUrl: inres.filename,
        createdBy: { name: getFullName(currentUser), id: currentUser._id },
      };
      if (validData_or_not) {
        httpMethods
          .post<CreateUserPayload, UserModal>("/users/create", payloadData)
          .then((result) => {
            setCreatedData(result);
            setUserError("");
            setLoading(false);
            setTimeout(() => {
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
                gender: "",
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
      } else {
        setUserError("Enter All Fields");
        setLoading(false);
        setUserSuccess(false);
      }
    } else {
      setUserError("Enter All Fields");
      setLoading(false);
      setUserSuccess(false);
    }
  };
  const handleSelect = (item: any) => {
    setUserData({ ...userData, gender: item });
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="text-center">
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
              isInvalid={isValid.firstName}
            />
            <Form.Control.Feedback type="invalid">
              Alphabets Only, Minimum 3 Characters
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            as={Col}
            md="6"
            controlId="validationFormik102-user-lastname"
            className="position-relative"
          >
            <Form.Control
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="Enter LastName"
              isInvalid={isValid.lastName}
            />
            <Form.Control.Feedback type="invalid">
              Alphabets Only, Minimum 3 Characters
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group
            as={Col}
            md="6"
            controlId="validationFormik102-user-email"
            className="position-relative"
          >
            <Form.Control
              type="email"
              placeholder="Enter Email"
              aria-describedby="inputGroupPrepend"
              name="email"
              onChange={handleChange}
              value={email}
              isInvalid={isValid.email}
            />
            <Form.Control.Feedback type="invalid">
              Please Enter A Valid Email
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            as={Col}
            md="6"
            controlId="validationFormik102-user-mobile"
            className="position-relative"
          >
            <Form.Control
              type="tel"
              name="mobile"
              placeholder="Enter Mobile Number"
              onChange={handleChange}
              value={mobile}
              autoComplete="current-mobile"
              isInvalid={isValid.mobile}
            />
            <Form.Control.Feedback type="invalid">
              Enter Country Code and Numbers only
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <div className="password-icon">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                onChange={handleChange}
                value={password}
                autoComplete="current-password"
                isInvalid={isValid.password}
              />
              <Form.Control.Feedback type="invalid">
                An Uppercase,Special symbol,Number,8 Characters Required
              </Form.Control.Feedback>
              <span onClick={handleShowPassword} className="me-4">
                {showPassword ? (
                  <i className="bi bi-eye-fill"></i>
                ) : (
                  <i className="bi bi-eye-slash-fill"></i>
                )}
              </span>
            </div>
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
          <Form.Group as={Col} md="3">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic-gender">
                {gender ? gender : "Select Gender"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {genders.map((item: string, index: any) => {
                  return (
                    <Dropdown.Item key={index} eventKey={item}>
                      {item}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
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
              placeholder="Enter Dob"
              onChange={handleChange}
              value={dob}
              min={"1900-01-01"}
              max={getCurrentDate()}
            />
          </Form.Group>
          <Form.Group as={Col} md="2">
            <b>JoinedDate</b>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Control
              type="date"
              name="joinedDate"
              placeholder="Enter JoinedDate"
              onChange={handleChange}
              value={joinedDate}
              min={"1900-01-01"}
              max={getCurrentDate()}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Control
              type="file"
              name="profileImageUrl"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Control
              type="text"
              name="designation"
              placeholder="Enter Designation"
              onChange={handleChange}
              value={designation}
              isInvalid={isValid.designation}
            />
            <Form.Control.Feedback type="invalid">
              Alphabets Only, Minimum 3 Characters
            </Form.Control.Feedback>
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
        <div className="navigating">
          <a className="nav-link" onClick={() => navigate(-1)}>
            <Button variant="danger">Go Back</Button>
          </a>
        </div>
      </Form>
    </div>
  );
}

export default AddUserpage;
