import React from "react";

const AddUserModal = () => {
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
              <div>
                <label htmlFor="fname">
                  <b>FirstName</b>
                </label>
              </div>
              <input
                type="text"
                name="firstName"
                id="fname"
                placeholder="Enter FirstName"
              />
              <div>
                <label htmlFor="lname">
                  <b>LastName</b>
                </label>
              </div>
              <input
                type="text"
                name="lastName"
                id="lname"
                placeholder="Enter Lastname"
              />
              <div>
                <label htmlFor="email">
                  <b>Email</b>
                </label>
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
              />
              <div>
                <label htmlFor="mobile">
                  <b>Mobile</b>
                </label>
              </div>
              <input
                type="tel"
                name="mobile"
                id="mobile"
                pattern="[0-9]{10}"
                placeholder="Enter mobile number"
              />
              <div>
                <label htmlFor="password">
                  <b>Password</b>
                </label>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
              />
              <div>
                <label htmlFor="dob">
                  <b>DOB</b>
                </label>
              </div>
              <input type="date" name="dob" id="dob" placeholder="Enter dob" />
              <div>
                <label htmlFor="joinedDate">
                  <b>JoinedDate</b>
                </label>
              </div>
              <input
                type="date"
                name="joinedDate"
                id="joinedDate"
                placeholder="Enter joinedDate"
              />
              <div>
                <label htmlFor="profileImageUrl">
                  <b>Profile_Image</b>
                </label>
              </div>
              <input type="file" name="profileImageUrl" id="profileImageUrl" />
              <div>
                <label htmlFor="designation">
                  <b>Designation</b>
                </label>
              </div>
              <input
                type="text"
                name="designation"
                id="designation"
                placeholder="Enter designation"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
