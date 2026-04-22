import { Dexie } from "dexie";

interface ServerMember {
  id: string;
  serverId: string;
}

interface ServerRole {
  id: string;
  serverId: string;
}
export interface Channel {
  id: string;
  serverId?: string;
  name?: string;
}

export interface Server {
  id: string;
  name: string;
  defaultChannelId: string;
}
interface User {
  id: string;
  username: string;
}

interface CustomEmoji {
  id: string;
}

class Database extends Dexie {
  user: Dexie.Table<User, string>;
  serverMember: Dexie.Table<ServerMember, string>;
  serverRole: Dexie.Table<ServerRole, string>;
  channel: Dexie.Table<Channel, string>;
  server: Dexie.Table<Server, string>;
  customEmoji: Dexie.Table<CustomEmoji, string>;

  constructor() {
    super("nerimity-db");
    this.version(1).stores({
      serverMembers: "id, serverId",
      serverRoles: "id, serverId",
      channels: "id, serverId",
      servers: "id",
      users: "id",
      customEmojis: "id",
    });
    this.serverMember = this.table("serverMembers");
    this.serverRole = this.table("serverRoles");
    this.channel = this.table("channels");
    this.server = this.table("servers");
    this.user = this.table("users");
    this.customEmoji = this.table("customEmojis");

    this.on("versionchange", () => {
      location.reload();
    });
  }
}

export const db = new Database();
