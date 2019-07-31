import {RegisterRequest,RegisterResponse} from '../account-client/lib/declarations';
import {user} from '../account-client/lib/regexp';
import {insertNewUser,genderStr2genderNum} from './sql_statements';
import {queryUserViaUsername} from './user_queries'
import { mysqlConnection, server } from './server_init';
type UnValidatedRegisterRequest = {
    [P in keyof RegisterRequest]?:RegisterRequest[P];
}
function mysqlQuery(statement:string):Promise<any>{
    return new Promise((resolve,reject)=>{
        mysqlConnection.query(statement,(err,res,field)=>{
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        })
    })
}
server.route({
    method:'POST',
    path:'/register',
    handler:async (request,h) => {
        let response = {};
        console.log(`notice[new request]: ${request.info.id}`);
        const {payload} = (request as {payload:UnValidatedRegisterRequest});
        if(payload.username && payload.passwordSHA256 && payload.inviteCode){
            if(!(user.username.regexp.test(payload.username))){
                response = {
                    status:'Invalid',
                    userid:-1,
                };
            }
            if(queryUserViaUsername(payload.username)){
                console.log(`notice[err status]: user ${payload.username} already exists`)
                response = {
                    status:'User Already Registered',
                    userid:-1,
                };
            }
            payload.nickname = payload.nickname?payload.nickname:payload.username;
            let genderNum = genderStr2genderNum(payload.gender);
            try{
                let res = await mysqlQuery(insertNewUser(payload.username,payload.passwordSHA256,payload.nickname,genderNum,payload.birthDate));
                console.log(`notice[new user]: ${payload.username}`);
                response = {
                    status:'Success',
                    userid:res.insertId,
                }
            }catch(e){
                console.log(e);
                response = {
                    status:'Unexpected Error',
                    userid:-1,
                };
            }
        }else{
            console.log(`notice[err status]: invalid value by user ${payload.username}`);
            response = {
                status:'Invalid',
                userid:-1,
            };
        }
        return response;
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