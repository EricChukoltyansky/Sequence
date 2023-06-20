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

  console.log(user)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
