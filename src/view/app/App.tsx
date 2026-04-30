import { useParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { channelStore } from "../../store/channelStore";
import { serverStore } from "../../store/serverStore";
import { ServerList } from "./ServerList";
import { socket } from "../../services/socket";
import { ServerChannelList } from "./ServerChannelList";

export const App = () => {
  const params = useParams<{ serverId?: string; channelId?: string }>();
  socket.connect();


  createEffect(() => [params.channelId, params.serverId], ([channelId, serverId]) => {
    channelStore.setCurrentChannelId(channelId);
    serverStore.setCurrentServerId(serverId);
  })


  return <div style={{display: 'flex'}}>
    <ServerList/>
    <ServerChannelList/>
  </div>

};