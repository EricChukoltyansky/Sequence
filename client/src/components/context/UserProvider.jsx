import { useState, createContext } from "react";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    isLoggedIn: false,
  });
  const [backendUserResponse, setBackendUserResponse] = useState("");
  const [isMessageShown, setIsMessageShown] = useState(false);

  const submitForm = async (mode) => {
    const url =
      mode === "login"
        ? "http://localhost:3001/login"
        : "http://localhost:3001/register";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    console.log(response);
    const data = await response.json();
    setBackendUserResponse(data);
    setIsMessageShown(true);

    setTimeout(() => {
      setIsMessageShown(false);
    }, 3000);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, submitForm, backendUserResponse, isMessageShown }}
    >
      {children}
    </UserContext.Provider>
  );
}
