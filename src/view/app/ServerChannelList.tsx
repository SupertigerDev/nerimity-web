import { createMemo, For, Loading } from "solid-js";
import { serverStore } from "../../store/serverStore";
import { A } from "@solidjs/router";
import { ChannelType, type Channel } from "../../db";

export const ServerChannelList = () => {
  const orderedChannels = createMemo(() => {
    const results: Channel[] = [];
    const currentChannels = serverStore.currentChannels();

    for (const channel of currentChannels) {
      if (channel.type === ChannelType.CATEGORY) {
        results.push(channel);
        results.push(
          ...currentChannels.filter((c) => c.categoryId == channel.id),
        );
      } else if (!channel.categoryId) {
        results.push(channel);
      }
    }

    return results;
  });

  return (
    <div>
      <For each={orderedChannels()}>
        {(channel) => (
          <A
            href={`/app/servers/${channel().serverId}/${channel().id}`}
            style={{ width: "100px", display: "block", overflow: "hidden" }}
          >
            {channel().name}
          </A>
        )}
      </For>
    </div>
  );
};
