import { createRoot, createStore } from "solid-js";
import type { ServerMember } from "../db";


export const serverMemberStore = createRoot(createServerMemberStore);


function createServerMemberStore() {
  const [serverMembers, _setServerMembers] = createStore<Record<string, ServerMember>>({});

  const setServerMembers = (serverMembers: ServerMember[]) => {
    _setServerMembers(s => {
      for (let i = 0; i < serverMembers.length; i++) {
        s[serverMembers[i].id] = serverMembers[i];
      }
    })
  };


  return { setServerMembers, serverMembers };
};