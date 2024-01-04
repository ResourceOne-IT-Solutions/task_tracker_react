import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

const Login = ()=> {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userId: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const { name } = useParams();
  console.log(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      isAdmin: name === "Admin" ? true : false,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log(data, "DATA");
    setError("");
    const apiJsonData = await fetch("http://192.168.10.30:1234/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const apidata = await apiJsonData.json();
    console.log(apidata, "2626");
    setData({ ...data, userId: "", password: "", isAdmin: false });
    if (apidata.error) {
      setError(apidata.error);
    } else {
      navigate("/admindashboard", { state: apidata });
    }
  };
  return (
    <div className="loginmain">
      <h1>{name} Login Page</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Username"
            name="userId"
            onChange={handleChange}
            value={data.userId}
          />
        </Form.Group>
        <Form.Label htmlFor="inputPassword5">Password</Form.Label>
        <Form.Control
          type="password"
          id="inputPassword5"
          aria-describedby="passwordHelpBlock"
          placeholder="Enter Password"
          name="password"
          onChange={handleChange}
          value={data.password}
        />
        <br />
        <div className="error">{error}</div>
        <Button
          type="submit"
          variant="success"
          onClick={(e) => handleSubmit(e)}
        >
          {name} Login
        </Button>
      </Form>
    </div>
  );
}

export default Login;
