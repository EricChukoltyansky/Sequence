import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  height: calc(100vh - 75px);
  right: calc(100vw - 70px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  position: absolute;
`;

const Piano = styled.div`
  height: 37.5%;
  width: calc(7vw - 35px);
  top: 0.2%;
  left: 160%;
  border-left: 1px solid white;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-color: #dbaf0e;
  filter: drop-shadow(0px 0px 2px #dbaf0e);
  position: absolute;
`;

const Bass = styled.div`
  height: 30.5%;
  width: calc(7vw - 35px);
  top: 38.5%;
  left: 160%;
  border-left: 1px solid white;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-color: #0abb07;
  filter: drop-shadow(0px 0px 2px #0abb07);
  position: absolute;
`;

const Drums = styled.div`
  height: 30%;
  width: calc(7vw - 35px);
  top: 69.8%;
  left: 160%;
  border-left: 1px solid white;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-color: #1272e7;
  filter: drop-shadow(0px 0px 2px #1272e7);
  position: absolute;
`;

export default function Braces() {
  return (
    <Bar>
      <Piano />
      <Bass />
      <Drums />
    </Bar>
  );
}
