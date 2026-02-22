import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const Button = styled.button`
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  box-shadow: 0px 0px 2px #fff;
  text-shadow: 0px 0px 2px #fff;
  font-size: 0.75rem; /* Smaller font for narrow navbar */
  border-radius: 5px;
  transition: 0.2s ease-in-out;
  font-family: ${theme.typography.fontFamily.primary};
  cursor: pointer;
  padding: 6px 8px; /* Tighter padding */
  width: 100%; /* Take full width of container */
  max-width: 100px; /* Limit max width */
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #000;
    background-color: #f8f8ff;
    box-shadow: 0px 0px 5px #fff;
    text-shadow: 0px 0px 5px #000;
  }

  /* Very small screens */
  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 4px 6px;
    max-width: 70px;
  }
`;

function LoginRegisterButton({ onClick }) {
  return <Button onClick={onClick}>Login</Button>;
}

export default LoginRegisterButton;
