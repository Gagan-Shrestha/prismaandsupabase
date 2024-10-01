/** @format */
"use client";

import Login from "@/components/CoreComponent/Login/Login";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define a type for the context state
type DisplayState = {
  component: ReactNode | null;
  componentId: string | null;
};

// Define a type for the context itself
type DisplayContextType = {
  displayNormal: DisplayState;
  setDisplayNormal: Dispatch<SetStateAction<DisplayState>>;
};

// Create a context with a default value
const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

// Context provider component type
interface DisplayProviderNormalProps {
  children: ReactNode;
}

// Context provider function component
export const DisplayProviderNormal: React.FC<DisplayProviderNormalProps> = ({
  children,
}) => {
  const [displayNormal, setDisplayNormal] = useState<DisplayState>({
    component: <Login />,
    componentId: "login",
  });

  return (
    <DisplayContext.Provider value={{ displayNormal, setDisplayNormal }}>
      {children}
    </DisplayContext.Provider>
  );
};

// Hook to use the context
export function useNormalDisplay(): DisplayContextType {
  const context = useContext(DisplayContext);
  if (context === undefined) {
    throw new Error(
      "useNormalDisplay must be used within a DisplayProviderNormal"
    );
  }
  return context;
}
