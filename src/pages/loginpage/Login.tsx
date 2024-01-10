import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import {
  UserContext,
  UserModal,
  useUserContext,
} from "../../components/Authcontext/AuthContext";
import Timezones from "../../components/features/timezone/Timezones";
import httpMethods from "../../api/Service";

export interface Datainterface {
  userId: string;
  password: string;
  isAdmin: boolean;
}
const Login = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { setCurrentUser } = userContext as UserContext;
  const [data, setData] = useState<Datainterface>({
    userId: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { name } = useParams();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      isAdmin: name === "Admin" ? true : false,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = () => {
    navigate(name == "User" ? "/login/Admin" : "/login/User");
  };
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    httpMethods
      .post<Datainterface, UserModal>("/login", data)
      .then((result) => {
        setCurrentUser(result);
        localStorage.setItem("currentUser", JSON.stringify(result));
        setData({ ...data, userId: "", password: "", isAdmin: false });
        setIsLoading(false);
        result.isAdmin
          ? navigate("/admindashboard")
          : navigate("/userdashboard");
      })
      .catch((e: any) => {
        setError(e.message);
        setIsLoading(false);
      });
  };
  return (
    <div className="login-main">
      <h1>{name} Login Page</h1>
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
          {isLoading ? "Loading..." : `${name} Login`}
        </Button>
      </Form>
      <p>
        <span className="anchorclick" onClick={handleClick}>
          click here
        </span>{" "}
        to navigate to {name == "User" ? "Admin" : "User"} login page
      </p>
      <Timezones />
    </div>
  );
};

export default Login;
