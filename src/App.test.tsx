import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import AuthContext from "./components/Authcontext/AuthContext";

const Wrapper = () => (
  <AuthContext>
    <App />
  </AuthContext>
);

test("should render welcome page", () => {
  render(<Wrapper />);
  const linkElement = screen.getByText(/RESOURCE ONE IT SOLUTIONS/i);
  expect(linkElement).toBeInTheDocument();
});
