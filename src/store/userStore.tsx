import { createRoot, createStore } from "solid-js";
import type { User } from "../db";

export const userStore = createRoot(createUserStore);

function createUserStore() {
  const [users, _setUsers] = createStore<Record<string, User>>({});

  const addUser = (user: User) => {
    _setUsers((s) => {
      s[user.id] = user;
    });
  };
  return { users, addUser };
}
