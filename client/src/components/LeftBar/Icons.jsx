import React from "react";
import styled from "styled-components";
import { GiDrumKit, GiGuitarBassHead } from "react-icons/gi";
import { CgPiano } from "react-icons/cg";

const Bar = styled.div`
  height: calc(100vh - 75px);
  right: calc(100vw - 50px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  font-size: 20px;
  position: absolute;
`;

const Piano = styled.h1`
  color: #dbaf0e;
  filter: drop-shadow(0px 0px 1px #dbaf0e);
`;

const Bass = styled.h1`
  color: #0abb07;
  filter: drop-shadow(0px 0px 1px #0abb07);
`;

const Drums = styled.h1`
  color: #1272e7;
  filter: drop-shadow(0px 0px 1px #1272e7);
`;

export default function Icons() {
  return (
    <Bar>
      <Piano>
        <CgPiano />
      </Piano>
      <Bass>
        <GiGuitarBassHead />
      </Bass>
      <Drums>
        <GiDrumKit />
      </Drums>
    </Bar>
  );
}
