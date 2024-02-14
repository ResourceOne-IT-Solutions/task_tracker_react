import React from "react";
import "./AddUser2.css";
import { UserContext, UserModal } from "../../../modals/UserModals";
import { EMPTY_USER_PAYLOAD } from "../../../utils/Constants";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getCurrentDate, getFullName } from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import httpMethods from "../../../api/Service";
import { Severity } from "../../../utils/modal/notification";

function AddUser2() {
  const { currentUser, alertModal } = useUserContext() as UserContext;
  const validationSchema = Yup.object().shape({
    empId: Yup.number().required("Required"),
    mobile: Yup.string()
      .matches(/^\+[0-9]{1,2}\s\d{10}$/, "Enter Country Code and Numbers only")
      .required("Required"),
    firstName: Yup.string()
      .matches(/^[A-Za-z]+\s{0,1}[A-Za-z]*$/, "Invalid name")
      .min(3, "Alphabets Only, Minimum 3 Characters")
      .required("Required"),
    lastName: Yup.string()
      .matches(/^[A-Za-z]+\s{0,1}[A-Za-z]*$/, "Invalid name")
      .min(3, "Alphabets Only, Minimum 3 Characters")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/,
        "An Uppercase,Special symbol,Number,8 Characters Required",
      )
      .required("Required"),
    dob: Yup.date().required("Required"),
    joinedDate: Yup.date().required("Required"),
    isAdmin: Yup.boolean().required("Required"),
    gender: Yup.string().required("Required"),
    profileImageUrl: Yup.mixed().required("Required"),
    address: Yup.string().required("Required"),
    designation: Yup.string()
      .matches(/^[A-Za-z]+\s{0,1}[A-Za-z]*$/, "Invalid designation")
      .min(3, "Alphabets Only, Minimum 3 Characters"),
  });
  return (
    <div>
      <Formik
        initialValues={EMPTY_USER_PAYLOAD}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (values.profileImageUrl) {
            const formData = new FormData();
            formData.append("file", values.profileImageUrl);
            const data = {
              ...values,
              createdBy: {
                name: getFullName(currentUser),
                id: currentUser._id,
              },
            };
            formData.append("user", JSON.stringify(data));
            httpMethods
              .post<FormData, UserModal>("/users/create", formData, true)
              .then((result) => {
                const content = `Name : ${getFullName(result)}\nUser ID: ${
                  result.userId
                }\nEmployee ID : ${result.empId}\nPassword: ${values.password}`;
                alertModal({
                  severity: Severity.SUCCESS,
                  content,
                  title: "User Create",
                });
                resetForm();
              })
              .catch((e: any) => {
                alertModal({
                  severity: Severity.ERROR,
                  content: e.message,
                  title: "User Create",
                });
              });
          }
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="add-user-container">
            <h2 className="main-heading">Add User</h2>
            <div className="mb-3">
              <Field
                name="empId"
                type="number"
                placeholder="Enter EmpId"
                className="mx-3"
              />
              <ErrorMessage name="empId" />
              <Field
                name="mobile"
                type="tel"
                placeholder="Enter Mobile"
                className="mx-3"
              />
              <ErrorMessage name="mobile" />
            </div>
            <div className="mb-3">
              <Field
                name="firstName"
                type="text"
                placeholder="Enter FirstName"
                className="mx-3"
              />
              <ErrorMessage name="firstName" />
              <Field
                name="lastName"
                type="text"
                placeholder="Enter LastName"
                className="mx-3"
              />
              <ErrorMessage name="lastName" />
            </div>
            <div className="mb-3">
              <Field
                name="email"
                type="email"
                placeholder="Enter Email"
                className="mx-3"
              />
              <ErrorMessage name="email" />
              <Field
                name="password"
                type="password"
                placeholder="Enter Password"
                className="mx-3"
              />
              <ErrorMessage name="password" />
            </div>
            <div className="mb-3">
              <div className="dates">
                <label htmlFor="dob">
                  <b>DOB</b>
                </label>
                <Field
                  name="dob"
                  type="date"
                  className="mx-3"
                  min={"1900-01-01"}
                  max={getCurrentDate()}
                />
                <ErrorMessage name="dob" />
              </div>
              <div className="dates">
                <label htmlFor="dob">
                  <b>JoinedDate</b>
                </label>
                <Field
                  name="joinedDate"
                  type="date"
                  className="mx-3"
                  min={"1900-01-01"}
                  max={getCurrentDate()}
                />
                <ErrorMessage name="joinedDate" />
              </div>
            </div>
            <div className="mb-3 image-genders">
              <div className="genders">
                <label htmlFor="isAdmin">
                  <b>IsAdmin</b>
                </label>
                <Field
                  type="radio"
                  name="isAdmin"
                  value="true"
                  className="mx-3"
                />{" "}
                Yes
                <Field
                  type="radio"
                  name="isAdmin"
                  value="false"
                  className="mx-3"
                />{" "}
                No
                <ErrorMessage name="isAdmin" />
                <Field name="gender" as="select">
                  <option value="">Select a Gender</option>
                  <option value="Male">MALE</option>
                  <option value="Female">FEMALE</option>
                  <option value="Not Specified">NOT SPECIFIED</option>
                </Field>
                <ErrorMessage name="gender" />
              </div>
              <div>
                <Field
                  name="p-image"
                  type="file"
                  className="mx-3"
                  onChange={(event: any) => {
                    setFieldValue("profileImageUrl", event.target.files[0]);
                  }}
                />
                <ErrorMessage name="profileImageUrl" />
              </div>
            </div>
            <div className="mb-3">
              <Field
                as={"textarea"}
                placeholder="Enter Address"
                name="address"
              />
              <ErrorMessage name="address" />
              <Field
                type="text"
                placeholder="Enter Designation"
                name="designation"
                className="user-designation"
              />
              <ErrorMessage name="designation" />
            </div>
            <div className="submit-btn">
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </div>
          </Form>
        )}
        {/* <form className="add-user-container">
          <h2 className="main-heading">Add User</h2>
          <div className="mb-3">
            <input
              type="number"
              placeholder="Enter EmpId"
              id="empId"
              className="mx-3"
            />
            <input
              type="tel"
              placeholder="Enter Mobile"
              id="mobile"
              className="mx-3"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter FirstName"
              id="firstName"
              className="mx-3"
            />
            <input
              type="text"
              placeholder="Enter LastName"
              id="lastName"
              className="mx-3"
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter Email"
              id="email"
              className="mx-3"
            />
            <input
              type="password"
              placeholder="Enter Password"
              id="password"
              className="mx-3"
            />
          </div>
          <div className="mb-3">
            <div className="dates">
              <label htmlFor="dob">
                <b>DOB</b>
              </label>
              <input
                type="date"
                placeholder="Enter Email"
                id="dob"
                className="mx-3"
              />
            </div>
            <div className="dates">
              <label htmlFor="joinedDate">
                <b>JoinedDate</b>
              </label>
              <input
                type="date"
                placeholder="Enter Password"
                id="joinedDate"
                className="mx-3"
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="dates">
              <input type="file" placeholder="PMG" className="mx-3" />
            </div>
            <div>
              <label htmlFor="isAdmin">
                <b>IsAdmin</b>
              </label>
              <input
                type="radio"
                id="isAdmin"
                className="mx-3"
                checked={isAdmin == true}
                value={"true"}
              />
              <input
                type="radio"
                id="isAdmin"
                className="mx-3"
                checked={isAdmin == false}
                value={"false"}
              />
              <select name="gender" id="gender">
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="NOT SPECIFIED">NOT SPECIFIED</option>
              </select>
            </div>
          </div>
        </form> */}
      </Formik>
    </div>
  );
}

export default AddUser2;
