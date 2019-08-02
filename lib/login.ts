import {LoginRequest,LoginResponse} from '../account-client/lib/declarations';
import {user} from '../account-client/lib/regexp';
import {insertNewUser,genderStr2genderNum} from './sql_statements';
import {queryUserViaUsername, queryUserViaUserID} from './user_queries'
import { server } from './server_init';
import {asyncMysqlQuery as mysqlQuery} from './mysql_server_init';
import { validate } from '../account-client/lib/login';
type UnValidatedLoginRequest = {
    [P in keyof LoginRequest]?:LoginRequest[P];
}
export async function login(payload:UnValidatedLoginRequest):Promise<LoginResponse>{
    let response:LoginResponse = {
        status:'Invalid',
        sessionID:'',
    }
    try{
        //检查request键是否齐全
        if(payload.loginName && payload.loginType && payload.passwordSHA256){
            //数据校验
            if(!validate({
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
                case 0://username
                    user = await queryUserViaUsername(payload.loginName);
                    break;
                case 1://userID
                    user = await queryUserViaUserID(payload.loginName);
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

            if(user.passwordSHA256 == payload.passwordSHA256){
                response = {
                    status:'Success',
                    sessionID:'',
                }
            }else{
                response = {
                    status:'Failed',
                    sessionID:'',
                }
                return response;
            }

        }else{
            response = {
                status:'Invalid',
                sessionID:'',
            }
            return response;
        }
    }catch(e){
        response = {
            status:'Unexpected Error',
            sessionID:'',
        }
    }
    return response;
}