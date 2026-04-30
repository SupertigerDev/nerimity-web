import { createStore, reconcile, refresh } from "solid-js";

type UpdateStore = () => void;

export function createDexieArrayQuery<T>(querier: () => Promise<T[]>) {
  const [store, setStore] = createStore<T[]>(querier, [], { key: "id" });
  const updateStore = (q?: T[]) => {
    if (q) {
      setStore(reconcile(q, "id"));
    } else {
      refresh(store);
    }
  };
  return [store, updateStore as UpdateStore] as const;
}
