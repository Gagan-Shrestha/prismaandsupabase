/** @format */
"use client";
import { Suspense, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import LoadingComponentProcessing from "@/components/UIComponent/Loading/LoadingComponentProcessing";
import { useTeacherDisplay } from "@/utils/providers/displayProvider/DisplayProviderTeacherMain";
import { componentDictionaryTeacher } from "../../dictionary/ComponentDIctTeacher";
import { componentDictionaryAdmin } from "../../dictionary/ComponentDictAdmin";
import SidebarTeacher from "./SideBarTeacher";
import TopBarTeacher from "./TopBarTeacher";

// pages/index.tsx

const TeacherDash: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
  };
  const { setDisplay, display } = useTeacherDisplay();

  const searchParams = useSearchParams();
  const componentId = searchParams.get("component");

  useEffect(() => {
    // Check if the URL has a component query parameter
    if (componentId && componentDictionaryTeacher[componentId]) {
      // Set the display based on the URL's componentId
      setDisplay({
        component: componentDictionaryAdmin[componentId],
        componentId,
      });
    }
  }, [componentId, setDisplay]);

  return (
    <div className="flex flex-col h-screen overflow-y-hidden ">
      <div className="flex flex-1 h-full w-full">
        <div className="">
          {" "}
          <SidebarTeacher
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <div className="flex flex-col flex-1 ">
          <TopBarTeacher toggleSidebar={toggleSidebar} />

          <div className="flex-1 p-4 overflow-y-auto bg-gray-100  overflow-x-auto w-full">
            <Suspense fallback={<LoadingComponentProcessing />}>
              {display.component}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDash;
