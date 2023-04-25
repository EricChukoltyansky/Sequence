import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 67vh;
  width: 60vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  background: #1c1c1e;
  margin: 0 auto;
  z-index: 999;
  position: absolute;
  top: 20vh;
  left: 20vw;
  border-radius: 20px;
  text-shadow: 0px 0px 4px #ffffff;
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.5s ease-in-out;
  box-shadow: 10px 10px 10px 10px rgba(0.5, 0.5, 0.5, 0.5);
`;

const H1 = styled.h1`
  font-family: "Fuzzy Bubbles", cursive;
  color: #fff;
  font-size: 5vh;
  text-align: center;
  margin: 0 auto;
  padding: 0;
`;

const Ul = styled.ul`
  font-family: "Fuzzy Bubbles", cursive;
  color: #fff;
  font-size: 3vh;
  text-align: start;
  margin: 0 auto;
  padding: 0;
  list-style-type: none;
  line-height: 2em;
`;

export default function Instructions() {
  return (
    <Container>
      <H1>Instructions</H1>
      <Ul>
        <li style={{textAlign: 'center', fontSize: '3.5vh', color:'#e5ff00'}}>Play music together in real time!</li>
        <li>*Click on a cell to activate a sound</li>
        <li>*Click the play/pause button to control the sequencer</li>
        <li>*Click the stop button to stop("rewind") the sequencer</li>
        <li>*Click the speaker to turn on/off the sound</li>
        <li>*Click the trash can to clear the sequencer</li>
        <li>*Use the volume slider to adjust the volume</li>
        <li>*Use the BPM slider to adjust the tempo</li>
        <li>*Left side shows the instruments being played</li>
        <li>*Right side shows the notes being played</li>
      </Ul>
    </Container>
  );
}
