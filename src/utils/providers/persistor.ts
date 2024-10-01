/** @format */

// lib/persistor.ts
import { get, set, del } from "idb-keyval";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

function isBrowser() {
  return (
    typeof window !== "undefined" && typeof window.indexedDB !== "undefined"
  );
}

export function createIDBPersister(
  idbValidKey: IDBValidKey = "reactQuery"
): Persister {
  if (!isBrowser()) {
    return {
      persistClient: async () => {},
      restoreClient: async () => undefined,
      removeClient: async () => {},
    };
  }

  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  };
}

const persister = createIDBPersister();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      // staleTime: 1000 * 60 * 5, // 5 minutes
      // gcTime: Infinity,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (data) => {
      console.log("Mutation success", data);
    },
    onError: (error) => {
      console.log("Mutation error", error);
    },
  }),
});

if (isBrowser()) {
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });
}
