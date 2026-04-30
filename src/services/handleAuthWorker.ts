import { db } from "../db";

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "AUTH_SUCCESS") {
    handleAuthenticated(payload);
  }
};

const handleAuthenticated = async (payload: any) => {
  const tables = [
    db.serverMember,
    db.customEmoji,
    db.serverRole,
    db.channel,
    db.server,
    db.user,
  ];

  try {
    await db.transaction("rw", tables, async () => {
      let users = new Map<string, any>();
      let customEmojis: any[] = [];

      await db.serverMember.clear();
      await db.serverMember.bulkAdd(
        payload.serverMembers.map((m: any) => {
          if (m.user) users.set(m.user.id, m.user);
          return { ...m, user: undefined };
        }),
      );

      await db.serverRole.clear();
      await db.serverRole.bulkAdd(payload.serverRoles);

      await db.channel.clear();
      await db.channel.bulkAdd(payload.channels);

      await db.server.clear();
      await db.server.bulkAdd(
        payload.servers.map((s: any) => {
          if (s.customEmojis) customEmojis.push(...s.customEmojis);
          return { ...s, customEmojis: undefined };
        }),
      );

      await db.user.clear();
      await db.user.bulkAdd([...users.values()]);

      await db.customEmoji.clear();
      await db.customEmoji.bulkAdd(customEmojis);
    });

    self.postMessage({ status: "success" });
  } catch (error) {
    self.postMessage({ status: "error", error });
  }
};