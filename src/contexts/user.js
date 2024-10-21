import React, { useContext, createContext, useState, useEffect } from "react";
import { useAuthContext } from "./auth";

// Create a context for user data
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch user data from an API or other source
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${user?.id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (user) fetchUserData();
  }, [user]);

  return (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  );
};
// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);
