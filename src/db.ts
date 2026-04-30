
export interface ServerMember {
  id: string;
  serverId: string;
}

// interface ServerRole {
//   id: string;
//   serverId: string;
// }

export const ChannelType = {
  DM_TEXT: 0,
  SERVER_TEXT: 1,
  CATEGORY: 2,
} as const;

type ChannelType = (typeof ChannelType)[keyof typeof ChannelType];
export interface Channel {
  id: string;
  serverId?: string;
  name?: string;
  type: ChannelType;
  icon?: string;
  categoryId?: string;
  order?: number;
}

export interface Server {
  id: string;
  name: string;
  defaultChannelId: string;
}
export interface User {
  id: string;
  username: string;
}

// interface CustomEmoji {
//   id: string;
// }

