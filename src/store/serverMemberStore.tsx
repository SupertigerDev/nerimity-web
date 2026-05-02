import { createRoot, createStore } from "solid-js";
import type { ServerMember } from "../db";


export const serverMemberStore = createRoot(createServerMemberStore);


function createServerMemberStore() {
  const [serverMembers, _setServerMembers] = createStore<Record<string, Record<string, ServerMember>>>({});

  const setServerMembers = (serverMembers: ServerMember[]) => {
    _setServerMembers(state => {
      for (let i = 0; i < serverMembers.length; i++) {
        const member = serverMembers[i];
        if (!state[member.serverId]) {
          state[member.serverId] = {};
        }
        
        state[member.serverId][member.id] = serverMembers[i];
      }
    })
  };


  return { setServerMembers, serverMembers };
};