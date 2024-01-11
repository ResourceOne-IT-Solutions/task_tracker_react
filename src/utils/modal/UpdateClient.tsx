import React, { useEffect, useState } from "react";
import { UserModal } from "../../components/Authcontext/AuthContext";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import httpMethods from "../../api/Service";
import { Dropdown } from "react-bootstrap";
import { ClientModal } from "../../pages/dashboard/adminDashboard/AdminDashboard";

export interface Dummy {
  firstName: string;
  email: string;
  mobile: string;
  location: { area: string; zone: string };
  technology: string;
  companyName: string;
  applicationType: string;
  ticketsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}
interface Prop {
  updateref: Dummy;
  updateClientTableData: (updatedClient: ClientModal) => void;
}
function UpdateClient({ updateref, updateClientTableData }: Prop) {
  const [updatedData, setUpdatedData] = useState({
    id: updateref._id,
    data: {
      mobile: updateref.mobile,
      location: updateref.location,
      technology: updateref.technology,
      companyName: updateref.companyName,
    },
  });
  const {
    data: {
      mobile,
      location: { area, zone },
      technology,
      companyName,
    },
  } = updatedData;

  const [updateError, setUpdateError] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdupdate, setCreatedUpdate] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "area") {
      setUpdatedData({
        ...updatedData,
        data: {
          ...updatedData.data,
          location: { ...updatedData.data.location, area: e.target.value },
        },
      });
    } else {
      setUpdatedData({
        ...updatedData,
        data: { ...updatedData.data, [e.target.name]: e.target.value },
      });
    }
  };
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    httpMethods
      .put<any, any>("/clients/update", updatedData)
      .then((result) => {
        setCreatedUpdate(result);
        setUpdateError("");
        setTimeout(() => {
          setLoading(false);
          setUpdateSuccess(true);
          updateClientTableData(result);
        }, 2000);
      })
      .catch((e: any) => {
        setUpdateSuccess(false);
        setLoading(false);
        setUpdateError(e.message);
      });
  };
  const handleSelect = (item: any) => {
    setSelectedItem(item);
    setUpdatedData({
      ...updatedData,
      data: {
        ...updatedData.data,
        location: { ...updatedData.data.location, zone: item },
      },
    });
  };
  const zoneData = ["EST", "PST", "IST", "CST"];
  useEffect(() => {
    setSelectedItem(zone);
  }, []);
  return (
    <div>
      <Form onSubmit={(e) => handleUpdate(e)}>
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
          <Form.Group as={Col} md="9">
            <Form.Control
              type="text"
              name="area"
              value={area}
              onChange={handleChange}
              placeholder="Enter Location Area"
            />
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedItem ? selectedItem : "Select Zone"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "180px", overflowY: "auto" }}>
                {zoneData !== null
                  ? zoneData.map((item: string, index: any) => {
                      return (
                        <Dropdown.Item key={index} eventKey={item}>
                          {item}
                        </Dropdown.Item>
                      );
                    })
                  : null}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Control
              type="text"
              name="technology"
              value={technology}
              onChange={handleChange}
              placeholder="Enter Technology"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
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
          <Form.Group as={Col} md="12" className="sbt-btn">
            <Button variant="primary" type="submit">
              {loading ? "Updating" : "Update"}
            </Button>{" "}
          </Form.Group>
        </Row>
        {updateSuccess ? (
          <div className="scc-msg">Client Updated Successfully</div>
        ) : null}
        {updateError && <div className="err-msg">{updateError}</div>}
      </Form>
    </div>
  );
}

export default UpdateClient;
