import { queryUserViaUserID, queryUserViaUsername } from "../api_utils/user_queries";
async function t(){
    let r = await queryUserViaUserID(40)
    if(r){
        console.log(r.userid,r.username,r.passwordSHA256,r.nickname,r.gender,r.birthdate,r.regtime);
    }else{
        console.log('wa');
    }
    r = await queryUserViaUsername('123')
    if(r){
        console.log(r.userid,r.username,r.passwordSHA256,r.nickname,r.gender,r.birthdate,r.regtime);
    }else{
        console.log('wa');
    }
}
t();
