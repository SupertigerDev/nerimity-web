import { createEffect, For, Loading } from "solid-js";
import { serverStore } from "../../store/serverStore";
import { A } from "@solidjs/router";

export const ServerList = () => {

  createEffect(serverStore.currentChannelMembers, (members) => {
    console.log(members);
  });


  return <div>
    <Loading>
      <For each={serverStore.array()}>
        {(server) => <A href={`/app/servers/${server().id}/${server().defaultChannelId}`} style={{ width: "100px", display: 'block', overflow: 'hidden' }}>{server().name}</A>}
      </For>
    </Loading>
  </div>

};