import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const Bar = styled.div`
  width: 100%;
  min-height: 70px;
  background: ${theme.colors.bgSecondary};
  border-bottom: 1px solid ${theme.colors.bgTertiary};
  display: flex;
  justify-content: center;
  align-items: center;
   


  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
`;

const NavBar = ({ children }) => <Bar>{children}</Bar>;

export default NavBar;
