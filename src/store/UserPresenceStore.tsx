import { createRoot, createStore, reconcile } from "solid-js";
import type { UserPresence } from "../db";

export const userPresenceStore = createRoot(createUserPresenceStore);

function createUserPresenceStore() {
  const [presences, _setPresences] = createStore<Record<string, UserPresence>>(
    {},
  );

  const setPresences = (userPresences: UserPresence[]) => {
    const state: Record<string, UserPresence> = {};
    for (let i = 0; i < userPresences.length; i++) {
      const presence = userPresences[i]!;
      state[presence.userId] = presence;
    }
    _setPresences(reconcile(state, "userId"));
  };

  const updatePresence = (userId: string, presence: UserPresence) => {
    _setPresences((s) => {
      if (presence.status === 0) {
        delete s[userId];
      } else {
        s[userId] = presence;
      }
    });
  };

  return { presences, setPresences, updatePresence };
}
