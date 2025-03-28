import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  // Safely parse user from localStorage
  const getInitialUser = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return null;
      return JSON.parse(userString);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  };

  const [user, setUser] = useState(
    () =>
      getInitialUser() || {
        _id: "1",
        picture: "",
        name: "John Doe",
        email: "john@gmail.com",
        role: "Admin",
        createdAt: "12/12/2021",
        updatedAt: "12/12/2021",
      }
  );

  const login = (userData) => {
    localStorage.setItem("isAuthenticated", "true");
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const updateUser = () => {
    const updatedUser = getInitialUser();
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("Access_Token");
    localStorage.removeItem("Refresh_Token");
    localStorage.removeItem("Auth_Expiration");
    localStorage.removeItem("user");
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, updateUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
