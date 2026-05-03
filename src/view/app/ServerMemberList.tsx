import { createProjection, createSignal, For } from "solid-js";
import { channelStore } from "../../store/channelStore";
import { serverRolesStore } from "../../store/serverRolesStore";
import type { ServerMember, ServerRole } from "../../db";
import { hasBit } from "../../utils/bitwise";
import { ChannelPermissionFlag } from "../../utils/channelPermissionFlag";
import { RolePermissionFlag } from "../../utils/RolePermissionFlag";
import { serverStore } from "../../store/serverStore";
import { userPresenceStore } from "../../store/UserPresenceStore";
import { VirtualList } from "./VirtualList";

type Categorized =
  | { type: "r"; role: ServerRole; count: number; id: string }
  | { type: "m"; member: ServerMember; id: string };

const offlineRole: ServerRole = {
  id: "offline",
  permissions: 0,
  hideRole: true,
  order: 0,
  serverId: "",
};

export const ServerMemberList = () => {
  const [scrollEl, setScrollEl] = createSignal<HTMLElement | null>(null);

  const categorizedMembers = createProjection(
    () => {
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

      const result: Categorized[] = [];

      for (let i = 0; i < sortedRoles.length; i++) {
        const role = sortedRoles[i]!;
        const bucket = buckets[role.id];
        if (bucket) {
          result.push({ type: "r", role, count: bucket.length, id: role.id });
          for (let j = 0; j < bucket.length; j++) {
            result.push({ type: "m", member: bucket[j]!, id: bucket[j]!.id });
          }
        }
      }

      if (offlineMembers.length && offlineRole) {
        result.push({
          type: "r",
          role: offlineRole,
          count: offlineMembers.length,
          id: offlineRole.id,
        });
        for (let i = 0; i < offlineMembers.length; i++) {
          result.push({
            type: "m",
            member: offlineMembers[i]!,
            id: offlineMembers[i]!.id,
          });
        }
      }

      return result;
    },
    [],
    { key: "id" },
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "300px",
        overflow: "auto",
        display: "block",
      }}
    >
      <VirtualList data={categorizedMembers} typeHeights={{ m: 18, r: 18 }}>
        {(item) => {
          switch (item.type) {
            case "r":
              return <ServerRoleListItem role={item.role} count={item.count} />;
            case "m":
              return <ServerMemberListItem member={item.member} />;
          }
        }}
      </VirtualList>
      {/* <For each={categorizedMembers}>
        
      </For> */}
    </div>
  );
};

const ServerRoleListItem = (props: { role: ServerRole; count: number }) => {
  return (
    <div>
      <div>{props.role.name}</div>
      <div>{props.count}</div>
    </div>
  );
};
const ServerMemberListItem = (props: { member: ServerMember }) => {
  return (
    <div>
      <div>{props.member.userId}</div>
    </div>
  );
};
