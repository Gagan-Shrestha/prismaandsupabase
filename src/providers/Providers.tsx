"use client";

import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/utils/providers/persistor";
import { SessionProvider } from "next-auth/react";

function Providers({ children }: { children: React.ReactNode }) {
  // Initialize QueryClient only once
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition={"bottom-right"}
        />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default Providers;
