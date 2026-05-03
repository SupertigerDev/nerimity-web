import {
  createRoot,
  createSignal,
  createStore,
  reconcile,
  createMemo,
} from "solid-js";
import type { Channel } from "../db";

export const channelStore = createRoot(createChannelStore);

function createChannelStore() {
  const [currentChannelId, setCurrentChannelId] = createSignal<
    string | undefined
  >(undefined);
  const [channels, _setChannels] = createStore<Record<string, Channel>>({});

  const setChannels = (channels: Channel[]) => {
    const s: Record<string, Channel> = {};
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i]!;
      s[channel.id] = channel;
    }
    _setChannels(reconcile(s, "id"));
  };

  const updateChannel = (channelId: string, update: Partial<Channel>) => {
    _setChannels((s) => {
      Object.assign(s[channelId]!, update);
    });
  };

  const currentChannel = createMemo(() => {
    const channelId = currentChannelId();
    return channelId ? channels[channelId] : undefined;
  });

  const currentPermissions = createMemo(() => {
    const channel = currentChannel();
    if (!channel?.permissions) return {};
    const permissions: Record<string, number> = {};

    for (let i = 0; i < channel.permissions.length; i++) {
      const permission = channel.permissions[i]!;
      permissions[permission.roleId!] = permission.permissions;
    }

    return permissions;
  });

  return {
    channels,
    currentChannelId,
    setCurrentChannelId,
    setChannels,
    updateChannel,
    currentPermissions,
  };
}
