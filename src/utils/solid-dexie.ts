// https://github.com/faassen/solid-dexie/blob/main/src/solid-dexie.ts
import { liveQuery, type PromiseExtended } from "dexie";
import {
  createEffect,
  onCleanup,
  type Accessor,
  type Setter,
  createSignal,
  reconcile,
  createStore,
  type StoreSetter,
} from "solid-js";

type ReconcileOptions = Parameters<typeof reconcile>[1];

type NotArray<T> = T extends any[] ? never : T;

export function createDexieSignalQuery<T>(
  querier: () => NotArray<T> | PromiseExtended<NotArray<T>>,
): Accessor<T | undefined> {
  const [store, setStore] = createSignal<T | undefined>(undefined);

  createEffect(
    querier,
    () => { fromStore<T>(liveQuery(querier), store, setStore) },
  );

  return store;
}

export function createDexieArrayQuery<T>(
  querier: () => T[] | Promise<T[]>,
  options?: ReconcileOptions,
): readonly T[] {
  const [store, setStore] = createStore<T[]>([]);

  createEffect(
    querier,
    () => { fromReconcileStore<T[]>(liveQuery(querier), store as T[], setStore, options) }
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
  setStore: StoreSetter<T>,
  options: ReconcileOptions = "id",
): T {
  const unsub = producer.subscribe((v) => setStore(reconcile(v, options)));
  onCleanup(() => ("unsubscribe" in unsub ? unsub.unsubscribe() : unsub()));
  return store;
}

function fromStore<T>(
  producer: {
    subscribe: (
      fn: (v: T) => void,
    ) => (() => void) | { unsubscribe: () => void };
  },
  store: Accessor<T | undefined>,
  setStore: Setter<T | undefined>,
): Accessor<T | undefined> {
  const unsub = producer.subscribe((v) => setStore(v as any));
  onCleanup(() => ("unsubscribe" in unsub ? unsub.unsubscribe() : unsub()));
  return store;
}