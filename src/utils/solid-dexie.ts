// https://github.com/faassen/solid-dexie/blob/main/src/solid-dexie.ts
import { liveQuery, type PromiseExtended } from "dexie";
import {
  from,
  createMemo,
  createEffect,
  on,
  onCleanup,
  type Accessor,
} from "solid-js";
import { createStore, reconcile, type SetStoreFunction } from "solid-js/store";

type ReconcileOptions = Parameters<typeof reconcile>[1];

type NotArray<T> = T extends any[] ? never : T;

export function createDexieSignalQuery<T>(
  querier: () => NotArray<T> | PromiseExtended<NotArray<T>>,
): Accessor<T | undefined> {
  const get = createMemo(() => from<T>(liveQuery(querier)));
  return () => get()();
}

export function createDexieArrayQuery<T>(
  querier: () => T[] | Promise<T[]>,
  options?: ReconcileOptions,
): T[] {
  const [store, setStore] = createStore<T[]>([]);

  createEffect(
    on(querier, () => {
      fromReconcileStore<T[]>(liveQuery(querier), store, setStore, options);
    }),
  );

  return store;
}

function fromReconcileStore<T>(
  producer: {
    subscribe: (
      fn: (v: T) => void,
    ) => (() => void) | { unsubscribe: () => void };
  },
  store: T,
  setStore: SetStoreFunction<T>,
  options: ReconcileOptions = { key: "id" },
): T {
  const unsub = producer.subscribe((v) => setStore(reconcile(v, options)));
  onCleanup(() => ("unsubscribe" in unsub ? unsub.unsubscribe() : unsub()));
  return store;
}
