import mysqlName from '../config/mysql_table_name.json';
import { UserCoreInfUpdateRequest, UserInfoDB } from '../account-client/lib/declarations.js';
import { queryUserViaUsername, queryUserViaUserID } from './user_queries.js';
import { dateObj2timeStr, dateArr2dateStr } from '../lib/mysql_server_init.js';
export function genderStr2genderNum(genderStr:string|undefined):number{
    switch (genderStr){
        case undefined:
            return 1;
        case 'male':
            return 2;
        case 'female':
            return 3;
        default:
            return 0;
    }
}
export function genderNum2genderStr(genderNum:number):string{
    switch (genderNum){
        case 2:
            return `male`;
        case 3:
            return `female`;
        case 1:
            return `unknown`;
        default:
            return `other`;
    }
}
export function insertNewUserStatement(
    username:string,
    passwordSHA256:string,
    nickname:string,
    gender:number,
    birthdateArr?:[number,number,number],
):string{
    let d = new Date();
    if(birthdateArr){
        return `insert into ${mysqlName.table.users} (username,passwordSHA256,nickname,gender,birthdate,regtime) values ('${username}','${passwordSHA256}','${nickname}',${gender},${dateArr2dateStr(birthdateArr)},'${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}')`
    }
    return `insert into ${mysqlName.table.users} (username,passwordSHA256,nickname,gender,regtime) values ('${username}','${passwordSHA256}','${nickname}',${gender},${dateObj2timeStr(d)})`
}
export async function updateUserCoreInf(userID:number,req:UserCoreInfUpdateRequest):Promise<boolean>{
    const coreinfColList:{
        [P in keyof UserCoreInfUpdateRequest]:string;
    } = {
        username:'username',
        passwordSHA256:'passwordSHA256',
        nickname:'nickname',
        birthdate:'birthdate',
        gender:'gender',
    }
    const preprocess:{
        [P in keyof UserCoreInfUpdateRequest]:(val:any)=>string;
    } = {
        username:(val:string)=>{
            return `'${val}'`;
        },
        passwordSHA256:(val:string)=>{
            return `'${val}'`;
        },


    }
    let t:UserInfoDB|undefined;
    if(req.username){
        t = await queryUserViaUsername(req.username)
        if(t){
            return false
        }
    }
    if(req.passwordSHA256){
        if(req.originPswSHA256){
            t = await queryUserViaUserID(userID);
            if(!t)return false;
            if(req.originPswSHA256!=t.passwordSHA256){
                return false;
            }
        }else return false
    }
    let items:Array<string> = [];
    let values:Array<string> = [];
    for(let x in coreinfColList){
        if((req as any)[x]){
            items.push((coreinfColList as any)[x]);
        }
    }
    let itemsStr = items.join(',');
    return true
}
