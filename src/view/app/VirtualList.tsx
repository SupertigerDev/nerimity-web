import {
  createEffect,
  createMemo,
  createProjection,
  createSignal,
  For,
  Show,
} from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

type Item<T, V> = T & { type: V; id: string };

interface VirtualListProps<T, V extends string> {
  data: readonly Item<T, V>[];
  typeHeights: Record<V, { height: number; sticky?: boolean }>;
  children: (item: Item<T, V>) => JSX.Element;
}

export function VirtualList<T, V extends string>(
  props: VirtualListProps<T, V>,
) {
  const [scrollTop, setScrollTop] = createSignal(0);
  const [container, setContainer] = createSignal<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = createSignal(0);

  const parent = createMemo(() => container()?.parentElement);

  let rafId: number;
  const onResize = () => setContainerHeight(parent()?.clientHeight || 0);
  const onScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => setScrollTop(parent()?.scrollTop || 0));
  };

  createEffect(parent, (el) => {
    if (!el) return;
    setContainerHeight(el.clientHeight);
    window.addEventListener("resize", onResize);
    el.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scroll", onScroll);
    };
  });

  const totalHeight = createMemo(() => {
    let h = 0;
    for (const item of props.data) h += props.typeHeights[item.type].height;
    return h;
  });

  const currentChunk = createProjection(
    () => {
      const top = Math.max(0, scrollTop());
      const bottom = scrollTop() + containerHeight();

      const items: (Item<T, V> & { pos: number })[] = [];

      let height = 0;
      for (let i = 0; i < props.data.length; i++) {
        const item = props.data[i]!;
        const { height: itemHeight, sticky } = props.typeHeights[item.type];

        if (!sticky && height > bottom) break;

        if (sticky || (height + itemHeight > top && height < bottom)) {
          items.push({ ...item, pos: height });
        }

        height += itemHeight;
      }

      return items;
    },
    [],
    { key: "id" },
  );

  const activeStickyItem = createMemo(() => {
    let last: (Item<T, V> & { pos: number }) | null = null;
    let height = 0;
    const top = scrollTop();
    for (const item of props.data) {
      const { height: itemHeight, sticky = false } =
        props.typeHeights[item.type];
      if (sticky && height <= top) last = { ...item, pos: height };
      height += itemHeight;
    }
    return last;
  });

  return (
    <div
      ref={setContainer}
      style={{ height: totalHeight() + "px", position: "relative" }}
    >
      <Show when={activeStickyItem()}>
        {(sticky) => (
          <div
            style={{
              position: "sticky",
              top: "0px",
              width: "100%",
              "z-index": "1",
            }}
          >
            {props.children(sticky())}
          </div>
        )}
      </Show>
      <For each={currentChunk}>
        {(item) => (
          <div
            style={{
              position: "absolute",
              top: item().pos + "px",
              height: props.typeHeights[item().type].height + "px",
              width: "100%",
            }}
          >
            {props.children(item())}
          </div>
        )}
      </For>
    </div>
  );
}
