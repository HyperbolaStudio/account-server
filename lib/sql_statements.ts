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
    birthdate?:Date,
):string{
    if(birthdate){
        let date = birthdate.getDate().toString();
        if(date.length == 1){
            date = `0${date}`;
        }
        return `insert into users (username,passwordSHA256,nickname,gender,birthdate) values ('${username}','${passwordSHA256}','${nickname}',${gender},to_date('${birthdate.getFullYear}-${birthdate.getMonth}-${date}','YYYY-MM-DD'))`
    }
    return `insert into users (username,passwordSHA256,nickname,gender) values ('${username}','${passwordSHA256}','${nickname}',${gender})`
}
