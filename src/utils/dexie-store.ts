import { createEffect, createMemo, createStore, reconcile } from "solid-js";


type UpdateStore = <T>(q?: () => Promise<T[]>) => void;

export function createDexieArrayQuery<T>(
  querier: () => Promise<T[]>,
){
  const [store, setStore] = createStore<T[]>([]);

  const updateStore = (q?: T[]) => {
    if (q) {
      setStore(reconcile(q, "id"));
    }
    else {
      querier().then(r => setStore(reconcile(r, "id")));
    }
  };

  createEffect(
    querier,
    (q) => updateStore(q)
  );

  return [store, updateStore] as const;
}