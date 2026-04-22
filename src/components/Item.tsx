import style from "./Item.module.css";
import { Dynamic } from "solid-js/web";
import { cn } from "../utils/classNames";
import { A } from "@solidjs/router";
import type { JSXElement } from "solid-js";

interface RootProps {
  children?: JSXElement;
  selected?: boolean;
  alert?: boolean;
  handlePosition?: "bottom" | "left";
  onClick?: (e?: MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onContextMenu?: (e: MouseEvent) => void;
  href?: string;
  handleColor?: string;
  alertColor?: string;
  class?: string;
}
const Root = (props: RootProps) => (
  <Dynamic
    component={props.href ? A : "div"}
    href={props.href}
    class={cn(style.itemRoot, props.class)}
    data-selected={props.selected}
    data-alert={props.alert}
    style={{
      "--handle-color": props.handleColor,
      "--alert-color": props.alertColor,
    }}
    onClick={props.onClick}
    data-handle-position={props.handlePosition || "left"}
    onMouseEnter={props.onMouseEnter}
    onContextMenu={props.onContextMenu}
    onMouseLeave={props.onMouseLeave}
  >
    {props.children}
  </Dynamic>
);

const Label = (props: { children?: JSXElement }) => (
  <div class={style.label}>{props.children}</div>
);

export const Item = {
  Root,
  Label,
};
