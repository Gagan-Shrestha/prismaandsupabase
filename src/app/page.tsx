import AddApplicants from "@/components/CoreComponent/admin/setupAdmin/applicant/AddApplicants";
import AssetType from "@/components/CoreComponent/admin/setupAdmin/AssetType/AssetType";
import AddProperty from "@/components/CoreComponent/admin/setupAdmin/property/AddProperty";
import PropertyTable from "@/components/CoreComponent/admin/setupAdmin/property/PropertyTable";
import Login from "@/components/CoreComponent/Login/Login";
import RegistrationAdmin from "@/components/CoreComponent/Register/RegisterAdminUser";

import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* <Login /> */}
      {/* <RegistrationAdmin /> */}
      {/* <AddApplicants /> */}
      <AssetType />
      <PropertyTable />
    </div>
  );
}
