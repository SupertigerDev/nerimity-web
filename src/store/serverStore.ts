import { createRoot } from "solid-js";
import { db } from "../db";
import { createDexieArrayQuery } from "../utils/solid-dexie";

const serverStoreCtx = createRoot(() => {
  const servers = createDexieArrayQuery(() => db.server.toArray());
  return {
    servers,
  };
});

export const useServers = () => serverStoreCtx;
