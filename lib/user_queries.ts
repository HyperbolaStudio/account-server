import { mysqlConnection } from "./server_init";
import { UserInfoDB } from "../account-client/lib/declarations";

export function queryUserViaUsername(username:string):Promise<UserInfoDB|undefined>{
    return new Promise((resolve,reject)=>{
        mysqlConnection.query(`select * from users where username = '${username}'`,(err,res,field)=>{
            if(err)reject(err);
            resolve(res[0]);
        })
    });
}
export function queryUserViaUserID(userID:number):Promise<UserInfoDB|undefined>{
    return new Promise((resolve,reject)=>{
        mysqlConnection.query(`select * from users where userid = ${userID}`,(err,res,field)=>{
            if(err)reject(err);
            if(!res)resolve(undefined);
            resolve(res[0]);
        })
    });
}