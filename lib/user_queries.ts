import { mysqlConnection } from "./server_init";

export function queryUserViaUsername(username:string):Promise<object|undefined>{
    return new Promise((resolve,reject)=>{
        mysqlConnection.query(`select * from users where username = '${username}'`,(err,res,field)=>{
            if(err)reject(err);
            resolve(res[0]);
        })
    });
}