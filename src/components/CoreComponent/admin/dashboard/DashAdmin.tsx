/** @format */
"use client";
import { Suspense, useEffect, useState } from "react";
import Sidebar from "./SideBarAdmin";
import TopBar from "./TopBarAdmin";
import { useSearchParams } from "next/navigation";
import { useAdminDisplay } from "@/utils/providers/displayProvider/DisplayProviderAdminMain";
import { componentDictionaryAdmin } from "../../dictionary/ComponentDictAdmin";
import LoadingComponentProcessing from "@/components/UIComponent/Loading/LoadingComponentProcessing";

// pages/index.tsx

const AdminDash: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
  };
  const { setDisplay, display } = useAdminDisplay();

  const searchParams = useSearchParams();
  const componentId = searchParams.get("component");

  useEffect(() => {
    // Check if the URL has a component query parameter
    if (componentId && componentDictionaryAdmin[componentId]) {
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
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <div className="flex flex-col flex-1 ">
          <TopBar toggleSidebar={toggleSidebar} />

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

export default AdminDash;
