import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import httpMethods from "../../api/Service";
export interface ClientInterface {
  firstName: string;
  email: string;
  mobile: string;
  location: string | {area: string, zone: string};
  technology: string;
  companyName: string;
  applicationType: string;
  ticketsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

function AddClient() {
  const [clientData, setClientData] = useState<ClientInterface>({
    firstName: "",
    email: "",
    mobile: "",
    location: "",
    technology: "",
    companyName: "",
    applicationType: "",
  });
  const [clientError, setClientError] = useState<string>("");
  const [clientSuccess, setClientSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdClient, setCreatedClient] = useState<ClientInterface | null>(
    null,
  );
  const {
    firstName,
    email,
    mobile,
    location,
    technology,
    companyName,
    applicationType,
  } = clientData;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientData({ ...clientData, [event.target.name]: event.target.value });
  };
  const submitClientData = async (
    event: React.FormEvent<HTMLButtonElement>,
  ) => {
    setLoading(true);
    httpMethods
      .post<ClientInterface, ClientInterface>("/clients/create", clientData)
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
            location: "",
            technology: "",
            companyName: "",
            applicationType: "",
          });
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
              name="location"
              value={location as string}
              onChange={handleChange}
              placeholder="Enter Location"
            />
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
