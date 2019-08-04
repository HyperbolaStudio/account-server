import { asyncMysqlQuery } from "./mysql_server_init";
import hash from 'hash.js'

export async function gen(amount = 1,category:string){
    let arr:string[] = [];
    for(let i = 0;i<amount;i++){
        let code = hash.sha256().update(Math.random().toString()).digest('hex').slice(0,16);
        arr.push(code);
        await asyncMysqlQuery(`insert into ${category} (code) values ('${code}')`);
    }
    return arr;
}
export async function show(category:string){
    let arr:string[] = [];
    for(let x of (await asyncMysqlQuery(`select code from ${category}`))){
        arr.push(x.code);
    }
    return arr;
}

export function validate(invitecode:string,category:string):Promise<boolean>{
    return new Promise((resolve,reject)=>{
        asyncMysqlQuery(`select code from ${category} where code = '${invitecode}'`)
            .then((res)=>{
                if(res[0]){
                    resolve(true);
                }else{
                    resolve(false);
                }
            })
            .catch((err)=>{
                reject(err);
            })
    })
    //return ;
}

export function removeCode(invitecode:string,category:string){
    asyncMysqlQuery(`delete from ${category} where code = '${invitecode}'`);
}