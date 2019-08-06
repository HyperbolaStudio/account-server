import {RegisterRequest,RegisterResponse, UnValidated} from '../account-client/lib/declarations';
import {user} from '../account-client/lib/regexp';
import {insertNewUser,genderStr2genderNum} from '../api_utils/register_utils';
import {queryUserViaUsername} from '../api_utils/user_queries'
import { server } from '../lib/server_init';
import mysqlName from '../config/mysql_table_name.json';
import {validate as valValidate} from '../account-client/lib/register';
import {asyncMysqlQuery as mysqlQuery} from '../lib/mysql_server_init';
import { validate, removeCode } from '../api_utils/invitecode_utils';
export async function register(payload:UnValidated<RegisterRequest>):Promise<RegisterResponse>{
    let response:RegisterResponse = {
        status:'Invalid',
        userID:-1,
    };
    try{
        //正则表达式值校验
        if(!valValidate(payload)){
            response = {
                status:'Invalid',
                userID:-1,
            };
            return response;
        }

        //检查用户是否存在
        if(await queryUserViaUsername(payload.username)){
            response = {
                status:'User Already Registered',
                userID:-1,
            };
            return response;
        }
        
        //检查邀请码是否存在
        if(!(await validate(payload.inviteCode,mysqlName.table.registerInviteCode))){
            response = {
                status:'Invalid',
                userID:-1,
            };
            return response;
        }
        removeCode(payload.inviteCode,mysqlName.table.registerInviteCode);

        //数据转换，插入用户
        payload.nickname = payload.nickname?payload.nickname:payload.username;
        let genderNum = genderStr2genderNum(payload.gender);
        let res = await mysqlQuery(insertNewUser(payload.username,payload.passwordSHA256,payload.nickname,genderNum,payload.birthDate));
        response = {
            status:'Success',
            userID:res.insertId,
        }
        
        return response;
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
            userID:-1,
        };
        return response;
    }
}  
server.route({
    method:'POST',
    path:'/api/register',
    handler:async (request,h) => {
        const {payload} = (request as {payload:UnValidated<RegisterRequest>});
        return (await register(payload));
    }
});

//TODO: This is a test page
server.route({
    method:'GET',
    path:'/register',
    handler:(request,h)=>{
        return h.file('./account-client/test/testpage.html');
    }
})
console.log('notice[server]: Register Service Started.')
// process.on('SIGINT',()=>{
//     stop();
// })