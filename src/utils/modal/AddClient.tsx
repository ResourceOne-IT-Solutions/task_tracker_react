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
    setClientData({ ...clientData, [event.target.name]: event.target.value });
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
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
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
          <Form.Group as={Col} md="6">
            <Form.Control
              type="tel"
              name="mobile"
              value={mobile}
              onChange={handleChange}
              placeholder="Enter Mobile"
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Control
              type="text"
              name="area"
              value={area as string}
              onChange={handleChange}
              placeholder="Enter Location"
            />
            <Dropdown onSelect={handleDropdownSelect}>
              <Dropdown.Toggle variant="success" id="location-zone">
                {clientData.zone ? clientData.zone : "Select Zone"}
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
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button variant="primary" onClick={(e) => submitClientData(e)}>
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
