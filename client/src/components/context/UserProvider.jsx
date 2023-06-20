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

  const submitForm = async () => {
    const response = await fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <UserContext.Provider value={{ user, setUser, submitForm }}>
      {children}
    </UserContext.Provider>
  );
}
