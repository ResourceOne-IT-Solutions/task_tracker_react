import React, { useState } from "react";
import "./AddUserModal.css";
import httpMethods from "../../api/Service";
import { UserModal } from "../../components/Authcontext/AuthContext";

interface UserDataInterface {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  dob: string;
  joinedDate: string;
  isAdmin: null;
  designation: string;
  profileImageUrl: string | null;
  userId?: string;
  address: string;
}
const AddUserModal = () => {
  const [userData, setUserData] = useState<UserDataInterface>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    joinedDate: "",
    isAdmin: null,
    designation: "",
    profileImageUrl: null,
    address: "",
  });
  const {
    firstName,
    lastName,
    email,
    mobile,
    password,
    dob,
    joinedDate,
    isAdmin,
    designation,
    profileImageUrl,
    address,
  } = userData;

  const [createdData, setCreatedData] = useState<UserModal | null>(null);
  const [userError, setUserError] = useState<string>("");
  const [userSuccess, setUserSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (event.target.type == "radio") {
      const val = event.target.value === "true" ? true : false;
      setUserData((prevData) => {
        return { ...prevData, [event.target.name]: val };
      });
    } else if (event.target.type == "file") {
      const fileInput = event.target as HTMLInputElement;

      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUserData((prevData) => {
            return { ...prevData, profileImageUrl: reader.result as string };
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUserData((prevData) => {
        return { ...prevData, [event.target.name]: event.target.value };
      });
    }
  };
  const submitUserData = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoading(true);
    httpMethods
      .post<UserDataInterface, UserModal>("/users/create", userData)
      .then((result) => {
        setCreatedData(result);
        setUserError("");
        setTimeout(() => {
          setLoading(false);
          setUserSuccess(true);
        }, 2000);
      })
      .catch((e: any) => {
        setUserSuccess(false);
        setLoading(false);
        setUserError(e.message);
      });
  };
  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="exampleModalLabel">
                Add User
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="firstName"
                id="fname"
                placeholder="Enter FirstName"
                onChange={(e) => handleChange(e)}
                value={firstName}
              />
              <input
                type="text"
                name="lastName"
                id="lname"
                placeholder="Enter Lastname"
                onChange={handleChange}
                value={lastName}
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email"
                onChange={handleChange}
                value={email}
              />
              <input
                type="tel"
                name="mobile"
                id="mobile"
                pattern="[0-9]{10}"
                placeholder="Enter Mobile Number"
                onChange={handleChange}
                value={mobile}
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                onChange={handleChange}
                value={password}
              />
              <div>
                <label htmlFor="isAdmin">
                  <b>IsAdmin</b>
                </label>
              </div>
              <div className="admin-not">
                <input
                  type="radio"
                  name="isAdmin"
                  id="isAdmin"
                  value={"true"}
                  checked={isAdmin == true}
                  onChange={handleChange}
                />
                Yes
                <input
                  type="radio"
                  name="isAdmin"
                  id="isAdmin"
                  value={"false"}
                  checked={isAdmin == false}
                  onChange={handleChange}
                />
                No
              </div>
              <div>
                <label htmlFor="dob">
                  <b>DOB</b>
                </label>
              </div>
              <input
                type="date"
                name="dob"
                id="dob"
                placeholder="Enter Dob"
                onChange={handleChange}
                value={dob}
              />
              <div>
                <label htmlFor="joinedDate">
                  <b>JoinedDate</b>
                </label>
              </div>
              <input
                type="date"
                name="joinedDate"
                id="joinedDate"
                placeholder="Enter JoinedDate"
                onChange={handleChange}
                value={joinedDate}
              />
              <div>
                <label htmlFor="profileImageUrl">
                  <b>Profile_Image</b>
                </label>
              </div>
              <input
                type="file"
                name="profileImageUrl"
                id="profileImageUrl"
                onChange={(e) => handleChange(e)}
              />
              <input
                type="text"
                name="designation"
                id="designation"
                placeholder="Enter Designation"
                onChange={(e) => handleChange(e)}
                value={designation}
              />
              <textarea
                value={address}
                onChange={handleChange}
                placeholder="Enter Address"
                cols={47}
                rows={5}
                name="address"
              />
            </div>

            <div className="modal-footer">
              <div className="sub-footer">
                <div className="errmsg">{userError && `${userError}`}</div>
                {userSuccess && (
                  <div className="success-msg">
                    <div>
                      New User is Created
                      <span>userId : {`${createdData?.userId}`}</span>
                      <span>empId : {`${createdData?.empId}`}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => submitUserData(e)}
                >
                  {loading ? "Creating" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
