import hash from 'hash.js';
import { asyncMysqlQuery } from './mysql_server_init';
export async function genSessionID(userid:number){
    let sessionID = hash.sha256().update(Date.now().toString()).digest('hex');
    asyncMysqlQuery(`insert into sessionMap (sessionid,userid) values ('${sessionID}',${userid})`);
    return sessionID;
}