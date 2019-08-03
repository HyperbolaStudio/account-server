import { asyncMysqlQuery } from "./mysql_server_init";

export async function addFollow(followedBy:number,followTarget:number){
    let res = await asyncMysqlQuery(`select * from followMap where followedBy = ${followedBy} and followTarget = ${followTarget}`);
    if(!res[0]){
        await asyncMysqlQuery(`insert into followMap (followedBy,followTarget) values (${followedBy},${followTarget})`);
    } 
}
export async function removeFollow(followedBy:number,followTarget:number){
    await asyncMysqlQuery(`delete from followMap where followedBy = ${followedBy} and followTarget = ${followTarget}`);
}