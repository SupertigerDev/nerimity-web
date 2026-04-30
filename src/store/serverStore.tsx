import { createEffect, createMemo, createRoot, createSignal } from "solid-js";
import { db } from "../db";
import { createDexieArrayQuery } from "../utils/dexie-store";
import { accountStore } from "./accountStore";



export const serverStore = createRoot(createServerStore);


function createServerStore () {
  const [currentServerId, setCurrentServerId] = createSignal<string | undefined>(undefined);
  const [servers, updateServers] = createDexieArrayQuery(() => db.server.toArray());
  const [currentServerChannels, updateCurrentServerChannels] = createDexieArrayQuery(() => db.channel.where("serverId").equals(currentServerId() || "").sortBy("order"));
  
  const currentServer = createMemo(() => servers.find((s) => s.id === currentServerId()));

  createEffect(accountStore.authenticated, (authenticated) => {
    if (!authenticated) return;
    updateServers();
    updateCurrentServerChannels();
  })

  


  return { currentServerId, setCurrentServerId, servers, currentServer, currentServerChannels };

};