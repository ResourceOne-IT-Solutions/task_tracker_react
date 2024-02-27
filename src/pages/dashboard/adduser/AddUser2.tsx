import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./AddUser2.css";
import {
  CreateUserPayload,
  UserContext,
  UserModal,
} from "../../../modals/UserModals";
import { EMPTY_USER_PAYLOAD } from "../../../utils/Constants";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getCurrentDate, getFullName } from "../../../utils/utils";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import httpMethods from "../../../api/Service";
import { Severity } from "../../../utils/modal/notification";
import { ErrorMessageInterface } from "../../../modals/interfaces";

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
      .min(3, "Alphabets Only, Minimum 3 Characters")
      .required("Required"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (
    values: CreateUserPayload,
    { setSubmitting, resetForm }: any,
  ) => {
    if (values.profileImageUrl) {
      setIsLoading(true);
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
          const content = `Name : ${getFullName(result)}, \nUser ID: ${
            result.userId
          }, \nEmployee ID : ${result.empId}, \nPassword: ${values.password}\n`;
          alertModal({
            severity: Severity.SUCCESS,
            content,
            title: "User Create",
          });
          resetForm();
        })
        .catch((e: ErrorMessageInterface) => {
          alertModal({
            severity: Severity.ERROR,
            content: e.message,
            title: "User Create",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <div>
      <Formik
        initialValues={EMPTY_USER_PAYLOAD}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="add-user-container">
            <h2 className="main-heading">Add User</h2>
            <div className="mb-3 d-flex w-100">
              <div className="w-50">
                <label>
                  <b>EmpId</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="empId"
                    type="number"
                    placeholder="Enter EmpId"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="empId"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
              <div className="w-50 ms-2">
                <label>
                  <b>Mobile</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="mobile"
                    type="tel"
                    placeholder="Enter Mobile"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 d-flex w-100">
              <div className="w-50">
                <label>
                  <b>First Name</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="Enter FirstName"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
              <div className="w-50 ms-2">
                <label>
                  <b>Last Name</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="lastName"
                    type="text"
                    placeholder="Enter LastName"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 d-flex w-100">
              <div className="w-50">
                <label>
                  <b>Email ID</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
              <div className="w-50 ms-2">
                <label>
                  <b>Password</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 d-flex w-100">
              <div className="dates w-50">
                <label htmlFor="dob">
                  <b>DOB</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="dob"
                    type="date"
                    className="form-control"
                    min={"1900-01-01"}
                    max={getCurrentDate()}
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
              <div className="dates w-50 ms-2">
                <label htmlFor="dob">
                  <b>JoinedDate</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="joinedDate"
                    type="date"
                    className="form-control"
                    min={"1900-01-01"}
                    max={getCurrentDate()}
                  />
                  <ErrorMessage
                    name="joinedDate"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 image-genders d-flex w-100">
              <div className="w-50 genders row m-0">
                <div className="col-3 px-0">
                  <label htmlFor="isAdmin">
                    <b>Admin: </b>
                  </label>
                  <div className="input-filed">
                    <div className="form-control">
                      <Field
                        type="radio"
                        name="isAdmin"
                        value="true"
                        className="ms-2"
                      />{" "}
                      Yes
                      <Field
                        type="radio"
                        name="isAdmin"
                        value="false"
                        className="ms-2"
                      />{" "}
                      No
                      <ErrorMessage
                        name="isAdmin"
                        component="div"
                        className="text-danger error"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-9">
                  <label>
                    <b>Gender</b>
                  </label>
                  <div className="input-filed">
                    <Field name="gender" as="select" className="form-control">
                      <option value="">Select a Gender</option>
                      <option value="Male">MALE</option>
                      <option value="Female">FEMALE</option>
                      <option value="Prefer not to say">
                        PREFER NOT TO SAY
                      </option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-danger error"
                    />
                  </div>
                </div>
              </div>
              <div className="w-50 ms-2">
                <label>
                  <b>Upload</b>
                </label>
                <div className="input-filed">
                  <Field
                    name="p-image"
                    type="file"
                    className="form-control"
                    onChange={(event: any) => {
                      setFieldValue("profileImageUrl", event.target.files[0]);
                    }}
                  />
                  <ErrorMessage
                    name="profileImageUrl"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 d-flex w-100">
              <div className="w-50">
                <label>
                  <b>Gender</b>
                </label>
                <div className="input-filed">
                  <Field
                    as={"textarea"}
                    placeholder="Enter Address"
                    name="address"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
              <div className="w-50 ms-2">
                <label>
                  <b>Designation</b>
                </label>
                <div className="input-filed">
                  <Field
                    type="text"
                    placeholder="Enter Designation"
                    name="designation"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="text-danger error"
                  />
                </div>
              </div>
            </div>
            <div className="submit-btn">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddUser2;
