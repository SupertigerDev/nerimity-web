import { generateImageUrl } from "../utils/generateImageUrl";
import style from "./Avatar.module.css";
interface AvatarProps {
  server?: { avatar?: string; name: string; hexColor?: string };
  user?: { avatar?: string; username: string; hexColor?: string };
  size: 12 | 16 | 24 | 32 | 48 | 64 | 128;
}

export const Avatar = (props: AvatarProps) => {
  const avatarUrl = () => {
    const rawUrl = generateImageUrl(props.server || props.user, "avatar");
    if (!rawUrl) return null;

    const [baseUrl, fragment] = rawUrl.split("#");

    const animated = fragment === "a" || baseUrl.endsWith(".gif");
    const size = Math.round(props.size + 8);
    const separator = baseUrl.includes("?") ? "&" : "?";
    const type = animated ? "&type=webp" : "";

    return `${baseUrl}${separator}size=${size}${type}`;
  };
  const hexColor = () => props.server?.hexColor || props.user?.hexColor!;

  const nameInitial = () => {
    if (props.server) return props.server.name[0].toUpperCase();
    if (props.user) return props.user.username[0].toUpperCase();
  };

  return (
    <div style={{ width: `${props.size}px`, height: `${props.size}px` }}>
      {(() => {
        const url = avatarUrl();
        return url ? (
          <img class={style.avatar} src={url} loading="lazy" alt="Avatar" />
        ) : (
          <div
            style={{ "background-color": hexColor() }}
            class={style.initialAvatar}
          >
            {nameInitial()}
          </div>
        );
      })()}
    </div>
  );
};
