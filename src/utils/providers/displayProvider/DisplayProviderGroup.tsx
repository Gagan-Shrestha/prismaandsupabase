/** @format */
"use client";

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
  display: DisplayState;
  setDisplay: Dispatch<SetStateAction<DisplayState>>;
};

// Create a context with a default value
const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

// Context provider component type
interface DisplayProviderGroupProps {
  children: ReactNode;
}

// Context provider function component
export const DisplayProviderGroup: React.FC<DisplayProviderGroupProps> = ({
  children,
}) => {
  const [display, setDisplay] = useState<DisplayState>({
    component: <div></div>,
    componentId: "dashboard",
  });

  return (
    <DisplayContext.Provider value={{ display, setDisplay }}>
      {children}
    </DisplayContext.Provider>
  );
};

// Hook to use the context
export function useGroupDisplay(): DisplayContextType {
  const context = useContext(DisplayContext);
  if (context === undefined) {
    throw new Error(
      "useGroupDisplay must be used within a DisplayProviderGroup"
    );
  }
  return context;
}
