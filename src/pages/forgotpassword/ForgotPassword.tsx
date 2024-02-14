import React, { useState } from "react";
import "./ForgotPassword.css";
import httpMethods from "../../api/Service";
import { OtpInterface, UserContext } from "../../modals/UserModals";
import { Severity } from "../../utils/modal/notification";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { useNavigate } from "react-router-dom";
function ForgotPassword() {
  const { alertModal } = useUserContext() as UserContext;
  const navigate = useNavigate();
  const [payload, setPayload] = useState<string>("");
  const [otpResponse, setOtpResponse] = useState<OtpInterface>({
    message: "",
    otp: "",
    userId: "",
    email: "",
  });
  const [otpreceived, setOtpReceived] = useState<boolean>(false);
  const [otpcompare, setOtpCompare] = useState<boolean>(false);
  const [enteredOTP, setEnteredOTP] = useState<string>("");
  const [passwordCompare, setPasswordsCompare] = useState<any>({
    password: "",
    repassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    if (name === "user-email") {
      setPayload(event.target.value);
    } else if (name === "otp") {
      setEnteredOTP(event.target.value);
    } else if (name === "passwd") {
      setPasswordsCompare({
        ...passwordCompare,
        [event.target.name]: event.target.value,
      });
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
          .post<any, OtpInterface>("/mail-verify", { data: payload })
          .then((res: OtpInterface) => {
            alertModal({
              severity: Severity.SUCCESS,
              content: res.message,
              title: "Alert",
            });
            setOtpReceived(true);
            setOtpResponse(res);
          })
          .catch((err: any) => {
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
      if (otpResponse?.otp == enteredOTP) {
        setOtpCompare(true);
      } else {
        alertModal({
          severity: Severity.ERROR,
          content: "Wrong Otp",
          title: "Alert",
        });
      }
      setLoading(false);
    } else if (name === "passwd") {
      if (passwordCompare.password == passwordCompare.repassword) {
        const credentials = otpResponse.userId
          ? { userId: otpResponse?.userId }
          : { email: otpResponse.email };
        const pwdpayload = {
          data: { password: passwordCompare.password },
          credentials,
        };
        httpMethods
          .post("/update-password", pwdpayload)
          .then((res: any) => {
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
          .catch((err: any) => {
            alertModal({
              severity: Severity.ERROR,
              content: err.message,
              title: "Alert",
            });
          });
      } else {
        alertModal({
          severity: Severity.ERROR,
          content: "Password Not Matching",
          title: "Alert",
        });
      }
      setLoading(false);
    }
  };
  return (
    <div className="forgot-main text-center">
      <h1>Forgot Password</h1>
      <form className="pwd-forgot">
        {!otpreceived ? (
          <>
            <label htmlFor="" className="mb-2">
              <b>UserId (or) Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter Userid or Email"
              className="mb-2"
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
            <label htmlFor="">
              <b>New Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              name="password"
              className="mb-2"
              value={passwordCompare.password}
              onChange={(e) => handleChange(e, "passwd")}
            />
            <label htmlFor="">
              <b>Confirm Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Confirm Password"
              name="repassword"
              className="mb-2"
              value={passwordCompare.repassword}
              onChange={(e) => handleChange(e, "passwd")}
            />
            <button
              className="btn btn-primary"
              onClick={(e) => handleSubmit(e, "passwd")}
            >
              Submit
            </button>
          </>
        ) : (
          <>
            <label htmlFor="">
              <b>OTP</b>
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              className="mb-2"
              value={enteredOTP}
              onChange={(e) => handleChange(e, "otp")}
            />
            <button
              className="btn btn-primary"
              onClick={(e) => handleSubmit(e, "otp")}
            >
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
