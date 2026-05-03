import { createRoot, createStore, reconcile } from "solid-js";
import type { ServerMember, User } from "../db";
import { userStore } from "./userStore";

export const serverMemberStore = createRoot(createServerMemberStore);

function createServerMemberStore() {
  const [serverMembers, _setServerMembers] = createStore<
    Record<string, Record<string, ServerMember>>
  >({});

  const setServerMembers = (
    serverMembers: (ServerMember & { user?: User })[],
  ) => {
    const state: Record<string, Record<string, ServerMember>> = {};
    for (let i = 0; i < serverMembers.length; i++) {
      const member = serverMembers[i]!;
      if (!state[member.serverId]) {
        state[member.serverId] = {};
      }
      userStore.addUser(member.user!);
      member.user = undefined;
      delete member.user;

      state[member.serverId]![member.id] = member;
    }
    _setServerMembers(reconcile(state, "id"));
  };

  return { setServerMembers, serverMembers };
}
