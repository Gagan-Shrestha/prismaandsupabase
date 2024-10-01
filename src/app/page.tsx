import Login from "@/components/CoreComponent/Login/Login";
import RegistrationAdmin from "@/components/CoreComponent/Register/RegisterAdminUser";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Login />
      <RegistrationAdmin />
    </div>
  );
}
