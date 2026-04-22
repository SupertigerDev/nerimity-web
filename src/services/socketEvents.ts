import { db } from "../db";

export const socketEventHandler = (event: string, payload: any) => {
    if (event === "user:authenticated") {
        handleAuthenticated(payload)
    }
}


const handleAuthenticated = (payload: any) => {
    console.log("handleAuthenticated");


    const tables = [db.serverMember, db.serverRole, db.channel];

    db.transaction('rw', tables, async () => {   
        db.serverMember.clear();
        db.serverMember.bulkAdd(payload.serverMembers);

        db.serverRole.clear();
        db.serverRole.bulkAdd(payload.serverRoles);

        db.channel.clear();
        db.channel.bulkAdd(payload.channels);
    })

    
    

}