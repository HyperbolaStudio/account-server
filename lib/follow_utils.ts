import { asyncMysqlQuery } from "./mysql_server_init";
import mysqlName from '../config/mysql_table_name.json';

export async function addFollow(followedBy:number,followTarget:number){
    let res = await asyncMysqlQuery(`select * from ${mysqlName.table.followMap} where followedBy = ${followedBy} and followTarget = ${followTarget}`);
    if(!res[0]){
        await asyncMysqlQuery(`insert into ${mysqlName.table.followMap} (followedBy,followTarget) values (${followedBy},${followTarget})`);
    } 
}
export async function removeFollow(followedBy:number,followTarget:number){
    await asyncMysqlQuery(`delete from ${mysqlName.table.followMap} where followedBy = ${followedBy} and followTarget = ${followTarget}`);
}
export async function queryFollowing(user:number){
    let resOrigin = await asyncMysqlQuery(`select followTarget from ${mysqlName.table.followMap} where followedBy = ${user}`);
    let res:number[] = [];
    for(let i = 0;i<res.length;i++){
        res[i] = resOrigin[i].followTarget;
    }
    return res;
}