import React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../../context/UserProvider";

const Container = styled.div`
  height: 400px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1c1c1e;
  margin: 0 auto;
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  text-shadow: 0px 0px 4px #ffffff;
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.5s ease-in-out;
  box-shadow: 10px 10px 10px 10px rgba(0.5, 0.5, 0.5, 0.5);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLabel = styled.label`
  color: #fff;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-left: 10px;
`;

const StyledButton = styled.input`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const AuthForm = React.forwardRef(({ mode, onToggleMode }, ref) => {
  const userContext = useContext(UserContext);
  const { user, setUser, submitForm } = userContext;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <div ref={ref}>
      <Container>
        <h1 style={{ color: "#fff" }}>
          {mode === "login" ? "Login" : "Register"}
        </h1>
        <StyledForm>
          <StyledLabel>
            Username
            <StyledInput
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
            />
          </StyledLabel>
          {mode === "register" && (
            <StyledLabel>
              Email
              <StyledInput
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </StyledLabel>
          )}
          <StyledLabel>
            Password
            <StyledInput
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
            />
          </StyledLabel>
          <StyledButton
            type="button"
            value={mode === "login" ? "Register" : "Login"}
            onClick={onToggleMode}
          />
          <StyledButton type="submit" value={"Submit"} onClick={handleSubmit} />
        </StyledForm>
      </Container>
    </div>
  );
});

export default AuthForm;
