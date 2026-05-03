import {
  createMemo,
  createRoot,
  createSignal,
  createStore,
  reconcile,
} from "solid-js";
import { serverMemberStore } from "./serverMemberStore";
import type { Server } from "../db";
import { channelStore } from "./channelStore";

export const serverStore = createRoot(createServerStore);

function createServerStore() {
  const [currentServerId, setCurrentServerId] = createSignal<
    string | undefined
  >(undefined);
  const [servers, _setServers] = createStore<Record<string, Server>>({});

  const setServers = (servers: any[]) => {
    const s: Record<string, Server> = {};
    for (let i = 0; i < servers.length; i++) {
      s[servers[i].id] = servers[i];
    }
    _setServers(reconcile(s, "id"));
  };

  const currentServer = createMemo(() => {
    const _currentServerId = currentServerId();
    return servers[_currentServerId!];
  });

  const currentMembers = createMemo(() => {
    const _currentServerId = currentServerId();
    return Object.values(
      serverMemberStore.serverMembers[_currentServerId!] || {},
    );
  });

  const currentChannels = createMemo(() => {
    const _currentServerId = currentServerId();
    return Object.values(channelStore.channels)
      .filter((c) => c.serverId === _currentServerId)
      .sort((a, b) => a.order! - b.order!);
  });

  const array = createMemo(() => Object.values(servers));

  return {
    currentServer,
    array,
    currentServerId,
    setCurrentServerId,
    servers,
    setServers,
    currentMembers,
    currentChannels,
  };
}
