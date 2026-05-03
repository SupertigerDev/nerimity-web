import {
  createLoadingBoundary,
  createMemo,
  createProjection,
  createSignal,
  For,
} from "solid-js";
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
  name: "Offline",
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

      // Pre-snapshot presences as a plain Set to avoid reactive proxy
      // re-subscriptions on every member lookup inside the loop
      const presenceSet = new Set(Object.keys(userPresenceStore.presences));

      // Pre-build a Set of role IDs that grant channel visibility so the
      // inner loop is a single O(1) has() call instead of two hasBit() calls
      const visibleRoleIds = new Set<string>();
      for (const roleId of Object.keys(channelPermissions)) {
        if (
          hasBit(
            channelPermissions[roleId],
            ChannelPermissionFlag.publicChannel.bit,
          )
        ) {
          visibleRoleIds.add(roleId);
        }
      }
      for (const roleId of Object.keys(serverRoles)) {
        if (
          hasBit(serverRoles[roleId]?.permissions, RolePermissionFlag.admin.bit)
        ) {
          visibleRoleIds.add(roleId);
        }
      }

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

          if (!canViewChannel && visibleRoleIds.has(roleId)) {
            canViewChannel = true;
          }

          const idx = roleOrder[roleId];
          if (idx !== undefined && idx < bestIndex) {
            bestIndex = idx;
            topRoleId = roleId;
          }

          // Short-circuit once we have visibility confirmed and the best
          // possible role rank (0 = highest priority in sorted list)
          if (canViewChannel && bestIndex === 0) break;
        }

        if (!canViewChannel) continue;

        if (!presenceSet.has(member.userId)) {
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
      <VirtualList data={categorizedMembers} typeHeights={{ m: 60, r: 20 }}>
        {(item) => {
          switch (item.type) {
            case "r":
              return <ServerRoleListItem role={item.role} count={item.count} />;
            case "m":
              return <ServerMemberListItem member={item.member} />;
          }
        }}
      </VirtualList>
    </div>
  );
};

const ServerRoleListItem = (props: { role: ServerRole; count: number }) => {
  return (
    <div>
      {props.role.name} -{props.count}
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
