import { createEffect, For } from "solid-js";
import { serverStore } from "../../store/serverStore";
import { A } from "@solidjs/router";
import { serverMemberStore } from "../../store/serverMemberStore";

export const ServerList = () => {

  createEffect(serverStore.currentServerId, () => {
    console.log(serverMemberStore.currentServerMembers)
  });


  return <div>
    <For each={serverStore.servers}>
      {(server) => <A href={`/app/servers/${server().id}/${server().defaultChannelId}`} style={{width: "100px", display: 'block', overflow: 'hidden'}}>{server().name}</A>}
    </For>
  </div>

};