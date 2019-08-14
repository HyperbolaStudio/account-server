import hash from 'hash.js';
import { asyncMysqlQuery } from '../lib/mysql_server_init';
import mysqlName from '../config/mysql_table_name.json';
export async function genSessionID(userid:number){
    let sessionID = hash.sha256().update(Date.now().toString()).digest('hex');
    let now = new Date();
    asyncMysqlQuery(`insert into ${mysqlName.table.sessions} (sessionid,userid,last) values ('${sessionID}',${userid},'${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}')`);
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