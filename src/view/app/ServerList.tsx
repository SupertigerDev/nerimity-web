import style from "./ServerList.module.css";
import { createEffect, For } from "solid-js";
import { serverStore } from "../../store/serverStore";
import { A } from "@solidjs/router";
import type { Server } from "../../db";
import { Avatar } from "../../components/Avatar";

export const ServerList = () => {
  // createEffect(serverStore.currentChannelMembers, (members) => {
  //   console.log(members);
  // });

  return (
    <div class={style.serverList}>
      <For each={serverStore.array()}>
        {(server) => <ServerItem server={server()} />}
      </For>
    </div>
  );
};

const ServerItem = (props: { server: Server }) => (
  <A href={`/app/servers/${props.server.id}/${props.server.defaultChannelId}`}>
    <Avatar server={props.server} size={48} />
  </A>
);
