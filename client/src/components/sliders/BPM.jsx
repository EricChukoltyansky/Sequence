import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const BPMSliderContainer = styled.div`
  position: relative;
  width: 120px;
  height: 40px;
  display: flex;
  align-items: center; /* Centers slider vertically */
  justify-content: center;
  margin: ${theme.spacing.md};

  ${theme.media.mobile} {
    width: 80px;
    margin: ${theme.spacing.sm};
  }
`;

const BPMSliderLabel = styled.label`
  position: absolute;
  top: -18px; /* Moved closer to slider */
  left: 0;
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BPMSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: ${theme.components.slider.height};
  border-radius: ${theme.components.slider.borderRadius};
  background: linear-gradient(
    to right,
    ${theme.colors.status.info} 0%,
    ${theme.colors.status.info}
      ${(props) => ((props.value - props.min) / (props.max - props.min)) * 100}%,
    ${theme.colors.secondary}
      ${(props) => ((props.value - props.min) / (props.max - props.min)) * 100}%,
    ${theme.colors.secondary} 100%
  );
  outline: none;
  cursor: pointer;
  position: relative;

  /* Track styling */
  &::-webkit-slider-track {
    height: ${theme.components.slider.height};
    background: transparent;
    border: none;
    border-radius: ${theme.components.slider.borderRadius};
  }

  &::-moz-range-track {
    height: ${theme.components.slider.height};
    background: transparent;
    border: none;
    border-radius: ${theme.components.slider.borderRadius};
  }

  /* Thumb styling */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: ${theme.components.slider.thumbSize};
    height: ${theme.components.slider.thumbSize};
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.colors.status.info}, #42a5f5);
    box-shadow: ${theme.shadows.md},
      ${helpers.glow(theme.colors.status.info, 8)};
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: all ${theme.transitions.fast};
    position: relative;
  }

  &::-moz-range-thumb {
    width: ${theme.components.slider.thumbSize};
    height: ${theme.components.slider.thumbSize};
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.colors.status.info}, #42a5f5);
    box-shadow: ${theme.shadows.md},
      ${helpers.glow(theme.colors.status.info, 8)};
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: all ${theme.transitions.fast};
  }

  /* Hover effects */
  &:hover::-webkit-slider-thumb {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.lg},
      ${helpers.glow(theme.colors.status.info, 15)};
  }

  &:hover::-moz-range-thumb {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.lg},
      ${helpers.glow(theme.colors.status.info, 15)};
  }

  /* Active state */
  &:active::-webkit-slider-thumb {
    transform: scale(1.05);
    box-shadow: ${theme.shadows.xl},
      ${helpers.glow(theme.colors.status.info, 20)};
  }

  &:active::-moz-range-thumb {
    transform: scale(1.05);
    box-shadow: ${theme.shadows.xl},
      ${helpers.glow(theme.colors.status.info, 20)};
  }

  /* Focus for accessibility */
  ${helpers.focus(theme.colors.status.info)}
`;

const BPMValue = styled.div`
  position: absolute;
  top: -18px; /* Moved to same level as label */
  right: 0;
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.status.info};
  background: ${theme.colors.primary};
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.status.info};
  min-width: 35px;
  text-align: center;
`;

const BPM = ({ max, min, step, type, value, onChange }) => (
  <BPMSliderContainer>
    <BPMSliderLabel>Tempo</BPMSliderLabel>
    <BPMSlider
      max={max}
      min={min}
      step={step}
      type={type}
      value={value}
      onChange={onChange}
    />
    <BPMValue>{value}</BPMValue>
  </BPMSliderContainer>
);

export default BPM;
