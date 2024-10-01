// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Providers from "../providers/Providers";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <Providers> {children}</Providers>
//       </body>
//     </html>
//   );
// }
/** @format */

import "./globals.css";

import { Metadata, Viewport } from "next";

import { DisplayProviderNormal } from "../utils/providers/displayProvider/DisplayProviderNormal";
import Providers from "@/providers/Providers";

export const metadata: Metadata = {
  title: "Asset Management",
  description: "Product of Inpro Academy",
  manifest: "/manifest.json",

  icons: {
    icon: "/icon.png",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {" "}
        <Providers>
          {" "}
          <DisplayProviderNormal>{children}</DisplayProviderNormal>
        </Providers>
      </body>
    </html>
  );
}
