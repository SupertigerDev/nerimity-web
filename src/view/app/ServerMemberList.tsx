import { createEffect, createMemo, For } from "solid-js";
import { channelStore } from "../../store/channelStore";
import { serverRolesStore } from "../../store/serverRolesStore";
import type { ServerMember, ServerRole } from "../../db";
import { hasBit } from "../../utils/bitwise";
import { ChannelPermissionFlag } from "../../utils/ChannelPermissionFlag";
import { RolePermissionFlag } from "../../utils/RolePermissionFlag";
import { serverStore } from "../../store/serverStore";
import { userPresenceStore } from "../../store/UserPresenceStore";

const offlineRole: ServerRole = {
  id: "offline",
  permissions: 0,
  hideRole: true,
  order: 0,
  serverId: "",
};

export const ServerMemberList = () => {
  const categorizedMembers = createMemo(() => {
    const members = serverStore.currentMembers();
    const channelPermissions = channelStore.currentPermissions();
    const serverRoles = serverRolesStore.currentServerRoles();
    const defaultRole = serverRolesStore.currentServerDefaultRole();
    const server = serverStore.currentServer();
    const creatorId = server?.createdById;

    const sortedRoles = serverRolesStore
      .currentServerSortedRoles()
      .filter((r) => !r.hideRole);

    const roleOrder: Record<string, number> = {};
    for (let i = 0; i < sortedRoles.length; i++) {
      roleOrder[sortedRoles[i]!.id] = i;
    }

    const hasDefaultChannelPerm = hasBit(
      channelPermissions[defaultRole?.id!],
      ChannelPermissionFlag.publicChannel.bit,
    );
    const hasDefaultRolePerm = hasBit(
      defaultRole?.permissions,
      RolePermissionFlag.admin.bit,
    );
    const isDefaultPublic = hasDefaultChannelPerm || hasDefaultRolePerm;

    const buckets: Record<string, ServerMember[]> = {};
    const offlineMembers: ServerMember[] = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i]!;
      const isCreator = member.userId === creatorId;
      let canViewChannel = isCreator || isDefaultPublic;

      let topRoleId: string | null = null;
      let bestIndex = Infinity;

      const roleIds = member.roleIds;
      for (let y = 0; y < roleIds.length; y++) {
        const roleId = roleIds[y]!;

        if (!canViewChannel) {
          const role = serverRoles[roleId];
          canViewChannel =
            hasBit(role?.permissions, RolePermissionFlag.admin.bit) ||
            hasBit(
              channelPermissions[roleId],
              ChannelPermissionFlag.publicChannel.bit,
            );
        }

        const idx = roleOrder[roleId];
        if (idx !== undefined && idx < bestIndex) {
          bestIndex = idx;
          topRoleId = roleId;
        }
      }

      if (!canViewChannel) continue;

      if (!userPresenceStore.presences[member.userId]) {
        offlineMembers.push(member);
        continue;
      }

      const targetRoleId = topRoleId ?? defaultRole?.id;
      if (targetRoleId) {
        (buckets[targetRoleId] ??= []).push(member);
      }
    }

    const result: (
      | { type: "r"; role: ServerRole; count: number }
      | { type: "m"; member: ServerMember }
    )[] = [];

    for (let i = 0; i < sortedRoles.length; i++) {
      const role = sortedRoles[i]!;
      const bucket = buckets[role.id];
      if (bucket) {
        result.push({ type: "r", role, count: bucket.length });
        for (let j = 0; j < bucket.length; j++) {
          result.push({ type: "m", member: bucket[j]! });
        }
      }
    }

    if (offlineMembers.length && offlineRole) {
      result.push({
        type: "r",
        role: offlineRole,
        count: offlineMembers.length,
      });
      for (let i = 0; i < offlineMembers.length; i++) {
        result.push({ type: "m", member: offlineMembers[i]! });
      }
    }

    return result;
  });

  return (
    <div>
      <For each={categorizedMembers()}>
        {(_item) => {
          const item = _item();
          if (item.type === "m") {
            return <div>m</div>;
          } else {
            return (
              <div>
                {item.role.name} - {item.count}
              </div>
            );
          }
        }}
      </For>
    </div>
  );
};
