import {RegisterRequest,RegisterResponse} from '../account-client/lib/declarations';
import {user} from '../account-client/lib/regexp';
import {insertNewUser,genderStr2genderNum} from './sql_statements';
import {queryUserViaUsername} from './user_queries'
import { server } from './server_init';
type UnValidatedRegisterRequest = {
    [P in keyof RegisterRequest]?:RegisterRequest[P];
}
import {asyncMysqlQuery as mysqlQuery} from './mysql_server_init';
import { validate, removeCode } from './invitecode_utils';
async function register(payload:UnValidatedRegisterRequest):Promise<RegisterResponse>{
    let response:RegisterResponse = {
        status:'Invalid',
        userID:-1,
    };
    try{
        if(payload.username && payload.passwordSHA256 && payload.inviteCode){
            payload.nickname = payload.nickname?payload.nickname:payload.username;
            if(!(user.username.regexp.test(payload.username)) || !(user.passwordSHA256.regexp.test(payload.passwordSHA256)) || !(user.nickname.regexp.test(payload.nickname)) || !(user.inviteCode.regexp.test(payload.inviteCode))){
                console.log(`notice[err status]: user ${payload.username}'s request is invalid (RegExp)`);
                response = {
                    status:'Invalid',
                    userID:-1,
                };
                return response;
            }
            if(!(await validate(payload.inviteCode,'invitecode'))){
                console.log(`notice[err status]: user ${payload.username} wants to register, but the user's invite code is invalid`);
                response = {
                    status:'Invalid',
                    userID:-1,
                };
                return response;
            }
            removeCode(payload.inviteCode,'invitecode');
            if(await queryUserViaUsername(payload.username)){
                console.log(`notice[err status]: user ${payload.username} already exists`)
                response = {
                    status:'User Already Registered',
                    userID:-1,
                };
                return response;
            }
            let genderNum = genderStr2genderNum(payload.gender);
            let res = await mysqlQuery(insertNewUser(payload.username,payload.passwordSHA256,payload.nickname,genderNum,payload.birthDate));
            console.log(`notice[new user]: ${payload.username}`);
            response = {
                status:'Success',
                userID:res.insertId,
            }
        }else{
            console.log(`notice[err status]: invalid value by user ${payload.username}`);
            response = {
                status:'Invalid',
                userID:-1,
            };
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
    path:'/register',
    handler:async (request,h) => {
        console.log(`notice[new request]: ${request.info.id}`);
        const {payload} = (request as {payload:UnValidatedRegisterRequest});
        return (await register(payload));
    }
});
server.route({
    method:'GET',
    path:'/register',
    handler:(request,h)=>{
        return h.file('./account-client/test/testpage.html');
    }
})
// process.on('SIGINT',()=>{
//     stop();
// })