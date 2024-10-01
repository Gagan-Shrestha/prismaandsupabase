/** @format */

import React, { useState } from "react";
import Link from "next/link";
import {
  FaChevronDown,
  FaHome,
  FaUser,
  FaCogs,
  FaTruck,
  FaSeedling,
  FaStore,
  FaBuilding,
  FaBell,
  FaDollarSign,
  FaRegFileAlt,
  FaExclamationCircle,
  FaUsers,
  FaMapMarkerAlt,
  FaRegFile,
  FaFileInvoice,
  FaTree,
  FaLeaf,
  FaMoneyBill,
  FaRegMoneyBillAlt,
  FaChartLine,
  FaTools,
  FaCalendarAlt,
  FaRegChartBar,
  FaUserCog,
  FaFileAlt,
  FaCog,
  FaBalanceScale,
  FaPlusCircle,
} from "react-icons/fa";
import {
  GiFertilizerBag,
  GiHighGrass,
  GiPlantSeed,
  GiTakeMyMoney,
} from "react-icons/gi";
import { TbBellPlus } from "react-icons/tb";
import { GiPlantsAndAnimals } from "react-icons/gi";

import { usePathname, useRouter } from "next/navigation";

import {
  MdDashboard,
  MdGroupAdd,
  MdModelTraining,
  MdNotifications,
  MdOutlineAddShoppingCart,
  MdOutlineDisplaySettings,
  MdOutlinePestControl,
  MdOutlineReportProblem,
  MdOutlineSettings,
  MdOutlineShoppingCartCheckout,
  MdOutlineViewCarousel,
  MdOutlineWarning,
  MdPestControl,
} from "react-icons/md";
import { RiLandscapeFill } from "react-icons/ri";
import { FaCow, FaMoneyBillWheat, FaPeopleRoof } from "react-icons/fa6";
import {
  IoIosBookmarks,
  IoIosNotificationsOutline,
  IoIosPersonAdd,
} from "react-icons/io";
import Image from "next/image";
import { PiCowFill, PiFarmFill } from "react-icons/pi";
import { IoFish } from "react-icons/io5";
import { LuArchiveRestore } from "react-icons/lu";
import { TiWeatherCloudy } from "react-icons/ti";
import { AiOutlineBell } from "react-icons/ai";
import { useAdminDisplay } from "@/utils/providers/displayProvider/DisplayProviderAdminMain";
import { componentDictionaryAdmin } from "../../dictionary/ComponentDictAdmin";

interface MenuItem {
  titleKey: string;
  icon?: JSX.Element;
  component?: string;
  link?: string;
  subMenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    titleKey: "Dashboard",
    icon: <FaHome />,
    component: "dashboardAdmin",
    link: "#",
  },
  {
    titleKey: "Setup",
    icon: <FaBuilding />,
    link: "#",
    subMenu: [
      {
        titleKey: "Teacher",
        icon: <FaTools />,
        link: "#",
        component: "setupteacher",
      },
      {
        titleKey: "Record",
        icon: <FaRegFileAlt />,
        link: "#",
        component: "notificationForm",
      },
      {
        titleKey: "Schedule",
        icon: <FaCalendarAlt />,
        link: "#",
        component: "notification",
      },
      {
        titleKey: "Analytics",
        icon: <FaRegChartBar />,
        link: "#",
        component: "caroselOffice",
      },
    ],
  },
];
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const { setDisplay } = useAdminDisplay();
  const pathname = usePathname();
  const router = useRouter();

  const handleSelectComponent = (componentId: string) => {
    const component = componentDictionaryAdmin[componentId];
    if (!component) return;

    setDisplay({ component, componentId });
    router.push(`${pathname}?component=${componentId}`);
  };

  const toggleSubMenu = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
    setOpenSubMenuIndex(null); // Close sub submenus when changing main menu
  };

  const toggleSubSubMenu = (index: number) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };
  const renderSubMenu = (subMenu: MenuItem[], isSubSubMenu = false) => (
    <ul className={`${isSubSubMenu ? "ml-4" : "ml-4"} border-l border-white`}>
      {subMenu.map((subItem, subIndex) => (
        <li
          key={subIndex}
          className={`relative pl-5 before:absolute before:left-0 ${
            openSubMenuIndex === subIndex ? "before:top-5 " : "before:top-1/2 "
          } before:h-px before:w-4 before:bg-white`}
        >
          {subItem.subMenu ? (
            <>
              <div
                onClick={() => toggleSubSubMenu(subIndex)}
                className="cursor-pointer flex space-x-2 hover:bg-gray-800 p-2 rounded"
              >
                <Link href={subItem.link || "#"}>
                  <a>{subItem.titleKey}</a>
                </Link>
                <FaChevronDown
                  className={`ml-2 transform ${
                    openSubMenuIndex === subIndex ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openSubMenuIndex === subIndex &&
                renderSubMenu(subItem.subMenu, true)}
            </>
          ) : (
            <button
              onClick={() =>
                subItem.component && handleSelectComponent(subItem.component)
              }
              className=" flex hover:bg-gray-800 p-2 rounded"
            >
              {subItem.icon && (
                <span className="mr-2 text-left">{subItem.icon}</span>
              )}
              {subItem.titleKey}
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div
        className={`fixed inset-y-0 left-0 transform text-sm ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto bg-blue-600 text-white w-64 h-screen p-4 z-50`}
      >
        <div>
          <div className="flex items-center flex-col border bg-white rounded p-2 font-bold text-blue-700  justify-center space-y-2 border-b py-2 mb-2 ">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 " />
            <p className="text-center">खाद्य व्यवस्था तथा व्यापार </p>
            <p className="text-center"> कम्पनी लिमिटेड</p>
          </div>
        </div>
        <ul className="space-y-4 h-[70vh] overflow-y-auto scrollbar-hide hover:scrollbar-white">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div
                onClick={() => toggleSubMenu(index)}
                className={`cursor-pointer flex items-center justify-between hover:bg-gray-800 p-2 rounded ${
                  openMenuIndex === index ? "bg-gray-800" : ""
                }`}
              >
                <div
                  className="flex items-center"
                  onClick={() =>
                    item.component && handleSelectComponent(item.component)
                  }
                >
                  {item.icon}
                  <span className="ml-2 text-left">{item.titleKey}</span>
                </div>
                {item.subMenu && (
                  <FaChevronDown
                    className={`ml-2 transform ${
                      openMenuIndex === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
              {openMenuIndex === index &&
                item.subMenu &&
                renderSubMenu(item.subMenu)}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`fixed inset-0 bg-black opacity-50 ${
          isSidebarOpen ? "block" : "hidden"
        } lg:hidden`}
        onClick={() => toggleSidebar(false)}
      ></div>
    </div>
  );
};

export default Sidebar;
