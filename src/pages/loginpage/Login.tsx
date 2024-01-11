import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import Timezones from "../../components/features/timezone/Timezones";
import httpMethods from "../../api/Service";
import { setCookie } from "../../utils/Util";

export interface Datainterface {
  userId: string;
  password: string;
  isAdmin: boolean;
}
const Login = () => {
  const navigate = useNavigate();
  const path = useLocation().state;
  const [data, setData] = useState<Datainterface>({
    userId: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      isAdmin: path === "Admin" ? true : false,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = () => {
    navigate("/login", { state: path === "Admin" ? "User" : "Admin" });
  };
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    httpMethods
      .post<Datainterface, { token: string }>("/verify-login", data)
      .then((result) => {
        setCookie(result.token, 1);
        setIsLoading(false);
        navigate("/dashboard");
      })
      .catch((e: any) => {
        setError(e.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="login-main">
      <h1>{path} Login Page</h1>
      <Form className="login-page">
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
          variant="outline-success"
          onClick={(e) => handleSubmit(e)}
        >
          {isLoading ? "Loading..." : `${path} Login`}
        </Button>
      </Form>
      <p className="logintext">
        <span className="anchorclick" onClick={handleClick}>
          click here
        </span>{" "}
        to navigate to {path == "User" ? "Admin" : "User"} login page
      </p>
      <Timezones />
    </div>
  );
};

export default Login;
