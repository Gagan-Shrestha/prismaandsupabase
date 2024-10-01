/** @format */

import { Suspense } from "react";
import MainPageAdmin from "../admin/dashboard/mainpage/MainPageAdmin";
import TeacherTable from "../admin/setupAdmin/assetManager/TeacherTable";

export const uniqueModalId = `modal_${Date.now()}`;
// A simple dictionary to map component IDs to their respective components
export const componentDictionaryAdmin: Record<string, React.ReactNode> = {
  dashboardAdmin: <MainPageAdmin />,
  setupteacher: <TeacherTable />,

  //--------------------------Customer section-------------
};
0;
