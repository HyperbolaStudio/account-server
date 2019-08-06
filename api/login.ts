import {LoginRequest,LoginResponse, UnValidatedLoginRequest} from '../account-client/lib/declarations';
//import {user} from '../account-client/lib/regexp';
//import {insertNewUser,genderStr2genderNum} from './sql_statements';
import {queryUserViaUsername, queryUserViaUserID} from './user_queries'
import { server } from '../lib/server_init';
//import {asyncMysqlQuery as mysqlQuery} from './mysql_server_init';
import { validate as loginValidate } from '../account-client/lib/login';
import { genSessionID } from './session_utils';

export async function login(payload:UnValidatedLoginRequest):Promise<LoginResponse>{
    let response:LoginResponse = {
        status:'Invalid',
        sessionID:'',
    }
    try{
        //数据校验
        if(!loginValidate({
            loginName:payload.loginName,
            loginType:payload.loginType,
            passwordSHA256:payload.passwordSHA256,
        })){
            response = {
                status:'Invalid',
                sessionID:'',
            }
            return response;
        }

        //获取用户信息行
        let user;
        switch(payload.loginType){
            case 1://username
                user = await queryUserViaUsername(payload.loginName as string);
                break;
            case 2://userID
                user = await queryUserViaUserID(payload.loginName as number);
                break;
            default:
                response = {
                    status:'Invalid',
                    sessionID:'',
                };
                return response;
        }
        //检查用户是否存在
        if(!user){
            response = {
                status:'User Not Found',
                sessionID:'',
            }
            return response;
        }

        //登录成功
        if(user.passwordSHA256 == payload.passwordSHA256){
            response = {
                status:'Success',
                sessionID:await genSessionID(user.userid),
            }
            console.log(`notice[user login]: ${user.username} logged in.`)
            return response;
        }else{
            response = {
                status:'Failed',
                sessionID:'',
            }
            return response;
        }
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
            sessionID:'',
        }
    }
    return response;
}
server.state('session',{
    ttl:365*24*60*60*1000,
    isHttpOnly:false,
    isSecure:false,
    // domain:'localhost',
    path:'/',
    encoding:'base64json',
});
server.route({
    method:'POST',
    path:'/api/login',
    handler:async (request,h)=>{
        let response = await login(request.payload as UnValidatedLoginRequest);
        h.state('session',{
            sessionID:response.sessionID,
            last:Date.now(),
        });
        return response;
    }
})
console.log('notice[server]: Login Service Started.');