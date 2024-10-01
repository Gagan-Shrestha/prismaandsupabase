/** @format */

import { Suspense } from "react";
import MainPageTeacher from "../admin/dashboard/mainpage/MainPageTeacher";

export const uniqueModalId = `modal_${Date.now()}`;
// A simple dictionary to map component IDs to their respective components
export const componentDictionaryTeacher: Record<string, React.ReactNode> = {
  dashboardTeacher: <MainPageTeacher />,

  //--------------------------Customer section-------------
};
