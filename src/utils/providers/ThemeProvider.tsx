/** @format */

import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context type
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
interface ThemeProviderprops {
  children: React.ReactNode;
}
// Provider component
export const ThemeProvider: React.FC<ThemeProviderprops> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  // Apply the theme class to the HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
