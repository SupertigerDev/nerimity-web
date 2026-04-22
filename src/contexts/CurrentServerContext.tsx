import { useParams } from "@solidjs/router";
import { createContext, createMemo, useContext } from "solid-js";
import { useServers } from "../store/serverStore";
import { createDexieArrayQuery } from "../utils/solid-dexie";
import { db } from "../db";
import type { JSX } from "solid-js/jsx-runtime";

const makeContext = () => {
  const params = useParams<{ channelId?: string; serverId?: string }>();
  const servers = useServers();
  const server = createMemo(() =>
    servers.servers.find((s) => s.id === params.serverId),
  );

  const channels = createDexieArrayQuery(() =>
    db.channel.where("serverId").equals(params.serverId!).toArray(),
  );

  const currentChannel = createMemo(() => {
    if (!params.channelId) return null;
    return channels.find((c) => c.id === params.channelId);
  });

  const context = {
    server,
    channels,
    currentChannel,
  };

  return context;
};
const CurrentServerContext = createContext<ReturnType<typeof makeContext>>();

export function CurrentServerProvider(props: { children: JSX.Element }) {
  const context = makeContext();

  return (
    <CurrentServerContext.Provider value={context}>
      {props.children}
    </CurrentServerContext.Provider>
  );
}

export function useCurrentServer() {
  const context = useContext(CurrentServerContext);
  if (!context) {
    throw new Error("useCurrentServer must be used within a ServerProvider");
  }
  return context;
}
