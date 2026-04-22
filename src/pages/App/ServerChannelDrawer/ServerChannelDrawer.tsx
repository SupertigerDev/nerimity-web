import { createSignal, For } from "solid-js";
import { useCurrentServer } from "../../../contexts/CurrentServerContext";
import style from "./ServerChannelDrawer.module.css";
import type { Channel } from "../../../db";
import { Item } from "../../../components/Item";
import { ChannelIcon } from "../../../components/ChannelIcon";

export const ServerChannelDrawer = () => {
  return (
    <div class={style.drawer}>
      <ChannelList />
    </div>
  );
};

const ChannelList = () => {
  const currentServer = useCurrentServer();
  const [hoveredChannelId, setHoveredChannelId] = createSignal<string | null>(
    null,
  );
  return (
    <For each={currentServer.channels}>
      {(channel) => (
        <ChannelItem
          channel={channel}
          hovered={hoveredChannelId() === channel.id}
          onMouseEnter={() => setHoveredChannelId(channel.id)}
          onMouseLeave={() => setHoveredChannelId(null)}
        />
      )}
    </For>
  );
};

const ChannelItem = (props: {
  channel: Channel;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hovered?: boolean;
}) => {
  const currentServer = useCurrentServer();
  return (
    <Item.Root
      selected={currentServer.currentChannel()?.id === props.channel.id}
      href={`/app/${props.channel.serverId}/${props.channel.id}`}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      class={style.channelItem}
    >
      <ChannelIcon hovered={props.hovered} channel={props.channel} />
      <Item.Label>{props.channel.name}</Item.Label>
    </Item.Root>
  );
};
