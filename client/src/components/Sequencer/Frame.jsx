import styled from "styled-components";
import { theme } from "../../theme";

const Frame = styled.div`
  display: grid;
  margin: 0 auto;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  width: 75vw;
  height: calc(100vh - 100px); /* More space for all 13 rows */
  padding: ${theme.spacing.md}; /* Reduced padding */
  gap: 2px;

  /* Enhanced grid background */
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.secondary} 100%
  );
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.borderLight};

  /* Shadows for depth */
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3);

  position: relative;

  /* Mobile responsive */
  ${theme.media.mobile} {
    width: 95vw;
    height: calc(100vh - 80px);
    padding: ${theme.spacing.sm};
    gap: 1px;
  }
`;

export default Frame;
