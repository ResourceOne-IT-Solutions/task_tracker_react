import React from "react";
import { COMPANY_NAME } from "../../utils/Constants";

const Footer = () => {
  return (
    <footer className="footer fw-semibold">
      <div className="d-flex flex-wrap text-center justify-content-center align-items-center">
        <div>&copy; 2024 {COMPANY_NAME}.</div> <div>All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
