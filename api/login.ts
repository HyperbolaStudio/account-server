import {LoginRequest,LoginResponse, UnValidated, LOGIN_REQUEST_LOGIN_TYPE_USERNAME, LOGIN_REQUEST_LOGIN_TYPE_USERID} from '../account-client/lib/declarations';
import {queryUserViaUsername, queryUserViaUserID} from '../api_utils/user_queries'
import { server } from '../lib/server_init';
import { validate as loginValidate } from '../account-client/lib/login';
import { genSessionID } from '../api_utils/session_utils';

export async function login(payload:UnValidated<LoginRequest>):Promise<LoginResponse>{
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
            case LOGIN_REQUEST_LOGIN_TYPE_USERNAME://username
                user = await queryUserViaUsername(payload.loginName as string);
                break;
            case LOGIN_REQUEST_LOGIN_TYPE_USERID://userID
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
        let response = await login(request.payload as UnValidated<LoginRequest>);
        h.state('session',{
            sessionID:response.sessionID,
            last:Date.now(),
        });
        return response;
    }
})
console.log('notice[server]: Login Service Started.');