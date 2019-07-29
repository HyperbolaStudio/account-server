export function genderStr2genderNum(genderStr:string|undefined):number{
    switch (genderStr){
        case 'male':
            return 1;
        case 'female':
            return 2;
        case 'other':
            return 3;
        default:
            return 0;
    }
}
export function insertNewUser(
    username:string,
    passwordSHA256:string,
    nickname:string,
    gender:number,
    birthdateArr?:number[],
):string{
    if(birthdateArr){
        return `insert into users (username,passwordSHA256,nickname,gender,birthdate) values ('${username}','${passwordSHA256}','${nickname}',${gender},'${birthdateArr[0]}-${birthdateArr[1]}-${birthdateArr[2]}')`
    }
    return `insert into users (username,passwordSHA256,nickname,gender) values ('${username}','${passwordSHA256}','${nickname}',${gender})`
}
