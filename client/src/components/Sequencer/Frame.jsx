import styled from "styled-components";
import { theme } from "../../theme";

const Frame = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  width: min(90vw, 1200px);
  height: calc(100vh - 180px);
  margin: 0 auto;
  position: relative;
  top: -80px;
  gap: 2px;
  
  /* Responsive adjustments */
  ${theme.media.mobile} {
    width: calc(100vw - 160px); /* Account for navbar on mobile */
    height: calc(100vh - 120px);
    gap: 1px;
    top: -40px;
  }
  
  ${theme.media.tablet} {
    width: calc(100vw - 200px);
    gap: 1.5px;
    top: -60px;
  }
  
  /* Very small screens */
  @media (max-width: 480px) {
    width: calc(100vw - 120px);
    height: calc(100vh - 100px);
    gap: 0.5px;
    top: -20px;
  }
`;

export default Frame;
