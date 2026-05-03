import { createMemo, createRoot, createStore, reconcile } from "solid-js";
import type { ServerRole } from "../db";
import { serverStore } from "./serverStore";

export const serverRolesStore = createRoot(createServerRolesStore);

function createServerRolesStore() {
  const [serverRoles, _setServerRoles] = createStore<
    Record<string, Record<string, ServerRole>>
  >({});

  const setServerRoles = (serverRoles: ServerRole[]) => {
    const state: Record<string, Record<string, ServerRole>> = {};

    for (let i = 0; i < serverRoles.length; i++) {
      const role = serverRoles[i]!;
      if (!state[role.serverId]) {
        state[role.serverId] = {};
      }
      state[role.serverId]![role.id] = role;
    }

    _setServerRoles(reconcile(state, "id"));
  };

  const currentServerRoles = createMemo(() => {
    return serverRoles[serverStore.currentServerId()!] || {};
  });

  const currentServerSortedRoles = createMemo(() => {
    return Object.values(currentServerRoles()).sort(
      (a, b) => b.order - a.order,
    );
  });

  const currentServerDefaultRole = createMemo(() => {
    return currentServerRoles()[serverStore.currentServer()?.defaultRoleId!];
  });

  return {
    setServerRoles,
    serverRoles,
    currentServerRoles,
    currentServerDefaultRole,
    currentServerSortedRoles,
  };
}
