import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check localStorage for user info on initial app load
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUserInfo(userData);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  const updateUserInfo = (newUserData) => {
    // Merge new data with existing data to ensure the token is preserved
    const updatedInfo = { ...userInfo, ...newUserData };
    localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
    setUserInfo(updatedInfo);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
