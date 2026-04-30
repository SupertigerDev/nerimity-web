import { accountStore } from "../store/accountStore";
import { channelStore } from "../store/channelStore";
import { serverMemberStore } from "../store/serverMemberStore";
import { serverStore } from "../store/serverStore";


export const socketEventHandler = (event: string, payload: any) => {
  if (event === "user:authenticated") {
    onAuthenticated(payload);
  }
  if (event === "server:channel_updated") {
    onServerChannelUpdated(payload)
  }
};

const onAuthenticated = (payload: any) => {
  accountStore.setAuthenticated(true);

  channelStore.setChannels(payload.channels);
  serverStore.setServers(payload.servers);
  serverMemberStore.setServerMembers(payload.serverMembers);



};

const onServerChannelUpdated = (payload: any) => {
  channelStore.updateChannel(payload.channelId, payload);
}

