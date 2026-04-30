import { createRoot, createSignal, createStore } from "solid-js";
import type { Channel } from "../db";


export const channelStore = createRoot(createChannelStore);


function createChannelStore() {
  const [currentChannelId, setCurrentChannelId] = createSignal<string | undefined>(undefined);
  const [channels, _setChannels] = createStore<Record<string, Channel>>({});

  const setChannels = (channels: Channel[]) => {
    _setChannels(s => {
      for (let i = 0; i < channels.length; i++) {
        s[channels[i].id] = channels[i];
      }
    })
  };

  const updateChannel = (channelId: string, update: Partial<Channel>) => {
    _setChannels(s => {
      Object.assign(s[channelId], update);
    })
  };


  return { channels, currentChannelId, setCurrentChannelId, setChannels, updateChannel };

};