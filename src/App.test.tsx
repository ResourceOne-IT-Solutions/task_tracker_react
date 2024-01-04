import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./components/Authcontext/AuthContext";

const Wrapper = () => (
  <AuthContext>
    <App />
  </AuthContext>
);

test("renders learn react link", () => {
  render(<Wrapper />);
  screen.debug();
  const linkElement = screen.getByText(/RESOURCE ONE IT SOLUTIONS/i);
  expect(linkElement).toBeInTheDocument();
});
