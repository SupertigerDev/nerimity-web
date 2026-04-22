import { ChannelType, type Channel } from "../db";
import env from "../env";
import { cn } from "../utils/classNames";
import { unicodeToTwemojiUrl } from "../utils/emojis/unicodeToTwemojiUrl";
import style from "./ChannelIcon.module.css";
import { Show } from "solid-js";
import { Icon } from "./Icon";

export const ChannelIcon = (props: {
  channel: Channel;
  hovered?: boolean;
  class?: string;
}) => {
  const url = () => {
    const icon = props.channel.icon;
    if (!icon) return null;

    const animated = icon?.endsWith(".gif") || icon?.endsWith(".webp#a");

    if (props.channel.icon!.includes(".")) {
      let url = `${env.NERIMITY_CDN}emojis/${icon.split("#")[0]}?size=36`;

      if (animated && !props.hovered) {
        url += "&type=webp";
      }

      return url;
    }
    return unicodeToTwemojiUrl(icon!);
  };

  return (
    <div class={cn(style.channelIconContainer, props.class)}>
      {(() => {
        const iconUrl = url();
        return iconUrl ? (
          <Show when={props.channel.icon}>
            <img class={style.channelIconImage} src={iconUrl} />
          </Show>
        ) : props.channel.type === ChannelType.SERVER_TEXT ? (
          <div class={style.channelIconImage}>#</div>
        ) : (
          <Icon name="segment" color="rgba(255,255,255,0.6)" size={18} />
        );
      })()}
    </div>
  );
};
