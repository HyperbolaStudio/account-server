import {LoginRequest,LoginResponse, UnValidated, QueryUserCol} from '../account-client/lib/declarations';
import {queryUserViaUsername, queryUserViaUserID} from '../api_utils/user_queries'
import { server } from '../lib/server_init';
import { validate as loginValidate } from '../account-client/lib/login';
import { genSessionID } from '../api_utils/session_utils';
import {ResponseToolkit,ResponseValue} from '@hapi/hapi';
import { responser } from '../api_utils/responser';

export async function login(payload:UnValidated<LoginRequest>,h?:ResponseToolkit):Promise<[ResponseValue,string?]>{
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
            return [responser(response,h,400)];
        }

        //获取用户信息行
        let user;
        switch(payload.loginType){
            case QueryUserCol.USERNAME://username
                user = await queryUserViaUsername(payload.loginName as string);
                break;
            case QueryUserCol.USERID://userID
                user = await queryUserViaUserID(payload.loginName as number);
                break;
            default:
                response = {
                    status:'Invalid',
                    sessionID:'',
                };
                return [responser(response,h,400)];
        }
        //检查用户是否存在
        if(!user){
            response = {
                status:'User Not Found',
                sessionID:'',
            }
            return [responser(response,h,400)];
        }

        //登录成功
        if(user.passwordSHA256 == payload.passwordSHA256){
            response = {
                status:'Success',
                sessionID:await genSessionID(user.userid),
            }
            // console.log(`notice[user login]: ${user.username} logged in.`)
            return [responser(response,h,200),response.sessionID];
        }else{
            response = {
                status:'Failed',
                sessionID:'',
            }
            return [responser(response,h,403)];
        }
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
            sessionID:'',
        }
    }
    return [responser(response,h,500)];
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
        let response = await login(request.payload as UnValidated<LoginRequest>,h);
        if(response[1]){
            h.state('session',{
                sessionID:response[1],
                last:Date.now(),
            });
        }
        return response[0];
    }
})
console.log('notice[server]: Login Service Started.');