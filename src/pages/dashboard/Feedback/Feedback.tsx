import React, { useState } from "react";
import { useUserContext } from "../../../components/Authcontext/AuthContext";
import { UserContext } from "../../../modals/UserModals";
import { getFullName } from "../../../utils/utils";
import "./Feedback.css";
import { Button } from "react-bootstrap";
import httpMethods from "../../../api/Service";
import { Severity } from "../../../utils/modal/notification";

const Feedback = () => {
  const userContext = useUserContext();
  const { currentUser, alertModal } = userContext as UserContext;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
    files: [] as File[],
    type: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    content: "",
    files: "",
    type: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleFileChange = (e: any) => {
    const files = e.target.files;
    setFormData({
      ...formData,
      files,
    });
    setErrors({
      ...errors,
      files: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (formData.content.trim() === "") {
      newErrors.content = "Content is required";
      valid = false;
    }
    if (formData.type === "") {
      newErrors.type = "Please select an issue type";
      valid = false;
    }

    if (!formData.files) {
      newErrors.files = "File is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      const name = getFullName(currentUser);
      const { email } = currentUser;

      const formDataWithUserDetails = {
        ...formData,
        sender: { name, id: currentUser._id },
      };
      const formdata = new FormData();
      formdata.append("data", JSON.stringify(formDataWithUserDetails));
      formdata.append("files", formData.files[0]);
      httpMethods.post("/feedback", formdata, true).catch((err) => {
        alertModal({
          severity: Severity.ERROR,
          content: `${err.message}`,
          title: "Feedback Sumit",
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback_form">
      <div>
        <label htmlFor="name">Name:</label> {getFullName(currentUser)}
      </div>

      <div>
        <label htmlFor="email">Email:</label> {currentUser.email}
      </div>

      <div>
        <label htmlFor="content">Content:</label>{" "}
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
        />
        <span className="error">{errors.content}</span>
      </div>

      <div>
        <label htmlFor="type">Issue Type:</label>{" "}
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="select-border"
        >
          <option value="" disabled>
            Select an issue type
          </option>
          <option value="bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="Update">Update</option>
        </select>
        <span className="error">{errors.type}</span>
      </div>
      <div>
        <label htmlFor="file">File:</label>{" "}
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
        <span className="error">{errors.files}</span>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default Feedback;
