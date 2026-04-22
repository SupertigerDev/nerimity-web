import { For } from "solid-js";
import { useCurrentServer } from "../../../contexts/CurrentServerContext";
import style from "./ServerChannelDrawer.module.css";
import type { Channel } from "../../../db";
import { Item } from "../../../components/Item";

export const ServerChannelDrawer = () => {
  const currentServer = useCurrentServer();
  return (
    <div class={style.drawer}>
      <For each={currentServer.channels}>
        {(channel) => <ChannelItem channel={channel} />}
      </For>
    </div>
  );
};

export const ChannelItem = (props: { channel: Channel }) => {
  const currentServer = useCurrentServer();
  return (
    <Item.Root
      selected={currentServer.currentChannel()?.id === props.channel.id}
      href={`/app/${props.channel.serverId}/${props.channel.id}`}
    >
      <Item.Label>{props.channel.name}</Item.Label>
    </Item.Root>
  );
};
