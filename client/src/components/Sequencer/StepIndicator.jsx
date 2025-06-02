// 🎯 CREATE: client/src/components/Sequencer/StepIndicator.jsx
// Step indicator component for showing current playback position

import React from 'react';
import styled from 'styled-components';
import { theme, helpers } from '../../theme';

const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  width: 100%;
  padding: 0 ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  
  /* Mobile responsive */
  ${theme.media.mobile} {
    padding: 0 ${theme.spacing.sm};
    gap: 1px;
    margin-bottom: ${theme.spacing.md};
  }
`;

const StepNumber = styled.div`
  width: ${theme.components.cell.size};
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${theme.borderRadius.sm};
  margin: ${theme.spacing.xs};
  position: relative;
  transition: all ${theme.transitions.fast};
  
  /* Beat emphasis - highlight every 4th step */
  ${props => (props.index + 1) % 4 === 1 && `
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    font-weight: ${theme.typography.fontWeight.semibold};
  `}
  
  /* Current step highlighting */
  ${props => props.current && `
    background: linear-gradient(135deg, ${theme.colors.status.info}, #42a5f5);
    color: ${theme.colors.primary};
    border-color: ${theme.colors.status.info};
    box-shadow: 
      ${theme.shadows.md},
      ${helpers.glow(theme.colors.status.info, 12)};
    font-weight: ${theme.typography.fontWeight.bold};
    transform: scale(1.1);
    z-index: 2;
  `}
  
  /* Hover effect */
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: ${props => props.current ? 'scale(1.1)' : 'scale(1.05)'};
  }
  
  /* Mobile responsive */
  ${theme.media.mobile} {
    width: ${theme.components.cell.sizeSmall};
    height: 18px;
    font-size: 10px;
    margin: 1px;
  }
`;

const StepIndicator = ({ totalSteps = 16, currentStep = 0 }) => {
  return (
    <StepIndicatorContainer>
      {Array.from({ length: totalSteps }, (_, i) => (
        <StepNumber 
          key={i} 
          index={i}
          current={i === currentStep}
        >
          {i + 1}
        </StepNumber>
      ))}
    </StepIndicatorContainer>
  );
};

export default StepIndicator;