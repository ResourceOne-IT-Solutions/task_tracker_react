import React, { useState } from "react";
import "./ForgotPassword.css";
import httpMethods from "../../api/Service";
import { OtpInterface, UserContext } from "../../modals/UserModals";
import { Severity } from "../../utils/modal/notification";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { useNavigate } from "react-router-dom";
import { PASSWORD_PATTERN } from "../../utils/Constants";
import {
  ErrorMessageInterface,
  MailVerifyInterface,
  OtpApiResponse,
  OtpApidataInterface,
  PasswordInterface,
  UpdatePasswordInterface,
} from "../../modals/interfaces";
function ForgotPassword() {
  const { alertModal } = useUserContext() as UserContext;
  const navigate = useNavigate();
  const [payload, setPayload] = useState<string>("");
  const [otpResponse, setOtpResponse] = useState<OtpInterface>({
    message: "",
    userId: "",
    email: "",
  });
  const [otpreceived, setOtpReceived] = useState<boolean>(false);
  const [otpcompare, setOtpCompare] = useState<boolean>(false);
  const [enteredOTP, setEnteredOTP] = useState<string>("");
  const [passwordCompare, setPasswordsCompare] = useState<PasswordInterface>({
    password: "",
    repassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmShowPassword, setConfirmShowPassword] =
    useState<boolean>(false);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    if (name === "user-email") {
      setPayload(event.target.value);
    } else if (name === "otp") {
      setEnteredOTP(event.target.value);
    } else if (name === "passwd") {
      const pwdData = {
        ...passwordCompare,
        [event.target.name]: event.target.value,
      };
      if (PASSWORD_PATTERN.test(pwdData.password)) {
        pwdData.password === pwdData.repassword
          ? setErrorMessage("")
          : pwdData.repassword.length > 0
            ? setErrorMessage("Passwords are not matching")
            : setErrorMessage("");
      } else {
        setErrorMessage(
          "An Uppercase,Special symbol,Number,8 Characters Required",
        );
      }
      setPasswordsCompare(pwdData);
    }
  };
  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    name: string,
  ) => {
    event.preventDefault();
    setLoading(true);
    if (name === "user-email") {
      if (payload.trim().length) {
        httpMethods
          .post<MailVerifyInterface, OtpInterface>("/mail-verify", {
            data: payload,
          })
          .then((res: OtpInterface) => {
            alertModal({
              severity: Severity.SUCCESS,
              content: res.message,
              title: "Alert",
            });
            setOtpReceived(true);
            setOtpResponse(res);
          })
          .catch((err: ErrorMessageInterface) => {
            alertModal({
              severity: Severity.ERROR,
              content: err.message,
              title: "Alert",
            });
          })
          .finally(() => setLoading(false));
      } else {
        alertModal({
          severity: Severity.ERROR,
          content: "Enter valid Data",
          title: "Alert",
        });
        setLoading(false);
      }
    } else if (name === "otp") {
      let msg = "";
      const str_otp = String(enteredOTP);
      if (str_otp.length == 0) {
        msg = "Required";
      } else if (str_otp.length > 15) {
        msg = "Invalid OTP";
      } else if (str_otp.length <= 15 || enteredOTP.length > 0) {
        msg = "";
      }
      setErrorMessage(msg);
      if (str_otp && !msg) {
        const otpApiData = {
          data: {
            key: otpResponse?.userId || otpResponse.email,
            otp: str_otp,
          },
        };
        httpMethods
          .post<OtpApidataInterface, OtpApiResponse>("/verify-otp", otpApiData)
          .then((result: OtpApiResponse) => {
            setOtpCompare(true);
          })
          .catch((error: ErrorMessageInterface) => {
            setErrorMessage(error.message);
          });
      }
      setLoading(false);
    } else if (name === "passwd") {
      if (!errorMessage) {
        const credentials = otpResponse.userId
          ? { userId: otpResponse?.userId }
          : { email: otpResponse.email };
        const pwdpayload = {
          data: { password: passwordCompare.password },
          credentials,
        };
        httpMethods
          .post<UpdatePasswordInterface, OtpApiResponse>(
            "/update-password",
            pwdpayload,
          )
          .then((res: OtpApiResponse) => {
            alertModal({
              severity: Severity.SUCCESS,
              content: res.message,
              title: "Alert",
            });
            setOtpReceived(false);
            setOtpCompare(false);
            setEnteredOTP("");
            setPasswordsCompare({
              password: "",
              repassword: "",
            });
            navigate("/login", { state: "User" });
          })
          .catch((err: ErrorMessageInterface) => {
            alertModal({
              severity: Severity.ERROR,
              content: err.message,
              title: "Alert",
            });
          });
      }
      setLoading(false);
    }
  };
  return (
    <div className="forgot-main text-center">
      <h1>Forgot Password</h1>
      <form className="pwd-forgot mb-2">
        {!otpreceived ? (
          <>
            <label htmlFor="" className="mb-2 form-label">
              <b>UserId (or) Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter Userid or Email"
              className="mb-2 form-control"
              onChange={(e) => handleChange(e, "user-email")}
            />
            <button
              className="btn btn-primary"
              onClick={(e) => handleSubmit(e, "user-email")}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </>
        ) : otpcompare ? (
          <>
            <label htmlFor="" className="form-label">
              <b>New Password</b>
            </label>
            <div className="forgotpage-password-icon">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                name="password"
                className="mb-2 form-control"
                value={passwordCompare.password}
                onChange={(e) => handleChange(e, "passwd")}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <i className="bi bi-eye-fill"></i>
                ) : (
                  <i className="bi bi-eye-slash-fill"></i>
                )}
              </span>
            </div>
            <label htmlFor="" className="form-label">
              <b>Confirm Password</b>
            </label>
            <div className="forgotpage-password-icon">
              <input
                type={confirmShowPassword ? "text" : "password"}
                placeholder="Enter Confirm Password"
                name="repassword"
                className="mb-2 form-control"
                value={passwordCompare.repassword}
                onChange={(e) => handleChange(e, "passwd")}
              />
              <span
                onClick={() => setConfirmShowPassword(!confirmShowPassword)}
              >
                {confirmShowPassword ? (
                  <i className="bi bi-eye-fill"></i>
                ) : (
                  <i className="bi bi-eye-slash-fill"></i>
                )}
              </span>
            </div>
            <p className="error-message mb-2">{errorMessage && errorMessage}</p>
            <button
              className="btn btn-primary"
              onClick={(e) => handleSubmit(e, "passwd")}
            >
              {loading ? "Loading.." : "Submit"}
            </button>
          </>
        ) : (
          <>
            <label htmlFor="" className="form-label">
              <b>OTP</b>
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              className="mb-2 form-control"
              value={enteredOTP}
              onChange={(e) => handleChange(e, "otp")}
            />
            <p className="error-message mb-2">{errorMessage && errorMessage}</p>
            <button
              className="btn btn-primary"
              onClick={(e) => handleSubmit(e, "otp")}
            >
              {loading ? "Verifying" : "Verify OTP"}
            </button>
          </>
        )}
      </form>
      <a onClick={() => navigate(-1)} className="go-back">
        Go Back
      </a>
    </div>
  );
}

export default ForgotPassword;
