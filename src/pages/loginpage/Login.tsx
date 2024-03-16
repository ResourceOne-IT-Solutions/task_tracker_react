import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import httpMethods from "../../api/Service";
import { setCookie } from "../../utils/utils";
import { LoginPayload } from "../../modals/UserModals";

const Login = () => {
  const navigate = useNavigate();
  const path = useLocation().state || "User";
  const [data, setData] = useState<LoginPayload>({
    userId: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
      .login<LoginPayload, { token: string; refreshToken: string }>(
        "/verify-login",
        data,
      )
      .then((result) => {
        localStorage.setItem("accessToken", result.token);
        localStorage.setItem("refreshToken", result.refreshToken);
        setIsLoading(false);
        navigate("/dashboard");
      })
      .catch((e: any) => {
        setError(e.message);
        setIsLoading(false);
      });
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-main text-center">
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
        <Form.Label htmlFor="loginInputPassword5">Password</Form.Label>
        <div className="password-icon">
          <Form.Control
            type={showPassword ? "text" : "password"}
            id="loginInputPassword5"
            aria-describedby="passwordHelpBlock"
            placeholder="Enter Password"
            name="password"
            onChange={handleChange}
            value={data.password}
          />
          <span onClick={handleShowPassword}>
            {showPassword ? (
              <i className="bi bi-eye-fill"></i>
            ) : (
              <i className="bi bi-eye-slash-fill"></i>
            )}
          </span>
        </div>
        <br />
        <div className="error">{error}</div>
        <Button
          type="submit"
          variant="success"
          onClick={(e) => handleSubmit(e)}
        >
          {isLoading ? "Loading..." : `${path} Login`}
        </Button>
      </Form>
      <p className="logintext">
        <span className="anchorclick" onClick={handleClick}>
          Click Here
        </span>{" "}
        to navigate to {path == "User" ? "Admin" : "User"} login page
      </p>
      <p>
        <span
          className="forgot-pwd"
          onClick={() => navigate("/forgotpassword")}
        >
          Forgot Password
        </span>
      </p>
    </div>
  );
};

export default Login;
