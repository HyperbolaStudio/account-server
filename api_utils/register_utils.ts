import mysqlName from '../config/mysql_table_name.json';
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
export function insertNewUser(
    username:string,
    passwordSHA256:string,
    nickname:string,
    gender:number,
    birthdateArr?:number[],
):string{
    let d = new Date();
    if(birthdateArr){
        return `insert into ${mysqlName.table.users} (username,passwordSHA256,nickname,gender,birthdate,regtime) values ('${username}','${passwordSHA256}','${nickname}',${gender},'${birthdateArr[0]}-${birthdateArr[1]}-${birthdateArr[2]}','${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}')`
    }
    return `insert into ${mysqlName.table.users} (username,passwordSHA256,nickname,gender,regtime) values ('${username}','${passwordSHA256}','${nickname}',${gender},'${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}')`
}
