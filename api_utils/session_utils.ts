import hash from 'hash.js';
import { asyncMysqlQuery } from '../lib/mysql_server_init';
import mysqlName from '../config/mysql_table_name.json';
export async function genSessionID(userid:number){
    let sessionID = hash.sha256().update(Date.now().toString()).digest('hex');
    asyncMysqlQuery(`insert into ${mysqlName.table.sessions} (sessionid,userid) values ('${sessionID}',${userid})`);
    return sessionID;
}
export async function querySession(sessionID:string):Promise<number|null>{
    let res = await asyncMysqlQuery(`select userid from ${mysqlName.table.sessions} where sessionid = '${sessionID}'`);
    if(res && res[0] && res[0].userid){
        return res[0].userid;
    }else{
        return null
    }
}