/** @format */
"use client";
// components/MainPageAdmin.tsx

import React, { useState } from "react";

interface CardData {
  title: string;
  value: string | number;
  children?: React.ReactNode;
}

const MainPageAdmin: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [componentReferenceName, setComponentReferenceName] = useState<
    string | null
  >(null);

  const handleCardClick = (title: string) => {
    setComponentReferenceName(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setComponentReferenceName(null);
  };

  return (
    <div className=" w-full  space-y-4">
      <p> this is admin DAshboard</p>
    </div>
  );
};

export default MainPageAdmin;
