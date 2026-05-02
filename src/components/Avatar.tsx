import style from "./Avatar.module.css";
import { Show } from "solid-js";
import { buildImageUrl } from "../utils/image";
import { cn } from "../utils/cn";

interface AvatarProps {
  user?: {avatar?: string, username: string, hexColor: string};
  server?: {avatar?: string, name: string, hexColor: string};

  size: 16 | 24 | 32 | 40 | 48 | 64
}
export const Avatar = (props: AvatarProps) => {

  const url = () => {
    const avatar = props.user?.avatar || props.server?.avatar;
    if (!avatar) return undefined;
    return buildImageUrl(avatar, { size: props.size + 8 })
  };

  const hexColor = () => props.user?.hexColor || props.server?.hexColor!;

  const firstLetter = () => {
    const username = props.user?.username || props.server?.name;
    if (!username) return undefined;
    return username[0].toUpperCase();
  };

  return <div class={style.avatar} style={{"--size": props.size + "px"}}>
    <Show when={url()} fallback={<div class={cn(style.avatarInner, style.avatarLetter)} style={{"--color": hexColor()}}>{firstLetter()}</div>}>{(url) => <img class={style.avatarInner} src={url()} />}</Show>
  </div>

}