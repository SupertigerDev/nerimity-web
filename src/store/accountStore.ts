import { createRoot } from "solid-js";
import { type User } from "../db";
import { createStore } from "solid-js/store";

interface Account {
  user: User | null;
}
const accountStoreCtx = createRoot(() => {
  const [account, setAccount] = createStore<Account>({
    user: null,
  });

  const currentUser = () => account.user;

  return {
    currentUser,
    setStore: setAccount,
  };
});

export const useAccount = () => accountStoreCtx;
