import style from "./Sidebar.module.css";
import { For } from "solid-js";
import { useServers } from "../../../store/serverStore";
import type { Server } from "../../../db";
import { Avatar } from "../../../components/Avatar";
import { A } from "@solidjs/router";

export const Sidebar = () => {
  return (
    <div class={style.sidebar}>
      <div>Sidebar</div>
      <ServerList />
    </div>
  );
};

export const ServerList = () => {
  const servers = useServers();
  return (
    <div class={style.serverList}>
      <For each={servers.servers}>
        {(server) => <ServerItem server={server} />}
      </For>
    </div>
  );
};

export const ServerItem = (props: { server: Server }) => {
  return (
    <A
      href={`/app/${props.server.id}/${props.server.defaultChannelId}`}
      class={style.serverItem}
    >
      <Avatar server={props.server} size={48} />
    </A>
  );
};
