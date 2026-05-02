import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  createStore,
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
    _setServers((s) => {
      for (let i = 0; i < servers.length; i++) {
        s[servers[i].id] = servers[i];
      }
    });
  };

  const currentChannelMembers = createMemo(() => {
    const _currentServerId = currentServerId();
    return Object.values(
      serverMemberStore.serverMembers[_currentServerId!] || {},
    );
  });

  const currentServerChannels = createMemo(() => {
    const _currentServerId = currentServerId();
    return Object.values(channelStore.channels)
      .filter((c) => c.serverId === _currentServerId)
      .sort((a, b) => a.order! - b.order!);
  });

  const array = createMemo(() => Object.values(servers));

  const test = createMemo(() => {
    console.log(array().flatMap((s) => s.customEmojis));
    // return Object.values(servers).flatMap((s) => s.emojis);
  });

  createEffect(test, (emojis) => console.log(emojis));

  return {
    array,
    currentServerId,
    setCurrentServerId,
    servers,
    setServers,
    currentChannelMembers,
    currentServerChannels,
  };
}
