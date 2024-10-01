/** @format */
"use client";

import MainPageTeacher from "@/components/CoreComponent/admin/dashboard/mainpage/MainPageTeacher";
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
interface DisplayProviderTeacherProps {
  children: ReactNode;
}

// Context provider function component
export const DisplayProviderTeacher: React.FC<DisplayProviderTeacherProps> = ({
  children,
}) => {
  const [display, setDisplay] = useState<DisplayState>({
    component: <MainPageTeacher />,
    componentId: "dashboardTeacher",
  });

  return (
    <DisplayContext.Provider value={{ display, setDisplay }}>
      {children}
    </DisplayContext.Provider>
  );
};

// Hook to use the context
export function useTeacherDisplay(): DisplayContextType {
  const context = useContext(DisplayContext);
  if (context === undefined) {
    throw new Error(
      "useManagerDisplay must be used within a DisplayProviderTeacher"
    );
  }
  return context;
}
