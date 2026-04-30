import {  createEffect, createRoot} from "solid-js";
import { db } from "../db";
import { serverStore } from "./serverStore";
import { createDexieArrayQuery } from "../utils/dexie-store";
import { accountStore } from "./accountStore";



export const serverMemberStore = createRoot(createServerMemberStore);


function createServerMemberStore () {
  const [currentServerMembers, updateCurrentServerMembers] = createDexieArrayQuery(() => db.serverMember.where("serverId").equals(serverStore.currentServerId() || "").toArray());
  
  
    createEffect(accountStore.authenticated, (authenticated) => {
      if (!authenticated) return;
      updateCurrentServerMembers();
    })

  



  return { currentServerMembers };

};