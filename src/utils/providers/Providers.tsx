/** @format */

"use client";

import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { registerServiceWorker } from '../registerServiceWorker';
import { useReportWebVitals } from "next/web-vitals";
import { SessionProvider } from "next-auth/react";

import { UserSettingProvider } from "./UserSettingProvider";
import { DisplayProviderNormal } from "./displayProvider/DisplayProviderNormal";
import { queryClient } from "./persistor";
import { ModalDisplayProvider } from "./ModalDisplayProvider";
// const persister = createSyncStoragePersister({
//   storage: typeof window !== "undefined" ? window.localStorage : undefined,
// });

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       gcTime: 1000 * 60 * 60 * 24 * 24, // 24 days
//     },
//   },
// });

function Providers({ children }: { children: React.ReactNode }) {
  // const [client] = React.useState(new QueryClient());
  // // useEffect(() => {
  // //   registerServiceWorker();
  // // }, []);

  useReportWebVitals((metric) => {
    console.log(metric);
  });
  return (
    // <PersistQueryClientProvider
    //   client={queryClient}
    //   persistOptions={{ persister }}>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {" "}
        <ModalDisplayProvider>
          {" "}
          <DisplayProviderNormal>{children}</DisplayProviderNormal>
        </ModalDisplayProvider>
      </SessionProvider>

      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition={"bottom-right"}
      />
    </QueryClientProvider>
  );
}

export default Providers;
