import React, { useState, useRef } from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const DialContainer = styled.div`
  display: flex;
  flex-direction: row; /* Horizontal layout for rotation */
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xs};
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const DialLabel = styled.div`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;
  transform: rotate(-90deg); /* Counter-rotate to stay readable */
  flex-shrink: 0;
`;

const DialWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
`;

const DialBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary},
    ${theme.colors.tertiary}
  );
  border: 2px solid ${theme.colors.border};
  position: relative;
  box-shadow: ${theme.shadows.md}, inset 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.status.success};
    box-shadow: ${theme.shadows.lg},
      ${helpers.glow(theme.colors.status.success, 8)};
  }
`;

const DialTrack = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; /* Smaller SVG */
  height: 40px;
`;

const DialProgress = styled.circle`
  fill: none;
  stroke: ${theme.colors.status.success};
  stroke-width: 3;
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px ${theme.colors.status.success});
  transition: stroke-dasharray ${theme.transitions.normal};
`;

const DialKnob = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: ${theme.colors.status.success};
  border-radius: 50%;
  box-shadow: ${helpers.glow(theme.colors.status.success, 6)};
  transform-origin: 0 0;
  transition: all ${theme.transitions.fast};
`;

const DialValue = styled.div`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.status.success};
  background: ${theme.colors.primary};
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.status.success};
  min-width: 35px;
  text-align: center;
  white-space: nowrap;
  transform: rotate(-90deg); /* Counter-rotate to stay readable */
  flex-shrink: 0;
`;

const Volume = ({ min = -60, max = 4, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef(null);
  const startAngleRef = useRef(0);
  const startValueRef = useRef(value);
  const isDraggingRef = useRef(false); // Use ref for immediate access

  // Convert value to angle (240 degrees total range, starting from -120 degrees)
  const valueToAngle = (val) => {
    const percentage = (val - min) / (max - min);
    return -120 + percentage * 240; // -120 to +120 degrees
  };

  // Convert angle to value
  const angleToValue = (angle) => {
    // Normalize angle to 0-240 range
    const normalizedAngle = angle + 120;
    const percentage = Math.max(0, Math.min(1, normalizedAngle / 240));
    return min + percentage * (max - min);
  };

  // Calculate circumference and dash array for progress ring
  const radius = 18; // Smaller radius for smaller dial
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (value - min) / (max - min);
  const dashArray = `${
    circumference * progressPercentage * 0.75
  } ${circumference}`;

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    
    setIsDragging(true);
    isDraggingRef.current = true; // Set ref immediately
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    startAngleRef.current =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    startValueRef.current = value;

    
    // Use passive: false to ensure we can prevent default
    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });
  };

  const handleMouseMove = (e) => {
    
    if (!isDraggingRef.current) return;

    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    let angleDiff = currentAngle - startAngleRef.current;

    // Handle angle wraparound
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    const sensitivity = 0.5;
    const newValue = Math.max(
      min,
      Math.min(max, startValueRef.current + angleDiff * sensitivity)
    );

    onChange({ target: { value: Math.round(newValue) } });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false; // Clear ref immediately
    document.removeEventListener("mousemove", handleMouseMove, { passive: false });
    document.removeEventListener("mouseup", handleMouseUp, { passive: false });
  };

  const knobAngle = valueToAngle(value);

  // Cleanup effect to ensure no lingering event listeners
  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, { passive: false });
      document.removeEventListener("mouseup", handleMouseUp, { passive: false });
    };
  }, []);

  return (
    <DialContainer>
      <DialLabel>Volume</DialLabel>

      <DialWrapper ref={dialRef} onMouseDown={handleMouseDown}>
        <DialBackground />

        <DialTrack>
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke={theme.colors.border}
            strokeWidth="2"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeDashoffset={`${circumference * 0.125}`}
            transform="rotate(-90 20 20)"
          />
          <DialProgress
            cx="20"
            cy="20"
            r={radius}
            strokeDasharray={dashArray}
            strokeDashoffset={`${circumference * 0.125}`}
            transform="rotate(-90 20 20)"
          />
        </DialTrack>

        <DialKnob
          style={{
            transform: `translate(-50%, -50%) rotate(${knobAngle}deg) translateY(-16px)`,
          }}
        />
      </DialWrapper>

      <DialValue>{value}dB</DialValue>
    </DialContainer>
  );
};

export default Volume;
