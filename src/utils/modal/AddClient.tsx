import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Dropdown } from "react-bootstrap";
import httpMethods from "../../api/Service";
import { ClientModal, CreateClientModal } from "../../modals/ClientModals";
import { getNameId } from "../utils";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";
interface prop {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddClient({ setShowModal }: prop) {
  const userContext = useUserContext();
  const { currentUser } = userContext as UserContext;
  const [clientData, setClientData] = useState<CreateClientModal>({
    firstName: "",
    email: "",
    mobile: "",
    area: "",
    technology: "",
    companyName: "",
    applicationType: "",
    zone: "",
  });
  const [clientError, setClientError] = useState<string>("");
  const [clientSuccess, setClientSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdClient, setCreatedClient] = useState<ClientModal>(
    {} as ClientModal,
  );
  const [isValid, setIsValid] = useState({
    firstName: false,
    email: false,
    mobile: false,
    applicationType: false,
  });
  const validData_or_not =
    !isValid.firstName &&
    !isValid.email &&
    !isValid.mobile &&
    !isValid.applicationType;
  const {
    firstName,
    email,
    mobile,
    area,
    technology,
    companyName,
    applicationType,
    zone,
  } = clientData;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let isValidField = true;
    if (name === "firstName" || name === "applicationType") {
      isValidField =
        /^[A-Za-z]+\s{0,1}[A-Za-z]*$/.test(value) && value.length >= 3;
    } else if (name === "email") {
      isValidField = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (name === "mobile") {
      isValidField = /^\+[0-9]{1,2}\s\d{10}$/.test(value);
    }
    setIsValid((prevState) => ({
      ...prevState,
      [name]: !isValidField,
    }));
    setClientData({ ...clientData, [name]: value });
  };
  const handleDropdownSelect = (eventKey: string | null = "") => {
    setClientData((prev) => ({ ...prev, zone: eventKey as string }));
  };
  const submitClientData = async (
    event: React.FormEvent<HTMLButtonElement>,
  ) => {
    setLoading(true);
    httpMethods
      .post<CreateClientModal, ClientModal>("/clients/create", {
        ...clientData,
        location: { area, zone },
        createdBy: getNameId(currentUser),
      })
      .then((result) => {
        setCreatedClient(result);
        setClientError("");
        setTimeout(() => {
          setLoading(false);
          setClientSuccess(true);
          setClientData({
            firstName: "",
            email: "",
            mobile: "",
            area: "",
            technology: "",
            companyName: "",
            applicationType: "",
            zone: "",
          });
          setTimeout(() => {
            setShowModal(false);
          }, 1000);
        }, 2000);
      })
      .catch((e: any) => {
        setClientSuccess(false);
        setLoading(false);
        setClientError(e.message);
      });
  };
  return (
    <div>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
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
          <Form.Group as={Col} md="6">
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter Email"
              isInvalid={isValid.email}
            />
            <Form.Control.Feedback type="invalid">
              Please Enter A Valid Email
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Control
              type="tel"
              name="mobile"
              value={mobile}
              onChange={handleChange}
              placeholder="Enter Mobile"
              isInvalid={isValid.mobile}
            />
            <Form.Control.Feedback type="invalid">
              Enter Country Code and Numbers only
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Control
              type="text"
              name="area"
              value={area as string}
              onChange={handleChange}
              placeholder="Enter Location"
            />
          </Form.Group>
          <Form.Group as={Col} md="2">
            <Dropdown onSelect={handleDropdownSelect}>
              <Dropdown.Toggle variant="success" id="location-zone">
                {clientData.zone ? clientData.zone : "Zone"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {["PST", "CST", "IST", "EST"].map((zone) => (
                  <Dropdown.Item
                    key={zone}
                    eventKey={zone}
                    active={clientData.zone === zone}
                  >
                    {zone}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Control
              type="text"
              name="technology"
              value={technology}
              onChange={handleChange}
              placeholder="Enter Technology"
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Control
              type="text"
              name="companyName"
              value={companyName}
              onChange={handleChange}
              placeholder="Enter CompanyName"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Control
              type="text"
              name="applicationType"
              value={applicationType}
              onChange={handleChange}
              placeholder="Enter ApplicationType"
              isInvalid={isValid.applicationType}
            />
            <Form.Control.Feedback type="invalid">
              Alphabets Only, Minimum 3 Characters
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button
              variant="primary"
              onClick={(e) => submitClientData(e)}
              disabled={validData_or_not ? false : true}
            >
              {loading ? "Creating" : "Add Client"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {clientSuccess ? (
          <div className="scc-msg">Client Created Successfully</div>
        ) : null}
        {clientError && <div className="err-msg">{clientError}</div>}
      </Form>
    </div>
  );
}

export default AddClient;
