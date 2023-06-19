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

const Login = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <Container>
        <h1>Login</h1>
        <form>
          <label>
            Username:
            <input type="text" name="username" />
          </label>
          <label>
            Password:
            <input type="text" name="password" />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </Container>
    </div>
  );
});
export default Login;
