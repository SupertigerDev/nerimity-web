import { createRoot, createSignal } from "solid-js";



export const channelStore = createRoot(createChannelStore);


function createChannelStore () {
  const [currentChannelId, setCurrentChannelId] = createSignal<string | undefined>(undefined);

  return { currentChannelId, setCurrentChannelId };

};