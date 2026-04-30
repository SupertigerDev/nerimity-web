import { createMemo, For, Loading } from "solid-js";
import { serverStore } from "../../store/serverStore";
import { A } from "@solidjs/router";
import { ChannelType, type Channel } from "../../db";

export const ServerChannelList = () => {

  const orderedChannels = createMemo(() => {
    const results: Channel[] = [];

    for (const channel of serverStore.currentServerChannels) {
    if (channel.type === ChannelType.CATEGORY) {
        results.push(channel);
        results.push(...serverStore.currentServerChannels.filter((c) => c.categoryId == channel.id));
      } else if (!channel.categoryId) {
        results.push(channel);
      }
    }

    return results;
  });


  return <div>
    <Loading>
      <For each={orderedChannels()}>
      {(channel) => <A href={`/app/servers/${channel().serverId}/${channel().id}`} style={{width: "100px", display: 'block', overflow: 'hidden'}}>{channel().name}</A>}
    </For>
    </Loading>
  </div>

};