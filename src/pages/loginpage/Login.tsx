import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import Timezones from "../../components/features/timezone/Timezones";
import httpMethods from "../../api/service";

export interface Datainterface{
  userId: string,
  password: string,
  isAdmin: Boolean,
}
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Datainterface>({
    userId: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const { name } = useParams();

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
    setError("");
      httpMethods.post("/users/login",
      data)
      .then(data => {
        setData({ ...data, userId: "", password: "", isAdmin: false });
        navigate("/admindashboard", { state: data });
      })
      .catch((e:any) => {
        console.log('ERR::', e)
        setError(e.message);
      })
  };
  return (
    <div className="login-main">
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
          variant="outline-success"
          onClick={(e) => handleSubmit(e)}
        >
          {name} Login
        </Button>
      </Form>
      <Timezones />
    </div>
  );
};

export default Login;
