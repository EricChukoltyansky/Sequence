import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";
import Instructions from "../Instructions/Instructions";

const Button = styled.button`
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  box-shadow: 0px 0px 2px #fff;
  text-shadow: 0px 0px 2px #fff;
  font-size: 1.4rem;
  border-radius: 5px;
  transition: 0.2s ease-in-out;
  font-family: "Fuzzy Bubbles", cursive;
  cursor: pointer;
  padding: 8px 16px;

  &:hover {
    color: #000;
    background-color: #f8f8ff;
    box-shadow: 0px 0px 5px #fff;
    text-shadow: 0px 0px 5px #000;
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px #fff, 0 0 0 2px #fff;
  }
`;

function InstructionsButton({ onClick }) {
  return (
    <Button onClick={onClick} aria-label="Show instructions">
      Instructions
    </Button>
  );
}

export default InstructionsButton;
