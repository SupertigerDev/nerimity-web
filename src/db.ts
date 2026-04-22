import { Dexie } from 'dexie';

interface ServerMember {
    id: string;
    serverId: string;
}

interface ServerRole {
    id: string;
    serverId: string;

}
interface Channel {
    id: string;
    serverId?: string;
}


class Database extends Dexie {
    serverMember: Dexie.Table<ServerMember, string>;
    serverRole: Dexie.Table<ServerRole, string>;
    channel: Dexie.Table<Channel, string>;

    constructor () {
        super("nerimity-db");
        this.version(1).stores({
            serverMembers: 'id, serverId',
            serverRoles: 'id, serverId',
            channels: 'id, serverId'
        });
        this.serverMember = this.table('serverMembers'); 
        this.serverRole = this.table("serverRoles");
        this.channel = this.table("channels");

        this.on("versionchange", () => {
            location.reload();
        })

    }
}



export const db = new Database();
