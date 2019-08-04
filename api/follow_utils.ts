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
export async function queryFollowing(user:number,offset:number = 0,amount:number = 100){
    let resOrigin = await asyncMysqlQuery(`select followTarget from ${mysqlName.table.followMap} where followedBy = ${user} limit ${offset},${amount}`);
    //console.log(resOrigin);
    let res:number[] = [];
    for(let i = 0;i<resOrigin.length;i++){
        res[i] = resOrigin[i].followTarget;
    }
    return res;
}
export async function queryFollowed(user:number,offset:number = 0,amount:number = 100){
    let resOrigin = await asyncMysqlQuery(`select followedBy from ${mysqlName.table.followMap} where followedTarget = ${user} limit ${offset},${amount}`);
    //console.log(resOrigin);
    let res:number[] = [];
    for(let i = 0;i<resOrigin.length;i++){
        res[i] = resOrigin[i].followTarget;
    }
    return res;
}
export async function queryFollowingAmount(user:number){
    let res = await asyncMysqlQuery(`select count(*) from ${mysqlName.table.followMap} where followedBy = ${user}`);
    return res['count(*)'] as number;
}
export async function queryFollowedAmount(user:number){
    let res = await asyncMysqlQuery(`select count(*) from ${mysqlName.table.followMap} where followTarget = ${user}`);
    return res['count(*)'] as number;
}