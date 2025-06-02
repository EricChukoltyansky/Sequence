import styled from "styled-components";

const Frame = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  width: 75vw;
  height: calc(100vh - 180px);
  margin: 0 auto;

  /* Fine-tune alignment with note labels - adjust this value to align perfectly */
  position: relative;
  top: -80px; /* Reduced from -120px to better align with notes */

  /* Remove background from grid - will be on body instead */
`;

export default Frame;
