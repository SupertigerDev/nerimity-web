import { createEffect, createMemo, createSignal, For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

interface VirtualListProps<T, V extends string> {
  data: readonly (T & { type: V })[];
  typeHeights: Record<V, number>;
  children: (item: T & { type: V }) => JSX.Element;
}

export function VirtualList<T, V extends string>(
  props: VirtualListProps<T, V>,
) {
  const [container, setContainer] = createSignal<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = createSignal(0);

  const parent = createMemo(() => container()?.parentElement);

  const totalHeight = createMemo(() => {
    let height = 0;
    for (const item of props.data) {
      height += props.typeHeights[item.type];
    }
    return height;
  });

  createEffect(parent, (el) => {
    if (!el) return;
    setContainerHeight(el.clientHeight);
    const onResize = () => setContainerHeight(el.clientHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  const currentChunk = () => {
    console.log(containerHeight());
    let height = 0;
    let i = 0;
    for (; i < props.data.length; i++) {
      height += props.typeHeights[props.data[i]!.type];
      if (height > containerHeight()) break;
    }
    return props.data.slice(0, i);
  };

  return (
    <div ref={setContainer} style={{ height: totalHeight() + "px" }}>
      <For each={currentChunk()}>{(item) => props.children(item())}</For>
    </div>
  );
}
