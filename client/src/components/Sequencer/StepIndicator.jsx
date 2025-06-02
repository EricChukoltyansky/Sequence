import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  margin-bottom: ${theme.spacing.md};
  padding: 0 ${theme.spacing.lg};
`;

const StepNumber = styled.div`
  width: ${theme.components.cell.size};
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.sm};
  margin: ${theme.spacing.xs};

  /* Highlight current step */
  ${(props) =>
    props.current &&
    `
    background: ${theme.colors.status.info};
    color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.md};
    font-weight: ${theme.typography.fontWeight.bold};
  `}

  transition: all ${theme.transitions.fast};
`;

const StepIndicator = ({ totalSteps = 16, currentStep = 0 }) => {
  return (
    <StepIndicatorContainer>
      {Array.from({ length: totalSteps }, (_, i) => (
        <StepNumber key={i} current={i === currentStep}>
          {i + 1}
        </StepNumber>
      ))}
    </StepIndicatorContainer>
  );
};

export default StepIndicator;
